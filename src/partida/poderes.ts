/**
 * Os poderes para a tela, além do Executivo (que é a trindade do partido, em
 * `hierarquia.ts`): o Legislativo, com as cadeiras de cada partido na Câmara e no
 * Senado, e o Judiciário, com os juízes da corte suprema. Só leitura.
 */
import type { Partida } from ".";
import { COR_DO_JOGADOR, idDoPartidoDoJogador } from "./comeco";
import { arquivoPais } from "./paises";
import { ehVaga, type Ficha, type Vaga } from "../motor";
import type {
  VisaoCasa,
  VisaoJuiz,
  VisaoPoderes,
  VisaoTribunal,
} from "./tiposVisao";

const COR_SEM_PARTIDO = "#8a8a8a";
/** Quantos juízes ocupam a bolha do Judiciário quando o país não tem Judiciário. */
const JUIZES_DE_MENTIRA = 9;
const COR_DO_TECNICO = "#efe4cc";

/** Rostos só para ocupar o lugar: o id é a semente do rosto, então são sempre os mesmos. */
const juizesDeMentira: readonly VisaoJuiz[] = Array.from(
  { length: JUIZES_DE_MENTIRA },
  (_, i) => ({
    id: `juiz-${i + 1}`,
    nome: `${i % 2 === 0 ? "Juiz" : "Juíza"} ${i + 1}`,
    sexo: i % 2 === 0 ? "m" : "f",
    tribunal: "",
    rotulo: "",
    cor: COR_DO_TECNICO,
    vaga: false,
  }),
);

/** A corte suprema: o tribunal constitucional. Só ela fica na órbita. */
function corteSuprema(partida: Partida) {
  return partida.regras.judiciario?.tribunais.find(
    (t) => t.funcao === "constitucional",
  );
}

/** A corte suprema e os tribunais que tiram dela o presidente, cada um com quem preside. */
function tribunaisDaOrbita(partida: Partida): VisaoTribunal[] {
  const r = partida.regras.judiciario;
  const j = partida.estado.judiciario;
  const suprema = corteSuprema(partida);
  if (!r || !j || !suprema) return [];
  return r.tribunais
    .filter((t) => t.id === suprema.id || t.presidido_por === suprema.id)
    .map((t) => ({
      id: t.id,
      rotulo: t.rotulo,
      presidente: j.presidencia?.[t.id]?.id ?? null,
    }));
}

/** O tribunal que cuida das eleições, se está no miolo; senão, a corte suprema. */
function tribunalEleitoral(
  partida: Partida,
  tribunais: readonly VisaoTribunal[],
): string | undefined {
  const eleitoral = partida.regras.judiciario?.tribunais.find(
    (t) => t.funcao === "eleitoral",
  );
  return tribunais.some((t) => t.id === eleitoral?.id)
    ? eleitoral?.id
    : corteSuprema(partida)?.id;
}

/** Os juízes da corte suprema, cadeira a cadeira. */
function juizesDoMotor(
  partida: Partida,
  cor: (origem: string) => string,
): VisaoJuiz[] {
  const j = partida.estado.judiciario;
  const suprema = corteSuprema(partida);
  if (!suprema || !j) return [];
  return [suprema].flatMap((t) => {
    const cadeiras = j.tribunais[t.id] ?? [];
    const rosto = (c: Ficha | Vaga, i: number): VisaoJuiz =>
      ehVaga(c)
        ? {
            id: `vaga:${t.id}:${i}`,
            nome: `Cadeira vaga (saiu ${c.saiu})`,
            sexo: "f",
            tribunal: t.id,
            rotulo: t.rotulo,
            cor: COR_DO_TECNICO,
            vaga: true,
          }
        : {
            id: c.id,
            nome: c.nome,
            sexo: c.sexo ?? "m",
            tribunal: t.id,
            rotulo: t.rotulo,
            cor: c.origem === "tecnico" ? COR_DO_TECNICO : cor(c.origem),
            vaga: false,
          };
    return cadeiras.map(rosto);
  });
}

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
  const tribunais = tribunaisDaOrbita(partida);
  const juizesReais = juizesDoMotor(
    partida,
    (origem) => ficha.get(origem)?.cor ?? COR_SEM_PARTIDO,
  );
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
    judiciario: juizesReais.length
      ? {
          juizes: juizesReais,
          pronto: true,
          tribunais,
          eleitoral: tribunalEleitoral(partida, tribunais),
        }
      : { juizes: juizesDeMentira, pronto: false },
  };
}
