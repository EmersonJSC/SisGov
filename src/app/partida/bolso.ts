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
