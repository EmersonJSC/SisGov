import { expect, it } from "vitest";
import {
  createProposal,
  presentProposal,
  type PolicyLevelRules,
} from "../domain/game";
import { prepareProposalTramitation } from "../game/prepareProposalTramitation";

const rules: PolicyLevelRules = {
  policyDefinitionId: "politica-teste",
  unit: "unidade",
  domain: { minimum: 0, maximum: 100 },
};

it("apresenta rascunho e abre a votação no fechamento previsto", () => {
  const created = createProposal(
    {
      id: "proposta-1",
      policyDefinitionId: "politica-teste",
      desiredLevel: 50,
      createdAtTurn: 0,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  const presented = prepareProposalTramitation([created.value], 1);
  expect(presented).toMatchObject({
    ok: true,
    value: [{ status: "apresentada", voteDueTurn: 2 }],
  });
  if (!presented.ok) return;
  const voting = prepareProposalTramitation(presented.value, 2);
  expect(voting).toMatchObject({ ok: true, value: [{ status: "em_votacao" }] });
});

it("não decide nem altera uma proposta enquanto aguarda votação", () => {
  const created = createProposal(
    {
      id: "proposta-2",
      policyDefinitionId: "politica-teste",
      desiredLevel: 50,
      createdAtTurn: 0,
    },
    rules,
  );
  if (!created.ok) throw new Error(created.error.message);
  const presented = presentProposal(created.value, 0, {
    normalWaitTurns: 1,
    maximumWaitTurns: 2,
  });
  if (!presented.ok) throw new Error(presented.error.message);
  const result = prepareProposalTramitation([presented.value], 1);
  expect(result).toMatchObject({ ok: true, value: [{ status: "em_votacao" }] });
  if (!result.ok) return;
  expect(result.value[0]).not.toMatchObject({
    decidedAtTurn: expect.anything(),
  });
});
