// Números do Congresso em turno (tramitação). Pesos do voto ficam em voto.ts.
export const MAXIMO = 100;
export const limitar = (v: number) => Math.max(0, Math.min(MAXIMO, v));

export const TERMOMETRO_DA_BASE = 60;
export const TERMOMETRO_DA_OPOSICAO = 40;
/** Abaixo disto a base avisa que pode sair. */
export const TERMOMETRO_AMEACA = 30;
/** Abaixo disto o partido sai da base. */
export const TERMOMETRO_SAIDA = 20;
/** Acima disto a oposição aceita entrar na base. */
export const TERMOMETRO_CONVITE = 70;
/** O termômetro anda esta fração do caminho até a satisfação dos grupos. */
export const PUXAO_DOS_GRUPOS = 0.25;
/** Pontos de termômetro por ponto de nota quando a lei passa. */
export const REACAO_AO_VOTO = 5;
export const REACAO_AO_VOTO_CONTRA = 6;
export const TERMOMETRO_POR_MOEDA: Record<string, number> = {
  cargos: 8,
  emenda: 8,
  ministerio: 12,
  promessa: 4,
};
export const TERMOMETRO_PROMESSA_QUEBRADA = 25;
/** O partido que perdeu um ministério perde este tanto de termômetro. */
export const RESSENTIMENTO = 8;

/** Quanto cada compra ensina o partido a cobrar, e quanto ele esquece. */
export const PRECO_POR_COMPRA = 0.15;
export const PRECO_ESQUECIDO = 0.05;

export const PACIENCIA_INICIAL = 70;
export const PACIENCIA_POR_TURNO = 3;
export const PACIENCIA_SEM_LEI_NOVA = 3;
/** Leis do governo no turno acima das quais a casa se cansa. */
export const LEIS_SEM_CANSAR = 2;
export const CANSACO_POR_LEI = 2;
export const CANSACO_DO_VETO = 8;
export const CANSACO_DO_DECRETO = 8;
export const CANSACO_EXTRA_POR_DECRETO_VIGENTE = 4;

export const TURNOS_BARRADA = 2;
export const TURNOS_PARA_CONFIRMAR = 2;
export const PRAZO_DA_PROMESSA = 4;
export const CARGA_PADRAO = 3;
/** Cargos e emendas que cada ponto da lei libera. */
export const CARGOS_POR_FRACAO = 400;
export const EMENDAS_POR_DEGRAU = 5;
/** Quanto de cada vez o governo cede na régua, e onde o Senado emenda. */
export const CEDER_NA_REGUA = 1 / 3;
export const EMENDA_A_MEIO_CAMINHO = 1 / 2;
