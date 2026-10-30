/** Liga o corte de gastos à mão e mostra a reação dos grupos e a leitura da imprensa (M7.3). */
import { criarPartida, verPartida, verBussola } from "../../src/app/partida";
import { montarJornal } from "../../src/ui/mapa/jornal";

const r = criarPartida({ ocorrencias: false });
if (!r.ok) throw new Error(r.erros.join("\n"));
const p = r.value;
const ids = ["piso-saude", "piso-educacao", "gasto-com-defesa"];
const policies = p.game.policies.map((s) =>
  ids.includes(s.policyDefinitionId)
    ? {
        ...s,
        history: [
          ...s.history,
          {
            kind: "meta_alterada" as const,
            turn: 0,
            legalStatus: "vigente" as const,
            desiredLevel: s.desiredLevel * 0.5,
            implementedLevel: s.desiredLevel * 0.5,
          },
        ],
      }
    : s,
);
const antes = verPartida(p);
const com = { ...p, game: { ...p.game, policies } };
const depois = verPartida(com);
const b = verBussola(com)!;
console.log(
  "gatilhos:",
  b.gatilhos.map((g) => g.id),
  "|",
  b.leitura,
);
for (const g of depois.grupos) {
  const a = antes.grupos.find((x) => x.id === g.id)!;
  if (a.satisfacao !== g.satisfacao)
    console.log(g.id, a.satisfacao.toFixed(1), "->", g.satisfacao.toFixed(1));
}
console.log("popularidade:", antes.contas ? "(ver governo)" : "");
const j = montarJornal(depois, antes, null, [], undefined, b);
for (const o of j.opinioes.filter((o) => o.secao === "povo"))
  console.log("-", o.autor, o.tom, "|", o.texto);
console.log("leitura:", j.leitura);
