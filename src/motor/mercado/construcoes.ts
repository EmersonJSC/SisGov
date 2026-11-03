// Construções dos setores e fila de obras (src/motor/mercado/mercado.md, 12b
// pilar 1). O PIB real é a soma da capacidade pronta; o investimento privado
// abre obras, freado por juro e imposto sobre lucro. O motor não conhece nomes
// de setor nem de índice: o mundo declara qual setor constrói e qual índice
// atrasa.
import type { ErroMercado, Mercado } from "./index";

/** O que o mundo declara sobre as obras (`obras` em produtos.json). */
export interface RegraDasObras {
  /** Setor que constrói: o tamanho dele decide quanto anda ao mesmo tempo. */
  setor: string;
  /** Índice (0 a 100) que atrasa e encarece as obras. */
  indice_atraso: string;
  /** Turnos de uma obra sem atraso. */
  prazo: number;
  /** Parte da capacidade que se perde por ano (0 a 1). */
  desgaste: number;
}

export interface Obra {
  setor: string;
  /** Capacidade que entrega, em % do PIB real do turno 0. */
  tamanho: number;
  /** Turnos de trabalho que faltam (pode ser fracionário). */
  falta: number;
}

export interface ConstrucoesNoEstado {
  /** Capacidade pronta de cada setor, em % do PIB real do turno 0. */
  prontas: Record<string, number>;
  /** Obras em ordem de chegada; as primeiras andam, o resto espera vaga. */
  obras: Obra[];
  /** Capacidade de cada setor no turno 0 (régua das vagas e do PIB). */
  inicio: Record<string, number>;
  /** Contas de lucro por setor; ausente em partida salva antes do 1b. */
  lucro?: ContasDoLucro;
}

export interface ContasDoLucro {
  /** Salários de cada setor no turno 0, em % do PIB real do turno 0. */
  salarios: Record<string, number>;
  /** Preço médio dos produtos de cada setor no turno 0. */
  preco0: Record<string, number>;
  /** Turnos seguidos de prejuízo de cada setor. */
  seguidos: Record<string, number>;
}

/** Resultado de um setor no turno. */
export interface LucroDoSetor {
  /** Lucro depois do imposto, em % do PIB real do turno 0 (negativo = prejuízo). */
  liquido: number;
  /** Margem de hoje ÷ margem do turno 0 do próprio setor; 1 = como começou. */
  relativa: number;
}

/** Pontos de juro acima do turno 0 que tiram 8% do investimento cada. */
const FREIO_POR_PONTO_DE_JURO = 0.08;
/** Pontos de imposto sobre lucro acima do turno 0 que tiram 3% cada. */
const FREIO_POR_PONTO_DE_IMPOSTO = 0.03;
/** Com o índice de atraso em 100, a obra demora o dobro. */
const ATRASO_MAXIMO = 1;
/** Com o índice de atraso em 100, a obra custa 50% a mais. */
const SOBRECUSTO_MAXIMO = 0.5;
/** Folga da construção civil no turno 0: anda 1,5 vez o que o ritmo pede. */
const FOLGA_DA_CONSTRUCAO = 1.5;
/** Turnos seguidos de prejuízo até o setor começar a fechar. */
export const TURNOS_ATE_FECHAR = 3;
/** Parte da capacidade que um setor em prejuízo fechado perde por turno. */
export const FECHAMENTO_POR_TURNO = 0.05;
/** A margem relativa pesa de 0 a 2 na divisão do investimento. */
const PESO_MAXIMO_DA_MARGEM = 2;
const TURNOS_POR_ANO = 6;

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Valida `obras` de produtos.json; ausente = sem construções. */
export function validarRegraDasObras(
  dado: unknown,
  mercado: Pick<Mercado, "setores">,
): ErroMercado[] {
  if (dado === undefined) return [];
  if (!ehObjeto(dado))
    return [{ campo: "obras", motivo: "precisa ser um objeto" }];
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) =>
    erros.push({ campo: `obras.${campo}`, motivo });
  if (!mercado.setores.some((s) => s.id === dado.setor))
    erro("setor", "setor não existe");
  if (typeof dado.indice_atraso !== "string" || dado.indice_atraso === "")
    erro("indice_atraso", "precisa ter índice");
  if (typeof dado.prazo !== "number" || !(dado.prazo >= 1))
    erro("prazo", "precisa ser um número ≥ 1");
  if (
    typeof dado.desgaste !== "number" ||
    !(dado.desgaste >= 0 && dado.desgaste < 1)
  )
    erro("desgaste", "precisa ser um número de 0 a 1");
  return erros;
}

