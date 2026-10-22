export type {
  AreaId,
  EfeitoV3,
  Familia,
  FichaV3,
  FichaV4,
  NivelDaLei,
  TravaV4,
} from "./tipos";
export { avisosPorArea, verificarMolde, FAMILIAS } from "./molde";
export { verificarFicha, type ContextoDaFicha } from "./verificar";
export { converterFicha, type FichaConvertida } from "./converter";
export {
  caminhoDoEfeito,
  expandirFichasV3,
  relatorioDeMigracao,
  type RelatorioDeMigracao,
} from "./expandir";
