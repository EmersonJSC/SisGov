/**
 * SG137 — pisos de saúde e educação como parte da receita (vinculação): o
 * nível da lei é a % da receita que vai para a área; o gasto acompanha a
 * arrecadação.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

function turnos(partida: Partida, n: number): Partida {
  let atual = partida;
  for (let i = 0; i < n; i++) {
    const passou = encerrarTurno(atual);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    atual = passou.value.partida;
  }
  return atual;
}

const lei = (partida: Partida, id: string) =>
  verPartida(partida).leis.find((l) => l.id === id)!;

describe("SG137 — pisos vinculados à receita", () => {
  it("os dois pisos são % da receita, com teto de 40%", () => {
    const partida = nova();
    for (const id of ["piso-saude", "piso-educacao"]) {
      const piso = lei(partida, id);
      expect(piso.grupo, id).toBe("orcamentaria");
      expect(piso.unidade, id).toBe("percentual_receita");
      expect(piso.minimo, id).toBe(0);
      expect(piso.maximo, id).toBe(40);
    }
  });

  it("o piso gasta a sua parte da receita, a qualquer momento", () => {
    let partida = nova();
    const mudada = mudarLei(partida, "piso-saude", 15);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    partida = mudada.value;
    for (let t = 0; t < 12; t++) {
      const { contas } = verPartida(partida);
      for (const id of ["piso-saude", "piso-educacao"]) {
        const piso = lei(partida, id);
        // custo anual = nível% × receita anual (o elo lê o nível aprovado)
        expect(-piso.saldoAnual / contas.receita, `${id} t${t}`).toBeCloseTo(
          piso.nivel / 100,
          6,
        );
      }
      partida = turnos(partida, 1);
    }
    // a lei já chegou perto da meta: piso a 15% gasta ~15% da receita
    const saude = lei(partida, "piso-saude");
    expect(saude.nivel).toBeGreaterThan(14.9);
    expect(-saude.saldoAnual / verPartida(partida).contas.receita).toBeCloseTo(
      saude.nivel / 100,
      6,
    );
  }, 60_000);

  it("a conversão não muda o orçamento do Brasil 2026", () => {
    const partida = nova();
    const v = partida.game.execution.values;
    // antes do SG137: R$ 516 bi (4,3% do PIB) e R$ 660 bi (5,5%). Com os
    // valores de jan/2025 (V1-07) a arrecadação sobe de 31,4 para 31,8% do
    // PIB, e os pisos, que são parte dela, sobem junto.
    const { contas } = verPartida(partida);
    const pib = contas.pib;
    expect((-lei(partida, "piso-saude").saldoAnual / pib) * 100).toBeCloseTo(
      4.367, // V1-34: troca de Economia (era 4,36)
      2,
    );
    expect((-lei(partida, "piso-educacao").saldoAnual / pib) * 100).toBeCloseTo(
      5.585416650106848,
      2,
    );
    // gasto total do turno 0: 31,03% do PIB, mais 0,16 das verbas da
    // Segurança em três níveis (SG161), mais os pisos maiores (V1-07)
    expect(v.gasto_publico).toBeCloseTo(31.216734742454538, 1);
  });

  it("mais arrecadação, mais saúde e educação (sem mexer nos pisos)", () => {
    const partida = nova();
    const iva = lei(partida, "imposto-sobre-consumo");
    const mudada = mudarLei(partida, iva.id, iva.nivel + 3);
    if (!mudada.ok) throw new Error(mudada.erros.join(" "));
    const com = turnos(mudada.value, 2);
    const sem = turnos(partida, 2);
    expect(verPartida(com).contas.receita).toBeGreaterThan(
      verPartida(sem).contas.receita,
    );
    for (const id of ["piso-saude", "piso-educacao"])
      expect(-lei(com, id).saldoAnual, id).toBeGreaterThan(
        -lei(sem, id).saldoAnual,
      );
  });
});
