/** Contratos de trabalho: referência e duas rotas de 16 turnos.
 * Uso: npx vite-node scripts/teste/setorTrabalhoLote13.ts
 * A aplicação direta testa a rede, sem representar votação no Congresso.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ROTAS = {
  referencia: [] as [string, number][],
  flexivel: [
    ["legislacao-trabalhista", 22.33], ["terceirizacao", 0],
    ["jornada-de-trabalho", 25], ["trabalho-por-aplicativo", 0],
    ["fiscalizacao-do-trabalho", 33.33],
  ],
  protetiva: [
    ["legislacao-trabalhista", 100], ["terceirizacao", 100],
    ["jornada-de-trabalho", 100], ["trabalho-por-aplicativo", 100],
    ["fiscalizacao-do-trabalho", 100],
  ],
} satisfies Record<string, [string, number][]>;
const IDS = ["informalidade", "trabalho_infantil", "custo_trabalhista", "desemprego",
  "renda_familias", "produtividade", "saude_populacao", "participacao_trabalho_cuidadoras",
  "cobertura_previdenciaria", "pib", "gasto_publico"];

function retrato(p: Partida) {
  const v = verPartida(p);
  const peso = v.grupos.reduce((s, g) => s + g.peso, 0);
  return {
    turno: p.game.currentTurn,
    bolhas: Object.fromEntries(v.bolhas.filter(b => IDS.includes(b.id)).map(b => [b.id, Number(b.valor.toFixed(3))])),
    divida: Number(v.contas.percentualPib.divida.toFixed(3)),
    satisfacao: Number((v.grupos.reduce((s, g) => s + g.peso * g.satisfacao, 0) / peso).toFixed(3)),
  };
}

for (const nome of ["referencia", "flexivel", "protetiva"] as const) {
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
  const vigentes = Object.fromEntries(ROTAS[nome].map(([id]) => {
    const x = p.game.policies.find(s => s.policyDefinitionId === id);
    return [id, { desejado: x?.desiredLevel, implementado: x?.implementedLevel }];
  }));
  console.log(JSON.stringify({ rota: nome, vigentes, observacoes }));
}
