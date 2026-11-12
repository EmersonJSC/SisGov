// Relação do governo com os partidos e com as casas: termômetro, convites,
// paciência e preço.
import { novoFato, type Fato } from "../fatos";
import {
  CANSACO_POR_LEI,
  LEIS_SEM_CANSAR,
  MAXIMO,
  PACIENCIA_INICIAL,
  PACIENCIA_POR_TURNO,
  PACIENCIA_SEM_LEI_NOVA,
  PRECO_ESQUECIDO,
  PUXAO_DOS_GRUPOS,
  TERMOMETRO_AMEACA,
  TERMOMETRO_CONVITE,
  TERMOMETRO_DA_BASE,
  TERMOMETRO_DA_OPOSICAO,
  TERMOMETRO_SAIDA,
  limitar,
} from "./constantes";
import { falha, pedidosDo, registrar, type Sessao } from "./sessao";
import type { Congresso, EstadoCongresso } from "./tipos";

export function iniciarCongresso(
  congresso: Congresso,
  coligacao: string[],
): EstadoCongresso {
  const inicial = (id: string) => {
    if (id === congresso.governo) return MAXIMO;
    return coligacao.includes(id) ? TERMOMETRO_DA_BASE : TERMOMETRO_DA_OPOSICAO;
  };
  return {
    termometro: Object.fromEntries(
      congresso.partidos.map((p) => [p.id, inicial(p.id)]),
    ),
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

/** Convites: a oposição com termômetro alto entra na base. */
export function convites(s: Sessao) {
  for (const { partido } of pedidosDo(s, "convidar")) {
    if (!s.e.congresso.partidos.some((p) => p.id === partido))
      falha(`partido "${partido}" não existe`);
    if (s.coligacao.includes(partido)) falha(`${partido} já está na base`);
    if ((s.ec.termometro[partido] ?? 0) <= TERMOMETRO_CONVITE)
      falha(
        `${partido} só aceita entrar na base com termômetro acima de ${TERMOMETRO_CONVITE}`,
      );
    s.coligacao.push(partido);
    registrar(s, {
      tipo: "partido-entrou-na-base",
      turno: s.e.turno,
      tamanho: "medio",
      quem: [partido],
    });
  }
}

/**
 * Fim do turno: lei demais cansa as casas, que se recuperam um pouco; o
 * termômetro recebe as mudanças do turno e os partidos esquecem o preço.
 */
export function descansar(s: Sessao) {
  const leis = s.novas.length;
  const cansaco = Math.max(0, leis - LEIS_SEM_CANSAR) * CANSACO_POR_LEI;
  const folga = leis === 0 ? PACIENCIA_SEM_LEI_NOVA : 0;
  for (const casa of ["camara", "senado"] as const)
    s.ec.paciencia[casa] = limitar(
      s.ec.paciencia[casa] +
        PACIENCIA_POR_TURNO +
        folga -
        cansaco -
        s.cansaco[casa],
    );
  for (const [p, delta] of Object.entries(s.termometro))
    s.ec.termometro[p] = limitar((s.ec.termometro[p] ?? 0) + delta);
  for (const p of Object.keys(s.ec.preco))
    s.ec.preco[p] = Math.max(0, s.ec.preco[p] - PRECO_ESQUECIDO);
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
  for (const p of congresso.partidos.filter(
    (x) => x.id !== congresso.governo,
  )) {
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
  const fica = (id: string) =>
    id === congresso.governo || (termometro[id] ?? 0) >= TERMOMETRO_SAIDA;
  return {
    estado: { ...ec, termometro },
    coligacao: coligacao.filter(fica),
    fatos,
  };
}
