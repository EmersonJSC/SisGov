import { expect, it } from "vitest";
import {
  MAXIMO_DE_JANELAS,
  abrirJanela,
  type Janela,
} from "../ui/mapa/Janelas";

it("cada clique abre uma janela nova, em cascata", () => {
  let janelas: readonly Janela[] = [];
  janelas = abrirJanela(janelas, "salario-minimo");
  janelas = abrirJanela(janelas, "aborto");
  expect(janelas.map((j) => j.id)).toEqual(["salario-minimo", "aborto"]);
  expect(janelas[1].desvio.x).toBeGreaterThan(janelas[0].desvio.x);
});

it("clicar numa janela já aberta só a traz para a frente, no mesmo lugar", () => {
  let janelas: readonly Janela[] = [];
  janelas = abrirJanela(janelas, "a");
  janelas = abrirJanela(janelas, "b");
  const lugarDeA = janelas[0].desvio;
  janelas = abrirJanela(janelas, "a");
  expect(janelas.map((j) => j.id)).toEqual(["b", "a"]);
  expect(janelas[1].desvio).toEqual(lugarDeA);
});

it("abrir janelas demais fecha as mais antigas", () => {
  let janelas: readonly Janela[] = [];
  for (let i = 0; i < MAXIMO_DE_JANELAS + 3; i++)
    janelas = abrirJanela(janelas, `lei-${i}`);
  expect(janelas).toHaveLength(MAXIMO_DE_JANELAS);
  expect(janelas[0].id).toBe("lei-3");
});
