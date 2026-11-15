import { describe, expect, it } from "vitest";
import { validarLei } from "./validar";

const indices = ["padrao_vida", "seguranca"];
const valida = {
  versao: 1,
  id: "teste",
  camada: "jogabilidade",
  canal: "imposto",
  jeito: "regua",
  forma: "continua",
  unidade: "fracao",
  faixa: { min: 0, max: 0.5 },
  passo: 0.01,
  calculo: { base: "renda", modelo: "laffer" },
  efeitos: [
    { indice: "padrao_vida", sentido: -1, forca: "fraca", atraso_turnos: 1 },
  ],
};
const campos = (dado: unknown) =>
  validarLei(dado, "leis/teste.json", indices).map((e) => e.campo);

describe("validarLei", () => {
  it("aceita lei válida", () => {
    expect(validarLei(valida, "leis/teste.json", indices)).toEqual([]);
  });

  it("unidade meses/anos: faixa na unidade real, sem cálculo nem conta", () => {
    const servico = {
      ...valida,
      calculo: undefined,
      canal: "regra",
      unidade: "meses",
      faixa: { min: 0, max: 24 },
      passo: 1,
    };
    expect(campos(servico)).toEqual([]);
    expect(campos({ ...servico, unidade: "anos" })).toEqual([]);
    expect(campos({ ...servico, unidade: "dias" })).toEqual(["unidade"]);
    expect(campos({ ...servico, faixa: { min: 5, max: 5 } })).toEqual([
      "faixa",
    ]);
    expect(campos({ ...servico, conta: "gasto" })).toEqual([
      "unidade",
      "jeito",
    ]);
    expect(campos({ ...valida, faixa: { min: 0, max: 24 } })).toEqual([
      "faixa",
    ]);
  });

  it("unidade livre: faixa em qualquer unidade, com o nome dela", () => {
    const velocidade = {
      ...valida,
      calculo: undefined,
      canal: "regra",
      unidade: "livre",
      rotulo_unidade: "km/h",
      faixa: { min: 80, max: 140 },
      passo: 1,
    };
    expect(campos(velocidade)).toEqual([]);
    expect(campos({ ...velocidade, rotulo_unidade: undefined })).toEqual([
      "rotulo_unidade",
    ]);
    expect(campos({ ...velocidade, rotulo_unidade: " " })).toEqual([
      "rotulo_unidade",
    ]);
    expect(campos({ ...velocidade, conta: "gasto" })).toEqual([
      "unidade",
      "jeito",
    ]);
    const meta = { ...velocidade, faixa: { min: -5, max: 4 } };
    expect(campos(meta)).toEqual([]);
    expect(campos({ ...meta, unidade: "anos" })).toEqual(["faixa"]);
  });

  it('lei de gasto: conta só aceita "gasto" e não tem cálculo', () => {
    const gasto = {
      ...valida,
      calculo: undefined,
      canal: "verba",
      jeito: "verba",
    };
    expect(campos({ ...gasto, conta: "gasto" })).toEqual([]);
    expect(campos({ ...gasto, conta: "lucro" })).toEqual([
      "canal",
      "conta",
      "jeito",
    ]);
    expect(campos({ ...valida, conta: "gasto" })).toEqual(["conta", "jeito"]);
  });

  it("canal: diz como a lei chega ao pop e bate com o que ela faz", () => {
    expect(campos({ ...valida, canal: undefined })).toEqual(["canal"]);
    // imposto sem cálculo, ou cálculo em outro canal
    expect(campos({ ...valida, canal: "direito" })).toEqual(["canal"]);
    expect(campos({ ...valida, calculo: undefined })).toEqual(["canal"]);
    // espera precisa dizer o quê; fora da espera, não tem motivo
    const solta = { ...valida, calculo: undefined, canal: "espera" };
    expect(campos(solta)).toEqual(["espera"]);
    expect(campos({ ...solta, espera: "triagem" })).toEqual([]);
    expect(campos({ ...valida, espera: "triagem" })).toEqual(["espera"]);
  });

  it("bússola: eixos conhecidos, entre -1 e 1", () => {
    const ok = { min: { economico: 0.5 }, max: { economico: -0.5 } };
    expect(campos({ ...valida, bussola: ok })).toEqual([]);
    expect(
      campos({
        ...valida,
        bussola: { min: { cultural: 0 }, max: { social: 2 } },
      }),
    ).toEqual(["bussola.min.cultural", "bussola.max.social"]);
    expect(campos({ ...valida, bussola: { min: {} } })).toEqual([
      "bussola.max",
    ]);
  });

  it("diz arquivo, campo e motivo", () => {
    const [erro] = validarLei(
      { ...valida, passo: 0 },
      "leis/teste.json",
      indices,
    );
    expect(erro).toEqual({
      arquivo: "leis/teste.json",
      campo: "passo",
      motivo: "precisa ser > 0",
    });
  });

  it("barra índice inexistente, índice essencial e base desconhecida", () => {
    expect(
      campos({
        ...valida,
        calculo: { base: "petroleo", modelo: "laffer" },
        efeitos: [
          {
            indice: "felicidade",
            sentido: 1,
            forca: "fraca",
            atraso_turnos: 0,
          },
          {
            indice: "arrecadacao",
            sentido: 1,
            forca: "fraca",
            atraso_turnos: 0,
          },
        ],
      }),
    ).toEqual(["calculo.base", "efeitos[0].indice", "efeitos[1].indice"]);
  });

  it("barra faixa invertida, força numérica e id diferente do arquivo", () => {
    expect(
      campos({
        ...valida,
        id: "outra",
        faixa: { min: 0.5, max: 0.2 },
        efeitos: [
          { indice: "seguranca", sentido: 1, forca: 3, atraso_turnos: 0 },
        ],
      }),
    ).toEqual(["id", "faixa", "efeitos[0].forca"]);
  });

  it("lei de opções precisa de duas opções sem id repetido", () => {
    const base = {
      versao: 1,
      id: "teste",
      camada: "jogabilidade",
      canal: "espera",
      espera: "triagem",
      forma: "opcoes",
    };
    expect(campos({ ...base, opcoes: [{ id: "a", efeitos: [] }] })).toEqual([
      "opcoes",
    ]);
    expect(
      campos({
        ...base,
        opcoes: [
          { id: "a", efeitos: [] },
          { id: "a", efeitos: [] },
        ],
      }),
    ).toEqual(["opcoes[1].id"]);
  });
});

