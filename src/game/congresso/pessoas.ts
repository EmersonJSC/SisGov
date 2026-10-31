import { criarSorte } from "../eleicao/personagens";
import type { CongressoDoPacote } from "./index";
import { motivosDoPerfil, satisfacaoDosMotivos, type Motivo } from "./motivos";
import type { EstadoDoCongresso, PessoaSorteada } from "./tipos";

/**
 * Sorteio de uma pessoa (População, "a população pensa"): o módulo gera, a
 * partir de um perfil sorteado por peso, uma pessoa com nome e idade fixos, e
 * guarda quem ela é. Quem pede (a rede social, por exemplo) só entrega uma
 * chave; a mesma chave devolve sempre a mesma pessoa.
 */

export type NomesDoPais = Readonly<{
  m: readonly string[];
  f: readonly string[];
  sobrenomes: readonly string[];
}>;

/** Idade em anos de uma faixa do perfil: "16-29", "60+". */
const FAIXA_ABERTA = 30;
function idadeDaFaixa(faixa: string, sorte: ReturnType<typeof criarSorte>) {
  const [de, ate] = faixa.split("-").map((n) => Number.parseInt(n, 10));
  return Number.isFinite(ate)
    ? sorte.inteiro(de, ate)
    : sorte.inteiro(de, de + FAIXA_ABERTA);
}

/** Número de 32 bits estável de um texto (FNV-1a). */
function semente(texto: string): number {
  return [...texto].reduce(
    (h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  );
}

/** Tira uma pessoa do pacote fixo: perfil por peso, nome e idade pela semente. */
export function sortearPessoa(
  pacote: CongressoDoPacote,
  nomes: NomesDoPais,
  chave: string,
  sementeDaPartida: number,
): PessoaSorteada {
  const sorte = criarSorte(semente(`${sementeDaPartida}:${chave}`));
  const total = pacote.perfis.reduce((s, p) => s + p.peso, 0);
  let alvo = sorte.numero() * total;
  const perfil = Math.max(
    0,
    pacote.perfis.findIndex((p) => (alvo -= p.peso) < 0),
  );
  const genero = sorte.numero() < 0.5 ? "m" : "f";
  const sobrenome = sorte.escolher(nomes.sobrenomes);
  return {
    chave,
    perfil,
    genero,
    nome: `${sorte.escolher(nomes[genero])} ${sobrenome}`,
    idade: idadeDaFaixa(
      pacote.perfis[perfil].atributos.idade ?? "30-59",
      sorte,
    ),
  };
}

/**
 * A pessoa dessa chave: a que já foi sorteada, ou uma nova, que fica
 * guardada no estado para o próximo clique.
 */
export function pessoaDaChave(
  estado: EstadoDoCongresso,
  pacote: CongressoDoPacote,
  nomes: NomesDoPais,
  chave: string,
  sementeDaPartida: number,
): Readonly<{ pessoa: PessoaSorteada; estado: EstadoDoCongresso }> {
  const guardada = estado.pessoas?.[chave];
  if (guardada) return { pessoa: guardada, estado };
  const pessoa = sortearPessoa(pacote, nomes, chave, sementeDaPartida);
  return {
    pessoa,
    estado: { ...estado, pessoas: { ...estado.pessoas, [chave]: pessoa } },
  };
}

export type OpiniaoDaPessoa = Readonly<{
  /** 0 a 100, como a satisfação de qualquer perfil. */
  satisfacao: number;
  /** Os motivos, do que mais pesa para o que menos pesa. */
  motivos: readonly Motivo[];
}>;

/**
 * O que a pessoa pensa agora: os motivos do perfil dela no eleitorado vivo.
 * As linhas originais do eleitorado vivo ficam nas mesmas posições do pacote
 * fixo, por isso o índice do perfil serve nos dois.
 */
export function opiniaoDaPessoa(
  pessoa: PessoaSorteada,
  vivo: CongressoDoPacote,
  valores: Readonly<Record<string, number>>,
): OpiniaoDaPessoa {
  const perfil = vivo.perfis[pessoa.perfil];
  const motivos = [
    ...motivosDoPerfil(perfil, vivo.pesoDoSegmento, valores),
  ].sort((a, b) => Math.abs(b.pontos) - Math.abs(a.pontos));
  return { satisfacao: satisfacaoDosMotivos(motivos), motivos };
}
