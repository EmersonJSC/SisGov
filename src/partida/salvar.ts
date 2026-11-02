// Salvar e carregar a partida como texto. Comportamento em salvar.md.
import type { Estado } from "../motor";
import { criarPartida, type OpcoesPartida, type Partida } from ".";

interface Arquivo {
  versao: 1;
  pais: string;
  semente: number;
  opcoes: OpcoesPartida;
  estado: Estado;
}

export function salvarPartida(partida: Partida): string {
  const arquivo: Arquivo = {
    versao: 1,
    pais: partida.pais,
    semente: partida.semente,
    opcoes: partida.opcoes,
    estado: partida.estado,
  };
  return JSON.stringify(arquivo);
}

export function carregarPartida(texto: string): Partida {
  let arquivo: Partial<Arquivo>;
  try {
    arquivo = JSON.parse(texto) as Partial<Arquivo>;
  } catch {
    throw new Error("partida salva: o texto não é JSON");
  }
  if (arquivo.versao !== 1)
    throw new Error("partida salva › versao: precisa ser 1");
  if (
    typeof arquivo.pais !== "string" ||
    typeof arquivo.semente !== "number" ||
    !arquivo.estado
  )
    throw new Error("partida salva: faltam país, semente ou estado");
  const nova = criarPartida(arquivo.pais, arquivo.semente, arquivo.opcoes);
  // Partida salva antes das potências: opiniões de partida do país.
  return {
    ...nova,
    estado: {
      ...arquivo.estado,
      opinioes: arquivo.estado.opinioes ?? nova.estado.opinioes,
      precos: arquivo.estado.precos ?? nova.estado.precos,
    },
  };
}
