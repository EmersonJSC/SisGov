import type { DefinicaoGerador, NoGerado, RelacaoGerada } from "./types";

const hipotese = (motivo: string) => ({ estado: "hipotese" as const, motivo });

const nos: NoGerado[] = [
  {
    id: "demanda-setorial",
    tipo: "indice",
    nome: "Demanda setorial",
    area: "produção",
    unidade: "unidades por turno",
    proveniencia: hipotese(
      "A série, a unidade e a regra de crescimento variam por setor e precisam de fonte específica.",
    ),
  },
  {
    id: "regime-propriedade",
    tipo: "lei",
    nome: "Formas de propriedade permitidas",
    area: "propriedade",
    decisao: {
      pergunta: "Quais formas de propriedade a lei permite neste setor?",
      variavel: "formas_propriedade_permitidas",
      modo: "opcoes",
      opcoes: [
        { id: "privada", rotulo: "Só propriedade privada", valor: 0 },
        {
          id: "mista",
          rotulo: "Propriedade pública e privada permitidas",
          valor: 1,
        },
        { id: "publica", rotulo: "Só propriedade pública", valor: 2 },
      ],
    },
    proveniencia: hipotese(
      "Opções de protótipo; precisam ser derivadas de legislação comparada. A escolha define permissões, sem alterar automaticamente produtividade ou investimento.",
    ),
  },
  {
    id: "participacao-publica",
    tipo: "indice",
    nome: "Participação pública efetiva",
    area: "propriedade",
    unidade: "% do patrimônio empresarial",
    proveniencia: hipotese(
      "Estoque por setor; valor inicial real precisa de inventário de ativos e participação acionária.",
    ),
  },
  {
    id: "lei-nacionalizacao",
    tipo: "lei",
    nome: "Procedimento de nacionalização",
    area: "propriedade",
    decisao: {
      pergunta:
        "Qual procedimento jurídico permite transferir ativos privados ao Estado?",
      variavel: "procedimento_nacionalizacao",
      modo: "opcoes",
      opcoes: [
        { id: "vedada", rotulo: "Vedada neste setor", valor: 0 },
        {
          id: "indenizada",
          rotulo: "Permitida com compensação definida",
          valor: 1,
        },
      ],
    },
    proveniencia: hipotese(
      "Alternativas jurídicas são placeholders e devem ser verificadas em fontes constitucionais/legais de cada contexto antes de gerar conteúdo jogável.",
    ),
  },
  {
    id: "transacao-patrimonial",
    tipo: "programa",
    nome: "Compra ou venda de participação",
    area: "propriedade",
    unidade: "pontos percentuais do patrimônio por turno",
    decisao: {
      pergunta: "O Estado compra ou vende participação neste setor?",
      variavel: "variacao_participacao_publica",
      modo: "faixa",
      faixa: {
        minimo: -100,
        maximo: 100,
        motivoLimite:
          "A participação acionária total de um setor varia de 0% a 100%; a transação por turno também não pode exceder esse estoque.",
      },
    },
    proveniencia: hipotese(
      "Compra/venda altera participação, ativos públicos e caixa pelo valor da transação; forma jurídica e avaliação ainda precisam de fontes.",
    ),
  },
  {
    id: "capacidade-setorial",
    tipo: "indice",
    nome: "Capacidade produtiva",
    area: "produção",
    unidade: "unidades por turno",
    proveniencia: hipotese(
      "Conversão entre capital e capacidade precisa de dados e varia por setor.",
    ),
  },
  {
    id: "aporte-publico",
    tipo: "programa",
    nome: "Investimento público na empresa",
    area: "propriedade",
    unidade: "unidades monetárias por turno",
    decisao: {
      pergunta:
        "Quanto investir na empresa pública ou de participação estatal?",
      variavel: "investimento_publico",
      modo: "faixa",
      faixa: {
        minimo: 0,
        motivoLimite:
          "Investimento público negativo não é aporte; venda de ativo é uma decisão patrimonial separada. Sem limite superior fixo.",
      },
    },
    proveniencia: hipotese(
      "O controle demonstra a decisão recorrente; valores e mecanismos de execução não foram calibrados.",
    ),
  },
  {
    id: "producao-setorial",
    tipo: "indice",
    nome: "Produção realizada",
    area: "produção",
    unidade: "unidades por turno",
    proveniencia: hipotese(
      "Produção depende de capacidade, demanda, insumos, mão de obra e tecnologia; esta rodada mínima representa só capacidade e demanda.",
    ),
  },
  {
    id: "lucro-operacional",
    tipo: "indice",
    nome: "Lucro operacional",
    area: "produção",
    unidade: "unidades monetárias por turno",
    proveniencia: hipotese(
      "Preço e custo unitário são parâmetros de demonstração até obter séries setoriais.",
    ),
  },
  {
    id: "preco-setorial",
    tipo: "indice",
    nome: "Preço de venda",
    area: "produção",
    unidade: "unidades monetárias por unidade produzida",
    proveniencia: hipotese(
      "Preço pode depender de mercado, tarifa regulada e contratos; não é constante universal.",
    ),
  },
  {
    id: "custo-unitario-setorial",
    tipo: "indice",
    nome: "Custo unitário de produção",
    area: "produção",
    unidade: "unidades monetárias por unidade produzida",
    proveniencia: hipotese(
      "Custos variam por tecnologia, salários, insumos, manutenção e setor; fonte específica necessária.",
    ),
  },
  {
    id: "tributacao-empresas",
    tipo: "lei",
    nome: "Tributação das empresas",
    area: "contas públicas",
    unidade: "% da base tributável",
    decisao: {
      pergunta: "Qual alíquota legal aplicar à base tributável?",
      variavel: "aliquota_empresas",
      modo: "faixa",
      faixa: {
        minimo: 0,
        motivoLimite:
          "Alíquota abaixo de zero é subsídio e deve ser representada como instrumento próprio; não há teto superior arbitrário.",
      },
    },
    proveniencia: hipotese(
      "Controle contínuo aberto no limite superior; arrecadação efetiva depende da base tributável, comportamento, evasão e capacidade de cobrança.",
    ),
  },
  {
    id: "arrecadacao-empresas",
    tipo: "conta",
    nome: "Imposto arrecadado das empresas",
    area: "contas públicas",
    unidade: "unidades monetárias por turno",
    proveniencia: hipotese(
      "Base, evasão, inadimplência e capacidade de cobrança requerem dados e mecanismo explícito.",
    ),
  },
  {
    id: "dividendos-estatais",
    tipo: "conta",
    nome: "Dividendos recebidos pelo Estado",
    area: "contas públicas",
    unidade: "unidades monetárias por turno",
    proveniencia: hipotese(
      "Política de distribuição, retenção de lucros e necessidade de reinvestimento precisam de fontes por empresa/setor.",
    ),
  },
  {
    id: "caixa-publico",
    tipo: "conta",
    nome: "Caixa público",
    area: "contas públicas",
    unidade: "unidades monetárias",
    proveniencia: hipotese(
      "Estoque inicial e identidade com dívida/custeio serão conectados ao pacote fiscal do jogo.",
    ),
  },
  {
    id: "patrimonio-publico-setorial",
    tipo: "indice",
    nome: "Patrimônio empresarial público",
    area: "propriedade",
    unidade: "unidades monetárias",
    proveniencia: hipotese(
      "Valor contábil, preço de aquisição e avaliação de ativos precisam de método e fonte.",
    ),
  },
];

