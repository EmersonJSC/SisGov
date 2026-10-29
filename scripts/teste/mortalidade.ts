// Saúde → mortes: corta o piso de saúde e mostra saúde e população.
// Uso: npx vite-node scripts/teste/mortalidade.ts
import { criarPartida, encerrarTurno } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const m = aplicarMeta(
  c.value,
  "piso-saude",
  Number(process.env.NIVEL ?? 13.69),
);
if (!m.ok) throw new Error(m.erros.join(" "));
let p = m.value;
const v = () => p.game.execution.values as Record<string, number>;
let pop = v().populacao;
for (let t = 1; t <= 6; t++) {
  const r = encerrarTurno(p);
  if (!r.ok) throw new Error(r.erros.join(" "));
  p = r.value.partida;
  const d = v().populacao - pop;
  pop = v().populacao;
  console.log(
    `t${t} saúde=${v().saude_populacao.toFixed(2)} Δpop=${(d / 1e3).toFixed(1)} mil`,
  );
}