describe("regras de classificação (jeito)", () => {
  const efeito = {
    indice: "seguranca",
    sentido: 1,
    forca: "fraca",
    atraso_turnos: 0,
  };
  const degrau = (id: string) => ({ id, efeitos: [efeito] });
  const niveis = {
    versao: 1,
    id: "teste",
    camada: "jogabilidade",
    canal: "direito",
    jeito: "niveis",
    forma: "opcoes",
    opcoes: ["a", "b", "c"].map(degrau),
  };
  it("lei triada precisa do jeito; na triagem, não", () => {
    expect(campos({ ...niveis, jeito: undefined })).toEqual(["jeito"]);
    expect(
      campos({
        ...niveis,
        jeito: undefined,
        canal: "espera",
        espera: "triagem",
      }),
    ).toEqual([]);
  });
  it("níveis têm de 3 a 5 degraus; escolha pode ter 2", () => {
    expect(campos(niveis)).toEqual([]);
    const dois = { ...niveis, opcoes: ["a", "b"].map(degrau) };
    expect(campos(dois)).toEqual(["opcoes"]);
    expect(campos({ ...dois, jeito: "escolha" })).toEqual([]);
    const seis = {
      ...niveis,
      opcoes: ["a", "b", "c", "d", "e", "f"].map(degrau),
    };
    expect(campos(seis)).toEqual(["opcoes"]);
  });
  it("degrau que não faz nada é recusado: nada é não legislada", () => {
    const comNada = {
      ...niveis,
      opcoes: [
        { id: "nada", efeitos: [], bussola: { economico: 0 } },
        degrau("b"),
        degrau("c"),
      ],
    };
    expect(campos(comNada)).toEqual(["opcoes[0]"]);
    const comLado = {
      ...niveis,
      opcoes: [
        { id: "a", efeitos: [], bussola: { social: 0.2 } },
        degrau("b"),
        degrau("c"),
      ],
    };
    expect(campos(comLado)).toEqual([]);
  });
  it("o jeito bate com a forma", () => {
    expect(campos({ ...valida, jeito: "niveis" })).toEqual(["jeito"]);
    expect(campos({ ...niveis, jeito: "regua" })).toEqual(["jeito"]);
    expect(campos({ ...valida, jeito: "torto" })).toEqual(["jeito"]);
  });
  it("lei com prazo diz os turnos", () => {
    expect(campos({ ...valida, tipo: "prazo", prazo_turnos: 3 })).toEqual([]);
    expect(campos({ ...valida, tipo: "prazo" })).toEqual(["prazo_turnos"]);
    expect(campos({ ...valida, prazo_turnos: 3 })).toEqual(["prazo_turnos"]);
    expect(campos({ ...valida, tipo: "ato" })).toEqual([]);
  });
});

describe("bússola.ate", () => {
  const com = (ate: unknown) => ({
    ...valida,
    bussola: { min: { economico: 0.5 }, max: { economico: -0.5 }, ate },
  });
  it("vale dentro da faixa; fora dela é erro", () => {
    expect(campos(com(0.3))).toEqual([]);
    expect(campos(com(0.5))).toEqual([]);
    expect(campos(com(0))).toEqual(["bussola.ate"]);
    expect(campos(com(0.9))).toEqual(["bussola.ate"]);
  });
});
