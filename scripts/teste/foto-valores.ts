/**
 * Foto de todos os valores do jogo depois de 8 turnos, em precisão total,
 * sem nada mudar e com o pacote de corte. Serve para provar que uma
 * mudança de formato não mexeu em nenhum número.
 * Uso: npx vite-node scripts/teste/foto-valores.ts > antes.json
 */
import { criarPartida, encerrarTurno, verPartida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const CORTE: [string, number][] = [
  ["idade-minima-aposentadoria", 75],
  ["regra-fiscal", 67],
  ["meta-de-resultado-primario", 100],
  ["imposto-renda-pessoas", 35],
  ["imposto-heranca", 15],
];
const foto: Record<string, Record<string, number>> = {};
for (const [nome, metas] of [
  ["base", []],
  ["corte", CORTE],
] as const) {
  const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!c.ok) throw new Error(c.erros.join(" "));
  let p = c.value;
  for (const [id, v] of metas) {
    const r = aplicarMeta(p, id, v);
    if (!r.ok) throw new Error(`${id}: ${r.erros.join(" ")}`);
    p = r.value;
  }
  for (let t = 0; t < 8; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join(" "));
    p = r.value.partida;
  }
  foto[nome] = {
    ...(p.game.execution.values as Record<string, number>),
    ...Object.fromEntries(
      verPartida(p).leis.map((l) => [`lei:${l.id}`, l.nivel]),
    ),
  };
}
console.log(JSON.stringify(foto));
