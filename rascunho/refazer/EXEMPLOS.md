# Exemplos: o nível de qualidade esperado

> Escrito por Claude em 25/out/2026. Os ids de índices e grupos aqui são
> ilustrativos: use os do seu `indices.json` e `grupos.json`. O que importa é
> **o nível**: cada frase é sobre aquela ligação específica, cada efeito tem
> base própria, as forças variam conforme os estudos, e a lei tem ganhadores
> e perdedores.

## 1. Índices (trecho de `indices.json`)

```json
{
  "id": "desemprego",
  "nome": "Desemprego",
  "mede": "Parte das pessoas que procuram trabalho e não encontram.",
  "unidade": "percentual",
  "tipo": "calculado",
  "essencial": false,
  "movidoPor": [
    { "indice": "pib", "direcao": "desce", "porque": "Quando a economia cresce, as empresas contratam mais." },
    { "indice": "custo_trabalhista", "direcao": "sobe", "porque": "Contratar mais caro faz a empresa adiar vagas ou trocar gente por máquina." },
    { "indice": "qualificacao_trabalho", "direcao": "desce", "porque": "Quem tem formação encontra vaga mais rápido." }
  ],
  "antigo": ["desemprego"]
},
{
  "id": "informalidade",
  "nome": "Trabalho informal",
  "mede": "Parte dos trabalhadores sem contrato, sem contribuição e sem proteção da lei.",
  "unidade": "percentual",
  "tipo": "calculado",
  "essencial": false,
  "movidoPor": [
    { "indice": "custo_trabalhista", "direcao": "sobe", "porque": "Quanto mais caro o contrato formal, mais compensa contratar por fora." },
    { "indice": "complexidade_tributaria", "direcao": "sobe", "porque": "Regras difíceis de cumprir empurram pequenos negócios para a margem da lei." },
    { "indice": "instrucao", "direcao": "desce", "porque": "Trabalhadores com mais estudo conseguem mais vagas com contrato." }
  ],
  "antigo": ["informalidade"]
}
```

Repare: cada `porque` explica **aquela** ligação. Nenhuma frase serve para
outra.

## 2. Grupos (trecho de `grupos.json`)

```json
{
  "id": "trabalhadores_com_contrato",
  "nome": "Trabalhadores com contrato",
  "quem": "Empregados com carteira, contrato ou vínculo formal, no setor privado.",
  "querem": [
    { "indice": "renda_familias", "direcao": "sobe", "porque": "Vivem do salário e sentem cada reajuste." },
    { "indice": "desemprego", "direcao": "desce", "porque": "O medo de perder a vaga pesa mais que qualquer outro tema." },
    { "indice": "inflacao", "direcao": "desce", "porque": "O salário é corrigido uma vez por ano e os preços sobem todo mês." }
  ],
  "bussola": { "economia": -1, "costumes": 0 },
  "antigo": ["grupo_trabalhadores"]
},
{
  "id": "pequenos_empresarios",
  "nome": "Pequenos empresários",
  "quem": "Donos de negócios pequenos: comércio, oficina, restaurante, serviço.",
  "querem": [
    { "indice": "custo_trabalhista", "direcao": "desce", "porque": "Folha de pagamento é o maior custo de quem tem poucos funcionários." },
    { "indice": "complexidade_tributaria", "direcao": "desce", "porque": "Não têm contador e advogado para lidar com regras difíceis." },
    { "indice": "credito", "direcao": "sobe", "porque": "Dependem de empréstimo para capital de giro." }
  ],
  "bussola": { "economia": 1, "costumes": 1 },
  "antigo": ["grupo_pequenos_negocios"]
}
```

Repare: cada grupo quer coisas que **o separam** dos outros. Ninguém "quer a
população subindo" ou "quer padrão de vida subindo" de enfeite.

## 3. Lei de faixa (trecho de `leis/trabalho.json`)

