// Prévia direta de uma lei na janela da tela: o que a própria lei muda nos
// índices (fila de efeitos do motor) e na satisfação dos grupos (pontos de
// lei do motor). Sem efeito em cadeia: isso é a prévia completa, depois.
import {
  atrasoDasObras,
  enfileirar,
  pontosDaVerbaPorAno,
  pontosLeis,
  type ValorLei,
} from "../motor";
import type { Partida } from "./index";

export interface PreviaLei {
  /** Pontos (0–100) que a lei passa a dar a cada índice, contra hoje. */
  indices: {
    id: string;
    pontos: number;
    atrasoMeses: number;
    /** Pontos que se repetem a cada ano (ex.: casas construídas). */
    porAno?: boolean;
  }[];
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

/** Meses até a obra ficar pronta, com a corrupção de hoje. */
export function mesesDaObra({ regras, estado }: Partida): number {
  const obras = regras.mercado?.mercado.obras;
  if (!obras) return 0;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  return (
    Math.ceil(obras.prazo * atrasoDasObras(atraso).prazo) * MESES_POR_TURNO
  );
}

/** O que a verba de casas faz por ano: age pelo estoque, não pela fila de efeitos. */
function previaDaMoradia(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei["indices"] {
  const { estado, regras } = partida;
  const regra = regras.moradia;
  const obras = regras.mercado?.mercado.obras;
  const m = estado.moradia;
  const atual = estado.leis[leiId] ?? 0;
  if (regra?.lei_verba !== leiId || !obras || !m) return [];
  if (typeof valor !== "number" || typeof atual !== "number") return [];
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const pontos = -pontosDaVerbaPorAno(regra, valor - atual, atraso);
  if (Math.abs(pontos) < 1e-9) return [];
  const atrasoMeses = mesesDaObra(partida);
  return [
    { id: regra.indice_deficit, pontos, atrasoMeses, porAno: true },
    {
      id: regra.indice_favela,
      pontos: pontos * m.parte_precaria,
      atrasoMeses,
      porAno: true,
    },
  ];
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
  indices.push(...previaDaMoradia(partida, leiId, valor));
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
