// Judiciário: os tribunais que o país declara, os juízes de cada cadeira, a
// aposentadoria que abre vaga e quem preenche a vaga, pela lei. O motor não
// conhece nomes de tribunal nem de lei. Comportamento em judiciario.md.
import type { Ficha } from "../governo";
import { EIXOS, type PontoBussola } from "../leis";
import {
  distanciaNaBussola,
  fonteDeSorteio,
  gerarPessoas,
  type ModeloDePessoas,
  type PartidoParaPessoas,
} from "../pessoas";

/** O que o tribunal faz; o rótulo (STF, Corte Suprema…) é do país. */
export const FUNCOES_DO_TRIBUNAL = [
  "constitucional",
  "ultima-instancia",
  "eleitoral",
  "trabalho",
  "militar",
] as const;
export type FuncaoDoTribunal = (typeof FUNCOES_DO_TRIBUNAL)[number];

export interface Tribunal {
  id: string;
  rotulo: string;
  funcao: FuncaoDoTribunal;
  /** Cadeiras próprias; 0 no tribunal que só tem presidente (com `presidido_por`). */
  cadeiras: number;
  /** Tribunal de onde sai o presidente deste (o TSE é presidido por um juiz do STF). */
  presidido_por?: string;
  /** Juízes de partida, cadeira a cadeira; as cadeiras que sobram são sorteadas. */
  juizes?: JuizDeclarado[];
  /** Cadeiras já vagas no começo (depois das dos juízes declarados): quem saiu. */
  vagas?: { saiu: string }[];
  /** Quem preside no começo (id de um juiz declarado) e há quantos meses. */
  presidente?: { juiz: string; ha_meses: number };
}

/** Juiz que o país declara (nome parecido com o real, nunca o real). */
export interface JuizDeclarado {
  id: string;
  nome: string;
  sexo: "f" | "m";
  idade: number;
  anos_na_corte: number;
  /** Id do partido de onde veio, ou "tecnico". */
  origem: string;
  /** Sem bússola, vale a do partido de origem (técnico: a sorteada). */
  bussola?: PontoBussola;
  /** Tribunais que ele já presidiu (a fila da antiguidade pula). */
  ja_presidiu?: string[];
}

/** O que o país declara (`paises/<id>/judiciario.json`). */
/** Faixa de idade, em anos inteiros, dos dois lados. */
export interface FaixaDeIdade {
  de: number;
  ate: number;
}

export interface JudiciarioDoPais {
  tribunais: Tribunal[];
  /** Idade em que o juiz sai do tribunal. */
  aposentadoria: number;
  /**
   * Idade dos juízes do começo. Quanto mais longe da aposentadoria o mais velho,
   * mais rara a vaga nos primeiros anos.
   */
  idade_no_comeco: FaixaDeIdade;
  /** Idade de quem chega à corte (indicado ou da carreira). */
  idade_do_indicado: FaixaDeIdade;
}

/** Como a vaga é preenchida, conforme a lei que o mundo aponta. */
export type ModoDeEscolha = "carreira" | "senado" | "livre";

/** O que o mundo declara (`mundo/judiciario/judiciario.json`). */
export interface RegraDoJudiciario {
  /** Lei de opções que diz quem escolhe os juízes. */
  lei_escolha: string;
  /** Modo de cada opção da lei. */
  modos: Record<string, ModoDeEscolha>;
  indice_independencia: string;
  /** Pontos de independência entre um tribunal só de técnicos e um só do partido do governo. */
  pontos_independencia: number;
}

export interface RegrasJudiciario extends JudiciarioDoPais, RegraDoJudiciario {
  /** Nomes do país, para os juízes e os indicados. */
  modelo: ModeloDePessoas;
  /** Partidos com cadeiras e bússola: dão o lado dos juízes e dos indicados. */
  partidos: PartidoParaPessoas[];
}

/** Cadeira sem juiz: quem saiu, desde quando e quantas vezes o Senado barrou. */
export interface Vaga {
  desde: number;
  saiu: string;
  barrados: number;
}

