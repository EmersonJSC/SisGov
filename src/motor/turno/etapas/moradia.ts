// Etapas do turno: moradia. Comportamento em turno.md.
import {
  andarMoradia,
  familias,
  pessoasNoCampo,
  indicesDaMoradia,
} from "../../moradia";
import type { Etapa } from "../comum";
import { animoDoPais } from "./economia";
import { tamanhoDoSetor, ritmoDasObras, apertoDaMoradia } from "./obras";

/**
 * 6b. Moradia: casas desgastam, ficam prontas e começam (motor/moradia). O que
 * a contagem andou move a base do déficit e da favela.
 */
export const moradia: Etapa = (regras, estado) => {
  const regra = regras.moradia;
  const obras = regras.mercado?.mercado.obras;
  const m = estado.moradia;
  if (!regra || !obras || !m || !estado.construcoes) return estado;
  const { populacao } = estado.essenciais;
  const marco = estado.marco.indices;
  const verba = estado.leis[regra.lei_verba];
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const preco0 = marco[regra.indice_preco];
  const nova = andarMoradia(regra, obras, m, {
    populacao,
    verba: typeof verba === "number" ? verba : 0,
    atraso,
    atraso_inicial: marco[obras.indice_atraso] ?? atraso,
    setor: tamanhoDoSetor(regras, estado),
    ritmo: ritmoDasObras(regras, estado),
    preco: preco0 > 0 ? estado.jogabilidade[regra.indice_preco] / preco0 : 1,
    animo: animoDoPais(regras, estado),
    familias_campo: familias(regra, pessoasNoCampo(regra, estado.pops)),
    concentracao:
      estado.jogabilidade[regra.indice_terra] - marco[regra.indice_terra],
    aperto: apertoDaMoradia(
      regra,
      estado,
      estado.jogabilidade[regra.indice_preco],
    ),
  });
  const antes = indicesDaMoradia(regra, m, populacao);
  const depois = indicesDaMoradia(regra, nova, populacao);
  return {
    ...estado,
    moradia: nova,
    base: {
      ...estado.base,
      [regra.indice_deficit]:
        estado.base[regra.indice_deficit] + depois.deficit - antes.deficit,
      [regra.indice_favela]:
        estado.base[regra.indice_favela] + depois.favela - antes.favela,
    },
  };
};
