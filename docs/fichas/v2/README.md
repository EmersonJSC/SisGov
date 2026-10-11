# Dicionário v2: leis e índices universais (D-66)

Etapa 1 do plano "nova árvore de leis e novo mapa" (aprovado por Emerson em
11/out/2026). Tudo aqui é **papel**: nada disto entra no jogo até a etapa 4.
O método antigo (`docs/fichas/METODO.md`) continua valendo no que este texto
não muda.

## 1. Princípio

Cada lei responde "como o Estado resolve este problema?", não "o que diz a
lei brasileira?". A mesma lei serve para Brasil, EUA, China ou Arábia
Saudita; muda só a opção ligada no início. Cada lei tem três camadas:

1. **Motor (universal):** nome neutro, opções neutras, efeitos nos índices.
2. **País:** `brasil` diz a opção ou o valor de partida do Brasil.
3. **História:** `historia.brasil` diz o que aquilo é no Brasil (lei, artigo,
   decisão do STF). Só texto; não muda o cálculo.

Nenhuma lei leva nome próprio de país ("Lei Maria da Penha", "Artigo 5º",
"CLT", "SUS", "Bolsa Família" ficam só na história). As opções cobrem o
espectro real do mundo, inclusive as autoritárias, sem dizer qual é a certa.

## 2. Os três níveis

| Nível   | Nome no jogo                             | Onde fica no mapa                  | Como muda                           | Pai obrigatório |
| ------- | ---------------------------------------- | ---------------------------------- | ----------------------------------- | --------------- |
| `macro` | Constitucional (marca `petrea` opcional) | Anel da Constituição, no centro    | PEC; pétrea só por ruptura          | nenhum          |
| `meso`  | Infraconstitucional (código, lei)        | Na área, em volta do ministro dono | Projeto de lei ou medida provisória | uma `macro`     |
| `micro` | Infralegal (decreto, orçamento)          | Na área, colada na sua `meso`      | Decreto do ministro                 | uma `meso`      |

- Macro: 2 a 5 opções, sem custo próprio (o dinheiro fica nas de baixo).
- Meso: 2 a 4 opções, cada uma concreta.
- Micro: **faixa** (slider de valor) ou **chave** (exatamente 2 opções:
  desligada e ligada). Nunca 3 opções abstratas.
- Toda meso aponta para uma macro em `pai`; toda micro aponta para uma meso.
  `pai.opcoes` lista as opções do pai que **liberam** a lei; com o pai fora
  delas, a lei fica trancada no catálogo.
- `brasil_petrea: true` marca as macro que são cláusula pétrea no Brasil
  (Art. 60, §4º): voto direto, secreto, universal e periódico; separação de
  poderes; forma federativa; direitos e garantias individuais.

## 3. As 9 áreas de influência

| id           | Área                        | Eixo                          | Ministérios (ids atuais)                                                                                                             |
| ------------ | --------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `poder`      | Poder e instituições        | 1. Estrutura de poder         | casa-civil, relacoes-institucionais, cgu, agu, gestao                                                                                |
| `seguranca`  | Segurança e justiça penal   | 2. Monopólio da violência     | justica                                                                                                                              |
| `defesa`     | Defesa e mundo              | 2. Monopólio da violência     | defesa, relacoes-exteriores, gsi                                                                                                     |
| `direitos`   | Direitos e liberdades       | 3. Controle social e direitos | direitos-humanos, mulheres, igualdade-racial, comunicacoes, comunicacao-social                                                       |
| `contas`     | Contas e tributos           | 4. Matriz econômica           | fazenda, planejamento                                                                                                                |
| `mercado`    | Trabalho e mercado          | 4. Matriz econômica           | trabalho, mdic, empreendedorismo, turismo                                                                                            |
| `protecao`   | Proteção social             | 4. Matriz econômica           | previdencia, desenvolvimento-social, saude, esporte                                                                                  |
| `educacao`   | Educação, ciência e cultura | 4. Matriz econômica           | educacao, ciencia, cultura                                                                                                           |
| `territorio` | Território e recursos       | 4. Matriz econômica           | cidades, transportes, portos, minas-energia, integracao, meio-ambiente, agricultura, desenvolvimento-agrario, pesca, povos-indigenas |

Macro tem `ministro: "presidencia"`.

## 4. Formato da ficha de lei v2

Arquivo `areas/<id da área>.json`: `{"area": "<id>", "leis": [ ... ]}`.
Campos novos ou mudados em relação ao método antigo estão marcados com ★.

