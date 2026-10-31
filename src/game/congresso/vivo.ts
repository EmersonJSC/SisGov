import type { CongressManifest } from "../../engine/model/contentTypes";

/**
 * O eleitorado vivo (População, camada C): o desemprego e a informalidade do
 * motor movem o peso dos perfis.
 *
 * Não guarda estado. O motor já suaviza `desemprego` e `informalidade`, e a
 * camada os segue sem atraso (mecânica 2.3: o agregado manda, o perfil
 * divide), então o eleitorado de um turno sai só do conteúdo e dos valores
 * daquele turno. Por isso salvar e carregar a partida não muda nada.
 */

type Linha = readonly number[];
type Valores = Readonly<Record<string, number>>;

/** Desemprego e informalidade chegam em porcentagem do motor. */
const POR_CENTO = 100;
/** Multiplicador ausente da tabela vale 1, como na renda do bolso. */
const SEM_TABELA = 1;
/** Passos da bisseção que acha o ritmo da demissão. */
const PASSOS = 60;
const METADE = 0.5;

/** Número do motor; ausente ou torto vale zero. */
function numero(valores: Valores, id: string): number | undefined {
  const v = valores[id];
  return Number.isFinite(v) ? v : undefined;
}

/**
 * Quanto cada perfil perde de emprego, de 0 a 1 do seu peso: a vulnerabilidade
 * (ocupação × renda × idade) vezes um ritmo comum `k`, limitada a 1. O ritmo
 * é o que faz a soma fechar com o desemprego do país. Acima do que dá para
 * demitir, todo mundo que pode perder perdeu.
 */
function fracoesDesempregadas(
  pesos: readonly number[],
  vulnerabilidade: readonly number[],
  alvo: number,
): readonly number[] {
  const perdivel = pesos.reduce(
    (s, p, i) => s + (vulnerabilidade[i] > 0 ? p : 0),
    0,
  );
  if (alvo <= 0 || perdivel <= 0) return pesos.map(() => 0);
  const meta = Math.min(alvo, perdivel);
  const positivas = vulnerabilidade.filter((v) => v > 0);
  const total = (k: number): number =>
    pesos.reduce((s, p, i) => s + p * Math.min(1, k * vulnerabilidade[i]), 0);
  // Com k = 1 / (menor vulnerabilidade), ninguém passa de 1: o teto da busca.
  const [, ritmo] = Array.from({ length: PASSOS }).reduce<[number, number]>(
    ([baixo, alto]) => {
      const meio = (baixo + alto) * METADE;
      return total(meio) < meta ? [meio, alto] : [baixo, meio];
    },
    [0, 1 / Math.min(...positivas)],
  );
  return vulnerabilidade.map((v) => Math.min(1, ritmo * v));
}

/**
 * O eleitorado de agora: o manifesto com os pesos vivos e uma linha gêmea
 * `desempregado` para cada perfil que perdeu emprego (os mesmos atributos,
 * trocando só a ocupação). Sem a tabela `emprego`, devolve o próprio manifesto.
 *
 * O desemprego é absoluto: o desempregado de partida sai de carteira, informal
 * e das demais ocupações de quem trabalha (os perfis fixos não têm
 * desempregado). A informalidade é por diferença da inicial: os perfis já a
 * representam, e nada pode se mover no turno 0.
 */
export function congressoVivo(
  manifesto: CongressManifest,
  valores: Valores,
): CongressManifest {
  const { emprego, bolso, atributos } = manifesto;
  if (!emprego) return manifesto;

  const colunaOcupacao = atributos.indexOf("ocupacao") + 1;
  const colunaRenda = atributos.indexOf("renda") + 1;
  const colunaIdade = atributos.indexOf("idade") + 1;
  if (colunaOcupacao === 0) return manifesto;

  const ocupacoes = manifesto.valores.ocupacao ?? [];
  const ocupacaoDe = (linha: Linha): string => ocupacoes[linha[colunaOcupacao]];
  const trabalha = (linha: Linha): boolean =>
    bolso?.fontes[ocupacaoDe(linha)]?.trabalha === true;
  const { vulnerabilidade } = emprego;
  const vulnerabilidadeDe = (linha: Linha): number =>
    (vulnerabilidade.ocupacao[ocupacaoDe(linha)] ?? SEM_TABELA) *
    (vulnerabilidade.renda[manifesto.valores.renda?.[linha[colunaRenda]]] ??
      SEM_TABELA) *
    (vulnerabilidade.idade[manifesto.valores.idade?.[linha[colunaIdade]]] ??
      SEM_TABELA);

  // Quem trabalha: o peso, a vulnerabilidade e a fração que perde o emprego.
  const perfis = manifesto.perfis;
  const pesos = perfis.map((p) => p[0]);
  const trabalhadores = perfis.map(trabalha);
  const forca = pesos.reduce((s, p, i) => s + (trabalhadores[i] ? p : 0), 0);
  const desemprego = numero(valores, "desemprego") ?? 0;
  const fracoes = fracoesDesempregadas(
    pesos,
    perfis.map((p, i) => (trabalhadores[i] ? vulnerabilidadeDe(p) : 0)),
    (desemprego / POR_CENTO) * forca,
  );

  const empregados = pesos.map((p, i) => p * (1 - fracoes[i]));
  const desempregados = pesos.map((p, i) => p * fracoes[i]);

  const empregadosVivos = deslocarInformalidade(
    manifesto,
    empregados,
    emprego.ocupacoes,
    ((numero(valores, "informalidade") ?? emprego.informalidadeInicial) -
      emprego.informalidadeInicial) /
      POR_CENTO,
    trabalhadores,
  );

  const idDesempregado = emprego.desempregado.id;
  /** A linha gêmea: o peso do desempregado e a ocupação nova, o resto igual. */
  const gemea = (valor: number, coluna: number, peso: number): number =>
    ({ 0: peso, [colunaOcupacao]: colunaDesempregado })[coluna] ?? valor;
  const colunaDesempregado = ocupacoes.length;
  const gemeas = perfis
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => desempregados[i] > 0);

  return {
    ...manifesto,
    valores: {
      ...manifesto.valores,
      ocupacao: [...ocupacoes, idDesempregado],
    },
    perfis: [
      ...perfis.map((p, i) => [empregadosVivos[i], ...p.slice(1)]),
      ...gemeas.map(({ p, i }) =>
        p.map((v, j) => gemea(v, j, desempregados[i])),
      ),
    ],
    vivo: {
      primeiraLinhaDeDesempregado: perfis.length,
      origem: gemeas.map(({ p }) => ocupacaoDe(p)),
      linhaOriginal: gemeas.map(({ i }) => i),
    },
  };
}

