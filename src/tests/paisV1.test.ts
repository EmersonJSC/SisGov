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
  it("o Brasil no formato novo começa igual ao formato antigo", () => {
    // Valores gravados com o Brasil ainda em estado-inicial.json,
    // organizacao-politica.json e ministerios.json (commit 4bbf2a7).
    const p = (criarPartida({ semente: 7 }) as { value: Partida }).value;
    const valores = p.game.execution.values;
    expect(Object.keys(valores)).toHaveLength(990);
    expect(valores.popularidade_governo).toBeCloseTo(51.41, 6);
    expect(valores.divida_publica).toBe(77);
    expect(valores.inflacao).toBeCloseTo(5, 6);
    expect(valores.desemprego).toBeCloseTo(6, 6);
    expect(valores.pib_nominal).toBe(12000000);
    const soma = Object.values(valores).reduce((a, b) => a + b, 0);
    // V1-07: o contexto das situações mira metade da saída, não da entrada;
    // por isso a soma caiu 45,5 em relação ao Brasil antigo.
    expect(soma).toBeCloseTo(12681009.333573977, 3);
    expect(p.content.policies).toHaveLength(123);
    expect(p.content.events).toHaveLength(79);
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
    expect(ids(minimo)).toHaveLength(78);

    const mensal = prepareMonthlyContent(minimo.value.definition);
    if (!mensal.ok) throw new Error("conteúdo mensal falhou");
    const jogo = createGame("teste", mensal.value.content, mensal.value.graph, {
      randomSeed: 1,
      occurrences: true,
    });
    expect(jogo.ok).toBe(true);
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
