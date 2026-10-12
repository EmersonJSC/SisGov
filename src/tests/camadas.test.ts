/**
 * V1-04: as camadas só importam para baixo (docs/v1/arquitetura.md).
 * ui → app → game → engine; conteudo é dado, lido por app e game.
 */
import { describe, expect, it } from "vitest";

const PERMITIDAS: Readonly<Record<string, readonly string[]>> = {
  ui: ["ui", "app", "assets"],
  app: ["app", "game", "engine", "conteudo"],
  game: ["game", "engine", "conteudo"],
  engine: ["engine"],
};

/** Camada de um caminho relativo a `src/` ("ui/mapa/x.tsx" → "ui"). */
function camada(caminho: string): string {
  const [primeira, ...resto] = caminho.split("/");
  // Arquivos na raiz de src (main.tsx, index.css) pertencem à tela.
  if (resto.length === 0 && /\.(tsx?|css)$/.test(primeira)) return "ui";
  return primeira;
}

function resolver(origem: string, alvo: string): string {
  const partes = origem.split("/").slice(0, -1);
  for (const pedaco of alvo.split("/")) {
    if (pedaco === "..") partes.pop();
    else if (pedaco !== ".") partes.push(pedaco);
  }
  return partes.join("/");
}

const IMPORTACAO =
  /(?:from\s*|import\s*\(\s*|import\s+|import\.meta\.glob(?:<[^>]*>)?\(\s*)["'](\.[^"']+)["']/g;

/** Importações que sobem de camada ou que a camada não pode usar. */
function violacoes(arquivos: Readonly<Record<string, string>>): string[] {
  const erros: string[] = [];
  for (const [caminho, texto] of Object.entries(arquivos)) {
    const de = camada(caminho);
    const permitidas = PERMITIDAS[de];
    if (!permitidas) continue;
    for (const [, alvo] of texto.matchAll(IMPORTACAO)) {
      const para = camada(resolver(caminho, alvo));
      if (!permitidas.includes(para))
        erros.push(`${caminho}: ${de} não pode importar ${para} (${alvo})`);
    }
  }
  return erros;
}

const fontes = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>(["../**/*.ts", "../**/*.tsx", "!../tests/**"], {
      eager: true,
      query: "?raw",
      import: "default",
    }),
  ).map(([caminho, texto]) => [caminho.replace(/^\.\.\//, ""), texto]),
);

describe("camadas", () => {
  it("nenhum arquivo importa uma camada de cima", () => {
    expect(Object.keys(fontes).length).toBeGreaterThan(50);
    expect(violacoes(fontes)).toEqual([]);
  });

  it("acusa importação para cima e tela falando com o motor", () => {
    expect(
      violacoes({
        "engine/runtime/passo.ts":
          'import { encerrarTurno } from "../../app/partida";',
        "game/turno.ts": 'import type { Visao } from "../ui/mapa/Janelas";',
        "ui/mapa/Mapa.tsx": 'import { buildGraph } from "../../engine";',
        "app/partida/visao.ts":
          'import { createGame } from "../../game/createGame";',
      }),
    ).toEqual([
      "engine/runtime/passo.ts: engine não pode importar app (../../app/partida)",
      "game/turno.ts: game não pode importar ui (../ui/mapa/Janelas)",
      "ui/mapa/Mapa.tsx: ui não pode importar engine (../../engine)",
    ]);
  });
});
