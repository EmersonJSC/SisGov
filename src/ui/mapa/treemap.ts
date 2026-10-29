/**
 * Treemap: as faixas do censo como retângulos, a área proporcional à parte
 * do país.
 *
 * O algoritmo é o "squarified" (Bruls, Huizing e van Wijk, 2000): enche uma
 * fileira enquanto isso melhora a proporção dos retângulos e fecha a fileira
 * quando piora. Serve para o quadrado não virar tira fina, que é o que faz
 * treemap ficar ilegível.
 */

export type Caixa = Readonly<{
  x: number;
  y: number;
  largura: number;
  altura: number;
}>;

/** Pior proporção largura/altura de uma fileira: 1 é quadrado perfeito. */
function piorProporcao(areas: readonly number[], lado: number): number {
  const soma = areas.reduce((t, a) => t + a, 0);
  const maior = Math.max(...areas);
  const menor = Math.min(...areas);
  const lado2 = lado * lado;
  const soma2 = soma * soma;
  return Math.max((lado2 * maior) / soma2, soma2 / (lado2 * menor));
}

/** Assenta uma fileira no lado menor da caixa e devolve o que sobrou dela. */
function assentar(
  areas: readonly number[],
  caixa: Caixa,
): { postos: Caixa[]; resto: Caixa } {
  const soma = areas.reduce((t, a) => t + a, 0);
  const deitada = caixa.largura >= caixa.altura;
  const espesso = soma / (deitada ? caixa.altura : caixa.largura);
  const postos: Caixa[] = [];
  let anda = 0;
  for (const area of areas) {
    const comprimento = area / espesso;
    postos.push(
      deitada
        ? {
            x: caixa.x,
            y: caixa.y + anda,
            largura: espesso,
            altura: comprimento,
          }
        : {
            x: caixa.x + anda,
            y: caixa.y,
            largura: comprimento,
            altura: espesso,
          },
    );
    anda += comprimento;
  }
  return {
    postos,
    resto: deitada
      ? {
          x: caixa.x + espesso,
          y: caixa.y,
          largura: caixa.largura - espesso,
          altura: caixa.altura,
        }
      : {
          x: caixa.x,
          y: caixa.y + espesso,
          largura: caixa.largura,
          altura: caixa.altura - espesso,
        },
  };
}

/**
 * Um retângulo por parte, na ordem em que vieram. As partes são frações do
 * todo (somam 1); a área de cada retângulo é essa fração da caixa.
 */
export function retangulos(
  partes: readonly number[],
  caixa: Caixa,
): readonly Caixa[] {
  if (partes.length === 0) return [];
  if (partes.length === 1) return [caixa];
  const total = caixa.largura * caixa.altura;
  const areas = partes.map((p) => p * total);
  const saida: Caixa[] = [];
  let sobra = caixa;
  let fileira: number[] = [];
  let i = 0;
  while (i < areas.length) {
    const lado = Math.min(sobra.largura, sobra.altura);
    const tentativa = [...fileira, areas[i]];
    // Enquanto a fileira melhora (ou está vazia), a próxima entra nela.
    if (
      fileira.length === 0 ||
      piorProporcao(tentativa, lado) <= piorProporcao(fileira, lado)
    ) {
      fileira = tentativa;
      i += 1;
      continue;
    }
    const { postos, resto } = assentar(fileira, sobra);
    saida.push(...postos);
    sobra = resto;
    fileira = [];
  }
  // A última fileira fecha a caixa: o resto inteiro é dela.
  saida.push(...assentar(fileira, sobra).postos);
  return saida;
}