const relacoes: RelacaoGerada[] = [
  {
    de: "regime-propriedade",
    para: "transacao-patrimonial",
    tipo: "requer",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "A regra constitucional define as formas permitidas; ela não muda automaticamente a participação, produtividade ou investimento.",
    ),
  },
  {
    de: "lei-nacionalizacao",
    para: "transacao-patrimonial",
    tipo: "requer",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "A transferência por nacionalização depende de base legal e compensação conforme regra aplicável; ainda não especificado.",
    ),
  },
  {
    de: "transacao-patrimonial",
    para: "participacao-publica",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Compras, vendas ou transferência legal mudam a participação efetiva; cada modo terá fluxo patrimonial próprio.",
    ),
  },
  {
    de: "transacao-patrimonial",
    para: "patrimonio-publico-setorial",
    tipo: "transfere",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "O valor dos ativos públicos deve acompanhar participação e preço da transação; método de avaliação pendente.",
    ),
  },
  {
    de: "participacao-publica",
    para: "patrimonio-publico-setorial",
    tipo: "transfere",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Transferência de propriedade altera patrimônio e caixa; fórmula de avaliação ainda não definida.",
    ),
  },
  {
    de: "transacao-patrimonial",
    para: "caixa-publico",
    tipo: "transfere",
    atrasoTurnos: 0,
    fluxo: "compra-venda-ativos",
    proveniencia: hipotese(
      "Compra reduz caixa e aumenta ativos; venda aumenta caixa e reduz ativos. Não é receita tributária.",
    ),
  },
  {
    de: "participacao-publica",
    para: "dividendos-estatais",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "A participação determina a parcela pública dos dividendos distribuídos.",
    ),
  },
  {
    de: "aporte-publico",
    para: "caixa-publico",
    tipo: "financia",
    atrasoTurnos: 0,
    fluxo: "investimento-publico",
    proveniencia: hipotese(
      "O aporte é saída de caixa; execução pode ser parcial e precisa de capacidade administrativa.",
    ),
  },
  {
    de: "aporte-publico",
    para: "capacidade-setorial",
    tipo: "altera",
    atrasoTurnos: 4,
    proveniencia: hipotese(
      "A conversão e o prazo são parâmetros experimentais, a calibrar por setor.",
    ),
  },
  {
    de: "capacidade-setorial",
    para: "producao-setorial",
    tipo: "limita",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Capacidade limita produção neste protótipo; outros insumos ainda faltam.",
    ),
  },
  {
    de: "demanda-setorial",
    para: "producao-setorial",
    tipo: "limita",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "A produção atendida não excede a demanda nem a capacidade neste protótipo.",
    ),
  },
  {
    de: "producao-setorial",
    para: "lucro-operacional",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Receita depende de preço e custo, ambos ainda hipotéticos.",
    ),
  },
  {
    de: "preco-setorial",
    para: "lucro-operacional",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Preço de venda altera receita operacional; formação de preço e tarifas dependem do regime do setor.",
    ),
  },
  {
    de: "custo-unitario-setorial",
    para: "lucro-operacional",
    tipo: "altera",
    sinal: -1,
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Custo de produção reduz lucro operacional; componentes e comportamento ainda não foram medidos.",
    ),
  },
  {
    de: "tributacao-empresas",
    para: "arrecadacao-empresas",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "A alíquota escolhida incide sobre uma base que reage a comportamento e fiscalização.",
    ),
  },
  {
    de: "lucro-operacional",
    para: "arrecadacao-empresas",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "O lucro é uma base candidata; regime tributário pode usar outra base real.",
    ),
  },
  {
    de: "lucro-operacional",
    para: "dividendos-estatais",
    tipo: "altera",
    atrasoTurnos: 0,
    proveniencia: hipotese(
      "Dividendos dependem de lucro distribuível, participação e decisão de retenção.",
    ),
  },
  {
    de: "arrecadacao-empresas",
    para: "caixa-publico",
    tipo: "altera",
    atrasoTurnos: 0,
    fluxo: "imposto-empresas",
    proveniencia: hipotese(
      "Imposto é entrada fiscal recorrente, separada de dividendos.",
    ),
  },
  {
    de: "dividendos-estatais",
    para: "caixa-publico",
    tipo: "altera",
    atrasoTurnos: 0,
    fluxo: "dividendos",
    proveniencia: hipotese(
      "Dividendo é entrada patrimonial recorrente, separada de tributo e PIB.",
    ),
  },
  {
    de: "caixa-publico",
    para: "aporte-publico",
    tipo: "retorna-para",
    atrasoTurnos: 1,
    proveniencia: hipotese(
      "Espaço de caixa condiciona o próximo investimento público; a restrição fiscal completa virá do mecanismo financeiro.",
    ),
  },
  {
    de: "caixa-publico",
    para: "transacao-patrimonial",
    tipo: "retorna-para",
    atrasoTurnos: 1,
    proveniencia: hipotese(
      "A decisão recorrente de comprar/vender considera caixa e patrimônio; não é uma regra automática de execução.",
    ),
  },
  {
    de: "caixa-publico",
    para: "tributacao-empresas",
    tipo: "retorna-para",
    atrasoTurnos: 1,
    proveniencia: hipotese(
      "A próxima decisão tributária considera arrecadação, resposta da base e espaço fiscal.",
    ),
  },
];

