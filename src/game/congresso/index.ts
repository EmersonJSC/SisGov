/**
 * Congresso (V1-11, docs/v1/desenho/congresso.md): as bancadas saem dos
 * perfis do eleitorado (camada 1), votam pela base que as elegeu (camada 2,
 * usada no V1-12) e trocam cadeiras durante o mandato (camada 3).
 */
import type { ResolvedPackage } from "../../engine";
import dadosDaBussola from "../../conteudo/bussola/congresso.json";
import { referenciasDaBussola, type PontoDaBussola } from "../bussola";
import { pressureGroups } from "../pressao";
import {
  danoDasLeis,
  dhondt,
  disposicao,
  eleger,
  frente,
  maioresRestos,
  misturar,
  passoDaInfluencia,
  pontoDoPerfil,
  satisfacaoDoPerfil,
  segmentosDoEleitor,
  type Candidato,
  type Eleicao,
} from "./calculo";
import {
  JOGADOR,
  type Bancada,
  type Cadeiras,
  type CongressoDaBussola,
  type EstadoDoCongresso,
  type PerfilDoEleitor,
  type RegrasDoCongresso,
  type TrocaDeCadeiras,
} from "./tipos";

export * from "./tipos";
export * from "./calculo";

export const congressoDaBussola =
  dadosDaBussola as unknown as CongressoDaBussola;

/** As bancadas com o ponto: a média dos partidos de referência. */
export function bancadas(
  dados: CongressoDaBussola = congressoDaBussola,
): readonly Bancada[] {
  const partidos = new Map(referenciasDaBussola.partidos.map((p) => [p.id, p]));
  return dados.bancadas.map((b) => {
    const refs = b.referencias.map((id) => {
      const p = partidos.get(id);
      if (!p) throw new Error(`Bancada ${b.id}: referência ${id} não existe.`);
      return p;
    });
    const media = (eixo: "economia" | "costumes") =>
      refs.reduce((s, p) => s + p[eixo], 0) / refs.length;
    return {
      id: b.id,
      nome: b.nome,
      ponto: { economia: media("economia"), costumes: media("costumes") },
    };
  });
}

export type CongressoDoPacote = Readonly<{
  regras: RegrasDoCongresso;
  casas: readonly Readonly<{ id: string; nome: string; cadeiras: number }>[];
  perfis: readonly PerfilDoEleitor[];
  pesoDoSegmento: Readonly<Record<string, number>>;
  bancadas: readonly Bancada[];
}>;

const cache = new WeakMap<ResolvedPackage, CongressoDoPacote | null>();

/** O Congresso do pacote, com os perfis já com ponto. Sem Congresso: undefined. */
export function congressoDoPacote(
  content: ResolvedPackage,
): CongressoDoPacote | undefined {
  const guardado = cache.get(content);
  if (guardado !== undefined) return guardado ?? undefined;
  const m = content.manifest.congresso;
  if (!m) {
    cache.set(content, null);
    return undefined;
  }
  const regras = m.regras as unknown as RegrasDoCongresso;
  const perfis = m.perfis.map((linha) => {
    const atributos: Record<string, string> = {};
    m.atributos.forEach((a, i) => {
      atributos[a] = m.valores[a]?.[linha[i + 1]] ?? "";
    });
    const segmentos = Object.entries(atributos)
      .map(([a, v]) => m.segmentoDe[`${a}=${v}`])
      .filter((s): s is string => s !== undefined);
    return {
      peso: linha[0],
      atributos,
      segmentos,
      ponto: pontoDoPerfil(regras, atributos),
    };
  });
  const pacote: CongressoDoPacote = {
    regras,
    casas: m.casas,
    perfis,
    pesoDoSegmento: m.pesoDoSegmento,
    bancadas: bancadas(),
  };
  cache.set(content, pacote);
  return pacote;
}

const candidatosDas = (lista: readonly Bancada[]): Candidato[] =>
  lista.map((b) => ({ id: b.id, ponto: b.ponto }));

/** Camada 1 sem o partido do jogador: a eleição que serve de prova. */
export function eleicaoDasBancadas(pacote: CongressoDoPacote): Eleicao {
  return eleger(
    pacote.perfis,
    candidatosDas(pacote.bancadas),
    pacote.regras.sensibilidade,
  );
}

/**
 * Camada 1 com o partido do jogador no ponto dele: o perfil soma o bônus do
 * governo, que cresce com a satisfação dele.
 */