/** Quem preside o tribunal e desde que turno. */
export interface Presidencia {
  id: string;
  desde: number;
}

export interface EstadoJudiciario {
  /** Juízes por tribunal, cadeira a cadeira; vaga aberta no lugar do juiz. */
  tribunais: Record<string, (Ficha | Vaga)[]>;
  /** Presidente de cada tribunal (opcional: partida salva antes não tem). */
  presidencia?: Record<string, Presidencia>;
  /** Quem já presidiu cada tribunal nesta volta da fila. */
  jaPresidiram?: Record<string, string[]>;
}

/** Um tribunal trocou de presidente. */
export interface TrocaDePresidente {
  tribunal: string;
  presidente: Ficha;
}

/** Indica alguém para a cadeira vaga (papel da mesa). */
export interface PedidoIndicar {
  tipo: "indicar";
  tribunal: string;
  cadeira: number;
  pessoa: string;
}

const TECNICO = "tecnico";
const MESES_POR_TURNO = 2;
const MESES_POR_ANO = 12;
/** Parte dos juízes do começo que não vem de partido. */
const TECNICOS_NO_COMECO = 0.5;
/** Quantos técnicos o sorteio mostra antes de ficar com o mais competente. */
const TECNICOS_NO_SORTEIO = 5;
/** Distância na bússola até a qual um partido fora da base aprova o indicado. */
export const DISTANCIA_QUE_O_SENADO_ACEITA = 0.2;
const MAIORIA = 0.5;
const SEMENTE_DOS_JUIZES = 7919;
/** Multiplicador e começo do resumo de texto em número (o de Java). */
const MULTIPLICADOR_DO_RESUMO = 31;
const COMECO_DO_RESUMO = 17;
/** A terceira carta usa a semente da vaga somada a isto. */
const DESLOCAMENTO_DA_TERCEIRA = 2;
/** A posse do juiz do começo usa a semente dele somada a isto. */
const DESLOCAMENTO_DA_POSSE = 3;

export const ehVaga = (c: Ficha | Vaga): c is Vaga => "desde" in c;

/** Semente fixa a partir de um texto: a mesma vaga sorteia sempre os mesmos nomes. */
function sementeDe(texto: string): number {
  return [...texto].reduce(
    (h, letra) =>
      (Math.imul(h, MULTIPLICADOR_DO_RESUMO) + letra.charCodeAt(0)) | 0,
    COMECO_DO_RESUMO,
  );
}

/** Idade de juiz, posse e bússola sem "-0" (a partida salva em JSON volta igual). */
const comIdade = (
  f: Ficha,
  semente: number,
  posse: number,
  idades: FaixaDeIdade,
): Ficha => ({
  ...f,
  bussola: Object.fromEntries(
    Object.entries(f.bussola).map(([eixo, v]) => [eixo, v + 0]),
  ),
  idade:
    idades.de +
    Math.floor(fonteDeSorteio(semente).unico() * (idades.ate - idades.de + 1)),
  posse,
});

/** Posse do juiz do começo: algum turno do passado, depois da idade de entrar. */
function posseNoPassado(
  regras: JudiciarioDoPais,
  idade: number,
  semente: number,
): number {
  const anos = Math.max(0, idade - regras.idade_do_indicado.de) + 1;
  const turnosNaCorte = (anos * MESES_POR_ANO) / MESES_POR_TURNO;
  return -Math.floor(
    fonteDeSorteio(semente + DESLOCAMENTO_DA_POSSE).unico() * turnosNaCorte,
  );
}

/** Id do juiz declarado dentro do estado. */
const idDoDeclarado = (tribunal: string, juiz: string) =>
  `juiz:${tribunal}:${juiz}`;

