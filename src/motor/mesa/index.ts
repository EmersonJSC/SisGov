// Mesa do presidente: os papéis que chegam e esperam o carimbo. Comportamento
// em mesa.md. Por ora só a família Leis.
import type { PedidoCongresso, Tramitacao, Votacao } from "../politica";

export type Familia = "leis";

/** Papel que pede decisão ("sancao") ou só avisa ("aviso"). */
export type TipoDePapel = "sancao" | "aviso";

export type MotivoDoAviso =
  "lei-aprovada" | "veto-derrubado" | "veto-mantido" | "decreto";

export interface Papel {
  id: string;
  familia: Familia;
  tipo: TipoDePapel;
  lei: string;
  valor: Tramitacao["valor"];
  /** Turno em que chegou à mesa. */
  turno: number;
  /** Turno em que o prazo acaba (só papel de decisão). */
  prazo: number | null;
  motivo?: MotivoDoAviso;
}

export type Carimbo = "assinar" | "vetar";

/** Carimbo do jogador em um papel da mesa. */
export interface PedidoCarimbar {
  tipo: "carimbar";
  papel: string;
  carimbo: Carimbo;
  observacao?: string;
}

const PRAZO_EM_TURNOS = 1;

/** Aviso que a votação do turno gera, ou null se não muda nada para o jogador. */
function avisoDe(v: Votacao): MotivoDoAviso | null {
  if (v.origem === "derrubada-do-veto")
    return v.muda_lei ? "veto-derrubado" : "veto-mantido";
  if (!v.muda_lei) return null;
  return v.origem === "decreto" || v.origem === "decreto-derrubado"
    ? "decreto"
    : "lei-aprovada";
}

/**
 * A mesa ao fim do turno: um papel de decisão para cada lei emendada que
 * espera assinatura e um aviso para cada votação que mudou lei ou veto.
 */
export function montarMesa(
  turno: number,
  sancao: readonly Tramitacao[],
  votacoes: readonly Votacao[],
): Papel[] {
  const decisoes = sancao.map((t): Papel => ({
    id: `${t.lei}#${t.desde}`,
    familia: "leis",
    tipo: "sancao",
    lei: t.lei,
    valor: t.valor,
    turno,
    prazo: t.desde + PRAZO_EM_TURNOS,
  }));
  const avisos = votacoes.flatMap((v, i): Papel[] => {
    const motivo = avisoDe(v);
    return motivo
      ? [
          {
            id: `${v.lei}!${turno}.${i}`,
            familia: "leis",
            tipo: "aviso",
            lei: v.lei,
            valor: v.valor,
            turno,
            prazo: null,
            motivo,
          },
        ]
      : [];
  });
  return [...decisoes, ...avisos];
}

/** Carimbos viram assinar ou vetar da lei do papel; o resto passa direto. */
export function traduzirCarimbos(
  mesa: readonly Papel[],
  pedidos: readonly (PedidoCongresso | PedidoCarimbar)[],
): PedidoCongresso[] {
  return pedidos.flatMap((p): PedidoCongresso[] => {
    if (p.tipo !== "carimbar") return [p];
    const papel = mesa.find((x) => x.id === p.papel);
    if (!papel)
      throw new Error(`pedido: o papel "${p.papel}" não está na mesa`);
    if (papel.tipo !== "sancao")
      throw new Error(`pedido: o papel "${p.papel}" não pede carimbo`);
    return [
      p.carimbo === "vetar"
        ? {
            tipo: "vetar",
            lei: papel.lei,
            ...(p.observacao ? { observacao: p.observacao } : {}),
          }
        : { tipo: "assinar", lei: papel.lei },
    ];
  });
}
