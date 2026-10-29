import type { ResolvedPackage } from "../../engine";
import type { CongressManifest } from "../../engine/model/contentTypes";
import { interpolate } from "../../engine/mechanisms/calculateContribution";
import { congressoVivo, origemDoDesempregado } from "./vivo";

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
  return congresso
    ? rendasDoManifesto(congresso, salarioMedio, razaoLucros)
    : [];
}

/** O que a conta da renda lê de cada perfil. */
function lerPerfis(congresso: CongressManifest) {
  const tabela = congresso.bolso?.fontes ?? {};
  const { atributos, valores, perfis } = congresso;
  const colunaOcupacao = atributos.indexOf("ocupacao") + 1;
  const colunaRenda = atributos.indexOf("renda") + 1;
  return perfis.map((perfil) => {
    const ocupacao = valores.ocupacao?.[perfil[colunaOcupacao]] ?? "";
    const faixa = valores.renda?.[perfil[colunaRenda]] ?? "";
    const fonte = tabela[ocupacao];
    return {
      peso: perfil[0],
      fonte: { id: ocupacao, nome: fonte?.nome ?? ocupacao },
      trabalha: fonte?.trabalha ?? false,
      capital: fonte?.capital ?? false,
      seguePiso: fonte?.seguePiso ?? false,
      multiplicador: fonte?.porRenda?.[faixa] ?? SEM_TABELA,
    };
  });
}

type Lido = ReturnType<typeof lerPerfis>[number];

/** Peso e multiplicador somados de quem passa no filtro. */
function somaPesada(
  lido: readonly Lido[],
  filtro: (l: Lido) => boolean,
): Readonly<{ pesos: number; pesado: number }> {
  return lido.filter(filtro).reduce(
    (t, l) => ({
      pesos: t.pesos + l.peso,
      pesado: t.pesado + l.peso * l.multiplicador,
    }),
    { pesos: 0, pesado: 0 },
  );
}

/**
 * A mesma conta, sobre um manifesto qualquer (o fixo ou o eleitorado vivo).
 *
 * `regua` é o eleitorado de onde sai a média dos multiplicadores. Sem ela, é o
 * próprio manifesto e a média fecha com `salarioMedio`. `pisoPorAno` é o
 * salário mínimo por ano: quem segue o piso não ganha menos que ele (só sobe;
 * quando pega, a soma deixa de fechar com a massa do motor). Com o eleitorado do
 * início, quem passa para o informal ganha menos e quem fica não ganha aumento
 * fantasma; o custo é a soma dos perfis sair da massa do motor quando a
 * composição muda, porque o motor não baixa o salário médio com a
 * informalidade.
 */
export function rendasDoManifesto(
  congresso: CongressManifest,
  salarioMedio: number,
  razaoLucros: number,
  regua: CongressManifest = congresso,
  pisoPorAno = 0,
): readonly RendaDoPerfil[] {
  if (!congresso.bolso?.fontes) return [];
  const lido = lerPerfis(congresso);
  const trabalho = somaPesada(lerPerfis(regua), (l) => l.trabalha);
  const media = trabalho.pesos > 0 ? trabalho.pesado / trabalho.pesos : 0;
  const escala = media > 0 ? salarioMedio / media : 0;

  // A massa salarial do motor por pessoa do eleitorado: o que os lucros, em
  // razão da massa, precisam somar para fechar.
  const trabalhoPorPessoa =
    somaPesada(lido, (l) => l.trabalha).pesos * salarioMedio;
  const capitalPesado = somaPesada(lido, (l) => l.capital).pesado;
  const escalaCapital =
    capitalPesado > 0 ? (razaoLucros * trabalhoPorPessoa) / capitalPesado : 0;

  return lido.map(({ fonte, trabalha, capital, seguePiso, multiplicador }) => ({
    fonte,
    porAno: trabalha
      ? Math.max(multiplicador * escala, seguePiso ? pisoPorAno : 0)
      : 0,
    capitalPorAno: capital ? multiplicador * escalaCapital : 0,
  }));
}

