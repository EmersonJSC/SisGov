/** Prova focal do lote 7: mesmas condições iniciais, 16 turnos por rota.
 * Uso: npx vite-node scripts/teste/setorSegurancaLote7.ts
 * aplicarMeta escolhe as leis diretamente para isolar os efeitos da rede;
 * este ensaio não mede chances de aprovação no Congresso.
 */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const OPCOES = {
  referencia: [] as [string, number][],
  ordem: [
    ["policiamento-orientado", 33.33],
    ["armas-de-fogo", 100],
    ["penas-e-progressao", 100],
    ["lei-de-drogas", 0],
  ],
  cuidado: [
    ["policiamento-orientado", 100],
    ["armas-de-fogo", 0],
    ["penas-e-progressao", 0],
    ["lei-de-drogas", 100],
  ],
} satisfies Record<string, [string, number][]>;

const ALVOS = [
  "crimes_patrimoniais",
  "violencia_letal",
  "armas_em_circulacao",
  "lotacao_prisional",
  "letalidade_policial",
  "sensacao_seguranca",
  "gasto_publico",
  "crime_organizado",
];

function retrato(p: Partida) {
  const visao = verPartida(p);
  const bolhas = Object.fromEntries(
    visao.bolhas
      .filter((b) => ALVOS.includes(b.id))
      .map((b) => [b.id, Number(b.valor.toFixed(3))]),
  );
  const peso = visao.grupos.reduce((s, g) => s + g.peso, 0);
  const satisfacao =
    visao.grupos.reduce((s, g) => s + g.peso * g.satisfacao, 0) / peso;
  return {
    turno: p.game.currentTurn,
    bolhas,
    dividaPercentualPib: Number(visao.contas.percentualPib.divida.toFixed(3)),
    resultadoPercentualPib: Number(
      visao.contas.percentualPib.resultado.toFixed(3),
    ),
    satisfacao: Number(satisfacao.toFixed(3)),
  };
}

function jogar(nome: keyof typeof OPCOES) {
  const inicio = criarPartida({
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!inicio.ok) throw new Error(inicio.erros.join("\n"));
  let p = inicio.value;
  const aplicadas: string[] = [];
  for (const [id, valor] of OPCOES[nome]) {
    const r = aplicarMeta(p, id, valor);
    if (!r.ok) throw new Error(`${nome}: ${id}: ${r.erros.join("; ")}`);
    p = r.value;
    aplicadas.push(`${id}=${valor}`);
  }
  const observacoes = [retrato(p)];
  for (let i = 1; i <= 16; i++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`${nome}: turno ${i}: ${r.erros.join("; ")}`);
    p = r.value.partida;
    if ([1, 4, 8, 16].includes(i)) observacoes.push(retrato(p));
  }
  const vigentes = Object.fromEntries(
    OPCOES[nome].map(([id]) => {
      const s = p.game.policies.find((x) => x.policyDefinitionId === id);
      return [
        id,
        { desejado: s?.desiredLevel, implementado: s?.implementedLevel },
      ];
    }),
  );
  return { rota: nome, aplicadas, vigentes, observacoes };
}

for (const nome of ["referencia", "ordem", "cuidado"] as const)
  console.log(JSON.stringify(jogar(nome)));