export const CICLO_EMPRESAS_PILOTO: DefinicaoGerador = {
  id: "ciclo-empresas-piloto",
  versao: 1,
  nos,
  relacoes,
  parametros: [
    {
      id: "crescimento-demanda-anual",
      valor: 2,
      passo: 0.5,
      proveniencia: hipotese(
        "Exemplo numérico para exercitar o pipeline; não é estimativa econômica.",
      ),
    },
    {
      id: "prazo-investimento-turnos",
      valor: 4,
      passo: 1,
      proveniencia: hipotese(
        "Prazo ilustrativo; cada setor e tipo de projeto requer evidência própria.",
      ),
    },
    {
      id: "sensibilidade-evasao",
      valor: 0.7,
      passo: 0.1,
      proveniencia: hipotese(
        "Parâmetro de teste; requer dados de resposta da base tributária.",
      ),
    },
  ],
};

export type ParametrosCicloEmpresas = {
  turnos: number;
  demandaInicial: number;
  crescimentoDemandaAnual: number;
  capacidadeInicial: number;
  caixaInicial: number;
  investimentoPublico: number;
  investimentoPrivado: number;
  investimentos?: readonly {
    turno: number;
    publico: number;
    privado: number;
  }[];
  prazoInvestimento: number;
  participacaoPublica: number;
  participacaoMinimaPermitida: number;
  participacaoMaximaPermitida: number;
  transacoes?: readonly {
    turno: number;
    tipo: "compra" | "venda" | "nacionalizacao";
    pontosPercentuais: number;
    valorPorPonto?: number;
  }[];
  nacionalizacaoPermitida: boolean;
  valorEmpresaInicial: number;
  preco: number;
  variacaoPrecoAnual: number;
  custoUnitario: number;
  variacaoCustoAnual: number;
  aliquotaEscolhida: number;
  sensibilidadeEvasao: number;
  taxaDistribuicaoLucro: number;
};

