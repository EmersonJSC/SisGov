import { criarPartida, verPartida } from "../../src/app/partida";
import { montarBase, montarLayout } from "../../src/ui/mapa/layout";
import { escalaDaLei, nivelRelativo, referenciaDasLeis } from "../../src/ui/mapa/intensidade";
const c = criarPartida({ ocorrencias: false });
if (!c.ok) throw new Error("x");
const base = montarBase(verPartida(c.value));
const ref = referenciaDasLeis([...base.leis.values()]);
for (const nome of base.ministerios.map((m) => m.nome)) {
  const l = montarLayout(base, nome, new Set());
  const ps = [...l.leis.values()].map((p) => ({ ...p, rv: p.r * escalaDaLei(nivelRelativo(base.leis.get(p.id)!, ref)) }));
  let n = 0;
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) if (Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y) < ps[i].rv + ps[j].rv - 1) n++;
  console.log(nome.padEnd(14), "r", ps[0]?.r.toFixed(1), "leis", String(ps.length).padStart(3), "sobrepostas", n);
}
