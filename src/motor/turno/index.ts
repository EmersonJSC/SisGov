// Turno: avancarTurno(regras, estado, pedidos) → novo estado, sem alterar o
// anterior. Ordem fixa (plano, seção 5).
// O acaso mora no estado (motor/acaso). Comportamento em turno.md.
import { motivoContaNaoFecha } from "../contas";
import { type Estado } from "../estado";
import { envelhecerFatos } from "../fatos";
import { type Etapa } from "./comum";
import { atendimento } from "./etapas/atendimento";
import { congresso, leisNovas, efeitosVencem } from "./etapas/congresso";
import {
  economiaReal,
  precosEJuros,
  capacidades,
  contas,
} from "./etapas/economia";
import { governo } from "./etapas/governo";
import { eleicao } from "./etapas/eleicao";
import { midia } from "./etapas/midia";
import { programas } from "./etapas/programas";
import { invariantes } from "./etapas/invariantes";
import { judiciario } from "./etapas/judiciario";
import { indicesJogabilidade } from "./etapas/jogabilidade";
import { moradia } from "./etapas/moradia";
import { mundo, precosDoMundo } from "./etapas/mundo";
import { politica } from "./etapas/politica";
import { popsEGrupos } from "./etapas/populacao";
import { organizacoes } from "./etapas/organizacoes";
import { saneamento } from "./etapas/saneamento";
import { type Regras, type Pedido } from "./regras";

export type {
  ParametrosBase,
  ParametrosPais,
  Pedido,
  PedidoMudarLei,
  Regras,
} from "./regras";

export { entradaDoCongresso } from "./etapas/congresso";
export {
  situacoesDeCapacidade,
  impostoSobreLucro,
  arrecadacao,
  dinheiroFora,
  gastoDasLeis,
} from "./etapas/economia";
export { saidaDoTurno } from "./etapas/populacao";
export {
  ritmoDasObras,
  apertoDoBolso,
  comBolsoParaPlano,
  pessoasNaFolha,
  indiceDoInformal,
  apertoDaMoradia,
} from "./etapas/obras";
export { leisDoSaneamento } from "./etapas/saneamento";
export { distribuicaoDe, leisDoAtendimento } from "./etapas/atendimento";
export {
  comIndicesDasCestas,
  consumoDasCestas,
  precoPorLei,
} from "./etapas/jogabilidade";
export { type Inicio, estadoInicial } from "./inicio";

const ETAPAS: Etapa[] = [
  congresso,
  leisNovas,
  efeitosVencem,
  judiciario,
  economiaReal,
  precosEJuros,
  capacidades,
  contas,
  moradia,
  saneamento,
  atendimento,
  indicesJogabilidade,
  mundo,
  precosDoMundo,
  popsEGrupos,
  organizacoes,
  governo,
  programas,
  politica,
  eleicao,
  midia,
  invariantes,
];
/** Quantos turnos de índices o estado guarda para a tendência (8 meses). */
const TURNOS_GUARDADOS = 4;
export function avancarTurno(
  regras: Regras,
  estado: Estado,
  pedidos: Pedido[] = [],
): Estado {
  if (estado.encerrada)
    throw new Error("partida encerrada: o governo perdeu a eleição");
  // A mesa envelhece antes das etapas escreverem os fatos deste turno.
  const proximo: Estado = {
    ...estado,
    turno: estado.turno + 1,
    fatos: envelhecerFatos(estado.fatos ?? []),
  };
  const novo = ETAPAS.reduce((e, etapa) => etapa(regras, e, pedidos), proximo);
  // Parte da etapa 10: precisa do estado anterior.
  const motivo = motivoContaNaoFecha(estado.tesouro, novo.tesouro);
  if (motivo) throw new Error(`invariante no turno ${novo.turno}: ${motivo}`);
  return {
    ...novo,
    anteriores: [estado.jogabilidade, ...(estado.anteriores ?? [])].slice(
      0,
      TURNOS_GUARDADOS,
    ),
    mudanca: {
      pib: novo.essenciais.pib_nominal - estado.essenciais.pib_nominal,
      divida: novo.tesouro.divida - estado.tesouro.divida,
    },
  };
}
