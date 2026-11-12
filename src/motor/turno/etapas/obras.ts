// Etapas do turno: obras. Comportamento em turno.md.
import {
  trabalhoDoAtendimento,
  type RegraDoAtendimento,
} from "../../atendimento";
import type { Estado } from "../../estado";
import type { ValorLei } from "../../leis";
import type { RegraDaMoradia } from "../../moradia";
import { rendaMedia, parteAbaixoDe } from "../../populacao";
import { ritmoDoSetor, trabalhoEmObra } from "../../saneamento";
import type { Regras } from "../regras";

/** Capacidade do setor que constrói: hoje ÷ turno 0. */
export function tamanhoDoSetor(regras: Regras, estado: Estado): number {
  const obras = regras.mercado?.mercado.obras;
  const c = estado.construcoes;
  if (!obras || !c?.inicio[obras.setor]) return 1;
  return (c.prontas[obras.setor] ?? 0) / c.inicio[obras.setor];
}
/** Quanto as obras andam neste turno: casas, rede e hospitais disputam o mesmo setor. */
export function ritmoDasObras(regras: Regras, estado: Estado): number {
  const { saneamento: regra, moradia } = regras;
  const s = estado.saneamento;
  if (!regra || !moradia || !s) return 1;
  return ritmoDoSetor(
    regra,
    tamanhoDoSetor(regras, estado),
    trabalhoEmObra(
      regra,
      moradia.custo_casa,
      estado.moradia?.obras ?? [],
      s.obras,
    ) +
      (regras.atendimento
        ? trabalhoDoAtendimento(
            regras.atendimento,
            estado.atendimento?.obras ?? [],
          )
        : 0),
    s.trabalho_inicial,
  );
}
/** Número da opção em vigor (`valores.parte`); sem a lei, 0. */
export function parteDaLei(
  regras: Regras,
  valores: Record<string, ValorLei>,
  id: string,
  chave = "parte",
): number {
  const lei = regras.leis[id];
  if (lei?.forma !== "opcoes") return 0;
  return lei.opcoes.find((o) => o.id === valores[id])?.valores?.[chave] ?? 0;
}
/** Renda real dos pops: a de hoje e a do turno 0, com as pessoas de hoje. */
function rendasReais({ pops, essenciais, marco }: Estado) {
  const hoje: Record<string, { pessoas: number; renda: number }> = {};
  const inicio: typeof hoje = {};
  for (const [id, { pessoas, renda }] of Object.entries(pops)) {
    const real = (renda * 100) / essenciais.indice_precos;
    hoje[id] = { pessoas, renda: real };
    inicio[id] = { pessoas, renda: marco.renda_pop?.[id] ?? real };
  }
  return { hoje, inicio };
}
/**
 * Parte das famílias que não paga uma conta, a mais que no turno 0. Os mínimos
 * são de renda, em vezes a renda média do turno 0.
 */
export function apertoDoBolso(
  estado: Estado,
  minimo: number,
  minimoInicial: number,
): number {
  const { hoje, inicio } = rendasReais(estado);
  const media = rendaMedia(inicio);
  return (
    parteAbaixoDe(hoje, minimo * media) -
    parteAbaixoDe(inicio, minimoInicial * media)
  );
}
/** Parte das pessoas com renda para pagar um plano de saúde. */
export function comBolsoParaPlano(
  regra: RegraDoAtendimento,
  estado: Estado,
): number {
  const { hoje, inicio } = rendasReais(estado);
  return 1 - parteAbaixoDe(hoje, regra.renda_plano * rendaMedia(inicio));
}
/** Parte das pessoas com salário em folha. */
export const pessoasNaFolha = (
  regra: RegraDoAtendimento,
  pops: Estado["pops"],
  populacao: number,
) =>
  regra.pops_folha.reduce((soma, id) => soma + pops[id].pessoas, 0) / populacao;
/** Índice do emprego informal: a parte das pessoas no pop informal. */
export const indiceDoInformal = (
  regra: RegraDoAtendimento,
  pops: Estado["pops"],
  populacao: number,
) => (pops[regra.pop_informal].pessoas / populacao) * 100;
/** Quanto o preço pesa no bolso, a mais que no turno 0 (motor/moradia). */
export function apertoDaMoradia(
  regra: RegraDaMoradia,
  estado: Estado,
  preco: number,
): number {
  return apertoDoBolso(
    estado,
    regra.renda_por_ponto * preco,
    regra.renda_por_ponto * estado.marco.indices[regra.indice_preco],
  );
}