```json
{
  "id": "aumento-real-do-salario-minimo",
  "nome": "Aumento real do salário mínimo",
  "decide": "Define quanto o salário mínimo sobe por ano acima da inflação, ou quanto perde para ela.",
  "familia": "regra",
  "nivel": "lei",
  "controle": {
    "tipo": "faixa",
    "unidade": "taxa_ano",
    "minimo": -10,
    "maximo": 10,
    "bussolaNoMinimo": { "economia": 2, "costumes": 0 },
    "bussolaNoMaximo": { "economia": -2, "costumes": 0 }
  },
  "modelos": ["social_democrata", "capitalismo_de_estado"],
  "efeitos": [
    { "alvo": "custo_trabalhista", "direcao": "sobe", "forca": "forte", "atraso": "imediato", "confianca": "consenso",
      "porque": "Toda empresa que paga o mínimo passa a pagar mais por funcionário." },
    { "alvo": "renda_familias", "direcao": "sobe", "forca": "media", "atraso": "imediato", "confianca": "consenso",
      "porque": "Quem ganha o mínimo, e quem ganha um pouco acima dele, recebe mais." },
    { "alvo": "desigualdade", "direcao": "desce", "forca": "media", "atraso": "meses", "confianca": "consenso",
      "porque": "A base da pirâmide de salários sobe mais que o topo." },
    { "alvo": "desemprego", "direcao": "sobe", "forca": "fraca", "atraso": "meses", "confianca": "debatido",
      "porque": "Parte das empresas contrata menos quando o mínimo fica caro para ela.",
      "nota": "Vários estudos não acham queda de emprego com aumentos moderados; o efeito aparece mais em aumentos grandes e em jovens." },
    { "alvo": "informalidade", "direcao": "sobe", "forca": "fraca", "atraso": "meses", "confianca": "debatido",
      "porque": "Negócios pequenos que não conseguem pagar o novo valor contratam sem contrato.",
      "nota": "Em alguns países o mínimo também puxa o salário informal para cima, sem aumentar a informalidade." },
    { "alvo": "inflacao", "direcao": "sobe", "forca": "fraca", "atraso": "meses", "confianca": "debatido",
      "porque": "Setores com muitos funcionários no mínimo repassam parte do custo aos preços.",
      "nota": "O repasse medido costuma ser pequeno e concentrado em restaurantes e serviços." }
  ],
  "apoiam": ["trabalhadores_com_contrato", "sindicatos"],
  "rejeitam": ["pequenos_empresarios"],
  "requer": [],
  "exclui": [],
  "trava": []
}
```

Repare: seis efeitos, para lados diferentes, com forças diferentes; o que é
certo é `consenso`, o que é briga entre estudos é `debatido` com `nota`.

## 4. Lei de opções (trecho de `leis/trabalho.json`)

```json
{
  "id": "direito-de-greve",
  "nome": "Direito de greve",
  "decide": "Define se os trabalhadores podem parar o trabalho em protesto e com quais condições.",
  "familia": "regra",
  "nivel": "lei",
  "controle": {
    "tipo": "opcoes",
    "opcoes": [
      { "id": "proibida", "rotulo": "Greve proibida", "propoe": "Parar o trabalho em protesto é crime ou dá demissão.",
        "bussola": { "economia": 0, "costumes": 2 }, "referencia": false,
        "efeitos": [
          { "alvo": "greves", "direcao": "desce", "forca": "forte", "atraso": "imediato", "confianca": "consenso",
            "porque": "Sem permissão legal, quase ninguém arrisca parar." },
          { "alvo": "liberdade_civil", "direcao": "desce", "forca": "media", "atraso": "imediato", "confianca": "consenso",
            "porque": "Uma forma de protesto coletivo deixa de ser permitida." },
          { "alvo": "renda_familias", "direcao": "desce", "forca": "fraca", "atraso": "anos", "confianca": "debatido",
            "porque": "Sem a ameaça de parar, os trabalhadores negociam reajustes menores.",
            "nota": "O peso da greve na negociação varia muito com o tamanho dos sindicatos." }
        ],
        "apoiam": ["grandes_empresarios"], "rejeitam": ["sindicatos", "trabalhadores_com_contrato"] },
      { "id": "com-aviso-e-servico-minimo", "rotulo": "Com aviso e serviço mínimo", "propoe": "Pode parar, avisando antes e mantendo parte dos serviços essenciais.",
        "bussola": { "economia": 0, "costumes": 0 }, "referencia": true,
        "efeitos": [], "apoiam": [], "rejeitam": [] },
      { "id": "livre", "rotulo": "Livre, sem aviso", "propoe": "Pode parar a qualquer momento, inclusive em serviços essenciais.",
        "bussola": { "economia": -1, "costumes": -2 }, "referencia": false,
        "efeitos": [
          { "alvo": "greves", "direcao": "sobe", "forca": "media", "atraso": "meses", "confianca": "consenso",
            "porque": "Sem regra de aviso, parar fica mais fácil e mais frequente." },
          { "alvo": "renda_familias", "direcao": "sobe", "forca": "fraca", "atraso": "anos", "confianca": "debatido",
            "porque": "A ameaça de parada fortalece os trabalhadores na hora do reajuste.",
            "nota": "Parte dos estudos acha o ganho de salário pequeno fora dos setores muito sindicalizados." },
          { "alvo": "crise_atendimento", "direcao": "sobe", "forca": "media", "atraso": "meses", "confianca": "consenso",
            "porque": "Hospitais, transporte e escolas podem parar por inteiro." }
        ],
        "apoiam": ["sindicatos"], "rejeitam": ["pequenos_empresarios", "grandes_empresarios"] }
    ]
  },
  "modelos": ["social_democrata", "conservador_autoritario"],
  "efeitos": [], "apoiam": [], "rejeitam": [],
  "requer": [], "exclui": [], "trava": []
}
```