export function eleicaoComJogador(
  pacote: CongressoDoPacote,
  pontoDoJogador: PontoDaBussola,
  valores: Readonly<Record<string, number>>,
): Eleicao {
  const { bonusDoGoverno, partidoNovo } = pacote.regras.partidoDoJogador;
  const satisfacao = pacote.perfis.map((p) =>
    satisfacaoDoPerfil(p, pacote.pesoDoSegmento, valores),
  );
  return eleger(
    pacote.perfis,
    [
      ...candidatosDas(pacote.bancadas),
      {
        id: JOGADOR,
        ponto: pontoDoJogador,
        bonus: (i) =>
          (bonusDoGoverno * (satisfacao[i] - 50)) / 50 - partidoNovo,
      },
    ],
    pacote.regras.sensibilidade,
  );
}

/** Estado do turno 0: a eleição das bancadas e o partido do jogador pequeno. */
export function criarCongresso(
  content: ResolvedPackage,
): EstadoDoCongresso | undefined {
  const pacote = congressoDoPacote(content);
  if (!pacote) return undefined;
  const eleicao = eleicaoDasBancadas(pacote);
  const { fatiaInicial } = pacote.regras.partidoDoJogador;
  const casas: Record<string, Cadeiras> = {};
  for (const casa of pacote.casas) {
    const eleitas = dhondt(eleicao.fatias, casa.cadeiras);

    const doJogador = Math.round(fatiaInicial * casa.cadeiras);
    // o partido do jogador sai de todas as bancadas, na proporção delas
    const ficam = maioresRestos(eleitas, casa.cadeiras - doJogador);
    casas[casa.id] = { ...ficam, [JOGADOR]: doJogador };
  }
  const grupos = pressureGroups(content)?.grupos ?? [];
  return {
    casas,
    exatas: casas,
    influencia: Object.fromEntries(grupos.map((g) => [g.id, 1])),
    trocas: [],
  };
}

/** Controles de lei do pacote (para saber quais causas são leis). */
const controles = new WeakMap<ResolvedPackage, ReadonlySet<string>>();
function controlesDeLei(content: ResolvedPackage): ReadonlySet<string> {
  const guardado = controles.get(content);
  if (guardado) return guardado;
  const set = new Set(content.policies.map((p) => p.controle.variavel));
  controles.set(content, set);
  return set;
}

/**
 * Fim do turno: a influência dos grupos anda com o dano das leis; uma vez por
 * ano, parte das cadeiras vai para a eleição de agora (troca-troca).
 */
export function passarTurnoNoCongresso(input: {
  content: ResolvedPackage;
  estado: EstadoDoCongresso;
  valores: Readonly<Record<string, number>>;
  pontoDoJogador: PontoDaBussola;
  turno: number;
}): EstadoDoCongresso {
  const { content, estado, valores, pontoDoJogador, turno } = input;
  const pacote = congressoDoPacote(content);
  if (!pacote) return estado;
  const leis = controlesDeLei(content);
  const influencia: Record<string, number> = { ...estado.influencia };
  for (const g of pressureGroups(content)?.grupos ?? [])
    influencia[g.id] = passoDaInfluencia(
      pacote.regras,
      estado.influencia[g.id] ?? 1,
      danoDasLeis(g.causas, leis, valores),
    );
  const { taxaPorAno, turnosPorAno } = pacote.regras.trocaTroca;
  if (turno <= 0 || turno % turnosPorAno !== 0)
    return { ...estado, influencia };
  const agora = eleicaoComJogador(pacote, pontoDoJogador, valores);
  const casas: Record<string, Cadeiras> = {};
  const exatas: Record<string, Readonly<Record<string, number>>> = {};
  const trocas: TrocaDeCadeiras[] = [];
  for (const casa of pacote.casas) {
    const atual = estado.casas[casa.id] ?? {};
    const alvo = dhondt(agora.fatias, casa.cadeiras);
    exatas[casa.id] = misturar(
      estado.exatas[casa.id] ?? atual,
      alvo,
      taxaPorAno,
    );
    const nova = maioresRestos(exatas[casa.id], casa.cadeiras);
    casas[casa.id] = nova;
    const saldo = Object.fromEntries(
      Object.keys(nova)
        .map((id) => [id, nova[id] - (atual[id] ?? 0)] as const)
        .filter(([, d]) => d !== 0),
    );
    if (Object.keys(saldo).length > 0)
      trocas.push({ turno, casa: casa.id, saldo });
  }
  return { casas, exatas, influencia, trocas: [...estado.trocas, ...trocas] };
}

