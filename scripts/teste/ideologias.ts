/**
 * Simula 32 turnos (8 anos) para 4 ideologias × 2 caminhos fiscais.
 * Uso: npx vite-node scripts/teste/ideologias.ts -- 0 1   (índices das partidas)
 * Eventos e eleição desligados; as leis entram direto (aplicarMeta), sem voto.
 */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

type Meta = readonly [string, number | ((atual: number) => number)];
const x = (f: number) => (v: number) => v * f;

const IDEOLOGIAS: Record<string, readonly Meta[]> = {
  "Nada muda": [],
  "Social-democrata (Estado e liberdade)": [
    ["tributacao-dividendos", 20],
    ["imposto-renda-pessoas", 35],
    ["imposto-heranca", 15],
  ],
  "Desenvolvimentista estatal (Estado e autoridade)": [
    ["quem-controla-o-banco-central", 0],
    ["politica-industrial", 100],
    ["banco-de-desenvolvimento", 100],
    ["tarifas-de-importacao", 25],
    ["programa-de-privatizacao", 0],
  ],
  "Liberal (mercado e liberdade)": [
    ["imposto-renda-empresas", 25],
    ["tarifas-de-importacao", 0],
    ["programa-de-privatizacao", 100],
    ["revisao-de-gastos-tributarios", 100],
  ],
  "Conservador (mercado e autoridade)": [
    ["imposto-renda-empresas", 28],
    ["gasto-com-defesa", x(1.3)],
    ["programa-de-privatizacao", 100],
  ],
};

const CAMINHOS: Record<string, readonly Meta[]> = {
  "—": [],
  "Corte de gastos": [
    ["idade-minima-aposentadoria", 75],
    ["reajuste-de-beneficios", 25],
    ["regra-fiscal", 67],
    ["meta-de-resultado-primario", 100],
    ["transferencia-de-renda", x(0.85)],
    ["investimento-em-infraestrutura", x(0.8)],
    ["estabilidade-dos-servidores-publicos", 67],
  ],
  "Social + PIB": [
    ["investimento-em-infraestrutura", x(1.6)],
    ["investimento-pesquisa", x(1.5)],
    // "Volume de incentivo à indústria" saiu no molde (22/out): a alavanca
    // industrial agora é a Política industrial, setorial com metas.
    ["politica-industrial", 66.67],
    ["ensino-tecnico-e-profissional", 67],
    ["escola-em-tempo-integral", 100],
    ["transferencia-de-renda", x(1.3)],
    ["tributacao-dividendos", 20],
    ["imposto-renda-pessoas", 35],
    ["imposto-heranca", 15],
  ],
};

const PARTIDAS = [
  ["Nada muda", "—"] as const,
  ...Object.keys(IDEOLOGIAS)
    .filter((i) => i !== "Nada muda")
    .flatMap((i) =>
      Object.keys(CAMINHOS)
        .filter((c) => c !== "—")
        .map((c) => [i, c] as const),
    ),
];

function foto(p: Partida) {
  const v = p.game.execution.values;
  const c = verPartida(p).contas.percentualPib;
  const r = (n: number | undefined) => Math.round((n ?? NaN) * 10) / 10;
  return {
    divida: r(v.divida_publica),
    resultado: r(c.resultado),
    pib: r(v.pib),
    desemprego: r(v.desemprego),
    inflacao: r(v.inflacao),
    pobreza: r(v.pobreza),
    popularidade: r(v.popularidade_governo),
  };
}

for (const k of process.argv
  .slice(2)
  .filter((a) => /^\d+$/.test(a))
  .map(Number)) {
  const [ideologia, caminho] = PARTIDAS[k];
  const criada = criarPartida({
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  let p = criada.value;
  const recusadas: string[] = [];
  for (const [id, alvo] of [...IDEOLOGIAS[ideologia], ...CAMINHOS[caminho]]) {
    const lei = verPartida(p).leis.find((l) => l.id === id);
    const valor = typeof alvo === "function" ? alvo(lei?.nivel ?? 0) : alvo;
    const r = aplicarMeta(p, id, valor);
    if (r.ok) p = r.value;
    else recusadas.push(`${id}: ${r.erros.join(" ")}`);
  }
  const linha: Record<string, unknown> = { ideologia, caminho, t0: foto(p) };
  for (let t = 1; t <= 32; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(`turno ${t}: ${r.erros.join(" ")}`);
    p = r.value.partida;
    if (t === 8 || t === 16 || t === 32) linha[`t${t}`] = foto(p);
  }
  if (recusadas.length) linha.recusadas = recusadas;
  console.log("RESULTADO " + JSON.stringify(linha));
}
