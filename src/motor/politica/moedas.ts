// O que o governo oferece e decide por conta própria: moedas, decreto e as
// promessas que ficam como dívida.
import {
  CANSACO_DO_DECRETO,
  CANSACO_EXTRA_POR_DECRETO_VIGENTE,
  PRAZO_DA_PROMESSA,
  PRECO_POR_COMPRA,
  TERMOMETRO_POR_MOEDA,
  TERMOMETRO_PROMESSA_QUEBRADA,
  TURNOS_PARA_CONFIRMAR,
} from "./constantes";
import {
  cansar,
  falha,
  lancar,
  mexer,
  partidosContra,
  pedidosDo,
  registrar,
  semVoto,
  type Sessao,
} from "./sessao";
import type { Moeda, PedidoOferecer, Tramitacao } from "./tipos";
import {
  alcanceDoDecreto,
  decretoAlcanca,
  reservaDeCargos,
  reservaDeEmendas,
  valorCedido,
} from "./valores";
import { posicaoDaLei } from "../grupos";
import { votar } from "./voto";

/** O partido que recebe a moeda precisa existir. */
function partidoDa(s: Sessao, p: PedidoOferecer): string {
  if (!p.partido || !s.e.congresso.partidos.some((x) => x.id === p.partido))
    falha(`partido "${p.partido}" não existe`);
  return p.partido;
}

/** Cobra a moeda: o partido anima e aprende a cobrar mais. */
function pagar(s: Sessao, partido: string, moeda: Moeda) {
  mexer(s, partido, TERMOMETRO_POR_MOEDA[moeda] ?? 0);
  s.ec.preco[partido] = (s.ec.preco[partido] ?? 0) + PRECO_POR_COMPRA;
}

type Compra = (s: Sessao, p: PedidoOferecer, t: Tramitacao) => void;

const COMPRAS: Record<Moeda, Compra> = {
  ceder(s, p, t) {
    const cedido = valorCedido(s.e.leis[p.lei], s.valores[p.lei], t.valor);
    if (cedido === null) falha(`${p.lei} não tem régua para ceder`);
    t.valor = cedido;
  },
  cargos(s, p) {
    const partido = partidoDa(s, p);
    if (
      s.ec.cargosUsados >= reservaDeCargos(s.e.congresso, s.e.leis, s.valores)
    )
      falha("acabou a reserva de cargos de livre nomeação");
    s.ec.cargosUsados += 1;
    pagar(s, partido, "cargos");
  },
  emenda(s, p) {
    const partido = partidoDa(s, p);
    if (
      s.ec.emendasUsadas >= reservaDeEmendas(s.e.congresso, s.e.leis, s.valores)
    )
      falha("acabou a reserva de emendas");
    s.ec.emendasUsadas += 1;
    pagar(s, partido, "emenda");
  },
  promessa(s, p) {
    const partido = partidoDa(s, p);
    if (!p.promessa || !s.e.leis[p.promessa.lei])
      falha("promessa precisa de uma lei existente");
    s.ec.promessas.push({
      partido,
      lei: p.promessa.lei,
      valor: p.promessa.valor,
      prazo: s.e.turno + PRAZO_DA_PROMESSA,
    });
    pagar(s, partido, "promessa");
  },
  ministerio() {
    falha("ministério depende do passo Governo");
  },
};

/** Moedas oferecidas a leis que estão na pauta. */
export function moedas(s: Sessao) {
  for (const p of pedidosDo(s, "oferecer")) {
    const t = s.ec.pauta.find((x) => x.lei === p.lei);
    if (!t) falha(`${p.lei} não está na pauta`);
    COMPRAS[p.moeda](s, p, t);
    t.ofertas.push({ moeda: p.moeda, partido: p.partido });
  }
}

/** Decreto: vale já; o Congresso confirma ou derruba depois. */
export function decretar(s: Sessao) {
  const { leis, congresso, turno } = s.e;
  const alcance = alcanceDoDecreto(congresso, leis, s.valores);
  for (const p of pedidosDo(s, "decretar")) {
    const lei = leis[p.lei];
    if (!lei) falha(`lei "${p.lei}" não existe`);
    if (!decretoAlcanca(lei, alcance))
      falha(`o Poder de decreto não alcança ${p.lei}`);
    const antes = s.valores[p.lei];
    if (antes === p.valor) continue;
    lancar(s, semVoto(p.lei, p.valor, "decreto"));
    s.ec.pauta = s.ec.pauta.filter((t) => t.lei !== p.lei);
    const vigentes = s.ec.decretos.length;
    s.ec.decretos.push({
      lei: p.lei,
      valor: p.valor,
      antes,
      confirmaEm: alcance === 3 ? null : turno + TURNOS_PARA_CONFIRMAR,
    });
    const lado = posicaoDaLei(lei, p.valor);
    registrar(s, {
      tipo: "decreto",
      turno,
      tamanho: "medio",
      sobre: p.lei,
      ...(lado ? { lado } : {}),
    });
    cansar(
      s,
      CANSACO_DO_DECRETO + CANSACO_EXTRA_POR_DECRETO_VIGENTE * vigentes,
    );
  }
}

/** Decretos que chegaram ao prazo: o Congresso confirma ou derruba. */
export function decretosVencidos(s: Sessao) {
  const { leis, turno } = s.e;
  s.ec.decretos = s.ec.decretos.filter((d) => {
    if (d.confirmaEm === null || d.confirmaEm > turno) return true;
    const lei = leis[d.lei];
    const v = votar(s.cenario, lei, d.antes, d.valor, "camara");
    if (!v.aprovada) {
      const volta =
        d.antes ?? (lei.forma === "continua" ? lei.faixa.min : d.valor);
      lancar(s, {
        ...v,
        valor: volta,
        origem: "decreto-derrubado",
        aprovada: true,
        muda_lei: true,
      });
      registrar(s, {
        tipo: "decreto-derrubado",
        turno,
        tamanho: "grande",
        sobre: d.lei,
        quem: partidosContra(v),
      });
    }
    return false;
  });
}

/** Promessas no prazo: o governo cumpriu ou quebrou. */
export function promessas(s: Sessao) {
  const { turno } = s.e;
  s.ec.promessas = s.ec.promessas.filter((p) => {
    if (p.prazo > turno) return true;
    const cumprida = s.valores[p.lei] === p.valor;
    if (!cumprida) mexer(s, p.partido, -TERMOMETRO_PROMESSA_QUEBRADA);
    registrar(s, {
      tipo: cumprida ? "promessa-cumprida" : "promessa-descumprida",
      turno,
      tamanho: cumprida ? "pequeno" : "grande",
      sobre: p.lei,
      quem: [p.partido],
    });
    return false;
  });
}
