/**
 * Ministérios reais do Brasil (D-64): estrutura válida e a regra de
 * extinção (leis mudam de pasta ou deixam de existir).
 */
import { describe, expect, it } from "vitest";
import estrutura from "../conteudo/paises/brasil/ministerios.json";
import {
  extinguirMinisterio,
  validarEstrutura,
  type EstruturaDeGoverno,
} from "../game/ministerios";

const brasil = estrutura as EstruturaDeGoverno;
const leis = Object.keys(
  import.meta.glob("../conteudo/mundo/leis/*.json", { eager: true }),
).map((caminho) => caminho.split("/").at(-1)!.replace(".json", ""));

describe("ministérios do Brasil", () => {
  it("38 ministérios em 11 áreas, cada lei em um só", () => {
    expect(brasil.ministerios).toHaveLength(38);
    expect(brasil.areas).toHaveLength(11);
    expect(validarEstrutura(brasil, leis)).toEqual([]);
  });

  it("acusa lei sem ministério, lei repetida e destino inexistente", () => {
    const [primeiro, segundo, ...resto] = brasil.ministerios;
    const quebrada: EstruturaDeGoverno = {
      areas: brasil.areas,
      ministerios: [
        { ...primeiro, leis: primeiro.leis.slice(1) },
        {
          ...segundo,
          leis: [...segundo.leis, primeiro.leis[2]],
          extincao: { destino: "nao-existe" },
        },
        ...resto,
      ],
    };
    const erros = validarEstrutura(quebrada, leis).join("\n");
    expect(erros).toContain(`lei ${primeiro.leis[0]} sem ministério`);
    expect(erros).toContain(`lei ${primeiro.leis[2]} em`);
    expect(erros).toContain("destino nao-existe inválido");
  });
});

describe("extinguir ministério", () => {
  it("Mulheres: cada lei vai para a sua pasta", () => {
    const r = extinguirMinisterio(brasil, "mulheres");
    if (!r.ok) throw new Error(r.erro);
    expect(r.value.movidas).toEqual([
      { lei: "protecao-violencia-domestica", para: "justica" },
      { lei: "igualdade-salarial-de-genero", para: "trabalho" },
    ]);
    expect(r.value.extintas).toEqual([]);
    const nova = r.value.estrutura;
    expect(nova.ministerios).toHaveLength(37);
    expect(validarEstrutura(nova, leis)).toEqual([]);
  });

  it("Desenvolvimento Agrário: a reforma agrária deixa de existir", () => {
    const r = extinguirMinisterio(brasil, "desenvolvimento-agrario");
    if (!r.ok) throw new Error(r.erro);
    expect(r.value.extintas).toEqual(["reforma-agraria"]);
    expect(
      r.value.estrutura.ministerios.some((m) =>
        m.leis.includes("reforma-agraria"),
      ),
    ).toBe(false);
  });

  it("núcleo do governo não pode ser extinto", () => {
    for (const id of ["fazenda", "casa-civil", "saude", "agu"]) {
      expect(extinguirMinisterio(brasil, id).ok, id).toBe(false);
    }
  });

  it("destino já extinto: quem chama escolhe outro", () => {
    const sem = extinguirMinisterio(brasil, "planejamento");
    if (!sem.ok) throw new Error(sem.erro);
    // a Gestão iria para o Planejamento, que não existe mais
    expect(extinguirMinisterio(sem.value.estrutura, "gestao").ok).toBe(false);
    const r = extinguirMinisterio(sem.value.estrutura, "gestao", "casa-civil");
    if (!r.ok) throw new Error(r.erro);
    expect(r.value.movidas).toEqual([
      { lei: "estabilidade-servidores-publicos", para: "casa-civil" },
    ]);
  });

  it("área sem ministérios some; coordenador que sai é substituído", () => {
    let atual: EstruturaDeGoverno = brasil;
    for (const id of ["mulheres", "igualdade-racial"]) {
      const r = extinguirMinisterio(atual, id);
      if (!r.ok) throw new Error(r.erro);
      atual = r.value.estrutura;
    }
    // Direitos Humanos sobra sozinho na área Direitos e cidadania
    const r = extinguirMinisterio(atual, "direitos-humanos");
    if (!r.ok) throw new Error(r.erro);
    expect(r.value.estrutura.areas.map((a) => a.id)).not.toContain("direitos");
    const cidades = extinguirMinisterio(brasil, "cidades");
    if (!cidades.ok) throw new Error(cidades.erro);
    expect(
      cidades.value.estrutura.areas.find((a) => a.id === "infraestrutura")
        ?.coordenador,
    ).toBe("transportes");
  });
});
