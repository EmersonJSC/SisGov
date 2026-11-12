// Mede quanto custa um turno. Roda com `npm run medir`; use antes e depois de
// mexer em módulo pesado. Orçamento de partida: turno abaixo de 50 ms e placar
// previsto abaixo de 5 ms (a tela recalcula o placar a cada movimento).
import { avancar, criarPartida, jogar, placarDaLei } from "../src/partida";

const PAIS = "brasil-2026";
const ORCAMENTO_DO_TURNO_MS = 50;

function medir(nome: string, repeticoes: number, f: () => void): number {
  const inicio = performance.now();
  for (let i = 0; i < repeticoes; i++) f();
  const ms = (performance.now() - inicio) / repeticoes;
  console.log(`${nome.padEnd(34)} ${ms.toFixed(2)} ms`);
  return ms;
}

const partida = criarPartida(PAIS, 1);
const pedido = {
  tipo: "mudar_lei" as const,
  lei: "areas-protegidas",
  valor: 0.2,
};

medir("criar a partida", 3, () => criarPartida(PAIS, 1));
medir("1 turno sem pedidos", 20, () => avancar(partida));
const turno = medir("1 turno com 1 lei no Congresso", 20, () =>
  avancar(partida, [pedido]),
);
medir("24 turnos (um mandato)", 3, () => jogar(partida, 24));
medir("placar previsto (1 movimento)", 200, () =>
  placarDaLei(partida, pedido.lei, pedido.valor),
);

if (turno > ORCAMENTO_DO_TURNO_MS)
  console.log(`\nAtenção: o turno passou de ${ORCAMENTO_DO_TURNO_MS} ms.`);
