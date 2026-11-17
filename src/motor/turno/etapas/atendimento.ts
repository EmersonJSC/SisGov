// Etapas do turno: atendimento. Comportamento em turno.md.
import {
  type AtendimentoNoEstado,
  type RegraDoAtendimento,
  type LeisDoAtendimento,
  andarAtendimento,
  fluxoDeProfissionais,
  indiceDoAtendimento,
  desvioDaRede,
  desigualdadeDaRede,
  fraquezaDaRede,
  indiceDosProfissionais,
} from "../../atendimento";
import type { Estado } from "../../estado";
import type { ValorLei } from "../../leis";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import {
  parteDaLei,
  ritmoDasObras,
  comBolsoParaPlano,
  pessoasNaFolha,
  indiceDoInformal,
} from "./obras";

/** O que as leis pedem à rede de atendimento, em números. */
export function leisDoAtendimento(
  regras: Regras,
  regra: RegraDoAtendimento,
  valores: Record<string, ValorLei>,
): LeisDoAtendimento {
  const verba = valores[regra.lei_verba];
  const basica = valores[regra.lei_basica];
  const soma = (conta: (id: string) => number) =>
    regra.leis_alcance.reduce((total, id) => total + conta(id), 0);
  const alcanceDe = (id: string) => parteDaLei(regras, valores, id, "alcance");
  const alcance = soma(alcanceDe);
  return {
    verba: typeof verba === "number" ? verba : 0,
    abertura: parteDaLei(regras, valores, regra.lei_abertura),
    limite: parteDaLei(regras, valores, regra.lei_limite),
    basica: typeof basica === "number" ? basica : 0,
    alcance,
    fraco:
      alcance > 0
        ? soma(
            (id) => alcanceDe(id) * parteDaLei(regras, valores, id, "fraco"),
          ) / alcance
        : 0,
    abandono: soma((id) => parteDaLei(regras, valores, id, "abandono")),
    seguro: parteDaLei(regras, valores, regra.lei_seguro),
    procura: parteDaLei(regras, valores, regra.lei_gratuidade, "procura"),
    saida: parteDaLei(regras, valores, regra.lei_gratuidade, "saida"),
    cobranca: parteDaLei(regras, valores, regra.lei_cobranca, "cobranca"),
    deducao: parteDaLei(regras, valores, regra.lei_deducao),
    conta: parteDaLei(regras, valores, regra.lei_conta),
    filantropia: parteDaLei(regras, valores, regra.lei_filantropia),
    reserva: parteDaLei(regras, valores, regra.lei_carreira),
    eficiencia:
      parteDaLei(regras, valores, regra.lei_gestao, "eficiencia") +
      parteDaLei(regras, valores, regra.lei_carreira, "eficiencia"),
    disputa: parteDaLei(regras, valores, regra.lei_gestao, "disputa"),
    missao: parteDaLei(regras, valores, regra.lei_missao),
    ambiental: parteDaLei(regras, valores, regra.lei_ambiental),
    programa: parteDaLei(regras, valores, regra.lei_vacina),
    obrigacao: parteDaLei(regras, valores, regra.lei_vacina, "obrigacao"),
    recusa: parteDaLei(regras, valores, regra.lei_recusa),
  };
}
type Regra = RegraDoAtendimento;

/** Parte dos profissionais onde falta atendimento (0 a 1); sem o índice, todos estão. */
export const distribuicaoDe = (
  regra: Regra,
  indices: Record<string, number>,
) =>
  regra.indice_distribuicao && indices[regra.indice_distribuicao] !== undefined
    ? Math.min(1, Math.max(0, indices[regra.indice_distribuicao] / 100))
    : 1;
type Rede = ReturnType<typeof andarAtendimento>;

/** Quem se forma, para ou emigra neste turno (motor/atendimento). */
function fluxoDosProfissionais(
  regras: Regras,
  regra: Regra,
  estado: Estado,
  rede: AtendimentoNoEstado,
  profissionais: number,
  abandono: number,
) {
  const instrucao0 = estado.marco.indices[regra.indice_instrucao];
  const instrucao = estado.jogabilidade[regra.indice_instrucao];
  const renda0 = estado.marco.renda_pop?.[regra.pop_profissionais];
  const pop = estado.pops[regra.pop_profissionais];
  return fluxoDeProfissionais(regra, rede, {
    populacao: estado.essenciais.populacao,
    profissionais,
    instrucao: instrucao0 > 0 ? instrucao / instrucao0 : 1,
    renda: renda0
      ? (pop.renda * 100) / estado.essenciais.indice_precos / renda0
      : 1,
    abandono,
  });
}

