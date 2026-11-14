// Judiciário: aposentadoria abre vaga, a lei diz quem preenche, o Senado vota
// o nome e a independência anda com quem senta.
import { describe, expect, it } from "vitest";
import {
  cartasDaVaga,
  ehVaga,
  envelhecerJuizes,
  juizesIniciais,
  pontosDeIndependencia,
  motivoJudiciarioInvalido,
  preencherPelaCarreira,
  sentar,
  trocarPresidentes,
  vagasAbertas,
  votoDoSenado,
  type RegrasJudiciario,
} from ".";
import type { Ficha } from "../governo";

const regras: RegrasJudiciario = {
  tribunais: [
    { id: "corte", rotulo: "Corte", funcao: "constitucional", cadeiras: 5 },
    {
      id: "eleitoral",
      rotulo: "Eleitoral",
      funcao: "eleitoral",
      cadeiras: 0,
      presidido_por: "corte",
    },
  ],
  aposentadoria: 75,
  idade_no_comeco: { de: 45, ate: 71 },
  idade_do_indicado: { de: 50, ate: 64 },
  lei_escolha: "quem-escolhe",
  modos: { carreira: "carreira", senado: "senado", livre: "livre" },
  indice_independencia: "independencia",
  pontos_independencia: 30,
  modelo: {
    proprios: { f: ["Ana", "Bia", "Clara"], m: ["Davi", "Eli", "Caio"] },
    sobrenomes: ["Silva", "Souza", "Lima", "Rocha", "Melo"],
    quantidade: 0,
    tecnicos: 0,
  },
  partidos: [
    { id: "esq", cadeiras: 40, bussola: { economico: -0.6, social: -0.3 } },
    { id: "dir", cadeiras: 60, bussola: { economico: 0.6, social: 0.4 } },
  ],
};
const senado = { esq: 40, dir: 60 };

/** Um tribunal com uma pessoa perto da aposentadoria na cadeira 0. */
function comVelho() {
  const j = juizesIniciais(regras, 1);
  const velho = { ...(j.tribunais.corte[0] as Ficha), idade: 74.9 };
  return sentar(j, "corte", 0, velho, 0);
}

