import { describe, expect, it } from "vitest";
import { novoFato, type Fato, type FatoNovo } from "../fatos";
import {
  fecharJornal,
  impactoDoFato,
  iniciarMidia,
  jornalDoTurno,
  motivoMidiasInvalidas,
  type Midia,
  type RegrasMidia,
} from ".";

const fato = (f: Partial<FatoNovo> & Pick<FatoNovo, "tipo">): Fato =>
  novoFato({ turno: 5, tamanho: "medio", ...f });

describe("jornal do turno", () => {
  it("a notícia de maior impacto abre o jornal", () => {
    const fatos = [
      fato({ tipo: "lei-aprovada", sobre: "a" }),
      fato({ tipo: "escandalo", tamanho: "grande", sobre: "saude" }),
      fato({ tipo: "papel-assinado", tamanho: "pequeno", sobre: "a" }),
    ];
    expect(jornalDoTurno(fatos, 5).map((f) => f.tipo)).toEqual([
      "escandalo",
      "lei-aprovada",
      "papel-assinado",
    ]);
  });

  it("traz só as 3 maiores", () => {
    const fatos = Array.from({ length: 6 }, (_, i) =>
      fato({ tipo: "lei-aprovada", sobre: `lei-${i}` }),
    );
    expect(jornalDoTurno(fatos, 5)).toHaveLength(3);
  });

  it("não traz fato velho, só o que aconteceu neste turno", () => {
    const velho = fato({
      tipo: "eleicao-vencida",
      turno: 4,
      tamanho: "grande",
    });
    const novo = fato({ tipo: "lei-aprovada", sobre: "a" });
    expect(jornalDoTurno([velho, novo], 5)).toEqual([novo]);
  });

  it("em empate, fica a ordem em que foram escritos", () => {
    const a = fato({ tipo: "lei-aprovada", sobre: "a" });
    const b = fato({ tipo: "lei-aprovada", sobre: "b" });
    expect(jornalDoTurno([a, b], 5)).toEqual([a, b]);
    expect(jornalDoTurno([b, a], 5)).toEqual([b, a]);
  });

  it("sem fatos, jornal vazio", () => {
    expect(jornalDoTurno([], 5)).toEqual([]);
  });

  it("tamanho e tipo contam: eleição grande vale mais que lei média", () => {
    expect(
      impactoDoFato(fato({ tipo: "eleicao-perdida", tamanho: "grande" })),
    ).toBeGreaterThan(impactoDoFato(fato({ tipo: "lei-aprovada" })));
  });

  it("fecharJornal guarda o jornal e mantém a credibilidade", () => {
    const antes = iniciarMidia({ midias: [midia("a")] });
    const depois = fecharJornal(antes, [fato({ tipo: "decreto" })], 5);
    expect(depois.jornal).toHaveLength(1);
    expect(depois.credibilidade).toEqual(antes.credibilidade);
  });
});

const midia = (id: string, extra: Partial<Midia> = {}): Midia => ({
  id,
  nome: id,
  dono: "privado",
  bussola: { economico: 0.2, social: -0.2 },
  audiencia: { g1: 0.5 },
  credibilidade: 60,
  ...extra,
});

describe("mídias do país", () => {
  it("começam com a credibilidade que o país declarou", () => {
    const regras: RegrasMidia = {
      midias: [
        midia("a", { credibilidade: 70 }),
        midia("b", { credibilidade: 30 }),
      ],
    };
    expect(iniciarMidia(regras).credibilidade).toEqual({ a: 70, b: 30 });
  });

  const motivo = (m: Midia[]) => motivoMidiasInvalidas({ midias: m }, ["g1"]);

  it("aceita o que está certo", () => {
    expect(motivo([midia("a"), midia("b")])).toBeNull();
  });

  it("recusa repetida, dono estranho, número fora da faixa e grupo que não existe", () => {
    expect(motivo([midia("a"), midia("a")])).toMatch(/repetida/);
    expect(motivo([midia("a", { dono: "alien" as Midia["dono"] })])).toMatch(
      /dono/,
    );
    expect(motivo([midia("a", { credibilidade: 120 })])).toMatch(
      /credibilidade/,
    );
    expect(motivo([midia("a", { bussola: { economico: 2 } })])).toMatch(
      /bússola/,
    );
    expect(motivo([midia("a", { audiencia: { fantasma: 0.1 } })])).toMatch(
      /fantasma/,
    );
    expect(motivo([midia("a", { audiencia: { g1: 1.5 } })])).toMatch(
      /audiência/,
    );
  });
});
