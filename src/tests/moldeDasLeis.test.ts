import { describe, expect, it } from "vitest";
import type { VariableDefinition } from "../engine";
import {
  avisosPorArea,
  expandirFichasV3,
  verificarMolde,
  type FichaV4,
} from "../game/pais/fichaV3";
import variaveisDoMundo from "../conteudo/mundo/indicadores/variaveis.json";
import areasDoMundo from "../conteudo/mundo/areas.json";
import politica from "../conteudo/paises/brasil/politica.json";
import { criarPartida, verPartida } from "../app/partida";
import { familiaDaLei, PRATELEIRAS } from "../ui/mapa/familia";

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

  it("aceita muitos efeitos (a spec só pede pelo menos um)", () => {
    const muitos = Array.from({ length: 14 }, (_, i) => ({
      ...imposto().efeitos[0],
      id: `efeito-${i}`,
    }));
    expect(campos({ ...imposto(), efeitos: muitos })).toEqual([]);
  });

  it("recusa lei sem nenhum efeito", () => {
    expect(campos({ ...imposto(), efeitos: [] })).toContain("efeitos");
  });

  it("aceita até 5 opções e recusa 6 (autor, 22/out)", () => {
    const r = regra();
    r.controle.opcoes = ["a", "b", "c", "d", "e"].map((id) => opcao(id));
    expect(campos(r)).toEqual([]);
    r.controle.opcoes = ["a", "b", "c", "d", "e", "f"].map((id) => opcao(id));
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

  it("recusa trava de uma opção que a lei não tem", () => {
    const c = constitucional();
    c.trava = [{ opcao: "nao-existe", lei: "regulacao-de-vagas", minimo: 10 }];
    expect(codigo(c, "trava.0.opcao")).toBe("REFERENCIA_QUEBRADA");
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

  it("avisa só quando a área fica abaixo de 8 (sem teto, autor 22/out)", () => {
    expect(avisosPorArea(leis("saude", 16), ["saude"])).toEqual([]);
    expect(avisosPorArea(leis("saude", 7), ["saude"])).toEqual([
      "saude: 7 leis (o molde pede pelo menos 8)",
    ]);
    expect(avisosPorArea(leis("saude", 10), ["saude"])).toEqual([]);
  });

  it("o mundo tem as 11 áreas da spec, na ordem", () => {
    expect(
      (areasDoMundo as { areas: { id: string }[] }).areas.map((a) => a.id),
    ).toEqual(AREAS);
  });
});

const arquivos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
);
const VERBA_PF = "mundo/leis/verba-policia-federal.json";

function comoV4(mudar: Partial<FichaV4> = {}): string {
  const v3 = JSON.parse(arquivos[VERBA_PF]) as Record<string, unknown>;
  const resto = { ...v3 };
  delete resto.area;
  delete resto.ministerio;
  delete resto.descricao;
  return JSON.stringify({
    ...resto,
    versaoEsquema: 4,
    familia: "verba",
    decide: "Define quanto o país gasta com a polícia federal por ano.",
    area: "seguranca-e-defesa",
    ...mudar,
  });
}

describe("o jogo carrega a ficha v4", () => {
  it("vira lei do motor com família, área do mundo e a frase", () => {
    const r = expandirFichasV3({ ...arquivos, [VERBA_PF]: comoV4() });
    if (!r.ok) throw new Error(JSON.stringify(r.diagnostics.slice(0, 3)));
    expect(JSON.parse(r.value[VERBA_PF])).toMatchObject({
      versaoEsquema: 2,
      familia: "verba",
      areaMundo: "seguranca-e-defesa",
      decide: "Define quanto o país gasta com a polícia federal por ano.",
      descricao: "Define quanto o país gasta com a polícia federal por ano.",
      grupo: "orcamentaria",
    });
  });

  it("leva implantação em turnos e a lei mãe para o motor", () => {
    const r = expandirFichasV3({
      ...arquivos,
      [VERBA_PF]: comoV4({
        implantacaoTurnos: { minimo: 4, maximo: 4 },
        mae: { texto: "Depende da regra das contas.", leis: ["regra-fiscal"] },
      } as never),
    });
    if (!r.ok) throw new Error(JSON.stringify(r.diagnostics.slice(0, 3)));
    expect(JSON.parse(r.value[VERBA_PF])).toMatchObject({
      implantacaoTurnos: { minimo: 4, maximo: 4 },
      mae: { texto: "Depende da regra das contas.", leis: ["regra-fiscal"] },
    });
  });

  it("ficha v4 fora do molde barra o pacote", () => {
    const r = expandirFichasV3({
      ...arquivos,
      [VERBA_PF]: comoV4({ decide: "Quanto gastar?" }),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics.map((d) => d.field)).toContain("decide");
  });
});

describe("áreas por assunto no país", () => {
  const estrutura = (
    politica as unknown as {
      ministerios: {
        areas: { id: string; coordenador: string }[];
        ministerios: { id: string; area: string; leis: string[] }[];
      };
    }
  ).ministerios;
  const ministerio = (id: string) =>
    estrutura.ministerios.find((m) => m.id === id)!;

  it("o Brasil usa as 11 áreas do mundo, na ordem", () => {
    expect(estrutura.areas.map((a) => a.id)).toEqual(AREAS);
    for (const m of estrutura.ministerios) expect(AREAS).toContain(m.area);
  });

  it("os ministérios vão para a área do assunto", () => {
    expect(ministerio("esporte").area).toBe("educacao-e-cultura");
    expect(ministerio("comunicacoes").area).toBe("governo-e-instituicoes");
    expect(ministerio("povos-indigenas").area).toBe("direitos-e-costumes");
    expect(ministerio("fazenda").area).toBe("contas-publicas");
    expect(ministerio("planejamento").area).toBe("contas-publicas");
  });

  it("Banco Central e câmbio vão para Economia; moradia para Proteção social", () => {
    for (const lei of [
      "quem-controla-o-banco-central",
      "mandato-do-banco-central",
      "regime-cambial",
      "regulacao-dos-bancos",
      "controle-de-capitais",
    ]) {
      expect(ministerio("mdic").leis).toContain(lei);
      expect(ministerio("fazenda").leis).not.toContain(lei);
    }
    for (const lei of ["habitacao-publica", "verba-do-programa-habitacional"])
      expect(ministerio("desenvolvimento-social").leis).toContain(lei);
  });

  it("a tela recebe a área nova e o título do mundo", () => {
    const criada = criarPartida({ semente: 1, ocorrencias: false });
    if (!criada.ok) throw new Error(criada.erros.join(" "));
    const visao = verPartida(criada.value);
    const lei = (id: string) => visao.leis.find((l) => l.id === id)!;
    expect(lei("imposto-renda-pessoas").areas).toEqual(["contas-publicas"]);
    expect(lei("regime-cambial").areas).toEqual(["economia-e-empresas"]);
    expect(visao.governo.map((a) => a.titulo)).toEqual(
      (areasDoMundo as { areas: { titulo: string }[] }).areas.map(
        (a) => a.titulo,
      ),
    );
  });

  it("a família vem da lei; sem família, continua a dedução de hoje", () => {
    const base = { nivelLegal: "derivada", processo: "lei-ordinaria" };
    expect(
      familiaDaLei({
        ...base,
        grupo: "orcamentaria",
        familia: "programa",
      } as never),
    ).toBe("programa");
    expect(familiaDaLei({ ...base, grupo: "tributaria" } as never)).toBe(
      "imposto",
    );
    expect(PRATELEIRAS.map((p) => p.familia)).toEqual([
      "imposto",
      "verba",
      "programa",
      "regra",
      "constituicao",
    ]);
  });
});

describe("Contas públicas no molde (tarefa 5a)", () => {
  const criada = criarPartida({ semente: 1, ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  const leis = verPartida(criada.value).leis;
  const ids = [
    "regra-fiscal",
    "vinculacoes-orcamentarias",
    "modelo-tributario",
    "imposto-renda-pessoas",
    "imposto-renda-empresas",
    "imposto-sobre-consumo",
    "imposto-seletivo",
    "imposto-propriedade-urbana-rural",
    "imposto-heranca",
    "tributacao-dividendos",
    "imposto-grandes-fortunas",
    "imposto-transacoes-financeiras",
    "meta-de-resultado-primario",
    "revisao-de-gastos-tributarios",
    "fundo-soberano",
  ];

  it("as 15 leis entram com família, frase e área", () => {
    for (const id of ids) {
      const lei = leis.find((l) => l.id === id)!;
      expect(lei.familia, id).toBeDefined();
      expect(lei.decide, id).toMatch(/^Define /);
      expect(lei.areas, id).toEqual(["contas-publicas"]);
    }
  });

  it("os impostos aparecem na cor do imposto e as constitucionais em lilás", () => {
    const fam = (id: string) => familiaDaLei(leis.find((l) => l.id === id)!);
    expect(fam("imposto-seletivo")).toBe("imposto");
    expect(fam("regra-fiscal")).toBe("constituicao");
    expect(fam("fundo-soberano")).toBe("regra");
  });
});