/** Quanto a obra demora e custa a mais com o índice de atraso (0 a 100). */
export function atrasoDasObras(indice: number) {
  const parte = Math.min(1, Math.max(0, indice / 100));
  return {
    prazo: 1 + ATRASO_MAXIMO * parte,
    custo: 1 + SOBRECUSTO_MAXIMO * parte,
  };
}

/**
 * Investimento que vira capacidade por ano, em % da capacidade de hoje, para o
 * país crescer `tendencia` com o atraso do turno 0. É o ritmo do turno 0.
 */
export function investimentoBase(
  regra: RegraDasObras,
  tendencia: number,
  atraso: number,
): number {
  return (tendencia + regra.desgaste * 100) * atrasoDasObras(atraso).custo;
}

/** Fator do investimento (0 a 2): juro e imposto acima do turno 0 freiam. */
export function animoDoInvestimento(
  juro: number,
  juroInicial: number,
  impostoLucro: number,
  impostoInicial: number,
): number {
  const fator =
    1 -
    FREIO_POR_PONTO_DE_JURO * (juro - juroInicial) -
    FREIO_POR_PONTO_DE_IMPOSTO * 100 * (impostoLucro - impostoInicial);
  return Math.min(2, Math.max(0, fator));
}

const somar = (r: Record<string, number>) =>
  Object.values(r).reduce((s, v) => s + v, 0);

/** PIB real de hoje ÷ o do turno 0. */
export const tamanhoDaEconomia = (c: ConstrucoesNoEstado) =>
  somar(c.inicio) > 0 ? somar(c.prontas) / somar(c.inicio) : 1;

/** Volume que a construção civil toca ao mesmo tempo, em % do PIB do turno 0. */
function vagas(
  regra: RegraDasObras,
  c: ConstrucoesNoEstado,
  ritmo: number,
  atraso: number,
): number {
  const hoje = c.prontas[regra.setor] ?? 0;
  const antes = c.inicio[regra.setor] ?? 0;
  const porTurno = (ritmo / 100 / TURNOS_POR_ANO) * somar(c.inicio);
  const prazo = regra.prazo * atrasoDasObras(atraso).prazo;
  const tocado = FOLGA_DA_CONSTRUCAO * porTurno * prazo;
  return antes > 0 ? (tocado * hoje) / antes : tocado;
}

/**
 * Construções do turno 0: capacidade de cada setor = a renda que ele paga (%
 * do PIB), e obras em andamento no ritmo de hoje, uma por setor e turno.
 */
export function construcoesIniciais(
  regra: RegraDasObras,
  porSetor: Record<string, number>,
  tendencia: number,
  atraso: number,
  lucro?: Pick<ContasDoLucro, "salarios" | "preco0">,
): ConstrucoesNoEstado {
  const prontas = { ...porSetor };
  const lento = atrasoDasObras(atraso).prazo;
  const ritmo = (tendencia + regra.desgaste * 100) / 100 / TURNOS_POR_ANO;
  // Uma leva por turno de prazo; `falta` em turnos de trabalho sem atraso.
  const obras: Obra[] = [];
  for (let t = 1; t <= Math.ceil(regra.prazo * lento); t++)
    for (const [setor, v] of Object.entries(prontas))
      if (v > 0)
        obras.push({
          setor,
          tamanho: ritmo * v,
          falta: Math.min(regra.prazo, t / lento),
        });
  return {
    prontas,
    obras,
    inicio: { ...porSetor },
    lucro: lucro && {
      ...lucro,
      seguidos: Object.fromEntries(Object.keys(porSetor).map((id) => [id, 0])),
    },
  };
}

/** Preço médio dos produtos de cada setor (sem produto, fica 100). */
export function precoDosSetores(
  mercado: Pick<Mercado, "produtos">,
  precos: Record<string, { valor: number }>,
): Record<string, number> {
  const soma: Record<string, { total: number; n: number }> = {};
  for (const p of mercado.produtos) {
    const preco = precos[p.id];
    if (!preco) continue;
    const s = (soma[p.setor] ??= { total: 0, n: 0 });
    s.total += preco.valor;
    s.n += 1;
  }
  return Object.fromEntries(
    Object.entries(soma).map(([id, s]) => [id, s.total / s.n]),
  );
}

/**
 * Lucro de cada setor: receita (capacidade × preço de hoje ÷ o do turno 0) −
 * salários (seguem a capacidade, não caem com o preço) − imposto sobre o lucro.
 * Setor sem lucro no turno 0 (do Estado) não tem dono privado: não entra.
 */
