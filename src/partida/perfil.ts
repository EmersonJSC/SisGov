// Perfil de rede social de uma pessoa, gerado da ficha. Nada diz o lado dela:
// o jogador deduz pelo que ela posta, onde vai e quem segue.
import perfis from "../conteudo/mundo/pessoas/perfil.json";
import { distanciaNaBussola, type Ficha } from "../motor";

type Tom = "menos" | "meio" | "mais";
type Eixo = "economico" | "social";

/** Abaixo disto em módulo o eixo é "meio". */
const ZONA_DO_MEIO = 0.2;
const NOTA_ALTA = 65;
const NOTA_BAIXA = 35;
const QUANTOS_SEGUE = 3;

export interface PerfilDePessoa {
  usuario: string;
  posts: string[];
  lugares: string[];
  segue: string[];
}

const tomDo = (v: number): Tom =>
  v < -ZONA_DO_MEIO ? "menos" : v > ZONA_DO_MEIO ? "mais" : "meio";

/** Número fixo tirado do id: o mesmo perfil toda vez, sem estado. */
function numeroDoId(id: string, sal: number): number {
  return [...id].reduce(
    (h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0,
    sal >>> 0,
  );
}

const escolher = <T>(lista: readonly T[], id: string, sal: number): T =>
  lista[numeroDoId(id, sal) % lista.length];

const semAcento = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");

function condutaDe(f: Ficha): string[] {
  const { honestidade, lealdade } = perfis.conduta;
  const frases: string[] = [];
  if (f.honestidade >= NOTA_ALTA)
    frases.push(escolher(honestidade.alta, f.id, 3));
  if (f.honestidade <= NOTA_BAIXA)
    frases.push(escolher(honestidade.baixa, f.id, 3));
  if (f.lealdade >= NOTA_ALTA) frases.push(escolher(lealdade.alta, f.id, 4));
  if (f.lealdade <= NOTA_BAIXA) frases.push(escolher(lealdade.baixa, f.id, 4));
  return frases;
}

/** Quem a pessoa segue: as mais próximas dela na bússola, que não ela mesma. */
function quemSegue(f: Ficha, todos: Ficha[]): string[] {
  return todos
    .filter((o) => o.id !== f.id)
    .map((o) => ({ o, d: distanciaNaBussola(o.bussola, f.bussola) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, QUANTOS_SEGUE)
    .map(({ o }) => o.nome);
}

export function perfilDaPessoa(f: Ficha, todos: Ficha[]): PerfilDePessoa {
  const post = (eixo: Eixo, sal: number) =>
    escolher(perfis.posts[eixo][tomDo(f.bussola[eixo] ?? 0)], f.id, sal);
  const lugar = (eixo: Eixo, sal: number) =>
    escolher(perfis.lugares[eixo][tomDo(f.bussola[eixo] ?? 0)], f.id, sal);
  return {
    usuario: `@${semAcento(f.nome)}`,
    posts: [post("economico", 1), post("social", 2), ...condutaDe(f)],
    lugares: [lugar("economico", 5), lugar("social", 6)],
    segue: quemSegue(f, todos),
  };
}
