/**
 * Eleição no fim do mandato (V1-39, docs/v1/desenho/eleicao.md).
 *
 * O jogador é o partido: escolhe o presidente entre personagens gerados,
 * governa, e no último turno do mandato os perfis do eleitorado votam entre o
 * candidato do partido e um adversário de cada outro campo.
 */
import type { ResolvedPackage } from "../../engine";
import dadosDaEleicao from "../../conteudo/mundo/eleicao.json";
import dadosDosPersonagens from "../../conteudo/mundo/personagens.json";
import { distancia, type PontoDaBussola } from "../bussola";
import {
  congressoDoPacote,
  dhondt,
  eleicaoComJogador,
  maioresRestos,
  misturar,
  type Cadeiras,
  type CongressoDoPacote,
  type EstadoDoCongresso,
} from "../congresso";
import {
  criarSorte,
  gerarEscolha,
  gerarPersonagem,
  ideologiaMaisPerto,
  type Sorte,
} from "./personagens";
import {
  candidatosDaEleicao,
  comSorte,
  contar,
  excessoDe,
  type Contexto,
} from "./votacao";
import type {
  EleicaoDoPais,
  EstadoDaEleicao,
  MundoDosPersonagens,
  Personagem,
  Pesquisa,
  RegrasDaEleicao,
  ResultadoDaEleicao,
  Rodada,
} from "./tipos";

export * from "./tipos";
export * from "./personagens";
export * from "./votacao";

export const regrasDaEleicao = dadosDaEleicao as unknown as RegrasDaEleicao;
export const mundoDosPersonagens =
  dadosDosPersonagens as unknown as MundoDosPersonagens;

const PAISES: Readonly<Record<string, EleicaoDoPais>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<EleicaoDoPais>("../../conteudo/paises/*/eleicao.json", {
      eager: true,
      import: "default",
    }),
  ).map(([caminho, dados]) => [caminho.split("/").at(-2)!, dados]),
);

/** As regras eleitorais do país; sem o arquivo, o país não tem eleição. */
export function eleicaoDoPais(pais: string): EleicaoDoPais | undefined {
  return PAISES[pais];
}

/** Indicadores do voto econômico. */
const indicadores = () => Object.keys(regrasDaEleicao.voto.pesoEconomico);

const fotografia = (valores: Readonly<Record<string, number>>) =>
  Object.fromEntries(indicadores().map((id) => [id, valores[id] ?? 0]));

/** Os nomes da primeira tela: a mesma semente dá sempre os mesmos. */
export function primeiraEscolha(pais: string, semente: number): Personagem[] {
  const dados = eleicaoDoPais(pais);
  if (!dados) return [];
  return gerarEscolha(mundoDosPersonagens, dados, criarSorte(semente));
}

const sorteDe = (estado: EstadoDaEleicao): Sorte =>
  criarSorte(estado.semente, estado.sorteios);

/** O ponto de cada campo: a média das bancadas dele, pesada pelas cadeiras. */
function pontosDosCampos(
  pais: EleicaoDoPais,
  pacote: CongressoDoPacote,
  congresso: EstadoDoCongresso | undefined,
): { id: string; ponto: PontoDaBussola }[] {
  const casa = pacote.casas[0]?.id;
  return pais.campos.map((campo) => {
    const membros = pacote.bancadas.filter((b) =>
      campo.bancadas.includes(b.id),
    );
    const peso = (id: string) =>
      Math.max(1, (casa && congresso?.casas[casa]?.[id]) || 1);
    const total = membros.reduce((s, b) => s + peso(b.id), 0) || 1;
    const media = (eixo: "economia" | "costumes") =>
      membros.reduce((s, b) => s + peso(b.id) * b.ponto[eixo], 0) / total;
    return {
      id: campo.id,
      ponto: { economia: media("economia"), costumes: media("costumes") },
    };
  });
}

/** O eleitor médio: a média dos pontos dos perfis, pelo peso. */
function eleitorMedio(pacote: CongressoDoPacote): PontoDaBussola {
  const total = pacote.perfis.reduce((s, p) => s + p.peso, 0) || 1;
  const media = (eixo: "economia" | "costumes") =>
    pacote.perfis.reduce((s, p) => s + p.peso * p.ponto[eixo], 0) / total;
  return { economia: media("economia"), costumes: media("costumes") };
}

