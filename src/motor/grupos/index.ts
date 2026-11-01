// Grupos de interesse: leem os pops, os índices e as leis. Tipos vêm do
// mundo. Comportamento em grupos.md.
import type { Lei, ValorLei } from "../leis";
import type { Pop } from "../populacao";

/** Tipo de grupo do mundo. */
export interface TipoGrupo {
  id: string;
  /** Fração de cada pop que pertence ao grupo (0 a 1). */
  membros: Record<string, number>;
  /** Índices que o grupo cobra e o sentido que quer (1 subir, -1 descer). */
  cobra: { indice: string; sentido: 1 | -1 }[];
}

/** Grupo no estado. */
export interface Grupo {
  pessoas: number;
  /** Renda real média dos membros (renda ÷ nível de preços × 100). */
  renda_real: number;
  satisfacao: number;
  /** % do grupo. */
  radicais: number;
  /** % do grupo. */
  lealistas: number;
}

/** Turno 0: a referência contra a qual os grupos medem tudo. */
export interface Marco {
  indices: Record<string, number>;
  leis: Record<string, ValorLei>;
  renda_real: Record<string, number>;
}

const NEUTRO = 50;
const LIMITE_RENDA = 25;
const LIMITE_INDICE = 15;
const PONTOS_FAIXA = 50;
const PONTOS_OPCAO = 5;
const NOTA = { apoia: 1, rejeita: -1 } as const;
const BASE_ESTOQUE = 5;
const LIMIAR_RADICAL = 35;
const LIMIAR_LEAL = 65;
const GANHO_ESTOQUE = 2;
const PASSO_ESTOQUE = 1;

const prender = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Motivo de os grupos (ou o que as leis dizem deles) não fecharem, ou null. */
export function motivoGruposInvalidos(
  tipos: TipoGrupo[],
  pops: string[],
  indices: string[],
  leis: Record<string, Lei>,
): string | null {
  const ids = tipos.map((t) => t.id);
  for (const t of tipos) {
    const membros = Object.entries(t.membros);
    if (membros.length === 0) return `grupo ${t.id}: sem membros`;
    for (const [pop, f] of membros) {
      if (!pops.includes(pop)) return `grupo ${t.id}: pop "${pop}" não existe`;
      if (!(f > 0 && f <= 1))
        return `grupo ${t.id}: fração de ${pop} fora de (0, 1]`;
    }
    for (const c of t.cobra)
      if (!indices.includes(c.indice))
        return `grupo ${t.id}: índice "${c.indice}" não existe`;
  }
  for (const lei of Object.values(leis)) {
    const citados =
      lei.forma === "continua"
        ? Object.keys(lei.grupos ?? {})
        : lei.opcoes.flatMap((o) => Object.keys(o.grupos ?? {}));
    for (const g of citados)
      if (!ids.includes(g)) return `lei ${lei.id}: grupo "${g}" não existe`;
  }
  return null;
}

/** Pessoas e renda real média dos membros de um grupo. */
export function rendaDoGrupo(
  tipo: TipoGrupo,
  pops: Record<string, Pop>,
  indice_precos: number,
): { pessoas: number; renda_real: number } {
  let pessoas = 0;
  let renda = 0;
  for (const [id, f] of Object.entries(tipo.membros)) {
    pessoas += pops[id].pessoas * f;
    renda += pops[id].pessoas * f * pops[id].renda;
  }
  return { pessoas, renda_real: ((renda / pessoas) * 100) / indice_precos };
}

/** Pontos que as leis dão ao grupo, contra o marco. */
function pontosLeis(
  grupo: string,
  leis: Record<string, Lei>,
  agora: Record<string, ValorLei>,
  marco: Record<string, ValorLei>,
): number {
  let pontos = 0;
  for (const lei of Object.values(leis)) {
    if (lei.forma === "continua") {
      const quer = lei.grupos?.[grupo];
      if (!quer) continue;
      const { min, max } = lei.faixa;
      const valor = (agora[lei.id] as number | undefined) ?? min;
      const antes = (marco[lei.id] as number | undefined) ?? min;
      const sentido = quer === "mais" ? 1 : -1;
      pontos += (sentido * (valor - antes) * PONTOS_FAIXA) / (max - min);
    } else {
      const nota = (opcao: ValorLei | undefined) => {
        const g = lei.opcoes.find((o) => o.id === opcao)?.grupos?.[grupo];
        return g ? NOTA[g] : 0;
      };
      pontos += (nota(agora[lei.id]) - nota(marco[lei.id])) * PONTOS_OPCAO;
    }
  }
  return pontos;
}

/** Satisfação de 0 a 100; 50 no marco. */
export function satisfacao(
  tipo: TipoGrupo,
  renda_real: number,
  indices: Record<string, number>,
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
  marco: Marco,
): number {
  const variacao = (renda_real / marco.renda_real[tipo.id] - 1) * 100;
  let pontos = prender(variacao, -LIMITE_RENDA, LIMITE_RENDA);
  for (const { indice, sentido } of tipo.cobra)
    pontos += prender(
      sentido * (indices[indice] - marco.indices[indice]),
      -LIMITE_INDICE,
      LIMITE_INDICE,
    );
  pontos += pontosLeis(tipo.id, leis, vigentes, marco.leis);
  return prender(NEUTRO + pontos, 0, 100);
}

/** Para onde radicais e lealistas andam com esta satisfação. */
export function alvosEstoques(sat: number): {
  radicais: number;
  lealistas: number;
} {
  return {
    radicais: BASE_ESTOQUE + GANHO_ESTOQUE * Math.max(0, LIMIAR_RADICAL - sat),
    lealistas: BASE_ESTOQUE + GANHO_ESTOQUE * Math.max(0, sat - LIMIAR_LEAL),
  };
}

const andar = (de: number, para: number) =>
  de + prender(para - de, -PASSO_ESTOQUE, PASSO_ESTOQUE);

export interface EntradaGrupos {
  pops: Record<string, Pop>;
  indice_precos: number;
  indices: Record<string, number>;
  vigentes: Record<string, ValorLei>;
  marco: Marco;
  /** Grupos do turno anterior; sem eles, radicais e lealistas começam na base. */
  anteriores?: Record<string, Grupo>;
}

export function calcularGrupos(
  tipos: TipoGrupo[],
  leis: Record<string, Lei>,
  entrada: EntradaGrupos,
): Record<string, Grupo> {
  const grupos: Record<string, Grupo> = {};
  for (const t of tipos) {
    const { pessoas, renda_real } = rendaDoGrupo(
      t,
      entrada.pops,
      entrada.indice_precos,
    );
    const sat = satisfacao(
      t,
      renda_real,
      entrada.indices,
      leis,
      entrada.vigentes,
      entrada.marco,
    );
    const alvo = alvosEstoques(sat);
    const antes = entrada.anteriores?.[t.id];
    grupos[t.id] = {
      pessoas,
      renda_real,
      satisfacao: sat,
      radicais: antes ? andar(antes.radicais, alvo.radicais) : BASE_ESTOQUE,
      lealistas: antes ? andar(antes.lealistas, alvo.lealistas) : BASE_ESTOQUE,
    };
  }
  return grupos;
}
