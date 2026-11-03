// 12b, pilar 1: construções. Rodar: npm run construcoes
//
// Esperado (escrito antes):
// - sem o jogador mexer, o PIB real cresce perto da tendência do país (o
//   investimento privado do turno 0 é calibrado para isso);
// - imposto sobre lucro alto freia as obras: o PIB cresce menos, com atraso;
// - corrupção alta deixa as obras mais lentas e mais caras;
// - construção civil forte faz a fila andar mais rápido.
import { criarPartida, jogar, type Estado } from "../src/partida";
import { lucroDosSetores, precoDosSetores } from "../src/motor/mercado";

const TURNOS = 24;
const SEMENTES = [1, 2, 3, 4, 5, 6, 7, 8];

type Partida = ReturnType<typeof criarPartida>;
type Mexida = (p: Partida) => Partida;

const real = (e: Estado) =>
  e.essenciais.pib_nominal / e.essenciais.indice_precos;

/** Volume em obra (andando + na fila), em % do PIB do turno 0. */
const emObra = (e: Estado) =>
  (e.construcoes?.obras ?? []).reduce((s, o) => s + o.tamanho, 0);

/** Corrupção +40 pontos na base do país. */
export const corrupto: Mexida = (p) => ({
  ...p,
  estado: {
    ...p.estado,
    base: { ...p.estado.base, corrupcao: p.estado.base.corrupcao! + 40 },
    jogabilidade: {
      ...p.estado.jogabilidade,
      corrupcao: p.estado.jogabilidade.corrupcao! + 40,
    },
  },
});

/** Construção civil com o dobro da capacidade (mesmo PIB de partida). */
export const construtora: Mexida = (p) => {
  const c = p.estado.construcoes!;
  const setor = p.regras.mercado!.mercado.obras!.setor;
  return {
    ...p,
    estado: {
      ...p.estado,
      construcoes: { ...c, inicio: { ...c.inicio, [setor]: c.inicio[setor]! / 2 } },
    },
  };
};

export function resumo(
  pais: string,
  semente: number,
  imposto?: number,
  mexida: Mexida = (p) => p,
) {
  const inicio = mexida(criarPartida(pais, semente, { semCongresso: true }));
  const pedidos =
    imposto === undefined
      ? []
      : [{ tipo: "mudar_lei" as const, lei: "imposto-empresas", valor: imposto }];
  const fim = jogar(inicio, TURNOS, pedidos).estado;
  const anual =
    (Math.pow(real(fim) / real(inicio.estado), 6 / TURNOS) - 1) * 100;
  const sats = Object.values(fim.grupos).map((g) => g.satisfacao);
  return {
    anual,
    satisfacao: sats.reduce((a, b) => a + b, 0) / sats.length,
    juro: fim.essenciais.taxa_juros,
    emObra: emObra(fim),
  };
}

if (import.meta.env.MODE !== "test") {
  const cenarios: [string, number | undefined, Mexida?][] = [
    ["como está", undefined],
    ["imposto empresas 0%", 0],
    ["imposto empresas 50%", 0.5],
    ["corrupção +40", undefined, corrupto],
    ["imposto 0% + corrupção +40", 0, corrupto],
    ["imposto 0% + construção 2×", 0, construtora],
  ];
  for (const pais of ["teste", "teste-pobre"]) {
    console.log(`\n${pais} (24 turnos, média de ${SEMENTES.length} sementes)`);
    for (const [rotulo, imposto, mexida] of cenarios) {
      const r = SEMENTES.map((s) => resumo(pais, s, imposto, mexida));
      const media = (f: (x: (typeof r)[number]) => number) =>
        (r.reduce((a, x) => a + f(x), 0) / r.length).toFixed(2).padStart(6);
      console.log(
        `  ${rotulo.padEnd(28)} PIB ${media((x) => x.anual)}%/ano` +
          ` · em obra ${media((x) => x.emObra)}% do PIB` +
          ` · satisfação ${media((x) => x.satisfacao)}`,
      );
    }
  }
}

// Lucro por setor no fim de 24 turnos (média das sementes): margem de hoje ÷
// a do turno 0, capacidade ÷ a do turno 0 e quantas sementes têm o setor fechando.
if (import.meta.env.MODE !== "test") {
  for (const pais of ["teste", "teste-pobre"]) {
    const linhas: Record<string, { rel: number; cap: number; fecha: number; n: number }> = {};
    for (const semente of SEMENTES) {
      const p = criarPartida(pais, semente, { semCongresso: true });
      const fim = jogar(p, TURNOS, []).estado;
      const c = fim.construcoes!;
      const mercado = p.regras.mercado!.mercado;
      const lucro = lucroDosSetores(c, precoDosSetores(mercado, fim.precos), 0, 0);
      for (const [id, l] of Object.entries(lucro)) {
        const x = (linhas[id] ??= { rel: 0, cap: 0, fecha: 0, n: 0 });
        x.rel += l.relativa;
        x.cap += c.prontas[id]! / c.inicio[id]!;
        x.fecha += (c.lucro!.seguidos[id] ?? 0) >= 3 ? 1 : 0;
        x.n += 1;
      }
    }
    console.log(`\n${pais}: lucro por setor no turno 24 (média de ${SEMENTES.length} sementes)`);
    for (const [id, x] of Object.entries(linhas))
      console.log(
        `  ${id.padEnd(20)} margem ${(x.rel / x.n).toFixed(2)}× · capacidade ${(x.cap / x.n).toFixed(2)}× · fechando em ${x.fecha}/${x.n}`,
      );
  }
}