## 5. Evidências (trecho de `evidencias/trabalho.md`)

```
## aumento-real-do-salario-minimo
Inspirado em: política de valorização do mínimo em vários países de renda média; aumentos regionais anuais na China; salário mínimo nacional do Reino Unido.
- custo_trabalhista sobe (consenso): efeito direto e mecânico do piso sobre a folha das empresas que pagam o mínimo. Base: definição contábil do custo do trabalho; OIT (Organização Internacional do Trabalho), Global Wage Report.
- renda_familias sobe (consenso): aumentos do mínimo elevam o salário de quem ganha o piso e um pouco acima (efeito de transbordamento). Base: Cengiz, Dube, Lindner e Zipperer (2019), "The Effect of Minimum Wages on Low-Wage Jobs", Quarterly Journal of Economics.
- desigualdade desce (consenso): parte grande da queda da desigualdade salarial em países que valorizaram o mínimo vem dele. Base: Autor, Manning e Smith (2016), American Economic Journal: Applied; Engbom e Moser (2022), American Economic Review.
- desemprego sobe (debatido): estudos clássicos acham efeito nulo em aumentos moderados; revisões mais críticas acham perda de emprego para jovens e pouco qualificados. Base: Card e Krueger (1994), American Economic Review; Neumark e Shirley (2022), "Myth or Measurement", Industrial Relations.
- informalidade sobe (debatido): em países com muito trabalho informal, o mínimo alto pode empurrar vagas para fora do contrato; em outros, puxa o salário informal junto (efeito farol). Base: Perry e outros (2007), "Informality: Exit and Exclusion", Banco Mundial; Maloney e Núñez Mendez (2004), sobre o efeito farol na América Latina.
- inflacao sobe (debatido): o repasse aos preços existe, mas é pequeno e concentrado em setores de muita mão de obra. Base: Lemos (2008), "A survey of the effects of the minimum wage on prices", Journal of Economic Surveys.

## direito-de-greve
Inspirado em: proibição de greve na antiga União Soviética e em regimes militares; regra de aviso e serviço mínimo em boa parte da União Europeia; greve livre em parte dos países nórdicos.
- proibida · greves desce (consenso): onde a greve é ilegal, o número de paradas registradas cai a quase zero. Base: dados de conflitos de trabalho da OIT por país e regime legal.
- proibida · liberdade_civil desce (consenso): o direito de greve é tratado como parte da liberdade de associação. Base: Comitê de Liberdade Sindical da OIT; Convenção 87 da OIT.
- proibida · renda_familias desce (debatido): o poder de barganha dos sindicatos explica parte do prêmio salarial; sem greve, o poder cai. Base: Blanchflower e Bryson (2004), sobre o prêmio salarial dos sindicatos.
- livre · greves sobe (consenso): regras de aviso e votação reduzem a frequência de greves; tirá-las tem o efeito inverso. Base: estudos sobre a lei sindical do Reino Unido de 2016 e reformas parecidas.
- livre · renda_familias sobe (debatido): mais poder de barganha, ganho salarial pequeno fora dos setores organizados. Base: Blanchflower e Bryson (2004).
- livre · crise_atendimento sobe (consenso): sem serviço mínimo, uma greve pode fechar um serviço essencial inteiro. Base: OIT, princípios sobre serviços essenciais e serviço mínimo.
```

Repare: cada linha de evidência fala **daquele** efeito, com um estudo ou
organismo que trata **daquilo**. Em lei de opções, a linha começa com o id da
opção (`proibida · …`).
