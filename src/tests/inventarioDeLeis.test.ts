import { describe, expect, it } from "vitest";
import {
  areaDasLeisNoPais,
  sugerirLinha,
  type LeiBruta,
} from "../../scripts/leis/sugerir";
import politica from "../conteudo/paises/brasil/politica.json";

const leis = Object.values(
  import.meta.glob<LeiBruta>("../conteudo/mundo/leis/*.json", {
    eager: true,
    import: "default",
  }),
);
const porId = new Map(leis.map((l) => [l.id, l]));
const areaDaLei = areaDasLeisNoPais(
  politica.ministerios.ministerios as { id: string; leis: string[] }[],
);
const linha = (id: string) => sugerirLinha(porId.get(id)!, areaDaLei, leis);

describe("inventário das leis", () => {
  it("imposto de renda das pessoas: contas públicas, imposto", () => {
    expect(linha("imposto-renda-pessoas")).toMatchObject({
      areaSugerida: "contas-publicas",
      familiaSugerida: "imposto",
    });
  });

  it("transferência de renda: proteção social, programa", () => {
    expect(linha("transferencia-de-renda")).toMatchObject({
      areaSugerida: "protecao-social",
      familiaSugerida: "programa",
    });
  });

  it("regulação de vagas: saúde, regra, já no molde (sem faltas)", () => {
    const l = linha("regulacao-de-vagas");
    expect(l).toMatchObject({
      areaSugerida: "saude",
      familiaSugerida: "regra",
    });
    expect(l.faltas).toEqual([]);
  });

  it("lei antiga sem efeito e com pergunta aparece com as faltas", () => {
    const antiga: LeiBruta = {
      id: "lei-de-teste",
      nome: "Lei de teste",
      descricao: "Quem decide?",
      versaoEsquema: 2,
      nivelLegal: "derivada",
      consequencias: [],
    };
    const l = sugerirLinha(antiga, areaDaLei, leis);
    expect(l.faltas).toContain("sem efeito na rede");
    expect(l.faltas).toContain("decide é pergunta");
  });

  it("Banco Central sai de contas públicas", () => {
    expect(linha("quem-controla-o-banco-central").areaSugerida).toBe(
      "economia-e-empresas",
    );
  });

  it("aponta a lei parecida", () => {
    // a lei antiga "Valor do salário mínimo" saiu (23/out); vale para alguma
    const ids = [...porId.keys()];
    const comParecida = ids.filter((id) => linha(id).parecidaCom);
    expect(comParecida.length).toBeGreaterThan(0);
    for (const id of comParecida)
      expect(porId.has(linha(id).parecidaCom!)).toBe(true);
  });

  it("não liga leis de família ou área diferentes", () => {
    expect(linha("imposto-renda-pessoas").parecidaCom).toBeUndefined();
  });

  it("toda lei ganha uma das 11 áreas", () => {
    const fora = leis.filter(
      (l) => sugerirLinha(l, areaDaLei, leis).areaSugerida === "sem-area",
    );
    expect(fora.map((l) => l.id)).toEqual([]);
  });
});