/**
 * O eleitorado do início da partida: o vivo com o desemprego e a
 * informalidade que os perfis representam. É a régua do salário e a base de
 * onde o censo mede o movimento. Sem esses números no país, não existe.
 */
export function eleitoradoDoInicio(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
): CongressManifest | undefined {
  const fixo = content.manifest.congresso;
  const inicial = content.initialState.indicesIniciais;
  if (!fixo?.emprego || !inicial) return undefined;
  return congressoVivo(fixo, {
    ...valores,
    desemprego: inicial.desemprego ?? 0,
    informalidade: fixo.emprego.informalidadeInicial,
  });
}

/**
 * O benefício anual da fonte, como o motor o paga: valor médio vezes o
 * reajuste, quando a fonte declara um. Ler só o valor médio ignorava o
 * reajuste e fazia a lei de reajuste de benefícios não bater em ninguém.
 */
function beneficioDaFonte(
  fonte: BolsoFonte | undefined,
  valores: Readonly<Record<string, number>>,
): number {
  if (!fonte?.beneficio) return 0;
  const valor = numero(valores, fonte.beneficio);
  const reajustado = fonte.reajuste
    ? (valor * numero(valores, fonte.reajuste)) / POR_CENTO
    : valor;
  return fonte.curva
    ? reajustado *
        interpolate(fonte.curva.pontos, numero(valores, fonte.curva.nivel))
    : reajustado;
}

type BolsoFonte = NonNullable<CongressManifest["bolso"]>["fontes"][string];

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
  return bolsosDoEleitorado(content, valores)?.bolsos ?? [];
}

/** O eleitorado vivo de um turno e o bolso de cada linha dele, na mesma ordem. */
export type EleitoradoComBolso = Readonly<{
  manifesto: CongressManifest;
  bolsos: readonly BolsoDoPerfil[];
}>;

/**
 * O bolso de cada linha do eleitorado vivo (`congressoVivo`): os perfis
 * originais com o peso de quem segue empregado, mais uma linha gêmea para
 * quem perdeu o emprego. Sem tabela de bolso no país, `undefined`.
 */
export function bolsosDoEleitorado(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
): EleitoradoComBolso | undefined {
  const fixo = content.manifest.congresso;
  if (!fixo) return undefined;
  const manifesto = congressoVivo(fixo, valores);
  const tabela = manifesto.bolso?.fontes;
  const perfis = manifesto.perfis;
  const massa = numero(valores, "massa_salarial");
  const lucros = numero(valores, "lucros");
  const rendas = rendasDoManifesto(
    manifesto,
    numero(valores, "salario_medio"),
    massa > 0 ? lucros / massa : 0,
    eleitoradoDoInicio(content, valores),
    pisoSalarial(manifesto, valores),
  );
  if (!tabela || rendas.length === 0) return undefined;

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

  // O seguro-desemprego só chega a quem tinha carteira (`emprego` no mundo).
  const recebeBeneficio = (fonteId: string, linha: number): boolean => {
    const desempregado = manifesto.emprego?.desempregado;
    if (!desempregado || fonteId !== desempregado.id) return true;
    const origem = origemDoDesempregado(manifesto, linha);
    return (
      origem !== undefined && desempregado.origemComBeneficio.includes(origem)
    );
  };
  const ganhos = rendas.map(({ fonte, porAno, capitalPorAno }, i) => ({
    fonte,
    porAno,
    capitalPorAno,
    ganha:
      porAno +
      capitalPorAno +
      (recebeBeneficio(fonte.id, i)
        ? beneficioDaFonte(tabela[fonte.id], valores)
        : 0),
  }));
  const consumos = ganhos.map(
    ({ ganha, capitalPorAno }) =>
      (ganha - capitalPorAno * (1 - consumoDeLucros)) * consumido,
  );

  // Médias do eleitorado inteiro. A massa salarial fixa o tamanho do
  // eleitorado (massa = pessoas × salário médio × parte que trabalha, como o
  // motor a calcula), e a mesma conta serve para trazer a arrecadação do
  // motor para o bolso de uma pessoa. A média dos salários dos perfis não
  // serve: com a régua do início, ela cai quando a composição muda, e a conta
  // passaria a ver mais gente dividindo o mesmo imposto.
  const pesoTotal = perfis.reduce((soma, perfil) => soma + perfil[0], 0);
  const media = (valoresDosPerfis: readonly number[]): number =>
    pesoTotal > 0
      ? valoresDosPerfis.reduce((soma, v, i) => soma + v * perfis[i][0], 0) /
        pesoTotal
      : 0;
  const parteQueTrabalha = media(
    rendas.map((r) => (tabela[r.fonte.id]?.trabalha ? 1 : 0)),
  );
  const mediaDoTrabalho = numero(valores, "salario_medio") * parteQueTrabalha;
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
  const bolsos = ganhos.map(({ fonte, porAno, capitalPorAno, ganha }, i) => {
    const paga =
      consumos[i] * sobreConsumo +
      porAno * sobreRenda +
      capitalPorAno * sobreLucros;
    return { fonte, ganha, paga, sobra: ganha - paga };
  });
  return { manifesto, bolsos };
}

