/**
 * Bússola política na tela (V1-10): o ponto do jogador, o caminho, as
 * referências com fonte e as leis que mais puxam o ponto.
 */
import {
  bussolaDoMundo,
  importancia,
  maisProximas,
  pontoAtual,
  referenciasDaBussola,
  rumoDoTurno,
  vetoresDasLeis,
  type Referencia,
} from "../../game/bussola";
import {
  gatilhosAtivos,
  gatilhosDoMundo,
  pontosDasReacoes,
  reacoesDosGrupos,
} from "../../game/gatilhos";
import { pacoteVivo } from "../../game/congresso";
import {
  notasDosMinistros,
  somarPontos,
  somarSatisfacao,
} from "../../game/gabinete";
import {
  descumprimentoDoGoverno,
  perdaDaPromessa,
  pontosDoGoverno,
} from "../../game/promessa";
import type { Partida, VisaoBussola, VisaoReferencia } from "./tipos";

const visaoDa = (r: Referencia): VisaoReferencia => ({
  id: r.id,
  nome: r.nome,
  pais: r.pais,
  // partido: a sigla da pessoa; vazio quando a referência já é o partido
  partido: r.partido ?? "",
  anos: r.anos,
  economia: r.economia,
  costumes: r.costumes,
});

/** Os gatilhos ligados e como cada grupo reage a eles (M7.3). */
export function reacoesDaPartida(partida: Pick<Partida, "content" | "game">) {
  const { content, game } = partida;
  const ativos = game.compass
    ? gatilhosAtivos(
        content,
        game.policies,
        game.compass.caminho,
        game.currentTurn,
      )
    : [];
  const reacoes = reacoesDosGrupos(ativos);
  return { ativos, reacoes, pontos: pontosDasReacoes(reacoes) };
}

const comReacao = new WeakMap<
  object,
  { chave: string; valores: Readonly<Record<string, number>> }
>();

/** A satisfação com a reação dos gatilhos: o que o gabinete lê (M8.3). */
function satisfacaoDaPartida(partida: Pick<Partida, "content" | "game">) {
  const valores = partida.game.execution.values;
  return {
    valores,
    reacao: reacoesDaPartida(partida).pontos,
  };
}

/** A popularidade de cada ministro agora e os grupos leais a ele. */
export function notasDoGabinete(partida: Pick<Partida, "content" | "game">) {
  const { valores, reacao } = satisfacaoDaPartida(partida);
  const pacote = pacoteVivo(
    partida.content,
    valores,
    partida.game.congress?.memoria,
  );
  const ministros = partida.game.election?.ministros;
  if (!ministros || !pacote) return [];
  return notasDosMinistros(ministros, pacote, somarSatisfacao(valores, reacao));
}

/**
 * Os valores do motor com a reação dos gatilhos somada à satisfação dos
 * grupos (0 a 100): é o que a eleição e o Congresso leem como opinião (M7.3).
 * O mesmo objeto volta enquanto a reação não muda, para o eleitorado vivo
 * (guardado por valores) não ser refeito à toa.
 */
export function valoresComReacao(
  partida: Pick<Partida, "content" | "game">,
): Readonly<Record<string, number>> {
  const { valores, reacao } = satisfacaoDaPartida(partida);
  // M8.3: o gabinete lê a satisfação com a reação, e soma por cima
  const gabinete = pontosDoGoverno(
    partida,
    pacoteVivo(partida.content, valores, partida.game.congress?.memoria),
    somarSatisfacao(valores, reacao),
  );
  const pontos = somarPontos(reacao, gabinete);
  const chave = JSON.stringify(pontos);
  if (chave === "{}") return valores;
  const guardado = comReacao.get(valores);
  if (guardado?.chave === chave) return guardado.valores;
  const novos = somarSatisfacao(valores, pontos);
  comReacao.set(valores, { chave, valores: novos });
  return novos;
}

