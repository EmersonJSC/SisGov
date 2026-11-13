/**
 * Os poderes para a tela, além do Executivo (que é a trindade do partido, em
 * `hierarquia.ts`): o Legislativo, com as cadeiras de cada partido na Câmara e no
 * Senado, e o Judiciário, que o motor ainda não tem. Só leitura.
 */
import type { Partida } from ".";
import { COR_DO_JOGADOR, idDoPartidoDoJogador } from "./comeco";
import { arquivoPais } from "./paises";
import type { VisaoCasa, VisaoPessoa, VisaoPoderes } from "./tiposVisao";

const COR_SEM_PARTIDO = "#8a8a8a";
/** Quantos juízes ocupam a bolha do Judiciário enquanto ele não existe de verdade. */
const JUIZES_DE_MENTIRA = 9;

/** Juízes de mentira: o id é a semente do rosto, então são sempre os mesmos. */
const juizes: readonly VisaoPessoa[] = Array.from(
  { length: JUIZES_DE_MENTIRA },
  (_, i) => ({
    id: `juiz-${i + 1}`,
    nome: `${i % 2 === 0 ? "Juiz" : "Juíza"} ${i + 1}`,
    sexo: i % 2 === 0 ? "m" : "f",
  }),
);

export function poderesDaPartida(partida: Partida): VisaoPoderes | undefined {
  const congresso = partida.regras.congresso;
  if (!congresso) return undefined;
  const doPais = arquivoPais<{
    partidos: { id: string; nome: string; cor?: string }[];
  }>(partida.pais, "congresso").partidos;
  const jogador = partida.opcoes.comeco?.partido;
  const ficha = new Map<string, { nome: string; cor: string }>([
    ...doPais.map(
      (p) => [p.id, { nome: p.nome, cor: p.cor ?? COR_SEM_PARTIDO }] as const,
    ),
    ...(jogador
      ? [
          [
            idDoPartidoDoJogador(jogador.sigla),
            { nome: jogador.nome, cor: COR_DO_JOGADOR },
          ] as const,
        ]
      : []),
  ]);
  const casa = (cadeiras: Readonly<Record<string, number>>): VisaoCasa => {
    const partidos = Object.entries(cadeiras)
      .filter(([, n]) => n > 0)
      .map(([id, n]) => ({
        id,
        nome: ficha.get(id)?.nome ?? id,
        cor: ficha.get(id)?.cor ?? COR_SEM_PARTIDO,
        cadeiras: n,
        governo: id === congresso.governo,
      }))
      .sort((a, b) => b.cadeiras - a.cadeiras);
    return { total: partidos.reduce((s, p) => s + p.cadeiras, 0), partidos };
  };
  return {
    legislativo: {
      camara: casa(
        Object.fromEntries(congresso.partidos.map((p) => [p.id, p.cadeiras])),
      ),
      senado: congresso.senado ? casa(congresso.senado) : null,
      emVotacao: [
        ...new Set(
          [
            ...(partida.estado.congresso?.pauta ?? []),
            ...(partida.estado.congresso?.sancao ?? []),
          ].map((t) => t.lei),
        ),
      ],
    },
    judiciario: { juizes, pronto: false },
  };
}
