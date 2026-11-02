// Passo 11, peça 5: o mundo reage às leis. Rodar: npm run mundo
//
// Esperado (escrito antes, igual a src/motor/mundo/mundo.md), país de teste:
// - sem mudar nada: opiniões quase paradas (partida perto da desejada);
// - lei que muda a posição na bússola: cada potência anda para o seu lado,
//   10% da distância por turno (quem fica mais perto sobe, quem fica mais
//   longe desce); a reputação é a média pesada das 5 opiniões;
// - segurança externa = poder defensivo − (100 − reputação): sobe e desce
//   junto com a reputação; o poder defensivo não muda (nenhuma lei mexe nele
//   ainda);
// - leis militares (bloco A de segurança, 02/nov): verba 4% e serviço de 18
//   meses sobem o poder defensivo (e a segurança externa junto); o serviço
//   derruba liberdade civil logo e padrão de vida depois; idade mínima 21
//   anos (em vez de 16) baixa o poder defensivo um pouco;
// - câmeras (bloco C, 02/nov): verba alta sobe a segurança pública um pouco e
//   tira um pouco de liberdade civil; reconhecimento facial sobe a segurança
//   mais e derruba muito a liberdade civil; uso livre fica no meio dos dois
//   (o país de teste já parte de "só com ordem judicial");
// - proteção de dados (permissão e apagar) sobe a liberdade civil; maioridade
//   14 anos sobe a segurança pouco e os presídios muito (mais tarde), e tira
//   liberdade; contratos militares públicos baixam a corrupção e sobem um pouco
//   o poder defensivo;
// - enquanto as leis ficam no meio da bússola, a mudança é pequena (poucos
//   pontos); só leis nas pontas vão pesar de verdade (passo 13).
import { criarPartida, jogar, type Estado, type Pedido } from "../src/partida";

const TURNOS = [1, 12, 24];
const PAIS = "teste";

const lei = (id: string, valor: number | string): Pedido[] => [
  { tipo: "mudar_lei", lei: id, valor },
];

const CENARIOS: [string, Pedido[]][] = [
  ["sem mudar nada", []],
  ["pena de morte para crimes graves", lei("pena-de-morte", "crimes-graves")],
  ["imposto de renda 60%", lei("imposto-renda", 0.6)],
  ["terras indígenas 30%", lei("terras-indigenas", 0.3)],
  ["verba militar 4% do PIB", lei("gasto-militar", 0.04)],
  ["serviço militar 18 meses", lei("servico-militar", 18)],
  ["idade do voluntário 21 anos", lei("idade-voluntario", 21)],
  ["verba das câmeras 0,5% do PIB", lei("gasto-cameras", 0.005)],
  [
    "câmeras: reconhecimento facial",
    lei("regra-cameras", "reconhecimento-facial"),
  ],
  [
    "proteção de dados: permissão e apagar",
    lei("protecao-digital", "permissao-e-apagar"),
  ],
  ["maioridade penal 14 anos", lei("maioridade-penal", 14)],
  [
    "contratos militares: tudo público",
    lei("transparencia-militar", "tudo-publico"),
  ],
  ["câmeras: polícia usa livremente", lei("regra-cameras", "uso-livre")],
];

const n = (v: number) => v.toFixed(1).padStart(5);
const partida0 = criarPartida(PAIS, 42, { semCongresso: true });
const {
  potencias,
  indiceReputacao,
  indicePoderDefensivo,
  indiceSegurancaExterna,
} = partida0.regras;

function linha(rotulo: string, f: (e: Estado) => number, es: Estado[]) {
  console.log(`  ${rotulo.padEnd(30)} ${es.map((e) => n(f(e))).join("   ")}`);
}

for (const [rotulo, pedidos] of CENARIOS) {
  const estados = [0, ...TURNOS].map(
    (t) =>
      jogar(criarPartida(PAIS, 42, { semCongresso: true }), t, pedidos).estado,
  );
  console.log(`\n${rotulo}`);
  console.log(
    `  ${"".padEnd(30)} ${["turno 0", ...TURNOS.map((t) => `t ${t}`)].map((s) => s.padStart(5)).join("   ")}`,
  );
  for (const p of potencias!) linha(p.nome, (e) => e.opinioes[p.id], estados);
  linha("reputação", (e) => e.jogabilidade[indiceReputacao!], estados);
  linha(
    "poder defensivo",
    (e) => e.jogabilidade[indicePoderDefensivo!],
    estados,
  );
  linha("liberdade civil", (e) => e.jogabilidade.liberdade_civil, estados);
  linha("segurança pública", (e) => e.jogabilidade.seguranca, estados);
  linha("corrupção", (e) => e.jogabilidade.corrupcao, estados);
  linha(
    "lotação dos presídios",
    (e) => e.jogabilidade.lotacao_presidios,
    estados,
  );
  linha("padrão de vida", (e) => e.jogabilidade.padrao_vida, estados);
  linha(
    "segurança externa",
    (e) => e.jogabilidade[indiceSegurancaExterna!],
    estados,
  );
}
