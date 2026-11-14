// Judiciário na partida do Brasil: a vaga chega como papel importante, a
// indicação passa pelo Senado e a carreira preenche sozinha.
import { describe, expect, it } from "vitest";
import { ehVaga, type Ficha, type PapelDeIndicacao } from "../motor";
import { avancar, criarPartida, type Partida } from ".";

const SEMENTE = 3;

/** Partida com o juiz da primeira cadeira do STF a um passo da aposentadoria. */
function comVelho(leiDeEscolha?: string): Partida {
  const p = criarPartida("brasil-2026", SEMENTE);
  const j = p.estado.judiciario;
  if (!j) throw new Error("o Brasil precisa de Judiciário");
  const [primeiro, ...resto] = j.tribunais.stf;
  return {
    ...p,
    estado: {
      ...p.estado,
      leis: leiDeEscolha
        ? { ...p.estado.leis, "indicacao-de-juizes": leiDeEscolha }
        : p.estado.leis,
      judiciario: {
        tribunais: {
          ...j.tribunais,
          stf: [{ ...(primeiro as Ficha), idade: 74.9 }, ...resto],
        },
      },
    },
  };
}

/** O papel da vaga da primeira cadeira do STF (a do juiz que envelhecemos). */
const papelDaVaga = (p: Partida) =>
  (p.estado.mesa ?? []).find(
    (x): x is PapelDeIndicacao =>
      x.familia === "justica" && x.tipo === "indicacao" && x.cadeira === 0,
  );

describe("judiciário na partida", () => {
  it("o Brasil começa com o STF declarado (10 juízes e 1 vaga) e o TSE só com presidente", () => {
    const j = criarPartida("brasil-2026", SEMENTE).estado.judiciario;
    expect(Object.keys(j?.tribunais ?? {})).toEqual(["stf", "tse"]);
    expect(j?.tribunais.stf).toHaveLength(11);
    expect(j?.tribunais.stf.filter(ehVaga)).toHaveLength(1);
    // o país declara quem preside: o STF e o TSE do começo do mandato
    expect(j?.presidencia?.stf.id).toBe("juiz:stf:edson-fachini");
    expect(j?.presidencia?.tse.id).toBe("juiz:stf:nunes-marcos");
    expect(j?.tribunais.tse).toEqual([]);
    const doStf = new Set(j?.tribunais.stf.map((c) => !ehVaga(c) && c.id));
    expect(doStf.has(j?.presidencia?.stf.id ?? "")).toBe(true);
    expect(doStf.has(j?.presidencia?.tse.id ?? "")).toBe(true);
    expect(j?.presidencia?.tse.id).not.toBe(j?.presidencia?.stf.id);
  });

  it("a aposentadoria vira papel importante com três cartas e manchete", () => {
    const depois = avancar(comVelho());
    const papel = papelDaVaga(depois);
    expect(papel?.importante).toBe(true);
    expect(papel?.tribunal).toBe("stf");
    expect(papel?.cartas).toHaveLength(3);
    expect(depois.estado.fatos?.map((f) => f.tipo)).toContain(
      "juiz-aposentado",
    );
  });

  it("indicar quem o Senado aceita põe a pessoa na cadeira", () => {
    const comVaga = avancar(comVelho("presidente-indica-livre"));
    const papel = papelDaVaga(comVaga);
    if (!papel) throw new Error("sem papel de vaga");
    const tecnico = papel.cartas[1];
    const depois = avancar(comVaga, [
      { tipo: "indicar", tribunal: "stf", cadeira: 0, pessoa: tecnico.id },
    ]);
    const cadeira = depois.estado.judiciario?.tribunais.stf[0];
    expect(cadeira && !ehVaga(cadeira) && cadeira.id).toBe(tecnico.id);
    expect(papelDaVaga(depois)).toBeUndefined();
  });

  it("na carreira, nenhuma vaga chega à mesa", () => {
    const depois = avancar(comVelho("a-carreira-escolhe"));
    expect(papelDaVaga(depois)).toBeUndefined();
    const cadeira = depois.estado.judiciario?.tribunais.stf[0];
    expect(cadeira && !ehVaga(cadeira) && cadeira.origem).toBe("tecnico");
  });
});
