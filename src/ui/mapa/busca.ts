/**
 * Busca de leis e indicadores pela lupa. Procura no nome, nas opções, na
 * descrição e no tema do ministério, sem acento e sem maiúscula, e conhece
 * as palavras que o jogador usa ("estatizar", "juros", "aposentadoria").
 * Só lê a `VisaoPartida`; não mexe no jogo.
 */
import type { VisaoArea, VisaoBolha, VisaoLei } from "../../app/partida";

export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Palavras do dia a dia que levam a uma lei cujo nome não as usa. A chave é
 * o começo da palavra digitada (sem acento).
 */
const PALAVRAS: Readonly<Record<string, readonly string[]>> = {
  estatiz: ["empresas-estatais-e-privatizacao"],
  estata: ["empresas-estatais-e-privatizacao"],
  estatal: ["empresas-estatais-e-privatizacao"],
  privatiz: ["empresas-estatais-e-privatizacao"],
  nacionaliz: [
    "empresas-estatais-e-privatizacao",
    "regime-do-petroleo-e-mineracao",
  ],
  petrol: ["regime-do-petroleo-e-mineracao", "matriz-energetica"],
  juro: ["meta-de-inflacao", "autonomia-banco-central"],
  "banco central": ["autonomia-banco-central", "meta-de-inflacao"],
  inflac: ["meta-de-inflacao", "controle-de-precos"],
  dolar: ["regime-cambial", "controle-de-capitais"],
  cambio: ["regime-cambial"],
  preco: ["controle-de-precos"],
  aposent: [
    "idade-minima-aposentadoria",
    "sistema-previdenciario",
    "reajuste-de-beneficios",
  ],
  previd: ["sistema-previdenciario", "idade-minima-aposentadoria"],
  arma: ["armas-de-fogo", "gasto-com-defesa"],
  polici: [
    "ciclo-policial",
    "policia-militar",
    "cameras-corporais",
    "verba-policia-federal",
  ],
  maconha: ["cannabis-legal", "lei-de-drogas"],
  morte: ["pena-de-morte"],
  pris: ["penas-e-progressao", "vagas-em-presidios"],
  droga: ["lei-de-drogas", "cannabis-legal"],
  salario: ["salario-minimo", "piso-salarial-professores"],
  sindica: ["negociacao-coletiva-e-sindicatos"],
  greve: ["negociacao-coletiva-e-sindicatos"],
  clt: ["legislacao-trabalhista"],
  bolsa: ["transferencia-de-renda"],
  renda: ["transferencia-de-renda", "imposto-renda-pessoas"],
  fome: ["seguranca-alimentar", "transferencia-de-renda"],
  sus: ["sistema-de-saude", "piso-saude"],
  hospital: ["sistema-de-saude", "piso-saude"],
  remedio: ["farmacia-popular", "genericos-e-patentes-medicamentos"],
  vacina: ["vacinacao-obrigatoria"],
  escola: ["ensino-obrigatorio", "escola-tempo-integral", "piso-educacao"],
  universidade: ["acesso-ensino-superior"],
  faculdade: ["acesso-ensino-superior"],
  floresta: ["codigo-florestal"],
  desmat: ["codigo-florestal", "licenciamento-ambiental"],
  energia: ["matriz-energetica", "energia-nuclear"],
  nuclear: ["energia-nuclear"],
  casa: ["programa-habitacao-popular"],
  moradia: ["programa-habitacao-popular"],
  onibus: ["transporte-publico"],
  metro: ["transporte-publico"],
  estrada: ["investimento-em-infraestrutura"],
  obra: ["investimento-em-infraestrutura"],
  esgoto: ["saneamento-basico"],
  agua: ["saneamento-basico"],
  imigra: ["politica-de-imigracao", "refugiados-e-asilo"],
  exercito: ["gasto-com-defesa", "servico-militar"],
  militar: ["gasto-com-defesa", "servico-militar"],
  comercio: ["acordos-comerciais", "tarifas-de-importacao"],
  importa: ["tarifas-de-importacao"],
  exporta: ["acordos-comerciais"],
  eleic: ["voto-obrigatorio", "financiamento-de-campanhas", "reeleicao"],
  voto: ["voto-obrigatorio"],
  corrup: ["lei-anticorrupcao", "transparencia-publica"],
  internet: ["regulacao-redes-sociais", "protecao-de-dados"],
  rede: ["regulacao-redes-sociais"],
  aposta: ["apostas-e-jogos-de-azar"],
  bet: ["apostas-e-jogos-de-azar"],
  aborto: ["aborto"],
  casamento: ["casamento-e-uniao-civil"],
  cota: ["acoes-afirmativas"],
  heranca: ["imposto-heranca"],
  fortuna: ["imposto-grandes-fortunas"],
  rico: ["imposto-grandes-fortunas", "tributacao-dividendos"],
  lucro: ["imposto-renda-empresas", "tributacao-dividendos"],
  gasto: ["regra-fiscal"],
  teto: ["regra-fiscal"],
  divida: ["regra-fiscal"],
};

