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
  /** Parte dos lucros que cabe a esse perfil, por ano. Zero para quem não vive de capital. */
  capitalPorAno: number;
}>;

/** Multiplicador ausente vale 1: a faixa nova entra na média, não some dela. */
const SEM_TABELA = 1;

/**
 * A renda de cada perfil, na ordem de `manifest.congresso.perfis`.
 *
 * Os multiplicadores são normalizados antes de virarem dinheiro: a média
 * ponderada de quem trabalha vale exatamente `salarioMedio`, então a soma
 * fecha com a massa salarial do motor. Quem vive de capital (`capital: true`
 * na tabela) não tira da massa salarial: reparte os lucros, que valem
 * `razaoLucros` vezes a massa, na mesma proporção dos multiplicadores.
 */
export function rendasDosPerfis(
  content: ResolvedPackage,
  salarioMedio: number,
  razaoLucros = 0,
): readonly RendaDoPerfil[] {
  const congresso = content.manifest.congresso;
  const tabela = congresso?.bolso?.fontes;
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
      capital: fonte?.capital ?? false,
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

  // A massa salarial por pessoa do eleitorado inteiro: o que os lucros, em
  // razão da massa, precisam somar para fechar.
  const trabalhoPorPessoa = pesos * salarioMedio;
  let capitalPesado = 0;
  for (const l of lido)
    if (l.capital) capitalPesado += l.peso * l.multiplicador;
  const escalaCapital =
    capitalPesado > 0 ? (razaoLucros * trabalhoPorPessoa) / capitalPesado : 0;

  return lido.map(({ fonte, trabalha, capital, multiplicador }) => ({
    fonte,
    porAno: trabalha ? multiplicador * escala : 0,
    capitalPorAno: capital ? multiplicador * escalaCapital : 0,
  }));
}

/**
 * O benefício anual da fonte, como o motor o paga: valor médio vezes o
 * reajuste, quando a fonte declara um. Ler só o valor médio ignorava o
 * reajuste e fazia a lei de reajuste de benefícios não bater em ninguém.
 */
