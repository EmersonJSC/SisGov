// Nome do programa: o do país, ou um gerado pelos moldes e pelas quatro palavras.
import type { Programa, RegrasProgramas } from "./tipos";

/** Soma dos códigos do id: escolhe sempre o mesmo molde para o mesmo programa. */
const escolha = (id: string): number =>
  [...id].reduce((soma, c) => soma + c.charCodeAt(0), 0);

const maiuscula = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

/** Troca {tema}, {bem}, {mal} e {publico} do molde pelas palavras do programa. */
export function preencher(molde: string, programa: Programa): string {
  const { palavras } = programa;
  const texto = molde.replace(
    /\{(tema|bem|mal|publico)\}/g,
    (_, chave: keyof typeof palavras) => palavras[chave],
  );
  return maiuscula(texto);
}

export function nomeDoPrograma(
  regras: RegrasProgramas,
  programa: Programa,
): string {
  const proprio = regras.nomesDoPais[programa.id];
  if (proprio) return proprio;
  const { moldes } = regras;
  if (moldes.length === 0) return programa.nome;
  return preencher(moldes[escolha(programa.id) % moldes.length], programa);
}
