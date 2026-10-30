/**
 * Carisma vivo (M8.2). O carisma que o presidente tem na ficha é o de quando
 * ele chegou; no cargo ele sobe e desce com o que o governo faz: governo bem
 * visto e promessa cumprida dão brilho, governo mal visto e promessa quebrada
 * apagam. O desvio anda devagar (inércia) atrás de um alvo e fica entre
 * ±TETO. Os ataques da mídia entram aqui quando a M13 existir.
 */
import { TETO_DA_PROMESSA } from "./promessa";

/** Quanto o carisma da ficha (0 a 3) pode subir ou descer no cargo. */
export const TETO_DO_CARISMA = 1.5;
/** Parte da distância até o alvo que o desvio anda por turno. */
export const INERCIA_DO_CARISMA = 0.2;
/** Satisfação média, fora de 50, que leva o alvo ao teto. */
const ALCANCE_DA_SATISFACAO = 30;
/** Parte do teto que a promessa quebrada no máximo tira do alvo. */
const PESO_DA_PROMESSA_NO_CARISMA = 0.5;

const entre = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));

/** Para onde o desvio é puxado: a satisfação média e a promessa quebrada. */
export function alvoDoCarisma(
  satisfacaoMedia: number,
  perdaDaPromessaNoTurno: number,
): number {
  const bem = entre((satisfacaoMedia - 50) / ALCANCE_DA_SATISFACAO, -1, 1);
  const quebrada = perdaDaPromessaNoTurno / TETO_DA_PROMESSA;
  return entre(
    TETO_DO_CARISMA * (bem - PESO_DA_PROMESSA_NO_CARISMA * quebrada),
    -TETO_DO_CARISMA,
    TETO_DO_CARISMA,
  );
}

/** O desvio do turno seguinte. */
export function andarCarisma(
  atual: number,
  satisfacaoMedia: number,
  perdaDaPromessaNoTurno: number,
): number {
  const alvo = alvoDoCarisma(satisfacaoMedia, perdaDaPromessaNoTurno);
  return entre(
    atual + INERCIA_DO_CARISMA * (alvo - atual),
    -TETO_DO_CARISMA,
    TETO_DO_CARISMA,
  );
}

/** O carisma de agora: o da ficha mais o desvio, de 0 a 3. */
export function carismaVivo(ficha: number, desvio = 0): number {
  return entre(ficha + desvio, 0, 3);
}
