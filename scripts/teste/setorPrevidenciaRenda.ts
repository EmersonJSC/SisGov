/** Critérios de renda com a mesma verba: referência e duas rotas de 16 turnos. */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ROTAS = {
  referencia: [] as [string, number][],
  focalizada: [["transferencia-de-renda-as-familias-pobres", 0]],
  universal: [["transferencia-de-renda-as-familias-pobres", 100]],
} satisfies Record<string, [string, number][]>;
const IDS = ["pobreza", "inseguranca_alimentar", "trabalho_infantil",
  "escolaridade", "corrupcao", "gasto_publico", "pib", "desigualdade"];

function retrato(p: Partida) {
  const v = verPartida(p);
  const peso = v.grupos.reduce((s, g) => s + g.peso, 0);
  return {
    turno: p.game.currentTurn,
    bolhas: Object.fromEntries(v.bolhas.filter(b => IDS.includes(b.id))
      .map(b => [b.id, Number(b.valor.toFixed(3))])),
    divida: Number(v.contas.percentualPib.divida.toFixed(3)),
    satisfacao: Number((v.grupos.reduce((s, g) => s + g.peso * g.satisfacao, 0) / peso).toFixed(3)),
  };
}

for (const nome of ["referencia", "focalizada", "universal"] as const) {
  const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let p = criada.value;
  for (const [id, valor] of ROTAS[nome]) {
    const r = aplicarMeta(p, id, valor);
    if (!r.ok) throw new Error(`${nome} ${id}: ${r.erros.join("; ")}`);
    p = r.value;
  }
  const observacoes = [retrato(p)];
  for (let t = 1; t <= 16; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`${nome} turno ${t}: ${r.erros.join("; ")}`);
    p = r.value.partida;
    if ([1, 4, 8, 16].includes(t)) observacoes.push(retrato(p));
  }
  console.log(JSON.stringify({ rota: nome, observacoes }));
}
