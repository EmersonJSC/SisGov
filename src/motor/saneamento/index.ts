// Rede de água e esgoto: quantas famílias têm a rede na porta, quantas foram
// cortadas por não pagar e quantas ligações estão em obra. O índice sai dessa
// conta; a tarifa pesa no padrão de vida e o esgoto tratado ajuda o meio ambiente.
// O motor não conhece nomes de lei nem de índice. Regras em saneamento.md.
import { atrasoDasObras } from "../mercado/construcoes";

const TURNOS_POR_ANO = 6;

/** O que o mundo declara (`mundo/saneamento/saneamento.json`). */
export interface RegraDoSaneamento {
  indice: string;
  indice_vida: string;
  indice_ambiente: string;
  /** Lei contínua (fração do PIB) com que o governo faz obras. */
  lei_verba: string;
  /** Leis de opções; cada opção traz o número em `valores.parte`. */
  lei_concessao: string;
  lei_teto: string;
  lei_tratamento: string;
  pessoas_por_familia: number;
  /** Preço de uma ligação, em anos de PIB por pessoa. */
  custo_ligacao: number;
  /** Turnos de uma obra da rede, com o setor folgado e sem atraso. */
  prazo: number;
  /** Parte da rede que se perde por ano (0 a 1). */
  desgaste: number;
  /** Parte das famílias que as empresas ligam por ano, com a concessão inteira. */
  concessao_por_ano: number;
  /** Pontos do padrão de vida que a concessão inteira tira, pela tarifa. */
  vida_por_concessao: number;
  /** Pontos do padrão de vida que o teto inteiro dá, pela conta barata. */
  vida_por_teto: number;
  /** Quanto a obra encarece com todo o esgoto tratado (1 = o dobro). */
  custo_tratamento: number;
  /** Pontos do meio ambiente com toda a rede ligada e todo o esgoto tratado. */
  ambiente_por_tratamento: number;
  /** Renda que paga a conta de hoje, em vezes a renda média do turno 0. */
  renda_minima: number;
  /** Quanto a concessão inteira sobe a conta (1 = o dobro). */
  tarifa_por_concessao: number;
  /** Parte de quem não paga que acaba cortada (0 a 1). */
  corte: number;
  /** Parte da distância à conta nova que anda por turno (0 a 1). */
  velocidade: number;
  /** Trabalho que o setor aguenta sem atrasar, em vezes o do turno 0. */
  folga_do_setor: number;
}

export interface ObraDaRede {
  familias: number;
  /** Turnos de trabalho que faltam (pode ser fracionário). */
  falta: number;
}

export interface SaneamentoNoEstado {
  /** Famílias com a rede na porta, cortadas ou não. */
  ligadas: number;
  /** Famílias cortadas por não pagar. */
  cortadas: number;
  /** Parte da rede cortada no turno 0 (0 a 1). */
  parte_cortada: number;
  obras: ObraDaRede[];
  /** Ligações que as operadoras locais começam por turno no ritmo do turno 0. */
  ritmo_local: number;
  /** Pontos de padrão de vida e meio ambiente que a rede já moveu. */
  vida: number;
  ambiente: number;
  /** Obras de casas e rede no turno 0, em anos de PIB por pessoa. */
  trabalho_inicial: number;
}

/** O que as leis em vigor pedem, em números. */
export interface LeisDoSaneamento {
  /** Fração do PIB. */
  verba: number;
  /** Parte das cidades com a rede concedida (0 a 1). */
  concessao: number;
  /** Parte da receita que o teto da tarifa corta (0 a 1). */
  teto: number;
  /** Parte do esgoto que precisa ser tratada (0 a 1). */
  tratamento: number;
}

export interface TurnoDoSaneamento {
  populacao: number;
  leis: LeisDoSaneamento;
  /** Índice de atraso de hoje e do turno 0 (0 a 100). */
  atraso: number;
  atraso_inicial: number;
  /** Capacidade do setor que constrói: hoje ÷ turno 0. */
  setor: number;
  /** Ânimo do investimento (juro e imposto), 0 a 2. */
  animo: number;
  /** Famílias em favela e no campo, onde a empresa só chega por último. */
  sem_lucro: number;
  /** Quanto as obras andam por turno, com o setor cheio (0 a 1). */
  ritmo: number;
  /** Parte das famílias que não paga a conta, a mais que no turno 0 (−1 a 1). */
  aperto: number;
}

const familiasDe = (regra: RegraDoSaneamento, populacao: number) =>
  populacao / regra.pessoas_por_familia;