/**
 * Passa peso empregado entre a ocupação formal e a informal, só entre
 * gêmeos: o mesmo perfil nos outros atributos, com a ocupação trocada.
 * `diferenca` é a mudança da informalidade como fração dos empregados. Perfil
 * sem gêmeo não se move; o que falta fica como está. Devolve os pesos novos.
 */
function deslocarInformalidade(
  manifesto: CongressManifest,
  empregados: readonly number[],
  ocupacoes: Readonly<{ formal: string; informal: string }>,
  diferenca: number,
  trabalhadores: readonly boolean[],
): readonly number[] {
  if (diferenca === 0) return empregados;
  const { atributos, perfis } = manifesto;
  const nomes = manifesto.valores.ocupacao ?? [];
  const coluna = atributos.indexOf("ocupacao") + 1;
  // A chave de um perfil: tudo menos a ocupação.
  const chave = (linha: Linha): string =>
    linha
      .slice(1)
      .filter((_, j) => j + 1 !== coluna)
      .join(",");
  const linhas = (ocupacao: string): Map<string, number> =>
    new Map(
      perfis
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => nomes[p[coluna]] === ocupacao)
        .map(({ p, i }) => [chave(p), i] as const),
    );
  const formais = linhas(ocupacoes.formal);
  const informais = linhas(ocupacoes.informal);

  const empregadosNoTotal = empregados.reduce(
    (s, e, i) => s + (trabalhadores[i] ? e : 0),
    0,
  );
  const quer = Math.abs(diferenca) * empregadosNoTotal;
  const [de, para] =
    diferenca > 0 ? [formais, informais] : [informais, formais];
  const pares = [...de]
    .filter(([c]) => para.has(c))
    .map(([c, i]) => ({ de: i, para: para.get(c)! }));
  const disponivel = pares.reduce((s, { de: i }) => s + empregados[i], 0);
  if (disponivel <= 0) return empregados;
  const fatia = Math.min(quer, disponivel) / disponivel;
  const movidoDe = new Map(
    pares.map(({ de: i }) => [i, empregados[i] * fatia]),
  );
  const movidoPara = new Map(
    pares.map(({ de: i, para: j }) => [j, empregados[i] * fatia]),
  );
  return empregados.map(
    (e, i) => e - (movidoDe.get(i) ?? 0) + (movidoPara.get(i) ?? 0),
  );
}

/**
 * A fração de cada linha original que está desempregada agora (0 a 1 do peso
 * fixo dela). Só sai do eleitorado vivo; sem a tabela de emprego, tudo zero.
 */
export function fracoesDeDesemprego(
  fixo: CongressManifest,
  valores: Valores,
): readonly number[] {
  const vivo = congressoVivo(fixo, valores);
  const zeros = fixo.perfis.map(() => 0);
  if (!vivo.vivo) return zeros;
  const { primeiraLinhaDeDesempregado: inicio, linhaOriginal } = vivo.vivo;
  const fracoes = [...zeros];
  linhaOriginal.forEach((i, k) => {
    const peso = fixo.perfis[i][0];
    fracoes[i] = peso > 0 ? vivo.perfis[inicio + k][0] / peso : 0;
  });
  return fracoes;
}

/**
 * De que ocupação saiu uma linha desempregada do manifesto vivo: o seguro-
 * desemprego só chega a quem tinha carteira. Linha original: sem origem.
 */
export function origemDoDesempregado(
  manifesto: CongressManifest,
  linha: number,
): string | undefined {
  const { vivo } = manifesto;
  if (!vivo || linha < vivo.primeiraLinhaDeDesempregado) return undefined;
  return vivo.origem[linha - vivo.primeiraLinhaDeDesempregado];
}
