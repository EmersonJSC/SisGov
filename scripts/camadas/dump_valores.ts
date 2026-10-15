import { criarPartida } from "../../src/app/partida";
const c = criarPartida({ ocorrencias: false });
if (!c.ok) throw new Error(c.erros.join(" "));
console.log(JSON.stringify(c.value.game.execution.values));
