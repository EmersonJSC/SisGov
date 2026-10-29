// O piso do salário mínimo no bolso: ganho mensal de quem segue o piso, por mínimo.
import { criarPartida } from "../../src/app/partida";
import { bolsosDoEleitorado } from "../../src/app/partida/bolso";

const p = criarPartida({ ocorrencias: false, eleicao: false });
if (!p.ok) throw new Error(p.erros.join(" "));
const vs = p.value.game.execution.values as Record<string, number>;
for (const minimo of [30, vs.salario_minimo_efetivo, 80, 100]) {
  const e = bolsosDoEleitorado(p.value.content, {
    ...vs,
    salario_minimo_efetivo: minimo,
  })!;
  const c = e.manifesto;
  const col = c.atributos.indexOf("renda") + 1;
  const linhas = ["carteira", "servidor", "informal"].map((f) => {
    const i = c.perfis.findIndex(
      (pf, k) =>
        c.valores.renda?.[pf[col]] === "pobre" && e.bolsos[k].fonte.id === f,
    );
    return `${f} pobre R$ ${Math.round(e.bolsos[i].ganha / 12)}/mês`;
  });
  console.log(`mínimo ${minimo.toFixed(0)}%: ${linhas.join(" · ")}`);
}
