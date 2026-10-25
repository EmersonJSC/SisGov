import { describe, expect, it } from "vitest";
import fontesDoBrasil from "../conteudo/paises/brasil/fontes-dos-indices.json";
import variaveisDoMundo from "../conteudo/mundo/indicadores/variaveis.json";

describe("fontes dos índices por país", () => {
  it("não deixa fontes nas medidas das variáveis do mundo", () => {
    for (const variavel of variaveisDoMundo.variaveis)
      expect(variavel.medida ?? {}, variavel.id).not.toHaveProperty("fontes");
  });

  it("usa apenas IDs de variáveis existentes", () => {
    const ids = new Set(variaveisDoMundo.variaveis.map(({ id }) => id));
    for (const id of Object.keys(fontesDoBrasil.indices))
      expect(ids.has(id), id).toBe(true);
  });
});
