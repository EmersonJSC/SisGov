// Governo: ministérios com fichas, órgãos por esfera e corrupção. O motor não
// conhece nomes de ministério nem de pessoa: moldes são do mundo, pessoas e
// escolhas são do país. Comportamento em governo.md.
import { novoFato, type Fato } from "../fatos";
import type { Lei, ValorLei } from "../leis";
import { candidatosDoPartido, fichaDe } from "./ministerios";
import { andarOrgaos, iniciarOrgaos } from "./orgaos";
import type {
  EstadoGoverno,
  GovernoDoPais,
  PedidoNomear,
  RegrasGoverno,
} from "./tipos";

export * from "./tipos";
export {
  ajusteDaCompetencia,
  ajusteDaLei,
  caixaDaLei,
  candidatosDoPartido,
  competenciaEfetiva,
  esferasDaCaixa,
  fichaDe,
  ministrosPorPartido,
} from "./ministerios";
export {
  LIMITE_DO_ESCANDALO,
  corrupcaoDeEquilibrio,
  corrupcaoSeguinte,
  esferasDoMundo,
  rendimentoDoOrgao,
  situacaoDoOrgao,
  verbaDaEsfera,
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
  const caixas = pais.ministerios.map(({ molde, ministro }) => ({
    molde,
    ministro,
  }));
  const cargos = fracaoDosCargos(r, leis, valores);
  return { caixas, orgaos: iniciarOrgaos(r, caixas, leis, valores, cargos) };
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
  const usados = pais.ministerios.map((c) => c.molde);
  for (const id of usados)
    if (!r.moldes.some((m) => m.id === id)) return `molde "${id}" não existe`;
  if (new Set(usados).size !== usados.length) return "molde repetido";
  const ministros = pais.ministerios.map((c) => c.ministro);
  for (const id of ministros)
    if (!ids.includes(id)) return `ministro "${id}" não existe`;
  if (new Set(ministros).size !== ministros.length)
    return "a mesma pessoa em duas caixas";
  const caixas = r.moldes.filter((m) => usados.includes(m.id));
  if (caixas.filter((m) => m.sobra).length !== 1)
    return "precisa de uma caixa para a sobra (o gabinete)";
  const refs = caixas.flatMap((m) =>
    m.esferas.map((e) => ({ molde: m.id, ...e })),
  );
  for (const [i, a] of refs.entries())
    for (const b of refs.slice(i + 1))
      if (
        a.molde !== b.molde &&
        a.esfera === b.esfera &&
        (a.subesfera === undefined ||
          b.subesfera === undefined ||
          a.subesfera === b.subesfera)
      )
        return `${a.esfera}${a.subesfera ? `: ${a.subesfera}` : ""} está em duas caixas (${a.molde} e ${b.molde})`;
  return null;
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

/** Troca o ministro de uma caixa; devolve o fato de quem foi demitido. */
function nomear(
  r: RegrasGoverno,
  e: EstadoGoverno,
  turno: number,
  molde: string,
  ministro: string,
): SaidaGoverno {
  const caixa = e.caixas.find((c) => c.molde === molde);
  if (!caixa) throw new Error(`pedido: a caixa "${molde}" não existe`);
  fichaDe(r, ministro);
  if (e.caixas.some((c) => c.ministro === ministro))
    throw new Error(`pedido: ${ministro} já é ministro`);
  const saiu = fichaDe(r, caixa.ministro);
  const fatos = [
    novoFato({
      tipo: "ministro-nomeado",
      turno,
      tamanho: "pequeno",
      sobre: molde,
      quem: [ministro],
    }),
    ...(saiu.origem === TECNICO
      ? []
      : [
          novoFato({
            tipo: "ministro-demitido",
            turno,
            tamanho: "medio",
            sobre: molde,
            quem: [saiu.origem],
          }),
        ]),
  ];
  return {
    estado: {
      ...e,
      caixas: e.caixas.map((c) => (c === caixa ? { ...c, ministro } : c)),
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
  for (const [molde, partido] of nomeacoes) {
    const [melhor] = candidatosDoPartido(e.regras, estado.caixas, partido);
    if (!melhor) continue;
    const r = nomear(e.regras, estado, e.turno, molde, melhor.id);
    estado = r.estado;
    fatos.push(...r.fatos);
  }
  for (const p of e.pedidos) {
    const r = nomear(e.regras, estado, e.turno, p.caixa, p.ministro);
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
        sobre: s.esfera,
        quem: [s.ministro],
      }),
    );
  return { estado: { ...estado, orgaos }, fatos };
}
