// Passo 8: toda mudança de lei passa pelo Congresso. Rodar: npm run congresso
//
// Esperado (escrito antes, igual a src/motor/politica/politica.md), país de
// teste, 200 cadeiras, base = trabalhista + verde + centro (110):
// - transferência de renda 2% → 4%: base sim, oposição não; passa com 110;
// - imposto de renda 20% → 30%: verde e centro (classe média) votam contra;
//   só o governo vota sim; cai;
// - transferência de renda 2% → 6% (40% da faixa): exorbitante, todos não;
// - licenciamento ambiental frouxo: liberal vota com o governo, verde contra;
//   passa. No mandato os ambientalistas perdem satisfação; abaixo de 35 o
//   verde sai da base.
import {
  criarPartida,
  jogar,
  nomesGrupos,
  nomesPartidos,
  type Estado,
  type Pedido,
} from "../src/partida";

const TURNOS_MANDATO = 24;
const PAIS = "teste";
const partidos = nomesPartidos(PAIS);

const CENARIOS: [string, Pedido][] = [
  [
    "transferência de renda 2% → 4%",
    { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.04 },
  ],
  [
    "imposto de renda 20% → 30%",
    { tipo: "mudar_lei", lei: "imposto-renda", valor: 0.3 },
  ],
  [
    "transferência de renda 2% → 6%",
    { tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.06 },
  ],
  [
    "licenciamento ambiental frouxo",
    { tipo: "mudar_lei", lei: "licenciamento-ambiental", valor: "frouxo" },
  ],
];

const base = (e: Estado) => e.coligacao.map((id) => partidos[id]).join(", ");

const inicio = criarPartida(PAIS, 42);
console.log(`base no começo: ${base(inicio.estado)}`);

for (const [rotulo, pedido] of CENARIOS) {
  const um = jogar(criarPartida(PAIS, 42), 1, [pedido]).estado;
  const v = um.votacoes[0];
  const resultado = v.aprovada ? "PASSOU" : "CAIU";
  const motivo = v.exorbitante ? " (exorbitante)" : "";
  console.log(
    `\n${rotulo}: ${resultado}${motivo}, ${v.sim} sim × ${v.nao} não`,
  );
  for (const [id, voto] of Object.entries(v.votos))
    console.log(
      `  ${partidos[id].padEnd(28)} ${voto === "sim" ? "sim" : "não"}`,
    );
  console.log(`  lei depois do voto: ${String(um.leis[pedido.lei])}`);
}

// A base reage: licenciamento frouxo ao longo do mandato.
const frouxo = CENARIOS[3][1];
console.log("\nlicenciamento frouxo, mandato inteiro:");
let p = jogar(criarPartida(PAIS, 42), 1, [frouxo]);
for (let t = 1; t <= TURNOS_MANDATO; t++) {
  if (t > 1) p = jogar(p, 1);
  if (t % 4 === 0 || t === 1)
    console.log(
      `  turno ${String(t).padStart(2)}: ${nomesGrupos.ambientalistas} ${p.estado.grupos.ambientalistas.satisfacao.toFixed(1)}; base: ${base(p.estado)}`,
    );
}
