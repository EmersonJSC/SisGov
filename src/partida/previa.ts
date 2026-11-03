// Prévia direta de uma lei na janela da tela: o que a própria lei muda nos
// índices (fila de efeitos do motor) e na satisfação dos grupos (pontos de
// lei do motor). Sem efeito em cadeia: isso é a prévia completa, depois.
import { enfileirar, pontosLeis, type ValorLei } from "../motor";
import type { Partida } from "./index";

export interface PreviaLei {
  /** Pontos (0–100) que a lei passa a dar a cada índice, contra hoje. */
  indices: { id: string; pontos: number; atrasoMeses: number }[];
  /** Pontos de satisfação que a lei dá a cada grupo, contra hoje. */
  grupos: { id: string; pontos: number }[];
}

const MESES_POR_TURNO = 2;

function leiDe(partida: Partida, leiId: string) {
  const lei = partida.regras.leis[leiId];
  if (!lei) throw new Error(`lei "${leiId}" não existe`);
  return lei;
}

/**
 * Do nível da tela ao valor do motor: % da faixa (contínua, no passo da lei)
 * ou índice da opção.
 */
export function valorDoNivel(
  partida: Partida,
  leiId: string,
  nivel: number,
): ValorLei {
  const lei = leiDe(partida, leiId);
  if (lei.forma === "opcoes") {
    const opcao = lei.opcoes[Math.round(nivel)];
    if (!opcao) throw new Error(`${leiId}: opção ${nivel} não existe`);
    return opcao.id;
  }
  const escala = lei.unidade === "fracao" ? 100 : 1;
  const passos = Math.round((nivel / escala - lei.faixa.min) / lei.passo);
  const valor = lei.faixa.min + passos * lei.passo;
  return Number(
    Math.min(lei.faixa.max, Math.max(lei.faixa.min, valor)).toFixed(6),
  );
}

export function previaDaLei(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei {
  const lei = leiDe(partida, leiId);
  const { estado, regras } = partida;
  const fila = enfileirar(estado.efeitos, lei, valor).filter(
    (e) => e.lei === leiId,
  );
  const indices = fila
    .map((e) => ({
      id: e.indice,
      pontos: e.para - e.de,
      atrasoMeses: e.atraso * MESES_POR_TURNO,
    }))
    .filter((e) => Math.abs(e.pontos) > 1e-9);
  const so = { [leiId]: lei };
  const grupos = regras.grupos
    .map((g) => ({
      id: g.id,
      pontos: pontosLeis(
        g,
        so,
        { [leiId]: valor },
        { [leiId]: estado.leis[leiId] },
      ),
    }))
    .filter((g) => Math.abs(g.pontos) > 1e-9);
  return { indices, grupos };
}
