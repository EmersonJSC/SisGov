import { describe, expect, it } from "vitest";
import {
  calculateGroupContributions,
  redistributeCoalitionSupport,
  refreshPoliticalSupport,
} from "../game/socialSupport";

describe("reação social ponderada", () => {
  it("normaliza pelos interesses completos, inclusive pelo grupo sem reação", () => {
    const result = calculateGroupContributions(
      [
        { groupId: "motoristas", weight: 3 },
        { groupId: "jovens", weight: 1 },
      ],
      [
        { relationId: "direta", groupId: "motoristas", points: 4 },
        { relationId: "resultado", groupId: "jovens", points: -2 },
      ],
    );
    expect(result).toEqual({
      ok: true,
      value: [
        { relationId: "direta", groupId: "motoristas", points: 3 },
        { relationId: "resultado", groupId: "jovens", points: -0.5 },
      ],
    });
  });

  it("mantém escala equivalente e ignora peso zero", () => {
    const scaled = calculateGroupContributions(
      [
        { groupId: "a", weight: 30 },
        { groupId: "b", weight: 10 },
      ],
      [
        { relationId: "x", groupId: "a", points: 4 },
        { relationId: "y", groupId: "b", points: -2 },
      ],
    );
    const zero = calculateGroupContributions(
      [
        { groupId: "a", weight: 1 },
        { groupId: "b", weight: 0 },
      ],
      [
        { relationId: "x", groupId: "a", points: 4 },
        { relationId: "y", groupId: "b", points: 99 },
      ],
    );
    expect(scaled).toMatchObject({ value: [{ points: 3 }, { points: -0.5 }] });
    expect(zero).toMatchObject({ value: [{ relationId: "x", points: 4 }] });
  });

  it("preserva a fotografia: contribuição estável não é acumulada", () => {
    const current = calculateGroupContributions(
      [{ groupId: "a", weight: 1 }],
      [{ relationId: "efeito", groupId: "a", points: 2 }],
    );
    expect(current).toMatchObject({ value: [{ points: 2 }] });
    // O chamador substitui a contribuição de id "efeito" na fotografia atual;
    // portanto base 40 + 2 continua 42 no mês seguinte, não 44.
  });

  it("recalcula da base e restaura o apoio ao remover a relação", () => {
    const input = {
      profiles: [
        {
          id: "p",
          electoralWeight: 1,
          associations: [{ groupId: "a", weight: 1 }],
        },
      ],
      coalitionPartyIds: ["governo"],
      basePartySupport: { governo: 40, oposicao: 60 },
    };
    const active = refreshPoliticalSupport(
      input.profiles,
      [{ relationId: "direta", groupId: "a", points: 2 }],
      input.coalitionPartyIds,
      input.basePartySupport,
    );
    const removed = refreshPoliticalSupport(
      input.profiles,
      [],
      input.coalitionPartyIds,
      input.basePartySupport,
    );
    expect(active).toMatchObject({
      value: {
        partySupport: { governo: 42, oposicao: 58 },
        contributionsByRelation: { direta: 2 },
      },
    });
    expect(removed).toMatchObject({
      value: {
        partySupport: { governo: 40, oposicao: 60 },
        contributionsByRelation: {},
      },
    });
  });
});

describe("redistribuição de apoio da coalizão", () => {
  it("preserva proporções internas e a soma de 100", () => {
    const result = redistributeCoalitionSupport({
      supportByParty: {
        governoA: 30,
        governoB: 20,
        oposicaoA: 40,
        oposicaoB: 10,
      },
      coalitionPartyIds: ["governoA", "governoB"],
      coalitionDeltaPoints: 10,
    });
    expect(result).toEqual({
      ok: true,
      value: { governoA: 36, governoB: 24, oposicaoA: 32, oposicaoB: 8 },
    });
  });

  it("usa peso de referência e depois distribuição uniforme quando o lado começa zerado", () => {
    const byReference = redistributeCoalitionSupport({
      supportByParty: { a: 0, b: 0, c: 70, d: 30 },
      coalitionPartyIds: ["a", "b"],
      coalitionDeltaPoints: 20,
      referenceWeights: { a: 3, b: 1 },
    });
    const uniform = redistributeCoalitionSupport({
      supportByParty: { a: 0, b: 0, c: 70, d: 30 },
      coalitionPartyIds: ["a", "b"],
      coalitionDeltaPoints: 20,
    });
    expect(byReference).toMatchObject({ value: { a: 15, b: 5, c: 56, d: 24 } });
    expect(uniform).toMatchObject({ value: { a: 10, b: 10, c: 56, d: 24 } });
  });
});
