/**
 * A hierarquia do governo para a tela: a trindade (presidente do partido,
 * candidato eleito e vice), os ministérios com quem os chefia, as instituições
 * e o ministério responsável por cada lei. Só leitura:
 * o motor já guarda tudo isto; aqui só se junta num formato que a tela lê.
 */
import {
  caixaDaInstituicao,
  caixaDaLei,
  verbaDaInstituicao,
  type Ficha,
} from "../motor";
import type { Partida } from ".";
import { COR_DO_JOGADOR } from "./comeco";
import type { VisaoHierarquia, VisaoPessoa, VisaoTrindade } from "./tiposVisao";

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

  const instituicoes = governo.instituicoes.map((i) => {
    const ministro = caixaDaInstituicao(governo, caixas, i.id)?.id ?? null;
    return {
      id: i.id,
      nome: i.nome,
      ministro,
      poder: ministro ? null : (i.poder ?? null),
      verba: verbaDaInstituicao(partida.regras.leis, partida.estado.leis, i.id),
    };
  });
  const ministros = caixas.map((c) => {
    const ficha = governo.pessoas.find((f) => f.id === c.ministro);
    const dele = instituicoes.filter((i) => i.ministro === c.id);
    return {
      id: c.id,
      nome: c.nome,
      pessoa: ficha ? pessoa(ficha) : null,
      instituicoes: dele.map((i) => i.id),
      verba: dele.reduce((soma, i) => soma + i.verba, 0),
    };
  });
  const ministroDaLei = Object.fromEntries(
    Object.values(partida.regras.leis).flatMap((l) => {
      const caixa = caixaDaLei(governo, caixas, l);
      return caixa ? [[l.id, caixa.id]] : [];
    }),
  );
  return {
    trindade: trindadeDa(partida, governo.pessoas),
    ministros,
    instituicoes,
    ministroDaLei,
  };
}
