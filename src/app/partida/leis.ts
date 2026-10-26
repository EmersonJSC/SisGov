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
import { saldoDasLeis } from "./contas";
import { interpolate } from "../../engine/mechanisms/calculateContribution";

/** Uma lei pode ampliar o gasto até o limite conjunto de 100% do PIB. */
function limiteDoGasto(
  partida: Partida,
  leiId: string,
  nivel: number,
): string | undefined {
  const policy = partida.content.policies.find((item) => item.id === leiId);
  const alteraGasto =
    policy?.orcamento !== undefined ||
    partida.graph.relations.some(
      (item) => item.sourceId === leiId && item.targetId === "gasto_publico",
    ) ||
    leiId === "salario-dos-servidores" ||
    leiId === "idade-minima-aposentadoria" ||
    leiId === "reajuste-de-beneficios";
  if (!alteraGasto) return undefined;
  const valores = partida.game.execution.values;
  const pib = valores.pib_nominal;
  if (!pib || !Number.isFinite(pib)) return undefined;
  const saldo = saldoDasLeis(partida, valores);
  // A meta das leis já alteradas ainda não aparece em gasto_publico até a
  // implantação. Reserve também essa despesa antes de aceitar outra lei.
  const metas = new Map(
    partida.game.policies
      .filter((state) => state.status === "vigente")
      .map((state) => [state.policyDefinitionId, state.desiredLevel]),
  );
  metas.set(leiId, nivel);
  let acrescimo = 0;
  const leisDaFolha = new Set([
    "quantidade-de-servidores",
    "salario-dos-servidores",
    "estabilidade-dos-servidores-publicos",
  ]);
  const leisDaAposentadoria = new Set([
    "sistema-previdenciario",
    "idade-minima-aposentadoria",
    "reajuste-de-beneficios",
  ]);
  for (const [id, meta] of metas) {
    if (leisDaFolha.has(id) || leisDaAposentadoria.has(id)) continue;
    const gastoDaLei =
      id === "idade-minima-aposentadoria" ||
      id === "reajuste-de-beneficios" ||
      partida.graph.relations.some(
        (item) => item.sourceId === id && item.targetId === "gasto_publico",
      );
    if (gastoDaLei) acrescimo += saldo(id) - saldo(id, meta);
  }
  // Quantidade, salário e estabilidade multiplicam a mesma folha. Calcular
  // as três metas juntas evita perder o efeito cruzado de mudanças no turno.
  const custoFolha = (metasDaFolha: ReadonlyMap<string, number>) => {
    const quantidade =
      metasDaFolha.get("quantidade-de-servidores") ??
      valores.percentual_servidores_publicos ??
      0;
    const salario =
      metasDaFolha.get("salario-dos-servidores") ??
      valores.percentual_salario_servidores ??
      0;
    const estabilidade =
      metasDaFolha.get("estabilidade-dos-servidores-publicos") ??
      valores.nivel_estabilidade_dos_servidores_publicos ??
      0;
    return (
      (valores.ocupados ?? 0) *
      (valores.salario_medio ?? 0) *
      1e-6 *
      (quantidade / 100) *
      (salario / 100) *
      (1 + estabilidade / 1000)
    );
  };
  acrescimo += custoFolha(metas) - custoFolha(new Map());
  const custoAposentadoria = (
    metasDaAposentadoria: ReadonlyMap<string, number>,
  ) => {
    const idade =
      metasDaAposentadoria.get("idade-minima-aposentadoria") ??
      valores.nivel_idade_minima_aposentadoria ??
      0;
    const reajuste =
      metasDaAposentadoria.get("reajuste-de-beneficios") ??
      valores.nivel_reajuste_de_beneficios ??
      0;
    const sistema =
      metasDaAposentadoria.get("sistema-previdenciario") ??
      valores.nivel_sistema_previdenciario ??
      0;
    const aposentados =
      (valores.idosos ?? 0) *
      ((valores.cobertura_aposentadorias ?? 0) / 100) *
      (1 - idade * 0.0025);
    const base =
      aposentados *
      (valores.beneficio_anual_aposentadoria ?? 0) *
      1e-6 *
      (reajuste / 100);
    return (
      base *
      interpolate(
        [
          [0, 0],
          [33, 0.2],
          [67, 0.6],
          [100, 1],
        ],
        sistema,
      )
    );
  };
  acrescimo += custoAposentadoria(metas) - custoAposentadoria(new Map());
  const gastoProposto = (valores.gasto_publico ?? 0) + (acrescimo / pib) * 100;
  return gastoProposto > 100 + 1e-9
    ? "A soma das despesas não pode passar de 100% do PIB."
    : undefined;
}

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
  const limite = limiteDoGasto(partida, leiId, nivel);
  if (limite) return { ok: false, erros: [limite] };
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
  return fallen.map((queda) => {
    const policy = content.policies.find((p) => p.id === queda.policyId);
    // V1-34: a trava de opção leva para a opção liberada mais perto
    const destino =
      queda.to === undefined
        ? undefined
        : policy?.controle.opcoes?.find(
            (o) => Math.abs(o.valor - queda.to!) < 1e-9,
          )?.rotulo;
    return {
      id: queda.policyId,
      nome: policy?.nome ?? queda.policyId,
      base:
        destino ??
        exigencias.get(queda.policyId)?.[0]?.baseLabel ??
        (queda.to === undefined ? "" : `${queda.to}%`),
      revogada: queda.revoked,
    };
  });
}

/**
 * Revoga uma lei em vigor (D-65): ela sai do mapa e volta ao catálogo; o
 * efeito some aos poucos, como a implantação. As filhas que dependiam dela
 * caem junto. No modo real, só leis de execução direta (decreto); a
 * revogação de lei que precisa de votação vai ao Congresso (V1-12).
 */
export function revogarLei(
  partida: Partida,
  leiId: string,
): Resultado<Partida> {
  const { game, content } = partida;
  const bloqueio = revocationBlock(content, game.policies, leiId);
  if (bloqueio) return { ok: false, erros: [bloqueio] };
  const policy = content.policies.find((p) => p.id === leiId)!;
  // V1-12: no modo real, revogar lei que precisa de votação vai ao Congresso
  if (
    partida.modo === "real" &&
    game.congress &&
    nivelNoCongresso(policy) !== "decreto"
  )
    return enviarAoCongresso(partida, leiId, 0, { revogar: true });
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
  const limite = limiteDoGasto(partida, leiId, nivel);
  if (limite) return { ok: false, erros: [limite] };
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
