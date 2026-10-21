/** Ensaio focal do ciclo elétrico: mesma verba, fontes diferentes, 16 turnos. */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ids = ["infraestrutura_energia", "oferta_energia", "preco_energia",
  "emissoes", "investimento", "pib", "gasto_publico"];

function retrato(p: Partida) {
  const v = verPartida(p);
  return Object.fromEntries(v.bolhas.filter(b => ids.includes(b.id))
    .map(b => [b.id, Number(b.valor.toFixed(3))]));
}

for (const [nome, fonte] of [["referencia", null], ["solar", 0], ["gas", 75]] as const) {
  const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let p = criada.value;
  if (fonte !== null) {
    for (const [lei, nivel] of [["orcamento-de-expansao-eletrica", 20000],
      ["investimento-em-geracao-por-fonte", fonte]] as const) {
      const r = aplicarMeta(p, lei, nivel);
      if (!r.ok) throw new Error(`${nome} ${lei}: ${r.erros.join("; ")}`);
      p = r.value;
    }
  }
  const inicial = retrato(p);
  for (let t = 1; t <= 16; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`${nome} turno ${t}: ${r.erros.join("; ")}`);
    p = r.value.partida;
  }
  console.log(JSON.stringify({ rota: nome, inicial, final: retrato(p) }));
}
