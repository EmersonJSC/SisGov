/**
 * Limites de nível dos grupos de pressão (V1-09, desenho/pressao.md 3.5).
 *
 * Roda a carga do país (acomodação e aquecimento, sem ocorrências), lê a
 * pressão de cada grupo do começo ao turno 0 e põe os limites para o grupo
 * terminar o aquecimento no nível de `turno0`:
 * - a entrada do nível de cima fica `folga` pontos acima da maior pressão;
 * - a entrada do nível do grupo fica 2 pontos abaixo da menor;
 * - os outros níveis, de 10 em 10; a saída, 6 abaixo de cada entrada;
 * - nenhuma entrada passa do TETO (97): o espaço encolhe até 4.
 * A pressão não depende dos limites (só as ações dependem, e o aquecimento
 * não tem ações), então uma passada basta; o script confere no fim.
 *
 * Uso: npm run pressao:calibrar
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { createGame } from "../../src/game/createGame";
import { prepareMonthlyContent } from "../../src/game/prepareMonthlyContent";
import { loadScenarioPackage } from "../../src/game/pais/loadScenarioPackage";
import type { Limites, PressaoDoPais } from "../../src/game/pais/pressao";

const ARQUIVO = "src/conteudo/paises/brasil/pressao.json";
const DISTANCIA = 10;
const TETO = 97;
const PERTO = 4;
const HISTERESE = 6;
const ABAIXO = 2;

/** Conteúdo lido do disco a cada vez: a conferência vê os limites novos. */
function arquivos(): Record<string, string> {
  const raiz = "src/conteudo";
  const files: Record<string, string> = {};
  const andar = (pasta: string) => {
    for (const nome of readdirSync(pasta)) {
      const caminho = join(pasta, nome);
      if (statSync(caminho).isDirectory()) andar(caminho);
      else if (caminho.endsWith(".json"))
        files[relative(raiz, caminho)] = readFileSync(caminho, "utf8");
    }
  };
  andar(raiz);
  return files;
}

function partida() {
  const loaded = loadScenarioPackage("paises/brasil/pais.json", arquivos());
  if (!loaded.ok) throw new Error(JSON.stringify(loaded.diagnostics, null, 2));
  const monthly = prepareMonthlyContent(loaded.value.definition);
  if (!monthly.ok)
    throw new Error(JSON.stringify(monthly.diagnostics, null, 2));
  const { content, graph } = monthly.value;
  const game = createGame("calibrar", content, graph, { occurrences: false });
  if (!game.ok) throw new Error(JSON.stringify(game.diagnostics, null, 2));
  return { content, execution: game.value.execution };
}

const arredonda = (x: number) => Math.round(x * 10) / 10;

const { content, execution } = partida();
const config = content.manifest.gruposDePressao!;
const pais = JSON.parse(readFileSync(ARQUIVO, "utf8")) as PressaoDoPais;
const trajetoria = [
  execution.initialValues,
  ...[...execution.history].reverse().map((s) => s.values),
  execution.values,
];
const limites: Record<string, Limites> = {};
const niveis = config.niveis.length - 1;
for (const g of config.grupos) {
  const alvo = pais.turno0[g.id];
  if (alvo === undefined) throw new Error(`Falta o turno 0 de ${g.id}.`);
  const valores = trajetoria.map((v) => v[g.pressao]);
  const maior = Math.max(...valores);
  const menor = Math.min(...valores);
  const folga = pais.folga?.[g.id] ?? 2 + 1.5 * g.recursos.gente;
  // Os níveis de cima cabem abaixo do TETO: se a folga empurrar além,
  // o espaço entre eles encolhe (até PERTO), para o nível 3 seguir alcançável.
  const acima = niveis - alvo;
  const primeira = Math.min(maior + folga, TETO - PERTO * (acima - 1));
  const passo =
    acima > 1
      ? Math.min(DISTANCIA, (TETO - primeira) / (acima - 1))
      : DISTANCIA;
  const entradas: number[] = [];
  for (let k = 0; k < niveis; k += 1)
    entradas[k] =
      k >= alvo
        ? primeira + passo * (k - alvo)
        : menor - ABAIXO - DISTANCIA * (alvo - 1 - k);
  limites[g.id] = entradas.map((e) => ({
    entrada: arredonda(e),
    saida: arredonda(e - HISTERESE),
  }));
  console.log(
    `${g.id.padEnd(28)} turno 0 ${alvo}  pressão ${menor.toFixed(1)}–${maior.toFixed(1)}  entradas ${limites[g.id].map((l) => l.entrada).join(" / ")}`,
  );
}
writeFileSync(ARQUIVO, JSON.stringify({ ...pais, limites }, null, 2) + "\n");
execFileSync("npx", ["prettier", "--write", ARQUIVO]);

// Confere: com os limites novos, cada grupo termina no nível pedido.
const conferido = partida();
const errados = conferido.content.manifest.gruposDePressao!.grupos.filter(
  (g) => conferido.execution.values[g.nivel] !== pais.turno0[g.id],
);
if (errados.length)
  throw new Error(
    `Fora do nível pedido: ${errados.map((g) => `${g.id} (${conferido.execution.values[g.nivel]})`).join(", ")}`,
  );
console.log(`\n${config.grupos.length} grupos no nível do turno 0.`);
