import { describe, expect, it } from "vitest";
import { updateStock } from "../engine";

const inventory = {
  id: "estoque_itens",
  tipo: "estoque" as const,
  nome: "Estoque de itens",
  unidade: "quantidade",
  dominio: { minimo: 0 },
  valorInicial: 100,
};

describe("updateStock", () => {
  it("mantém uma taxa percentual observada sem converter pontos em índice", () => {
    expect(
      updateStock(
        { ...inventory, id: "inflacao", unidade: "percentual_0_100" },
        4.83,
        [],
        3,
      ),
    ).toMatchObject({ ok: true, value: { value: 4.83 } });
  });

  it("conserva o saldo anterior e aplica taxas pela duração", () => {
    expect(
      updateStock(
        inventory,
        100,
        [
          { relationId: "saida", value: -3, unit: "quantidade_por_passo" },
          { relationId: "entrada", value: 8, unit: "quantidade_por_passo" },
        ],
        2,
      ),
    ).toMatchObject({ ok: true, value: { value: 110 } });
  });

  it("recusa taxa incompatível; saldo fora do domínio para no limite (SG159)", () => {
    expect(
      updateStock(
        inventory,
        1,
        [{ relationId: "saida", value: -2, unit: "quantidade_por_passo" }],
        1,
      ),
    ).toMatchObject({
      ok: true,
      value: { value: inventory.dominio.minimo, limited: true },
    });
    expect(
      updateStock(
        inventory,
        1,
        [{ relationId: "saida", value: -2, unit: "moeda_por_passo" }],
        1,
      ),
    ).toMatchObject({ ok: false });
  });
});
