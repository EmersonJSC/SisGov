// Piloto da prova real (V1-34). Rodar: npx vite-node scripts/bussola/piloto/prova.ts
import { criarPartida } from "../../../src/app/partida/criar";
import {
  referenciasDaBussola as R,
  pontoAtual,
  distancia,
} from "../../../src/game/bussola";
import { PROGRAMAS } from "./programas";
const r = criarPartida({ ocorrencias: false });
if (!r.ok) throw 0;
const { content, game } = r.value;
const ref = (id: string) => R.personalidades.find((p) => p.id === id)!;
for (const [nome, prog] of Object.entries(PROGRAMAS)) {
  const faltam: string[] = [];
  const policies = game.policies.map((s) => {
    const alvo = prog.leis[s.policyDefinitionId];
    if (alvo === undefined) return s;
    const pol = content.policies.find((p) => p.id === s.policyDefinitionId)!;
    const nivel =
      typeof alvo === "number"
        ? alvo
        : pol.controle.opcoes?.find((o) => o.id === alvo)?.valor;
    if (nivel === undefined) {
      faltam.push(String(alvo));
      return s;
    }
    return { ...s, desiredLevel: nivel };
  });
  const p = pontoAtual(content, game.compass!, policies);
  const alvo = ref(prog.alvo);
  const dA = distancia(p, alvo);
  const opostos = prog.opostos.map(
    (id) => `${ref(id).nome} ${distancia(p, ref(id)).toFixed(1)}`,
  );
  const perto = [...R.personalidades]
    .sort((a, b) => distancia(p, a) - distancia(p, b))
    .slice(0, 3)
    .map((x) => `${x.nome} ${distancia(p, x).toFixed(1)}`);
  console.log(
    `${nome}: ${Object.keys(prog.leis).length} leis -> (${p.economia.toFixed(1)}, ${p.costumes.toFixed(1)}) alvo ${alvo.nome} (${alvo.economia}, ${alvo.costumes}) dist ${dA.toFixed(1)}\n  opostos: ${opostos.join("; ")}\n  mais perto: ${perto.join("; ")}${faltam.length ? "\n  FALTAM " + faltam : ""}`,
  );
}
