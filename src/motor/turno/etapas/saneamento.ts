// Etapas do turno: saneamento. Comportamento em turno.md.
import type { ValorLei } from "../../leis";
import { familias, pessoasNoCampo } from "../../moradia";
import {
  type RegraDoSaneamento,
  type LeisDoSaneamento,
  andarSaneamento,
  rendaParaAConta,
  indiceDoSaneamento,
} from "../../saneamento";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import { animoDoPais } from "./economia";
import {
  parteDaLei,
  tamanhoDoSetor,
  ritmoDasObras,
  apertoDoBolso,
} from "./obras";

/** O que as leis pedem à rede, em números. */
export function leisDoSaneamento(
  regras: Regras,
  regra: RegraDoSaneamento,
  valores: Record<string, ValorLei>,
): LeisDoSaneamento {
  const verba = valores[regra.lei_verba];
  return {
    verba: typeof verba === "number" ? verba : 0,
    concessao: parteDaLei(regras, valores, regra.lei_concessao),
    teto: parteDaLei(regras, valores, regra.lei_teto),
    tratamento: parteDaLei(regras, valores, regra.lei_tratamento),
  };
}
/**
 * 6c. Saneamento: a rede desgasta, as ligações ficam prontas e começam
 * (motor/saneamento). O que a contagem andou move a base dos índices.
 */
export const saneamento: Etapa = (regras, estado) => {
  const regra = regras.saneamento;
  const obras = regras.mercado?.mercado.obras;
  const s = estado.saneamento;
  if (!regra || !regras.moradia || !obras || !s) return estado;
  const { populacao } = estado.essenciais;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const casas = estado.moradia;
  const leis = leisDoSaneamento(regras, regra, estado.leis);
  const nova = andarSaneamento(regra, s, {
    populacao,
    leis,
    atraso,
    atraso_inicial: estado.marco.indices[obras.indice_atraso] ?? atraso,
    setor: tamanhoDoSetor(regras, estado),
    animo: animoDoPais(regras, estado),
    sem_lucro:
      (casas?.precarias ?? 0) +
      familias(regras.moradia, pessoasNoCampo(regras.moradia, estado.pops)),
    ritmo: ritmoDasObras(regras, estado),
    aperto: apertoDoBolso(
      estado,
      rendaParaAConta(regra, leis),
      rendaParaAConta(
        regra,
        leisDoSaneamento(regras, regra, estado.marco.leis),
      ),
    ),
  });
  const { base } = estado;
  return {
    ...estado,
    saneamento: nova,
    base: {
      ...base,
      [regra.indice]:
        base[regra.indice] +
        indiceDoSaneamento(regra, nova, populacao) -
        indiceDoSaneamento(regra, s, populacao),
      [regra.indice_vida]: base[regra.indice_vida] + nova.vida - s.vida,
      [regra.indice_ambiente]:
        base[regra.indice_ambiente] + nova.ambiente - s.ambiente,
    },
  };
};
