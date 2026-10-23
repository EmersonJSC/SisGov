/**
 * Régua da lei: toda lei com controle deslizante (sem opções) tem régua, e a
 * régua só aponta para índices que existem, com faixas em ordem que fecham
 * a escala.
 */
import { describe, expect, it } from "vitest";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import referenciasDoBrasil from "../conteudo/paises/brasil/referencias.json";
import {
  faixaDe,
  idsComRegua,
  marcasDaEscala,
  reguaDaLei,
  referenciasDoPais,
  valorDaLeiNaRegua,
  valorDerivado,
} from "../app/partida";

type LeiBruta = Readonly<{
  id: string;
  controle?: Readonly<{ opcoes?: readonly unknown[] }>;
}>;

const leis = Object.values(
  import.meta.glob<LeiBruta>("../conteudo/mundo/leis/*.json", {
    eager: true,
    import: "default",
  }),
);
const comDeslizante = leis
  .filter((lei) => !lei.controle?.opcoes?.length)
  .map((lei) => lei.id);
const indices = new Set(variaveis.variaveis.map((v) => v.id));
const SALARIO_MINIMO_DO_BRASIL = 1621;
const CESTAS_DO_BRASIL = 1.76;
const PIB_DO_BRASIL = 12_000_000;
const MINIMO_EM_PCT_DA_MEDIANA = 66;
const CESTAS_SAUDAVEIS = 1.3;
const PORCENTO = 100;
const DEFESA_DO_BRASIL = 192_000;
const DEFESA_EM_PCT_DO_PIB = 1.6;
const PRECISAO_DE_DEZENAS = -1;
const PRECISAO_DE_DECIMOS = 1;
const PRECISAO_DE_CENTESIMOS = 2;
/** [mínimo, máximo, marcas esperadas] do eixo. */
const MARCAS_ESPERADAS: readonly (readonly [
  number,
  number,
  readonly number[],
])[] = JSON.parse(
  "[[0,70,[0,10,20,30,40,50,60,70]],[20,90,[20,30,40,50,60,70,80,90]],[0,2,[0,0.5,1,1.5,2]]]",
);

describe("régua da lei", () => {
  it("toda lei com controle deslizante tem régua", () => {
    const faltam = comDeslizante.filter((id) => !reguaDaLei(id));
    expect(faltam).toEqual([]);
  });

  it("não há régua para lei que não existe ou que tem opções", () => {
    const sobram = idsComRegua().filter((id) => !comDeslizante.includes(id));
    expect(sobram).toEqual([]);
  });

  it("faixas em ordem, dentro da escala, e a última fecha a escala", () => {
    idsComRegua().forEach((id) => {
      const regua = reguaDaLei(id)!;
      const [minimo, maximo] = regua.escala;
      expect(minimo, id).toBeLessThan(maximo);
      const limites = regua.faixas.map((f) => f.ate);
      expect(limites, id).toEqual([...limites].sort((a, b) => a - b));
      expect(limites[0], id).toBeGreaterThan(minimo);
      expect(limites.at(-1), id).toBe(maximo);
      expect(
        regua.faixas.every((f) => f.rotulo.trim().length > 0),
        id,
      ).toBe(true);
    });
  });

  it("cartões, índice medido e alerta apontam para índices que existem", () => {
    idsComRegua().forEach((id) => {
      const regua = reguaDaLei(id)!;
      if (regua.mede === "variavel")
        expect(indices.has(regua.variavel ?? ""), id).toBe(true);
      (regua.leituras ?? []).forEach((l) =>
        expect(indices.has(l.de), `${id}: ${l.de}`).toBe(true),
      );
      if (regua.alerta)
        expect(indices.has(regua.alerta.variavel), id).toBe(true);
    });
  });

  it("as referências que os cartões pedem existem no país", () => {
    const brasil = referenciasDoPais("Brasil");
    idsComRegua().forEach((id) =>
      (reguaDaLei(id)!.leituras ?? []).forEach((l) => {
        if (l.multiplicaPor) expect(brasil[l.multiplicaPor], id).toBeDefined();
        if (l.dividePor) expect(brasil[l.dividePor], id).toBeDefined();
      }),
    );
    expect(brasil.salarioMedianoMensal).toBe(
      referenciasDoBrasil.salarioMedianoMensal,
    );
  });

  it("salário mínimo: 66% da mediana dá R$ 1.621 e cai na faixa alta de cestas", () => {
    const regua = reguaDaLei("aumento-real-do-salario-minimo")!;
    const brasil = referenciasDoPais("Brasil");
    const [dinheiro] = regua.leituras ?? [];
    expect(
      valorDerivado(dinheiro, MINIMO_EM_PCT_DA_MEDIANA, brasil),
    ).toBeCloseTo(SALARIO_MINIMO_DO_BRASIL, PRECISAO_DE_DEZENAS);
    const medida = variaveis.variaveis.find(
      (v) => v.id === "salario_minimo_relativo",
    )!.medida as { cem: number };
    const cestas = (MINIMO_EM_PCT_DA_MEDIANA * medida.cem) / PORCENTO;
    expect(cestas).toBeCloseTo(CESTAS_DO_BRASIL, PRECISAO_DE_DECIMOS);
    expect(faixaDe(regua, cestas).tom).toBe("atencao");
    expect(faixaDe(regua, CESTAS_SAUDAVEIS).tom).toBe("bom");
  });

  it("verba em dinheiro vira % do PIB: defesa de R$ 192 bi é 1,6%", () => {
    const regua = reguaDaLei("gasto-com-defesa")!;
    const naRegua = valorDaLeiNaRegua(regua, DEFESA_DO_BRASIL, PIB_DO_BRASIL);
    expect(naRegua).toBeCloseTo(DEFESA_EM_PCT_DO_PIB, PRECISAO_DE_CENTESIMOS);
    expect(faixaDe(regua, naRegua).tom).toBe("bom");
  });

  it("o arquivo do mundo não cita o país (a nota do país fica no país)", () => {
    idsComRegua().forEach((id) =>
      expect(reguaDaLei(id)!.fonte.toLowerCase(), id).not.toContain("brasil"),
    );
  });

  it("marcas do eixo: passo redondo, dentro da escala", () => {
    MARCAS_ESPERADAS.forEach(([minimo, maximo, marcas]) =>
      expect(marcasDaEscala(minimo, maximo)).toEqual(marcas),
    );
  });
});
