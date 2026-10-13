/**
 * Modo noturno (13/out). As cores do CSS são light-dark(claro, noturno); aqui
 * só se escolhe qual vale, marcando `data-tema` na raiz. Sem escolha, segue o
 * sistema. A escolha fica salva neste navegador.
 */
import { useEffect, useState } from "react";

export type Tema = "claro" | "noturno";

const CHAVE = "sisgov:tema";

function salvo(): Tema | null {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "claro" || v === "noturno" ? v : null;
  } catch {
    return null;
  }
}

function doSistema(): Tema {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "noturno"
    : "claro";
}

export function useModoNoturno(): readonly [Tema, () => void] {
  const [escolhido, setEscolhido] = useState<Tema | null>(salvo);
  const [sistema, setSistema] = useState<Tema>(doSistema);
  useEffect(() => {
    const consulta = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!consulta) return;
    const mudou = () => setSistema(consulta.matches ? "noturno" : "claro");
    consulta.addEventListener("change", mudou);
    return () => consulta.removeEventListener("change", mudou);
  }, []);
  useEffect(() => {
    const raiz = document.documentElement;
    if (escolhido) raiz.dataset.tema = escolhido;
    else delete raiz.dataset.tema;
  }, [escolhido]);
  const tema = escolhido ?? sistema;
  const alternar = () => {
    const novo: Tema = tema === "noturno" ? "claro" : "noturno";
    setEscolhido(novo);
    try {
      window.localStorage.setItem(CHAVE, novo);
    } catch {
      // sem armazenamento (aba privada): vale só nesta sessão
    }
  };
  return [tema, alternar] as const;
}