/** O juiz que o país declara, com os atributos da ficha sorteada para a cadeira. */
function doPais(
  regras: RegrasJudiciario,
  tribunal: string,
  d: JuizDeclarado,
  sorteada: Ficha,
): Ficha {
  const partido = regras.partidos.find((p) => p.id === d.origem);
  return {
    ...sorteada,
    id: idDoDeclarado(tribunal, d.id),
    nome: d.nome,
    sexo: d.sexo,
    idade: d.idade,
    origem: d.origem,
    bussola: d.bussola ?? partido?.bussola ?? sorteada.bussola,
    posse: -Math.round((d.anos_na_corte * MESES_POR_ANO) / MESES_POR_TURNO) + 0,
  };
}

/** Presidentes e quem já presidiu, como o país declara (antes do rodízio do turno 0). */
function presidenciaDeclarada(
  regras: RegrasJudiciario,
  e: EstadoJudiciario,
): EstadoJudiciario {
  const presidencia = Object.fromEntries(
    regras.tribunais.flatMap((t) =>
      t.presidente
        ? [
            [
              t.id,
              {
                id: idDoDeclarado(t.presidido_por ?? t.id, t.presidente.juiz),
                desde: -Math.round(t.presidente.ha_meses / MESES_POR_TURNO) + 0,
              },
            ],
          ]
        : [],
    ),
  );
  const jaPresidiram = Object.fromEntries(
    regras.tribunais.map((t) => {
      const origem = regras.tribunais.find(
        (x) => x.id === (t.presidido_por ?? t.id),
      );
      return [
        t.id,
        (origem?.juizes ?? [])
          .filter(
            (d) =>
              d.ja_presidiu?.includes(t.id) ||
              presidencia[t.id]?.id === idDoDeclarado(origem?.id ?? "", d.id),
          )
          .map((d) => idDoDeclarado(origem?.id ?? "", d.id)),
      ];
    }),
  );
  return { ...e, presidencia, jaPresidiram };
}

/** Juízes do começo: lado pelo peso dos partidos, metade técnicos, idade que o país declara. */
export function juizesIniciais(
  regras: RegrasJudiciario,
  semente: number,
): EstadoJudiciario {
  const total = regras.tribunais.reduce((s, t) => s + t.cadeiras, 0);
  const fichas = gerarPessoas(
    semente + SEMENTE_DOS_JUIZES,
    { ...regras.modelo, quantidade: total, tecnicos: TECNICOS_NO_COMECO },
    regras.partidos,
  );
  let i = 0;
  const tribunais = Object.fromEntries(
    regras.tribunais.map((t) => [
      t.id,
      Array.from({ length: t.cadeiras }, (_, c): Ficha | Vaga => {
        const f = fichas[i++];
        const s = semente + SEMENTE_DOS_JUIZES + i;
        const declarado = t.juizes?.[c];
        if (declarado) return doPais(regras, t.id, declarado, f);
        const vaga = t.vagas?.[c - (t.juizes?.length ?? 0)];
        if (vaga) return { desde: 0, saiu: vaga.saiu, barrados: 0 };
        const juiz = comIdade(
          { ...f, id: `juiz:${t.id}:${c}` },
          s,
          0,
          regras.idade_no_comeco,
        );
        return {
          ...juiz,
          posse: posseNoPassado(regras, juiz.idade ?? 0, s) + 0,
        };
      }),
    ]),
  );
  return trocarPresidentes(
    regras,
    presidenciaDeclarada(regras, { tribunais }),
    0,
  ).estado;
}

/** Lado médio de um conjunto de partidos, pelo peso das cadeiras. */
function ladoDe(
  partidos: readonly PartidoParaPessoas[],
  cadeiras: (id: string) => number,
): PontoBussola {
  const total = partidos.reduce((s, p) => s + cadeiras(p.id), 0);
  return Object.fromEntries(
    EIXOS.map((eixo) => [
      eixo,
      total > 0
        ? partidos.reduce(
            (s, p) => s + cadeiras(p.id) * (p.bussola[eixo] ?? 0),
            0,
          ) / total
        : 0,
    ]),
  );
}

