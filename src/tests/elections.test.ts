import { describe, expect, it } from "vitest";
import { createRandomState } from "../game/randomState";
import {
  resolveHighestQuotientsByUnit,
  resolveNationalPlurality,
} from "../game/elections";

describe("apuração eleitoral", () => {
  it("elege a maior votação nacional sem consumir acaso", () => {
    expect(
      resolveNationalPlurality([
        { id: "a", votes: 45 },
        { id: "b", votes: 35 },
        { id: "c", votes: 20 },
      ]),
    ).toEqual({
      ok: true,
      value: { winnerId: "a", tiedCandidateIds: [], tieRolls: [] },
    });
  });

  it("usa d20 persistente apenas no empate presidencial", () => {
    const random = createRandomState(42);
    if (!random.ok) throw new Error("semente inválida");
    const result = resolveNationalPlurality(
      [
        { id: "a", votes: 50 },
        { id: "b", votes: 50 },
      ],
      random.value,
    );
    expect(result).toMatchObject({
      ok: true,
      value: {
        tiedCandidateIds: ["a", "b"],
        tieRolls: expect.any(Array),
        random: expect.objectContaining({ state: expect.any(Number) }),
      },
    });
    if (result.ok) expect(result.value.tieRolls).toHaveLength(2);
  });

  it("distribui vagas por maiores quocientes em uma unidade", () => {
    expect(
      resolveHighestQuotientsByUnit(
        [
          { id: "a", votes: 60 },
          { id: "b", votes: 25 },
          { id: "c", votes: 15 },
        ],
        3,
      ),
    ).toEqual({
      ok: true,
      value: {
        electedPartyIds: ["a", "a", "b"],
        tieRolls: [],
        random: undefined,
      },
    });
  });
});
