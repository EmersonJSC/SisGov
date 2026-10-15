import { describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import { createGame } from "../game/createGame";
import { expandirPais } from "../game/pais/configuracao";
import {
  loadDistributedScenario,
  loadScenarioPackage,
} from "../game/pais/loadScenarioPackage";
import { prepareMonthlyContent } from "../game/prepareMonthlyContent";

const arquivos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../conteudo/**/*.json", {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
);
const MINIMO = "testes/pais-minimo/pais.json";
const editar = (
  path: string,
  mudar: (json: Record<string, unknown>) => void,
) => {
  const json = JSON.parse(arquivos[path]) as Record<string, unknown>;
  mudar(json);
  return { ...arquivos, [path]: JSON.stringify(json) };
};
const mensagens = (r: {
  ok: boolean;
  diagnostics?: readonly { message: string }[];
}) => (r.ok ? [] : (r.diagnostics ?? [])).map((d) => d.message);

describe("configuração do país (V1-06)", () => {
  it("o Brasil começa no turno 0 com os valores gravados", () => {
    // V1-07: valores de jan/2025 na unidade real (desenho/valores-2025.md)
    // e um ano de aquecimento; os números abaixo são o turno 0 depois dele.
    // V1-08: 20 segmentos e aprovação pelos perfis (Quaest jan/2025: 47%).
    // V1-09: 54 grupos de pressão (pressão, nível, patrocínio e ações) e
    // cinco leis de inteligência, duas com verba (a dívida sobe um pouco).
    // V1-34: as duas camadas novas da mesa do salário mínimo e as 28 leis
    // novas das mesas (controle, eficácia e o estado de cada uma).
    const p = (criarPartida({ semente: 7 }) as { value: Partida }).value;
    const valores = p.game.execution.values;
    expect(Object.keys(valores)).toHaveLength(1742);
    expect(p.game.execution.step).toBe(12);
    expect(valores.popularidade_governo).toBeCloseTo(48.282, 3);
    expect(valores.divida_publica).toBeCloseTo(82.1662, 2);
    expect(valores.inflacao).toBeCloseTo(4.833, 2);
    expect(valores.desemprego).toBeCloseTo(6.2001836019814665, 2);
    expect(valores.pib_nominal).toBe(12000000);
    const soma = Object.values(valores).reduce((a, b) => a + b, 0);
    expect(soma).toBeCloseTo(12692693.004554976, 3);
    expect(p.content.policies).toHaveLength(247);
    expect(p.content.events).toHaveLength(188);
    expect(p.content.dilemmas).toHaveLength(91);
  });

  it("evento que exige litoral entra no Brasil e fica fora do país sem litoral", () => {
    const brasil = loadDistributedScenario("paises/brasil/pais.json");
    const minimo = loadDistributedScenario(MINIMO);
    if (!brasil.ok || !minimo.ok) throw new Error("país não carregou");
    const ids = (r: typeof brasil) =>
      r.ok ? r.value.definition.events.map((e) => e.id) : [];
    expect(ids(brasil)).toContain("vazamento-de-oleo");
    expect(ids(minimo)).not.toContain("vazamento-de-oleo");
    expect(ids(minimo)).toHaveLength(165);

    const mensal = prepareMonthlyContent(minimo.value.definition);
    if (!mensal.ok) throw new Error("conteúdo mensal falhou");
    const jogo = createGame("teste", mensal.value.content, mensal.value.graph, {
      randomSeed: 1,
      occurrences: true,
    });
    expect(jogo.ok).toBe(true);
  });

  it("ligação da rede com requer só entra no país que tem a característica", () => {
    const entradas = (path: string) => {
      const r = loadDistributedScenario(path);
      if (!r.ok) throw new Error("país não carregou");
      return r.value.graph.relations
        .filter((rel) => ["estiagem", "crise_cambial"].includes(rel.targetId))
        .map((rel) => rel.consequenceId)
        .sort();
    };
    // Brasil: seca e moeda própria; país mínimo: só moeda própria.
    expect(entradas("paises/brasil/pais.json")).toEqual([
      "desmatamento--estiagem",
      "fuga-capitais--crise-cambial",
      "qualidade-ambiental--estiagem",
      "reservas-internacionais--crise-cambial",
      "risco-pais--crise-cambial",
    ]);
    expect(entradas(MINIMO)).toEqual([
      "fuga-capitais--crise-cambial",
      "reservas-internacionais--crise-cambial",
      "risco-pais--crise-cambial",
    ]);
  });

  it("o motor não recebe o requer da ocorrência", () => {
    const r = expandirPais("paises/brasil/pais.json", arquivos);
    if (!r.ok) throw new Error("país não expandiu");
    const evento = JSON.parse(
      r.value.files["mundo/eventos/vazamento-de-oleo.json"],
    ) as Record<string, unknown>;
    expect(evento.requer).toBeUndefined();
  });

  it("recusa característica desconhecida e arquivo ausente", () => {
    const desconhecida = editar(MINIMO, (p) => {
      p.caracteristicas = ["litoral", "vulcoes"];
    });
    expect(mensagens(loadScenarioPackage(MINIMO, desconhecida))).toContain(
      "Característica desconhecida: vulcoes.",
    );
    const semHistoria: Record<string, string> = { ...arquivos };
    delete semHistoria["testes/pais-minimo/historia.json"];
    expect(mensagens(loadScenarioPackage(MINIMO, semHistoria))).toContain(
      "O país precisa deste arquivo.",
    );
  });

  it("recusa lei em vigor que o país não comporta", () => {
    const comRequer = editar("mundo/leis/policia-militar.json", (lei) => {
      lei.requer = { exige: ["litoral"] };
    });
    expect(mensagens(loadScenarioPackage(MINIMO, comRequer))).toContain(
      "A lei policia-militar está em vigor, mas não existe no catálogo ou exige uma característica que o país não tem.",
    );
  });
});
