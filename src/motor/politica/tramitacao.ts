// Tramitação: o que o Congresso faz num turno com os pedidos do governo.
// Pauta, duas casas em sequência, sanção e veto, moedas, decreto, promessas,
// termômetro e paciência. Comportamento em politica.md.
import { novoFato, type Fato, type FatoNovo } from "../fatos";
import { posicaoDaLei, type Grupo, type TipoGrupo } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import type {
  Casa,
  Congresso,
  EstadoCongresso,
  Oferta,
  PedidoCongresso,
  PedidoMudarLei,
  Tramitacao,
  Votacao,
} from "./tipos";
import { votar, type Cenario } from "./voto";

export const TERMOMETRO_DA_BASE = 60;
export const TERMOMETRO_DA_OPOSICAO = 40;
const PACIENCIA_INICIAL = 70;
const MAXIMO = 100;
/** Termômetro abaixo do qual a base avisa que pode sair. */
export const TERMOMETRO_AMEACA = 30;
/** Termômetro abaixo do qual o partido sai da base. */
export const TERMOMETRO_SAIDA = 20;
/** Termômetro acima do qual a oposição aceita entrar na base. */
export const TERMOMETRO_CONVITE = 70;
/** O termômetro anda esta fração do caminho até a satisfação dos grupos. */
const PUXAO_DOS_GRUPOS = 0.25;
/** Pontos de termômetro por ponto de nota quando a lei passa. */
const REACAO_AO_VOTO = 5;
const REACAO_AO_VOTO_CONTRA = 6;
const TERMOMETRO_POR_MOEDA: Record<string, number> = {
  cargos: 8,
  emenda: 8,
  ministerio: 12,
  promessa: 4,
};
const TERMOMETRO_PROMESSA_QUEBRADA = 25;
/** Quanto cada compra ensina o partido a cobrar, e quanto ele esquece. */
const PRECO_POR_COMPRA = 0.15;
const PRECO_ESQUECIDO = 0.05;
const PACIENCIA_POR_TURNO = 3;
const PACIENCIA_SEM_LEI_NOVA = 3;
/** Leis do governo no turno acima das quais a casa se cansa. */
const LEIS_SEM_CANSAR = 2;
const CANSACO_POR_LEI = 2;
const CANSACO_DO_VETO = 8;
const CANSACO_DO_DECRETO = 8;
const CANSACO_EXTRA_POR_DECRETO_VIGENTE = 4;
const TURNOS_BARRADA = 2;
const TURNOS_PARA_CONFIRMAR = 2;
const PRAZO_DA_PROMESSA = 4;
const CARGA_PADRAO = 3;
/** Cargos e emendas que cada ponto da lei libera. */
const CARGOS_POR_FRACAO = 400;
const EMENDAS_POR_DEGRAU = 5;
/** Quanto de cada vez o governo cede na régua (fração do caminho). */
const CEDER_NA_REGUA = 1 / 3;
const METADE = 1 / 2;

const limitar = (v: number) => Math.max(0, Math.min(MAXIMO, v));
const casaDe = (t: Tramitacao): Casa =>
  t.casa === "senado" ? "senado" : "camara";

export function iniciarCongresso(
  congresso: Congresso,
  coligacao: string[],
): EstadoCongresso {
  const termometro: Record<string, number> = {};
  for (const p of congresso.partidos)
    termometro[p.id] =
      p.id === congresso.governo
        ? MAXIMO
        : coligacao.includes(p.id)
          ? TERMOMETRO_DA_BASE
          : TERMOMETRO_DA_OPOSICAO;
  return {
    termometro,
    preco: {},
    paciencia: { camara: PACIENCIA_INICIAL, senado: PACIENCIA_INICIAL },
    pauta: [],
    sancao: [],
    barradas: [],
    promessas: [],
    decretos: [],
    cargosUsados: 0,
    emendasUsadas: 0,
  };
}

/** Degrau do Poder de decreto: 0 nenhum, 1 verba e preço, 2 amplo, 3 sem confirmar. */
export function alcanceDoDecreto(
  congresso: Congresso,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): 0 | 1 | 2 | 3 {
  const id = congresso.leis?.decreto;
  const lei = id ? leis[id] : undefined;
  if (!lei || lei.forma !== "opcoes") return 0;
  const i = lei.opcoes.findIndex((o) => o.id === valores[lei.id]);
  const ultimo = lei.opcoes.length - 1;
  if (i <= 0) return 0;
  if (i === ultimo) return 3;
  return i <= METADE * ultimo ? (i === 1 ? 1 : 2) : 2;
}

