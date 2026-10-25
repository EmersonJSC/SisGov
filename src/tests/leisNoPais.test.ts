import { describe, expect, it } from "vitest";
import notasDoBrasil from "../conteudo/paises/brasil/leis-no-pais.json";

type Lei = Record<string, unknown>;

const leisDoMundo = import.meta.glob<Lei>("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
});

describe("notas das leis por país", () => {
  it("não mantém campos específicos do país nas leis do mundo", () => {
    for (const [arquivo, lei] of Object.entries(leisDoMundo)) {
      expect(lei, arquivo).not.toHaveProperty("exemplo");
      expect(lei, arquivo).not.toHaveProperty("historia");
      expect(lei, arquivo).not.toHaveProperty("fontes");

      const publico = lei.publico as Record<string, unknown> | undefined;
      expect(Boolean(publico && Object.hasOwn(publico, "pessoas")), arquivo)
        .toBe(false);
      const controle = lei.controle as
        | { faixa?: Record<string, unknown> }
        | undefined;
      expect(
        Boolean(
          controle?.faixa && Object.hasOwn(controle.faixa, "valorReferencia"),
        ),
        arquivo,
      ).toBe(false);
    }
  });

  it("carrega o arquivo do Brasil com IDs de leis existentes", () => {
    expect(notasDoBrasil.tipo).toBe("pais-leis-no-pais");
    const idsDasLeis = new Set(
      Object.values(leisDoMundo).map((lei) => lei.id),
    );
    for (const id of Object.keys(notasDoBrasil.leis))
      expect(idsDasLeis.has(id), id).toBe(true);
  });
});
