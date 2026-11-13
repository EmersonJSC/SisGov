/**
 * A hierarquia do governo para a tela: a trindade (presidente do partido,
 * candidato eleito e vice), os ministérios com quem os chefia, as instituições
 * (um órgão por esfera) e o ministério responsável por cada lei. Só leitura:
 * o motor já guarda tudo isto; aqui só se junta num formato que a tela lê.
 */
import { caixaDaLei, esferasDoMundo, type Ficha } from "../motor";
import moldesDeMinisterio from "../conteudo/mundo/ministerios/moldes.json";
import type { Partida } from ".";
import { COR_DO_JOGADOR } from "./comeco";
import type { VisaoHierarquia, VisaoPessoa, VisaoTrindade } from "./tiposVisao";

const nomesDasEsferas: Readonly<Record<string, string>> =
  moldesDeMinisterio.esferas;

const pessoa = (f: Ficha): VisaoPessoa => ({
  id: f.id,
  nome: f.nome,
  sexo: f.sexo ?? "m",
});

function trindadeDa(
  partida: Partida,
  pessoas: readonly Ficha[],
): VisaoTrindade | null {
  const comeco = partida.opcoes.comeco;
  if (!comeco) return null;
  const achar = (id: string) => pessoas.find((f) => f.id === id);
  const { presidente, candidato, vice } = comeco.chapa;
  const fichas = [achar(presidente), achar(candidato), achar(vice)];
  if (fichas.some((f) => !f)) return null;
  const [a, b, c] = fichas as [Ficha, Ficha, Ficha];
  return {
    sigla: comeco.partido.sigla,
    nome: comeco.partido.nome,
    cor: COR_DO_JOGADOR,
    presidente: pessoa(a),
    candidato: pessoa(b),
    vice: pessoa(c),
  };
}

export function hierarquiaDaPartida(
  partida: Partida,
): VisaoHierarquia | undefined {
  const governo = partida.regras.governo;
  const estado = partida.estado.governo;
  if (!governo || !estado) return undefined;
  const { caixas } = estado;
  const nomesDosMoldes = new Map(governo.moldes.map((m) => [m.id, m.nome]));

  const instituicoes = esferasDoMundo(partida.regras.leis).map((esfera) => ({
    id: esfera,
    nome: nomesDasEsferas[esfera] ?? esfera,
    ministro: caixaDaLei(governo, caixas, { id: esfera, esfera }).molde,
  }));
  const ministros = caixas.map((c) => {
    const ficha = governo.pessoas.find((f) => f.id === c.ministro);
    return {
      id: c.molde,
      nome: nomesDosMoldes.get(c.molde) ?? c.molde,
      pessoa: ficha ? pessoa(ficha) : null,
      instituicoes: instituicoes
        .filter((i) => i.ministro === c.molde)
        .map((i) => i.id),
    };
  });
  const ministroDaLei = Object.fromEntries(
    Object.values(partida.regras.leis).map((l) => [
      l.id,
      caixaDaLei(governo, caixas, l).molde,
    ]),
  );
  return {
    trindade: trindadeDa(partida, governo.pessoas),
    ministros,
    instituicoes,
    ministroDaLei,
  };
}