/** Um adversário de cada campo que não é o do partido. */
function gerarAdversarios(
  pais: EleicaoDoPais,
  pacote: CongressoDoPacote,
  congresso: EstadoDoCongresso | undefined,
  ideologia: PontoDaBussola,
  sorte: Sorte,
  /** O lado do presidente do partido; sem ele, o da ideologia mais perto. */
  ladoDoPartido?: string,
): Personagem[] {
  const campos = pontosDosCampos(pais, pacote, congresso);
  const lado =
    ladoDoPartido ?? ideologiaMaisPerto(mundoDosPersonagens, ideologia).lado;
  const doPartido =
    campos.find((c) => c.id === lado) ??
    campos.reduce((a, b) =>
      distancia(b.ponto, ideologia) < distancia(a.ponto, ideologia) ? b : a,
    );
  const meio = eleitorMedio(pacote);
  const c = regrasDaEleicao.voto.convergencia;
  return campos
    .filter((campo) => campo.id !== doPartido.id)
    .map((campo) => {
      const p = gerarPersonagem(mundoDosPersonagens, pais, sorte, campo.id);
      return {
        ...p,
        ponto: {
          economia: p.ponto.economia + c * (meio.economia - p.ponto.economia),
          costumes: p.ponto.costumes + c * (meio.costumes - p.ponto.costumes),
        },
      };
    });
}

/** Estado do turno 0: o partido, o presidente e os adversários. */
export function criarEleicao(input: {
  content: ResolvedPackage;
  pais: string;
  semente: number;
  partido?: Readonly<{ nome?: string; sigla?: string }>;
  presidente?: string;
  valores: Readonly<Record<string, number>>;
  congresso?: EstadoDoCongresso;
}): EstadoDaEleicao | undefined {
  const pais = eleicaoDoPais(input.pais);
  const pacote = congressoDoPacote(input.content);
  if (!pais || !pacote) return undefined;
  const sorte = criarSorte(input.semente);
  const escolha = gerarEscolha(mundoDosPersonagens, pais, sorte);
  const presidente =
    escolha.find((p) => p.id === input.presidente) ?? escolha[0];
  const nome = input.partido?.nome?.trim() || "Seu partido";
  const sigla =
    input.partido?.sigla?.trim() ||
    nome
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .map((w) => w[0].toUpperCase())
      .join("") ||
    nome.slice(0, 3).toUpperCase();
  const ideologia = presidente.ponto;
  const adversarios = gerarAdversarios(
    pais,
    pacote,
    input.congresso,
    ideologia,
    sorte,
    presidente.lado,
  );
  return {
    partido: { nome, sigla, ideologia },
    presidente,
    mandatosDoPresidente: 1,
    mandato: 1,
    inicioDoMandato: 0,
    economiaNoInicio: fotografia(input.valores),
    adversarios,
    opcoes: [],
    pesquisas: [],
    vies: sorte.normal() * regrasDaEleicao.pesquisas.viesDoInstituto,
    resultados: [],
    semente: input.semente,
    sorteios: sorte.usados(),
  };
}

/** Pode o presidente concorrer de novo? */
export function podeConcorrer(
  pais: EleicaoDoPais,
  estado: EstadoDaEleicao,
): boolean {
  return estado.mandatosDoPresidente < pais.limiteDeMandatos;
}

/** O candidato que vai à urna se nada mudar. */
export function candidatoDoPartido(
  pais: EleicaoDoPais,
  estado: EstadoDaEleicao,
): Personagem | undefined {
  if (estado.candidato) return estado.candidato;
  if (podeConcorrer(pais, estado)) return estado.presidente;
  return undefined;
}

/** O partido escolhe quem disputa: a base pode estranhar. */
export function escolherCandidato(
  content: ResolvedPackage,
  paisId: string,
  estado: EstadoDaEleicao,
  id: string,
): EstadoDaEleicao | string {
  const pais = eleicaoDoPais(paisId);
  const lista = [
    ...(pais && podeConcorrer(pais, estado) ? [estado.presidente] : []),
    ...estado.opcoes,
  ];
  const escolhido = lista.find((p) => p.id === id);
  if (!escolhido)
    return "Este nome não está entre os que o partido pode lançar.";
  const pacote = congressoDoPacote(content);
  const base = pacote?.regras.voto.disciplinaDoJogador ?? 0.9;
  const { quedaDaDisciplina, disciplinaMinima } = regrasDaEleicao.estranhamento;
  const excesso = excessoDe(
    regrasDaEleicao,
    estado.partido.ideologia,
    escolhido,
  );
  return {
    ...estado,
    candidato: escolhido,
    disciplina: Math.max(disciplinaMinima, base - quedaDaDisciplina * excesso),
  };
}

/** Estranhamento da base com um nome (pontos de distância além da tolerância). */
export function estranhamento(
  estado: EstadoDaEleicao,
  personagem: Personagem,
): number {
  return excessoDe(regrasDaEleicao, estado.partido.ideologia, personagem);
}