export type EstadoTurnoEmpresas = {
  turno: number;
  demanda: number;
  capacidade: number;
  producao: number;
  participacaoPublica: number;
  valorEmpresa: number;
  patrimonioPublico: number;
  compraOuVenda: number;
  nacionalizacao: number;
  preco: number;
  custoUnitario: number;
  lucroOperacional: number;
  imposto: number;
  dividendos: number;
  investimentoPublico: number;
  investimentoPrivado: number;
  caixaPublico: number;
};

export type FormaDePropriedadePermitida = "privada" | "mista" | "publica";

export function limitesDePropriedade(forma: FormaDePropriedadePermitida) {
  if (forma === "privada") return { minimo: 0, maximo: 0 };
  if (forma === "publica") return { minimo: 100, maximo: 100 };
  return { minimo: 0, maximo: 100 };
}

export function simularCicloEmpresas(
  p: ParametrosCicloEmpresas,
): readonly EstadoTurnoEmpresas[] {
  if (
    p.participacaoMinimaPermitida < 0 ||
    p.participacaoMaximaPermitida > 100 ||
    p.participacaoMinimaPermitida > p.participacaoMaximaPermitida
  )
    throw new Error(
      "A faixa constitucional de participação deve ficar entre 0% e 100%.",
    );
  if (
    p.participacaoPublica < p.participacaoMinimaPermitida ||
    p.participacaoPublica > p.participacaoMaximaPermitida
  )
    throw new Error(
      "A participação inicial não é permitida pela regra de propriedade selecionada.",
    );
  const saida: EstadoTurnoEmpresas[] = [];
  const obras: { entrega: number; capacidade: number }[] = [];
  let capacidadeNova = 0;
  let caixa = p.caixaInicial;
  let participacao = p.participacaoPublica;
  let valorEmpresa = p.valorEmpresaInicial;
  for (let t = 0; t < p.turnos; t++) {
    for (let i = obras.length - 1; i >= 0; i--) {
      if (obras[i].entrega <= t) {
        capacidadeNova += obras[i].capacidade;
        obras.splice(i, 1);
      }
    }
    const transacao = p.transacoes?.find((item) => item.turno === t + 1);
    const investimento = p.investimentos?.find(
      (item) => item.turno === t + 1,
    ) ?? {
      turno: t + 1,
      publico: p.investimentoPublico,
      privado: p.investimentoPrivado,
    };
    if (transacao?.tipo === "nacionalizacao" && !p.nacionalizacaoPermitida)
      throw new Error(
        "A regra jurídica deste contexto não permite nacionalização.",
      );
    if (
      transacao &&
      (((transacao.tipo === "compra" || transacao.tipo === "nacionalizacao") &&
        transacao.pontosPercentuais < 0) ||
        (transacao.tipo === "venda" && transacao.pontosPercentuais > 0))
    )
      throw new Error(
        "O sinal da transação não corresponde ao tipo de compra, venda ou nacionalização.",
      );
    const pedido = transacao?.pontosPercentuais ?? 0;
    const deltaParticipacao = Math.max(
      p.participacaoMinimaPermitida - participacao,
      Math.min(p.participacaoMaximaPermitida - participacao, pedido),
    );
    const precoTransacao = transacao?.valorPorPonto ?? valorEmpresa / 100;
    const fluxoPatrimonial =
      transacao?.tipo === "nacionalizacao"
        ? 0
        : deltaParticipacao * precoTransacao;
    const fluxoNacionalizacao =
      transacao?.tipo === "nacionalizacao"
        ? deltaParticipacao * precoTransacao
        : 0;
    participacao += deltaParticipacao;
    caixa -= fluxoPatrimonial + fluxoNacionalizacao; // transferência patrimonial, fora da receita tributária.
    valorEmpresa += investimento.publico + investimento.privado;
    caixa -= investimento.publico; // investimento é saída de caixa e formação de ativo, sem somá-lo ao PIB aqui.
    const demanda =
      p.demandaInicial * (1 + p.crescimentoDemandaAnual / 100) ** (t / 4);
    const capacidade = p.capacidadeInicial + capacidadeNova;
    const producao = Math.max(0, Math.min(demanda, capacidade));
    const preco = p.preco * (1 + p.variacaoPrecoAnual / 100) ** (t / 4);
    const custoUnitario =
      p.custoUnitario * (1 + p.variacaoCustoAnual / 100) ** (t / 4);
    const lucroOperacional = producao * (preco - custoUnitario);
    const fracaoAliquota = Math.max(0, p.aliquotaEscolhida / 100);
    const baseTributavel =
      Math.max(0, lucroOperacional) *
      Math.exp(-fracaoAliquota * Math.max(0, p.sensibilidadeEvasao));
    const imposto = fracaoAliquota * baseTributavel;
    const dividendos =
      ((Math.max(0, lucroOperacional - imposto) * participacao) / 100) *
      Math.max(0, Math.min(1, p.taxaDistribuicaoLucro));
    caixa += imposto + dividendos;
    obras.push({
      entrega: t + p.prazoInvestimento,
      capacidade: Math.max(
        0,
        (investimento.publico + investimento.privado) / 10,
      ),
    });
    saida.push({
      turno: t + 1,
      demanda,
      capacidade,
      producao,
      participacaoPublica: participacao,
      valorEmpresa,
      patrimonioPublico: (valorEmpresa * participacao) / 100,
      compraOuVenda: fluxoPatrimonial,
      nacionalizacao: fluxoNacionalizacao,
      preco,
      custoUnitario,
      lucroOperacional,
      imposto,
      dividendos,
      investimentoPublico: investimento.publico,
      investimentoPrivado: investimento.privado,
      caixaPublico: caixa,
    });
  }
  return saida;
}

export function sugerirInvestimentoPublico(
  parametros: ParametrosCicloEmpresas,
  candidatos: readonly number[],
  pisoCaixa: number,
): { valor: number; pontuacao: number; viavel: boolean } | undefined {
  return candidatos
    .map((valor) => {
      const rodada = simularCicloEmpresas({
        ...parametros,
        investimentoPublico: valor,
      });
      const cobertura =
        rodada.reduce(
          (soma, estado) =>
            soma + estado.producao / Math.max(1, estado.demanda),
          0,
        ) / Math.max(1, rodada.length);
      const caixaFinal = rodada.at(-1)?.caixaPublico ?? parametros.caixaInicial;
      const viavel = caixaFinal >= pisoCaixa;
      return {
        valor,
        pontuacao: viavel ? cobertura : -Math.abs(caixaFinal - pisoCaixa),
        viavel,
      };
    })
    .sort((a, b) => b.pontuacao - a.pontuacao)[0];
}
