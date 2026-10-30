/**
 * Estudo bolha por bolha (30/out): para as bolhas de uma área, mostra o que
 * entra nelas (setas) e quais leis chegam nelas, por quantos passos.
 * Args: <trecho do nome da área> [profundidade=3]
 */
import { criarPartida, verPartida } from "../../src/app/partida";

const AREA = (process.argv[2] ?? "Economia").toLowerCase();
const PROF = Number(process.argv[3] ?? 3);
const r = criarPartida({ semente: 4 });
if (!r.ok) throw new Error(r.erros.join());
const p = r.value;
const bolhas = verPartida(p).bolhas;
const nome = new Map(p.content.variables.variaveis.map((v) => [v.id, v.nome]));
const donaDoControle = new Map(p.content.policies.map((l) => [l.controle.variavel, l.nome]));
const entram = new Map<string, typeof p.content.consequences>();
for (const c of p.content.consequences) entram.set(c.alvo, [...(entram.get(c.alvo) ?? []), c]);

const alvo = bolhas.filter((b) => b.area.toLowerCase().includes(AREA));
console.log(`${alvo.length} bolhas na área "${AREA}"\n`);
for (const b of alvo) {
  const diretas = entram.get(b.id) ?? [];
  const leis = new Map<string, number>();
  let fronteira = [b.id];
  const vistos = new Set(fronteira);
  for (let d = 1; d <= PROF; d++) {
    const prox: string[] = [];
    for (const id of fronteira)
      for (const c of entram.get(id) ?? []) {
        const lei = donaDoControle.get(c.origem);
        if (lei && !leis.has(lei)) leis.set(lei, d);
        if (!vistos.has(c.origem)) { vistos.add(c.origem); prox.push(c.origem); }
      }
    fronteira = prox;
  }
  console.log(`## ${b.nome} (${b.id}, ${b.tipo}, avalia: ${b.avaliacao ?? "-"})`);
  console.log(`  entra de: ${diretas.map((c) => nome.get(c.origem) ?? c.origem).join("; ") || "(nada)"}`);
  const porD = [1, 2, 3].map((d) => [...leis].filter(([, x]) => x === d).map(([l]) => l));
  console.log(`  leis a 1 passo: ${porD[0].join(", ") || "-"}`);
  console.log(`  leis a 2 passos: ${porD[1].join(", ") || "-"}`);
  console.log(`  leis a 3 passos: ${porD[2].length} (${porD[2].slice(0, 6).join(", ")}${porD[2].length > 6 ? "…" : ""})\n`);
}
