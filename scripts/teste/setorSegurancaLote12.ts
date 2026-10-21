/** Justiça e proteção: referência e duas rotas de 16 turnos.
 * Uso: npx vite-node scripts/teste/setorSegurancaLote12.ts
 * Aplicação direta isola a rede; não representa votação no Congresso.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
import { policyLevelRulesFromContent } from "../../src/game/policyRulesFromContent";

const ROTAS = {
  referencia: [] as [string, number][],
  linhaDura: [
    ["delacao-premiada", 100], ["excludente-de-ilicitude", 100],
    ["protecao-contra-violencia-domestica", 33], ["verba-policia-federal", 1],
  ],
  protecao: [
    ["delacao-premiada", 50], ["excludente-de-ilicitude", 0],
    ["protecao-contra-violencia-domestica", 100], ["verba-policia-federal", 0.5],
  ],
} satisfies Record<string, [string, number][]>;

const IDS = ["impunidade", "corrupcao", "crime_organizado", "liberdade_civil",
  "letalidade_policial", "protecao_efetiva_mulheres", "violencia_letal",
  "confianca_instituicoes", "gasto_publico", "capacidade_inteligencia"];

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

for (const nome of ["referencia", "linhaDura", "protecao"] as const) {
  const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let p = criada.value;
  for (const [id, n] of ROTAS[nome]) {
    const regras = policyLevelRulesFromContent(p.content, id);
    if (!regras.ok) throw new Error(`${id}: domínio indisponível`);
    const valor = id === "verba-policia-federal" ? n * (regras.value.rules.domain.maximum ?? 0) : n;
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
