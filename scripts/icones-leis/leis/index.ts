// Leis já desenhadas, por esfera. Lote novo: criar leis/<esfera>.ts e somar aqui.
import { jogo } from "../jogo";
import { SANEAMENTO } from "./saneamento";
import { RELACOES } from "./relacoes-exteriores";
import { DEFESA_CIVIL } from "./defesa-civil";
import { DEFESA } from "./defesa";
import { COMERCIO_EXTERIOR } from "./comercio-exterior-e-capital";
import { PREVIDENCIA } from "./previdencia";
import { DIREITOS } from "./direitos-e-liberdades";
import { CULTURA } from "./cultura-e-esporte";
import { ENERGIA } from "./energia";
import { IMIGRACAO } from "./imigracao";
import { MOEDA_E_BANCOS } from "./moeda-e-bancos";
import { COMUNICACAO } from "./comunicacao-e-tecnologia";
import { MINERACAO } from "./mineracao-e-petroleo";
import { MORADIA } from "./moradia";
import { AGRICULTURA } from "./agricultura-e-pesca";
import { EMPRESAS } from "./empresas-e-estatais";
import { TERRA } from "./terra";
import { VICIOS } from "./vicios";
import { MEIO_AMBIENTE } from "./meio-ambiente";
import { ASSISTENCIA } from "./assistencia-social";
import { CIENCIA } from "./ciencia-e-pesquisa";
import { JUSTICA } from "./justica-e-prisoes";
import { ORCAMENTO } from "./orcamento-e-divida";
import { IMPOSTOS } from "./impostos";
import { ESTADO } from "./estado-e-eleicoes";
import { EDUCACAO } from "./educacao";
import { INFRAESTRUTURA } from "./infraestrutura-e-transporte";
import { SEGURANCA } from "./seguranca-publica";
import { SAUDE } from "./saude";
import { TRABALHO } from "./trabalho";

const NOMES: Record<string, Record<string, string>> = {
  saneamento: SANEAMENTO,
  "relacoes-exteriores": RELACOES,
  "defesa-civil": DEFESA_CIVIL,
  defesa: DEFESA,
  "comercio-exterior-e-capital": COMERCIO_EXTERIOR,
  previdencia: PREVIDENCIA,
  "direitos-e-liberdades": DIREITOS,
  "cultura-e-esporte": CULTURA,
  energia: ENERGIA,
  imigracao: IMIGRACAO,
  "moeda-e-bancos": MOEDA_E_BANCOS,
  "comunicacao-e-tecnologia": COMUNICACAO,
  "mineracao-e-petroleo": MINERACAO,
  moradia: MORADIA,
  "agricultura-e-pesca": AGRICULTURA,
  "empresas-e-estatais": EMPRESAS,
  terra: TERRA,
  vicios: VICIOS,
  "meio-ambiente": MEIO_AMBIENTE,
  "assistencia-social": ASSISTENCIA,
  "ciencia-e-pesquisa": CIENCIA,
  "justica-e-prisoes": JUSTICA,
  "orcamento-e-divida": ORCAMENTO,
  impostos: IMPOSTOS,
  educacao: EDUCACAO,
  "estado-e-eleicoes": ESTADO,
  "infraestrutura-e-transporte": INFRAESTRUTURA,
  "seguranca-publica": SEGURANCA,
  saude: SAUDE,
  trabalho: TRABALHO,
};

/** esfera → (id da lei → desenho do game-icons). */
export const LEIS_DESENHADAS: Record<string, Record<string, string>> =
  Object.fromEntries(
    Object.entries(NOMES).map(([esfera, leis]) => [
      esfera,
      Object.fromEntries(
        Object.entries(leis).map(([id, nome]) => [id, jogo(nome)]),
      ),
    ]),
  );
