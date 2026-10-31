// Contrato: todo JSON de lei do mundo passa no validador do motor.
import { describe, expect, it } from "vitest";
import { validarLei } from "../motor/leis";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";

const leis = import.meta.glob("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
});
const jogabilidade = variaveis.variaveis
  .filter((v) => v.camada !== "essencial")
  .map((v) => v.id);

describe("contrato das leis", () => {
  it("existe ao menos uma lei", () => {
    expect(Object.keys(leis).length).toBeGreaterThan(0);
  });

  for (const [arquivo, lei] of Object.entries(leis)) {
    it(arquivo.replace("../conteudo/", ""), () => {
      expect(validarLei(lei, arquivo, jogabilidade)).toEqual([]);
    });
  }
});