function contexto(
  pacote: CongressoDoPacote,
  pais: EleicaoDoPais,
  estado: EstadoDaEleicao,
  valores: Readonly<Record<string, number>>,
): Contexto {
  return {
    pacote,
    regras: regrasDaEleicao,
    pais,
    valores,
    economiaNoInicio: estado.economiaNoInicio,
    ideologia: estado.partido.ideologia,
  };
}

/** Pesquisa: o modelo de agora, com erro de amostra e o viés do instituto. */
function pesquisar(
  ctx: Contexto,
  estado: EstadoDaEleicao,
  candidato: Personagem,
  turno: number,
  sorte: Sorte,
): Pesquisa {
  const n = regrasDaEleicao.pesquisas.tamanhoDaAmostra;
  const erro = (p: number) =>
    100 * Math.sqrt(Math.max(0, (p / 100) * (1 - p / 100)) / n);
  const todos = [candidato, ...estado.adversarios];
  const primeiro = contar(
    ctx,
    candidatosDaEleicao(ctx, todos, candidato.id, estado.presidente.id),
  ).votos;
  const desvios = todos.map(
    (c) =>
      sorte.normal() * erro(primeiro[c.id]) +
      (c.id === candidato.id ? estado.vies : 0),
  );
  const segundo: Record<string, number> = {};
  for (const adv of estado.adversarios) {
    const v = contar(
      ctx,
      candidatosDaEleicao(
        ctx,
        [candidato, adv],
        candidato.id,
        estado.presidente.id,
      ),
    ).votos[candidato.id];
    segundo[adv.id] = Math.max(
      0,
      Math.min(100, v + sorte.normal() * erro(v) + estado.vies),
    );
  }
  return {
    turno,
    primeiro: comSorte(primeiro, desvios),
    segundo,
    margem: 1.96 * 100 * Math.sqrt(0.25 / n),
  };
}

/** A eleição: 1º turno e, se ninguém tiver maioria, o 2º. */
function votar(
  ctx: Contexto,
  pais: EleicaoDoPais,
  estado: EstadoDaEleicao,
  candidato: Personagem,
  turno: number,
  sorte: Sorte,
): ResultadoDaEleicao {
  const ruido = () => sorte.normal() * regrasDaEleicao.ruido;
  const todos = [candidato, ...estado.adversarios];
  const c1 = contar(
    ctx,
    candidatosDaEleicao(ctx, todos, candidato.id, estado.presidente.id),
    candidato.id,
  );
  const primeiro: Rodada = {
    votos: comSorte(c1.votos, todos.map(ruido)),
    comparecimento: c1.comparecimento,
  };
  const ordem = Object.entries(primeiro.votos).sort((a, b) => b[1] - a[1]);
  let segundo: Rodada | undefined;
  let porSegmento = c1.porSegmento;
  let vencedor = ordem[0][0];
  if (pais.segundoTurno && ordem[0][1] < 100 * pais.maioria) {
    const finalistas = todos.filter(
      (c) => c.id === ordem[0][0] || c.id === ordem[1][0],
    );
    const c2 = contar(
      ctx,
      candidatosDaEleicao(ctx, finalistas, candidato.id, estado.presidente.id),
      candidato.id,
    );
    segundo = {
      votos: comSorte(c2.votos, finalistas.map(ruido)),
      comparecimento: c2.comparecimento,
    };
    porSegmento = c2.porSegmento;
    vencedor = Object.entries(segundo.votos).sort((a, b) => b[1] - a[1])[0][0];
  }
  return {
    turno,
    mandato: estado.mandato,
    candidato,
    adversarios: estado.adversarios,
    primeiro,
    ...(segundo ? { segundo } : {}),
    vencedor,
    venceu: vencedor === candidato.id,
    porSegmento,
  };
}

/** Congresso eleito junto: a Câmara inteira, o Senado na parte que renova. */
export function renovarCongresso(input: {
  content: ResolvedPackage;
  pais: EleicaoDoPais;
  estado: EstadoDoCongresso;
  valores: Readonly<Record<string, number>>;
  pontoDoJogador: PontoDaBussola;
  mandato: number;
}): EstadoDoCongresso {
  const pacote = congressoDoPacote(input.content);
  if (!pacote) return input.estado;
  const agora = eleicaoComJogador(pacote, input.pontoDoJogador, input.valores);
  const casas: Record<string, Cadeiras> = {};
  const exatas: Record<string, Readonly<Record<string, number>>> = {};
  for (const casa of pacote.casas) {
    const ciclo = input.pais.renovacao[casa.id] ?? [1];
    const parte = ciclo[(input.mandato - 1) % ciclo.length] ?? 1;
    const eleita = dhondt(agora.fatias, casa.cadeiras);
    exatas[casa.id] = misturar(
      input.estado.exatas[casa.id] ?? input.estado.casas[casa.id] ?? {},
      eleita,
      parte,
    );
    casas[casa.id] = maioresRestos(exatas[casa.id], casa.cadeiras);
  }
  return { ...input.estado, casas, exatas, humor: {} };
}

