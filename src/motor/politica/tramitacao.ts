// Tramitação: o que o Congresso faz num turno com os pedidos do governo.
// Cada fase é uma função sobre a sessão do turno; a ordem importa. Comportamento
// em politica.md.
import type { ValorLei } from "../leis";
import { decretar, decretosVencidos, moedas, promessas } from "./moedas";
import { entrarNaPauta, sancao, votarPauta } from "./pauta";
import { convites, descansar, ressentidos } from "./relacao";
import {
  abrirSessao,
  cenarioDe,
  type EntradaTramitar,
  type SaidaTramitar,
  type Sessao,
} from "./sessao";
import type { Oferta, Votacao } from "./tipos";
import { valorCedido } from "./valores";
import { votar } from "./voto";

export { cenarioDe, type EntradaTramitar, type SaidaTramitar } from "./sessao";

const FASES: ((s: Sessao) => void)[] = [
  ressentidos,
  convites,
  entrarNaPauta,
  moedas,
  decretar,
  decretosVencidos,
  sancao,
  votarPauta,
  promessas,
  descansar,
];

export function tramitar(e: EntradaTramitar): SaidaTramitar {
  const s = abrirSessao(e);
  FASES.forEach((fase) => fase(s));
  return {
    votacoes: s.votacoes,
    estado: s.ec,
    fatos: s.fatos,
    coligacao: s.coligacao,
  };
}

/** Placar de hoje para um pedido: o mesmo que a votação vai dar. */
export function placarPrevisto(
  e: EntradaTramitar,
  lei: string,
  valor: ValorLei,
  /** Moedas que o jogador ainda vai mandar neste turno. */
  ofertasNovas: Oferta[] = [],
): Votacao | null {
  const def = e.leis[lei];
  if (!def) return null;
  const existente = e.estado.pauta.find((t) => t.lei === lei);
  const casa = existente?.casa === "senado" ? "senado" : "camara";
  const ofertas = [...(existente?.ofertas ?? []), ...ofertasNovas];
  const pedido = ofertas.some((o) => o.moeda === "ceder")
    ? (valorCedido(def, e.valores[lei], valor) ?? valor)
    : valor;
  const v = votar(cenarioDe(e), def, e.valores[lei], pedido, casa, ofertas);
  return { ...v, origem: "pedido" };
}