/** Os perfis do eleitorado somados em quadradinhos de meio ponto. */
function populacaoNaBussola(partida: Partida): VisaoBussola["populacao"] {
  const pacote = pacoteVivo(
    partida.content,
    valoresComReacao(partida),
    partida.game.congress?.memoria,
  );
  if (!pacote) return [];
  const celulas = new Map<string, { e: number; c: number; peso: number }>();
  let total = 0;
  for (const perfil of pacote.perfis) {
    const e = Math.round(perfil.ponto.economia * 2) / 2;
    const c = Math.round(perfil.ponto.costumes * 2) / 2;
    const chave = `${e}|${c}`;
    const celula = celulas.get(chave) ?? { e, c, peso: 0 };
    celula.peso += perfil.peso;
    celulas.set(chave, celula);
    total += perfil.peso;
  }
  if (total <= 0) return [];
  return [...celulas.values()].map((celula) => ({
    economia: celula.e,
    costumes: celula.c,
    peso: celula.peso / total,
  }));
}

export function verBussola(partida: Partida): VisaoBussola | undefined {
  const { content, game } = partida;
  const estado = game.compass;
  if (!estado) return undefined;
  const { ativos, reacoes } = reacoesDaPartida(partida);
  const ponto = pontoAtual(content, estado, game.policies);
  const personalidades = referenciasDaBussola.personalidades.map(visaoDa);
  const partidos = referenciasDaBussola.partidos.map(visaoDa);
  const perto = (lista: readonly Referencia[]) =>
    maisProximas(ponto, lista, 5).map((p) => ({
      ...visaoDa(p.referencia),
      distancia: p.distancia,
    }));
  // o que mais puxa: importância × vetor de cada lei em vigor
  const vetores = vetoresDasLeis(content, bussolaDoMundo, game.policies);
  const puxam = content.policies
    .map((policy) => {
      const v = vetores.get(policy.id) ?? [0, 0];
      const peso = importancia(bussolaDoMundo, policy.processoAutorizacao);
      return {
        id: policy.id,
        nome: policy.nome,
        economia: peso * v[0],
        costumes: peso * v[1],
        porque: bussolaDoMundo.leis[policy.id]?.porque ?? "",
      };
    })
    .filter((l) => l.economia !== 0 || l.costumes !== 0)
    .sort(
      (a, b) =>
        Math.hypot(b.economia, b.costumes) - Math.hypot(a.economia, a.costumes),
    )
    .slice(0, 8);
  const descumprido = descumprimentoDoGoverno(partida);
  const perda = descumprido ? perdaDaPromessa(descumprido) : 0;
  const rumo = rumoDoTurno(estado.caminho, referenciasDaBussola.personalidades);
  return {
    ponto,
    inicio: estado.inicio,
    caminho: estado.caminho,
    personalidades,
    partidos,
    pertoPersonalidades: perto(referenciasDaBussola.personalidades),
    pertoPartidos: perto(referenciasDaBussola.partidos),
    leisQueMaisPuxam: puxam,
    fatorDoRumo: bussolaDoMundo.fatorDoRumo,
    populacao: populacaoNaBussola(partida),
    gatilhos: ativos.map(({ id, nome, frase }) => ({ id, nome, frase })),
    reacoes,
    leitura: ativos.length
      ? `O governo é visto assim: ${ativos.map((g) => g.nome.toLowerCase()).join(", ")}.`
      : gatilhosDoMundo.semGatilho,
    ...(descumprido && perda > 0
      ? {
          promessa: {
            eixos: (["economia", "costumes"] as const).filter(
              (e) => descumprido[e] > 0,
            ),
            perda,
          },
        }
      : {}),
    ...(rumo
      ? {
          rumo: {
            referencia: visaoDa(rumo.referencia),
            ...(rumo.antes ? { antes: visaoDa(rumo.antes) } : {}),
          },
        }
      : {}),
    fonte: `${referenciasDaBussola.fonte.nome}; ${referenciasDaBussola.fonte.versao}.`,
    semMedida: referenciasDaBussola.semMedida.map(({ nome, motivo }) => ({
      nome,
      motivo,
    })),
  };
}
