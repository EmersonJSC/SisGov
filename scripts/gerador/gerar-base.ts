import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { advanceExecution } from "../../src/engine/runtime/advanceExecution";
import { createExecution } from "../../src/engine/runtime/createExecution";
import { buildGraph } from "../../src/engine/graph/buildGraph";
import { resolvePackage } from "../../src/engine/model/resolvePackage";
import { validatePackageCoherence } from "../../src/engine/model/validatePackageCoherence";
import {
  BASE_MINIMA,
  CAMINHO_CENARIO_BASE,
  montarBaseMinima,
} from "./baseMinima";

const raiz = join(process.cwd(), "src/conteudo");
const arquivos = montarBaseMinima();
const textos = Object.fromEntries(
  Object.entries(arquivos).map(([caminho, objeto]) => [
    caminho,
    `${JSON.stringify(objeto, null, 2)}\n`,
  ]),
);
const resolvido = resolvePackage(CAMINHO_CENARIO_BASE, textos);
if (!resolvido.ok)
  throw new Error(
    `Base inválida:\n${JSON.stringify(resolvido.diagnostics, null, 2)}`,
  );
const coerente = validatePackageCoherence(resolvido.value);
if (!coerente.ok)
  throw new Error(
    `Base incoerente:\n${JSON.stringify(coerente.diagnostics, null, 2)}`,
  );

const grafo = buildGraph(coerente.value);
function simular(expansao: number, manutencao: number, meses = 36) {
  let execucao = createExecution(coerente.value, grafo);
  const historico: Record<string, number>[] = [];
  const lote = {
    controlCommands: [
      {
        controlId: "plano_expansao_rede",
        policyId: "expansao-da-rede-eletrica",
        value: expansao,
      },
      {
        controlId: "padrao_manutencao_rede",
        policyId: "manutencao-da-rede-eletrica",
        value: manutencao,
      },
    ],
    activeRelationIds: grafo.relations.map((relacao) => relacao.id),
  };
  for (let mes = 0; mes < meses; mes++) {
    const proximo = advanceExecution(coerente.value, grafo, execucao, lote, 1, {
      explain: false,
    });
    if (!proximo.ok)
      throw new Error(
        `Simulação falhou no mês ${mes + 1}: ${JSON.stringify(proximo.diagnostics)}`,
      );
    execucao = proximo.value.execution;
    historico.push({ ...execucao.values });
  }
  return historico;
}
const semAcao = simular(0, 0);
const soExpansao = simular(1, 0);
const soManutencao = simular(0, 1);
const comAcao = simular(1, 1);
const extremoLongo = simular(2, 2, 120);
const antesDoPrazo =
  BASE_MINIMA.energiaHipotese.atrasoExpansaoTrimestres * 3 - 1;
if (
  comAcao[0].caixa_publico >= semAcao[0].caixa_publico ||
  comAcao[antesDoPrazo].capacidade_rede !==
    semAcao[antesDoPrazo].capacidade_rede ||
  comAcao.at(-1)!.capacidade_rede <= semAcao.at(-1)!.capacidade_rede ||
  comAcao.at(-1)!.pressao_rede >= semAcao.at(-1)!.pressao_rede
)
  throw new Error("A rodada não demonstrou gasto, atraso e alívio do gargalo.");
const inicial = coerente.value.initialState.valores;
if (
  inicial.pib_nominal !== BASE_MINIMA.indicesHipotese.pibMilhoes ||
  inicial.populacao_total !== BASE_MINIMA.indicesHipotese.populacao ||
  inicial.inflacao_anual !== BASE_MINIMA.indicesHipotese.inflacaoPct ||
  inicial.desemprego !== BASE_MINIMA.indicesHipotese.desempregoPct ||
  inicial.divida_publica !== BASE_MINIMA.indicesHipotese.dividaPctPib ||
  semAcao.at(-1)!.divida_publica !== inicial.divida_publica
)
  throw new Error(
    "Os índices fictícios não coincidem com os parâmetros da ilha.",
  );
if (
  soExpansao.at(-1)!.capacidade_rede <= semAcao.at(-1)!.capacidade_rede ||
  soManutencao.at(-1)!.perdas_rede >= semAcao.at(-1)!.perdas_rede ||
  comAcao.at(-1)!.caixa_publico >= soExpansao.at(-1)!.caixa_publico ||
  comAcao.at(-1)!.caixa_publico >= soManutencao.at(-1)!.caixa_publico
)
  throw new Error(
    "A rodada falhou na direção dos efeitos de expansão e manutenção.",
  );
