// Onda 1 das leis (14/nov): imposto por estrato, bases novas, transferências,
// regra fiscal, juros, conta da previdência, lei com prazo e ato.
import { describe, expect, it } from "vitest";
import type { Pedido } from "../motor";
import {
  arrecadacaoPorLei,
  impostoPorEstrato,
} from "../motor/turno/etapas/economia";
import {
  transferencias,
  transferenciasPorEstrato,
} from "../motor/turno/etapas/populacao";
import { avancar, criarPartida, jogar } from ".";

const SEMENTE = 3;
const brasil = () =>
  criarPartida("brasil-2026", SEMENTE, { semCongresso: true });
const lei = (id: string, valor: number | string): Pedido => ({
  tipo: "mudar_lei",
  lei: id,
  valor,
});
const rendaDo = (p: ReturnType<typeof brasil>, estrato: string) =>
  Object.entries(p.estado.pops)
    .filter(
      ([id]) => p.regras.pops.find((t) => t.id === id)?.estrato === estrato,
    )
    .reduce((s, [, pop]) => s + pop.renda * pop.pessoas, 0);

describe("imposto de renda por estrato", () => {
  it("subir o imposto do rico tira renda só do rico", () => {
    const p = brasil();
    const depois = avancar(p, [lei("imposto-renda-rico", 0.45)]);
    const antes = impostoPorEstrato(
      p.regras,
      p.estado.leis,
      p.estado.essenciais,
    );
    const agora = impostoPorEstrato(
      depois.regras,
      depois.estado.leis,
      p.estado.essenciais,
    );
    expect(agora.rico).toBeGreaterThan(antes.rico ?? 0);
    expect(agora.medio).toBeCloseTo(antes.medio ?? 0, 6);
    expect(agora.pobre).toBeCloseTo(antes.pobre ?? 0, 6);
  });

  it("o pobre dependente não paga imposto de renda; cobrar dele pesa no bolso dele", () => {
    const p = brasil();
    expect(p.estado.leis["imposto-renda-pobre"]).toBe(0);
    const depois = avancar(p, [lei("imposto-renda-pobre", 0.1)]);
    expect(rendaDo(depois, "pobre")).toBeLessThan(rendaDo(avancar(p), "pobre"));
  });
});

describe("bases novas", () => {
  it("imposto sobre aplicações grandes arrecada e o corte alto encolhe a base", () => {
    const p = brasil();
    const e = p.estado.essenciais;
    const cobra = {
      ...p.estado.leis,
      "imposto-sobre-aplicacoes-grandes-quanto-cobra": 0.01,
    };
    const valor = (leis: typeof cobra) =>
      arrecadacaoPorLei(p.regras, leis, e)[
        "imposto-sobre-aplicacoes-grandes-quanto-cobra"
      ];
    expect(valor(cobra)).toBeGreaterThan(0);
    const corteAlto = {
      ...cobra,
      "imposto-sobre-aplicacoes-grandes-a-partir-de-quanto-cobra": 5000,
    };
    expect(valor(corteAlto)).toBeLessThan(valor(cobra));
  });
});

describe("transferências", () => {
  it("a verba das aposentadorias chega aos aposentados, não ao estrato", () => {
    const p = brasil();
    const t = transferencias(p.regras, p.estado);
    const semApos = transferencias(p.regras, {
      ...p.estado,
      leis: { ...p.estado.leis, "verba-das-aposentadorias": 0.01 },
    });
    expect(
      (t.pops.aposentados ?? 0) - (semApos.pops.aposentados ?? 0),
    ).toBeGreaterThan(0);
    expect(t.estratos.medio ?? 0).toBeCloseTo(semApos.estratos.medio ?? 0);
    const apos = p.estado.pops.aposentados;
    expect(apos.transferencia).toBeGreaterThan(apos.renda_bruta);
  });

  it("cobrir o país inteiro manda parte da Transferência à classe média", () => {
    const p = brasil();
    const com = (cobertura: number) =>
      transferenciasPorEstrato(p.regras, {
        ...p.estado,
        leis: { ...p.estado.leis, "quem-recebe-a-transferencia": cobertura },
      });
    expect((com(1).medio ?? 0) - (com(0.25).medio ?? 0)).toBeGreaterThan(0);
  });
});

