// Saída (passo G, GDD 2.8): quem sai da carteira, do país ou tira o dinheiro.
// Cada saída tem a sua causa e a sua tomada; o motor só conhece as chaves.
import type { Estrato, Migracao, Pop, PopPais, TipoPop } from ".";

/** Regras da saída (mundo `pops.json › saida`). */
export interface RegraDaSaida {
  /**
   * Informal: o encargo das leis (tomada `informal`, parte dos formais que o
   * custo tira da carteira) manda gente dos `formais` para o `pop`. A verba de
   * `lei_fiscal` acima da do turno 0 segura; abaixo, solta.
   */
  informal?: {
    pop: string;
    formais: string[];
    lei_fiscal?: string;
    /** Parte do caminho até o alvo andada por turno. */
    ritmo: number;
  };
  /**
   * Emigrar: com o padrão de vida abaixo do inicial, sai até `estratos[e]` do
   * pop (ou `TipoPop.emigra`); volta quando melhora. Tomada `trava_emigrar`.
   */
  emigrar?: { estratos: Partial<Record<Estrato, number>>; ritmo: number };
  /**
   * Dinheiro: com o padrão de vida dos `estratos` abaixo do inicial, até
   * `teto` da renda deles vai para fora. Tomada `trava_dinheiro`.
   */
  dinheiro?: { estratos: Estrato[]; teto: number; ritmo: number };
}

/** O que a saída guarda de um turno para o outro. */
export interface SaidaNoEstado {
  /** Encargo das leis que já andou (parte dos formais que foi ao informal). */
  encargo: number;
  /** Parte de cada pop que está fora do país (0 a 1 das pessoas do turno 0). */
  fora: Record<string, number>;
  /** Parte da renda dos estratos ricos que está fora do país (0 a 1). */
  dinheiro: number;
  /** A população do próximo turno: × este fator (quem emigrou ou voltou). */
  fator: number;
}

const entre01 = (v: number) => Math.min(1, Math.max(0, v));
/** Quanto o padrão de vida caiu abaixo do inicial (0 = igual ou melhor, 1 = no fundo). */
export const piora = (padrao: number, inicial: number) =>
  entre01((inicial - padrao) / inicial);

/** Um turno do informal: o encargo anda e leva gente dos formais ao pop informal. */
export function andarInformal(
  pais: Record<string, PopPais>,
  regra: NonNullable<RegraDaSaida["informal"]>,
  encargo: number,
  alvo: number,
  migracao: Migracao | undefined,
): { encargo: number; migracao: Migracao } {
  const novo = encargo + regra.ritmo * (alvo - encargo);
  const mig: Migracao = { ...migracao };
  for (const id of regra.formais) {
    const saiu = (pais[id]?.parcela_pessoas ?? 0) * (novo - encargo);
    mig[id] = (mig[id] ?? 0) - saiu;
    mig[regra.pop] = (mig[regra.pop] ?? 0) + saiu;
  }
  return { encargo: novo, migracao: mig };
}

/**
 * Um turno da emigração: cada pop anda até o alvo de gente fora; quem sai
 * deixa a população, quem volta entra. `fator` multiplica a população; as
 * partes dos outros pops sobem para eles não mudarem de tamanho.
 */
export function andarEmigracao(
  tipos: TipoPop[],
  pais: Record<string, PopPais>,
  regra: NonNullable<RegraDaSaida["emigrar"]>,
  fora: Record<string, number>,
  pops: Record<string, Pop>,
  padraoInicial: number,
  trava: number,
  migracao: Migracao | undefined,
): { fora: Record<string, number>; migracao: Migracao; fator: number } {
  const novoFora = { ...fora };
  const saiu: Record<string, number> = {};
  let total = 0;
  for (const t of tipos) {
    const parcela = pais[t.id]?.parcela_pessoas ?? 0;
    const teto = t.emigra ?? regra.estratos[t.estrato] ?? 0;
    const padrao = pops[t.id]?.padrao;
    if (!(parcela > 0) || !(teto > 0) || padrao === undefined) continue;
    const alvo = teto * piora(padrao, padraoInicial) * (1 - entre01(trava));
    const agora = fora[t.id] ?? 0;
    let passo = regra.ritmo * (alvo - agora);
    // Não sai mais gente do que o pop tem.
    const resta = parcela + (migracao?.[t.id] ?? 0);
    passo = Math.min(passo, Math.max(0, resta) / parcela);
    if (passo === 0) continue;
    novoFora[t.id] = agora + passo;
    saiu[t.id] = passo * parcela;
    total += passo * parcela;
  }
  if (total === 0)
    return { fora: novoFora, migracao: { ...migracao }, fator: 1 };
  const fator = 1 - total;
  const mig: Migracao = {};
  for (const t of tipos) {
    const parcela = pais[t.id]?.parcela_pessoas ?? 0;
    const agora = parcela + (migracao?.[t.id] ?? 0) - (saiu[t.id] ?? 0);
    mig[t.id] = agora / fator - parcela;
  }
  return { fora: novoFora, migracao: mig, fator };
}

/** Um turno do dinheiro que sai: anda até o alvo pelo padrão de vida dos ricos. */
export function andarDinheiro(
  tipos: TipoPop[],
  regra: NonNullable<RegraDaSaida["dinheiro"]>,
  dinheiro: number,
  pops: Record<string, Pop>,
  padraoInicial: number,
  trava: number,
): number {
  let pessoas = 0;
  let soma = 0;
  for (const t of tipos) {
    const p = pops[t.id];
    if (!regra.estratos.includes(t.estrato) || p?.padrao === undefined)
      continue;
    pessoas += p.pessoas;
    soma += p.pessoas * p.padrao;
  }
  if (!(pessoas > 0)) return dinheiro;
  const alvo =
    regra.teto * piora(soma / pessoas, padraoInicial) * (1 - entre01(trava));
  return dinheiro + regra.ritmo * (alvo - dinheiro);
}
