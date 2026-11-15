// Governo: ministérios com fichas, órgãos por instituição e corrupção. O motor
// não conhece nomes de ministério nem de pessoa: instituições e moldes são do
// mundo; pessoas e caixas, do país e do jogador. Comportamento em governo.md.
import { novoFato, type Fato } from "../fatos";
import type { Magoa } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import { candidatosDoPartido, fichaDe } from "./ministerios";
import { andarOrgaos, desvioDosOrgaos, iniciarOrgaos } from "./orgaos";
import type {
  Caixa,
  EstadoGoverno,
  GovernoDoPais,
  PedidoNomear,
  RegrasGoverno,
} from "./tipos";

export * from "./tipos";
export {
  ajusteDaCompetencia,
  ajusteDaLei,
  caixaDaInstituicao,
  caixaDaLei,
  candidatosDoPartido,
  competenciaEfetiva,
  fichaDe,
  instituicoesDaCaixa,
  instituicoesSoltas,
  ministrosPorPartido,
  poderDaInstituicao,
} from "./ministerios";
export {
  LIMITE_DO_ESCANDALO,
  corrupcaoDeEquilibrio,
  corrupcaoSeguinte,
  rendimentoDasLeis,
  rendimentoDoOrgao,
  situacaoDoOrgao,
  verbaDaInstituicao,
  desvioDosOrgaos,
  PARTE_DESVIADA,
  type SituacaoDoOrgao,
} from "./orgaos";

const VALOR_MAXIMO = 100;
const TECNICO = "tecnico";

/** Valor da lei de cargos de livre nomeação, de 0 a 1 da faixa dela (0 sem a lei). */
export function fracaoDosCargos(
  r: RegrasGoverno,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): number {
  const id = r.leis?.cargos;
  const lei = id ? leis[id] : undefined;
  if (lei?.forma !== "continua") return 0;
  const valor = (valores[lei.id] as number | undefined) ?? lei.faixa.min;
  return (valor - lei.faixa.min) / (lei.faixa.max - lei.faixa.min);
}

/** Governo do começo da partida: os ministros do país e órgãos em equilíbrio. */
export function iniciarGoverno(
  pais: GovernoDoPais,
  r: RegrasGoverno,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): EstadoGoverno {
  const caixas = pais.ministerios.map((c) => ({
    ...c,
    instituicoes: [...c.instituicoes],
  }));
  const cargos = fracaoDosCargos(r, leis, valores);
  const orgaos = iniciarOrgaos(r, caixas, leis, valores, cargos);
  return {
    caixas,
    orgaos,
    desvio_inicial: desvioDosOrgaos(leis, valores, orgaos),
  };
}

/** Motivo de as caixas não fecharem (do país ou do jogador), ou null. */
export function motivoCaixasInvalidas(
  r: RegrasGoverno,
  caixas: readonly Caixa[],
  pessoas: readonly string[],
): string | null {
  const ids = caixas.map((c) => c.id);
  if (new Set(ids).size !== ids.length) return "caixa repetida";
  const ministros = caixas.map((c) => c.ministro);
  const faltando = ministros.find((id) => !pessoas.includes(id));
  if (faltando !== undefined) return `ministro "${faltando}" não existe`;
  if (new Set(ministros).size !== ministros.length)
    return "a mesma pessoa em duas caixas";
  if (caixas.filter((c) => c.sobra).length !== 1)
    return "precisa de uma caixa para a sobra (o gabinete)";
  const levadas = caixas.flatMap((c) => c.instituicoes);
  const estranha = levadas.find(
    (i) => !r.instituicoes.some((x) => x.id === i && !x.poder),
  );
  if (estranha !== undefined)
    return `instituição "${estranha}" não existe ou é só do poder`;
  const dobrada = levadas.find((i, n) => levadas.indexOf(i) !== n);
  if (dobrada !== undefined) return `${dobrada} está em duas caixas`;
  return null;
}

/** Motivo de o governo do país não fechar, ou null. */
export function motivoGovernoInvalido(
  r: RegrasGoverno,
  pais: GovernoDoPais,
  partidos: string[],
): string | null {
  const ids = r.pessoas.map((p) => p.id);
  if (new Set(ids).size !== ids.length) return "pessoa repetida";
  for (const p of r.pessoas) {
    const notas = [
      p.competencia,
      p.habilidade,
      p.carisma,
      p.honestidade,
      p.lealdade,
    ];
    if (!notas.every((n) => n >= 0 && n <= VALOR_MAXIMO))
      return `pessoa ${p.id}: as notas vão de 0 a ${VALOR_MAXIMO}`;
    if (p.origem !== TECNICO && !partidos.includes(p.origem))
      return `pessoa ${p.id}: origem "${p.origem}" não é partido nem técnico`;
  }
  return motivoCaixasInvalidas(r, pais.ministerios, ids);
}

export interface EntradaGoverno {
  regras: RegrasGoverno;
  estado: EstadoGoverno;
  leis: Record<string, Lei>;
  valores: Record<string, ValorLei>;
  turno: number;
  /** Fatos na mesa; o governo lê as moedas Ministério deste turno. */
  fatos: readonly Fato[];
  pedidos: PedidoNomear[];
  /** Valor da lei de cargos de livre nomeação (0 se o país não tem). */
  cargos: number;
}

