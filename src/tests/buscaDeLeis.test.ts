/**
 * A lupa acha a lei pelas palavras do jogador, e cada lei mora num
 * ministério de tema claro (privatizar está em "Economia e empresas").
 */
import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";
import { buscar } from "../ui/mapa/busca";
import { ORDEM_MINISTERIOS, TEMAS } from "../ui/mapa/tema";

const criada = criarPartida({ ocorrencias: false });
if (!criada.ok) throw new Error(criada.erros.join(" "));
const visao = verPartida(criada.value);
const primeira = (q: string) => buscar(q, visao.leis, visao.bolhas)[0];

describe("lupa", () => {
  it("estatizar e privatizar levam à lei das estatais, em Economia", () => {
    for (const q of ["privatizar", "estatizar", "Privatização", "estatais"]) {
      const r = primeira(q);
      expect(r?.id, q).toBe("empresas-estatais-e-privatizacao");
      expect(r?.tema).toBe("Economia e empresas");
    }
  });

  it("palavras do dia a dia e nomes sem acento", () => {
    expect(primeira("juros")?.id).toBe("autonomia-banco-central");
    expect(primeira("aposentadoria")?.id).toBe("idade-minima-aposentadoria");
    expect(primeira("salario minimo")?.id).toBe("salario-minimo");
    expect(primeira("armas")?.id).toBe("porte-de-armas");
    // indicadores também aparecem
    expect(
      buscar("inflação", visao.leis, visao.bolhas).some(
        (r) => r.tipo === "bolha" && r.id === "inflacao",
      ),
    ).toBe(true);
  });

  it("consulta curta não busca; nada encontrado devolve vazio", () => {
    expect(buscar("a", visao.leis, visao.bolhas)).toEqual([]);
    expect(buscar("xyzwq", visao.leis, visao.bolhas)).toEqual([]);
  });
});

describe("ministérios por tema", () => {
  it("toda lei está num dos 12 ministérios com tema, nenhum vazio", () => {
    const usados = new Set(visao.leis.map((l) => l.ministerios[0]));
    for (const m of usados) {
      expect(ORDEM_MINISTERIOS, m).toContain(m);
      expect(TEMAS[m], m).toBeDefined();
    }
    expect(usados.size).toBe(12);
  });

  it("os temas que o jogador procura estão no lugar certo", () => {
    const tema = (id: string) =>
      TEMAS[visao.leis.find((l) => l.id === id)!.ministerios[0]].titulo;
    expect(tema("imposto-renda-pessoas")).toBe("Impostos");
    expect(tema("regra-fiscal")).toBe("Impostos");
    expect(tema("regime-cambial")).toBe("Economia e empresas");
    expect(tema("autonomia-banco-central")).toBe("Economia e empresas");
    expect(tema("transporte-publico")).toBe("Infraestrutura e cidades");
    expect(tema("gasto-com-defesa")).toBe("Defesa e exterior");
    expect(tema("reeleicao")).toBe("Instituições e política");
  });
});
