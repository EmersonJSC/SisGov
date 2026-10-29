import type { ResolvedPackage } from "../../engine";

/**
 * O bolso de cada perfil do eleitorado (População, camada B).
 *
 * O agregado manda e o perfil divide: o motor calcula a massa salarial como
 * sempre, e a tabela de `mundo/populacao.json` reparte entre os perfis por
 * ocupação e faixa de renda. Nada aqui entra na rede de consequências nem na
 * satisfação dos grupos — é leitura (mecânica 2.7).
 */

/**
 * De onde vem o dinheiro do perfil, com nome. Hoje a fonte é a ocupação;
 * quando os setores existirem, é o par ocupação + setor. Quem lê o bolso
 * pergunta pela fonte, nunca pela ocupação direto — é o que deixa o setor
 * entrar sem reescrever esta camada (mecânica 2.4).
 */
export type Fonte = Readonly<{ id: string; nome: string }>;

export type RendaDoPerfil = Readonly<{
  fonte: Fonte;
  /** Em moeda do país por ano, como `salario_medio`. Zero para quem não trabalha. */
  porAno: number;
}>;

type FonteDaTabela = Readonly<{
  nome: string;
  trabalha: boolean;
  porRenda?: Readonly<Record<string, number>>;
  /** Variável do motor que paga essa gente por ano, quando ela não trabalha. */
  beneficio?: string;
}>;

/** Multiplicador ausente vale 1: a faixa nova entra na média, não some dela. */
const SEM_TABELA = 1;

/**
 * A renda de cada perfil, na ordem de `manifest.congresso.perfis`.
 *
 * Os multiplicadores são normalizados antes de virarem dinheiro: a média
 * ponderada de quem trabalha vale exatamente `salarioMedio`, então a soma
 * fecha com a massa salarial do motor.
 */
export function rendasDosPerfis(
  content: ResolvedPackage,
  salarioMedio: number,
): readonly RendaDoPerfil[] {
  const congresso = content.manifest.congresso;
  const tabela = congresso?.bolso?.fontes as
    Readonly<Record<string, FonteDaTabela>> | undefined;
  if (!congresso || !tabela) return [];

  const { atributos, valores, perfis } = congresso;
  const colunaOcupacao = atributos.indexOf("ocupacao") + 1;
  const colunaRenda = atributos.indexOf("renda") + 1;

  const lido = perfis.map((perfil) => {
    const ocupacao = valores.ocupacao?.[perfil[colunaOcupacao]] ?? "";
    const faixa = valores.renda?.[perfil[colunaRenda]] ?? "";
    const fonte = tabela[ocupacao];
    return {
      peso: perfil[0],
      fonte: { id: ocupacao, nome: fonte?.nome ?? ocupacao },
      trabalha: fonte?.trabalha ?? false,
      multiplicador: fonte?.porRenda?.[faixa] ?? SEM_TABELA,
    };
  });

  let somaPesada = 0;
  let pesos = 0;
  for (const l of lido) {
    if (!l.trabalha) continue;
    somaPesada += l.peso * l.multiplicador;
    pesos += l.peso;
  }
  const media = pesos > 0 ? somaPesada / pesos : 0;
  const escala = media > 0 ? salarioMedio / media : 0;

  return lido.map(({ fonte, trabalha, multiplicador }) => ({
    fonte,
    porAno: trabalha ? multiplicador * escala : 0,
  }));
}

export type BolsoDoPerfil = Readonly<{
  fonte: Fonte;
  /** Trabalho mais benefício, em moeda do país por ano. */
  ganha: number;
  /** Imposto sobre consumo, sobre a renda e contribuição sobre o salário. */
  paga: number;
  /** O que resta — o número que quem joga entende. */
  sobra: number;
}>;

/** Porcentagem do motor virando fração; parcela que falta vale zero. */
const POR_CENTO = 100;
function numero(valores: Readonly<Record<string, number>>, id: string): number {
  const v = valores[id];
  return Number.isFinite(v) ? v : 0;
}

/**
 * Alíquota efetiva: o que se arrecadou dividido pela base sobre a qual se
 * arrecadou. Sai daqui e não de `carga_impostos_consumo`, que é percentual do
 * PIB e não do consumo das famílias — aplicá-la ao consumo de uma pessoa daria
 * um número errado.
 */
function aliquota(
  valores: Readonly<Record<string, number>>,
  arrecadacao: string,
  base: string,
): number {
  const b = numero(valores, base);
  return b > 0 ? numero(valores, arrecadacao) / b : 0;
}

/**
 * O bolso de cada perfil, na ordem de `manifest.congresso.perfis`.
 *
 * Ganha do trabalho pela repartição da massa salarial (`rendasDosPerfis`) e
 * do benefício que a sua fonte declarar. Paga pelas alíquotas efetivas do
 * agregado. Nada disso volta para a rede de consequências (mecânica 2.7).
 */
export function bolsosDosPerfis(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
): readonly BolsoDoPerfil[] {
  const tabela = content.manifest.congresso?.bolso?.fontes as
    Readonly<Record<string, FonteDaTabela>> | undefined;
  const rendas = rendasDosPerfis(content, numero(valores, "salario_medio"));
  if (!tabela || rendas.length === 0) return [];

  const sobreConsumo = aliquota(
    valores,
    "arrecadacao_consumo",
    "consumo_familias",
  );
  const sobreRenda = aliquota(
    valores,
    "arrecadacao_renda_pessoas",
    "massa_salarial",
  );
  const consumido = numero(valores, "propensao_consumo") / POR_CENTO;

  return rendas.map(({ fonte, porAno }) => {
    const beneficio = tabela[fonte.id]?.beneficio;
    const ganha = porAno + (beneficio ? numero(valores, beneficio) : 0);
    // `arrecadacao_salarios` fica de fora: é encargo do empregador sobre a
    // folha, que o jogo já mostra em "Custo de contratar". Cobrá-la aqui
    // punha 21,6 pontos a mais na conta de cada trabalhador, e levava a
    // conta inteira a 61% do que se ganha.
    const paga = ganha * consumido * sobreConsumo + porAno * sobreRenda;
    return { fonte, ganha, paga, sobra: ganha - paga };
  });
}
