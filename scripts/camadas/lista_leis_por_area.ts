import { criarPartida, verPartida } from "../../src/app/partida";
const c = criarPartida({ ocorrencias: false });
if (!c.ok) throw new Error("x");
const v = verPartida(c.value);
const por: Record<string, string[]> = {};
for (const l of v.leis) (por[l.areas[0]] ??= []).push(`${l.id}|${l.nome}|${l.mesa?.camada ?? "-"}|${l.opcoes?.length ?? 0}`);
for (const [a, ls] of Object.entries(por)) console.log(`## ${a} (${ls.length})\n` + ls.join("\n"));