/** Decreto alcança esta lei neste degrau? */
export function decretoAlcanca(lei: Lei, alcance: 0 | 1 | 2 | 3): boolean {
  if (alcance === 0) return false;
  if (alcance === 3) return true;
  if (alcance === 1) return lei.forma === "continua" && lei.conta === "gasto";
  const classe = lei.classe ?? "comum";
  return classe === "comum";
}

function reservaDeCargos(
  c: Congresso,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): number {
  const id = c.leis?.cargos;
  const v = id && leis[id] ? valores[id] : undefined;
  return typeof v === "number" ? Math.round(v * CARGOS_POR_FRACAO) : 0;
}

function reservaDeEmendas(
  c: Congresso,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): number {
  const id = c.leis?.emendas;
  const lei = id ? leis[id] : undefined;
  if (!lei || lei.forma !== "opcoes") return 0;
  return (
    Math.max(
      0,
      lei.opcoes.findIndex((o) => o.id === valores[lei.id]),
    ) * EMENDAS_POR_DEGRAU
  );
}

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
  const casa = existente ? casaDe(existente) : "camara";
  const ofertas = [...(existente?.ofertas ?? []), ...ofertasNovas];
  const pedido = ofertas.some((o) => o.moeda === "ceder")
    ? (valorCedido(def, e.valores[lei], valor) ?? valor)
    : valor;
  const v = votar(cenarioDe(e), def, e.valores[lei], pedido, casa, ofertas);
  return { ...v, origem: "pedido" };
}

/** Valor depois de o governo ceder na régua; null se a lei não tem régua. */
export function valorCedido(
  lei: Lei,
  de: ValorLei | undefined,
  pedido: ValorLei,
): ValorLei | null {
  if (lei.forma !== "continua") return null;
  const antes = (de as number | undefined) ?? lei.faixa.min;
  const bruto =
    (pedido as number) - ((pedido as number) - antes) * CEDER_NA_REGUA;
  const passos = Math.round((bruto - lei.faixa.min) / lei.passo);
  return lei.faixa.min + passos * lei.passo;
}

/** Valor a meio caminho entre o atual e o pedido (emenda do Senado). */
function valorEmendado(
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): ValorLei | null {
  if (lei.forma !== "continua") return null;
  const antes = (de as number | undefined) ?? lei.faixa.min;
  const meio = antes + ((para as number) - antes) * METADE;
  const passos = Math.round((meio - lei.faixa.min) / lei.passo);
  const valor = lei.faixa.min + passos * lei.passo;
  return valor === antes || valor === para ? null : valor;
}