export function lucroDosSetores(
  c: ConstrucoesNoEstado,
  preco: Record<string, number>,
  imposto: number,
  impostoInicial: number,
): Record<string, LucroDoSetor> {
  const l = c.lucro;
  const saida: Record<string, LucroDoSetor> = {};
  if (!l) return saida;
  for (const [id, pronta] of Object.entries(c.prontas)) {
    const inicio = c.inicio[id] ?? 0;
    const lucro0 = inicio - (l.salarios[id] ?? 0);
    if (!(inicio > 0) || !(lucro0 > 0)) continue;
    const preco0 = l.preco0[id] ?? 0;
    const razao = preco0 > 0 ? (preco[id] ?? preco0) / preco0 : 1;
    const parte = pronta / inicio;
    const bruto = pronta * razao - (l.salarios[id] ?? 0) * parte;
    const liquido = bruto > 0 ? bruto * (1 - imposto) : bruto;
    const margem0 = (lucro0 / inicio) * (1 - impostoInicial);
    saida[id] = {
      liquido,
      relativa: pronta > 0 && margem0 > 0 ? liquido / pronta / margem0 : 0,
    };
  }
  return saida;
}

export interface TurnoDasObras {
  /** Investimento do turno, em % do PIB real do turno 0. */
  investimento: number;
  /** Índice de atraso de hoje (0 a 100). */
  atraso: number;
  /** Perda extra de capacidade por ano, em % (ex.: falta de energia). */
  perdaExtra: number;
  /** Lucro de cada setor (`lucroDosSetores`); sem ele não há fechamento. */
  lucro?: Record<string, LucroDoSetor>;
}

/**
 * Um turno: a capacidade desgasta, as obras que cabem nas vagas andam, as
 * prontas entram na capacidade e o investimento abre obras novas, divididas
 * pelos setores conforme o tamanho de cada um.
 */
export function andarConstrucoes(
  regra: RegraDasObras,
  c: ConstrucoesNoEstado,
  ritmo: number,
  turno: TurnoDasObras,
): ConstrucoesNoEstado {
  const perda =
    (regra.desgaste * 100 + turno.perdaExtra) / 100 / TURNOS_POR_ANO;
  const prontas: Record<string, number> = {};
  const seguidos: Record<string, number> = {};
  for (const [setor, v] of Object.entries(c.prontas)) {
    // Prejuízo seguido: o setor fecha aos poucos até voltar a dar lucro.
    const prejuizo = (turno.lucro?.[setor]?.liquido ?? 0) < 0;
    seguidos[setor] = prejuizo ? (c.lucro?.seguidos[setor] ?? 0) + 1 : 0;
    const fecha =
      seguidos[setor] >= TURNOS_ATE_FECHAR ? FECHAMENTO_POR_TURNO : 0;
    prontas[setor] = v * Math.max(0, 1 - perda) * (1 - fecha);
  }
  const passo = 1 / atrasoDasObras(turno.atraso).prazo;
  let livre = vagas(regra, c, ritmo, turno.atraso);
  const obras: Obra[] = [];
  for (const obra of c.obras) {
    if (livre < obra.tamanho - 1e-12) {
      obras.push(obra);
      continue;
    }
    livre -= obra.tamanho;
    // As obras antigas já vêm com o prazo inteiro; o passo encurta ou alonga.
    const falta = obra.falta - passo;
    if (falta <= 1e-9)
      prontas[obra.setor] = (prontas[obra.setor] ?? 0) + obra.tamanho;
    else obras.push({ ...obra, falta });
  }
  // O capital vai mais para onde a margem melhorou (peso 1 = como começou).
  const peso = (setor: string, v: number) =>
    v *
    Math.min(
      PESO_MAXIMO_DA_MARGEM,
      Math.max(0, turno.lucro?.[setor]?.relativa ?? 1),
    );
  const total = Object.entries(c.prontas).reduce(
    (s, [setor, v]) => s + peso(setor, v),
    0,
  );
  const custo = atrasoDasObras(turno.atraso).custo;
  if (turno.investimento > 0 && total > 0)
    for (const [setor, v] of Object.entries(c.prontas))
      if (peso(setor, v) > 0)
        obras.push({
          setor,
          tamanho: (turno.investimento * peso(setor, v)) / total / custo,
          falta: regra.prazo,
        });
  return {
    prontas,
    obras,
    inicio: c.inicio,
    lucro: c.lucro && { ...c.lucro, seguidos },
  };
}

/** Obras de cada setor: andando e na fila, em % do PIB real do turno 0. */
export function obrasPorSetor(c: ConstrucoesNoEstado) {
  const soma: Record<string, { obras: number; volume: number }> = {};
  for (const o of c.obras) {
    const s = (soma[o.setor] ??= { obras: 0, volume: 0 });
    s.obras += 1;
    s.volume += o.tamanho;
  }
  return soma;
}
