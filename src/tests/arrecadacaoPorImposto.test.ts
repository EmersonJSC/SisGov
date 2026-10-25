import { describe, expect, it } from "vitest";
import { criarPartida } from "../app/partida";
import { calculateDerivedValue } from "../engine/mechanisms/derivedVariables";

const ids = [
  "consumo",
  "renda_pessoas",
  "renda_empresas",
  "dividendos",
  "heranca",
  "fortunas",
  "imoveis_urbanos",
  "terras",
  "transacoes",
] as const;

const criada = criarPartida({ semente: 7, ocorrencias: false });
if (!criada.ok) throw new Error(criada.erros.join("; "));
const partida = criada.value;
const derivado = (id: string) => {
  const variavel = partida.content.variables.variaveis.find(
    (item) => item.id === `arrecadacao_${id}`,
  );
  if (!variavel) throw new Error(`Derivado ausente: arrecadacao_${id}`);
  return variavel;
};

describe("arrecadação por imposto", () => {
  it("a alíquota do consumo aumenta a arrecadação antes do pico e reduz depois", () => {
    const variavel = derivado("consumo");
    const valores = {
      consumo_familias: 1000,
      fator_partida_consumo: 60,
      aliquota_imposto_sobre_consumo: 20,
    };
    const cobrar = (aliquota: number) =>
      calculateDerivedValue(variavel, {
        ...valores,
        aliquota_imposto_sobre_consumo: aliquota,
      })!;
    expect(cobrar(60)).toBeGreaterThan(cobrar(20));
    expect(cobrar(140)).toBeLessThan(cobrar(80));
  });

  it("dobrar a base dobra a arrecadação do consumo", () => {
    const variavel = derivado("consumo");
    const valores = {
      aliquota_imposto_sobre_consumo: 30,
      consumo_familias: 1000,
      fator_partida_consumo: 60,
    };
    expect(
      calculateDerivedValue(variavel, { ...valores, consumo_familias: 2000 }),
    ).toBeCloseTo(
      2 * calculateDerivedValue(variavel, valores)!,
      8,
    );
  });

  it("a arrecadação do consumo zera no limite da curva e acima dele", () => {
    const variavel = derivado("consumo");
    const valores = {
      consumo_familias: 1000,
      fator_partida_consumo: 60,
    };
    expect(
      calculateDerivedValue(variavel, {
        ...valores,
        aliquota_imposto_sobre_consumo: 150,
      }),
    ).toBe(0);
    expect(
      calculateDerivedValue(variavel, {
        ...valores,
        aliquota_imposto_sobre_consumo: 160,
      }),
    ).toBe(0);
  });

  it("mais mortes elevam a herança tributada e mais população a reduz", () => {
    const variavel = derivado("heranca");
    const valores = {
      aliquota_imposto_heranca: 8,
      mortes_no_ano: 100,
      patrimonio_imoveis_urbanos: 1000,
      patrimonio_terras: 200,
      patrimonio_financeiro: 300,
      populacao: 1000,
      fator_partida_heranca: 60,
    };
    const inicial = calculateDerivedValue(variavel, valores)!;
    expect(
      calculateDerivedValue(variavel, { ...valores, mortes_no_ano: 200 }),
    ).toBeGreaterThan(inicial);
    expect(
      calculateDerivedValue(variavel, { ...valores, populacao: 2000 }),
    ).toBeLessThan(inicial);
  });

  it("carrega os nove derivados no turno zero com valores não negativos", () => {
    const valores = partida.game.execution.values;
    for (const id of ids) {
      expect(derivado(id).tipo).toBe("derivado");
      expect(Number.isFinite(valores[`arrecadacao_${id}`])).toBe(true);
      expect(valores[`arrecadacao_${id}`]).toBeGreaterThanOrEqual(0);
    }
  });
});
