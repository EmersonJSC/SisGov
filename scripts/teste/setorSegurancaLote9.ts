/** Organização policial: três partidas idênticas, 16 turnos cada.
 * Uso: npx vite-node scripts/teste/setorSegurancaLote9.ts
 * As mudanças diretas isolam a rede; não representam aprovação no Congresso.
 */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const ROTAS = {
  referencia: [] as [string, number][],
  conjunta: [
    ["coordenacao-das-policias", 100],
    ["ciclo-policial", 100],
  ],
  civil: [
    ["coordenacao-das-policias", 50],
    ["policia-militar", 100],
  ],
} satisfies Record<string, [string, number][]>;

const IDS = [
  "capacidade_inteligencia",
  "crime_organizado",
  "letalidade_policial",
  "liberdade_civil",
  "impunidade",
  "confianca_instituicoes",
  "gasto_publico",
  "sensacao_seguranca",
];

function retrato(p: Partida) {
  const v = verPartida(p);
  const peso = v.grupos.reduce((s, g) => s + g.peso, 0);
  return {
    turno: p.game.currentTurn,
    bolhas: Object.fromEntries(
      v.bolhas
        .filter((b) => IDS.includes(b.id))
        .map((b) => [b.id, Number(b.valor.toFixed(3))]),
    ),
    divida: Number(v.contas.percentualPib.divida.toFixed(3)),
    satisfacao: Number(
      (v.grupos.reduce((s, g) => s + g.peso * g.satisfacao, 0) / peso).toFixed(
        3,
      ),
    ),
  };
}

for (const nome of ["referencia", "conjunta", "civil"] as const) {
  const criada = criarPartida({
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let p = criada.value;
  for (const [id, n] of ROTAS[nome]) {
    const r = aplicarMeta(p, id, n);
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
  const vigentes = Object.fromEntries(
    ROTAS[nome].map(([id]) => {
      const x = p.game.policies.find((s) => s.policyDefinitionId === id);
      return [
        id,
        { desejado: x?.desiredLevel, implementado: x?.implementedLevel },
      ];
    }),
  );
  console.log(JSON.stringify({ rota: nome, vigentes, observacoes }));
}
