/** Teste de jogabilidade pelo mesmo fluxo da partida; não grava arquivos. */
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../../src/app/partida";

const turnos = Number(process.argv[2] ?? 50);
if (!Number.isInteger(turnos) || turnos < 1)
  throw new Error("Informe uma quantidade inteira e positiva de turnos.");
const marcos = new Set([0, 1, 2, 3, 4, 8, 16, 32, 50]);
const campos = [
  "pib_nominal",
  "populacao_total",
  "inflacao_anual",
  "desemprego",
  "divida_publica",
] as const;

function iniciar(): Partida {
  const resultado = criarPartida({
    pais: "ilha-teste",
    modo: "real",
    semente: 1,
    ocorrencias: false,
    eleicao: false,
  });
  if (!resultado.ok) throw new Error(resultado.erros.join("; "));
  return resultado.value;
}

function escolher(partida: Partida, lei: string, nivel: number): Partida {
  const resultado = mudarLei(partida, lei, nivel);
  if (!resultado.ok) throw new Error(resultado.erros.join("; "));
  return resultado.value;
}

function linha(nome: string, turno: number, partida: Partida) {
  const v = partida.game.execution.values;
  const riscoNoMapa = verPartida(partida).bolhas.find(
    (bolha) => bolha.id === "risco_apagao",
  );
  return {
    caso: nome,
    turno,
    capacidade: Number(v.capacidade_rede.toFixed(2)),
    perdas: Number(v.perdas_rede.toFixed(2)),
    pressao: Number(v.pressao_rede.toFixed(2)),
    riscoNoMapa: Number((riscoNoMapa?.valor ?? 0).toFixed(2)),
    riscoAtivo: (v.risco_apagao ?? 0) > 0,
    caixa: Number(v.caixa_publico.toFixed(2)),
    expansaoExecutada: Number(v.expansao_executada.toFixed(3)),
    manutencaoExecutada: Number(v.manutencao_executada.toFixed(3)),
  };
}

let parado = iniciar();
let ativo = iniciar();
ativo = escolher(ativo, "expansao-da-rede-eletrica", 2);
ativo = escolher(ativo, "manutencao-da-rede-eletrica", 2);
const inicial = { ...parado.game.execution.values };
const saida = [linha("sem ação", 0, parado), linha("ambas em 2", 0, ativo)];

for (let turno = 1; turno <= turnos; turno++) {
  for (const nome of ["sem ação", "ambas em 2"] as const) {
    const atual = nome === "sem ação" ? parado : ativo;
    const resultado = encerrarTurno(atual);
    if (!resultado.ok)
      throw new Error(`${nome}, turno ${turno}: ${resultado.erros.join("; ")}`);
    const proximo = resultado.value.partida;
    const v = proximo.game.execution.values;
    if (v.caixa_publico < -1e-6 || v.perdas_rede < 5 - 1e-6)
      throw new Error(
        `${nome}, turno ${turno}: caixa negativo ou perdas abaixo das técnicas`,
      );
    for (const campo of campos)
      if (v[campo] !== inicial[campo])
        throw new Error(
          `${nome}, turno ${turno}: ${campo} mudou sem mecanismo`,
        );
    if (nome === "sem ação") parado = proximo;
    else ativo = proximo;
    if (marcos.has(turno)) saida.push(linha(nome, turno, proximo));
  }
}

const sem = parado.game.execution.values;
const com = ativo.game.execution.values;
if (
  com.capacidade_rede <= sem.capacidade_rede ||
  com.perdas_rede >= sem.perdas_rede ||
  com.risco_apagao >= sem.risco_apagao ||
  com.caixa_publico >= sem.caixa_publico
)
  throw new Error(
    "As decisões não produziram as direções esperadas após 50 turnos.",
  );

console.table(saida);
console.log(
  `${turnos} turnos concluídos nos dois casos; nenhum JSON foi criado.`,
);