export type FimDoTurno = Readonly<{
  estado: EstadoDaEleicao;
  pesquisa?: Pesquisa;
  resultado?: ResultadoDaEleicao;
  /** O partido perdeu: a partida acaba. */
  encerrada: boolean;
}>;

/** Turno do mandato (1 a turnoDaEleicao) depois de `turno`. */
export function turnoDoMandato(estado: EstadoDaEleicao, turno: number): number {
  return turno - estado.inicioDoMandato;
}

/** Falta o candidato no turno que fecha o mandato? */
export function faltaCandidato(
  pais: EleicaoDoPais,
  estado: EstadoDaEleicao,
  turnoQueVaiFechar: number,
): boolean {
  return (
    turnoDoMandato(estado, turnoQueVaiFechar) >= pais.turnoDaEleicao &&
    candidatoDoPartido(pais, estado) === undefined
  );
}

/**
 * Fim do turno: nomes para escolher, pesquisas e, no último turno do mandato,
 * a eleição. `turno` é o turno que acabou de fechar.
 */
export function passarTurnoNaEleicao(input: {
  content: ResolvedPackage;
  pais: string;
  estado: EstadoDaEleicao;
  valores: Readonly<Record<string, number>>;
  congresso?: EstadoDoCongresso;
  turno: number;
}): FimDoTurno {
  const pais = eleicaoDoPais(input.pais);
  const pacote = congressoDoPacote(input.content);
  if (!pais || !pacote) return { estado: input.estado, encerrada: false };
  let estado = input.estado;
  const sorte = sorteDe(estado);
  const t = turnoDoMandato(estado, input.turno);
  const ctx = contexto(pacote, pais, estado, input.valores);
  if (t === pais.turnoDaEscolha && estado.opcoes.length === 0)
    estado = {
      ...estado,
      opcoes: gerarEscolha(mundoDosPersonagens, pais, sorte),
    };
  const candidato =
    candidatoDoPartido(pais, estado) ?? estado.opcoes[0] ?? estado.presidente;
  let pesquisa: Pesquisa | undefined;
  if (pais.pesquisas.includes(t)) {
    pesquisa = pesquisar(ctx, estado, candidato, input.turno, sorte);
    estado = { ...estado, pesquisas: [...estado.pesquisas, pesquisa] };
  }
  if (t < pais.turnoDaEleicao)
    return {
      estado: { ...estado, sorteios: sorte.usados() },
      pesquisa,
      encerrada: false,
    };
  const resultado = votar(ctx, pais, estado, candidato, input.turno, sorte);
  const resultados = [...estado.resultados, resultado];
  if (!resultado.venceu)
    return {
      estado: { ...estado, resultados, sorteios: sorte.usados() },
      pesquisa,
      resultado,
      encerrada: true,
    };
  // venceu: novo mandato
  const mesmo = candidato.id === estado.presidente.id;
  const passo = regrasDaEleicao.estranhamento.passoDaIdeologia;
  const ideologia = mesmo
    ? estado.partido.ideologia
    : {
        economia:
          estado.partido.ideologia.economia +
          passo *
            (candidato.ponto.economia - estado.partido.ideologia.economia),
        costumes:
          estado.partido.ideologia.costumes +
          passo *
            (candidato.ponto.costumes - estado.partido.ideologia.costumes),
      };
  const adversarios = gerarAdversarios(
    pais,
    pacote,
    input.congresso,
    ideologia,
    sorte,
    candidato.lado,
  );
  return {
    estado: {
      ...estado,
      partido: { ...estado.partido, ideologia },
      presidente: candidato,
      mandatosDoPresidente: mesmo ? estado.mandatosDoPresidente + 1 : 1,
      mandato: estado.mandato + 1,
      inicioDoMandato: input.turno,
      economiaNoInicio: fotografia(input.valores),
      adversarios,
      opcoes: [],
      candidato: undefined,
      pesquisas: [],
      vies: sorte.normal() * regrasDaEleicao.pesquisas.viesDoInstituto,
      resultados,
      sorteios: sorte.usados(),
    },
    pesquisa,
    resultado,
    encerrada: false,
  };
}
