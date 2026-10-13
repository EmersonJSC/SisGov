// Prova do Congresso (V1-11). Rodar: npx vite-node scripts/congresso/prova.ts
// Elege as bancadas a partir dos perfis do país (camada 1), sem o partido do
// jogador, e compara com a eleição real de bussola/congresso.json. Depois
// mostra o retrato do turno 0: cadeiras, disposição e as maiores frentes.
import { criarPartida } from "../../src/app/partida/criar";
import {
  congressoDaBussola,
  congressoDoPacote,
  dhondt,
  eleicaoDasBancadas,
  retratoDoCongresso,
} from "../../src/game/congresso";
import { pontoAtual } from "../../src/game/bussola";

const r = criarPartida({ ocorrencias: false });
if (!r.ok) throw new Error("partida não criada");
const { content, game } = r.value;
const pacote = congressoDoPacote(content);
if (!pacote || !game.congress) throw new Error("país sem Congresso");
const eleicao = eleicaoDasBancadas(pacote);
const pct = (x: number) => `${(100 * x).toFixed(1)}%`;

console.log("Camada 1: votos de cada bancada");
for (const b of pacote.bancadas)
  console.log(
    `  ${b.nome.padEnd(17)} ${pct(eleicao.fatias[b.id]).padStart(6)}  ponto (${b.ponto.economia.toFixed(1)}; ${b.ponto.costumes.toFixed(1)})`,
  );

const { tolerancia, grupos } = congressoDaBussola.prova;
for (const casa of pacote.casas) {
  const cadeiras = dhondt(eleicao.fatias, casa.cadeiras);
  console.log(`\nProva: ${casa.nome} (${casa.cadeiras})`);
  for (const g of grupos) {
    const modelo = g.bancadas.reduce((s, b) => s + (cadeiras[b] ?? 0), 0);
    const real = casa.id === "camara" ? g.camara.cadeiras : g.senado.cadeiras;
    const erro = (modelo - real) / real;
    console.log(
      `  ${g.id.padEnd(9)} modelo ${String(modelo).padStart(3)}  real ${String(real).padStart(3)}  erro ${(100 * erro).toFixed(0).padStart(4)}%  ${Math.abs(erro) <= tolerancia ? "passa" : "NÃO PASSA"}`,
    );
  }
}

const retrato = retratoDoCongresso({
  content,
  estado: game.congress,
  valores: game.execution.values,
  pontoDoJogador: pontoAtual(content, game.compass!, game.policies),
});
console.log("\nTurno 0 (com o seu partido)");
for (const b of retrato) {
  const frentes = Object.entries(b.frentes)
    .sort((a, c) => c[1] - a[1])
    .slice(0, 3)
    .map(([g, f]) => `${g} ${pct(f)}`)
    .join(", ");
  console.log(
    `  ${b.nome.padEnd(17)} Câmara ${String(b.cadeiras.camara).padStart(3)}  Senado ${String(b.cadeiras.senado).padStart(2)}  disposição ${b.disposicao.toFixed(0).padStart(3)}  frentes: ${frentes}`,
  );
}

// Frentes no país: média das bancadas pesada pelas cadeiras da Câmara.
const totalCamara = retrato.reduce((s, b) => s + b.cadeiras.camara, 0);
console.log("\nFrentes na Câmara (parte das cadeiras)");
for (const f of pacote.regras.frentes) {
  const parte =
    retrato.reduce(
      (s, b) => s + b.cadeiras.camara * (b.frentes[f.id] ?? 0),
      0,
    ) / totalCamara;
  console.log(`  ${f.nome.padEnd(22)} ${pct(parte)}`);
}
