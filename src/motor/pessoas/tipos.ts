// Tipos do gerador de pessoas. Comportamento em pessoas.md.
import type { PontoBussola } from "../leis";

/** O que o país declara para gerar gente: nomes, tamanho do elenco e quantos são técnicos. */
export interface ModeloDePessoas {
  proprios: { f: string[]; m: string[] };
  sobrenomes: string[];
  /** Quantas pessoas existem no começo da partida. */
  quantidade: number;
  /** Fração delas sem partido (0 a 1). */
  tecnicos: number;
}

/** Um partido como o gerador o vê: quanto pesa e onde fica na bússola. */
export interface PartidoParaPessoas {
  id: string;
  cadeiras: number;
  bussola: PontoBussola;
}

/** Uma caixa de ministério à espera de ministro. */
export interface VagaDeMinistro {
  molde: string;
}
