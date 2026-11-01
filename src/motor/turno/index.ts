// Turno: avancarTurno(regras, estado, pedidos) → novo estado, sem alterar o
// anterior. Ordem fixa (plano, seção 5); etapa que ainda não existe pula.
// O acaso mora no estado (motor/acaso). Comportamento em turno.md.
import { semear, sortearNormal } from "../acaso";
import { BASES, ehBase } from "../calculos";
import { enfileirar, envelhecer, filaInicial, somaPorIndice } from "../efeitos";
import type { Estado, IndicesEssenciais } from "../estado";
import { motivoValorInvalido, type ValorLei } from "../leis";
import type { Pedido, Regras } from "./regras";

export type { ParametrosBase, ParametrosPais, Pedido, Regras } from "./regras";

const TURNOS_POR_ANO = 6;

type Etapa = (regras: Regras, estado: Estado, pedidos: Pedido[]) => Estado;

const pular: Etapa = (_, estado) => estado;

/** 1. Congresso: entra no passo 8. Até lá, todo pedido passa. */
const congresso = pular;

/** 2. Leis novas: o valor muda e os efeitos entram na fila. */
const leisNovas: Etapa = (regras, estado, pedidos) => {
  let { leis, efeitos } = estado;
  for (const pedido of pedidos) {
    const lei = regras.leis[pedido.lei];
    if (!lei) throw new Error(`pedido: lei "${pedido.lei}" não existe`);
    const motivo = motivoValorInvalido(lei, pedido.valor);
    if (motivo) throw new Error(`pedido: ${pedido.lei} ${motivo}`);
    if (leis[lei.id] === pedido.valor) continue;
    leis = { ...leis, [lei.id]: pedido.valor };
    efeitos = enfileirar(efeitos, lei, pedido.valor);
  }
  return { ...estado, leis, efeitos };
};

/** 3. Efeitos andam um turno em direção ao inteiro. */
const efeitosVencem: Etapa = (_, estado) => ({
  ...estado,
  efeitos: envelhecer(estado.efeitos),
});

/** 4. Economia real, por enquanto só o sorteio do crescimento. */
const economiaReal: Etapa = (regras, estado) => {
  const { tendencia, volatilidade } = regras.pais.crescimento;
  const [z, acaso] = sortearNormal(estado.acaso);
  const anual = tendencia + volatilidade * z;
  const e = estado.essenciais;
  return {
    ...estado,
    acaso,
    essenciais: {
      ...e,
      crescimento_real: anual,
      pib_nominal:
        e.pib_nominal * Math.pow(1 + anual / 100, 1 / TURNOS_POR_ANO),
    },
  };
};

/** 5. Preços e juros: passo 5. */
const precosEJuros = pular;

/** Arrecadação das leis com cálculo, em % do PIB nominal. */
function arrecadacao(
  regras: Regras,
  leis: Record<string, ValorLei>,
  e: IndicesEssenciais,
): number {
  let total = 0;
  for (const [id, valor] of Object.entries(leis)) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.calculo) continue;
    const base = lei.calculo.base;
    const parametros = regras.pais.bases[base] ?? {
      ...BASES[base].padrao,
      parcela_pib: 0,
    };
    total += BASES[base].arrecadar(
      valor as number,
      e.pib_nominal * parametros.parcela_pib,
      parametros,
    );
  }
  return (total / e.pib_nominal) * 100;
}

/** 6. Contas: por enquanto só a arrecadação; dívida e juros no passo 5. */
const contas: Etapa = (regras, estado) => ({
  ...estado,
  essenciais: {
    ...estado.essenciais,
    arrecadacao: arrecadacao(regras, estado.leis, estado.essenciais),
  },
});

function jogabilidade(regras: Regras, estado: Estado) {
  const soma = somaPorIndice(estado.efeitos);
  const indices: Record<string, number> = {};
  for (const [id, base] of Object.entries(estado.base)) {
    const { min, max } = regras.dominios[id];
    indices[id] = Math.min(max, Math.max(min, base + (soma[id] ?? 0)));
  }
  return indices;
}

/** 7. Índices de jogabilidade: base do país + contribuições das leis. */
const indicesJogabilidade: Etapa = (regras, estado) => ({
  ...estado,
  jogabilidade: jogabilidade(regras, estado),
});

/** 8. Pops e grupos: passo 7. */
const popsEGrupos = pular;

/** 9. Política: passos 8 e 9. */
const politica = pular;

/** 10. Invariantes: falhou, para com erro. */
const invariantes: Etapa = (regras, estado) => {
  const falhas: string[] = [];
  for (const [id, v] of Object.entries(estado.essenciais))
    if (!Number.isFinite(v)) falhas.push(`${id} não é número finito`);
  if (estado.essenciais.ocupados > estado.essenciais.populacao)
    falhas.push("ocupados > população");
  for (const [id, v] of Object.entries(estado.jogabilidade)) {
    const { min, max } = regras.dominios[id];
    if (!(v >= min && v <= max)) falhas.push(`${id} fora de ${min}–${max}`);
  }
  for (const [id, valor] of Object.entries(estado.leis)) {
    const motivo = motivoValorInvalido(regras.leis[id], valor);
    if (motivo) falhas.push(`lei ${id} ${motivo}`);
  }
  if (falhas.length > 0)
    throw new Error(
      `invariante no turno ${estado.turno}: ${falhas.join("; ")}`,
    );
  return estado;
};

const ETAPAS: Etapa[] = [
  congresso,
  leisNovas,
  efeitosVencem,
  economiaReal,
  precosEJuros,
  contas,
  indicesJogabilidade,
  popsEGrupos,
  politica,
  invariantes,
];

export function avancarTurno(
  regras: Regras,
  estado: Estado,
  pedidos: Pedido[] = [],
): Estado {
  const proximo = { ...estado, turno: estado.turno + 1 };
  return ETAPAS.reduce((e, etapa) => etapa(regras, e, pedidos), proximo);
}

export interface Inicio {
  semente: number;
  essenciais: IndicesEssenciais;
  /** Índices de jogabilidade como o país está hoje, com as leis que tem. */
  jogabilidade: Record<string, number>;
  leis: Record<string, ValorLei>;
}

/** Estado do turno 0. Confere leis e índices; as leis vigentes já estão inteiras. */
export function estadoInicial(regras: Regras, inicio: Inicio): Estado {
  for (const id of Object.keys(regras.leis))
    if (!(id in inicio.leis)) throw new Error(`país: falta valor da lei ${id}`);
  for (const id of Object.keys(regras.dominios))
    if (!(id in inicio.jogabilidade))
      throw new Error(`país: falta o índice ${id}`);
  for (const base of Object.keys(regras.pais.bases))
    if (!ehBase(base)) throw new Error(`país: base "${base}" não existe`);

  const efeitos = filaInicial(regras.leis, inicio.leis);
  const soma = somaPorIndice(efeitos);
  const base: Record<string, number> = {};
  for (const [id, v] of Object.entries(inicio.jogabilidade))
    base[id] = v - (soma[id] ?? 0);

  const estado: Estado = {
    turno: 0,
    acaso: semear(inicio.semente),
    essenciais: { ...inicio.essenciais },
    jogabilidade: { ...inicio.jogabilidade },
    base,
    leis: { ...inicio.leis },
    efeitos,
  };
  return invariantes(regras, contas(regras, estado, []), []);
}
