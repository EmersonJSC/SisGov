/** Piso salarial e rede de segurança: três rotas de 16 turnos.
 * Uso: npx vite-node scripts/teste/setorTrabalhoLote14.ts
 * Aplica decisões diretamente para isolar rede, sem representar o Congresso.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ROTAS = {
  referencia: [] as [string, number][],
  contencao: [
    ["quem-decide-o-salario-minimo", 67], ["formula-do-salario-minimo", 33],
    ["salario-minimo", 33], ["fundo-de-garantia", 33], ["seguro-desemprego", 25],
  ],
  valorizacao: [
    ["quem-decide-o-salario-minimo", 100], ["formula-do-salario-minimo", 67],
    ["salario-minimo", 100], ["fundo-de-garantia", 67], ["seguro-desemprego", 100],
  ],
} satisfies Record<string, [string, number][]>;
const IDS = ["pobreza", "renda_familias", "custo_trabalhista", "informalidade",
  "desemprego", "consumo", "poupanca_domestica", "gasto_publico", "inflacao",
  "expectativas_inflacao", "deficit_previdenciario", "credito"];

function retrato(p: Partida) {
  const v = verPartida(p);
  const peso = v.grupos.reduce((s, g) => s + g.peso, 0);
  const piso = p.game.policies.find(x => x.policyDefinitionId === "salario-minimo");
  return {
    turno: p.game.currentTurn,
    piso: { desejado: piso?.desiredLevel, implementado: piso?.implementedLevel },
    bolhas: Object.fromEntries(v.bolhas.filter(b => IDS.includes(b.id)).map(b => [b.id, Number(b.valor.toFixed(3))])),
    divida: Number(v.contas.percentualPib.divida.toFixed(3)),
    satisfacao: Number((v.grupos.reduce((s, g) => s + g.peso * g.satisfacao, 0) / peso).toFixed(3)),
  };
}

for (const nome of ["referencia", "contencao", "valorizacao"] as const) {
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