export type RetratoDaBancada = Readonly<{
  id: string;
  nome: string;
  ponto: PontoDaBussola;
  cadeiras: Readonly<Record<string, number>>;
  disposicao: number;
  /** Parte do eleitor dela em cada segmento. */
  eleitor: Readonly<Record<string, number>>;
  /** Tamanho de cada frente na bancada (0 a 1). */
  frentes: Readonly<Record<string, number>>;
}>;

/** Retrato de cada bancada agora (para o V1-12 e o relatório). */
export function retratoDoCongresso(input: {
  content: ResolvedPackage;
  estado: EstadoDoCongresso;
  valores: Readonly<Record<string, number>>;
  pontoDoJogador: PontoDaBussola;
}): readonly RetratoDaBancada[] {
  const { content, estado, valores, pontoDoJogador } = input;
  const pacote = congressoDoPacote(content);
  if (!pacote) return [];
  const eleicao = eleicaoComJogador(pacote, pontoDoJogador, valores);
  const satisfacao = pacote.perfis.map((p) =>
    satisfacaoDoPerfil(p, pacote.pesoDoSegmento, valores),
  );
  const grupos = pressureGroups(content)?.grupos ?? [];
  const bases = basesDosGrupos(content);
  const doPais = segmentosDoEleitor(
    pacote.perfis,
    pacote.perfis.map((p) => p.peso),
  );
  const lista = [
    ...pacote.bancadas,
    { id: JOGADOR, nome: "Seu partido", ponto: pontoDoJogador },
  ];
  return lista.map((b) => {
    const pesos = eleicao.eleitor[b.id] ?? [];
    const satisfacaoDoEleitor = pesos.reduce(
      (s, w, i) => s + w * satisfacao[i],
      0,
    );
    const eleitor = segmentosDoEleitor(pacote.perfis, pesos);
    const distanciaDoJogador = Math.hypot(
      b.ponto.economia - pontoDoJogador.economia,
      b.ponto.costumes - pontoDoJogador.costumes,
    );
    return {
      id: b.id,
      nome: b.nome,
      ponto: b.ponto,
      cadeiras: Object.fromEntries(
        pacote.casas.map((c) => [c.id, estado.casas[c.id]?.[b.id] ?? 0]),
      ),
      disposicao:
        b.id === JOGADOR
          ? 100
          : disposicao(pacote.regras, satisfacaoDoEleitor, distanciaDoJogador),
      eleitor,
      frentes: Object.fromEntries(
        pacote.regras.frentes.map((f) => {
          const dela = f.grupos
            .map((id) => grupos.find((g) => g.id === id))
            .filter((g): g is NonNullable<typeof g> => g !== undefined);
          const tamanho =
            dela.reduce(
              (t, g) =>
                t +
                frente(
                  pacote.regras,
                  bases.get(g.id) ?? {},
                  eleitor,
                  doPais,
                  ((g.recursos.dinheiro + g.recursos.midia) / 6) *
                    (estado.influencia[g.id] ?? 1),
                ),
              0,
            ) / Math.max(1, dela.length);
          return [f.id, tamanho];
        }),
      ),
    };
  });
}

/**
 * Base de cada grupo de pressão (segmento → peso, somando 1), lida das causas
 * "insatisfação da base" que a carga do país gerou (V1-09).
 */
const basesCache = new WeakMap<
  ResolvedPackage,
  ReadonlyMap<string, Readonly<Record<string, number>>>
>();
export function basesDosGrupos(
  content: ResolvedPackage,
): ReadonlyMap<string, Readonly<Record<string, number>>> {
  const guardado = basesCache.get(content);
  if (guardado) return guardado;
  const mapa = new Map<string, Readonly<Record<string, number>>>();
  for (const g of pressureGroups(content)?.grupos ?? []) {
    const daBase = g.causas.filter((c) =>
      c.nome.startsWith("insatisfação da base"),
    );
    const total = daBase.reduce((t, c) => t + c.peso, 0);
    mapa.set(
      g.id,
      Object.fromEntries(
        daBase.map((c) => [c.origem, total > 0 ? c.peso / total : 0]),
      ),
    );
  }
  basesCache.set(content, mapa);
  return mapa;
}
