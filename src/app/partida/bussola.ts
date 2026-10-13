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
  vetoresDasLeis,
  type Referencia,
} from "../../game/bussola";
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

export function verBussola(partida: Partida): VisaoBussola | undefined {
  const { content, game } = partida;
  const estado = game.compass;
  if (!estado) return undefined;
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
    fonte: `${referenciasDaBussola.fonte.nome}; ${referenciasDaBussola.fonte.versao}.`,
    semMedida: referenciasDaBussola.semMedida.map(({ nome, motivo }) => ({
      nome,
      motivo,
    })),
  };
}
