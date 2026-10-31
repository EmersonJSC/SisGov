// Entrada do Vite: só liga a tela ao HTML.
import { montarTela } from "./tela";

const raiz = document.getElementById("root");
if (raiz) montarTela(raiz);
