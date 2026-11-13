// Procura ícones do game-icons.net pelo nome (em inglês): npm run icones:buscar -- coin tank
import { ICONES_DO_JOGO } from "./jogo";

const RUIDO = /^(abstract|rune|pawn)-?\d*/;

for (const palavra of process.argv.slice(2)) {
  const achados = Object.keys(ICONES_DO_JOGO).filter(
    (nome) => nome.includes(palavra) && !RUIDO.test(nome),
  );
  console.log(`${palavra}: ${achados.join(" ") || "-"}`);
}