```json
{
  "id": "politica-de-entorpecentes",
  "nome": "Política de entorpecentes",
  "nivel": "meso", // ★ macro | meso | micro
  "brasil_petrea": false, // ★ só em macro
  "area": "seguranca", // ★ id da área
  "ministro": "justica", // ★ id do ministério dono (macro: "presidencia")
  "pai": {
    // ★ obrigatório em meso e micro; null em macro
    "lei": "garantias-individuais",
    "opcoes": ["plenas", "restritas"],
    "motivo": "Frase curta: por que esta lei depende do pai."
  },
  "grupo": "regulatoria", // orcamentaria | regulatoria | tributaria | institucional
  "descricao": "O que ela decide, em uma frase.",
  "dilema": "A pergunta que o jogador se faz.",
  "eixo": "da guerra total à venda legal",
  "opcoes": [
    {
      "id": "guerra-total",
      "rotulo": "Guerra total",
      "no_jogo": "★ O que acontece no jogo, em uma frase: custo, quem ganha, quem perde.",
      "manchete": "Notícia curta quando é adotada",
      "exemplos": ["Filipinas (2016–2022)", "Singapura"]
    }
  ],
  "faixa": null, // micro de valor: {"unidade", "minimo", "maximo", "exemplos": [{"pais","valor"}]}
  "brasil": "usuario-descriminalizado", // opção ou número
  "historia": {
    // ★
    "brasil": "Lei 11.343/2006 e RE 635.659 do STF (2024): porte de até 40 g de maconha não é crime."
  },
  "custo": { "tipo": "gasto", "tamanho": "medio", "porque": "..." },
  "custo_pib": { "gasto": { "guerra-total": 0.3 } }, // ★ % do PIB por ano, por opção (opcional; micro de faixa: valor do Brasil)
  "efeitos": [
    {
      "alvo": "violencia_letal",
      "sinal": "+",
      "forca": "media",
      "atraso": "meses",
      "porque": "...",
      "condicao": "em guerra-total"
    }
  ],
  "grupos": {
    "ganham": ["grupo_conservadores"],
    "perdem": ["grupo_progressistas"]
  },
  "eficacia": {
    "aumenta": ["capacidade_estatal"],
    "reduz": ["corrupcao"],
    "porque": "..."
  },
  "substitui": ["lei-de-drogas", "politica-de-drogas"], // ★ ids das leis velhas que esta absorve
  "fontes": [{ "titulo": "...", "url": "https://..." }]
}
```

Regras:

- `faixa.unidade` em micro: `reais_ano` (R$ milhões por ano, como no jogo),
  `percentual` (alíquota, meta, reajuste) ou `horas`. Dê `minimo`, `maximo`
  e o valor do Brasil em `brasil`, com fonte.
- Chave (micro liga/desliga): `opcoes` com exatamente 2 itens, a primeira é
  "desligada".
- 3 a 6 efeitos por lei, alvos **só** dos ids de `indices.json` (índices,
  estoques e situações). Pelo menos um efeito ruim para alguém.
- `grupos`: só os 11 ids `grupo_*` da seção 6.
- `fontes`: 1 a 3, URLs reais que você abriu. Sem URL inventada.
- `substitui`: aproveite o trabalho das fichas antigas (`docs/fichas/areas/*.json`):
  quando a lei nova cobre uma velha, copie e adapte opções, exemplos,
  fontes e efeitos, e liste a velha aqui.

## 5. Índices v2 (73), com o que cada um absorve

Os índices velhos que não aparecem em nenhuma linha saem do jogo.