export function tramitar(e: EntradaTramitar): SaidaTramitar {
  const { congresso, leis, turno } = e;
  const ec: EstadoCongresso = structuredClone(e.estado);
  const valores = { ...e.valores };
  const votacoes: Votacao[] = [];
  const fatos: Fato[] = [];
  const termometro: Record<string, number> = {};
  const cansaco: Record<Casa, number> = { camara: 0, senado: 0 };
  let coligacao = [...e.coligacao];
  const senado = Boolean(congresso.senado);
  const cenario = cenarioDe(e);
  const fato = (f: FatoNovo) => fatos.push(novoFato(f));
  const mexer = (p: string, v: number) => {
    termometro[p] = (termometro[p] ?? 0) + v;
  };
  const posicao = (id: string, valor: ValorLei) =>
    posicaoDaLei(leis[id], valor);
  const muda = (v: Votacao): Votacao => {
    valores[v.lei] = v.valor;
    return { ...v, muda_lei: true };
  };
  const nomeContra = (v: Votacao) =>
    Object.keys(v.votos).filter((p) => v.votos[p] === "nao");
  const aprovou = (v: Votacao) => {
    const lado = posicao(v.lei, v.valor);
    const contra = nomeContra(v);
    fato({
      tipo: "lei-aprovada",
      turno,
      tamanho: "medio",
      sobre: v.lei,
      ...(contra.length ? { quem: contra } : {}),
      ...(lado ? { lado } : {}),
    });
    for (const [p, nota] of Object.entries(v.notas ?? {}))
      if (p !== congresso.governo)
        mexer(p, nota * (nota >= 0 ? REACAO_AO_VOTO : REACAO_AO_VOTO_CONTRA));
  };
  const barrar = (v: Votacao) => {
    ec.barradas = [
      ...ec.barradas.filter((b) => b.lei !== v.lei),
      { lei: v.lei, ate: turno + TURNOS_BARRADA },
    ];
    const contra = nomeContra(v);
    fato({
      tipo: "lei-rejeitada",
      turno,
      tamanho: "pequeno",
      sobre: v.lei,
      ...(contra.length ? { quem: contra } : {}),
    });
  };

  // 1. Convites: a oposição com termômetro alto entra na base.
  for (const p of e.pedidos) {
    if (p.tipo !== "convidar") continue;
    if (!congresso.partidos.some((x) => x.id === p.partido))
      throw new Error(`pedido: partido "${p.partido}" não existe`);
    if (coligacao.includes(p.partido))
      throw new Error(`pedido: ${p.partido} já está na base`);
    if ((ec.termometro[p.partido] ?? 0) <= TERMOMETRO_CONVITE)
      throw new Error(
        `pedido: ${p.partido} só aceita entrar na base com termômetro acima de ${TERMOMETRO_CONVITE}`,
      );
    coligacao = [...coligacao, p.partido];
    fato({
      tipo: "partido-entrou-na-base",
      turno,
      tamanho: "medio",
      quem: [p.partido],
    });
  }

  // 2. Leis novas entram na pauta (a que já estava é trocada).
  const novas: PedidoMudarLei[] = [];
  for (const p of e.pedidos) {
    if (p.tipo !== "mudar_lei" || valores[p.lei] === p.valor) continue;
    const barrada = ec.barradas.find((b) => b.lei === p.lei && b.ate > turno);
    if (barrada)
      throw new Error(
        `pedido: ${p.lei} foi derrotada e só volta no turno ${barrada.ate}`,
      );
    ec.pauta = ec.pauta.filter((t) => t.lei !== p.lei);
    ec.pauta.push({
      lei: p.lei,
      valor: p.valor,
      casa: "camara",
      desde: turno,
      ofertas: [],
    });
    novas.push(p);
  }

  // 3. Moedas.
  for (const p of e.pedidos) {
    if (p.tipo !== "oferecer") continue;
    const t = ec.pauta.find((x) => x.lei === p.lei);
    if (!t) throw new Error(`pedido: ${p.lei} não está na pauta`);
    const oferta: Oferta = { moeda: p.moeda, partido: p.partido };
    if (p.moeda === "ceder") {
      const cedido = valorCedido(leis[p.lei], valores[p.lei], t.valor);
      if (cedido === null)
        throw new Error(`pedido: ${p.lei} não tem régua para ceder`);
      t.valor = cedido;
      t.ofertas.push(oferta);
      continue;
    }
    if (p.moeda === "ministerio")
      throw new Error("pedido: ministério depende do passo Governo");
    if (!p.partido || !congresso.partidos.some((x) => x.id === p.partido))
      throw new Error(`pedido: partido "${p.partido}" não existe`);
    if (p.moeda === "cargos") {
      if (ec.cargosUsados >= reservaDeCargos(congresso, leis, valores))
        throw new Error("pedido: acabou a reserva de cargos de livre nomeação");
      ec.cargosUsados += 1;
    }
    if (p.moeda === "emenda") {
      if (ec.emendasUsadas >= reservaDeEmendas(congresso, leis, valores))
        throw new Error("pedido: acabou a reserva de emendas");
      ec.emendasUsadas += 1;
    }
    if (p.moeda === "promessa") {
      if (!p.promessa || !leis[p.promessa.lei])
        throw new Error("pedido: promessa precisa de uma lei existente");
      ec.promessas.push({
        partido: p.partido,
        lei: p.promessa.lei,
        valor: p.promessa.valor,
        prazo: turno + PRAZO_DA_PROMESSA,
      });
    }
    t.ofertas.push(oferta);
    mexer(p.partido, TERMOMETRO_POR_MOEDA[p.moeda] ?? 0);
    ec.preco[p.partido] = (ec.preco[p.partido] ?? 0) + PRECO_POR_COMPRA;
  }

  // 4. Decreto: vale já; o Congresso confirma ou derruba depois.
  const alcance = alcanceDoDecreto(congresso, leis, valores);
  for (const p of e.pedidos) {
    if (p.tipo !== "decretar") continue;
    const lei = leis[p.lei];
    if (!lei) throw new Error(`pedido: lei "${p.lei}" não existe`);
    if (!decretoAlcanca(lei, alcance))
      throw new Error(`pedido: o Poder de decreto não alcança ${p.lei}`);
    if (valores[p.lei] === p.valor) continue;
    const antes = valores[p.lei];
    votacoes.push(
      muda({
        lei: p.lei,
        valor: p.valor,
        exorbitante: false,
        votos: {},
        sim: 0,
        nao: 0,
        aprovada: true,
        muda_lei: true,
        origem: "decreto",
      }),
    );
    ec.pauta = ec.pauta.filter((t) => t.lei !== p.lei);
    const vigentes = ec.decretos.length;
    ec.decretos.push({
      lei: p.lei,
      valor: p.valor,
      antes,
      confirmaEm: alcance === 3 ? null : turno + TURNOS_PARA_CONFIRMAR,
    });
    fato({
      tipo: "decreto",
      turno,
      tamanho: "medio",
      sobre: p.lei,
      ...(posicao(p.lei, p.valor) ? { lado: posicao(p.lei, p.valor)! } : {}),
    });
    const peso =
      CANSACO_DO_DECRETO + CANSACO_EXTRA_POR_DECRETO_VIGENTE * vigentes;
    cansaco.camara += peso;
    cansaco.senado += peso;
  }

  // 5. Decretos que chegaram ao prazo: o Congresso confirma ou derruba.
  ec.decretos = ec.decretos.filter((d) => {
    if (d.confirmaEm === null || d.confirmaEm > turno) return true;
    const lei = leis[d.lei];
    const v = votar(cenario, lei, d.antes, d.valor, "camara");
    if (v.aprovada) return false;
    votacoes.push(
      muda({
        ...v,
        valor: d.antes ?? (lei.forma === "continua" ? lei.faixa.min : d.valor),
        origem: "decreto-derrubado",
        aprovada: true,
      }),
    );
    fato({
      tipo: "decreto-derrubado",
      turno,
      tamanho: "grande",
      sobre: d.lei,
      quem: nomeContra(v),
    });
    return false;
  });

  // 6. Sanção: a lei emendada que chegou à mesa no turno anterior.
  const vetos = e.pedidos.filter((p) => p.tipo === "vetar");
  const pendentes = ec.sancao.filter((t) => t.desde <= turno);
  ec.sancao = ec.sancao.filter((t) => t.desde > turno);
  for (const t of pendentes) {
    const veto = vetos.find((p) => p.lei === t.lei);
    const lei = leis[t.lei];
    if (!veto) {
      votacoes.push(
        muda({
          lei: t.lei,
          valor: t.valor,
          exorbitante: false,
          votos: {},
          sim: 0,
          nao: 0,
          aprovada: true,
          muda_lei: true,
          origem: "emenda",
        }),
      );
      aprovou(votacoes[votacoes.length - 1]);
      continue;
    }
    cansaco.camara += CANSACO_DO_VETO;
    cansaco.senado += CANSACO_DO_VETO;
    const v = votar(
      cenario,
      { ...lei, classe: "absoluta" },
      valores[t.lei],
      t.valor,
      "camara",
    );
    const nova: Votacao = {
      ...v,
      origem: "derrubada-do-veto",
      ...(veto.observacao ? { observacao: veto.observacao } : {}),
    };
    if (v.aprovada) {
      votacoes.push(muda(nova));
      fato({
        tipo: "veto-derrubado",
        turno,
        tamanho: "grande",
        sobre: t.lei,
        quem: nomeContra(v),
      });
    } else {
      votacoes.push(nova);
      fato({ tipo: "veto", turno, tamanho: "medio", sobre: t.lei });
    }
  }

  // 7. Pauta: cada casa vota até a carga; o resto espera.
  const carga = congresso.carga ?? CARGA_PADRAO;
  const usada: Record<Casa, number> = { camara: 0, senado: 0 };
  const seguem: Tramitacao[] = [];
  for (const t of ec.pauta) {
    const casa = casaDe(t);
    if (t.desde > turno || usada[casa] >= carga) {
      seguem.push(t);
      continue;
    }
    usada[casa] += 1;
    const lei = leis[t.lei];
    const de = valores[t.lei];
    const origem =
      t.casa === "camara-volta"
        ? "volta"
        : t.desde === turno && novas.some((n) => n.lei === t.lei)
          ? "pedido"
          : "pedido";
    const v: Votacao = {
      ...votar(cenario, lei, de, t.valor, casa, t.ofertas),
      origem,
    };
    const ultima = casa === "senado" || !senado;
    if (t.casa === "camara-volta") {
      if (v.aprovada) {
        votacoes.push(v);
        ec.sancao.push({ ...t, desde: turno + 1 });
      } else {
        votacoes.push(v);
        barrar(v);
      }
      continue;
    }
    if (v.aprovada && !ultima) {
      votacoes.push(v);
      seguem.push({ ...t, casa: "senado", desde: turno + 1 });
    } else if (v.aprovada) {
      const final = muda(v);
      votacoes.push(final);
      aprovou(final);
    } else if (casa === "senado") {
      const emenda = valorEmendado(lei, de, t.valor);
      const meio =
        emenda === null
          ? null
          : votar(cenario, lei, de, emenda, "senado", t.ofertas);
      if (emenda !== null && meio?.aprovada) {
        votacoes.push({ ...v, exorbitante: false });
        votacoes.push({ ...meio, origem: "emenda" });
        fato({ tipo: "emenda", turno, tamanho: "medio", sobre: t.lei });
        seguem.push({
          ...t,
          valor: emenda,
          casa: "camara-volta",
          desde: turno + 1,
        });
      } else {
        votacoes.push(v);
        barrar(v);
      }
    } else {
      votacoes.push(v);
      barrar(v);
    }
  }
  ec.pauta = seguem;

  // 8. Promessas: no prazo, o governo cumpriu ou quebrou.
  ec.promessas = ec.promessas.filter((p) => {
    if (p.prazo > turno) return true;
    const valor = valores[p.lei];
    const cumprida = valor === p.valor;
    if (!cumprida) mexer(p.partido, -TERMOMETRO_PROMESSA_QUEBRADA);
    fato({
      tipo: cumprida ? "promessa-cumprida" : "promessa-descumprida",
      turno,
      tamanho: cumprida ? "pequeno" : "grande",
      sobre: p.lei,
      quem: [p.partido],
    });
    return false;
  });

  // 9. Paciência: lei demais cansa; a casa se recupera um pouco por turno.
  const leisDoGoverno = novas.length;
  const extra = Math.max(0, leisDoGoverno - LEIS_SEM_CANSAR) * CANSACO_POR_LEI;
  const folga = leisDoGoverno === 0 ? PACIENCIA_SEM_LEI_NOVA : 0;
  for (const casa of ["camara", "senado"] as const)
    ec.paciencia[casa] = limitar(
      ec.paciencia[casa] + PACIENCIA_POR_TURNO + folga - extra - cansaco[casa],
    );
  for (const [p, v] of Object.entries(termometro))
    ec.termometro[p] = limitar((ec.termometro[p] ?? 0) + v);
  for (const p of Object.keys(ec.preco))
    ec.preco[p] = Math.max(0, ec.preco[p] - PRECO_ESQUECIDO);

  return { votacoes, estado: ec, fatos, coligacao };
}

