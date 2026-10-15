/**
 * V1-39: prova da urna com os segundos turnos reais (TSE), só pela bússola.
 * Uso: vite-node scripts/eleicao/prova.ts
 */
import { criarPartida } from "../../src/app/partida";
import { referenciasDaBussola } from "../../src/game/bussola";
import { chancesDoPerfil, congressoDoPacote } from "../../src/game/congresso";

const p = criarPartida({ semente: 1 });
if (!p.ok) throw new Error(p.erros.join());
const pacote = congressoDoPacote(p.value.content)!;
const ponto = (id: string) => {
  const r =
    referenciasDaBussola.personalidades.find((x) => x.id === id) ??
    referenciasDaBussola.partidos.find((x) => x.id === id)!;
  return { economia: r.economia, costumes: r.costumes };
};
// segundo turno: [a, b, % real de a]
const disputas: [string, string, number, string][] = [
  ["lula", "psdb", 60.8, "2006 Lula × Alckmin"],
  ["dilma", "psdb", 51.6, "2014 Dilma × Aécio"],
  ["pt", "bolsonaro", 44.9, "2018 Haddad × Bolsonaro"],
  ["lula", "bolsonaro", 50.9, "2022 Lula × Bolsonaro"],
];
const r1 = (n: number) => Math.round(n * 10) / 10;
for (const s of [0.1, 0.15, 0.2, 0.3])
  for (const pc of [0.25, 0.5, 1]) {
    let erro = 0;
    const linha = disputas.map(([a, b, real]) => {
      const ca = ponto(a),
        cb = ponto(b);
      const esc = (x: { economia: number; costumes: number }) => ({
        economia: x.economia,
        costumes: x.costumes * pc,
      });
      let va = 0,
        tot = 0;
      for (const perfil of pacote.perfis) {
        const ch = chancesDoPerfil(
          esc(perfil.ponto),
          [
            { id: "a", ponto: esc(ca) },
            { id: "b", ponto: esc(cb) },
          ],
          s,
        );
        va += perfil.peso * ch[0];
        tot += perfil.peso;
      }
      const m = (100 * va) / tot;
      erro += Math.abs(m - real);
      return `${r1(m)}/${real}`;
    });
    console.log(
      `s=${s} costumes×${pc}: ${linha.join("  ")}  erro médio ${r1(erro / 4)}`,
    );
  }
