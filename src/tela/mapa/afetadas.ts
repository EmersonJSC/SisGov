/**
 * Quais leis ajudam e quais atrapalham um objeto do mapa. Para um índice, são as
 * leis ligadas a ele: as que o empurram para o lado bom ajudam, as que o empurram
 * para o lado ruim atrapalham. Para um ministério ou uma instituição, são as leis
 * dele, pelo que fazem com os índices do país no todo. Só da tela.
 */
import type { VisaoPartida } from "../../partida";
import { PREFIXO_INSTITUICAO, PREFIXO_MINISTRO } from "./organico";

export type LeiAfetante = Readonly<{
  id: string;
  nome: string;
  /** Quantos índices a lei mexe nesse sentido; mais é mais forte. */
  peso: number;
}>;

export type Afetadas = Readonly<{
  id: string;
  tipo: "indice" | "ministro" | "instituicao";
  nome: string;
  /** Texto curto sobre o que a lista mostra. */
  explicacao: string;
  ajudam: readonly LeiAfetante[];
  atrapalham: readonly LeiAfetante[];
}>;

/** +1 se subir é bom, -1 se subir é ruim. Índice neutro conta como subir é bom. */
function polaridade(avaliacao: string | undefined): 1 | -1 {
  return avaliacao === "maior_pior" ? -1 : 1;
}

function separar(
  leis: readonly Readonly<{ id: string; nome: string }>[],
  nota: (idDaLei: string) => number,
): Pick<Afetadas, "ajudam" | "atrapalham"> {
  const comNota = leis
    .map((l) => ({ id: l.id, nome: l.nome, nota: nota(l.id) }))
    .filter((l) => l.nota !== 0)
    .sort((a, b) => Math.abs(b.nota) - Math.abs(a.nota));
  const comPeso = (l: (typeof comNota)[number]): LeiAfetante => ({
    id: l.id,
    nome: l.nome,
    peso: Math.abs(l.nota),
  });
  return {
    ajudam: comNota.filter((l) => l.nota > 0).map(comPeso),
    atrapalham: comNota.filter((l) => l.nota < 0).map(comPeso),
  };
}

/** `null` se o id não é de um índice, ministério ou instituição. */
export function afetadasDe(visao: VisaoPartida, id: string): Afetadas | null {
  const indices = new Map(
    visao.bolhas.filter((b) => b.tipo !== "grupo").map((b) => [b.id, b]),
  );
  const leisDoMapa = new Map(visao.leis.map((l) => [l.id, l]));
  const ligacoesDeLei = visao.ligacoes.filter(
    (l) => leisDoMapa.has(l.origem) && indices.has(l.alvo),
  );
  const efeito = (idDaLei: string, alvo?: string) =>
    ligacoesDeLei
      .filter((l) => l.origem === idDaLei && (!alvo || l.alvo === alvo))
      .reduce(
        (soma, l) =>
          soma + l.sinal * polaridade(indices.get(l.alvo)?.avaliacao),
        0,
      );

  const indice = indices.get(id);
  if (indice)
    return {
      id,
      tipo: "indice",
      nome: indice.nome,
      explicacao: "Leis que mexem neste índice, para melhor ou para pior.",
      ...separar(
        visao.leis.filter((l) => efeito(l.id, id) !== 0),
        (idDaLei) => efeito(idDaLei, id),
      ),
    };

  const hierarquia = visao.hierarquia;
  if (!hierarquia) return null;
  const ministro = id.startsWith(PREFIXO_MINISTRO)
    ? hierarquia.ministros.find((m) => `${PREFIXO_MINISTRO}${m.id}` === id)
    : undefined;
  if (ministro)
    return {
      id,
      tipo: "ministro",
      nome: ministro.nome,
      explicacao:
        "Leis deste ministério, pelo que fazem com os índices do país.",
      ...separar(
        visao.leis.filter(
          (l) => hierarquia.ministroDaLei[l.id] === ministro.id,
        ),
        (idDaLei) => efeito(idDaLei),
      ),
    };
  const instituicao = id.startsWith(PREFIXO_INSTITUICAO)
    ? hierarquia.instituicoes.find(
        (i) => `${PREFIXO_INSTITUICAO}${i.id}` === id,
      )
    : undefined;
  if (!instituicao) return null;
  return {
    id,
    tipo: "instituicao",
    nome: instituicao.nome,
    explicacao:
      "Leis desta instituição, pelo que fazem com os índices do país.",
    ...separar(
      visao.leis.filter((l) => l.esfera === instituicao.id),
      (idDaLei) => efeito(idDaLei),
    ),
  };
}
