/**
 * Promessa contra ação (M8.2/M8.3). O presidente chegou dizendo o que pensa
 * (as opiniões vêm do ponto dele na bússola): o lado para onde ele quer
 * levar o país é o do ponto dele em relação ao ponto em que o governo
 * começou. Se as leis levam o governo para o lado contrário, a população
 * estranha o que ele disse e fez: tira satisfação de todos os grupos, com
 * teto, como o gabinete. Não ter feito o que prometeu não pesa: só o
 * caminho ao contrário.
 */
import type { ResolvedPackage } from "../engine";
import {
  pontoAtual,
  type EstadoDaBussola,
  type PontoDaBussola,
} from "./bussola";
import type { CongressoDoPacote } from "./congresso";
import type { Personagem } from "./eleicao";
import type { PolicyState } from "./leis/policyState";
import { gruposNaBussola, pontosDoGabinete, somarPontos } from "./gabinete";

/** O quanto de caminho ao contrário (em pontos da bússola) ainda passa por ruído. */
export const TOLERANCIA_DA_PROMESSA = 1;
/** Pontos de satisfação tirados por ponto da bússola além da tolerância. */
export const PESO_DA_PROMESSA = 0.5;
/** Teto da perda, em pontos de satisfação. */
export const TETO_DA_PROMESSA = 4;

export type Descumprimento = Readonly<{
  economia: number;
  costumes: number;
  total: number;
}>;

/** Quanto o governo andou, em cada eixo, contra o lado que o presidente disse querer. */
export function descumprimento(
  presidente: PontoDaBussola,
  inicio: PontoDaBussola,
  atual: PontoDaBussola,
): Descumprimento {
  const contra = (quer: number, foi: number) =>
    quer === 0 ? 0 : Math.max(0, -Math.sign(quer) * foi);
  const economia = contra(
    presidente.economia - inicio.economia,
    atual.economia - inicio.economia,
  );
  const costumes = contra(
    presidente.costumes - inicio.costumes,
    atual.costumes - inicio.costumes,
  );
  return { economia, costumes, total: economia + costumes };
}

/** Pontos de satisfação que a perda por descumprir a promessa custa a todos. */
export function perdaDaPromessa(d: Descumprimento): number {
  return Math.min(
    TETO_DA_PROMESSA,
    Math.max(0, d.total - TOLERANCIA_DA_PROMESSA) * PESO_DA_PROMESSA,
  );
}

type Governo = Readonly<{
  content: ResolvedPackage;
  game: Readonly<{
    policies: readonly PolicyState[];
    compass?: EstadoDaBussola;
    election?: Readonly<{
      presidente: Personagem;
      ministros?: Readonly<Record<string, Personagem>>;
      favores?: Readonly<Record<string, number>>;
    }>;
  }>;
}>;

/** O que o presidente prometeu e o governo fez, agora. */
export function descumprimentoDoGoverno(
  governo: Governo,
): Descumprimento | undefined {
  const { content, game } = governo;
  if (!game.compass || !game.election) return undefined;
  return descumprimento(
    game.election.presidente.ponto,
    game.compass.inicio,
    pontoAtual(content, game.compass, game.policies),
  );
}

/**
 * Tudo que o governo soma ou tira da satisfação de cada grupo além do que o
 * motor calcula: o gabinete (popularidade dos ministros e favores) e a
 * promessa contra a ação.
 */
export function pontosDoGoverno(
  governo: Governo,
  pacote: CongressoDoPacote | undefined,
  satisfacao: Readonly<Record<string, number>>,
): Readonly<Record<string, number>> {
  const gabinete = pontosDoGabinete(
    governo.game.election?.ministros,
    pacote,
    satisfacao,
    governo.game.election?.favores,
  );
  const d = descumprimentoDoGoverno(governo);
  const perda = d && pacote ? perdaDaPromessa(d) : 0;
  if (perda === 0 || !pacote) return gabinete;
  return somarPontos(
    gabinete,
    Object.fromEntries(gruposNaBussola(pacote).map((g) => [g.id, -perda])),
  );
}
