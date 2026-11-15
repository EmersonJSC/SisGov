// Etapas do turno: populacao. Comportamento em turno.md.
import type { Estado } from "../../estado";
import {
  type Marco,
  calcularGrupos,
  gruposComDeslize,
  deslizarPops,
} from "../../grupos";
import { vazamento } from "../../fisco";
import { desvioDosOrgaos, magoasDoGoverno } from "../../governo";
import { lucroDosSetores, migrarSetores, precoDosSetores } from "../../mercado";
import { posicaoDoPais } from "../../mundo";
import type { ValorLei } from "../../leis";
import {
  type FontesDaRenda,
  type Pop,
  type Estrato,
  calcularPops,
  andarDemografia,
  andarEmprego,
  migrarNaFaixa,
  migrarPops,
  pedacos,
  taxaDeDesemprego,
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
  return transferencias(regras, estado).estratos;
}
/** Dinheiro das transferências por estrato e por pop (lei com `para.pop`), por ano. */
export function transferencias(
  regras: Regras,
  estado: Estado,
): {
  estratos: Partial<Record<Estrato, number>>;
  pops: Record<string, number>;
} {
  const e = estado.essenciais;
  const gasto = gastoPorLei(regras, estado.leis, estado.fiscal?.corte);
  const total: Partial<Record<Estrato, number>> = {};
  const pops: Record<string, number> = {};
  const somar = (es: Estrato, v: number) => (total[es] = (total[es] ?? 0) + v);
  for (const id of Object.keys(estado.leis)) {
    const lei = regras.leis[id];
    if (lei.forma !== "continua" || !lei.para) continue;
    const dinheiro = ((gasto[id] ?? 0) / 100) * e.pib_nominal;
    if ("pop" in lei.para) {
      pops[lei.para.pop] = (pops[lei.para.pop] ?? 0) + dinheiro;
    } else if ("pesos" in lei.para) {
      const pesos = Object.entries(lei.para.pesos) as [Estrato, number][];
      const soma = pesos.reduce((s, [, p]) => s + p, 0);
      for (const [es, p] of pesos) somar(es, (dinheiro * p) / soma);
    } else {
      const vaza = vazamentoDaTransferencia(regras, estado, lei.para.estrato);
      somar(lei.para.estrato, dinheiro * (1 - vaza.parte));
      if (vaza.para) somar(vaza.para, dinheiro * vaza.parte);
    }
  }
  // Seguro-desemprego do turno passado vai aos desempregados (passo C).
  const r = regras.emprego;
  const seguro = estado.emprego?.seguro ?? 0;
  if (r && seguro > 0)
    pops[r.desempregados] =
      (pops[r.desempregados] ?? 0) + (seguro / 100) * e.pib_nominal;
  return { estratos: total, pops };
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
  const parteDoEstrato = regras.pops.reduce(
    (s, p) =>
      s +
      pedacos(p)
        .filter(([e]) => e === estrato)
        .reduce(
          (a, [, pp]) =>
            a + (regras.pais.pops[p.id]?.parcela_pessoas ?? 0) * pp,
          0,
        ),
    0,
  );
  return {
    parte: vazamento(
      typeof cobertura === "number" ? cobertura : undefined,
      parteDoEstrato,
    ),
    para: t.vaza_para,
  };
}
/** Gasto do Estado que paga gente (fora as transferências), em % do PIB. */
function gastoComPessoal(
  regras: Regras,
  leis: Record<string, ValorLei>,
  corte?: number,
): number {
  let total = regras.pais.gasto_fora_das_leis;
  for (const [id, v] of Object.entries(gastoPorLei(regras, leis, corte))) {
    const lei = regras.leis[id];
    if (lei?.forma === "continua" && !lei.para) total += v;
  }
  return total;
}
/**
 * De onde vem a renda de cada pop (GDD 2.1, 15/nov): salário e lucro dos
 * setores onde trabalha, salário do Estado e o que outros pops pagam. No
 * turno 0 toda fonte vale 1; depois o salário anda com a capacidade do setor,
 * o lucro com a receita menos os salários, o Estado com o gasto com pessoal e
 * quem é pago por outros com a renda de quem paga (no turno anterior).
 */