describe("regra fiscal", () => {
  it("teto de gasto apertado com punição de corte corta as verbas", () => {
    const p = jogar(brasil(), 2, [
      lei("teto-de-gasto", 0),
      lei("punicao-se-descumprir", "corte-automatico"),
      lei("verba-das-aposentadorias", 0.12),
    ]);
    expect(p.estado.fiscal?.estouros).toContain("teto_gasto");
    expect(p.estado.fiscal?.corte).toBe(0.1);
    expect(
      p.estado.fatos?.some((f) => f.tipo === "regra-fiscal-estourou"),
    ).toBe(true);
  });

  it("com a trava ligada, nenhuma verba sobe", () => {
    const p = jogar(brasil(), 2, [
      lei("teto-de-gasto", 0),
      lei("punicao-se-descumprir", "proibir-aumento-de-salario-e-contratacao"),
      lei("verba-das-aposentadorias", 0.12),
    ]);
    expect(p.estado.fiscal?.trava).toBe(true);
    const depois = avancar(p, [lei("comida-do-estado", 0.004)]);
    expect(depois.estado.leis["comida-do-estado"]).toBe(
      p.estado.leis["comida-do-estado"],
    );
    expect(
      depois.estado.fatos?.some((f) => f.tipo === "regra-fiscal-barrou"),
    ).toBe(true);
  });
});

describe("juros com Banco Central", () => {
  it("sem autonomia, a taxa pedida pelo governo puxa o juro", () => {
    const p = brasil();
    const semBc = {
      ...p,
      estado: {
        ...p.estado,
        leis: Object.fromEntries(
          Object.entries(p.estado.leis).filter(
            ([id]) => id !== "autonomia-do-banco-central",
          ),
        ),
      },
    };
    const baixo = jogar(semBc, 6, [lei("taxa-basica-de-juros", 0.02)]);
    const autonomo = jogar(p, 6, [lei("taxa-basica-de-juros", 0.02)]);
    expect(baixo.estado.essenciais.taxa_juros).toBeLessThan(
      autonomo.estado.essenciais.taxa_juros,
    );
  });
});

describe("conta da previdência", () => {
  it("idade mínima maior, déficit menor", () => {
    const def = (idade: number) =>
      avancar(brasil(), [lei("idade-minima-de-aposentadoria", idade)]).estado
        .jogabilidade.deficit_da_previdencia;
    expect(def(70)).toBeLessThan(def(60));
  });
});

describe("lei com prazo e ato", () => {
  it("a anistia arrecada enquanto vale e volta sozinha a não legislada", () => {
    const p = avancar(brasil(), [lei("anistia-fiscal", 1)]);
    expect(p.estado.leis["anistia-fiscal"]).toBe(1);
    expect(p.estado.usos?.["anistia-fiscal"]).toBe(1);
    const fim = jogar(p, 2);
    expect(fim.estado.leis["anistia-fiscal"]).toBeUndefined();
    expect(fim.estado.fatos?.some((f) => f.tipo === "prazo-acabou")).toBe(true);
  });

  it("o calote acontece uma vez: a dívida cai e a lei não fica", () => {
    const p = brasil();
    const depois = avancar(p, [
      lei("renegociacao-da-divida", "calote-parcial"),
    ]);
    expect(depois.estado.leis["renegociacao-da-divida"]).toBeUndefined();
    expect(depois.estado.tesouro.divida).toBeLessThan(
      p.estado.tesouro.divida * 0.8,
    );
    expect(depois.estado.usos?.["renegociacao-da-divida"]).toBe(1);
  });
});