/** Quem trocou de pop (formados e parados); o informal anda no passo G. */
function migracaoDoAtendimento(regra: Regra, estado: Estado, troca: number) {
  return {
    ...estado.migracao,
    [regra.pop_profissionais]:
      (estado.migracao?.[regra.pop_profissionais] ?? 0) + troca,
    [regra.pop_origem]: (estado.migracao?.[regra.pop_origem] ?? 0) - troca,
  };
}

/** Os cinco índices que a rede resulta, na ordem que o estado guarda. */
function indicesDaRede(
  regra: Regra,
  estado: Estado,
  rede: Parameters<typeof indiceDoAtendimento>[1],
  profissionais: number,
  missao: number,
  populacao: number,
) {
  return {
    indice: indiceDoAtendimento(regra, rede),
    desvio: desvioDaRede(regra, rede),
    desigualdade: desigualdadeDaRede(regra, rede),
    fraqueza: fraquezaDaRede(regra, rede),
    indice_profissionais: indiceDosProfissionais(
      regra,
      profissionais * (1 - missao),
      populacao,
    ),
    indice_informal: indiceDoInformal(regra, estado.pops, populacao),
  };
}

type Indices = ReturnType<typeof indicesDaRede>;

/** A base dos índices anda o que a rede andou neste turno. */
function baseDoAtendimento(
  regra: Regra,
  base: Record<string, number>,
  antes: AtendimentoNoEstado,
  nova: Rede,
  n: Indices,
) {
  return {
    ...base,
    [regra.indice]: base[regra.indice] + n.indice - antes.indice,
    [regra.indice_profissionais]:
      base[regra.indice_profissionais] +
      n.indice_profissionais -
      antes.indice_profissionais,
    [regra.indice_informal]:
      base[regra.indice_informal] + n.indice_informal - antes.indice_informal,
    [regra.indice_desvio]: base[regra.indice_desvio] + n.desvio - antes.desvio,
    [regra.indice_desigualdade]:
      base[regra.indice_desigualdade] + n.desigualdade - antes.desigualdade,
    [regra.indice_vida]: base[regra.indice_vida] - n.fraqueza + antes.fraqueza,
    [regra.indice_industria]:
      base[regra.indice_industria] - nova.industria + antes.industria,
    [regra.indice_vacina]:
      base[regra.indice_vacina] + (nova.vacina - antes.vacina) * 100,
    [regra.indice_liberdade]:
      base[regra.indice_liberdade] + nova.liberdade - antes.liberdade,
  };
}

/**
 * 6d. Atendimento: vagas, planos e profissionais andam (motor/atendimento). Quem
 * se forma ou para muda de pop; quem emigra sai da população. O que a contagem
 * andou move a base dos índices.
 */
export const atendimento: Etapa = (regras, estado) => {
  const regra = regras.atendimento;
  const obras = regras.mercado?.mercado.obras;
  const s = estado.atendimento;
  const pop = regra && estado.pops[regra.pop_profissionais];
  if (!regra || !obras || !s || !pop) return estado;
  const { populacao } = estado.essenciais;
  const leis = leisDoAtendimento(regras, regra, estado.leis);
  const nova = andarAtendimento(regra, s, {
    populacao,
    leis,
    atraso: estado.jogabilidade[obras.indice_atraso] ?? 0,
    ritmo: ritmoDasObras(regras, estado),
    com_bolso: comBolsoParaPlano(regra, estado),
    na_folha: pessoasNaFolha(regra, estado.pops, populacao),
    profissionais: pop.pessoas,
  });
  const { turmas, formados, param, emigrados } = fluxoDosProfissionais(
    regras,
    regra,
    estado,
    s,
    pop.pessoas,
    leis.abandono,
  );
  const profissionais = pop.pessoas + formados - param - emigrados;
  const novaPopulacao = populacao - emigrados;
  const troca = (formados - param - emigrados) / populacao;
  const novos = indicesDaRede(
    regra,
    estado,
    {
      populacao: novaPopulacao,
      profissionais,
      vagas: nova.vagas,
      planos: nova.planos,
      seguro: nova.seguro,
      alcance: nova.alcance,
      cobertura: nova.cobertura,
      fraco: leis.fraco,
      procura: nova.procura,
      filantropia: nova.filantropia,
      reserva: nova.reserva,
      disputa: nova.disputa,
      missao: nova.missao,
      ambiental: nova.ambiental,
      ambiente: estado.jogabilidade[regra.indice_ambiente],
      distribuicao: distribuicaoDe(regra, estado.jogabilidade),
    },
    profissionais,
    nova.missao,
    novaPopulacao,
  );
  return {
    ...estado,
    essenciais: { ...estado.essenciais, populacao: novaPopulacao },
    migracao: migracaoDoAtendimento(regra, estado, troca),
    atendimento: { ...nova, turmas, ...novos },
    base: baseDoAtendimento(regra, estado.base, s, nova, novos),
  };
};
