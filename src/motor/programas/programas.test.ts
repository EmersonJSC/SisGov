import { describe, expect, it } from "vitest";
import type { TipoGrupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import {
  andarProgramas,
  andou,
  iniciarProgramas,
  motivoProgramasInvalidos,
  nomeDoPrograma,
  situacoesDosProgramas,
  type Direcao,
  type EntradaProgramas,
  type EstadoProgramas,
  type LeiDoPrograma,
  type Programa,
  type RegrasProgramas,
} from ".";

const continua = (id: string, extra: Partial<Lei> = {}): Lei =>
  ({
    versao: 1,
    id,
    camada: "jogabilidade",
    forma: "continua",
    unidade: "fracao",
    faixa: { min: 0, max: 1 },
    passo: 0.1,
    efeitos: [],
    bussola: { min: {}, max: { economico: -1 } },
    ...extra,
  }) as Lei;

const escada = (id: string): Lei =>
  ({
    versao: 1,
    id,
    camada: "jogabilidade",
    forma: "opcoes",
    opcoes: ["nada", "pouco", "meio", "tudo"].map((o) => ({
      id: o,
      efeitos: [],
    })),
  }) as Lei;

const leis: Record<string, Lei> = Object.fromEntries(
  [continua("a"), continua("b"), continua("c"), escada("d")].map((l) => [
    l.id,
    l,
  ]),
);

const sobe = (lei: string, minimo: LeiDoPrograma["minimo"]): LeiDoPrograma => ({
  lei,
  direcao: "sobe",
  minimo,
});

const programa: Programa = {
  id: "casa-cheia",
  nome: "Casa cheia",
  lado: "esquerda",
  minimo: 3,
  palavras: { tema: "moradia", bem: "teto", mal: "rua", publico: "família" },
  leis: [sobe("a", 0.1), sobe("b", 0.1), sobe("c", 0.1), sobe("d", "degrau")],
};

const regras: RegrasProgramas = {
  programas: [programa],
  moldes: ["mais {bem}", "{tema} para {publico}"],
  nomesDoPais: {},
};

/** Quem gosta de economia à esquerda (a lei empurra para lá). */
const esquerda: TipoGrupo = {
  id: "esquerda",
  membros: { pop: 1 },
  cobra: [],
  bussola: { economico: -1 },
  peso: { economico: 1 },
};
const direita: TipoGrupo = {
  ...esquerda,
  id: "direita",
  bussola: { economico: 1 },
};

const parado: Record<string, ValorLei> = { a: 0, b: 0, c: 0, d: "nada" };

function entrada(
  valores: Record<string, ValorLei>,
  estado: EstadoProgramas,
  extra: Partial<EntradaProgramas> = {},
): EntradaProgramas {
  return {
    regras,
    estado,
    leis,
    valores,
    tipos: [esquerda, direita],
    turno: 1,
    mandato: 0,
    atrasoDaLei: () => 0,
    ...extra,
  };
}

describe("andou: a lei andou o que o programa pede?", () => {
  const regua = continua("x");
  const pede = (
    minimo: LeiDoPrograma["minimo"],
    direcao: Direcao = "sobe",
  ) => ({
    lei: "x",
    direcao,
    minimo,
  });

  it("régua: precisa de pelo menos a fração pedida, na direção certa", () => {
    expect(andou(regua, pede(0.1), 0.5, 0.6)).toBe(true);
    expect(andou(regua, pede(0.1), 0.5, 0.55)).toBe(false);
    expect(andou(regua, pede(0.1), 0.5, 0.4)).toBe(false);
    expect(andou(regua, pede(0.1, "desce"), 0.5, 0.4)).toBe(true);
    expect(andou(regua, pede(0.1, "muda"), 0.5, 0.4)).toBe(true);
  });

  it("degrau: um passo da régua ou uma opção da escada", () => {
    expect(andou(regua, pede("degrau"), 0.5, 0.6)).toBe(true);
    expect(andou(regua, pede("degrau"), 0.5, 0.5)).toBe(false);
    const d = escada("d");
    expect(andou(d, { ...pede("degrau"), lei: "d" }, "nada", "pouco")).toBe(
      true,
    );
    expect(andou(d, { ...pede("degrau"), lei: "d" }, "pouco", "nada")).toBe(
      false,
    );
  });

  it("ativa: a lei liga (sobe) ou desliga (desce)", () => {
    expect(andou(regua, pede("ativa"), 0, 0.3)).toBe(true);
    expect(andou(regua, pede("ativa"), 0.2, 0.5)).toBe(false);
    expect(andou(regua, pede("ativa", "desce"), 0.3, 0)).toBe(true);
    expect(andou(regua, pede("ativa", "desce"), 0, 0.3)).toBe(false);
  });
});

describe("forma e desfaz", () => {
  const comeco = iniciarProgramas(0, parado);

  it("3 de 4 leis na direção formam; 2 de 4 não", () => {
    const duas = andarProgramas(entrada({ ...parado, a: 0.2, b: 0.2 }, comeco));
    expect(duas.fatos).toEqual([]);
    expect(duas.estado.vidas[programa.id]).toBeUndefined();

    const tres = andarProgramas(
      entrada({ ...parado, a: 0.2, b: 0.2, c: 0.2 }, comeco),
    );
    expect(tres.estado.vidas[programa.id]).toMatchObject({
      situacao: "formado",
      desde: 1,
      vezes: 1,
    });
    expect(tres.fatos).toMatchObject([
      { tipo: "programa-formado", sobre: programa.id, tamanho: "grande" },
    ]);
  });

  it("a escada também conta como lei do programa", () => {
    const saida = andarProgramas(
      entrada({ ...parado, a: 0.2, b: 0.2, d: "meio" }, comeco),
    );
    expect(saida.estado.vidas[programa.id]?.situacao).toBe("formado");
  });

  it("voltar uma lei desfaz e deixa a lembrança (nostalgia)", () => {
    const feito = andarProgramas(
      entrada({ ...parado, a: 0.2, b: 0.2, c: 0.2 }, comeco),
    ).estado;
    const volta = andarProgramas(
      entrada({ ...parado, a: 0.2, b: 0.2 }, feito, { turno: 2 }),
    );
    expect(volta.estado.vidas[programa.id]).toMatchObject({
      situacao: "desfeito",
      desde: 2,
      nome: feito.vidas[programa.id].nome,
      lembranca: feito.vidas[programa.id].lembranca,
    });
    expect(volta.fatos).toMatchObject([{ tipo: "programa-desfeito" }]);
  });

  it("refeito, usa o mesmo nome e conta a segunda vez", () => {
    const todas = { ...parado, a: 0.2, b: 0.2, c: 0.2 };
    const feito = andarProgramas(entrada(todas, comeco)).estado;
    const desfeito = andarProgramas(
      entrada({ ...parado, a: 0.2 }, feito, { turno: 2 }),
    ).estado;
    const outra = andarProgramas(entrada(todas, desfeito, { turno: 3 }));
    expect(outra.estado.vidas[programa.id]).toMatchObject({
      situacao: "formado",
      vezes: 2,
      nome: feito.vidas[programa.id].nome,
    });
    expect(outra.fatos[0]).toMatchObject({ tamanho: "medio" });
  });

  it("sem mudança, nada acontece", () => {
    const saida = andarProgramas(entrada(parado, comeco));
    expect(saida.estado).toEqual(comeco);
    expect(saida.fatos).toEqual([]);
  });
});

describe("mandato", () => {
  const andadas = { ...parado, a: 0.2, b: 0.2, c: 0.2 };

  it("a lei que já estava alta no começo do mandato não conta", () => {
    const comeco = iniciarProgramas(0, andadas);
    expect(andarProgramas(entrada(andadas, comeco)).fatos).toEqual([]);
  });

  it("mandato novo: o ponto de partida passa a ser o de hoje", () => {
    const comeco = iniciarProgramas(0, parado);
    const novo = andarProgramas(entrada(andadas, comeco, { mandato: 6 }));
    expect(novo.estado.mandato).toBe(6);
    expect(novo.estado.referencia).toEqual(andadas);
    expect(novo.fatos).toEqual([]);
  });

  it("programa formado segue de pé no mandato novo se as leis ficam", () => {
    const feito = andarProgramas(
      entrada(andadas, iniciarProgramas(0, parado)),
    ).estado;
    const novo = andarProgramas(
      entrada(andadas, feito, { mandato: 6, turno: 7 }),
    );
    expect(novo.estado.vidas[programa.id].situacao).toBe("formado");
    expect(novo.fatos).toEqual([]);
  });
});

describe("ministro mais fraco", () => {
  const andadas = { ...parado, a: 0.2, b: 0.2, c: 0.2 };

  it("um turno de espera: forma depois, e só se as leis ficarem", () => {
    const fraco = { atrasoDaLei: (l: Lei) => (l.id === "b" ? 1 : 0) };
    const comeco = iniciarProgramas(0, parado);
    const t1 = andarProgramas(entrada(andadas, comeco, fraco));
    expect(t1.estado.vidas[programa.id]).toBeUndefined();
    expect(t1.estado.formando[programa.id]).toBe(1);

    const t2 = andarProgramas(
      entrada(andadas, t1.estado, { ...fraco, turno: 2 }),
    );
    expect(t2.estado.vidas[programa.id]?.situacao).toBe("formado");
    expect(t2.estado.formando).toEqual({});

    const desistiu = andarProgramas(
      entrada(parado, t1.estado, { ...fraco, turno: 2 }),
    );
    expect(desistiu.estado.formando).toEqual({});
    expect(desistiu.estado.vidas[programa.id]).toBeUndefined();
  });

  it("ministro competente (atraso −1) não adianta a formação", () => {
    const saida = andarProgramas(
      entrada(andadas, iniciarProgramas(0, parado), { atrasoDaLei: () => -1 }),
    );
    expect(saida.estado.vidas[programa.id]?.vezes).toBe(1);
  });
});

describe("lembrança dos grupos", () => {
  it("quem gosta do lado da lei lembra bem, quem não gosta lembra mal", () => {
    const { vidas } = andarProgramas(
      entrada(
        { ...parado, a: 0.5, b: 0.5, c: 0.5 },
        iniciarProgramas(0, parado),
      ),
    ).estado;
    const { lembranca } = vidas[programa.id];
    expect(lembranca.esquerda).toBeGreaterThan(0);
    expect(lembranca.direita).toBeLessThan(0);
    for (const v of Object.values(lembranca))
      expect(Math.abs(v)).toBeLessThanOrEqual(1);
  });
});

describe("nome", () => {
  it("o país dá o nome próprio", () => {
    const r = { ...regras, nomesDoPais: { [programa.id]: "Minha Casa" } };
    expect(nomeDoPrograma(r, programa)).toBe("Minha Casa");
  });

  it("sem nome do país, os moldes e as palavras criam; sempre o mesmo", () => {
    const nome = nomeDoPrograma(regras, programa);
    expect(["Mais teto", "Moradia para família"]).toContain(nome);
    expect(nomeDoPrograma(regras, programa)).toBe(nome);
  });

  it("sem moldes, fica o nome da planilha", () => {
    expect(nomeDoPrograma({ ...regras, moldes: [] }, programa)).toBe(
      "Casa cheia",
    );
  });
});

describe("situação para a tela", () => {
  it("diz quais leis andaram e quais faltam", () => {
    const [s] = situacoesDosProgramas(
      regras,
      iniciarProgramas(0, parado),
      leis,
      { ...parado, a: 0.2, d: "pouco" },
    );
    expect(s).toEqual({
      id: programa.id,
      andadas: ["a", "d"],
      faltam: ["b", "c"],
      minimo: 3,
    });
  });
});

describe("conferência dos dados", () => {
  const motivo = (r: Partial<RegrasProgramas>, l = leis) =>
    motivoProgramasInvalidos({ ...regras, ...r }, l);
  const com = (p: Partial<Programa>) => ({
    programas: [{ ...programa, ...p }],
  });

  it("aceita o que está certo", () => {
    expect(motivo({})).toBeNull();
  });

  it("recusa lei que não existe, mínimo impossível e id repetido", () => {
    expect(motivo(com({ leis: [sobe("z", "degrau")], minimo: 1 }))).toMatch(
      /não existe/,
    );
    expect(motivo(com({ minimo: 5 }))).toMatch(/forma-se com 5/);
    expect(motivo({ programas: [programa, programa] })).toMatch(/repetido/);
  });

  it("recusa palavra de molde desconhecida e nome para programa que não existe", () => {
    expect(motivo({ moldes: ["{cor} e {bem}"] })).toMatch(/\{cor\}/);
    expect(motivo({ nomesDoPais: { fantasma: "X" } })).toMatch(/fantasma/);
  });
});
