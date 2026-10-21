/**
 * Comparação reproduzível de estratégias em 32 turnos, pelo motor real.
 * Aplica níveis diretamente para isolar a rede de efeitos; não modela votação.
 * Uso: npx vite-node scripts/teste/auditoriaEstrategias32.ts
 */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
import { saldoDasLeis } from "../../src/app/partida/contas";

const TURNOS = 32;
const SEMENTE = 7;
const MARCOS = new Set([1, 4, 8, 16, 24, 32]);
const ROTAS: Record<string, [string, number][]> = {
  referencia: [],
  social: [
    ["transferencia-de-renda-as-familias-pobres", 66.67],
    ["modelo-do-sistema-de-saude", 100],
    ["escola-em-tempo-integral", 100],
    ["salario-minimo", 67],
    ["seguro-desemprego", 75],
  ],
  liberal: [
    ["tarifas-de-importacao", 0],
    ["imposto-sobre-consumo", 13.35],
    ["modelo-do-sistema-de-saude", 0],
    ["quem-decide-o-salario-minimo", 0],
    ["salario-minimo", 0],
    ["seguro-desemprego", 25],
  ],
  recuperacao: [
    ["tarifas-de-importacao", 0],
    ["imposto-sobre-consumo", 13.35],
    ["modelo-do-sistema-de-saude", 0],
    ["quem-decide-o-salario-minimo", 0],
    ["salario-minimo", 0],
    ["seguro-desemprego", 25],
  ],
  seguranca: [
    ["policiamento-orientado", 33.33],
    ["armas-de-fogo", 100],
    ["penas-e-progressao", 100],
    ["lei-de-drogas", 0],
    ["regime-contra-faccoes", 50],
  ],
  fiscal: [
    ["imposto-sobre-consumo", 30],
    ["imposto-seletivo", 100],
    ["destino-do-resultado-fiscal", 0],
    ["reajuste-de-beneficios", 25],
    ["quem-decide-o-salario-minimo", 100],
    ["formula-do-salario-minimo", 33],
    ["salario-minimo", 33],
  ],
  misto: [
    ["transferencia-de-renda-as-familias-pobres", 33.33],
    ["modelo-do-sistema-de-saude", 75],
    ["escola-em-tempo-integral", 50],
    ["policiamento-orientado", 100],
    ["tarifas-de-importacao", 13.35],
    ["cooperacao-internacional", 100],
  ],
  propriedade_e_alcance_0: [
    ["propriedade-dos-meios-de-producao", 0],
    ["papel-do-estado-empresario", 0],
  ],
  propriedade_e_alcance_100: [
    ["propriedade-dos-meios-de-producao", 100],
    ["papel-do-estado-empresario", 100],
  ],
  extremo: [
    ["transferencia-de-renda-as-familias-pobres", 100],
    ["modelo-do-sistema-de-saude", 100],
    ["escola-em-tempo-integral", 100],
    ["salario-minimo", 100],
    ["policiamento-orientado", 100],
    ["armas-de-fogo", 0],
    ["penas-e-progressao", 0],
    ["lei-de-drogas", 100],
    ["imposto-sobre-consumo", 26.5],
    ["tarifas-de-importacao", 0],
  ],
};
const ACOES_RECUPERACAO: [string, number][] = [
  ["transferencia-de-renda-as-familias-pobres", 66.67],
  ["modelo-do-sistema-de-saude", 75],
  ["escola-em-tempo-integral", 50],
  ["imposto-sobre-consumo", 26.5],
  ["tarifas-de-importacao", 13.35],
  ["quem-decide-o-salario-minimo", 100],
  ["formula-do-salario-minimo", 33],
  ["salario-minimo", 67],
];

const arredondar = (x: number | undefined) =>
  x === undefined ? null : Math.round(x * 1000) / 1000;

function foto(partida: Partida, turno: number) {
  const vista = verPartida(partida);
  const valores = partida.game.execution.values;
  const saldoDaLei = saldoDasLeis(partida, valores);
  const ids = [
    "pib",
    "pib_nominal",
    "desemprego",
    "pobreza",
    "desigualdade",
    "saude_populacao",
    "aprendizagem",
    "violencia_letal",
    "crime_organizado",
    "sensacao_seguranca",
    "gasto_publico",
  ];
  const indicadores = Object.fromEntries(
    ids
      .filter((id) => typeof valores[id] === "number")
      .map((id) => [id, arredondar(valores[id])]),
  );
  const peso = vista.grupos.reduce((s, g) => s + g.peso, 0);
  const satisfacao = peso
    ? vista.grupos.reduce((s, g) => s + g.satisfacao * g.peso, 0) / peso
    : 0;
  return {
    turno,
    indicadores,
    contasPercentualPib: {
      receita: arredondar(vista.contas.percentualPib.receita),
      gasto: arredondar(vista.contas.percentualPib.gasto),
      juros: arredondar(vista.contas.percentualPib.juros),
      resultado: arredondar(vista.contas.percentualPib.resultado),
      divida: arredondar(vista.contas.percentualPib.divida),
      cofre: arredondar(vista.contas.percentualPib.cofre),
    },
    saldoAnualDasLeisDePropriedade: Object.fromEntries(
      [
        "propriedade-dos-meios-de-producao",
        "papel-do-estado-empresario",
        "programa-de-privatizacao",
        "nacionalizacao",
      ].map((id) => [id, arredondar(saldoDaLei(id))]),
    ),
    satisfacaoGrupos: arredondar(satisfacao),
  };
}

function executar(nome: string, escolhas: [string, number][]) {
  const inicio = criarPartida({
    modo: "real",
    semente: SEMENTE,
    ocorrencias: false,
    eleicao: false,
  });
  if (!inicio.ok) throw new Error(inicio.erros.join("; "));
  let partida = inicio.value;
  const recusas: string[] = [];
  for (const [lei, nivel] of escolhas) {
    const alterada = aplicarMeta(partida, lei, nivel);
    if (!alterada.ok)
      recusas.push(`${lei}=${nivel}: ${alterada.erros.join("; ")}`);
    else partida = alterada.value;
  }
  const inicial = foto(partida, 0);
  const fotos = [inicial];
  const contasPorTurno = [{ turno: 0, ...inicial.contasPercentualPib }];
  for (let t = 1; t <= TURNOS; t++) {
    if (nome === "recuperacao" && t === 17) {
      for (const [lei, nivel] of ACOES_RECUPERACAO) {
        const alterada = aplicarMeta(partida, lei, nivel);
        if (!alterada.ok)
          throw new Error(
            `recuperacao ${lei}=${nivel}: ${alterada.erros.join("; ")}`,
          );
        partida = alterada.value;
      }
    }
    const avancada = encerrarTurno(partida);
    if (!avancada.ok)
      throw new Error(`${nome} turno ${t}: ${avancada.erros.join("; ")}`);
    partida = avancada.value.partida;
    const retrato = foto(partida, t);
    contasPorTurno.push({ turno: t, ...retrato.contasPercentualPib });
    const valores = partida.game.execution.values;
    const naoFinitos = Object.entries(valores)
      .filter(([, v]) => !Number.isFinite(v))
      .map(([id]) => id);
    if (naoFinitos.length)
      throw new Error(
        `${nome} turno ${t}: não finitos ${naoFinitos.join(",")}`,
      );
    if (MARCOS.has(t)) fotos.push(retrato);
  }
  return { estrategia: nome, semente: SEMENTE, recusas, fotos, contasPorTurno };
}

for (const [nome, escolhas] of Object.entries(ROTAS)) {
  console.log(JSON.stringify(executar(nome, escolhas)));
}
