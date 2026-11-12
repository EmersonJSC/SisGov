// A pauta: pedidos entram, cada casa vota até a carga, o Senado emenda e a
// lei emendada espera o carimbo do presidente.
import { CANSACO_DO_VETO, CARGA_PADRAO } from "./constantes";
import {
  aprovou,
  barrar,
  cansar,
  falha,
  lancar,
  partidosContra,
  pedidosDo,
  registrar,
  semVoto,
  type Sessao,
} from "./sessao";
import type { Casa, Tramitacao, Votacao } from "./tipos";
import { valorEmendado } from "./valores";
import { votar } from "./voto";

const casaDe = (t: Tramitacao): Casa =>
  t.casa === "senado" ? "senado" : "camara";

/** Leis novas entram na pauta; a que já estava é trocada. */
export function entrarNaPauta(s: Sessao) {
  const { turno } = s.e;
  for (const p of pedidosDo(s, "mudar_lei")) {
    if (s.valores[p.lei] === p.valor) continue;
    const barrada = s.ec.barradas.find((b) => b.lei === p.lei && b.ate > turno);
    if (barrada)
      falha(`${p.lei} foi derrotada e só volta no turno ${barrada.ate}`);
    s.ec.pauta = s.ec.pauta.filter((t) => t.lei !== p.lei);
    s.ec.pauta.push({
      lei: p.lei,
      valor: p.valor,
      casa: "camara",
      desde: turno,
      ofertas: [],
    });
    s.novas.push(p);
  }
}

/**
 * Sanção: a lei emendada que chegou à mesa no turno anterior. O presidente
 * assina, veta ou ignora; ignorar vale o que o país declara.
 */
export function sancao(s: Sessao) {
  const { turno, congresso } = s.e;
  const vetos = pedidosDo(s, "vetar");
  const assinados = pedidosDo(s, "assinar");
  const pendentes = s.ec.sancao.filter((t) => t.desde <= turno);
  s.ec.sancao = s.ec.sancao.filter((t) => t.desde > turno);
  for (const t of pendentes) {
    const veto = vetos.find((p) => p.lei === t.lei);
    const ignorou = !veto && !assinados.some((p) => p.lei === t.lei);
    const vetar =
      veto !== undefined || (ignorou && congresso.ignorar === "veto");
    registrar(s, {
      tipo: ignorou
        ? "papel-ignorado"
        : vetar
          ? "papel-vetado"
          : "papel-assinado",
      turno,
      tamanho: vetar ? "medio" : "pequeno",
      sobre: t.lei,
    });
    if (vetar) derrubarVeto(s, t, veto?.observacao);
    else aprovou(s, lancar(s, semVoto(t.lei, t.valor, "emenda")));
  }
}

/** O veto vai à Câmara, que o derruba com o quórum absoluto ou o mantém. */
function derrubarVeto(s: Sessao, t: Tramitacao, observacao?: string) {
  cansar(s, CANSACO_DO_VETO);
  const lei = { ...s.e.leis[t.lei], classe: "absoluta" as const };
  const v = votar(s.cenario, lei, s.valores[t.lei], t.valor, "camara");
  lancar(s, {
    ...v,
    origem: "derrubada-do-veto",
    muda_lei: v.aprovada,
    ...(observacao ? { observacao } : {}),
  });
  if (v.aprovada)
    registrar(s, {
      tipo: "veto-derrubado",
      turno: s.e.turno,
      tamanho: "grande",
      sobre: t.lei,
      quem: partidosContra(v),
    });
}

/** Cada casa vota até a carga; o que não coube espera. */
export function votarPauta(s: Sessao) {
  const carga = s.e.congresso.carga ?? CARGA_PADRAO;
  const usada: Record<Casa, number> = { camara: 0, senado: 0 };
  s.ec.pauta = s.ec.pauta.flatMap((t) => {
    const casa = casaDe(t);
    if (t.desde > s.e.turno || usada[casa] >= carga) return [t];
    usada[casa] += 1;
    const seguinte = votarUma(s, t, casa);
    return seguinte ? [seguinte] : [];
  });
}

/** Uma lei vota numa casa; devolve onde ela segue, ou null se acabou. */
function votarUma(s: Sessao, t: Tramitacao, casa: Casa): Tramitacao | null {
  const { turno, leis } = s.e;
  const volta = t.casa === "camara-volta";
  const v: Votacao = {
    ...votar(
      s.cenario,
      leis[t.lei],
      s.valores[t.lei],
      t.valor,
      casa,
      t.ofertas,
    ),
    origem: volta ? "volta" : "pedido",
  };
  if (!v.aprovada)
    return casa === "senado" && !volta ? emendar(s, t, v) : negar(s, v);
  if (volta) {
    lancar(s, v);
    s.ec.sancao.push({ ...t, desde: turno + 1 });
    return null;
  }
  if (casa === "camara" && s.e.congresso.senado) {
    lancar(s, v);
    return { ...t, casa: "senado", desde: turno + 1 };
  }
  aprovou(s, lancar(s, { ...v, muda_lei: true }));
  return null;
}

const negar = (s: Sessao, v: Votacao): null => {
  lancar(s, v);
  barrar(s, v);
  return null;
};

/** O Senado que reprova tenta um valor menor; se passa, a lei volta à Câmara. */
function emendar(s: Sessao, t: Tramitacao, v: Votacao): Tramitacao | null {
  const lei = s.e.leis[t.lei];
  const de = s.valores[t.lei];
  const emenda = valorEmendado(lei, de, t.valor);
  const meio =
    emenda === null
      ? null
      : votar(s.cenario, lei, de, emenda, "senado", t.ofertas);
  if (emenda === null || !meio?.aprovada) return negar(s, v);
  lancar(s, { ...v, exorbitante: false });
  lancar(s, { ...meio, origem: "emenda" });
  registrar(s, {
    tipo: "emenda",
    turno: s.e.turno,
    tamanho: "medio",
    sobre: t.lei,
  });
  return { ...t, valor: emenda, casa: "camara-volta", desde: s.e.turno + 1 };
}
