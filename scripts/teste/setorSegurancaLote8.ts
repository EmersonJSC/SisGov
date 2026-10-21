/** Ensaio focal de vigilância e verba: npx vite-node scripts/teste/setorSegurancaLote8.ts */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
import { policyLevelRulesFromContent } from "../../src/game/policyRulesFromContent";

const rotas = {
  referencia: [] as [string, number][],
  auditada: [
    ["cameras-corporais", 1],
    ["cameras-e-reconhecimento-facial", 33],
    ["vigilancia-de-bairro", 50],
    ["fundo-seguranca-publica", 2 / 3],
  ],
  expansiva: [
    ["cameras-corporais", 0],
    ["cameras-e-reconhecimento-facial", 100],
    ["vigilancia-de-bairro", 100],
    ["fundo-seguranca-publica", 1],
  ],
} satisfies Record<string, [string, number][]>;

const ids = [
  "crimes_patrimoniais",
  "violencia_letal",
  "letalidade_policial",
  "sensacao_seguranca",
  "confianca_instituicoes",
  "liberdade_civil",
  "discriminacao",
  "gasto_publico",
];
const verbas = new Set(["cameras-corporais", "fundo-seguranca-publica"]);

function retrato(p: Partida) {
  const v = verPartida(p);
  return {
    turno: p.game.currentTurn,
    bolhas: Object.fromEntries(
      v.bolhas
        .filter((b) => ids.includes(b.id))
        .map((b) => [b.id, Number(b.valor.toFixed(3))]),
    ),
    divida: Number(v.contas.percentualPib.divida.toFixed(3)),
  };
}

for (const nome of ["referencia", "auditada", "expansiva"] as const) {
  const inicial = criarPartida({
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!inicial.ok) throw new Error(inicial.erros.join("; "));
  let p = inicial.value;
  const escolhas: [string, number][] = [];
  for (const [id, n] of rotas[nome]) {
    const regras = policyLevelRulesFromContent(p.content, id);
    if (!regras.ok) throw new Error(`${id}: regra de domínio ausente`);
    const valor = verbas.has(id)
      ? n * (regras.value.rules.domain.maximum ?? 0)
      : n;
    const r = aplicarMeta(p, id, valor);
    if (!r.ok) throw new Error(`${nome} ${id}: ${r.erros.join("; ")}`);
    p = r.value;
    escolhas.push([id, valor]);
  }
  const observacoes = [retrato(p)];
  for (let i = 1; i <= 16; i++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`${nome} T${i}: ${r.erros.join("; ")}`);
    p = r.value.partida;
    if ([1, 4, 8, 16].includes(i)) observacoes.push(retrato(p));
  }
  const vigentes = Object.fromEntries(
    escolhas.map(([id]) => {
      const x = p.game.policies.find((s) => s.policyDefinitionId === id);
      return [
        id,
        { desejado: x?.desiredLevel, implementado: x?.implementedLevel },
      ];
    }),
  );
  console.log(JSON.stringify({ rota: nome, vigentes, observacoes }));
}