/** Renda que paga a conta com estas leis, em vezes a renda média do turno 0. */
export const rendaParaAConta = (
  regra: RegraDoSaneamento,
  leis: LeisDoSaneamento,
) =>
  regra.renda_minima *
  (1 + leis.concessao * regra.tarifa_por_concessao) *
  (1 - leis.teto);

/** Quanto a exigência de tratamento encarece cada ligação. */
const custoDoTratamento = (regra: RegraDoSaneamento, tratamento: number) =>
  1 + tratamento * regra.custo_tratamento;

/** Ligações que a verba paga num turno; corrupção e tratamento encarecem. */
function ligacoesDoGoverno(
  regra: RegraDoSaneamento,
  populacao: number,
  leis: LeisDoSaneamento,
  atraso: number,
): number {
  const custo =
    regra.custo_ligacao *
    atrasoDasObras(atraso).custo *
    custoDoTratamento(regra, leis.tratamento);
  return (leis.verba * populacao) / custo / TURNOS_POR_ANO;
}

/** Pontos de padrão de vida que a conta de água move, com as leis de hoje. */
const vidaAlvo = (regra: RegraDoSaneamento, leis: LeisDoSaneamento) =>
  leis.teto * regra.vida_por_teto - leis.concessao * regra.vida_por_concessao;

/** Pontos de meio ambiente que o esgoto tratado dá, com a rede de hoje. */
const ambienteAlvo = (
  regra: RegraDoSaneamento,
  leis: LeisDoSaneamento,
  parteLigada: number,
) => leis.tratamento * parteLigada * regra.ambiente_por_tratamento;

/**
 * Trabalho do setor em obra, em anos de PIB por pessoa: casas e rede disputam
 * as mesmas vagas.
 */
export function trabalhoEmObra(
  regra: RegraDoSaneamento,
  custoCasa: number,
  casas: readonly { casas: number }[],
  rede: readonly ObraDaRede[],
): number {
  const somaCasas = casas.reduce((soma, o) => soma + o.casas, 0);
  const somaRede = rede.reduce((soma, o) => soma + o.familias, 0);
  return somaCasas * custoCasa + somaRede * regra.custo_ligacao;
}

/** Quanto as obras andam por turno: 1 enquanto o setor dá conta, menos quando enche. */
export function ritmoDoSetor(
  regra: RegraDoSaneamento,
  setor: number,
  trabalho: number,
  trabalhoInicial: number,
): number {
  if (trabalho <= 0) return 1;
  return Math.min(
    1,
    (setor * regra.folga_do_setor * trabalhoInicial) / trabalho,
  );
}

/**
 * Rede do turno 0, contada a partir do índice do país. As obras em andamento
 * repõem o desgaste: o país começa parado.
 */
export function saneamentoInicial(
  regra: RegraDoSaneamento,
  pais: {
    populacao: number;
    saneamento: number;
    leis: LeisDoSaneamento;
    atraso: number;
    /** Parte das famílias que não paga a conta (0 a 1). */
    sem_bolso: number;
    /** Obras de casas do turno 0, em anos de PIB por pessoa. */
    trabalho_casas: number;
  },
): SaneamentoNoEstado {
  const total = familiasDe(regra, pais.populacao);
  const atendidas = total * (pais.saneamento / 100);
  const ligadas = Math.min(
    total,
    atendidas / (1 - regra.corte * pais.sem_bolso),
  );
  const reposicao =
    (ligadas * regra.desgaste * (1 + pais.leis.teto)) / TURNOS_POR_ANO;
  const governo = ligacoesDoGoverno(
    regra,
    pais.populacao,
    pais.leis,
    pais.atraso,
  );
  const lento = atrasoDasObras(pais.atraso).prazo;
  const fila: ObraDaRede[] = [];
  for (let t = 1; t <= Math.ceil(regra.prazo * lento); t++)
    fila.push({
      familias: reposicao,
      falta: Math.min(regra.prazo, t / lento),
    });
  return {
    ligadas,
    cortadas: ligadas - atendidas,
    parte_cortada: ligadas > 0 ? 1 - atendidas / ligadas : 0,
    obras: fila,
    ritmo_local: Math.max(0, reposicao - governo),
    vida: vidaAlvo(regra, pais.leis),
    ambiente: ambienteAlvo(regra, pais.leis, pais.saneamento / 100),
    trabalho_inicial: pais.trabalho_casas + trabalhoEmObra(regra, 0, [], fila),
  };
}

