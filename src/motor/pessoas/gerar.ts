// Gerador de pessoas: fichas sorteadas pela semente, com nome do país, origem
// pelo peso dos partidos e bússola em torno do partido de origem.
import { semear, sortear, sortearNormal, type Acaso } from "../acaso";
import type { Ficha } from "../governo";
import { EIXOS, type PontoBussola } from "../leis";
import type { ModeloDePessoas, PartidoParaPessoas } from "./tipos";

const TECNICO = "tecnico";
const NOTA_MEDIA = 55;
const NOTA_DESVIO = 18;
const NOTA_MINIMA = 5;
const NOTA_MAXIMA = 95;
const BUSSOLA_DESVIO = 0.25;
const BUSSOLA_DESVIO_TECNICO = 0.45;
const IDADE_MINIMA = 35;
const IDADE_FAIXA = 40;

const limitar = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const arredondar = (v: number) => Math.round(v * 100) / 100;

/** Fonte de números sorteados: guarda o estado do acaso entre uma chamada e outra. */
export function fonteDeSorteio(semente: number) {
  let estado: Acaso = semear(semente);
  const unico = () => {
    const [v, proximo] = sortear(estado);
    estado = proximo;
    return v;
  };
  const normal = () => {
    const [v, proximo] = sortearNormal(estado);
    estado = proximo;
    return v;
  };
  const escolher = <T>(lista: readonly T[]): T =>
    lista[Math.floor(unico() * lista.length)];
  return { unico, normal, escolher };
}
export type FonteDeSorteio = ReturnType<typeof fonteDeSorteio>;

/** Posição média dos grupos que o partido defende, pelo peso de cada um. */
export function bussolaDoPartido(
  defende: Record<string, number>,
  grupos: { id: string; bussola: PontoBussola }[],
): PontoBussola {
  const pesos = grupos.map((g) => ({ g, peso: defende[g.id] ?? 0 }));
  const total = pesos.reduce((soma, p) => soma + p.peso, 0);
  return Object.fromEntries(
    EIXOS.map((eixo) => [
      eixo,
      total > 0
        ? arredondar(
            pesos.reduce(
              (soma, { g, peso }) => soma + peso * (g.bussola[eixo] ?? 0),
              0,
            ) / total,
          )
        : 0,
    ]),
  );
}

const nota = (s: FonteDeSorteio) =>
  Math.round(
    limitar(NOTA_MEDIA + NOTA_DESVIO * s.normal(), NOTA_MINIMA, NOTA_MAXIMA),
  );

/** Partido de origem pelo peso das cadeiras, ou técnico. */
function origemSorteada(
  s: FonteDeSorteio,
  partidos: PartidoParaPessoas[],
  tecnicos: number,
): PartidoParaPessoas | null {
  if (s.unico() < tecnicos) return null;
  const total = partidos.reduce((soma, p) => soma + p.cadeiras, 0);
  const ponto = s.unico() * total;
  let acumulado = 0;
  return (
    partidos.find((p) => (acumulado += p.cadeiras) > ponto) ??
    partidos[partidos.length - 1]
  );
}

function bussolaSorteada(
  s: FonteDeSorteio,
  centro: PontoBussola | null,
): PontoBussola {
  const desvio = centro ? BUSSOLA_DESVIO : BUSSOLA_DESVIO_TECNICO;
  return Object.fromEntries(
    EIXOS.map((eixo) => [
      eixo,
      arredondar(limitar((centro?.[eixo] ?? 0) + desvio * s.normal(), -1, 1)),
    ]),
  );
}

/** Nome que ainda não existe: nome + sobrenome, e um segundo sobrenome se repetir. */
function nomeNovo(
  s: FonteDeSorteio,
  modelo: ModeloDePessoas,
  sexo: "f" | "m",
  usados: Set<string>,
): string {
  const base = `${s.escolher(modelo.proprios[sexo])} ${s.escolher(modelo.sobrenomes)}`;
  const nome = usados.has(base)
    ? `${base} ${s.escolher(modelo.sobrenomes)}`
    : base;
  return usados.has(nome) ? nomeNovo(s, modelo, sexo, usados) : nome;
}

/** Motivo de o modelo do país não servir, ou nulo. */
export function motivoModeloInvalido(m: ModeloDePessoas): string | null {
  if (m.proprios.f.length === 0 || m.proprios.m.length === 0)
    return "precisa de nomes próprios femininos e masculinos";
  if (m.sobrenomes.length === 0) return "precisa de sobrenomes";
  if (!(m.quantidade >= 1)) return "quantidade precisa ser ao menos 1";
  if (!(m.tecnicos >= 0 && m.tecnicos <= 1)) return "técnicos vão de 0 a 1";
  const combinacoes =
    (m.proprios.f.length + m.proprios.m.length) * m.sobrenomes.length;
  if (combinacoes < m.quantidade * 2)
    return "poucos nomes para tanta gente: some nomes ou sobrenomes";
  return null;
}

/** As pessoas do país no começo da partida; mesma semente, mesmas pessoas. */
export function gerarPessoas(
  semente: number,
  modelo: ModeloDePessoas,
  partidos: PartidoParaPessoas[],
): Ficha[] {
  const s = fonteDeSorteio(semente);
  const usados = new Set<string>();
  return Array.from({ length: modelo.quantidade }, (_, i) => {
    const origem = origemSorteada(s, partidos, modelo.tecnicos);
    const sexo = s.unico() < 0.5 ? "f" : "m";
    const nome = nomeNovo(s, modelo, sexo, usados);
    usados.add(nome);
    return {
      id: `g${String(i + 1).padStart(3, "0")}`,
      nome,
      competencia: nota(s),
      habilidade: nota(s),
      carisma: nota(s),
      honestidade: nota(s),
      lealdade: nota(s),
      bussola: bussolaSorteada(s, origem?.bussola ?? null),
      origem: origem?.id ?? TECNICO,
      sexo,
      idade: IDADE_MINIMA + Math.floor(s.unico() * IDADE_FAIXA),
    };
  });
}
