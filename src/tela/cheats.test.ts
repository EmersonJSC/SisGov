import { describe, expect, it } from "vitest";
import { digitar } from "./cheats";

const escrever = (palavra: string) =>
  [...palavra].reduce<{ texto: string; cheat: string | null }>(
    (r, tecla) => {
      const n = digitar(r.texto, tecla);
      return { texto: n.texto, cheat: n.cheat ?? r.cheat };
    },
    { texto: "", cheat: null },
  );

describe("cheats digitados", () => {
  it("acha a palavra, em qualquer caixa e no meio de outras letras", () => {
    expect(escrever("senado").cheat).toBe("senado");
    expect(escrever("xxPULARyy").cheat).toBe("pular");
  });

  it("zera o que foi digitado ao completar, para valer de novo", () => {
    const r = digitar("senad", "o");
    expect(r).toEqual({ texto: "", cheat: "senado" });
  });

  it("teclas especiais e palavras parecidas não ativam nada", () => {
    expect(digitar("senad", "Shift")).toEqual({ texto: "senad", cheat: null });
    expect(escrever("senadx").cheat).toBeNull();
    expect(escrever("sena").cheat).toBeNull();
  });
});
