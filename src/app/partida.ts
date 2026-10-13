/**
 * Camada da partida: a única porta de entrada da interface.
 *
 * A tela chama só estas funções e lê só a `VisaoPartida`. Ela nunca importa
 * nada de `engine/`, `game/` ou `domain/`. Contrato em
 * `docs/arquitetura/api-da-partida.md`.
 */

export type {
  Resultado,
  ModoPartida,
  Partida,
  VisaoOpcao,
  VisaoLei,
  VisaoExigencia,
  VisaoFilha,
  VisaoQueda,
  VisaoBolha,
  VisaoLigacao,
  VisaoContas,
  VisaoMotivo,
  VisaoGrupo,
  VisaoPartida,
  VisaoMinisterio,
  VisaoArea,
  VisaoEfeitoOcorrencia,
  VisaoOpcaoDilema,
  VisaoDilema,
  VisaoOcorrenciaAtiva,
  VisaoRegistro,
  VisaoOcorrencias,
  RelatorioTurno,
  VisaoGrupoPressao,
  VisaoPressao,
  VisaoMudancaDeNivel,
  VisaoInvestigacaoConcluida,
  EfeitoPrevisto,
  PrevisaoLei,
  VisaoBussola,
  VisaoPontoBussola,
  VisaoReferencia,
} from "./partida/tipos";
export { criarPartida } from "./partida/criar";
export {
  VERSAO_DO_SALVO,
  carregarPartida,
  salvarPartida,
} from "./partida/salvar";
export { mudarLei, leisQueCaem, revogarLei } from "./partida/leis";
export { MAXIMO_TRIMESTRES_PREVIA, preverLei } from "./partida/previsao";
export { responderDilema, preverDilema, encerrarTurno } from "./partida/turno";
export { BOLHAS_DO_ORCAMENTO } from "./partida/contas";
export { verPartida } from "./partida/visao";
export { chanceDaOcorrencia } from "./partida/ocorrencias";
export { investigarGrupo } from "./partida/pressao";
export { verBussola } from "./partida/bussola";
export {
  enviarAoCongresso,
  responderPedido,
  verTramitacao,
  type OpcoesDoEnvio,
  type ResultadoDoCongresso,
  type VisaoDaTramitacao,
  type VisaoDoProjeto,
} from "./partida/tramitacao";
