import js from "@eslint/js";
import tseslint from "typescript-eslint";

// Fronteiras entre camadas (docs/jogo/plano-de-desenvolvimento.md, seção 4).
// A dependência só desce: tela → partida → motor e conteudo.
const proibir = (...grupos) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns: grupos.map(([nomes, motivo]) => ({
        group: nomes,
        message: motivo,
      })),
    },
  ],
});

const react = [
  ["react", "react/*", "react-dom", "react-dom/*"],
  "o motor é TS puro, sem React.",
];
const json = [
  ["**/*.json"],
  "o motor não lê JSON; quem carrega dado é a partida.",
];
const conteudo = [
  ["**/conteudo", "**/conteudo/**"],
  "conteúdo só entra pela partida.",
];
const partida = [["**/partida", "**/partida/**"], "a dependência só desce."];
const tela = [["**/tela", "**/tela/**"], "a dependência só desce."];

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "_lixo/", "arquivo/", "rascunho/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/motor/**/*.{ts,tsx}"],
    rules: proibir(react, json, conteudo, partida, tela),
  },
  {
    files: ["src/partida/**/*.{ts,tsx}"],
    rules: proibir(react, tela),
  },
  {
    files: ["src/tela/**/*.{ts,tsx}"],
    rules: proibir(conteudo),
  },
  {
    files: ["src/main.tsx"],
    rules: proibir(conteudo, partida, [
      ["**/motor", "**/motor/**"],
      "a entrada só liga a tela.",
    ]),
  },
);
