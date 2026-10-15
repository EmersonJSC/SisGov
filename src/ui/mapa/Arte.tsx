/**
 * Artes do jogo (V1-39): imagens em `public/arte/`, feitas por IA por
 * enquanto (prompts em `docs/arte/PROMPTS.md`). Toda arte é opcional: se o
 * arquivo não existe, a tela mostra o substituto e segue igual.
 */
import { useState, type ReactNode } from "react";

export const arte = (caminho: string) =>
  `${import.meta.env.BASE_URL}arte/${caminho}`;

export function Arte({
  caminho,
  className,
  alt = "",
  substituto = null,
}: {
  caminho: string;
  className?: string;
  alt?: string;
  substituto?: ReactNode;
}) {
  const src = arte(caminho);
  const [falhou, setFalhou] = useState<string | null>(null);
  if (falhou === src) return <>{substituto}</>;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFalhou(src)}
    />
  );
}

/** Retrato de um personagem; sem arquivo, uma silhueta. */
export function Retrato({
  retrato,
  className = "",
}: {
  retrato: string;
  className?: string;
}) {
  return (
    <div className={`rt ${className}`}>
      <svg className="rt-silhueta" viewBox="0 0 100 120" aria-hidden>
        <circle cx="50" cy="46" r="21" />
        <path d="M10 120c0-27 18-44 40-44s40 17 40 44z" />
      </svg>
      <Arte caminho={`retratos/${retrato}.png`} className="rt-imagem" />
    </div>
  );
}
