/**
 * Aceite do desenho de docs/jogo/leis/equilibrio.md (seção 6) contra o motor.
 * Roda cada estratégia por 32 turnos (8 anos) e imprime esperado × obtido.
 * É um RELATÓRIO de diagnóstico: não falha quando um número não bate.
 * Uso: npx vite-node scripts/economia/aceite-equilibrio.ts [filtro-de-nome]
 * Eventos e eleição desligados; as leis entram direto (aplicarMeta), sem voto.
 */
import { criarPartida, encerrarTurno, verPartida, type Partida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

const TURNOS_POR_ANO = 4;
const ANOS = 8;

type Meta = readonly [string, number | ((atual: number) => number)];
const x = (f: number) => (v: number) => v * f;
/** Soma `pontos` do PIB (em reais) ao nível atual da lei de verba. */
const maisPib = (pontos: number) => (v: number) => v + (pontos / 100) * PIB0;
let PIB0 = 0;

const REFORMA: Meta[] = [
  ["idade-minima-aposentadoria", 75],
  ["reajuste-de-beneficios", 25],
];
const IMPOSTOS_PALME: Meta[] = [
  ["imposto-renda-pessoas", 45],
  ["tributacao-dividendos", 30],
  ["imposto-heranca", 20],
];

interface Esperado {
  divida4?: number;
  divida8?: number;
  pib8?: number;
  inflacao?: number;
}
interface Estrategia {
  nome: string;
  metas: Meta[];
  esperado: Esperado;
}

const ESTRATEGIAS: Estrategia[] = [
  { nome: "Nada muda", metas: [], esperado: { divida4: 94, divida8: 119, pib8: 114, inflacao: 3 } },
  {
    nome: "Austeridade",
    metas: [
      ...REFORMA,
      ["salario-dos-servidores", x(0.8)],
      ["quantidade-de-servidores", x(0.8)],
      ["programa-de-privatizacao", 100],
    ],
    esperado: { divida4: 71, divida8: 64, pib8: 117, inflacao: 3 },
  },
  {
    nome: "Cortar imposto e gasto (Milei)",
    metas: [
      ...REFORMA,
      ["imposto-renda-empresas", 25],
      ["imposto-sobre-consumo", 24],
      ["salario-dos-servidores", x(0.7)],
      ["quantidade-de-servidores", x(0.7)],
      ["programa-de-privatizacao", 100],
    ],
    esperado: { divida4: 70, divida8: 64, pib8: 119, inflacao: 3 },
  },
  {
    nome: "Cortar imposto sem gasto (Reagan)",
    metas: [
      ["imposto-renda-empresas", 21],
      ["imposto-renda-pessoas", 20],
      ["gasto-com-defesa", x(1.45)],
    ],
    esperado: { divida4: 108, divida8: 160, pib8: 113, inflacao: 3 },
  },
  {
    nome: "Indústria financiada",
    metas: [
      ...REFORMA,
      ["investimento-em-infraestrutura", maisPib(2)],
      ["politica-industrial", 100],
      ["banco-de-desenvolvimento", 100],
      ["salario-dos-servidores", x(0.8)],
      ["quantidade-de-servidores", x(0.8)],
      ["imposto-sobre-consumo", 28],
      ["tributacao-dividendos", 15],
    ],
    esperado: { divida4: 89, divida8: 95, pib8: 129, inflacao: 3 },
  },
  {
    nome: "Indústria no fiado",
    metas: [
      ["investimento-em-infraestrutura", maisPib(2)],
      ["politica-industrial", 100],
      ["banco-de-desenvolvimento", 100],
    ],
    esperado: { divida4: 108, divida8: 151, pib8: 123, inflacao: 3 },
  },
  { nome: "Taxar os ricos (Palme)", metas: [...IMPOSTOS_PALME, ["imposto-grandes-fortunas", 1.5]], esperado: { divida4: 82, divida8: 88, pib8: 112, inflacao: 3 } },
  {
    nome: "Social focado c/ superávit (Lula 2003)",
    metas: [
      ...REFORMA,
      ["imposto-renda-pessoas", 35],
      ["tributacao-dividendos", 20],
      ["imposto-heranca", 10],
      ["imposto-sobre-consumo", 28],
      ["imposto-transacoes-financeiras", 0.38],
      ["transferencia-de-renda", maisPib(0.5)],
      ["investimento-em-infraestrutura", maisPib(0.5)],
    ],
    esperado: { divida4: 83, divida8: 85, pib8: 116, inflacao: 3 },
  },
  {
    nome: "Estado de bem-estar completo",
    metas: [
      ...REFORMA,
      ...IMPOSTOS_PALME,
      ["imposto-grandes-fortunas", 1.0],
      ["imposto-sobre-consumo", 30],
      ["transferencia-de-renda", maisPib(1)],
      ["investimento-em-infraestrutura", maisPib(0.5)],
      ["piso-saude", x(1.1)],
      ["piso-educacao", x(1.1)],
    ],
    esperado: { divida4: 90, divida8: 103, pib8: 113, inflacao: 3 },
  },
  {
    nome: "Gasto social com imposto, sem reforma",
    metas: [
      ...IMPOSTOS_PALME,
      ["imposto-grandes-fortunas", 1.0],
      ["transferencia-de-renda", maisPib(1)],
      ["investimento-em-infraestrutura", maisPib(0.5)],
      ["piso-saude", x(1.1)],
      ["piso-educacao", x(1.1)],
    ],
    esperado: { divida4: 97, divida8: 128, pib8: 111, inflacao: 3 },
  },
  {
    nome: "Gasto social sem imposto",
    metas: [
      ["transferencia-de-renda", maisPib(2)],
      ["piso-saude", x(1.2)],
      ["piso-educacao", x(1.2)],
    ],
    esperado: { divida4: 121, divida8: 207, pib8: 106, inflacao: 3 },
  },
  {
    nome: "Imprimir dinheiro (Chávez)",
    metas: [["quem-controla-o-banco-central", 0], ["transferencia-de-renda", maisPib(3)]],
    esperado: { divida4: 89, divida8: 126, pib8: 105, inflacao: 25 },
  },
  // Moratória: a lei de calote não existe no catálogo atual; sem número do motor.
  { nome: "Moratória", metas: [], esperado: { divida4: 72, divida8: 104, pib8: 104, inflacao: 5 } },
];

const filtro = process.argv.slice(2).filter((a) => !a.startsWith("-"))[0]?.toLowerCase();

function valores(p: Partida): Record<string, number> {
  return p.game.execution.values as Record<string, number>;
}

/** PIB real na medida do nó `pib` (jan/2025 = 100), já convertido pela visão. */
function pibReal(p: Partida): number {
  const bolha = verPartida(p).bolhas.find((b) => b.id === "pib");
  return bolha?.medida?.valor ?? 0;
}

function jogar(e: Estrategia) {
  const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  let p = criada.value;
  PIB0 = verPartida(p).contas.pib;
  const recusadas: string[] = [];
  for (const [id, alvo] of e.metas) {
    const lei = verPartida(p).leis.find((l) => l.id === id);
    if (!lei) {
      recusadas.push(`${id}: lei inexistente`);
      continue;
    }
    const valor = typeof alvo === "function" ? alvo(lei.nivel) : alvo;
    const r = aplicarMeta(p, id, valor);
    if (r.ok) p = r.value;
    else recusadas.push(`${id}: ${r.erros.join(" ")}`);
  }
  // A tabela do documento fala do PIB real (jan/2025 = 100), não do PIB em
  // moeda: `contas.pib` é o nominal (nó `pib_nominal`) e cresce também com a
  // inflação. O real é o nó `pib`, que a visão entrega já convertido pela
  // medida em `medida.valor`.
  const pibReal0 = pibReal(p);
  let somaInfl = 0;
  const foto: Record<number, { divida: number; pib: number; primario: number; infl: number }> = {};
  for (let t = 1; t <= ANOS * TURNOS_POR_ANO; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`turno ${t}: ${r.erros.join(" ")}`);
    p = r.value.partida;
    const infl = valores(p).inflacao ?? 0;
    somaInfl += infl;
    if (t % TURNOS_POR_ANO === 0) {
      const v = verPartida(p).contas;
      foto[t / TURNOS_POR_ANO] = {
        divida: v.percentualPib.divida,
        pib: (100 * pibReal(p)) / pibReal0,
        primario: v.percentualPib.resultado + v.percentualPib.juros,
        infl: somaInfl / t,
      };
    }
  }
  return { foto, recusadas };
}

