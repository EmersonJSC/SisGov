/**
 * V1-39: a eleição no turno 0, sem mandato (só bússola e bônus), para várias
 * sementes. Uso: vite-node scripts/eleicao/base.ts [sementes, ex.: 1-20]
 */
import { criarPartida } from "../../src/app/partida";
import { congressoDoPacote } from "../../src/game/congresso";
import {
  candidatosDaEleicao,
  contar,
  eleicaoDoPais,
  regrasDaEleicao,
} from "../../src/game/eleicao";

const arg = process.argv[2] ?? "1-10";
const [a, b] = arg.split("-").map(Number);
const r1 = (n: number) => Math.round(n * 10) / 10;
for (let s = a; s <= (b ?? a); s++) {
  const p = criarPartida({ semente: s });
  if (!p.ok) throw new Error(p.erros.join());
  const e = p.value.game.election!;
  const pacote = congressoDoPacote(p.value.content)!;
  const pais = eleicaoDoPais("brasil")!;
  const ctx = {
    pacote,
    regras: regrasDaEleicao,
    pais,
    valores: p.value.game.execution.values,
    economiaNoInicio: e.economiaNoInicio,
    ideologia: e.partido.ideologia,
  };
  const todos = [e.presidente, ...e.adversarios];
  const v = contar(
    ctx,
    candidatosDaEleicao(ctx, todos, e.presidente.id, e.presidente.id),
  ).votos;
  const segundo = Math.min(
    ...e.adversarios.map(
      (adv) =>
        contar(
          ctx,
          candidatosDaEleicao(
            ctx,
            [e.presidente, adv],
            e.presidente.id,
            e.presidente.id,
          ),
        ).votos[e.presidente.id],
    ),
  );
  const pt = (x: { ponto: { economia: number; costumes: number } }) =>
    `(${r1(x.ponto.economia)},${r1(x.ponto.costumes)})`;
  console.log(
    `s${s}: ${todos.map((c) => `${c.nome.split(" ")[0]}[${c.lado}${pt(c)} c${c.carisma}e${c.experiencia}] ${r1(v[c.id])}`).join(" | ")} || 2º pior ${r1(segundo)}`,
  );
}
