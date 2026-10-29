// Quanto os valores dos perfis se movem quando o país muda (camada C).
import { criarPartida } from "../../src/app/partida";
import { censoDoPais } from "../../src/app/partida/censo";

const p = criarPartida({ ocorrencias: false, eleicao: false });
if (!p.ok) throw new Error(p.erros.join(" "));
const { content, game } = p.value;
const ini = game.valoresIniciais!;
console.log(
  "início:",
  ["sensacao_seguranca", "escolaridade", "desigualdade"]
    .map((k) => `${k}=${ini[k]?.toFixed(1)}`)
    .join(" "),
);
const mostra = (nome: string, v: Record<string, number>) => {
  const a = censoDoPais(content, v, ini).find((x) => x.id === "valores")!;
  console.log(nome);
  for (const f of a.faixas)
    console.log(
      `  ${f.nome}: ${(f.parte * 100).toFixed(1)}% (${f.variacao?.toFixed(1) ?? "—"} pt)`,
    );
};
mostra("início", ini);
for (const d of [10, 30, 60])
  mostra(`segurança −${d}`, {
    ...ini,
    sensacao_seguranca: ini.sensacao_seguranca - d,
  });
mostra("escolaridade +20", { ...ini, escolaridade: ini.escolaridade + 20 });
mostra("segurança −30 e escolaridade +30", {
  ...ini,
  sensacao_seguranca: ini.sensacao_seguranca - 30,
  escolaridade: ini.escolaridade + 30,
});
