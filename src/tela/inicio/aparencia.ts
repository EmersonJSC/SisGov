// Retrato de cada pessoa pelo DiceBear (estilo Notionists, desenho CC0, código
// MIT). O id é a semente: a mesma pessoa tem sempre o mesmo rosto. O estilo não
// tem tom de pele, cor de cabelo nem cabelo por sexo; só barba (que ela não
// tem) e a cor de fundo, da paleta da mesa, são decididas aqui.
import { createAvatar } from "@dicebear/core";
import * as notionists from "@dicebear/notionists";
import type { PessoaDaLista } from "../../partida";

/** Fundos da paleta da mesa: amarelo, papel, azul, vermelho e verde. */
const FUNDOS = ["f5b61a", "efe4cc", "1f4f8a", "d6372a", "2f8060"];
const CHANCE_DE_BARBA = 30;
const CHANCE_DE_OCULOS = 30;

const cache = new Map<string, string>();

function numero(id: string): number {
  return [...id].reduce(
    (h, c) => (Math.imul(h, 33) + c.charCodeAt(0)) >>> 0,
    5381,
  );
}

/** O retrato como imagem SVG embutida (data URI), pronta para `<img src>`. */
export function retratoDaPessoa(
  p: Pick<PessoaDaLista, "id" | "sexo">,
): string {
  const guardado = cache.get(p.id);
  if (guardado) return guardado;
  const uri = createAvatar(notionists, {
    seed: p.id,
    backgroundColor: [FUNDOS[numero(p.id) % FUNDOS.length]],
    beardProbability: p.sexo === "f" ? 0 : CHANCE_DE_BARBA,
    glassesProbability: CHANCE_DE_OCULOS,
  }).toDataUri();
  cache.set(p.id, uri);
  return uri;
}
