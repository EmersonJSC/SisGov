/**
 * A lupa acha a lei pelas palavras do jogador, e cada lei mora num
 * ministério real, dentro de uma área (privatizar está em "Empresas e
 * comércio", no Ministério da Indústria e Comércio).
 */
import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";
import { buscar } from "../ui/mapa/busca";

const criada = criarPartida({ ocorrencias: false });
if (!criada.ok) throw new Error(criada.erros.join(" "));
const visao = verPartida(criada.value);
const primeira = (q: string) =>
  buscar(q, visao.leis, visao.bolhas, visao.governo)[0];

describe("lupa", () => {
  it("estatizar e privatizar levam à lei das estatais, em Economia", () => {
    for (const q of ["privatizar", "estatizar", "Privatização", "estatais"]) {
      const r = primeira(q);
      expect(r?.id, q).toBe("empresas-estatais-e-privatizacao");
      expect(r?.tema).toBe("Empresas e comércio");
      expect(r?.pasta).toBe("Indústria e Comércio");
    }
  });

  it("palavras do dia a dia e nomes sem acento", () => {
    expect(primeira("juros")?.id).toBe("autonomia-banco-central");
    expect(primeira("aposentadoria")?.id).toBe("idade-minima-aposentadoria");
    expect(primeira("salario minimo")?.id).toBe("salario-minimo");
    expect(primeira("armas")?.id).toBe("armas-de-fogo");
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

describe("áreas e ministérios reais (D-64)", () => {
  it("11 áreas, 38 ministérios; toda lei tem ministério e área", () => {
    expect(visao.governo).toHaveLength(11);
    expect(visao.governo.flatMap((a) => a.ministerios)).toHaveLength(38);
    for (const lei of visao.leis) {
      expect(lei.ministerioId, lei.id).not.toBe("");
      expect(lei.areas, lei.id).toHaveLength(1);
    }
  });

  it("os temas que o jogador procura estão no lugar certo", () => {
    const lugar = (id: string) => {
      const lei = visao.leis.find((l) => l.id === id)!;
      const area = visao.governo.find((a) => a.id === lei.areas[0])!;
      return `${area.titulo} / ${lei.ministerio}`;
    };
    expect(lugar("imposto-renda-pessoas")).toBe(
      "Economia / Ministério da Fazenda",
    );
    expect(lugar("regra-fiscal")).toBe(
      "Economia / Ministério do Planejamento e Orçamento",
    );
    expect(lugar("transporte-publico")).toBe(
      "Infraestrutura e energia / Ministério das Cidades",
    );
    expect(lugar("gasto-com-defesa")).toBe(
      "Segurança e defesa / Ministério da Defesa",
    );
    expect(lugar("reeleicao")).toBe(
      "Governo e instituições / Casa Civil da Presidência",
    );
  });

  it("o nome do ministério também acha as leis dele", () => {
    const achadas = buscar(
      "itamaraty",
      visao.leis,
      visao.bolhas,
      visao.governo,
    );
    expect(achadas[0]?.id).toBe("acordos-comerciais");
  });
});
