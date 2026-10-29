// Quanto a renda dos perfis se move quando a sobra muda (camada C).
import { criarPartida } from "../../src/app/partida";
import { censoDoPais } from "../../src/app/partida/censo";

const p = criarPartida({ ocorrencias: false, eleicao: false });
if (!p.ok) throw new Error(p.erros.join(" "));
const { content, game } = p.value;
const ini = game.valoresIniciais!;
const mostra = (nome: string, v: Record<string, number>) => {
  const renda = censoDoPais(content, v, ini).find((a) => a.id === "renda")!;
  console.log(nome);
  for (const f of renda.faixas)
    console.log(`  ${f.nome}: ${(f.parte * 100).toFixed(1)}% (${f.variacao?.toFixed(1) ?? "—"} pt)`);
};
mostra("início", ini);
for (const k of [1.5, 3])
  mostra(`imposto de renda ×${k}`, { ...ini, arrecadacao_renda_pessoas: ini.arrecadacao_renda_pessoas * k });
mostra("seguro inflado: consumo ×2", { ...ini, arrecadacao_consumo: ini.arrecadacao_consumo * 2 });
