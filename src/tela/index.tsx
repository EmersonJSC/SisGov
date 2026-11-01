// Tela: mostra e envia pedidos à partida; não calcula. Passo 10, versão
// simples (docs/jogo/plano-de-desenvolvimento.md).
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./tela.css";

export function montarTela(raiz: HTMLElement): void {
  createRoot(raiz).render(<App />);
}
