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
    // fdc3658: leis consolidadas (244 → 242) e consequências removidas.
    // 21/out: IVA volta a ser faixa, sem o cashback em 26,5%.
    // 22/out: Contas públicas no molde; saem 3 leis (nível, eficácia e apoio
    // de cada uma: 9 valores). Nenhum outro valor do turno 0 muda.
    // 22/out (noite): saem mais 15 leis aprovadas pelo autor (45 valores).
    // Mecânica 4, fase 1: a dívida é diluída pelo crescimento e pela
    // inflação (nó novo crescimento_real). A dívida do turno 0 vai de 82,4
    // para 78,1 (a de 82 vinha do aquecimento sem diluição); mudam só os
    // valores ligados a ela (juros, resultado e 33 apoios, < 0,1 ponto).
    // Fase 1 refeita: crescimento = tendência (crescimento_potencial) +
    // ciclo, e o envelhecimento sobe sozinho; 60 valores andam < 0,1 ponto.
    // Fase 2a: juro médio da dívida (juros_implicito, juros_hiato) começa em
    // 8,6% e anda para a Selic; juros do turno 0 6,68 → 6,60.
    // Fase 2b: dívida e primário → risco-país; inflação e risco → Selic
    // (só com BC autônomo). Risco do turno 0 13,8 → 14,3; 17 valores < 0,2.
    const p = (criarPartida({ semente: 7 }) as { value: Partida }).value;
    const valores = p.game.execution.values;
    expect(Object.keys(valores)).toHaveLength(1679);
    expect(p.game.execution.step).toBe(12);
    expect(valores.popularidade_governo).toBeCloseTo(48.27899554397753, 3);
    expect(valores.divida_publica).toBeCloseTo(77.97550376749942, 2);
    expect(valores.inflacao).toBeCloseTo(4.835722703138084, 2);
    expect(valores.desemprego).toBeCloseTo(6.199971590503557, 2);
    expect(valores.pib_nominal).toBe(12000000);
    const soma = Object.values(valores).reduce((a, b) => a + b, 0);
    expect(soma).toBeCloseTo(12691342.09979472, 3);
    expect(p.content.policies).toHaveLength(224);
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