| Área       | id                               | Absorve (ids velhos)                                                                                              |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| poder      | popularidade_governo             |                                                                                                                   |
| poder      | capital_politico (novo)          | margem_manobra_governo                                                                                            |
| poder      | base_congresso                   |                                                                                                                   |
| poder      | estabilidade_politica            |                                                                                                                   |
| poder      | polarizacao                      |                                                                                                                   |
| poder      | confianca_instituicoes           | forca_instituicoes                                                                                                |
| poder      | corrupcao                        | captura_politica                                                                                                  |
| poder      | capacidade_estatal               |                                                                                                                   |
| poder      | participacao_eleitoral           |                                                                                                                   |
| seguranca  | violencia_letal                  |                                                                                                                   |
| seguranca  | crime_organizado                 |                                                                                                                   |
| seguranca  | sensacao_seguranca               | crimes_patrimoniais                                                                                               |
| seguranca  | letalidade_policial              |                                                                                                                   |
| seguranca  | lotacao_prisional                |                                                                                                                   |
| seguranca  | impunidade                       | reincidencia                                                                                                      |
| seguranca  | uso_drogas                       |                                                                                                                   |
| defesa     | tensao_internacional             |                                                                                                                   |
| defesa     | reputacao_internacional          |                                                                                                                   |
| defesa     | imigracao                        |                                                                                                                   |
| direitos   | liberdade_civil                  |                                                                                                                   |
| direitos   | desinformacao                    |                                                                                                                   |
| direitos   | discriminacao                    | diferenca_salarial_genero                                                                                         |
| direitos   | violencia_contra_mulheres (novo) | protecao_efetiva_mulheres                                                                                         |
| contas     | pib                              |                                                                                                                   |
| contas     | inflacao                         |                                                                                                                   |
| contas     | expectativas_inflacao            |                                                                                                                   |
| contas     | taxa_juros                       |                                                                                                                   |
| contas     | cambio                           |                                                                                                                   |
| contas     | risco_pais                       | fuga_capitais                                                                                                     |
| contas     | arrecadacao                      |                                                                                                                   |
| contas     | gasto_publico                    |                                                                                                                   |
| contas     | resultado_fiscal                 |                                                                                                                   |
| contas     | juros_da_divida                  |                                                                                                                   |
| contas     | sonegacao                        | complexidade_tributaria                                                                                           |
| mercado    | desemprego                       | rotatividade_emprego                                                                                              |
| mercado    | informalidade                    |                                                                                                                   |
| mercado    | renda_familias                   |                                                                                                                   |
| mercado    | consumo                          |                                                                                                                   |
| mercado    | investimento                     | ied                                                                                                               |
| mercado    | confianca_empresarial            |                                                                                                                   |
| mercado    | produtividade                    | qualificacao_trabalho                                                                                             |
| mercado    | concentracao_mercado             |                                                                                                                   |
| mercado    | custo_trabalhista                | litigio_trabalhista                                                                                               |
| mercado    | credito                          | endividamento_familias                                                                                            |
| mercado    | balanca_comercial (novo)         | exportacoes, importacoes, turismo                                                                                 |
| mercado    | inovacao                         | fuga_de_cerebros                                                                                                  |
| protecao   | pobreza                          |                                                                                                                   |
| protecao   | desigualdade                     |                                                                                                                   |
| protecao   | inseguranca_alimentar            |                                                                                                                   |
| protecao   | saude_populacao                  | sofrimento_mental, consumo_tabaco_alcool, vicio_em_apostas                                                        |
| protecao   | acesso_saude (novo)              | cobertura_aps, cobertura_vacinal, cobertura_planos_saude, gasto_bolso_saude, preco_medicamentos, falta_de_medicos |
| protecao   | pressao_hospitalar               |                                                                                                                   |
| protecao   | cobertura_previdenciaria         | participacao_trabalho_idosos                                                                                      |
| protecao   | deficit_previdenciario           |                                                                                                                   |
| protecao   | natalidade                       | participacao_trabalho_cuidadoras                                                                                  |
| educacao   | aprendizagem                     |                                                                                                                   |
| educacao   | evasao_escolar                   | trabalho_infantil                                                                                                 |
| educacao   | acesso_ensino_superior (novo)    | segregacao_escolar                                                                                                |
| educacao   | oportunidades_juvenis            |                                                                                                                   |
| educacao   | vitalidade_cultural              |                                                                                                                   |
| territorio | desmatamento                     |                                                                                                                   |
| territorio | emissoes                         |                                                                                                                   |
| territorio | qualidade_ambiental              |                                                                                                                   |
| territorio | conflitos_fundiarios             |                                                                                                                   |
| territorio | producao_agropecuaria            |                                                                                                                   |
| territorio | producao_mineral                 |                                                                                                                   |
| territorio | oferta_energia                   |                                                                                                                   |
| territorio | preco_energia                    |                                                                                                                   |
| territorio | preco_alimentos                  |                                                                                                                   |
| territorio | mobilidade_urbana                |                                                                                                                   |
| territorio | deficit_habitacional             | populacao_de_rua                                                                                                  |
| territorio | desigualdade_regional            |                                                                                                                   |
| sintese    | qualidade_de_vida                |                                                                                                                   |

Estoques (13): armas_em_circulacao, capacidade_defesa, concentracao_fundiaria,
desenvolvimento, divida_publica, envelhecimento, escolaridade,
infraestrutura_energia, infraestrutura_saneamento, infraestrutura_transportes,
poupanca_domestica, reservas_internacionais, transparencia_fiscal_internacional.
(`infraestrutura` genérico sai, dividido nos três.)

