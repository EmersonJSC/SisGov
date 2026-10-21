/** Justiça e prisões: referência e duas rotas de 16 turnos.
 * Uso: npx vite-node scripts/teste/setorSegurancaLote10.ts
 * Aplicação direta isola a rede e não representa votação no Congresso.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
import { policyLevelRulesFromContent } from "../../src/game/policyRulesFromContent";

const ROTAS = {
  referencia: [] as [string, number][],
  punitiva: [
    ["gestao-dos-presidios", 100], ["vagas-em-presidios", 1],
    ["alternativas-penais-e-audiencia-de-custodia", 0], ["maioridade-penal", 100],
  ],
  restaurativa: [
    ["gestao-dos-presidios", 50], ["vagas-em-presidios", 1 / 3],
    ["alternativas-penais-e-audiencia-de-custodia", 100], ["maioridade-penal", 0],
  ],
} satisfies Record<string, [string, number][]>;

const IDS = ["lotacao_prisional", "rebeliao_presidios", "reincidencia",
  "crime_organizado", "sensacao_seguranca", "gasto_publico", "confianca_instituicoes"];

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

for (const nome of ["referencia", "punitiva", "restaurativa"] as const) {
  const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let p = criada.value;
  for (const [id, n] of ROTAS[nome]) {
    const regras = policyLevelRulesFromContent(p.content, id);
    if (!regras.ok) throw new Error(`${id}: domínio indisponível`);
    const valor = id === "vagas-em-presidios" ? n * (regras.value.rules.domain.maximum ?? 0) : n;
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
