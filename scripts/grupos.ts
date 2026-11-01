// Passo 7b: grupos leem pops, índices e leis. Rodar: npm run grupos
//
// Esperado (escrito antes, igual a src/motor/grupos/grupos.md), país de teste:
// - turno 1 sem mudar nada: todos perto de 50 (só o sorteio do crescimento
//   mexe com os empresários);
// - transferência de renda 2% → 4% do PIB: trabalhadores sobem uns 15 pontos
//   (renda + lei); classe média e empresários quase não mudam no turno 1; no
//   fim do mandato a dívida maior pesa um pouco nos empresários;
// - imposto sobre empresas 25% → 35%: empresários caem uns 8 pontos;
// - áreas protegidas 10% → 20%: ambientalistas sobem (lei + meio ambiente
//   depois do atraso); empresários não mudam;
// - um mandato sem mudar nada: satisfação sobe um pouco com o crescimento
//   real da renda, sem passar de 65; radicais e lealistas ficam em 5.
import {
  criarPartida,
  jogar,
  nomesGrupos,
  type Estado,
  type Pedido,
} from "../src/partida";

const TURNOS_MANDATO = 24;
const PAIS = "teste";

const lei = (id: string, valor: number): Pedido[] => [
  { tipo: "mudar_lei", lei: id, valor },
];

const CENARIOS: [string, Pedido[]][] = [
  ["sem mudar nada", []],
  ["transferência 4% do PIB", lei("transferencia-renda", 0.04)],
  ["imposto sobre empresas 35%", lei("imposto-empresas", 0.35)],
  ["áreas protegidas 20%", lei("areas-protegidas", 0.2)],
];

const n = (v: number) => v.toFixed(1).padStart(5);

function linha(e: Estado, id: string): string {
  const g = e.grupos[id];
  return `${n(g.satisfacao)} (r ${n(g.radicais)} l ${n(g.lealistas)})`;
}

for (const [rotulo, pedidos] of CENARIOS) {
  const um = jogar(criarPartida(PAIS, 42), 1, pedidos).estado;
  const fim = jogar(criarPartida(PAIS, 42), TURNOS_MANDATO, pedidos).estado;
  console.log(`\n${rotulo}`);
  console.log(
    `  ${"grupo".padEnd(16)} ${"turno 1".padEnd(24)} fim do mandato   (r = radicais %, l = lealistas %)`,
  );
  for (const id of Object.keys(um.grupos))
    console.log(
      `  ${nomesGrupos[id].padEnd(16)} ${linha(um, id)}   ${linha(fim, id)}`,
    );
}