Situações (17, ficam): apagao, cofre, crise_atendimento, crise_financeira,
crise_migratoria, desabastecimento, desastre_ambiental, epidemia, golpe_risco,
greve_de_professores, greve_geral, juros_explosivos, mercado_paralelo,
onda_violencia, protestos, rebeliao_presidios, recessao.

Saem sem substituto: carga_evento_demanda (mecânica interna, fica no motor
fora do dicionário), turismo (vai para balanca_comercial).

## 6. Grupos sociais (11, ficam)

grupo_agro, grupo_aposentados, grupo_classe_media, grupo_conservadores,
grupo_empresarios, grupo_jovens, grupo_pequenos_negocios, grupo_pobres,
grupo_progressistas, grupo_servidores, grupo_trabalhadores.

## 7. A árvore (rascunho aprovado; nomes e ids podem ser ajustados)

Entre parênteses, a opção de partida do Brasil. (P) = `brasil_petrea`.

**poder**

- Macro: regime-eleitoral (P; voto direto e periódico, com reeleição única) · separacao-de-poderes (P; três poderes e federação) · sistema-de-governo (presidencialismo)
- Meso: sistema-eleitoral · financiamento-de-campanha · foro-privilegiado · estabilidade-do-servidor · punicao-a-corrupcao
- Micro: fundo-eleitoral (faixa) · emendas-parlamentares (faixa) · verba-de-controle (faixa) · concursos-publicos (faixa) · cotas-no-servico-publico (chave)

**seguranca**

- Macro: arquitetura-policial (polícias estaduais) · garantias-penais (P; sem pena de morte nem perpétua)
- Meso: politica-de-entorpecentes · estatuto-das-armas · doutrina-policial · penas-e-progressao · maioridade-penal
- Micro: cameras-corporais (chave) · inteligencia-financeira (faixa) · fundo-de-seguranca (faixa) · vagas-em-presidios (faixa) · operacoes-em-comunidades (chave) · verba-policia-federal (faixa)

**defesa**

- Macro: papel-das-forcas-armadas (sob controle civil)
- Meso: servico-militar · inteligencia-e-vigilancia · tarifas-de-importacao · imigracao-e-refugio
- Micro: orcamento-de-defesa (faixa) · compra-de-equipamentos (faixa) · controle-de-fronteira (faixa) · ajuda-humanitaria (faixa) · acordos-comerciais (chave)

**direitos**

- Macro: garantias-individuais (P; plenas) · estado-e-religiao (laico)
- Meso: regulacao-de-midia-e-redes · protecao-de-dados · protecao-a-grupos-vulneraveis · aborto · casamento-e-familia
- Micro: combate-a-violencia-domestica (faixa) · comunicacao-estatal (faixa) · cotas-raciais (chave) · moderacao-obrigatoria (chave) · verba-de-direitos-humanos (faixa)

**contas**

- Macro: reparticao-de-tributos (Uniao, estados e municipios) · pisos-constitucionais (saúde e educação vinculadas)
- Meso: regra-fiscal · autonomia-do-banco-central · imposto-de-renda · imposto-sobre-consumo · patrimonio-e-heranca
- Micro: aliquota-maxima-ir (faixa %) · aliquota-consumo (faixa %) · meta-de-inflacao (faixa %) · desoneracoes (faixa) · investimento-publico (faixa)

**mercado**

- Macro: regime-de-trabalho (mercado regulado) · propriedade-e-economia (privada com função social)
- Meso: codigo-do-trabalho · terceirizacao · poder-sindical · concorrencia · empresas-estatais
- Micro: salario-minimo (faixa) · seguro-desemprego (faixa) · motoristas-de-aplicativo (chave) · credito-subsidiado (faixa) · jornada-maxima (faixa horas)

**protecao**

- Macro: direito-a-saude (universal e público) · modelo-de-previdencia (pública por repartição)
- Meso: regras-de-aposentadoria · renda-minima · planos-de-saude · patentes-e-remedios · cuidados-de-longa-duracao
- Micro: valor-da-renda-minima (faixa) · orcamento-da-saude (faixa) · atencao-primaria (faixa) · vacinacao (faixa) · remedios-gratuitos (faixa) · reajuste-das-aposentadorias (faixa %)

**educacao**

