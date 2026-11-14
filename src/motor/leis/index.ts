export type {
  Canal,
  ClasseLei,
  Efeito,
  Forca,
  Lei,
  LeiContinua,
  LeiOpcoes,
  Opcao,
  PontoBussola,
} from "./tipos";
export { CANAIS, CLASSES, EIXOS } from "./tipos";
export type { Eixo } from "./tipos";
export { validarLei, lerLei, type ErroLei } from "./validar";
export {
  motivoValorInvalido,
  efeitosDoValor,
  fracaoDaBussola,
  valorDesligado,
  type ValorLei,
} from "./valor";
export {
  colisoesDe,
  leiAtiva,
  valoresComPedidos,
  type Colisao,
} from "./colisao";