/** Uma ficha nova, sorteada pela semente, de um partido ou técnica. */
function sortearUm(
  regras: RegrasJudiciario,
  semente: number,
  partido: PartidoParaPessoas | null,
  id: string,
  posse = 0,
): Ficha {
  const quantos = partido ? 1 : TECNICOS_NO_SORTEIO;
  const fichas = gerarPessoas(
    semente,
    { ...regras.modelo, quantidade: quantos, tecnicos: partido ? 0 : 1 },
    partido ? [partido] : regras.partidos,
  );
  const melhor = fichas.reduce((a, b) =>
    b.competencia > a.competencia ? b : a,
  );
  return comIdade({ ...melhor, id }, semente, posse, regras.idade_do_indicado);
}

/**
 * As três cartas de uma vaga: um aliado do partido do governo, um técnico
 * respeitado e um nome do partido mais perto do lado do Senado.
 */
export function cartasDaVaga(
  regras: RegrasJudiciario,
  governo: string,
  senado: Record<string, number>,
  tribunal: string,
  cadeira: number,
  vaga: Vaga,
): Ficha[] {
  const base = `${tribunal}:${cadeira}:${vaga.desde}:${vaga.barrados}`;
  const semente = sementeDe(base);
  const doGoverno = regras.partidos.find((p) => p.id === governo) ?? null;
  const lado = ladoDe(regras.partidos, (id) => senado[id] ?? 0);
  const doSenado = regras.partidos
    .filter((p) => p.id !== governo && (senado[p.id] ?? 0) > 0)
    .reduce<PartidoParaPessoas | null>(
      (perto, p) =>
        !perto ||
        distanciaNaBussola(p.bussola, lado) <
          distanciaNaBussola(perto.bussola, lado)
          ? p
          : perto,
      null,
    );
  const cartas = [
    doGoverno && sortearUm(regras, semente, doGoverno, `${base}:aliado`),
    sortearUm(regras, semente + 1, null, `${base}:tecnico`),
    doSenado &&
      sortearUm(
        regras,
        semente + DESLOCAMENTO_DA_TERCEIRA,
        doSenado,
        `${base}:senado`,
      ),
  ];
  return cartas.filter((c): c is Ficha => c !== null);
}

/** Votos do Senado no indicado: a base aprova; fora dela, só quem está perto na bússola. */
export function votoDoSenado(
  regras: RegrasJudiciario,
  senado: Record<string, number>,
  base: readonly string[],
  indicado: Ficha,
): { sim: number; nao: number; aprovado: boolean } {
  const lado = new Map(regras.partidos.map((p) => [p.id, p.bussola]));
  const votos = Object.entries(senado).map(([id, cadeiras]) => {
    const bussola = lado.get(id);
    const aprova =
      base.includes(id) ||
      (bussola !== undefined &&
        distanciaNaBussola(bussola, indicado.bussola) <
          DISTANCIA_QUE_O_SENADO_ACEITA);
    return { cadeiras, aprova };
  });
  const sim = votos.filter((v) => v.aprova).reduce((s, v) => s + v.cadeiras, 0);
  const nao = votos
    .filter((v) => !v.aprova)
    .reduce((s, v) => s + v.cadeiras, 0);
  return { sim, nao, aprovado: sim > (sim + nao) * MAIORIA };
}

/** Dois meses a mais em cada juiz; quem chega à aposentadoria deixa a cadeira vaga. */
export function envelhecerJuizes(
  regras: RegrasJudiciario,
  e: EstadoJudiciario,
  turno: number,
): EstadoJudiciario {
  const passo = MESES_POR_TURNO / MESES_POR_ANO;
  return {
    ...e,
    tribunais: Object.fromEntries(
      Object.entries(e.tribunais).map(([id, cadeiras]) => [
        id,
        cadeiras.map((c): Ficha | Vaga => {
          if (ehVaga(c)) return c;
          const idade = (c.idade ?? regras.idade_do_indicado.de) + passo;
          return idade >= regras.aposentadoria
            ? { desde: turno, saiu: c.nome, barrados: 0 }
            : { ...c, idade };
        }),
      ]),
    ),
  };
}

