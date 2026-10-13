import { changePolicyTarget, createDecreedPolicyState } from "../../game/leis";
import {
  applyRequirementFalls,
  policyInForce,
  policyRequirements,
  requirementBlock,
  revocationBlock,
  revokePolicyState,
} from "../../game/policyRequirements";
import { commitPolicyAction } from "../../game/commitPolicyAction";
import { policyLevelRulesFromContent } from "../../game/policyRulesFromContent";
import type { Resultado, Partida, VisaoQueda } from "./tipos";
import { falha } from "./comum";
import { nivelNoCongresso } from "../../game/tramitacao";
import { enviarAoCongresso } from "./tramitacao";

/** Escolhe um novo nível (ou o valor de uma opção) para uma lei. */
export function mudarLei(
  partida: Partida,
  leiId: string,
  nivel: number,
): Resultado<Partida> {
  const { game, content } = partida;
  const definition = policyLevelRulesFromContent(content, leiId);
  if (!definition.ok) return falha(definition.diagnostics);
  // Pedir a meta que já está valendo não é uma nova ação (SG159).
  const atual = policyInForce(game.policies, leiId);
  if (atual && Math.abs(atual.desiredLevel - nivel) < 1e-9)
    return { ok: true, value: partida };
  if (partida.modo === "real") {
    // V1-12: o que precisa de votação vai para a fila do Congresso
    const policy = content.policies.find((p) => p.id === leiId);
    if (policy && game.congress && nivelNoCongresso(policy) !== "decreto")
      return enviarAoCongresso(partida, leiId, nivel);
    const committed = commitPolicyAction(game, content, {
      id: `acao-${partida.acoes + 1}`,
      policyId: leiId,
      desiredLevel: nivel,
    });
    if (!committed.ok) return falha(committed.diagnostics);
    return {
      ok: true,
      value: { ...partida, game: committed.value, acoes: partida.acoes + 1 },
    };
  }
  return aplicarMeta(partida, leiId, nivel);
}

/**
 * Leis filhas que cairiam para a base se a lei mudasse para `nivel` (SG138),
 * em cascata. Não muda a partida: serve para avisar antes de assinar.
 */
export function leisQueCaem(
  partida: Partida,
  leiId: string,
  nivel: number,
): readonly VisaoQueda[] {
  const { game, content } = partida;
  const hipotese = game.policies.map((state) =>
    state.policyDefinitionId === leiId
      ? { ...state, desiredLevel: nivel }
      : state,
  );
  const { fallen } = applyRequirementFalls(content, hipotese, game.currentTurn);
  const exigencias = policyRequirements(content);
  return fallen.map((queda) => ({
    id: queda.policyId,
    nome:
      content.policies.find((p) => p.id === queda.policyId)?.nome ??
      queda.policyId,
    base: exigencias.get(queda.policyId)?.[0]?.baseLabel ?? "",
    revogada: queda.revoked,
  }));
}

/**
 * Revoga uma lei em vigor (D-65): ela sai do mapa e volta ao catálogo; o
 * efeito some aos poucos, como a implantação. As filhas que dependiam dela
 * caem junto. No modo real, só leis de execução direta (decreto); a
 * revogação por votação vem com a tela de propostas (SG115).
 */
export function revogarLei(
  partida: Partida,
  leiId: string,
): Resultado<Partida> {
  const { game, content } = partida;
  const bloqueio = revocationBlock(content, game.policies, leiId);
  if (bloqueio) return { ok: false, erros: [bloqueio] };
  const policy = content.policies.find((p) => p.id === leiId)!;
  if (
    partida.modo === "real" &&
    !policy.processoAutorizacao.startsWith("execucao-") &&
    policy.processoAutorizacao !== "decreto"
  )
    return {
      ok: false,
      erros: ["Por enquanto, revogar pelo Congresso só no modo teste."],
    };
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === leiId,
  );
  const revogada = revokePolicyState(
    content,
    game.policies[index],
    game.currentTurn,
  );
  if (!revogada)
    return { ok: false, erros: [`A lei ${leiId} não pôde ser revogada.`] };
  const mudadas = [...game.policies];
  mudadas[index] = revogada;
  const { policies } = applyRequirementFalls(
    content,
    mudadas,
    game.currentTurn,
  );
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...game, policies },
      acoes: partida.acoes + 1,
    },
  };
}

/** Muda a meta da lei direto na partida, sem passar pelo Congresso. */
export function aplicarMeta(
  partida: Partida,
  leiId: string,
  nivel: number,
): Resultado<Partida> {
  const { game, content } = partida;
  const definition = policyLevelRulesFromContent(content, leiId);
  if (!definition.ok) return falha(definition.diagnostics);
  const index = game.policies.findIndex(
    (state) => state.policyDefinitionId === leiId,
  );
  // lei filha (SG138) e pétrea (D-65)
  const bloqueio = requirementBlock(content, game.policies, leiId, nivel);
  if (bloqueio) return { ok: false, erros: [bloqueio] };
  const anterior = index < 0 ? undefined : game.policies[index];
  // fora de vigor (catálogo, D-65): a lei entra em vigor por decisão direta
  const changed = policyInForce(game.policies, leiId)
    ? changePolicyTarget(
        anterior!,
        nivel,
        game.currentTurn,
        definition.value.rules,
      )
    : createDecreedPolicyState(
        {
          id: anterior?.id ?? `${game.id}:policy:${leiId}`,
          desiredLevel: nivel,
          implementedLevel: anterior?.implementedLevel ?? 0,
          turn: game.currentTurn,
        },
        definition.value.rules,
      );
  if (!changed.ok) return { ok: false, erros: [changed.error.message] };
  const mudadas = [...game.policies];
  if (index < 0) mudadas.push(changed.value);
  else mudadas[index] = changed.value;
  // a mãe mudou: as filhas que dependiam dela caem para a base
  const { policies } = applyRequirementFalls(
    content,
    mudadas,
    game.currentTurn,
  );
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...game, policies },
      acoes: partida.acoes + 1,
    },
  };
}
