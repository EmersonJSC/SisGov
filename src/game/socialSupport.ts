import type { ContentDiagnostic, ValidationResult } from "../engine";

export type GroupAssociation = Readonly<{ groupId: string; weight: number }>;
export type GroupEffect = Readonly<{
  relationId: string;
  groupId: string;
  points: number;
}>;
export type SocialContribution = Readonly<{
  relationId: string;
  groupId: string;
  points: number;
}>;
export type CoalitionRedistributionInput = Readonly<{
  supportByParty: Readonly<Record<string, number>>;
  coalitionPartyIds: readonly string[];
  coalitionDeltaPoints: number;
  referenceWeights?: Readonly<Record<string, number>>;
}>;

function invalid(field: string, message: string): ValidationResult<never> {
  return {
    ok: false,
    diagnostics: [
      {
        code: "COMANDO_INVALIDO",
        file: "$partida",
        field,
        message,
      } satisfies ContentDiagnostic,
    ],
  };
}

function finiteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

/** Calculates effects once against the profile's complete association weights. */
export function calculateGroupContributions(
  associations: readonly GroupAssociation[],
  effects: readonly GroupEffect[],
): ValidationResult<readonly SocialContribution[]> {
  const seen = new Set<string>();
  let totalWeight = 0;
  for (const [index, association] of associations.entries()) {
    if (!association.groupId.trim())
      return invalid(
        `associations.${index}.groupId`,
        "O grupo precisa ter ID.",
      );
    if (seen.has(association.groupId))
      return invalid(
        `associations.${index}.groupId`,
        "O grupo não pode se repetir no mesmo perfil.",
      );
    if (!finiteNonNegative(association.weight))
      return invalid(
        `associations.${index}.weight`,
        "O peso deve ser finito e não negativo.",
      );
    seen.add(association.groupId);
    totalWeight += association.weight;
  }
  if (!Number.isFinite(totalWeight))
    return invalid("associations", "A soma dos pesos é inválida.");
  for (const [index, effect] of effects.entries()) {
    if (!effect.relationId.trim() || !effect.groupId.trim())
      return invalid(
        `effects.${index}`,
        "A relação e o grupo precisam ter ID.",
      );
    if (!Number.isFinite(effect.points))
      return invalid(`effects.${index}.points`, "O efeito precisa ser finito.");
  }
  if (totalWeight === 0) return { ok: true, value: [] };
  const weightByGroup = new Map(
    associations.map((association) => [
      association.groupId,
      association.weight,
    ]),
  );
  return {
    ok: true,
    value: effects
      .filter((effect) => (weightByGroup.get(effect.groupId) ?? 0) > 0)
      .map((effect) => ({
        relationId: effect.relationId,
        groupId: effect.groupId,
        points:
          (weightByGroup.get(effect.groupId)! / totalWeight) * effect.points,
      })),
  };
}

export type PoliticalProfile = Readonly<{
  id: string;
  electoralWeight: number;
  associations: readonly GroupAssociation[];
}>;

export type PoliticalSupportSnapshot = Readonly<{
  basePartySupport: Readonly<Record<string, number>>;
  partySupport: Readonly<Record<string, number>>;
  contributionsByRelation: Readonly<Record<string, number>>;
}>;

/**
 * Replaces, instead of appending to, the active social-effect snapshot. The
 * caller can remove a relation simply by omitting it from `effects`.
 */
export function refreshPoliticalSupport(
  profiles: readonly PoliticalProfile[],
  effects: readonly GroupEffect[],
  coalitionPartyIds: readonly string[],
  basePartySupport: Readonly<Record<string, number>>,
  referenceWeights?: Readonly<Record<string, number>>,
): ValidationResult<PoliticalSupportSnapshot> {
  const contributions: Record<string, number> = {};
  for (const [index, profile] of profiles.entries()) {
    if (!profile.id.trim() || !finiteNonNegative(profile.electoralWeight))
      return invalid(
        `profiles.${index}`,
        "O perfil precisa ter ID e peso eleitoral finito não negativo.",
      );
    const calculated = calculateGroupContributions(
      profile.associations,
      effects,
    );
    if (!calculated.ok) return calculated;
    for (const contribution of calculated.value)
      contributions[contribution.relationId] =
        (contributions[contribution.relationId] ?? 0) +
        contribution.points * profile.electoralWeight;
  }
  const redistributed = redistributeCoalitionSupport({
    supportByParty: basePartySupport,
    coalitionPartyIds,
    coalitionDeltaPoints: Object.values(contributions).reduce(
      (sum, value) => sum + value,
      0,
    ),
    referenceWeights,
  });
  if (!redistributed.ok) return redistributed;
  return {
    ok: true,
    value: {
      basePartySupport: { ...basePartySupport },
      partySupport: redistributed.value,
      contributionsByRelation: contributions,
    },
  };
}

