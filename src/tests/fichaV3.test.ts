import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  type Partida,
} from "../app/partida";
import type { VariableDefinition } from "../engine";
import {
  converterFicha,
  relatorioDeMigracao,
  verificarFicha,
  type FichaV3,
} from "../game/pais/fichaV3";
import { loadScenarioPackage } from "../game/pais/loadScenarioPackage";

const arquivos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
);
const PISO = "mundo/leis/piso-salarial-professores.json";
const piso = (): FichaV3 => JSON.parse(arquivos[PISO]) as FichaV3;
const variaveis = new Map(
  (
    JSON.parse(arquivos["mundo/indicadores/variaveis.json"]) as {
      variaveis: VariableDefinition[];
    }
  ).variaveis.map((v) => [v.id, v]),
);
const contexto = {
  variaveis,
  leis: new Map([["policia-militar", ["militar", "civil"]]]),
};
const mensagens = (ficha: FichaV3) =>
  verificarFicha(ficha, PISO, contexto).map((e) => `${e.field}: ${e.message}`);

describe("ficha de lei v3", () => {
  it("as três leis piloto se comportam como antes no turno", () => {
    // Valores gravados (a migração do formato v2 foi conferida com o Brasil
    // antigo; regravados com os valores de jan/2025 do V1-07 e com as leis de
    // inteligência do V1-09, que mudam o gasto e a verba da PF, e com a lei
    // da violência doméstica do V1-34, que mexe nos conservadores, e com as
    // leis novas das mesas do V1-34, que mexem na bússola), com as
    // três
    // leis mudadas pelo jogador e quatro turnos sem ocorrências.
    let p = (
      criarPartida({ semente: 7, ocorrencias: false }) as { value: Partida }
    ).value;
    for (const [lei, nivel] of [
      ["piso-salarial-professores", 67],
      ["policia-militar", 100],
      ["verba-policia-federal", 14400],
    ] as const) {
      const r = mudarLei(p, lei, nivel);
      if (!r.ok) throw new Error(r.erros.join(" "));
      p = r.value;
    }
    for (let turno = 0; turno < 4; turno++) {
      const r = encerrarTurno(p);
      if (!r.ok) throw new Error(r.erros.join(" "));
      p = r.value.partida;
    }
    const v = p.game.execution.values;
    expect(v.nivel_piso_salarial_professores).toBeCloseTo(58.8366, 9);
    expect(v.nivel_policia_militar).toBeCloseTo(75.99, 9);
    expect(v.recursos_verba_policia_federal).toBeCloseTo(13247.52, 9);
    expect(v.letalidade_policial).toBeCloseTo(30.994296816583393, 9);
    expect(v.crime_organizado).toBeCloseTo(71.79850049971111, 9);
    expect(v.gasto_publico).toBeCloseTo(31.444360523900382, 9);
    expect(v.popularidade_governo).toBeCloseTo(48.4068746970398, 9);
  });

  it("gera as consequências dentro do arquivo da ficha", () => {
    const loaded = loadScenarioPackage("paises/brasil/pais.json", arquivos);
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    // só as da ficha: os grupos de pressão (V1-09) somam setas à lei
    const relacoes = loaded.value.graph.relations.filter(
      (r) =>
        r.sourceId === "piso-salarial-professores" &&
        r.consequencePath.startsWith("mundo/leis/piso-salarial-professores"),
    );
    expect(relacoes).toHaveLength(8);
    expect(relacoes[0].consequencePath).toMatch(
      /^mundo\/leis\/piso-salarial-professores\.json#/,
    );
  });

  it("recusa ficha sem fonte com mensagem clara", () => {
    const ficha = { ...piso(), fontes: [] };
    expect(mensagens(ficha)).toContain(
      "fontes: A ficha precisa de pelo menos uma fonte com link para os números.",
    );
    const files = { ...arquivos, [PISO]: JSON.stringify(ficha) };
    expect(loadScenarioPackage("paises/brasil/pais.json", files)).toMatchObject(
      {
        ok: false,
        diagnostics: [{ file: PISO, field: "fontes" }],
      },
    );
  });

  it("recusa efeito em índice inexistente, travessão e nome de programa", () => {
    const ficha = piso();
    ficha.efeitos[0] = { ...ficha.efeitos[0], alvo: "indice_que_nao_existe" };
    ficha.descricao = "Piso nacional — como o Bolsa Família";
    const erros = mensagens(ficha);
    expect(erros).toContain(
      "efeitos.0.alvo: O índice indice_que_nao_existe não existe.",
    );
    expect(erros).toContain("descricao: O texto não pode ter travessão (—).");
    ficha.descricao = "Um piso como o Bolsa Família";
    expect(mensagens(ficha)).toContain(
      'descricao: O texto cita "Bolsa Família", nome de programa ou órgão de um país.',
    );
  });

  it("confere quantidade de efeitos, opções por nível e dependências", () => {
    const poucos = { ...piso(), efeitos: piso().efeitos.slice(0, 2) };
    expect(mensagens(poucos)).toContain(
      "efeitos: A lei tem de 3 a 8 efeitos; esta tem 2.",
    );
    const umaOpcao = piso();
    umaOpcao.controle = {
      ...umaOpcao.controle,
      opcoes: umaOpcao.controle.opcoes!.slice(0, 1),
    };
    expect(mensagens(umaOpcao)).toContain(
      "controle.opcoes: Uma lei tem de 2 a 5 opções com nome.",
    );
    const dependente = {
      ...piso(),
      dependeDe: [
        { lei: "policia-militar", opcoes: ["mista"] },
        { lei: "nao-existe", opcoes: [] },
      ],
    };
    expect(mensagens(dependente)).toEqual([
      "dependeDe.0.opcoes: A lei policia-militar não tem a opção mista.",
      "dependeDe.1.lei: A lei nao-existe não existe no catálogo.",
    ]);
  });

  it("deduz processo, nível legal e grupo do nível e do dinheiro", () => {
    const decreto = JSON.parse(
      arquivos["mundo/leis/verba-policia-federal.json"],
    ) as FichaV3;
    expect(converterFicha(decreto, variaveis).lei).toMatchObject({
      processoAutorizacao: "execucao-programa-autorizado",
      nivelLegal: "derivada",
      grupo: "orcamentaria",
      orcamento: { modo: "valor_fixo" },
    });
    const constituicao = JSON.parse(
      arquivos["mundo/leis/policia-militar.json"],
    ) as FichaV3;
    expect(converterFicha(constituicao, variaveis).lei).toMatchObject({
      processoAutorizacao: "emenda-constitucional",
      nivelLegal: "constitucional",
      grupo: "institucional",
    });
  });

  it("relatório mostra quantas leis faltam migrar", () => {
    const relatorio = relatorioDeMigracao(arquivos, "mundo/catalogo-leis.json");
    // 3 pilotos (V1-05), a lei nova do destino do resultado (V1-07) e as
    // cinco de inteligência e vigilância (V1-09), duas da mesa do salário
    // mínimo e as 28 leis novas das mesas (V1-34); a troca de Economia
    // tirou 6 fichas v3 antigas (suas curvas viraram consequências comuns)
    expect(relatorio.migradas).toHaveLength(9);
    expect(relatorio.faltam).toHaveLength(relatorio.total - 9);
  });
});