/** O salário mínimo em moeda por ano; 0 se o mundo não declara o piso. */
function pisoSalarial(
  manifesto: CongressManifest,
  valores: Readonly<Record<string, number>>,
): number {
  const piso = manifesto.bolso?.piso;
  return piso
    ? (numero(valores, piso.variavel) / POR_CENTO) *
        piso.medianaSobreMedia *
        numero(valores, "salario_medio")
    : 0;
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
  linhas = LINHAS,
): readonly QuemPagou[] {
  const pais = (valores: Readonly<Record<string, number>>) =>
    porOrigemERenda(bolsosDoEleitorado(content, valores));
  const faixasAntes = pais(antes);
  const faixasDepois = pais(depois);

  return [...faixasAntes]
    .map(([chave, a]) => {
      const d = faixasDepois.get(chave);
      const porMes =
        d && a.peso > 0 && d.peso > 0
          ? (d.sobra / d.peso - a.sobra / a.peso) / MESES
          : 0;
      return { faixa: a.nome, parte: a.peso, porMes };
    })
    .filter(({ porMes }) => Math.abs(porMes) >= RUIDO)
    .sort((a, b) => Math.abs(b.porMes) - Math.abs(a.porMes))
    .slice(0, linhas)
    .sort((a, b) => a.porMes - b.porMes);
}

/**
 * O eleitorado por ocupação de **origem** × faixa de renda, com o peso e o
 * que sobra no total de cada faixa. O desempregado conta na ocupação de onde
 * saiu: a lei que demite bate em "carteira, pobres", empregados e demitidos
 * juntos, e a faixa é a mesma gente antes e depois.
 */
function porOrigemERenda(
  eleitorado: EleitoradoComBolso | undefined,
): ReadonlyMap<string, { nome: string; peso: number; sobra: number }> {
  const faixas = new Map<
    string,
    { nome: string; peso: number; sobra: number }
  >();
  if (!eleitorado) return faixas;
  const { manifesto, bolsos } = eleitorado;
  const { atributos, valores, perfis, rotulos } = manifesto;
  const colunaRenda = atributos.indexOf("renda") + 1;
  perfis.forEach((perfil, i) => {
    const bolso = bolsos[i];
    const origem = origemDoDesempregado(manifesto, i);
    const fonte = origem
      ? { id: origem, nome: manifesto.bolso?.fontes[origem]?.nome ?? origem }
      : bolso.fonte;
    const renda = valores.renda?.[perfil[colunaRenda]] ?? "";
    const rendaEscrita = (
      rotulos?.faixas[`renda=${renda}`] ?? renda
    ).toLowerCase();
    const chave = `${fonte.id}|${renda}`;
    const acc = faixas.get(chave) ?? {
      nome: `${fonte.nome} · ${rendaEscrita}`,
      peso: 0,
      sobra: 0,
    };
    faixas.set(chave, {
      ...acc,
      peso: acc.peso + perfil[0],
      sobra: acc.sobra + perfil[0] * bolso.sobra,
    });
  });
  return faixas;
}
