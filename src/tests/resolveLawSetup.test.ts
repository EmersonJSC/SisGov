import { expect, it } from "vitest";
import {
  resolveLawSetup,
  resolveLawSetupJson,
  selectCountryLawSetupJson,
  type LawDefinition,
} from "../engine/laws/resolveLawSetup";

const laws: LawDefinition[] = [
  { id: "voto", scope: "constitutional" },
  {
    id: "eleicao-um-turno",
    scope: "constitutional",
    requiresActive: ["voto"],
    excludes: ["eleicao-dois-turnos"],
  },
  {
    id: "eleicao-dois-turnos",
    scope: "constitutional",
    requiresActive: ["voto"],
    excludes: ["eleicao-um-turno"],
  },
];

it("resolves reusable laws against each country's initial state", () => {
  const one = resolveLawSetup(laws, {
    countryId: "pais-a",
    activeLawIds: ["voto", "eleicao-um-turno"],
  });
  const two = resolveLawSetup(laws, {
    countryId: "pais-b",
    activeLawIds: ["voto", "eleicao-dois-turnos"],
  });
  expect(one).toMatchObject({ ok: true, value: { countryId: "pais-a" } });
  expect(two).toMatchObject({ ok: true, value: { countryId: "pais-b" } });
  if (one.ok && two.ok) {
    expect(one.value.active.has("eleicao-um-turno")).toBe(true);
    expect(two.value.active.has("eleicao-um-turno")).toBe(false);
    expect(one.value.catalog.has("eleicao-dois-turnos")).toBe(true);
  }
});

it("reads separate law and country JSON and rejects malformed content safely", () => {
  const setup = {
    countryId: "pais-a",
    activeLawIds: ["voto", "eleicao-um-turno"],
  };
  expect(
    resolveLawSetupJson(JSON.stringify(laws), JSON.stringify(setup)).ok,
  ).toBe(true);
  expect(resolveLawSetupJson("{", JSON.stringify(setup)).ok).toBe(false);
  expect(
    resolveLawSetupJson(JSON.stringify([{ id: 1 }]), JSON.stringify(setup)).ok,
  ).toBe(false);
  expect(resolveLawSetupJson(JSON.stringify(laws), JSON.stringify({})).ok).toBe(
    false,
  );
});

it("rejects conflicting laws, broken links and missing prerequisites", () => {
  const invalid = resolveLawSetup(laws, {
    countryId: "pais-a",
    activeLawIds: ["eleicao-um-turno", "eleicao-dois-turnos"],
  });
  expect(invalid.ok).toBe(false);
  if (!invalid.ok) {
    expect(
      invalid.issues.some((issue) => issue.message.includes("requisito")),
    ).toBe(true);
    expect(
      invalid.issues.some((issue) => issue.message.includes("incompatíveis")),
    ).toBe(true);
  }
  expect(
    resolveLawSetup(
      [{ id: "x", scope: "ordinary", requiresActive: ["inexistente"] }],
      { countryId: "pais-a", activeLawIds: [] },
    ).ok,
  ).toBe(false);
});

it("selects a country from shared JSON without excluding laws absent there", () => {
  const countries = [
    { countryId: "brasil", activeLawIds: ["voto", "eleicao-um-turno"] },
    { countryId: "outro", activeLawIds: ["voto", "eleicao-dois-turnos"] },
  ];
  const result = selectCountryLawSetupJson(
    JSON.stringify(laws),
    JSON.stringify(countries),
    "brasil",
  );
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.value.active.has("eleicao-dois-turnos")).toBe(false);
    expect(result.value.catalog.has("eleicao-dois-turnos")).toBe(true);
  }
  expect(
    selectCountryLawSetupJson(
      JSON.stringify(laws),
      JSON.stringify(countries),
      "desconhecido",
    ).ok,
  ).toBe(false);
});