describe("judiciário (motor)", () => {
  it("o começo enche todas as cadeiras com juízes de 45 a 71 anos", () => {
    const j = juizesIniciais(regras, 1);
    expect(j.tribunais.corte).toHaveLength(5);
    for (const c of j.tribunais.corte) {
      expect(ehVaga(c)).toBe(false);
      const idade = (c as Ficha).idade ?? 0;
      expect(idade).toBeGreaterThanOrEqual(45);
      expect(idade).toBeLessThan(75);
    }
  });

  it("quem chega à idade sai e deixa a cadeira vaga", () => {
    const j = envelhecerJuizes(regras, comVelho(), 3);
    const vagas = vagasAbertas(j);
    expect(vagas).toHaveLength(1);
    expect(vagas[0].vaga.desde).toBe(3);
  });

  it("na carreira, a própria corte preenche a vaga com um técnico", () => {
    const j = preencherPelaCarreira(
      regras,
      envelhecerJuizes(regras, comVelho(), 3),
      3,
    );
    expect(vagasAbertas(j)).toHaveLength(0);
    expect((j.tribunais.corte[0] as Ficha).origem).toBe("tecnico");
  });

  it("a vaga sorteia sempre as mesmas três cartas: aliado, técnico e do Senado", () => {
    const j = envelhecerJuizes(regras, comVelho(), 3);
    const { vaga } = vagasAbertas(j)[0];
    const a = cartasDaVaga(regras, "esq", senado, "corte", 0, vaga);
    const b = cartasDaVaga(regras, "esq", senado, "corte", 0, vaga);
    expect(a).toEqual(b);
    expect(a.map((c) => c.origem)).toEqual(["esq", "tecnico", "dir"]);
  });

  it("no Senado, a base aprova; fora dela, quem está longe vota não", () => {
    const aliado: Ficha = {
      ...(juizesIniciais(regras, 1).tribunais.corte[0] as Ficha),
      bussola: { economico: -0.6, social: -0.3 },
      origem: "esq",
    };
    expect(votoDoSenado(regras, senado, ["esq"], aliado).aprovado).toBe(false);
    expect(votoDoSenado(regras, senado, ["esq", "dir"], aliado).aprovado).toBe(
      true,
    );
    const doLado = { ...aliado, bussola: { economico: 0.6, social: 0.4 } };
    expect(votoDoSenado(regras, senado, ["esq"], doLado).aprovado).toBe(true);
  });

  it("juiz do partido do governo baixa a independência; técnico sobe", () => {
    const j = juizesIniciais(regras, 1);
    const ficha = j.tribunais.corte[0] as Ficha;
    const doGoverno = sentar(j, "corte", 0, { ...ficha, origem: "esq" }, 0);
    const tecnico = sentar(j, "corte", 0, { ...ficha, origem: "tecnico" }, 0);
    expect(pontosDeIndependencia(regras, tecnico, "esq")).toBeGreaterThan(
      pontosDeIndependencia(regras, doGoverno, "esq"),
    );
  });

  describe("presidente da corte", () => {
    /** Ids da corte, do mais antigo ao mais novo. */
    const porAntiguidade = (j: ReturnType<typeof juizesIniciais>) =>
      (j.tribunais.corte as Ficha[])
        .map((f, cadeira) => ({ f, cadeira }))
        .sort(
          (a, b) =>
            (a.f.posse ?? 0) - (b.f.posse ?? 0) || a.cadeira - b.cadeira,
        )
        .map((x) => x.f.id);

    it("no começo preside o mais antigo; o eleitoral pega o seguinte da corte", () => {
      const j = juizesIniciais(regras, 1);
      const fila = porAntiguidade(j);
      expect(j.presidencia?.corte.id).toBe(fila[0]);
      expect(j.presidencia?.eleitoral.id).toBe(fila[1]);
      expect(j.tribunais.eleitoral).toEqual([]);
    });

    it("o mandato dura 12 turnos; depois assume o mais antigo que não presidiu", () => {
      const j = juizesIniciais(regras, 1);
      const fila = porAntiguidade(j);
      expect(trocarPresidentes(regras, j, 11).trocas).toHaveLength(0);
      const { estado, trocas } = trocarPresidentes(regras, j, 12);
      expect(trocas.map((t) => t.tribunal)).toEqual(["corte", "eleitoral"]);
      // o seguinte da corte é quem presidia o eleitoral; o eleitoral pega o mais
      // antigo que ainda não o presidiu (pode ser o ex-presidente da corte)
      expect(estado.presidencia?.corte.id).toBe(fila[1]);
      expect(estado.presidencia?.eleitoral.id).toBe(fila[0]);
    });

    it("presidente que se aposenta é trocado no mesmo turno", () => {
      const j = juizesIniciais(regras, 1);
      const presidente = j.presidencia?.corte.id;
      const cadeira = (j.tribunais.corte as Ficha[]).findIndex(
        (f) => f.id === presidente,
      );
      const velho = { ...(j.tribunais.corte[cadeira] as Ficha), idade: 74.9 };
      const saiu = envelhecerJuizes(
        regras,
        sentar(j, "corte", cadeira, velho, -100),
        4,
      );
      const { estado } = trocarPresidentes(regras, saiu, 4);
      expect(estado.presidencia?.corte.id).not.toBe(presidente);
      expect(estado.presidencia?.corte.desde).toBe(4);
    });

    it("quando todos já presidiram, a fila recomeça", () => {
      let j = juizesIniciais(regras, 1);
      const vistos: string[] = [];
      for (let turno = 0; turno <= 12 * 5; turno += 12) {
        j = trocarPresidentes(regras, j, turno).estado;
        vistos.push(j.presidencia?.corte.id ?? "");
      }
      expect(new Set(vistos.slice(0, 5)).size).toBe(5);
      expect(vistos[5]).toBe(vistos[0]);
    });

    it("tribunal sem cadeiras só vale com presidido_por", () => {
      expect(
        motivoJudiciarioInvalido({
          tribunais: [
            { id: "x", rotulo: "X", funcao: "constitucional", cadeiras: 0 },
          ],
          aposentadoria: 75,
          idade_no_comeco: { de: 45, ate: 71 },
          idade_do_indicado: { de: 50, ate: 64 },
        }),
      ).toMatch(/cadeiras/);
      expect(motivoJudiciarioInvalido(regras)).toBeNull();
    });
  });
});
