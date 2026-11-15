// Etapas do turno: populacao. Comportamento em turno.md.
import type { Estado } from "../../estado";
import {
  type Marco,
  calcularGrupos,
  gruposComDeslize,
  deslizarPops,
} from "../../grupos";
import { vazamento } from "../../fisco";
import { magoasDoGoverno } from "../../governo";
import { migrarSetores } from "../../mercado";
import { posicaoDoPais } from "../../mundo";
import {
  type Pop,
  type Estrato,
  calcularPops,
  migrarPops,
} from "../../populacao";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import { doTurno, gastoPorLei, impostoPorEstrato } from "./economia";
import { todosIndices, comIndicesDasCestas } from "./jogabilidade";

/**
 * Dinheiro das leis de transferência que chega a cada estrato, por ano. O
 * gasto vale com a escala das outras leis (motor/contas); a lei com pesos
 * divide entre os estratos; a cobertura da transferência (motor/fisco) manda
 * ao estrato de cima a parte que passa dos pobres.
 */
export function transferenciasPorEstrato(
  regras: Regras,
  estado: Estado,
): Partial<Record<Estrato, number>> {
  const e = estado.essenciais;
  const gasto = gastoPorLei(regras, estado.leis, estado.fiscal?.corte);
  const total: Partial<Record<Estrato, number>> = {};
  const somar = (es: Estrato, v: number) => (total[es] = (total[es] ?? 0) + v);
  for (const id of Object.keys(estado.leis)) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.para) continue;
    const dinheiro = ((gasto[id] ?? 0) / 100) * e.pib_nominal;
    if ("pesos" in lei.para) {
      const pesos = Object.entries(lei.para.pesos) as [Estrato, number][];
      const soma = pesos.reduce((s, [, p]) => s + p, 0);
      for (const [es, p] of pesos) somar(es, (dinheiro * p) / soma);
    } else {
      const vaza = vazamentoDaTransferencia(regras, estado, lei.para.estrato);
      somar(lei.para.estrato, dinheiro * (1 - vaza.parte));
      if (vaza.para) somar(vaza.para, dinheiro * vaza.parte);
    }
  }
  return total;
}
/**
 * Parte da transferência de um estrato que vaza para o de cima: a cobertura
 * (motor/fisco) passa da parte da população que é daquele estrato.
 */
function vazamentoDaTransferencia(
  regras: Regras,
  estado: Estado,
  estrato: Estrato,
): { parte: number; para?: Estrato } {
  const t = regras.fisco?.transferencia;
  if (!t || t.estrato !== estrato) return { parte: 0 };
  const cobertura = estado.leis[t.lei_cobertura];
  const parteDoEstrato = regras.pops
    .filter((p) => p.estrato === estrato)
    .reduce((s, p) => s + (regras.pais.pops[p.id]?.parcela_pessoas ?? 0), 0);
  return {
    parte: vazamento(
      typeof cobertura === "number" ? cobertura : undefined,
      parteDoEstrato,
    ),
    para: t.vaza_para,
  };
}
/** Renda dos pops com as leis e o PIB do estado (motor/populacao). */
export function pops(regras: Regras, estado: Estado): Record<string, Pop> {
  const e = estado.essenciais;
  const transferencias = transferenciasPorEstrato(regras, estado);
  return calcularPops(regras.pops, regras.pais.pops, {
    populacao: e.populacao,
    pib_nominal: e.pib_nominal,
    imposto_renda: 0,
    impostos: impostoPorEstrato(regras, estado.leis, e),
    transferencias,
    migracao: estado.migracao,
  });
}
/** Quanto a renda real cresce no ritmo normal do país desde o turno 0. */
const rendaEsperada = (regras: Regras, estado: Estado) =>
  Math.pow(doTurno(regras.pais.crescimento.tendencia), estado.turno);
/** Grupos com os pops já calculados no estado (motor/grupos). */
export function grupos(regras: Regras, estado: Estado, marco: Marco) {
  return calcularGrupos(
    gruposComDeslize(regras.grupos, estado.pops, estado.deslize),
    regras.leis,
    {
      pops: estado.pops,
      indice_precos: estado.essenciais.indice_precos,
      indices: todosIndices(estado),
      vigentes: estado.leis,
      marco,
      esperado: rendaEsperada(regras, estado),
      anteriores: estado.turno === 0 ? undefined : estado.grupos,
      magoas: estado.governo
        ? magoasDoGoverno(estado.governo, estado.turno)
        : [],
    },
  );
}
/** Pops andam na bússola com a vida e com o governo (motor/grupos). */
export function deslize(regras: Regras, estado: Estado) {
  return deslizarPops(regras.pops, estado.deslize, {
    pops: estado.pops,
    grupos: estado.grupos,
    tipos: regras.grupos,
    pais: posicaoDoPais(regras.leis, estado.leis),
    indice_precos: estado.essenciais.indice_precos,
    esperado: rendaEsperada(regras, estado),
    marco: estado.marco,
  });
}
/** Gente sobe e desce de estrato com a renda e a instrução (motor/populacao). */
export function migracao(regras: Regras, estado: Estado) {
  return migrarPops(regras.pops, regras.pais.pops, estado.migracao, {
    pops: estado.pops,
    populacao: estado.essenciais.populacao,
    renda_pop: estado.marco.renda_pop,
    indice_precos: estado.essenciais.indice_precos,
    esperado: rendaEsperada(regras, estado),
    indices: todosIndices(estado),
  });
}
/** Gente estuda e muda para o setor que paga mais (motor/mercado/emprego). */
export function setores(regras: Regras, estado: Estado) {
  const m = regras.mercado;
  if (!m) return estado.setores;
  return migrarSetores(
    m.mercado,
    m.ocupacao,
    estado.setores,
    estado.pops,
    todosIndices(estado),
  );
}
/** 8. Pops e grupos: renda dos pops, depois satisfação dos grupos. */
export const popsEGrupos: Etapa = (regras, estado) => {
  const comPops = comIndicesDasCestas(regras, {
    ...estado,
    pops: pops(regras, estado),
  });
  const comGrupos = {
    ...comPops,
    grupos: grupos(regras, comPops, estado.marco),
  };
  return {
    ...comGrupos,
    deslize: deslize(regras, comGrupos),
    migracao: migracao(regras, comGrupos),
    setores: setores(regras, comGrupos),
  };
};
