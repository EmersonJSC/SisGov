/**
 * As leis do mundo valem para qualquer país (autor, 23/out): nome, frase,
 * rótulos e textos das opções não citam o país de referência. Só o campo
 * `exemplo` conta como é hoje lá.
 */
import { describe, expect, it } from "vitest";
import { referenciaDePais } from "../game/pais/fichaV3/molde";

const arquivos = import.meta.glob("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Record<string, unknown>>;

type Opcao = Record<string, unknown>;

describe("leis globais", () => {
  it("o detector acha referências ao país", () => {
    expect(
      referenciaDePais("Partilha (hoje na referência, no pré-sal)"),
    ).toBeDefined();
    expect(referenciaDePais("Médio (Brasil hoje)")).toBeDefined();
    expect(referenciaDePais("Fundeb ampliado")).toBeDefined();
    expect(referenciaDePais("Imposto sobre imóveis urbanos")).toBeUndefined();
    expect(
      referenciaDePais("Quem trabalha hoje paga a aposentadoria"),
    ).toBeUndefined();
  });

  it("nenhuma lei cita o país fora do exemplo", () => {
    const achados: string[] = [];
    for (const lei of Object.values(arquivos)) {
      const textos: [string, unknown][] = [
        ["nome", lei.nome],
        ["decide", lei.decide],
      ];
      const opcoes = (lei.controle as { opcoes?: Opcao[] })?.opcoes ?? [];
      for (const o of opcoes)
        for (const k of ["rotulo", "propoe", "efeitos"])
          textos.push([`${String(o.id)}.${k}`, o[k]]);
      for (const [campo, texto] of textos) {
        if (typeof texto !== "string") continue;
        const r = referenciaDePais(texto);
        if (r) achados.push(`${String(lei.id)} ${campo}: "${r}"`);
      }
    }
    expect(achados).toEqual([]);
  });
});
