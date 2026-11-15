// Salvar e carregar a partida como texto. Comportamento em salvar.md.
import { motivoValorInvalido, type Estado, type ValorLei } from "../motor";
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
  // Partida salva antes de a lei mudar (onda das leis): lei que saiu do mundo
  // sai; valor que não serve mais (opção trocada) volta ao valor de partida;
  // as vigentes novas do país que ela não conhecia entram.
  const leisAtuais = (
    salvas: Record<string, ValorLei>,
    novas: Record<string, ValorLei>,
  ) => {
    const serve = ([id, v]: [string, ValorLei]) =>
      id in nova.regras.leis && !motivoValorInvalido(nova.regras.leis[id], v);
    if (Object.entries(salvas).every(serve)) return salvas;
    return Object.fromEntries([
      ...Object.entries(novas).filter(
        ([id]) => !(id in salvas) || !serve([id, salvas[id]]),
      ),
      ...Object.entries(salvas).filter(serve),
    ]);
  };
  const leis = leisAtuais(arquivo.estado.leis, nova.estado.leis);
  const marco = arquivo.estado.marco;
  // Partida salva antes das potências: opiniões de partida do país.
  return {
    ...nova,
    estado: {
      ...arquivo.estado,
      leis,
      marco: {
        ...marco,
        leis: leisAtuais(marco.leis, nova.estado.marco.leis),
      },
      efeitos: arquivo.estado.efeitos.filter((ef) => ef.lei in leis),
      opinioes: arquivo.estado.opinioes ?? nova.estado.opinioes,
      precos: arquivo.estado.precos ?? nova.estado.precos,
      capacidade: arquivo.estado.capacidade ?? nova.estado.capacidade,
      choques: arquivo.estado.choques ?? {},
      fatos: arquivo.estado.fatos ?? [],
      congresso: arquivo.estado.congresso ?? nova.estado.congresso,
      governo: arquivo.estado.governo ?? nova.estado.governo,
      programas: arquivo.estado.programas ?? nova.estado.programas,
      midia: arquivo.estado.midia ?? nova.estado.midia,
    },
  };
}
