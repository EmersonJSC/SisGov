/**
 * Prova real da bússola (V1-34): os programas de governo têm fonte em cada
 * linha, e a prova mostra quantos chegam perto da referência
 * (docs/v1/desenho/leis-de-todos-os-lados.md, seção 7).
 */
import { beforeAll, describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import programas from "../conteudo/bussola/programas.json";
import { distancia, pontoAtual, referenciasDaBussola } from "../game/bussola";
import {
  aplicarPrograma,
  nivelDaLinha,
  type ProgramaDeGoverno,
} from "../game/bussola/programas";

const lista = Object.entries(
  programas.programas as Record<string, ProgramaDeGoverno>,
);
const ref = (id: string) =>
  referenciasDaBussola.personalidades.find((p) => p.id === id);

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

describe("programas de governo", () => {
  it("toda linha aponta para lei e opção do catálogo, com fonte", () => {
    for (const [nome, prog] of lista) {
      expect(ref(prog.referencia), nome).toBeDefined();
      for (const id of prog.opostos)
        expect(ref(id), `${nome} ${id}`).toBeDefined();
      expect(["treino", "teste"], nome).toContain(prog.grupo);
      const leis = new Set<string>();
      for (const linha of prog.leis) {
        const onde = `${nome}: ${linha.lei}`;
        expect(leis.has(linha.lei), onde).toBe(false);
        leis.add(linha.lei);
        expect(nivelDaLinha(partida.content, linha), onde).toBeDefined();
        expect(["aprovou", "manteve"], onde).toContain(linha.como);
        expect(linha.fonte.length, onde).toBeGreaterThan(5);
      }
    }
  });

  it("metade treino, metade teste", () => {
    const treino = lista.filter(([, p]) => p.grupo === "treino").length;
    expect(treino * 2).toBe(lista.length);
  });

  it("passam os 6 medidos em 13/out (a meta é passarem os 10)", () => {
    const { content, game } = partida;
    const { distanciaMaxima } = programas.regraDePassar;
    const passam = lista.filter(([, prog]) => {
      const p = pontoAtual(
        content,
        game.compass!,
        aplicarPrograma(content, game.policies, prog),
      );
      const alvo = distancia(p, ref(prog.referencia)!);
      return (
        alvo <= distanciaMaxima &&
        prog.opostos.every((id) => alvo < distancia(p, ref(id)!))
      );
    });
    expect(passam.map(([nome]) => nome).sort()).toEqual(
      ["brejnev", "fidel", "merkel", "pinera", "putin", "thatcher"].sort(),
    );
  });
});
