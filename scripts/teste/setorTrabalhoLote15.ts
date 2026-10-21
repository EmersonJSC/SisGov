/** Sindicatos e acesso a direitos: referência e duas rotas de 16 turnos.
 * Uso: npx vite-node scripts/teste/setorTrabalhoLote15.ts
 * Aplicação direta isola a rede, sem representar votação no Congresso.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ROTAS = {
  referencia: [] as [string, number][],
  empresarial: [
    ["contribuicao-sindical", 0], ["direito-de-greve", 0],
    ["custo-de-processar-na-justica-do-trabalho", 100],
    ["igualdade-salarial-de-genero", 33],
  ],
  direitos: [
    ["contribuicao-sindical", 100], ["direito-de-greve", 100],
    ["custo-de-processar-na-justica-do-trabalho", 0],
    ["igualdade-salarial-de-genero", 100],
  ],
} satisfies Record<string, [string, number][]>;
const IDS = ["greve_geral", "litigio_trabalhista", "diferenca_salarial_genero",
  "custo_trabalhista", "produtividade", "liberdade_civil", "confianca_empresarial",
  "participacao_trabalho_cuidadoras", "discriminacao", "gasto_publico", "pib"];

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

for (const nome of ["referencia", "empresarial", "direitos"] as const) {
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