/** Na carreira, o próprio tribunal preenche a vaga com um técnico perto do lado dele. */
export function preencherPelaCarreira(
  regras: RegrasJudiciario,
  e: EstadoJudiciario,
  turno: number,
): EstadoJudiciario {
  return {
    ...e,
    tribunais: Object.fromEntries(
      Object.entries(e.tribunais).map(([id, cadeiras]) => [
        id,
        cadeiras.map((c, i) =>
          ehVaga(c)
            ? sortearUm(
                regras,
                sementeDe(`${id}:${i}:${c.desde}:carreira`),
                null,
                `juiz:${id}:${i}:${c.desde}`,
                turno,
              )
            : c,
        ),
      ]),
    ),
  };
}

/** Põe a pessoa na cadeira; a posse é o turno. */
export function sentar(
  e: EstadoJudiciario,
  tribunal: string,
  cadeira: number,
  pessoa: Ficha,
  turno: number,
): EstadoJudiciario {
  return {
    ...e,
    tribunais: {
      ...e.tribunais,
      [tribunal]: e.tribunais[tribunal].map((c, i) =>
        i === cadeira ? { ...pessoa, posse: turno } : c,
      ),
    },
  };
}

/** Pontos de independência: sobe com técnicos, cai com juízes do partido do governo. */
export function pontosDeIndependencia(
  regras: RegrasJudiciario,
  e: EstadoJudiciario,
  governo: string,
): number {
  const juizes = Object.values(e.tribunais)
    .flat()
    .filter((c): c is Ficha => !ehVaga(c));
  if (juizes.length === 0) return 0;
  const tecnicos = juizes.filter((j) => j.origem === TECNICO).length;
  const doGoverno = juizes.filter((j) => j.origem === governo).length;
  return (regras.pontos_independencia * (tecnicos - doGoverno)) / juizes.length;
}

/** Vagas abertas, com tribunal e cadeira. */
export function vagasAbertas(e: EstadoJudiciario) {
  return Object.entries(e.tribunais).flatMap(([tribunal, cadeiras]) =>
    cadeiras.flatMap((c, cadeira) =>
      ehVaga(c) ? [{ tribunal, cadeira, vaga: c }] : [],
    ),
  );
}

/** Turnos de um mandato de presidente de tribunal (2 anos). */
const TURNOS_DO_MANDATO = 12;

/** Escolhe o presidente de um tribunal pela antiguidade, se é hora de trocar. */
function trocarUm(
  e: EstadoJudiciario,
  t: Tribunal,
  turno: number,
): { estado: EstadoJudiciario; troca?: TrocaDePresidente } {
  const origem = t.presidido_por ?? t.id;
  const atual = e.presidencia?.[t.id];
  const daOrigem = t.presidido_por ? e.presidencia?.[origem]?.id : undefined;
  const sentados = (e.tribunais[origem] ?? []).filter(
    (c): c is Ficha => !ehVaga(c),
  );
  const segue =
    atual !== undefined &&
    atual.id !== daOrigem &&
    sentados.some((f) => f.id === atual.id) &&
    turno - atual.desde < TURNOS_DO_MANDATO;
  if (segue) return { estado: e };
  const elegiveis = sentados.filter((f) => f.id !== daOrigem);
  const ja = e.jaPresidiram?.[t.id] ?? [];
  const novos = elegiveis.filter((f) => !ja.includes(f.id));
  // todos já presidiram: a fila recomeça
  const fila = novos.length > 0 ? novos : elegiveis;
  if (fila.length === 0) return { estado: e };
  const escolhido = fila.reduce((a, b) =>
    (b.posse ?? 0) < (a.posse ?? 0) ? b : a,
  );
  return {
    estado: {
      ...e,
      presidencia: {
        ...e.presidencia,
        [t.id]: { id: escolhido.id, desde: turno },
      },
      jaPresidiram: {
        ...e.jaPresidiram,
        [t.id]: [...(novos.length > 0 ? ja : []), escolhido.id],
      },
    },
    troca: { tribunal: t.id, presidente: escolhido },
  };
}