function beneficioDaFonte(
  fonte: { beneficio?: string; reajuste?: string } | undefined,
  valores: Readonly<Record<string, number>>,
): number {
  if (!fonte?.beneficio) return 0;
  const valor = numero(valores, fonte.beneficio);
  return fonte.reajuste
    ? (valor * numero(valores, fonte.reajuste)) / POR_CENTO
    : valor;
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
 * Ganha do trabalho pela repartição da massa salarial (`rendasDosPerfis`), dos
 * lucros se viver de capital, e do benefício que a sua fonte declarar. Paga
 * repartindo o que o motor arrecadou: o agregado manda e o perfil divide, então
 * a soma dos perfis fecha com a arrecadação em vez de aplicar uma alíquota que
 * pode não bater com a base. Nada disso volta para a rede de consequências
 * (mecânica 2.7).
 */
export function bolsosDosPerfis(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
): readonly BolsoDoPerfil[] {
  const tabela = content.manifest.congresso?.bolso?.fontes;
  const perfis = content.manifest.congresso?.perfis ?? [];
  const massa = numero(valores, "massa_salarial");
  const lucros = numero(valores, "lucros");
  const rendas = rendasDosPerfis(
    content,
    numero(valores, "salario_medio"),
    massa > 0 ? lucros / massa : 0,
  );
  if (!tabela || rendas.length === 0) return [];

  const consumido = numero(valores, "propensao_consumo") / POR_CENTO;
  // Do que os lucros rendem, o motor só consome uma fração
  // (`consumo_familias = massa × p + lucros × p × fração`); ela sai de lá em
  // vez de ser copiada para cá.
  const consumoDeLucros =
    consumido > 0 && lucros > 0
      ? Math.min(
          1,
          Math.max(
            0,
            (numero(valores, "consumo_familias") / consumido - massa) / lucros,
          ),
        )
      : 0;

  const ganhos = rendas.map(({ fonte, porAno, capitalPorAno }) => ({
    fonte,
    porAno,
    capitalPorAno,
    ganha: porAno + capitalPorAno + beneficioDaFonte(tabela[fonte.id], valores),
  }));
  const consumos = ganhos.map(
    ({ ganha, capitalPorAno }) =>
      (ganha - capitalPorAno * (1 - consumoDeLucros)) * consumido,
  );

  // Médias do eleitorado inteiro. A massa salarial fixa o tamanho do
  // eleitorado (massa = pessoas × média do trabalho), e a mesma conta serve
  // para trazer a arrecadação do motor para o bolso de uma pessoa.
  const pesoTotal = perfis.reduce((soma, perfil) => soma + perfil[0], 0);
  const media = (valoresDosPerfis: readonly number[]): number =>
    pesoTotal > 0
      ? valoresDosPerfis.reduce((soma, v, i) => soma + v * perfis[i][0], 0) /
        pesoTotal
      : 0;
  const mediaDoTrabalho = media(ganhos.map((g) => g.porAno));
  const mediaDoConsumo = media(consumos);
  const porPessoa = (arrecadado: number, mediaDaBase: number): number =>
    massa > 0 && mediaDaBase > 0
      ? (arrecadado * mediaDoTrabalho) / (massa * mediaDaBase)
      : 0;

  const sobreConsumo = porPessoa(
    numero(valores, "arrecadacao_consumo"),
    mediaDoConsumo,
  );
  const sobreRenda = aliquota(
    valores,
    "arrecadacao_renda_pessoas",
    "massa_salarial",
  );
  const sobreLucros = lucros > 0 ? sobreLucrosArrecadados(valores) / lucros : 0;

  // `arrecadacao_salarios` fica de fora: é encargo do empregador sobre a
  // folha, que o jogo já mostra em "Custo de contratar". Cobrá-la aqui
  // punha 21,6 pontos a mais na conta de cada trabalhador, e levava a
  // conta inteira a 61% do que se ganha.
  return ganhos.map(({ fonte, porAno, capitalPorAno, ganha }, i) => {
    const paga =
      consumos[i] * sobreConsumo +
      porAno * sobreRenda +
      capitalPorAno * sobreLucros;
    return { fonte, ganha, paga, sobra: ganha - paga };
  });
}

/** Imposto sobre o lucro das empresas e sobre o que elas distribuem. */
function sobreLucrosArrecadados(
  valores: Readonly<Record<string, number>>,
): number {
  return (
    numero(valores, "arrecadacao_renda_empresas") +
    numero(valores, "arrecadacao_dividendos")
  );
}

export type QuemPagou = Readonly<{
  /** Nome da faixa, como o censo a escreve: "Informais e de aplicativo". */
  faixa: string;
  /** Parte do eleitorado que está nela, de 0 a 1. */
  parte: number;
  /** Diferença no que sobra, por mês. Negativa quando essa gente perde. */
  porMes: number;
}>;

const MESES = 12;
/** Abaixo de um real por mês a diferença é ruído de arredondamento. */
const RUIDO = 1;
/** Quantas faixas a lei mostra: as que mais sentiram, para ganho ou perda. */
const LINHAS = 6;

/**
 * Em quem a lei bate, por ocupação × faixa de renda: o que mudou no que sobra
 * entre o país de antes e o de depois. Por ocupação só, o informal pobre
 * sumia na média de todos os informais. Da maior perda para o maior ganho;
 * faixa sem diferença fica de fora, então lei que não mexe em dinheiro não
 * inventa vítima.
 */
export function quemPagouAConta(
  content: ResolvedPackage,
  antes: Readonly<Record<string, number>>,
  depois: Readonly<Record<string, number>>,
): readonly QuemPagou[] {
  const congresso = content.manifest.congresso;
  if (!congresso) return [];
  const bolsoAntes = bolsosDosPerfis(content, antes);
  const bolsoDepois = bolsosDosPerfis(content, depois);
  if (bolsoAntes.length === 0) return [];

  const { atributos, valores, perfis, rotulos } = congresso;
  const colunaRenda = atributos.indexOf("renda") + 1;
  const soma = new Map<string, { nome: string; peso: number; dif: number }>();
  for (const [i, perfil] of perfis.entries()) {
    const fonte = bolsoAntes[i].fonte;
    const renda = valores.renda?.[perfil[colunaRenda]] ?? "";
    const rendaEscrita = (
      rotulos?.faixas[`renda=${renda}`] ?? renda
    ).toLowerCase();
    const chave = `${fonte.id}|${renda}`;
    const acc = soma.get(chave) ?? {
      nome: `${fonte.nome} · ${rendaEscrita}`,
      peso: 0,
      dif: 0,
    };
    acc.peso += perfil[0];
    acc.dif += perfil[0] * (bolsoDepois[i].sobra - bolsoAntes[i].sobra);
    soma.set(chave, acc);
  }

  return [...soma.values()]
    .map(({ nome, peso, dif }) => ({
      faixa: nome,
      parte: peso,
      porMes: peso > 0 ? dif / peso / MESES : 0,
    }))
    .filter(({ porMes }) => Math.abs(porMes) >= RUIDO)
    .sort((a, b) => Math.abs(b.porMes) - Math.abs(a.porMes))
    .slice(0, LINHAS)
    .sort((a, b) => a.porMes - b.porMes);
}
