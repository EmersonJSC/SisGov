import type { MotivoDeMemoria, RegrasDoCongresso } from "./tipos";

/**
 * Memória das pessoas (População, "a população lembra").
 *
 * Um perfil vale milhares de pessoas, então a memória é de coorte: para cada
 * linha original do eleitorado, quanto do peso dela já foi desempregado e
 * voltou a trabalhar, e há quantos meses a parte desempregada está sem
 * emprego. A causa (que políticas levaram a isso) entra depois, por tags ou
 * índices, quando o módulo das leis a declarar; aqui só vale o fato.
 */
export type Coorte = Readonly<{
  /** Fração do peso da linha desempregada no último turno. */
  fracao: number;
  /** Fração do peso da linha que perdeu o emprego e voltou. */
  ex: number;
  /** Meses de desemprego de quem segue desempregado. */
  meses: number;
}>;

export type MemoriaDaPopulacao = Readonly<{
  /** Por índice da linha original; linha sem lembrança não aparece. */
  desemprego: Readonly<Record<string, Coorte>>;
}>;

const MINIMO = 1e-4;
const limitar = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));

/** Um turno de memória: a coorte de antes e a fração desempregada de agora. */
export function passoDaCoorte(
  antes: Coorte | undefined,
  fracao: number,
  esquecimento: number,
  mesesDoTurno: number,
): Coorte {
  const anterior = antes?.fracao ?? fracao;
  const voltaram = Math.max(0, anterior - fracao);
  const perderam = Math.max(0, fracao - anterior);
  const empregados = Math.max(MINIMO, 1 - anterior);
  // quem perde o emprego sai também do grupo dos que já tinham voltado
  const ex = (antes?.ex ?? 0) * (1 - perderam / empregados);
  const novoEx = limitar(ex * (1 - esquecimento) + voltaram, 0, 1 - fracao);
  // quem fica leva mais um turno sem emprego; quem chega dilui a média
  const meses =
    fracao > 0
      ? ((antes?.meses ?? 0) + mesesDoTurno) * Math.min(1, anterior / fracao)
      : 0;
  return { fracao, ex: novoEx, meses };
}

/** Passa o turno da memória do desemprego, linha a linha. */
export function passarMemoria(
  memoria: MemoriaDaPopulacao | undefined,
  fracoes: readonly number[],
  regras: RegrasDoCongresso,
): MemoriaDaPopulacao {
  const mesesDoTurno = 12 / regras.trocaTroca.turnosPorAno;
  const { esquecimentoPorTurno } = regras.memoria;
  const desemprego: Record<string, Coorte> = {};
  fracoes.forEach((fracao, i) => {
    const coorte = passoDaCoorte(
      memoria?.desemprego[i],
      fracao,
      esquecimentoPorTurno,
      mesesDoTurno,
    );
    if (coorte.fracao > MINIMO || coorte.ex > MINIMO) desemprego[i] = coorte;
  });
  return { desemprego };
}

/** O que a linha empregada lembra: gratidão de quem já esteve sem emprego. */
export function lembrancaDoEmpregado(
  memoria: MemoriaDaPopulacao | undefined,
  linha: number,
  regras: RegrasDoCongresso,
): readonly MotivoDeMemoria[] {
  const coorte = memoria?.desemprego[linha];
  if (!coorte || coorte.ex <= MINIMO) return [];
  const { gratidao, tags } = regras.memoria.desemprego;
  const parte = Math.min(1, coorte.ex / Math.max(MINIMO, 1 - coorte.fracao));
  return [{ id: "voltou_a_trabalhar", pontos: gratidao * parte, tags }];
}

/** O que a linha desempregada lembra: o desalento de quem espera há tempo. */
export function lembrancaDoDesempregado(
  memoria: MemoriaDaPopulacao | undefined,
  linha: number,
  regras: RegrasDoCongresso,
): readonly MotivoDeMemoria[] {
  const coorte = memoria?.desemprego[linha];
  if (!coorte || coorte.meses <= 0) return [];
  const { desalento, mesesDoDesalento, tags } = regras.memoria.desemprego;
  const parte = Math.min(1, coorte.meses / mesesDoDesalento);
  return [{ id: "desempregado_ha_tempo", pontos: -desalento * parte, tags }];
}
