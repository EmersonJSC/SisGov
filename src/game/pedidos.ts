/**
 * O ministro como porta-voz (M8.3, fatia D, passo 2). De vez em quando, um
 * ministro leva ao presidente uma lei que ele e os grupos leais a ele querem:
 * a opção da lei, na área dele, mais alinhada com o ponto médio desses grupos.
 * Aceitar agrada esses grupos; recusar os desagrada. O efeito é um favor por
 * grupo, que decai a cada turno. O Senado não sabe disso: só vê a lei.
 */
import type { ResolvedPackage } from "../engine";
import type { PolicyState } from "./leis/policyState";
import { policyInForce } from "./policyRequirements";
import { bussolaDoMundo, type PontoDaBussola } from "./bussola";
import type { Personagem } from "./eleicao";
import { chanceNoTurno } from "./calendario";
import { roll } from "./randomState";

/** Chance por turno de um ministro trazer um pedido: base e por ponto de articulação (0 a 3). */
export const CHANCE_BASE = 0.02;
export const CHANCE_POR_ARTICULACAO = 0.02;
/** Ministro com a base insatisfeita (nota abaixo disto) pede com mais chance. */
export const NOTA_DE_INSATISFEITO = 45;
export const FATOR_INSATISFEITO = 2;
/** Pontos de satisfação que aceitar ou recusar dá aos grupos leais. */
export const FAVOR_DO_PEDIDO = 3;
/** O favor que sobra para o turno seguinte. */
export const DECAIMENTO_DO_FAVOR = 0.5;
const FAVOR_MINIMO = 0.25;

export type PedidoDoMinistro = Readonly<{
  area: string;
  lei: string;
  /** Opção pedida (id) e o nível dela. */
  opcao: string;
  nivel: number;
  turno: number;
}>;

export type LealDoMinistro = Readonly<{
  area: string;
  nota: number;
  leais: readonly string[];
}>;

/** A opção da lei mais alinhada com o ponto dos grupos leais, ou nada. */
export function opcaoPedida(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  lei: string,
  alvo: PontoDaBussola,
): Readonly<{ opcao: string; nivel: number; ganho: number }> | undefined {
  const policy = content.policies.find((p) => p.id === lei);
  const vetores = bussolaDoMundo.leis[lei]?.opcoes;
  if (!policy || !vetores) return undefined;
  const atual = policyInForce(policies, lei)?.desiredLevel;
  let melhor: { opcao: string; nivel: number; ganho: number } | undefined;
  for (const o of policy.controle.opcoes ?? []) {
    const v = vetores[o.id];
    if (!v || (atual !== undefined && Math.abs(atual - o.valor) < 1e-9))
      continue;
    const ganho = v[0] * alvo.economia + v[1] * alvo.costumes;
    if (ganho > 0 && (!melhor || ganho > melhor.ganho))
      melhor = { opcao: o.id, nivel: o.valor, ganho };
  }
  return melhor;
}

/** Quem leva um pedido neste turno (no máximo um), ou ninguém. */
export function sortearPedido(entrada: {
  content: ResolvedPackage;
  policies: readonly PolicyState[];
  ministros: Readonly<Record<string, Personagem>>;
  leais: readonly LealDoMinistro[];
  /** Ponto médio dos grupos leais de cada área. */
  alvos: Readonly<Record<string, PontoDaBussola>>;
  leisDaArea: Readonly<Record<string, readonly string[]>>;
  /** Leis que não podem ser pedidas agora (já na fila, por exemplo). */
  excluir: ReadonlySet<string>;
  seed: number;
  turno: number;
}): PedidoDoMinistro | undefined {
  const { ministros, seed, turno } = entrada;
  const candidatos = entrada.leais.flatMap((l) => {
    const m = ministros[l.area];
    const alvo = entrada.alvos[l.area];
    if (!m || !alvo || l.leais.length === 0) return [];
    const articulacao = m.atributos?.articulacao ?? 2;
    const chance = chanceNoTurno(
      (CHANCE_BASE + CHANCE_POR_ARTICULACAO * articulacao) *
        (l.nota < NOTA_DE_INSATISFEITO ? FATOR_INSATISFEITO : 1),
    );
    const sorte = roll(seed, turno, `pedido:${l.area}`);
    if (sorte >= chance) return [];
    const pedida = (entrada.leisDaArea[l.area] ?? [])
      .filter((lei) => !entrada.excluir.has(lei))
      .flatMap((lei) => {
        const o = opcaoPedida(entrada.content, entrada.policies, lei, alvo);
        return o ? [{ lei, ...o }] : [];
      })
      .sort((a, b) => b.ganho - a.ganho || a.lei.localeCompare(b.lei))[0];
    return pedida ? [{ area: l.area, sorte: sorte / chance, pedida }] : [];
  });
  const vencedor = candidatos.sort((a, b) => a.sorte - b.sorte)[0];
  return vencedor
    ? {
        area: vencedor.area,
        lei: vencedor.pedida.lei,
        opcao: vencedor.pedida.opcao,
        nivel: vencedor.pedida.nivel,
        turno,
      }
    : undefined;
}

export type Favores = Readonly<Record<string, number>>;

/** O favor que a resposta dá aos grupos leais (positivo ao aceitar). */
export function favorDaResposta(
  atuais: Favores | undefined,
  leais: readonly string[],
  aceitou: boolean,
): Favores {
  const novos: Record<string, number> = { ...atuais };
  for (const g of leais)
    novos[g] = (novos[g] ?? 0) + (aceitou ? FAVOR_DO_PEDIDO : -FAVOR_DO_PEDIDO);
  return novos;
}

/** Passa um turno: o favor perde metade e some o que ficou pequeno. */
export function decairFavores(favores: Favores | undefined): Favores {
  return Object.fromEntries(
    Object.entries(favores ?? {})
      .map(([g, p]) => [g, p * DECAIMENTO_DO_FAVOR] as const)
      .filter(([, p]) => Math.abs(p) >= FAVOR_MINIMO),
  );
}
