import { useEffect, useRef } from "react";
import { digitar, type Cheat } from "./cheats";

const CAMPOS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Escuta o teclado e chama `aoDigitar` quando uma palavra de cheat é escrita. */
export function useCheats(aoDigitar: (cheat: Cheat) => void): void {
  const ultimo = useRef(aoDigitar);
  ultimo.current = aoDigitar;
  useEffect(() => {
    let texto = "";
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && (CAMPOS.has(alvo.tagName) || alvo.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const r = digitar(texto, e.key);
      texto = r.texto;
      if (r.cheat) ultimo.current(r.cheat);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);
}
