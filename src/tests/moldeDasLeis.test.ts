import { describe, expect, it } from "vitest";
import type { VariableDefinition } from "../engine";
import {
  avisosPorArea,
  verificarMolde,
  type FichaV4,
} from "../game/pais/fichaV3";
import variaveisDoMundo from "../conteudo/mundo/indicadores/variaveis.json";
import areasDoMundo from "../conteudo/mundo/areas.json";

const AREAS = [
  "contas-publicas",
  "economia-e-empresas",
  "trabalho",
  "protecao-social",
  "saude",
  "educacao-e-cultura",
  "infraestrutura-e-energia",
  "ambiente-e-campo",
  "seguranca-e-defesa",
  "direitos-e-costumes",
  "governo-e-instituicoes",
];

const contexto = {
  variaveis: new Map(
    (variaveisDoMundo as { variaveis: VariableDefinition[] }).variaveis.map(
      (v) => [v.id, v],
    ),
  ),
  leis: new Map([["regulacao-de-vagas", ["municipal", "central"]]]),
  areas: new Set(AREAS),
};

const imposto = (): FichaV4 => ({
  id: "imposto-teste",
  tipo: "lei",
  versaoEsquema: 4,
  familia: "imposto",
  nome: "Imposto sobre a renda das pessoas",
  decide: "Define quanto cada pessoa paga sobre o que ganha.",
  descricao: "",
  area: "contas-publicas",
  nivel: "lei",
  controle: { variavel: "aliquota_imposto_renda_pessoas", unidade: "%" },
  dinheiro: { tipo: "receita", base: "renda_familias" },
  efeitos: [
    {
      alvo: "arrecadacao",
      mecanismo: "afim",
      parametros: { coeficiente: 0.1, termoConstante: 0 },
      atraso: 0,
    },
  ],
});

const opcao = (id: string, propoe = "Uma frase.") => ({
  id,
  rotulo: id,
  valor: 0,
  propoe,
});

const regra = (): FichaV4 => ({
  ...imposto(),
  id: "regra-teste",
  familia: "regra",
  nome: "Fila do sistema de saúde",
  area: "saude",
  dinheiro: undefined,
  controle: {
    variavel: "nivel_regulacao_de_vagas",
    unidade: "nivel_escopo",
    opcoes: [opcao("a"), opcao("b"), opcao("c")],
  },
});

const constitucional = (): FichaV4 => ({
  ...regra(),
  id: "constitucional-teste",
  familia: "constitucional",
  nivel: "constituicao",
  controle: {
    variavel: "nivel_vinculacoes_orcamentarias",
    unidade: "nivel_escopo",
    opcoes: [opcao("sem"), opcao("com")],
  },
  trava: [{ opcao: "com", lei: "regulacao-de-vagas", minimo: 10 }],
});

const campos = (ficha: FichaV4) =>
  verificarMolde(ficha, "teste.json", contexto).map((e) => e.field);
const codigo = (ficha: FichaV4, campo: string) =>
  verificarMolde(ficha, "teste.json", contexto).find((e) => e.field === campo)
    ?.code;

describe("molde das leis (ficha v4)", () => {
  it("aceita um imposto, uma regra e uma constitucional bem feitos", () => {
    expect(campos(imposto())).toEqual([]);
    expect(campos(regra())).toEqual([]);
    expect(campos(constitucional())).toEqual([]);
  });

  it("recusa família fora das seis", () => {
    expect(campos({ ...imposto(), familia: "taxa" as never })).toContain(
      "familia",
    );
  });

  it("recusa 'o que decide' em forma de pergunta", () => {
    expect(campos({ ...imposto(), decide: "Quem paga?" })).toContain("decide");
  });

  it("recusa área que não é uma das 11", () => {
    expect(codigo({ ...imposto(), area: "economia" as never }, "area")).toBe(
      "REFERENCIA_QUEBRADA",
    );
  });

  it("recusa lei sem nenhum efeito", () => {
    expect(campos({ ...imposto(), efeitos: [] })).toContain("efeitos");
  });

  it("recusa regra com mais de 3 opções", () => {
    const r = regra();
    r.controle.opcoes = [opcao("a"), opcao("b"), opcao("c"), opcao("d")];
    expect(campos(r)).toContain("controle.opcoes");
  });

  it("recusa opção sem 'o que propõe'", () => {
    const r = regra();
    r.controle.opcoes = [opcao("a", ""), opcao("b"), opcao("c")];
    expect(campos(r)).toContain("controle.opcoes.0.propoe");
  });

  it("recusa constitucional sem trava", () => {
    expect(campos({ ...constitucional(), trava: [] })).toContain("trava");
  });

  it("recusa trava para lei que não existe", () => {
    const c = constitucional();
    c.trava = [{ opcao: "com", lei: "nao-existe", minimo: 10 }];
    expect(codigo(c, "trava.0.lei")).toBe("REFERENCIA_QUEBRADA");
  });

  it("recusa pétrea com área", () => {
    const p: FichaV4 = {
      ...constitucional(),
      familia: "petrea",
      petrea: true,
    };
    expect(campos(p)).toContain("area");
  });

  it("recusa nome de programa de um país", () => {
    expect(campos({ ...imposto(), nome: "Farmácia popular" })).toContain(
      "nome",
    );
  });

  it("imposto arrecada; verba e programa gastam", () => {
    expect(campos({ ...imposto(), dinheiro: undefined })).toContain("dinheiro");
    expect(campos({ ...imposto(), familia: "verba" })).toContain("dinheiro");
  });

  it("programa diz quem recebe e quantas pessoas", () => {
    const p: FichaV4 = {
      ...imposto(),
      familia: "programa",
      dinheiro: { tipo: "gasto", modo: "valor_fixo" },
    };
    expect(campos(p)).toContain("publico");
    expect(
      campos({ ...p, publico: { quem: "famílias pobres", pessoas: 1000 } }),
    ).toEqual([]);
  });

  it("família e nível concordam", () => {
    expect(campos({ ...constitucional(), nivel: "lei" })).toContain("nivel");
    expect(
      campos({ ...constitucional(), familia: "petrea", area: undefined }),
    ).toContain("petrea");
  });
});

describe("leis por área", () => {
  const leis = (area: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `${area}-${i}`, area }));

  it("avisa quando a área passa de 12 ou fica abaixo de 8", () => {
    expect(avisosPorArea(leis("saude", 13), ["saude"])).toEqual([
      "saude: 13 leis (o molde pede 8 a 12)",
    ]);
    expect(avisosPorArea(leis("saude", 7), ["saude"])).toEqual([
      "saude: 7 leis (o molde pede 8 a 12)",
    ]);
    expect(avisosPorArea(leis("saude", 10), ["saude"])).toEqual([]);
  });

  it("o mundo tem as 11 áreas da spec, na ordem", () => {
    expect(
      (areasDoMundo as { areas: { id: string }[] }).areas.map((a) => a.id),
    ).toEqual(AREAS);
  });
});
