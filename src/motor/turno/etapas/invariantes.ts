// Etapas do turno: invariantes. Comportamento em turno.md.
import type { Estado } from "../../estado";
import { motivoFatoInvalido } from "../../fatos";
import { motivoValorInvalido } from "../../leis";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";

/** Cada conferência devolve as falhas que achou; vazio = tudo certo. */
type Conferencia = (regras: Regras, estado: Estado) => string[];

const se = (falhou: boolean, mensagem: string): string[] =>
  falhou ? [mensagem] : [];
const finitos = (o: object) => Object.values(o).every(Number.isFinite);
const entre = (v: number, min: number, max: number) => v >= min && v <= max;

const contas: Conferencia = (_, { essenciais: e, tesouro }) => [
  ...Object.entries(e)
    .filter(([, v]) => !Number.isFinite(v))
    .map(([id]) => `${id} não é número finito`),
  ...se(e.ocupados > e.populacao, "ocupados > população"),
  ...se(tesouro.cofre < 0, "cofre negativo"),
  ...se(tesouro.divida < 0, "dívida negativa"),
];

const indicesELeis: Conferencia = (regras, estado) => [
  ...Object.entries(estado.jogabilidade).flatMap(([id, v]) => {
    const { min, max } = regras.dominios[id];
    return se(!entre(v, min, max), `${id} fora de ${min}–${max}`);
  }),
  ...Object.entries(estado.leis).flatMap(([id, valor]) => {
    const motivo = motivoValorInvalido(regras.leis[id], valor);
    return motivo ? [`lei ${id} ${motivo}`] : [];
  }),
];

const populacao: Conferencia = (_, estado) => {
  const pessoas = Object.values(estado.pops).reduce((s, p) => s + p.pessoas, 0);
  return [
    ...se(
      Math.abs(pessoas - estado.essenciais.populacao) > 1,
      "pops não somam a população",
    ),
    ...Object.entries(estado.pops).flatMap(([id, p]) =>
      se(!finitos(p) || p.renda < 0, `pop ${id} com renda inválida`),
    ),
    ...Object.entries(estado.grupos).flatMap(([id, g]) =>
      se(
        !finitos(g) ||
          !entre(g.satisfacao, 0, 100) ||
          g.radicais < 0 ||
          g.lealistas < 0 ||
          g.radicais + g.lealistas > 100,
        `grupo ${id} inválido`,
      ),
    ),
  ];
};

const poder: Conferencia = (regras, estado) => [
  ...se(
    !!regras.congresso && !estado.coligacao.includes(regras.congresso.governo),
    "coligação sem o governo",
  ),
  ...Object.entries(estado.opinioes).flatMap(([id, v]) =>
    se(
      !(Number.isFinite(v) && entre(v, 0, 100)),
      `opinião de ${id} fora de 0–100`,
    ),
  ),
  ...se(
    !(Number.isFinite(estado.desgaste) && estado.desgaste >= 0),
    "desgaste inválido",
  ),
];

const servicos: Conferencia = (_, { moradia, saneamento, atendimento }) => [
  ...se(
    !!moradia &&
      !(
        finitos([moradia.formais, moradia.precarias]) &&
        moradia.formais >= 0 &&
        moradia.precarias >= 0
      ),
    "estoque de casas inválido",
  ),
  ...se(
    !!saneamento &&
      !(
        finitos([saneamento.ligadas, saneamento.cortadas]) &&
        saneamento.cortadas >= 0 &&
        saneamento.ligadas >= saneamento.cortadas
      ),
    "rede de saneamento inválida",
  ),
  ...se(
    !!atendimento &&
      !(
        finitos([atendimento.vagas, atendimento.planos]) &&
        atendimento.vagas >= 0 &&
        atendimento.planos >= 0
      ),
    "rede de atendimento inválida",
  ),
];

const fatos: Conferencia = (_, estado) =>
  (estado.fatos ?? []).flatMap((f) => {
    const motivo = motivoFatoInvalido(f);
    return motivo ? [`fato: ${motivo}`] : [];
  });

const CONFERENCIAS: Conferencia[] = [
  contas,
  indicesELeis,
  populacao,
  poder,
  servicos,
  fatos,
];

/** 10. Invariantes: falhou, para com erro. */
export const invariantes: Etapa = (regras, estado) => {
  const falhas = CONFERENCIAS.flatMap((conferir) => conferir(regras, estado));
  if (falhas.length > 0)
    throw new Error(
      `invariante no turno ${estado.turno}: ${falhas.join("; ")}`,
    );
  return estado;
};
