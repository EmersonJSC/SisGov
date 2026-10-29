import { criarPartida, encerrarTurno } from "../../src/app/partida";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
let p = c.value;
const v0 = p.game.execution.values as Record<string, number>;
v0.natalidade = Number(process.env.NAT ?? 0);
v0.saude_populacao = Number(process.env.SAUDE ?? 0);
for (let t = 0; t < 6; t++) {
  const r = encerrarTurno(p);
  if (!r.ok) throw new Error(r.erros.join(" "));
  p = r.value.partida;
  const v = p.game.execution.values;
  console.log(t, v.natalidade.toFixed(1), v.saude_populacao.toFixed(1), v.taxa_natalidade.toFixed(2), v.taxa_mortalidade.toFixed(2), Math.round(v.populacao));
}