const f1 = (n: number | undefined) => (n === undefined || !Number.isFinite(n) ? "" : (Math.round(n * 10) / 10).toString());
const pad = (s: string, n: number) => s.padEnd(n);
console.log(
  [pad("estratégia", 40), pad("métrica", 24), pad("esperado", 9), pad("obtido", 9), "diferença"].join(" | "),
);
for (const e of ESTRATEGIAS) {
  if (filtro && !e.nome.toLowerCase().includes(filtro)) continue;
  try {
    const { foto, recusadas } = jogar(e);
    const linhas: [string, number | undefined, number][] = [
      ["dívida ano 4 (% PIB)", e.esperado.divida4, foto[4].divida],
      ["dívida ano 8 (% PIB)", e.esperado.divida8, foto[8].divida],
      ["PIB ano 8 (100=partida)", e.esperado.pib8, foto[8].pib],
      ["inflação média 8 anos (%)", e.esperado.inflacao, foto[8].infl],
      ["resultado primário ano 8", undefined, foto[8].primario],
    ];
    for (const [m, esp, obt] of linhas) {
      const dif = esp === undefined ? "" : (obt - esp >= 0 ? "+" : "") + f1(obt - esp);
      console.log([pad(e.nome, 40), pad(m, 24), pad(f1(esp), 9), pad(f1(obt), 9), dif].join(" | "));
    }
    for (const r of recusadas) console.log(`   (recusada) ${r}`);
  } catch (err) {
    console.log(`${e.nome}: QUEBROU ${(err as Error).message}`);
  }
}
