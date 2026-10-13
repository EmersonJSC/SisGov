/**
 * V1-34: piloto das leis em camadas (docs/v1/desenho/leis-em-camadas.md).
 * A mesa do salário mínimo tem três camadas: quem decide (Constituição), a
 * fórmula (lei) e o valor (alavanca). A de cima trava as opções da de baixo,
 * e o valor puxa o gasto da previdência (vínculo).
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

const QUEM = "quem-decide-o-salario-minimo";
const FORMULA = "formula-do-salario-minimo";
const VALOR = "salario-minimo";

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

const lei = (p: Partida, id: string) =>
  verPartida(p).leis.find((l) => l.id === id)!;
const valorDa = (p: Partida, id: string, opcao: string) =>
  p.content.policies
    .find((x) => x.id === id)!
    .controle.opcoes!.find((o) => o.id === opcao)!.valor;
function mudar(p: Partida, id: string, opcao: string): Partida {
  const r = mudarLei(p, id, valorDa(p, id, opcao));
  if (!r.ok) throw new Error(r.erros.join("\n"));
  return r.value;
}

describe("mesa do salário mínimo", () => {
  it("o Brasil começa com as três camadas em vigor, de cima para baixo", () => {
    const mesa = lei(partida, VALOR).mesa!;
    expect(mesa.camadas.map((c) => [c.lei, c.camada, c.emVigor])).toEqual([
      [QUEM, "constituicao", true],
      [FORMULA, "lei", true],
      [VALOR, "alavanca", true],
    ]);
    expect(lei(partida, VALOR).vinculos?.[0].lei).toBe(
      "reajuste-de-beneficios",
    );
  });

  it("a fórmula de ganho real trava o valor baixo e diz quem trava", () => {
    const baixo = lei(partida, VALOR).opcoes!.find(
      (o) => o.id === "piso-baixo",
    )!;
    expect(baixo.trava?.lei).toBe(FORMULA);
    const r = mudarLei(partida, VALOR, baixo.valor);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erros.join(" ")).toContain("Fórmula do salário mínimo");
    // a opção em vigor nunca aparece travada
    expect(
      lei(partida, VALOR).opcoes!.find((o) => o.id === "piso-moderado")!.trava,
    ).toBeUndefined();
  });

  it("trocar a fórmula destrava; voltar a ela puxa o valor para cima", () => {
    let p = mudar(partida, FORMULA, "so-inflacao");
    p = mudar(p, VALOR, "piso-baixo");
    expect(lei(p, VALOR).meta).toBe(valorDa(p, VALOR, "piso-baixo"));
    p = mudar(p, FORMULA, "inflacao-mais-pib");
    expect(lei(p, VALOR).meta).toBe(valorDa(p, VALOR, "piso-moderado"));
  });

  it("sem salário mínimo na Constituição, a fórmula sai e o valor vai a zero", () => {
    const p = mudar(partida, QUEM, "nao-existe");
    expect(lei(p, FORMULA).emVigor).toBe(false);
    expect(lei(p, VALOR).meta).toBe(valorDa(p, VALOR, "sem-piso"));
  });

  it("com comissão técnica, a fórmula fica entre as que a comissão usa", () => {
    const p = mudar(partida, QUEM, "comissao-tecnica");
    const formula = lei(p, FORMULA);
    expect(formula.emVigor).toBe(true);
    expect([
      valorDa(p, FORMULA, "so-inflacao"),
      valorDa(p, FORMULA, "meta-da-mediana"),
    ]).toContain(formula.meta);
    expect(
      formula.opcoes!.find((o) => o.id === "inflacao-mais-pib")!.trava?.lei,
    ).toBe(QUEM);
  });

  it("vínculo: subir o mínimo pesa mais com os benefícios presos a ele", () => {
    const gastoDepois = (reajuste: string) => {
      let p = mudar(partida, "reajuste-de-beneficios", reajuste);
      const r0 = encerrarTurno(p);
      if (!r0.ok) throw new Error(r0.erros.join("\n"));
      const antes = r0.value.partida.game.execution.values.gasto_publico;
      p = mudar(r0.value.partida, VALOR, "piso-alto");
      const r1 = encerrarTurno(p);
      if (!r1.ok) throw new Error(r1.erros.join("\n"));
      return r1.value.partida.game.execution.values.gasto_publico - antes;
    };
    expect(gastoDepois("salario-minimo")).toBeGreaterThan(
      // no primeiro turno o valor novo ainda está chegando (implantação)
      gastoDepois("discricionario") + 0.2,
    );
  });
});