/**
 * Um turno: a rede desgasta, as obras prontas entram, governo, operadoras e
 * empresas começam obras novas, quem não paga é cortado, e a conta de água e o
 * esgoto tratado andam.
 */
export function andarSaneamento(
  regra: RegraDoSaneamento,
  s: SaneamentoNoEstado,
  turno: TurnoDoSaneamento,
): SaneamentoNoEstado {
  const { leis } = turno;
  const total = familiasDe(regra, turno.populacao);
  const passo = turno.ritmo / atrasoDasObras(turno.atraso).prazo;
  let ligadas =
    s.ligadas * (1 - (regra.desgaste * (1 + leis.teto)) / TURNOS_POR_ANO);
  const fila: ObraDaRede[] = [];
  for (const obra of s.obras) {
    const falta = obra.falta - passo;
    if (falta <= 1e-9) ligadas += obra.familias;
    else fila.push({ ...obra, falta });
  }
  ligadas = Math.min(total, ligadas);
  const custo =
    (atrasoDasObras(turno.atraso_inicial).custo /
      atrasoDasObras(turno.atraso).custo /
      custoDoTratamento(regra, leis.tratamento)) *
    turno.setor *
    turno.animo;
  const locais = s.ritmo_local * (1 - leis.teto) * custo;
  const governo = ligacoesDoGoverno(regra, turno.populacao, leis, turno.atraso);
  // A empresa vai onde dá lucro: favela e campo ficam fora da conta dela.
  const naFila = fila.reduce((soma, o) => soma + o.familias, 0);
  const vaga = Math.max(0, total - turno.sem_lucro - ligadas - naFila);
  const empresas = Math.min(
    vaga,
    (leis.concessao * regra.concessao_por_ano * total * custo) / TURNOS_POR_ANO,
  );
  fila.push({ familias: locais + governo + empresas, falta: regra.prazo });
  const anda = (de: number, para: number) =>
    de + regra.velocidade * (para - de);
  const parte = Math.min(
    1,
    Math.max(0, s.parte_cortada + regra.corte * turno.aperto),
  );
  const cortadas = Math.min(ligadas, anda(s.cortadas, ligadas * parte));
  return {
    ...s,
    ligadas,
    cortadas,
    obras: fila,
    vida: anda(s.vida, vidaAlvo(regra, leis)),
    ambiente: anda(
      s.ambiente,
      ambienteAlvo(regra, leis, (ligadas - cortadas) / total),
    ),
  };
}

/** Índice contado, em % das famílias. */
export const indiceDoSaneamento = (
  regra: RegraDoSaneamento,
  s: SaneamentoNoEstado,
  populacao: number,
) => ((s.ligadas - s.cortadas) / familiasDe(regra, populacao)) * 100;

/**
 * O que mudar as leis faz, para a ficha: pontos do índice por ano e, quando a
 * conta terminar de andar, pontos dos cortes, do padrão de vida e do meio ambiente.
 */
export function pontosDoSaneamento(
  regra: RegraDoSaneamento,
  antes: LeisDoSaneamento,
  depois: LeisDoSaneamento,
  turno: {
    atraso: number;
    /** Parte das famílias atendida e parte com a rede na porta (0 a 1). */
    parte_ligada: number;
    parte_rede: number;
    ritmo_local: number;
    populacao: number;
    /** Parte das famílias que passa a não pagar a conta, com a lei nova. */
    aperto: number;
  },
) {
  const total = familiasDe(regra, turno.populacao);
  const porAno = (leis: LeisDoSaneamento) =>
    ((ligacoesDoGoverno(regra, turno.populacao, leis, turno.atraso) +
      (turno.ritmo_local * (1 - leis.teto)) /
        custoDoTratamento(regra, leis.tratamento)) *
      TURNOS_POR_ANO) /
      total +
    (leis.concessao * regra.concessao_por_ano) /
      custoDoTratamento(regra, leis.tratamento) -
    turno.parte_rede * regra.desgaste * (1 + leis.teto);
  const paga = turno.parte_rede > 0 ? turno.parte_ligada / turno.parte_rede : 1;
  return {
    indice: (porAno(depois) - porAno(antes)) * paga * 100,
    cortes: -regra.corte * turno.aperto * turno.parte_rede * 100,
    vida: vidaAlvo(regra, depois) - vidaAlvo(regra, antes),
    ambiente:
      ambienteAlvo(regra, depois, turno.parte_ligada) -
      ambienteAlvo(regra, antes, turno.parte_ligada),
  };
}