/**
 * Troca os presidentes que precisam trocar: mandato de 2 anos, presidente que
 * saiu da corte ou que passou a presidir a corte de origem. Assume o juiz mais
 * antigo que ainda não presidiu; quem tira o presidente de outra corte vem depois
 * dela e não repete o presidente dela.
 */
export function trocarPresidentes(
  regras: RegrasJudiciario,
  e: EstadoJudiciario,
  turno: number,
): { estado: EstadoJudiciario; trocas: TrocaDePresidente[] } {
  const ordem = [
    ...regras.tribunais.filter((t) => t.presidido_por === undefined),
    ...regras.tribunais.filter((t) => t.presidido_por !== undefined),
  ];
  return ordem.reduce<{
    estado: EstadoJudiciario;
    trocas: TrocaDePresidente[];
  }>(
    (acc, t) => {
      const { estado, troca } = trocarUm(acc.estado, t, turno);
      return { estado, trocas: troca ? [...acc.trocas, troca] : acc.trocas };
    },
    { estado: e, trocas: [] },
  );
}

/** Motivo de o Judiciário do país não servir, ou nulo. */
export function motivoJudiciarioInvalido(j: JudiciarioDoPais): string | null {
  if (!Array.isArray(j.tribunais) || j.tribunais.length === 0)
    return "precisa de ao menos um tribunal";
  const errado = j.tribunais
    .map((t) =>
      !FUNCOES_DO_TRIBUNAL.includes(t.funcao)
        ? `tribunal "${t.id}": função "${t.funcao}" não existe`
        : !Number.isInteger(t.cadeiras) ||
            t.cadeiras < (t.presidido_por === undefined ? 1 : 0)
          ? `tribunal "${t.id}": cadeiras precisa ser inteiro positivo (0 só com presidido_por)`
          : null,
    )
    .find((m) => m !== null);
  if (errado) return errado;
  if (new Set(j.tribunais.map((t) => t.id)).size !== j.tribunais.length)
    return "dois tribunais com o mesmo id";
  const semPresidente = j.tribunais.find(
    (t) =>
      t.presidido_por !== undefined &&
      !j.tribunais.some((x) => x.id === t.presidido_por && x.id !== t.id),
  );
  if (semPresidente)
    return `tribunal "${semPresidente.id}": presidido_por "${semPresidente.presidido_por}" não existe`;
  const juizErrado = j.tribunais
    .flatMap((t) => {
      const origem = j.tribunais.find(
        (x) => x.id === (t.presidido_por ?? t.id),
      );
      const ids = new Set((origem?.juizes ?? []).map((d) => d.id));
      return [
        (t.juizes?.length ?? 0) + (t.vagas?.length ?? 0) > t.cadeiras
          ? `tribunal "${t.id}": mais juízes e vagas que cadeiras`
          : null,
        ...(t.juizes ?? []).map((d) =>
          !(d.idade > 0 && d.idade < j.aposentadoria)
            ? `juiz "${d.id}": idade precisa ser abaixo da aposentadoria`
            : !(d.anos_na_corte >= 0)
              ? `juiz "${d.id}": anos_na_corte precisa ser 0 ou mais`
              : null,
        ),
        t.presidente && !ids.has(t.presidente.juiz)
          ? `tribunal "${t.id}": presidente "${t.presidente.juiz}" não é juiz declarado`
          : null,
      ];
    })
    .find((m) => m !== null);
  if (juizErrado) return juizErrado;
  const faixas = {
    idade_no_comeco: j.idade_no_comeco,
    idade_do_indicado: j.idade_do_indicado,
  };
  const faixaErrada = Object.entries(faixas).find(
    ([, f]) =>
      !f ||
      !Number.isInteger(f.de) ||
      !Number.isInteger(f.ate) ||
      f.de > f.ate ||
      f.ate >= j.aposentadoria,
  );
  if (faixaErrada)
    return `${faixaErrada[0]} precisa de "de" e "ate" inteiros, "de" ≤ "ate" < aposentadoria`;
  return null;
}