export interface SaidaGoverno {
  estado: EstadoGoverno;
  fatos: Fato[];
}

/** Trocas contadas como do mesmo mandato: 4 anos (24 turnos de 2 meses). */
const TURNOS_DO_MANDATO = 24;
/** Quantos turnos a mágoa dos parecidos com o demitido dura, sumindo aos poucos. */
const DURACAO_DA_MAGOA = 3;
/** Mágoa da primeira troca, e quanto cada troca seguinte do mandato soma. */
const MAGOA_DA_TROCA = 6;
const MAGOA_POR_TROCA = 3;
const TAMANHO_DA_TROCA = ["pequeno", "medio", "grande"] as const;

/** Trocas do jogador ainda dentro da janela do mandato. */
export const trocasRecentes = (e: EstadoGoverno, turno: number) =>
  (e.trocas ?? []).filter((t) => turno - t.turno < TURNOS_DO_MANDATO);

/**
 * Mágoa dos grupos parecidos com os ministros que o jogador tirou: começa no
 * turno seguinte, some em `DURACAO_DA_MAGOA` turnos e cresce a cada troca do
 * mandato.
 */
export function magoasDoGoverno(e: EstadoGoverno, turno: number): Magoa[] {
  return (e.trocas ?? []).flatMap((t) => {
    const idade = turno - t.turno - 1;
    if (idade < 0 || idade >= DURACAO_DA_MAGOA) return [];
    const cheia = MAGOA_DA_TROCA + MAGOA_POR_TROCA * (t.ordem - 1);
    return [
      { bussola: t.bussola, pontos: cheia * (1 - idade / DURACAO_DA_MAGOA) },
    ];
  });
}

/**
 * Troca o ministro de uma caixa; devolve o fato de quem foi demitido. A troca
 * pedida pelo jogador é polêmica: vira notícia maior a cada vez no mandato e
 * deixa mágoa nos grupos parecidos com quem saiu.
 */
function nomear(
  r: RegrasGoverno,
  e: EstadoGoverno,
  turno: number,
  idDaCaixa: string,
  ministro: string,
  doJogador = false,
): SaidaGoverno {
  const caixa = e.caixas.find((c) => c.id === idDaCaixa);
  if (!caixa) throw new Error(`pedido: a caixa "${idDaCaixa}" não existe`);
  fichaDe(r, ministro);
  if (e.caixas.some((c) => c.ministro === ministro))
    throw new Error(`pedido: ${ministro} já é ministro`);
  const saiu = fichaDe(r, caixa.ministro);
  const recentes = trocasRecentes(e, turno);
  const ordem = recentes.length + 1;
  const tamanho =
    TAMANHO_DA_TROCA[Math.min(ordem, TAMANHO_DA_TROCA.length) - 1];
  const doPartido = saiu.origem !== TECNICO;
  const fatos = [
    novoFato({
      tipo: "ministro-nomeado",
      turno,
      tamanho: "pequeno",
      sobre: idDaCaixa,
      quem: [ministro],
    }),
    ...(doJogador || doPartido
      ? [
          novoFato({
            tipo: "ministro-demitido",
            turno,
            tamanho: doJogador ? tamanho : "medio",
            sobre: idDaCaixa,
            quem: doPartido ? [saiu.origem] : [],
          }),
        ]
      : []),
  ];
  return {
    estado: {
      ...e,
      caixas: e.caixas.map((c) => (c === caixa ? { ...c, ministro } : c)),
      ...(doJogador
        ? { trocas: [...recentes, { turno, bussola: saiu.bussola, ordem }] }
        : {}),
    },
    fatos,
  };
}

/**
 * Uma fase do turno: as moedas Ministério oferecidas pelo Congresso e os
 * pedidos de nomear viram ministros; depois cada órgão anda um turno de
 * corrupção e o que cruzou o limite vira escândalo.
 */
export function andarGoverno(e: EntradaGoverno): SaidaGoverno {
  const ofertas = e.fatos.filter(
    (f) => f.tipo === "ministerio-oferecido" && f.turno === e.turno,
  );
  const nomeacoes: [string, string][] = [
    ...ofertas.flatMap((f): [string, string][] => {
      const [partido] = f.quem ?? [];
      return [[f.sobre ?? "", partido ?? ""]];
    }),
  ];
  let { estado } = e;
  const fatos: Fato[] = [];
  for (const [idDaCaixa, partido] of nomeacoes) {
    const [melhor] = candidatosDoPartido(e.regras, estado.caixas, partido);
    if (!melhor) continue;
    const r = nomear(e.regras, estado, e.turno, idDaCaixa, melhor.id);
    estado = r.estado;
    fatos.push(...r.fatos);
  }
  for (const p of e.pedidos) {
    const r = nomear(e.regras, estado, e.turno, p.caixa, p.ministro, true);
    estado = r.estado;
    fatos.push(...r.fatos);
  }
  const { orgaos, escandalos } = andarOrgaos(
    e.regras,
    estado.caixas,
    e.leis,
    e.valores,
    estado.orgaos,
    e.cargos,
  );
  for (const s of escandalos)
    fatos.push(
      novoFato({
        tipo: "escandalo",
        turno: e.turno,
        tamanho: "grande",
        sobre: s.instituicao,
        quem: s.ministro ? [s.ministro] : [],
      }),
    );
  return { estado: { ...estado, orgaos }, fatos };
}
