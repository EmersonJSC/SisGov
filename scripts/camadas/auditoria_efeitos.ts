/** Auditoria: para cada lei, muda para a opção mais alta e vê o que se mexe em 2 turnos. */
import { writeFileSync } from "node:fs";
import { criarPartida, encerrarTurno, mudarLei, verPartida } from "../../src/app/partida";

const c = criarPartida({ ocorrencias: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const base = c.value;
function rodar(p: typeof base, n: number) {
  let q = p;
  for (let i = 0; i < n; i++) {
    const r = encerrarTurno(q);
    if (!r.ok) throw new Error(r.erros.join(" "));
    q = r.value.partida;
  }
  return q;
}
const zero = rodar(base, 2).game.execution.values as Record<string, number>;
const visao = verPartida(base);
const saida: Record<string, unknown> = {};
for (const lei of visao.leis) {
  if (!lei.opcoes?.length) continue;
  const alvos = [...lei.opcoes].sort((a, b) => Math.abs(b.valor - lei.nivel) - Math.abs(a.valor - lei.nivel));
  const destino = alvos[0];
  if (Math.abs(destino.valor - lei.nivel) < 1e-9) continue;
  let r;
  try {
    r = mudarLei(base, lei.id, destino.valor);
  } catch {
    continue;
  }
  if (!r.ok) {
    saida[lei.id] = { erro: r.erros[0]?.slice(0, 60) };
    continue;
  }
  const v = rodar(r.value, 2).game.execution.values as Record<string, number>;
  const movimentos = Object.keys(v)
    .filter((k) => !k.startsWith("contexto:") && !k.startsWith("pressao_") && !k.startsWith("eficacia:") && !k.startsWith("apoio:") && !k.startsWith("nivel_") && !k.startsWith("ocorrencia_") && typeof zero[k] === "number")
    .map((k) => [k, v[k] - zero[k]] as const)
    .filter(([, d]) => Math.abs(d) > 1e-6)
    .sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
  saida[lei.id] = {
    nome: lei.nome,
    area: lei.area,
    para: destino.rotulo.slice(0, 40),
    n: movimentos.length,
    topo: movimentos.slice(0, 5).map(([k, d]) => `${k} ${d > 0 ? "+" : ""}${d.toFixed(2)}`),
    pressao: Object.keys(v)
      .filter((k) => k.startsWith("pressao_") && typeof zero[k] === "number" && Math.abs(v[k] - zero[k]) > 0.5)
      .map((k) => `${k} ${(v[k] - zero[k]).toFixed(1)}`)
      .slice(0, 4),
  };
}
writeFileSync(process.argv[2] ?? "auditoria.json", JSON.stringify(saida, null, 1));
console.log("leis auditadas:", Object.keys(saida).length);