function distributionWeights(
  ids: readonly string[],
  supportByParty: Readonly<Record<string, number>>,
  referenceWeights: Readonly<Record<string, number>>,
): ValidationResult<Readonly<Record<string, number>>> {
  if (ids.length === 0)
    return invalid(
      "coalitionPartyIds",
      "A redistribuição exige partidos elegíveis.",
    );
  const currentTotal = ids.reduce((sum, id) => sum + supportByParty[id], 0);
  if (currentTotal > 0)
    return {
      ok: true,
      value: Object.fromEntries(
        ids.map((id) => [id, supportByParty[id] / currentTotal]),
      ),
    };
  const referenceTotal = ids.reduce(
    (sum, id) => sum + (referenceWeights[id] ?? 0),
    0,
  );
  if (referenceTotal > 0)
    return {
      ok: true,
      value: Object.fromEntries(
        ids.map((id) => [id, (referenceWeights[id] ?? 0) / referenceTotal]),
      ),
    };
  return {
    ok: true,
    value: Object.fromEntries(ids.map((id) => [id, 1 / ids.length])),
  };
}

/** Moves support between coalition and opposition while preserving the 100% electorate. */
export function redistributeCoalitionSupport(
  input: CoalitionRedistributionInput,
): ValidationResult<Readonly<Record<string, number>>> {
  const entries = Object.entries(input.supportByParty);
  if (entries.length < 2)
    return invalid("supportByParty", "São necessários ao menos dois partidos.");
  for (const [partyId, support] of entries)
    if (!partyId.trim() || !finiteNonNegative(support))
      return invalid(
        `supportByParty.${partyId}`,
        "O apoio precisa ser finito e não negativo.",
      );
  const total = entries.reduce((sum, [, support]) => sum + support, 0);
  if (Math.abs(total - 100) > 0.000001)
    return invalid(
      "supportByParty",
      "Os apoios partidários precisam somar 100.",
    );
  if (!Number.isFinite(input.coalitionDeltaPoints))
    return invalid("coalitionDeltaPoints", "A variação precisa ser finita.");
  const coalition = [...new Set(input.coalitionPartyIds)];
  if (
    coalition.length !== input.coalitionPartyIds.length ||
    coalition.some((id) => !(id in input.supportByParty))
  )
    return invalid(
      "coalitionPartyIds",
      "A coalizão precisa conter IDs distintos de partidos existentes.",
    );
  const opposition = entries
    .map(([id]) => id)
    .filter((id) => !coalition.includes(id));
  if (opposition.length === 0)
    return invalid(
      "coalitionPartyIds",
      "Não há partidos elegíveis para compensar a mudança.",
    );
  const references = input.referenceWeights ?? {};
  for (const [partyId, weight] of Object.entries(references))
    if (!(partyId in input.supportByParty) || !finiteNonNegative(weight))
      return invalid(
        `referenceWeights.${partyId}`,
        "O peso de referência é inválido.",
      );
  const targetCoalitionTotal = Math.min(
    100,
    Math.max(
      0,
      coalition.reduce((sum, id) => sum + input.supportByParty[id], 0) +
        input.coalitionDeltaPoints,
    ),
  );
  const coalitionWeights = distributionWeights(
    coalition,
    input.supportByParty,
    references,
  );
  if (!coalitionWeights.ok) return coalitionWeights;
  const oppositionWeights = distributionWeights(
    opposition,
    input.supportByParty,
    references,
  );
  if (!oppositionWeights.ok) return oppositionWeights;
  const result: Record<string, number> = {};
  for (const id of coalition)
    result[id] = targetCoalitionTotal * coalitionWeights.value[id];
  for (const id of opposition)
    result[id] = (100 - targetCoalitionTotal) * oppositionWeights.value[id];
  return { ok: true, value: result };
}
