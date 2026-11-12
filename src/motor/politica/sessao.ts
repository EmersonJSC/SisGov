// Sessão: o estado de um turno do Congresso. Nasce da entrada, as fases a
// alteram e ela é descartada no fim; o estado de fora nunca é tocado.
import { novoFato, type Fato, type FatoNovo } from "../fatos";
import { posicaoDaLei, type Grupo, type TipoGrupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import {
  REACAO_AO_VOTO,
  REACAO_AO_VOTO_CONTRA,
  TURNOS_BARRADA,
} from "./constantes";
import type {
  Casa,
  Congresso,
  EstadoCongresso,
  PedidoCongresso,
  PedidoMudarLei,
  Votacao,
} from "./tipos";
import type { Cenario } from "./voto";

export interface EntradaTramitar {
  congresso: Congresso;
  tipos: TipoGrupo[];
  leis: Record<string, Lei>;
  /** Valores das leis agora. */
  valores: Record<string, ValorLei>;
  turno: number;
  estado: EstadoCongresso;
  coligacao: string[];
  grupos: Record<string, Grupo>;
  deficit: number;
  fatos: readonly Fato[];
  turnosParaEleicao: number | null;
  pedidos: PedidoCongresso[];
}

export interface SaidaTramitar {
  votacoes: Votacao[];
  estado: EstadoCongresso;
  fatos: Fato[];
  coligacao: string[];
}

/** O que o voto lê, no começo do turno. */
export function cenarioDe(e: EntradaTramitar): Cenario {
  const q = e.congresso.leis?.quorum;
  const v = q ? e.valores[q] : undefined;
  return {
    congresso: e.congresso,
    tipos: e.tipos,
    coligacao: e.coligacao,
    grupos: e.grupos,
    leis: e.valores,
    termometro: e.estado.termometro,
    preco: e.estado.preco,
    paciencia: e.estado.paciencia,
    deficit: e.deficit,
    fatos: e.fatos,
    turnosParaEleicao: e.turnosParaEleicao,
    quorumDaLei: typeof v === "number" ? v : null,
  };
}

export interface Sessao {
  e: EntradaTramitar;
  /** Estado do Congresso em andamento (cópia). */
  ec: EstadoCongresso;
  /** Valores das leis, já com o que passou neste turno. */
  valores: Record<string, ValorLei>;
  cenario: Cenario;
  votacoes: Votacao[];
  fatos: Fato[];
  /** Mudança de termômetro de cada partido, aplicada no fim do turno. */
  termometro: Record<string, number>;
  /** Cansaço de cada casa neste turno. */
  cansaco: Record<Casa, number>;
  coligacao: string[];
  /** Leis que o governo pediu neste turno. */
  novas: PedidoMudarLei[];
}

export function abrirSessao(e: EntradaTramitar): Sessao {
  return {
    e,
    ec: structuredClone(e.estado),
    valores: { ...e.valores },
    cenario: cenarioDe(e),
    votacoes: [],
    fatos: [],
    termometro: {},
    cansaco: { camara: 0, senado: 0 },
    coligacao: [...e.coligacao],
    novas: [],
  };
}

/** Pedido inválido: para o turno com a mensagem. */
export function falha(mensagem: string): never {
  throw new Error(`pedido: ${mensagem}`);
}

/** Os pedidos de um tipo só, já com o tipo estreitado. */
export const pedidosDo = <T extends PedidoCongresso["tipo"]>(
  s: Sessao,
  tipo: T,
) =>
  s.e.pedidos.filter(
    (p): p is Extract<PedidoCongresso, { tipo: T }> => p.tipo === tipo,
  );

export const registrar = (s: Sessao, f: FatoNovo) => s.fatos.push(novoFato(f));

export const mexer = (s: Sessao, partido: string, delta: number) => {
  s.termometro[partido] = (s.termometro[partido] ?? 0) + delta;
};

export const cansar = (s: Sessao, peso: number) => {
  s.cansaco.camara += peso;
  s.cansaco.senado += peso;
};

export const partidosContra = (v: Votacao) =>
  Object.keys(v.votos).filter((p) => v.votos[p] === "nao");

/** Votação sem votos, para o que vale sem voto (decreto, sanção). */
export const semVoto = (
  lei: string,
  valor: ValorLei,
  origem: Votacao["origem"],
): Votacao => ({
  lei,
  valor,
  exorbitante: false,
  votos: {},
  sim: 0,
  nao: 0,
  aprovada: true,
  muda_lei: true,
  origem,
});

/** Registra a votação; se muda a lei, os próximos votos já a veem mudada. */
export function lancar(s: Sessao, v: Votacao): Votacao {
  s.votacoes.push(v);
  if (v.muda_lei) s.valores[v.lei] = v.valor;
  return v;
}

/** A lei passou e virou lei: fato, e cada partido reage à sua nota. */
export function aprovou(s: Sessao, v: Votacao) {
  const lado = posicaoDaLei(s.e.leis[v.lei], v.valor);
  const contra = partidosContra(v);
  registrar(s, {
    tipo: "lei-aprovada",
    turno: s.e.turno,
    tamanho: "medio",
    sobre: v.lei,
    ...(contra.length ? { quem: contra } : {}),
    ...(lado ? { lado } : {}),
  });
  for (const [p, nota] of Object.entries(v.notas ?? {}))
    if (p !== s.e.congresso.governo)
      mexer(s, p, nota * (nota >= 0 ? REACAO_AO_VOTO : REACAO_AO_VOTO_CONTRA));
}

/** A lei caiu: fica barrada por uns turnos e vira fato. */
export function barrar(s: Sessao, v: Votacao) {
  s.ec.barradas = [
    ...s.ec.barradas.filter((b) => b.lei !== v.lei),
    { lei: v.lei, ate: s.e.turno + TURNOS_BARRADA },
  ];
  const contra = partidosContra(v);
  registrar(s, {
    tipo: "lei-rejeitada",
    turno: s.e.turno,
    tamanho: "pequeno",
    sobre: v.lei,
    ...(contra.length ? { quem: contra } : {}),
  });
}
