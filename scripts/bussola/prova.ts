// Prova real da bússola (V1-34). Rodar: npx vite-node scripts/bussola/prova.ts
// Aplica ao país do turno 0 o programa de cada referência (programas.json) e
// mede a distância até o ponto do V-Party. Mostra também o fator do rumo que
// melhor ajusta os programas de treino, eixo por eixo.
import { criarPartida } from "../../src/app/partida/criar";
import {
  bussolaDoMundo,
  distancia,
  referenciasDaBussola,
} from "../../src/game/bussola";
import { mediaDasLeis } from "../../src/game/bussola/calculo";
import type { PontoDaBussola } from "../../src/game/bussola/tipos";
import {
  aplicarPrograma,
  type ProgramaDeGoverno,
} from "../../src/game/bussola/programas";
import programas from "../../src/conteudo/bussola/programas.json";

const r = criarPartida({ ocorrencias: false });
if (!r.ok) throw new Error("partida não criada");
const { content, game } = r.value;
const inicio = game.compass!.inicio;
const ref = (id: string) => {
  const achou = referenciasDaBussola.personalidades.find((p) => p.id === id);
  if (!achou) throw new Error(`referência inexistente: ${id}`);
  return achou;
};

const lista = Object.entries(
  programas.programas as Record<string, ProgramaDeGoverno>,
).map(([nome, prog]) => ({
  nome,
  prog,
  agora: mediaDasLeis(
    content,
    bussolaDoMundo,
    aplicarPrograma(content, game.policies, prog),
  ),
}));

function ajuste(eixo: "economia" | "costumes"): number {
  let cima = 0;
  let baixo = 0;
  for (const { prog, agora } of lista.filter(
    (x) => x.prog.grupo === "treino",
  )) {
    const anda = agora[eixo] - inicio[eixo];
    cima += anda * (ref(prog.referencia)[eixo] - inicio[eixo]);
    baixo += anda * anda;
  }
  return cima / baixo;
}

const limite = programas.regraDePassar.distanciaMaxima;
const prender = (v: number) => Math.max(-10, Math.min(10, v));
function relatorio(titulo: string, fator: PontoDaBussola) {
  let passam = 0;
  console.log(titulo);
  for (const { nome, prog, agora } of lista) {
    const p = {
      economia: prender(
        inicio.economia + fator.economia * (agora.economia - inicio.economia),
      ),
      costumes: prender(
        inicio.costumes + fator.costumes * (agora.costumes - inicio.costumes),
      ),
    };
    const alvo = ref(prog.referencia);
    const d = distancia(p, alvo);
    const oposto = Math.min(...prog.opostos.map((id) => distancia(p, ref(id))));
    const passa = d <= limite && d < oposto;
    if (passa) passam++;
    console.log(
      `  ${prog.grupo.padEnd(6)} ${nome.padEnd(10)} ${prog.leis.length} leis ` +
        `(${p.economia.toFixed(1)}, ${p.costumes.toFixed(1)}) ` +
        `alvo (${alvo.economia}, ${alvo.costumes}) ` +
        `dist ${d.toFixed(1)} oposto ${oposto.toFixed(1)} ${passa ? "passa" : "falha"}`,
    );
  }
  console.log(`  passam ${passam} de ${lista.length}`);
}

const fator = bussolaDoMundo.fatorDoRumo;
relatorio(`Fator atual (${fator}):`, { economia: fator, costumes: fator });
const ajustado = { economia: ajuste("economia"), costumes: ajuste("costumes") };
relatorio(
  `Fator ajustado no treino (economia ${ajustado.economia.toFixed(2)}, costumes ${ajustado.costumes.toFixed(2)}):`,
  ajustado,
);
