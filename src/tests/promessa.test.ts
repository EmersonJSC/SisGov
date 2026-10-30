import { expect, it } from "vitest";
import { criarPartida, verBussola } from "../app/partida";
import { valoresComReacao } from "../app/partida/bussola";
import { pontoAtual } from "../game/bussola";
import {
  descumprimento,
  perdaDaPromessa,
  TETO_DA_PROMESSA,
  TOLERANCIA_DA_PROMESSA,
} from "../game/promessa";

const ponto = (economia: number, costumes: number) => ({ economia, costumes });

it("M8 promessa: só o caminho ao contrário pesa, e com tolerância e teto", () => {
  const zero = ponto(0, 0);
  // quer mais mercado e o governo foi para mais Estado: descumpre em economia
  const d = descumprimento(ponto(5, 0), zero, ponto(-3, 0));
  expect(d).toEqual({ economia: 3, costumes: 0, total: 3 });
  // foi para o lado que disse, ou ficou parado: não pesa
  expect(descumprimento(ponto(5, 0), zero, ponto(4, 0)).total).toBe(0);
  expect(descumprimento(ponto(5, 0), zero, zero).total).toBe(0);
  // quem não pediu mudança no eixo não descumpre nele
  expect(descumprimento(ponto(0, 0), zero, ponto(9, 9)).total).toBe(0);
  // ruído pequeno passa, o grande pesa até o teto
  expect(
    perdaDaPromessa({
      economia: 0,
      costumes: 0,
      total: TOLERANCIA_DA_PROMESSA,
    }),
  ).toBe(0);
  expect(
    perdaDaPromessa({ economia: 0, costumes: 0, total: 3 }),
  ).toBeGreaterThan(0);
  expect(perdaDaPromessa({ economia: 0, costumes: 0, total: 99 })).toBe(
    TETO_DA_PROMESSA,
  );
});

it("M8 promessa: governar ao contrário do que o presidente disse tira satisfação e aparece na bússola", () => {
  const p = criarPartida({ semente: 4 });
  if (!p.ok) throw new Error(p.erros.join());
  const base = p.value;
  // sem ação, nada pesa
  expect(verBussola(base)!.promessa).toBeUndefined();
  const atual = pontoAtual(
    base.content,
    base.game.compass!,
    base.game.policies,
  );
  const virado = {
    ...base,
    game: {
      ...base.game,
      // o governo começou 6 pontos à frente de onde está: andou -6 em economia,
      // e o presidente disse querer ir para o lado positivo
      compass: {
        ...base.game.compass!,
        inicio: ponto(atual.economia + 6, atual.costumes),
      },
      election: {
        ...base.game.election!,
        presidente: {
          ...base.game.election!.presidente,
          ponto: ponto(atual.economia + 12, atual.costumes),
        },
      },
    },
  };
  const grupo = Object.keys(base.game.execution.values).find((k) =>
    k.startsWith("grupo_"),
  )!;
  expect(valoresComReacao(virado)[grupo]).toBeLessThan(
    valoresComReacao(base)[grupo],
  );
  const v = verBussola(virado)!.promessa!;
  expect(v.eixos).toEqual(["economia"]);
  expect(v.perda).toBeGreaterThan(0);
});