/**
 * A base olha os grupos dos partidos: o termômetro anda em direção à
 * satisfação deles; abaixo de 30 o partido avisa, abaixo de 20 sai.
 */
export function esfriarEEsquentar(
  congresso: Congresso,
  ec: EstadoCongresso,
  coligacao: string[],
  satisfacao: (partido: string) => number,
  turno: number,
): { estado: EstadoCongresso; coligacao: string[]; fatos: Fato[] } {
  const termometro = { ...ec.termometro };
  const fatos: Fato[] = [];
  for (const p of congresso.partidos) {
    if (p.id === congresso.governo) continue;
    const antes = termometro[p.id] ?? TERMOMETRO_DA_OPOSICAO;
    termometro[p.id] = limitar(
      antes + PUXAO_DOS_GRUPOS * (satisfacao(p.id) - antes),
    );
    if (
      coligacao.includes(p.id) &&
      termometro[p.id] < TERMOMETRO_AMEACA &&
      antes >= TERMOMETRO_AMEACA
    )
      fatos.push(
        novoFato({
          tipo: "partido-ameaca-sair",
          turno,
          tamanho: "medio",
          quem: [p.id],
        }),
      );
  }
  return {
    estado: { ...ec, termometro },
    coligacao: coligacao.filter(
      (id) =>
        id === congresso.governo || (termometro[id] ?? 0) >= TERMOMETRO_SAIDA,
    ),
    fatos,
  };
}