export function fontesDaRenda(
  regras: Regras,
  estado: Estado,
): FontesDaRenda | undefined {
  const m = regras.mercado;
  if (!m) return undefined;
  const partes: FontesDaRenda["partes"] = {};
  for (const t of regras.pops) {
    const p: Record<string, number> = {};
    const publico = t.publico ?? 0;
    if (publico > 0) p.estado = publico;
    const resto = 1 - publico;
    const o = m.ocupacao[t.id];
    const setores = estado.setores?.[t.id] ?? o?.setores ?? {};
    if (resto > 0 && o && Object.keys(setores).length > 0) {
      for (const [s, peso] of Object.entries(setores)) {
        const sal = resto * peso * (1 - o.capital);
        const luc = resto * peso * o.capital;
        if (sal > 0) p[`salario:${s}`] = (p[`salario:${s}`] ?? 0) + sal;
        if (luc > 0) p[`lucro:${s}`] = (p[`lucro:${s}`] ?? 0) + luc;
      }
    } else if (resto > 0 && t.pago_por) {
      const pesos = Object.entries(t.pago_por) as [Estrato, number][];
      const soma = pesos.reduce((a, [, v]) => a + v, 0);
      for (const [e, v] of pesos) p[`pago:${e}`] = (resto * v) / soma;
    }
    if (Object.keys(p).length > 0) {
      const usado = Object.values(p).reduce((a, v) => a + v, 0);
      if (usado < 1 - 1e-9) p.fixa = 1 - usado;
      partes[t.id] = p;
    }
  }

  // Desvio: a corrupção dos órgãos tira da verba e vira renda de quem recebe.
  // A parte do pop vai por unidade do PIB; a fonte vale o desvio de hoje.
  const governo = estado.governo;
  const recebem = regras.pops.filter((t) => (t.desvio ?? 0) > 0);
  const pesoDoDesvio = recebem.reduce((a, t) => a + (t.desvio ?? 0), 0);
  const comDesvio = governo !== undefined && pesoDoDesvio > 0;
  const desvio0 = (governo?.desvio_inicial ?? 0) / 100;
  const desvio = !comDesvio
    ? 0
    : estado.turno === 0
      ? desvio0
      : desvioDosOrgaos(regras.leis, estado.leis, governo.orgaos) / 100;
  if (comDesvio)
    for (const t of recebem) {
      const renda = regras.pais.pops[t.id]?.parcela_renda ?? 0;
      if (!(renda > 0)) continue;
      const porUnidade = (t.desvio ?? 0) / pesoDoDesvio / renda;
      const p = partes[t.id] ?? { fixa: 1 };
      const escala = Math.max(0, 1 - porUnidade * desvio0);
      for (const k of Object.keys(p)) p[k] *= escala;
      p.desvio = porUnidade;
      partes[t.id] = p;
    }

  const indice: Record<string, number> = comDesvio ? { desvio } : {};
  // No turno 0 as outras fontes valem 1 (o marco ainda é provisório).
  if (estado.turno === 0) return { partes, indice };
  const c = estado.construcoes;
  if (c && estado.marco) {
    // O salário segue a capacidade do setor e o nível geral de preços. O lucro
    // é a receita menos esses salários; na receita só conta o preço do setor
    // contra a média dos setores (a inflação comum não mexe no lucro).
    const geral =
      estado.essenciais.indice_precos /
      (estado.marco.indices.indice_precos ?? 100);
    const preco = precoDosSetores(m.mercado, estado.precos);
    const razao = (s: string) => {
      const p0 = c.lucro?.preco0[s] ?? 0;
      return p0 > 0 ? (preco[s] ?? p0) / p0 : 1;
    };
    let pesos = 0;
    let media = 0;
    for (const [s, inicio] of Object.entries(c.inicio)) {
      pesos += inicio;
      media += inicio * razao(s);
    }
    media = pesos > 0 ? media / pesos : 1;
    for (const [s, inicio] of Object.entries(c.inicio)) {
      if (!(inicio > 0)) continue;
      const parte = (c.prontas[s] ?? 0) / inicio;
      indice[`salario:${s}`] = parte * geral;
      const salario0 = c.lucro?.salarios[s] ?? 0;
      const lucro0 = inicio - salario0;
      if (!(lucro0 > 0)) continue;
      const lucro = (inicio * (razao(s) / media) - salario0) * parte * geral;
      indice[`lucro:${s}`] = Math.max(0, lucro) / lucro0;
    }
  }
  if (estado.marco) {
    // O que é desviado não paga ninguém do Estado.
    const antes = gastoComPessoal(regras, estado.marco.leis) - desvio0 * 100;
    if (antes > 0)
      indice.estado =
        (gastoComPessoal(regras, estado.leis, estado.fiscal?.corte) -
          desvio * 100) /
        antes;
  }
  // Quem paga gasta da renda disponível (já com imposto e transferência): a
  // parte de cada estrato nela hoje contra a do turno 0.
  const renda0 = estado.marco?.renda_pop;
  if (renda0 && estado.pops) {
    const antes: Partial<Record<Estrato, number>> = {};
    const hoje: Partial<Record<Estrato, number>> = {};
    let totalAntes = 0;
    let totalHoje = 0;
    for (const t of regras.pops) {
      const pop = estado.pops[t.id];
      const r0 =
        (renda0[t.id] ?? 0) * (regras.pais.pops[t.id]?.parcela_pessoas ?? 0);
      const r = pop ? pop.pessoas * pop.renda : 0;
      for (const [e, , pr] of pedacos(t)) {
        antes[e] = (antes[e] ?? 0) + r0 * pr;
        hoje[e] = (hoje[e] ?? 0) + r * pr;
      }
      totalAntes += r0;
      totalHoje += r;
    }
    if (totalAntes > 0 && totalHoje > 0)
      for (const [e, a0] of Object.entries(antes) as [Estrato, number][])
        if (a0 > 0)
          indice[`pago:${e}`] = (hoje[e] ?? 0) / totalHoje / (a0 / totalAntes);
  }
  return { partes, indice };
}
/** Renda dos pops com as leis e o PIB do estado (motor/populacao). */
export function pops(regras: Regras, estado: Estado): Record<string, Pop> {
  const e = estado.essenciais;
  const t = transferencias(regras, estado);
  return calcularPops(regras.pops, regras.pais.pops, {
    populacao: e.populacao,
    pib_nominal: e.pib_nominal,
    imposto_renda: 0,
    impostos: impostoPorEstrato(regras, estado.leis, e),
    transferencias: t.estratos,
    transferencias_pop: t.pops,
    migracao: estado.migracao,
    fontes: fontesDaRenda(regras, estado),
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
  const entrada = {
    pops: estado.pops,
    populacao: estado.essenciais.populacao,
    renda_pop: estado.marco.renda_pop,
    indice_precos: estado.essenciais.indice_precos,
    esperado: rendaEsperada(regras, estado),
    indices: todosIndices(estado),
  };
  // Sobe e desce de estrato; depois troca na mesma faixa.
  const subiu = migrarPops(
    regras.pops,
    regras.pais.pops,
    estado.migracao,
    entrada,
  );
  const trocou = migrarNaFaixa(regras.pops, regras.pais.pops, subiu, entrada);
  // Ciclo da vida (passo E): a idade mínima de aposentadoria é a tomada.
  const d = regras.demografia;
  if (!d) return trocou;
  const idade = (leis: Record<string, unknown>) => {
    const v = d.lei_idade ? leis[d.lei_idade] : undefined;
    return typeof v === "number" ? v : 0;
  };
  return andarDemografia(
    regras.pops,
    regras.pais.pops,
    d,
    trocou,
    idade(estado.leis) - idade(estado.marco.leis),
  );
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
  return empregoDoTurno(regras, {
    ...comGrupos,
    deslize: deslize(regras, comGrupos),
    migracao: migracao(regras, comGrupos),
    setores: setores(regras, comGrupos),
  });
};
/**
 * Vagas de cada pop contra o turno 0: a capacidade dos setores onde ele
 * trabalha, dividida pelo crescimento normal do país. A parte paga pelo Estado
 * não perde vaga.
 */
export function vagasDosPops(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  const m = regras.mercado;
  const c = estado.construcoes;
  if (!m || !c) return {};
  const esperado = rendaEsperada(regras, estado);
  const vagas: Record<string, number> = {};
  for (const t of regras.pops) {
    const o = m.ocupacao[t.id];
    const setores = estado.setores?.[t.id] ?? o?.setores ?? {};
    let v = 0;
    let soma = 0;
    for (const [s, peso] of Object.entries(setores)) {
      const inicio = c.inicio[s] ?? 0;
      if (!(inicio > 0)) continue;
      v += (peso * (c.prontas[s] ?? 0)) / inicio;
      soma += peso;
    }
    if (!(soma > 0)) continue;
    const publico = t.publico ?? 0;
    vagas[t.id] = publico + ((1 - publico) * v) / soma / esperado;
  }
  return vagas;
}
/**
 * Passo C: vagas mandam gente para os desempregados e de volta; o índice
 * Desemprego anda o que a taxa andou; o seguro dos demitidos recentes sai do
 * gasto e vai aos desempregados no turno seguinte.
 */
export function empregoDoTurno(regras: Regras, estado: Estado): Estado {
  const r = regras.emprego;
  if (!r || !estado.pops[r.desempregados]) return estado;
  const e = estado.essenciais;
  const pessoas = (f: (id: string) => number) =>
    Object.fromEntries(regras.pops.map((t) => [t.id, f(t.id)]));
  const base = estado.emprego ?? {
    fora: {},
    demitidos: [],
    seguro: 0,
    taxa0: taxaDeDesemprego(
      r,
      pessoas((id) => regras.pais.pops[id]?.parcela_pessoas ?? 0),
    ),
    desemprego0: e.desemprego,
    ocupados0: e.ocupados,
  };
  const andou = andarEmprego(
    regras.pais.pops,
    r,
    base,
    estado.migracao,
    vagasDosPops(regras, estado),
  );
  const numero = (id: string | undefined) => {
    const v = id ? estado.leis[id] : undefined;
    return typeof v === "number" ? v : 0;
  };
  // Duração em meses; o turno tem 2.
  const turnos = Math.ceil(numero(r.lei_duracao) / 2);
  const recentes = andou.demitidos.slice(0, turnos).reduce((a, v) => a + v, 0);
  const taxa = taxaDeDesemprego(
    r,
    pessoas((id) => estado.pops[id]?.pessoas ?? 0),
  );
  return {
    ...estado,
    migracao: andou.migracao,
    emprego: {
      ...base,
      fora: andou.fora,
      demitidos: andou.demitidos,
      // O demitido recebe a parte do salário médio (o PIB por pessoa).
      seguro: 100 * numero(r.lei_valor) * recentes,
    },
    essenciais: {
      ...e,
      desemprego: Math.max(0, base.desemprego0 + (taxa - base.taxa0) * 100),
      ocupados:
        base.taxa0 < 1
          ? (base.ocupados0 * (1 - taxa)) / (1 - base.taxa0)
          : base.ocupados0,
    },
  };
}
