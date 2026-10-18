import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  CICLO_EMPRESAS_PILOTO,
  gerarRodada,
  simularCicloEmpresas,
} from "../../src/engine/generator";

const parametros = {
  turnos: 16,
  demandaInicial: 100,
  crescimentoDemandaAnual: 2,
  capacidadeInicial: 100,
  caixaInicial: 500,
  investimentoPublico: 10,
  investimentoPrivado: 10,
  prazoInvestimento: 4,
  participacaoPublica: 50,
  participacaoMinimaPermitida: 0,
  participacaoMaximaPermitida: 100,
  transacoes: [],
  nacionalizacaoPermitida: false,
  valorEmpresaInicial: 200,
  preco: 10,
  variacaoPrecoAnual: 0,
  custoUnitario: 7,
  variacaoCustoAnual: 0,
  aliquotaEscolhida: 25,
  sensibilidadeEvasao: 0.7,
  taxaDistribuicaoLucro: 0.5,
} as const;

const grafo = gerarRodada(CICLO_EMPRESAS_PILOTO);
const simulacao = simularCicloEmpresas(parametros);
const diagnostico = {
  definicao: grafo.idDefinicao,
  estado: grafo.estado,
  nos: grafo.nos.length,
  relacoes: grafo.relacoes.length,
  falhas: grafo.falhas,
  turnosComFalta: simulacao
    .filter((s) => s.demanda > s.capacidade)
    .map((s) => s.turno),
  estadoFinal: simulacao.at(-1),
  simulacao,
};
const destino = "docs/v1/desenho/rodada-gerador-empresas.json";
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, `${JSON.stringify(diagnostico, null, 2)}\n`);
console.log(
  `Rodada ${grafo.estado}: ${grafo.nos.length} nós, ${grafo.relacoes.length} relações, ${grafo.falhas.length} alertas.`,
);
console.log(`Simulação: ${simulacao.length} turnos; relatório em ${destino}.`);