- Macro: direito-a-educacao (pública, gratuita e obrigatória dos 4 aos 17)
- Meso: ensino-fundamental · ensino-medio · ensino-superior · curriculo-nacional · fomento-a-ciencia
- Micro: piso-dos-professores (faixa) · tempo-integral (faixa) · bolsas-de-pesquisa (faixa) · financiamento-estudantil (faixa) · cotas-na-universidade (chave) · incentivo-a-cultura (faixa)

**territorio**

- Macro: recursos-naturais-e-terra (do Estado, com concessão) · protecao-ambiental (dever do Estado)
- Meso: codigo-florestal · licenciamento-ambiental · matriz-energetica · terras-indigenas · saneamento · mobilidade-urbana
- Micro: investimento-em-infraestrutura (faixa) · fiscalizacao-ambiental (faixa) · credito-rural (faixa) · moradia-popular (faixa) · subsidio-a-combustiveis (faixa) · tarifa-social-de-energia (chave)

Uma micro aponta para a meso mais próxima da mesma área (ex.: salario-minimo →
codigo-do-trabalho; cameras-corporais → doutrina-policial). Uma meso pode ter
pai macro de outra área quando faz sentido (ex.: aborto → garantias-individuais;
pisos-constitucionais libera orcamento-da-saude e piso-dos-professores).

## 8. Índice v2 (`indices.json`)

`{"indices": [...], "estoques": [...], "situacoes": [...], "grupos": [...]}`.

```json
{
  "id": "violencia_letal",
  "nome": "Violência letal",
  "area": "seguranca",
  "definicao": "Mortes violentas intencionais por 100 mil habitantes por ano.",
  "unidade": "taxa_por_100_mil",
  "faixa_mundo": { "minimo": 0, "maximo": 60 },
  "avaliacao": "maior_pior",
  "brasil": {
    "valor": 21.1,
    "ano": 2024,
    "fonte": "Anuário Brasileiro de Segurança Pública 2025",
    "url": "https://..."
  },
  "absorve": [],
  "quem_sente": [{ "grupo": "grupo_pobres", "peso": "forte" }]
}
```

- Situação: em vez de `brasil.valor`, `gatilho` ("violencia_letal acima de 35 por 2 turnos") e `efeito` (o que a crise faz).
- Estoque: diz o que o aumenta e o que o gasta, e o valor do Brasil.
- Grupo: `peso_eleitoral` (% do eleitorado, com fonte), `valoriza`
  (lista de `{indice, sinal, peso}` com 4 a 8 itens) e `base_partidaria`
  (frase: que partidos tendem a representá-lo).

## 9. Pendências da primeira versão (11/out)

Conferido por `scripts/fichas/v2.py`: 112 leis (17 macro, 46 meso, 49
micro), 73 índices, 13 estoques, 17 situações, 11 grupos, sem erro.

Mudança na árvore: entrou a meso `rede-publica-de-saude` (proteção), porque
as micros de verba da saúde não tinham meso própria.

Leis velhas que ficaram fora (16), para decidir se voltam:
agrotoxicos, apostas-e-jogos-de-azar, controle-de-capitais, delacao-premiada,
energia-nuclear, eutanasia, fundo-soberano (é a mecânica do cofre),
imposto-seletivo, investimento-estrangeiro, politica-de-natalidade,
reducao-de-jornada-subsidiada, regime-cambial, regulacao-bancaria,
restricao-tabaco-e-alcool, saude-mental, voto-obrigatorio.

A conferir antes da etapa 4:

- **Custo de base dos sistemas.** Macro não tem custo, mas a previdência por
  repartição e a rede de saúde são a maior parte do gasto. Hoje
  `regras-de-aposentadoria` carrega só 1,3% do PIB no Brasil (o real passa
  de 8%). A calibração da etapa 4 precisa pôr a conta inteira nas meso e
  micro.
- **Dupla contagem possível.** `investimento-publico` (contas) e
  `investimento-em-infraestrutura` (território); `matriz-energetica` com
  subsídio fóssil e `subsidio-a-combustiveis`.
- **Unidades novas de índices.** pib vira crescimento real em %, risco_pais
  em pontos-base, letalidade_policial em % das mortes violentas,
  lotacao_prisional em presos por 100 vagas, natalidade em filhos por
  mulher. O motor e as ligações precisam acompanhar.
- **20 valores marcados `verificar`** em `indices.json` (15 índices de 0 a
  100 sem fonte aberta, 5 pesos eleitorais estimados).
- **Gatilhos de situação** são propostas; dois dependem de condições que o
  motor ainda não calcula.
