// Etapas do turno: Judiciário. Comportamento em motor/judiciario/judiciario.md.
import { novoFato, type Fato } from "../../fatos";
import {
  cartasDaVaga,
  ehVaga,
  envelhecerJuizes,
  pontosDeIndependencia,
  preencherPelaCarreira,
  sentar,
  trocarPresidentes,
  vagasAbertas,
  votoDoSenado,
  type EstadoJudiciario,
  type PedidoIndicar,
} from "../../judiciario";
import type { PapelDeIndicacao } from "../../mesa";
import type { Etapa } from "../comum";

/**
 * 3b. Judiciário: a indicação do jogador passa (ou não) pelo Senado, os
 * juízes envelhecem, quem chega à idade abre vaga, a carreira preenche a vaga
 * se a lei manda, o presidente de cada corte troca pela antiguidade, a
 * independência anda com quem senta, e cada vaga aberta vira papel importante
 * na mesa.
 */
export const judiciario: Etapa = (regras, estado, pedidos) => {
  const r = regras.judiciario;
  const salvo = estado.judiciario;
  if (!r || !salvo) return estado;
  // partida salva antes pode ter tribunal que o país não declara mais
  const inicio: EstadoJudiciario = {
    ...salvo,
    tribunais: Object.fromEntries(
      r.tribunais.map((t) => [t.id, salvo.tribunais[t.id] ?? []]),
    ),
  };
  const governo = regras.congresso?.governo ?? "";
  const senado =
    regras.congresso?.senado ??
    Object.fromEntries(
      (regras.congresso?.partidos ?? []).map((p) => [p.id, p.cadeiras]),
    );
  const modo = r.modos[String(estado.leis[r.lei_escolha])] ?? "senado";
  const base = [governo, ...estado.coligacao];
  const fatos: Fato[] = [];
  const fato = (f: Omit<Fato, "restam" | "turno">) =>
    fatos.push(novoFato({ ...f, turno: estado.turno }));

  const indicacoes = pedidos.filter(
    (p): p is PedidoIndicar => p.tipo === "indicar",
  );
  let j: EstadoJudiciario = indicacoes.reduce((atual, p) => {
    const vaga = atual.tribunais[p.tribunal]?.[p.cadeira];
    if (!vaga || !ehVaga(vaga))
      throw new Error(
        `pedido: a cadeira ${p.cadeira} de "${p.tribunal}" não está vaga`,
      );
    const cartas = cartasDaVaga(
      r,
      governo,
      senado,
      p.tribunal,
      p.cadeira,
      vaga,
    );
    const pessoa = cartas.find((c) => c.id === p.pessoa);
    if (!pessoa)
      throw new Error(`pedido: "${p.pessoa}" não é carta desta vaga`);
    const passa =
      modo !== "senado" ||
      !regras.congresso ||
      votoDoSenado(r, senado, base, pessoa).aprovado;
    if (passa) {
      fato({
        tipo: "juiz-nomeado",
        tamanho: "medio",
        sobre: p.tribunal,
        lado: pessoa.bussola,
      });
      return sentar(atual, p.tribunal, p.cadeira, pessoa, estado.turno);
    }
    fato({ tipo: "indicado-barrado", tamanho: "grande", sobre: p.tribunal });
    return {
      ...atual,
      tribunais: {
        ...atual.tribunais,
        [p.tribunal]: atual.tribunais[p.tribunal].map((c, i) =>
          i === p.cadeira ? { ...vaga, barrados: vaga.barrados + 1 } : c,
        ),
      },
    };
  }, inicio);

  const antes = new Set(
    vagasAbertas(j).map((v) => `${v.tribunal}:${v.cadeira}`),
  );
  j = envelhecerJuizes(r, j, estado.turno);
  vagasAbertas(j)
    .filter((v) => !antes.has(`${v.tribunal}:${v.cadeira}`))
    .forEach((v) =>
      fato({ tipo: "juiz-aposentado", tamanho: "medio", sobre: v.tribunal }),
    );
  if (modo === "carreira") j = preencherPelaCarreira(r, j, estado.turno);
  const presidentes = trocarPresidentes(r, j, estado.turno);
  j = presidentes.estado;
  presidentes.trocas.forEach((t) =>
    fato({
      tipo: "corte-novo-presidente",
      tamanho: "medio",
      sobre: t.tribunal,
    }),
  );

  const indice = r.indice_independencia;
  const pontos =
    pontosDeIndependencia(r, j, governo) -
    pontosDeIndependencia(r, inicio, governo);
  const papeis = vagasAbertas(j).map((v): PapelDeIndicacao => ({
    id: `vaga:${v.tribunal}:${v.cadeira}`,
    familia: "justica",
    tipo: "indicacao",
    tribunal: v.tribunal,
    cadeira: v.cadeira,
    saiu: v.vaga.saiu,
    barrados: v.vaga.barrados,
    cartas: cartasDaVaga(r, governo, senado, v.tribunal, v.cadeira, v.vaga),
    turno: estado.turno,
    prazo: null,
    importante: true,
  }));
  return {
    ...estado,
    judiciario: j,
    base:
      indice in estado.base
        ? { ...estado.base, [indice]: estado.base[indice] + pontos }
        : estado.base,
    mesa: [
      ...(estado.mesa ?? []).filter((p) => p.familia !== "justica"),
      ...papeis,
    ],
    fatos: [...(estado.fatos ?? []), ...fatos],
  };
};