/** Palavras do grupo de cada lei, para "imposto", "verba"… */
const GRUPO: Readonly<Record<string, string>> = {
  tributaria: "imposto impostos tributo taxa aliquota",
  orcamentaria: "gasto verba orcamento investimento dinheiro",
  regulatoria: "regra regulacao",
  institucional: "instituicao constituicao",
};

export type Resultado = Readonly<{
  tipo: "lei" | "bolha";
  id: string;
  nome: string;
  /** Área do governo ("Economia") ou "Indicador". */
  tema: string;
  /** Id da área (a esfera que a lupa abre). */
  ministerio?: string;
  /** Ministério dono da lei ("Fazenda"). */
  pasta?: string;
  /** Opção em vigor (leis de opções). */
  vigente?: string;
  /** Por que apareceu: a opção ou o trecho que bateu. */
  motivo?: string;
  pontos: number;
}>;

function trecho(texto: string, termo: string): string | undefined {
  const i = normalizar(texto).indexOf(termo);
  if (i < 0) return undefined;
  const ini = Math.max(0, i - 40);
  const fim = Math.min(texto.length, i + termo.length + 60);
  return `${ini > 0 ? "…" : ""}${texto.slice(ini, fim).trim()}${fim < texto.length ? "…" : ""}`;
}

export function buscar(
  consulta: string,
  leis: readonly VisaoLei[],
  bolhas: readonly VisaoBolha[],
  governo: readonly VisaoArea[] = [],
  limite = 12,
): Resultado[] {
  const q = normalizar(consulta).trim();
  if (q.length < 2) return [];
  const termos = q.split(/\s+/).filter(Boolean);
  // palavras do dia a dia: a consulta inteira ou cada termo
  const indicadas = new Map<string, number>();
  for (const [chave, ids] of Object.entries(PALAVRAS)) {
    const bate =
      q.includes(chave) ||
      termos.some((t) => t.length >= 3 && chave.startsWith(t)) ||
      termos.some((t) => t.startsWith(chave));
    if (bate)
      ids.forEach((id, i) =>
        indicadas.set(id, Math.max(indicadas.get(id) ?? 0, 9 - i)),
      );
  }
  const areas = new Map(governo.map((a) => [a.id, a]));
  const saida: Resultado[] = [];
  for (const lei of leis) {
    const nome = normalizar(lei.nome);
    const ministerio = lei.areas[0];
    const area = areas.get(ministerio);
    const pasta = area?.ministerios.find((m) => m.id === lei.ministerioId);
    const tema = area?.titulo ?? lei.ministerio;
    const faz = normalizar(area?.faz ?? "");
    // o nome do ministério também acha a lei ("fazenda", "itamaraty")
    const nomeDaPasta = normalizar(
      `${pasta?.nome ?? ""} ${pasta?.cargo ?? ""}`,
    );
    let pontos = indicadas.get(lei.id) ?? 0;
    let motivo: string | undefined;
    for (const t of termos) {
      if (nome.startsWith(t)) pontos += 12;
      else if (nome.includes(t)) pontos += 9;
      const opcao = lei.opcoes?.find((o) => normalizar(o.rotulo).includes(t));
      if (opcao) {
        pontos += 6;
        motivo ??= `Opção: ${opcao.rotulo}`;
      }
      if (normalizar(lei.descricao).includes(t)) {
        pontos += 4;
        motivo ??= trecho(lei.descricao, t);
      }
      if (normalizar(tema).includes(t)) pontos += 3;
      if (GRUPO[lei.grupo]?.includes(t)) pontos += 3;
      if (faz.includes(t)) pontos += 1;
      if (t.length >= 4 && nomeDaPasta.includes(t)) pontos += 3;
    }
    if (pontos <= 1) continue;
    const vigente = lei.opcoes?.find((o) => o.id === lei.opcaoAtual)?.rotulo;
    saida.push({
      tipo: "lei",
      id: lei.id,
      nome: lei.nome,
      tema,
      ministerio,
      ...(pasta ? { pasta: pasta.cargo } : {}),
      ...(vigente ? { vigente } : {}),
      ...(motivo ? { motivo } : {}),
      pontos,
    });
  }
  for (const bolha of bolhas) {
    const nome = normalizar(bolha.nome);
    let pontos = 0;
    for (const t of termos) {
      if (nome.startsWith(t)) pontos += 8;
      else if (nome.includes(t)) pontos += 6;
    }
    if (pontos === 0) continue;
    saida.push({
      tipo: "bolha",
      id: bolha.id,
      nome: bolha.nome,
      tema: bolha.tipo === "grupo" ? "Grupo social" : "Indicador",
      pontos: pontos - 1,
    });
  }
  return saida
    .sort(
      (a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, "pt-BR"),
    )
    .slice(0, limite);
}