for (const rodada of [
  semAcao,
  soExpansao,
  soManutencao,
  comAcao,
  extremoLongo,
]) {
  let caixaAnterior = BASE_MINIMA.energiaHipotese.caixaPublicoMilhoes;
  for (const mes of rodada) {
    const custo =
      mes.expansao_executada *
        BASE_MINIMA.energiaHipotese.custoExpansaoMilhoesPorNivelMes +
      mes.manutencao_executada *
        BASE_MINIMA.energiaHipotese.custoManutencaoMilhoesPorNivelMes;
    if (
      mes.caixa_publico < -0.000001 ||
      mes.perdas_rede < BASE_MINIMA.energiaHipotese.perdasTecnicas - 0.000001 ||
      Math.abs(caixaAnterior - mes.caixa_publico - custo) > 0.000001
    )
      throw new Error(
        "Execução, gasto ou perdas ficaram incoerentes no ciclo.",
      );
    caixaAnterior = mes.caixa_publico;
  }
}

for (const [caminho, conteudo] of Object.entries(textos)) {
  const destino = join(raiz, caminho);
  mkdirSync(dirname(destino), { recursive: true });
  const temporario = `${destino}.gerando`;
  writeFileSync(temporario, conteudo, "utf8");
  renameSync(temporario, destino);
}

const relatorio = {
  estado: "experimental_com_lacunas",
  pais: BASE_MINIMA.pais,
  arquivosGerados: Object.keys(textos).sort(),
  leis: coerente.value.policies.map((lei) => lei.id),
  indicesHipoteticos: BASE_MINIMA.indicesHipotese,
  coberturaMapa: {
    cicloJogavel: [
      "Energia: expansão, manutenção, caixa, capacidade, perdas e risco",
    ],
    referenciasIniciais: [
      "PIB",
      "população",
      "inflação",
      "desemprego",
      "dívida",
    ],
    areasNaoImplementadas: [
      "Poder e instituições",
      "Segurança e justiça",
      "Defesa e mundo",
      "Direitos e liberdades",
      "Contas e tributos",
      "Trabalho e mercado",
      "Proteção social",
      "Educação, ciência e cultura",
      "Cidades e transporte",
    ],
  },
  hipotesesNaoCalibradas: BASE_MINIMA.energiaHipotese,
  simulacao: {
    semAcaoMes36: semAcao.at(-1),
    soExpansaoMes36: soExpansao.at(-1),
    soManutencaoMes36: soManutencao.at(-1),
    comAcaoMes36: comAcao.at(-1),
    extremoMes120: extremoLongo.at(-1),
    capacidadeAntesDoPrazo: {
      semAcao: semAcao[antesDoPrazo].capacidade_rede,
      comAcao: comAcao[antesDoPrazo].capacidade_rede,
    },
  },
  lacunasDetectadas: [
    "A execução diminui proporcionalmente ao caixa experimental disponível; esta regra de financiamento é hipótese, não orçamento público calibrado.",
    "As perdas técnicas e comerciais foram separadas, mas a participação inicial de cada uma ainda é hipótese a calibrar.",
    "PIB, população, inflação, desemprego, dívida, demanda, capacidade, custos e prazos são hipóteses de uma ilha inexistente; nenhuma fonte citada calibra esses valores.",
    "PIB é produção anual, não entrada de caixa. O piloto não gera arrecadação recorrente: começa com 1.000 milhões de créditos hipotéticos e desconta apenas gastos executados. O painel fiscal não recebe esses gastos; PIB e dívida ficam estáticos.",
  ],
  nota: "A ilha e todos os seus números são fictícios. As fontes das leis sustentam apenas o assunto e o mecanismo geral, não os coeficientes do piloto.",
};
const relatorioPath = join(
  process.cwd(),
  "docs/v1/desenho/relatorio-gerador-base.json",
);
writeFileSync(relatorioPath, `${JSON.stringify(relatorio, null, 2)}\n`, "utf8");
console.log(
  `Base gerada: ${textos[CAMINHO_CENARIO_BASE] ? BASE_MINIMA.pais.nome : "sem país"}, ${coerente.value.policies.length} leis, ${coerente.value.variables.variaveis.length} variáveis, ${coerente.value.consequences.length} consequências e ${Object.keys(textos).length} arquivos JSON do jogo.`,
);
