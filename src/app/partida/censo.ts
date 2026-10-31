import type { ResolvedPackage } from "../../engine";
import { congressoVivo } from "../../game/congresso/vivo";
import { eleitoradoDoInicio } from "./bolso";
import type { MemoriaDaPopulacao } from "../../game/congresso/memoria";
import { eleitoradoComRendaViva } from "../../game/congresso/rendaViva";
import { eleitoradoComFaixasVivas } from "../../game/congresso/faixasVivas";
import type { VisaoCensoAtributo } from "./tipos";

/**
 * O censo do país (Grupos, camada A): os perfis do eleitorado repartidos por
 * cada atributo.
 *
 * É leitura, não simulação. Os perfis são conteúdo fixo — 2.090 linhas com
 * um peso e um valor por atributo — e contar todos custa ~7 ms, contra ~6 s
 * de um turno. Por isso o censo é recalculado à vontade, sem guardar estado.
 *
 * Os perfis moram no manifesto do congresso porque foi ele quem precisou
 * deles primeiro (eleger as bancadas). Se um terceiro dono aparecer, vale
 * promovê-los a um manifesto próprio — hoje seria mudança sem ganho.
 */
export function censoDoPais(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>> = {},
  valoresIniciais?: Readonly<Record<string, number>>,
  memoria?: MemoriaDaPopulacao,
): readonly VisaoCensoAtributo[] {
  const fixo = content.manifest.congresso;
  if (!fixo) return [];
  // O eleitorado de agora: o desemprego e a informalidade do motor movem o
  // peso dos perfis (camada C), e o desempregado é uma faixa de ocupação.
  // A renda se move pela sobra desde o turno 0 (`valoresIniciais`).
  // Os valores e a religião se movem pela pressão do país, também desde o turno 0.
  const eleitorado = eleitoradoComFaixasVivas(
    eleitoradoComRendaViva(content, valores, valoresIniciais, memoria),
    valores,
    valoresIniciais,
  );
  const congresso = eleitorado?.manifesto ?? congressoVivo(fixo, valores);
  const {
    atributos,
    valores: valoresDoPerfil,
    perfis,
    segmentoDe,
    rotulos,
  } = congresso;
  const bolsos = eleitorado?.bolsos ?? [];
  const antes = partesDoInicio(content, valores);
  return atributos.map((atributo, i) => {
    const soma = new Map<string, number>();
    // O bolso da faixa é a média do bolso de quem está nela, pesada pelo
    // tamanho de cada perfil.
    const bolso = new Map<string, { ganha: number; paga: number }>();
    for (const [j, perfil] of perfis.entries()) {
      const valor = valoresDoPerfil[atributo]?.[perfil[i + 1]];
      if (valor === undefined) continue;
      soma.set(valor, (soma.get(valor) ?? 0) + perfil[0]);
      const b = bolsos[j];
      if (!b) continue;
      const acc = bolso.get(valor) ?? { ganha: 0, paga: 0 };
      acc.ganha += perfil[0] * b.ganha;
      acc.paga += perfil[0] * b.paga;
      bolso.set(valor, acc);
    }
    const total = [...soma.values()].reduce((t, p) => t + p, 0);
    return {
      id: atributo,
      nome: rotulos?.atributos[atributo] ?? atributo,
      faixas: [...soma]
        // A maior primeiro: é o país que ela descreve.
        .sort(([, a], [, b]) => b - a)
        .map(([id, peso]) => {
          const grupo = segmentoDe[`${atributo}=${id}`];
          const b = bolso.get(id);
          const medio =
            b && peso > 0
              ? {
                  ganha: b.ganha / peso,
                  paga: b.paga / peso,
                  sobra: (b.ganha - b.paga) / peso,
                }
              : undefined;
          const parte = total > 0 ? peso / total : 0;
          const variacao = antes
            ? (parte - (antes.get(`${atributo}=${id}`) ?? 0)) * PONTOS
            : 0;
          return {
            id,
            nome: rotulos?.faixas[`${atributo}=${id}`] ?? id,
            /** Parte do eleitorado, de 0 a 1. */
            parte,
            // Em décimos de ponto: abaixo disso é a mesma foto, não movimento.
            ...(Math.abs(variacao) >= MENOR_VARIACAO ? { variacao } : {}),
            // Faixa sem grupo existe na simulação e não tem bolha na tela:
            // nenhuma lei a faz mexer à vista do jogador.
            ...(grupo ? { grupo } : {}),
            ...(medio ? { bolso: medio } : {}),
          };
        }),
    };
  });
}

/** Parte do eleitorado vira ponto de eleitorado. */
const PONTOS = 100;
/** Variação menor que um décimo de ponto não aparece. */
const MENOR_VARIACAO = 0.1;

/**
 * A parte de cada faixa (`atributo=valor`) no país do início da partida: o
 * mesmo eleitorado vivo com o desemprego e a informalidade que os perfis
 * representam (os do país). Sem esses números no país, não há de onde medir e
 * o censo não fala de movimento.
 */
function partesDoInicio(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
): ReadonlyMap<string, number> | undefined {
  const inicio = eleitoradoDoInicio(content, valores);
  if (!inicio) return undefined;
  const soma = new Map<string, number>();
  for (const perfil of inicio.perfis)
    inicio.atributos.forEach((atributo, i) => {
      const valor = inicio.valores[atributo]?.[perfil[i + 1]];
      if (valor === undefined) return;
      const chave = `${atributo}=${valor}`;
      soma.set(chave, (soma.get(chave) ?? 0) + perfil[0]);
    });
  const total = inicio.perfis.reduce((t, p) => t + p[0], 0);
  return new Map([...soma].map(([chave, peso]) => [chave, peso / total]));
}
