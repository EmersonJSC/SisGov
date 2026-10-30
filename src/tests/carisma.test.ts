import { expect, it } from "vitest";
import {
  alvoDoCarisma,
  andarCarisma,
  carismaVivo,
  TETO_DO_CARISMA,
} from "../game/carisma";
import { criarPartida, encerrarTurno, verEleicao } from "../app/partida";

it("M8.2 carisma vivo: governo bem visto sobe, mal visto e promessa quebrada descem, com teto", () => {
  expect(alvoDoCarisma(50, 0)).toBe(0);
  expect(alvoDoCarisma(70, 0)).toBeGreaterThan(0);
  expect(alvoDoCarisma(30, 0)).toBeLessThan(0);
  expect(alvoDoCarisma(100, 0)).toBe(TETO_DO_CARISMA);
  // promessa quebrada tira do alvo
  expect(alvoDoCarisma(60, 4)).toBeLessThan(alvoDoCarisma(60, 0));
  // anda devagar, nunca passa do teto
  const um = andarCarisma(0, 80, 0);
  expect(um).toBeGreaterThan(0);
  expect(um).toBeLessThan(TETO_DO_CARISMA);
  let d = 0;
  for (let i = 0; i < 60; i++) d = andarCarisma(d, 100, 0);
  expect(d).toBeLessThanOrEqual(TETO_DO_CARISMA);
  expect(d).toBeGreaterThan(TETO_DO_CARISMA - 0.01);
  // o carisma de agora fica na escala da ficha
  expect(carismaVivo(3, 1.5)).toBe(3);
  expect(carismaVivo(0, -1.5)).toBe(0);
  expect(carismaVivo(2, 0.5)).toBe(2.5);
});

it("M8.2 carisma vivo: o desvio nasce em 0 e se mexe ao passar o turno", () => {
  const p = criarPartida({ semente: 4 });
  if (!p.ok) throw new Error(p.erros.join());
  expect(p.value.game.election!.carismaViva ?? 0).toBe(0);
  const r = encerrarTurno(p.value);
  if (!r.ok) throw new Error(r.erros.join());
  const e = r.value.partida.game.election!;
  expect(e.carismaViva).toBeDefined();
  expect(Math.abs(e.carismaViva!)).toBeLessThanOrEqual(TETO_DO_CARISMA);
  expect(
    verEleicao(r.value.partida)!.presidente.carisma,
  ).toBeGreaterThanOrEqual(0);
}, 30000);
