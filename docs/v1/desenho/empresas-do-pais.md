# Empresas do país e o Estado empresário (V1-35)

**Status:** EM REVISÃO (13/out). Estudo e proposta; nada muda no jogo antes
da sua aprovação. Vem do `estudo-das-leis.md`, seção 5. As perguntas estão na
seção 8.

## 0. Resumo

As empresas do país entram no jogo em **4 grupos por dono e porte**,
divididos em **setores**. Cada grupo e setor tem faturamento, lucro, dívida e,
onde faz sentido, capacidade física (toneladas de minério, gigawatts por
fonte). As leis do jogador mudam quanto elas faturam; o lucro vira imposto
(empresa privada) ou dividendo (estatal). Investir aumenta a capacidade
depois de um prazo, com custo e prazo tirados de dados reais. Os números
ficam na configuração do país e servem de base, não de precisão.

## 1. Quantas empresas o Brasil tem

| Dado                                        | Valor                                    | Fonte                |
| ------------------------------------------- | ---------------------------------------- | -------------------- |
| Empresas ativas (cadastro do governo, 2024) | 22 milhões, 11,7 milhões delas MEI       | Mapa de Empresas     |
| Empresas ativas (IBGE, 2022)                | 9,4 milhões, 70% sem nenhum empregado    | IBGE, Cempre         |
| Empresas com 250 pessoas ou mais            | 0,8% (cerca de 75 mil)                   | IBGE, Cempre         |
| Peso dessas grandes                         | 50% do emprego e 69% dos salários        | IBGE, Cempre         |
| Estatais federais de controle direto        | 44                                       | Ministério da Gestão |
| Lucro das estatais federais (2024)          | R$ 116 bilhões                           | Ministério da Gestão |
| Dividendos das estatais (2024)              | R$ 100 bilhões                           | Ministério da Gestão |
| Estatais que dependem do Tesouro (2024)     | 17, custando R$ 27 bilhões no ano        | Orçamento de 2024    |
| PIB (2024)                                  | R$ 11,7 trilhões                         | IBGE                 |
| Peso no valor adicionado (2024)             | Agro 6,5% · Indústria 25% · Serviços 69% | IBGE (conta nossa)   |
| Investimento (2024)                         | 17% do PIB                               | IBGE                 |

A diferença entre 22 e 9,4 milhões é de método: o cadastro conta todo CNPJ
ativo, inclusive MEI; o IBGE conta quem declarou atividade.

## 2. Os quatro grupos

| Grupo                          | Quem é                             | Paga ao Estado                                         | Liga com                                            |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Estatais**                   | As 44 federais e suas subsidiárias | Dividendo e imposto; as dependentes recebem do Tesouro | Leis das estatais, preços, governança               |
| **Grandes privadas nacionais** | A maior parte das 75 mil grandes   | Imposto sobre o lucro                                  | Juros, crédito, tarifas, câmbio                     |
| **Multinacionais**             | Filiais de empresas de fora        | Imposto sobre o lucro; mandam lucro para fora          | Investimento estrangeiro, os patrocinadores do jogo |
| **Pequenos negócios**          | MEI, microempresas e pequenas      | Pouco imposto, pelo regime simplificado                | Regime simplificado, renda das famílias             |

## 3. Os setores (subgrupos)

Cada grupo se divide nos setores em que atua. Proposta de 10 setores, com o
que mais mexe no faturamento de cada um (nós que o jogo já tem):

| Setor                    | Mexe no faturamento                                                  | Capacidade física     |
| ------------------------ | -------------------------------------------------------------------- | --------------------- |
| Agro                     | Preço dos alimentos, câmbio, código florestal, agrotóxicos, estiagem | Produção agropecuária |
| Petróleo e gás           | Preço lá fora (falta criar), regime do petróleo, câmbio              | Barris por dia        |
| Mineração                | Preço lá fora (falta criar), licenciamento, câmbio                   | Toneladas por ano     |
| Indústria                | Tarifas, câmbio, juros, custo de contratar, energia                  | —                     |
| Construção               | Investimento em infraestrutura, habitação, juros                     | —                     |
| Energia e saneamento     | Preço da energia, matriz, saneamento, estiagem                       | Gigawatts por fonte   |
| Comércio                 | Renda das famílias, consumo, juros, imposto sobre consumo            | —                     |
| Bancos                   | Juros, regulação bancária, crédito                                   | —                     |
| Transporte e logística   | Infraestrutura de transportes, preço do combustível                  | —                     |
| Tecnologia e comunicação | Regulação das redes, proteção de dados, inovação                     | —                     |

## 4. Como o dinheiro anda

```
faturamento do setor = base × efeito das leis e dos índices
lucro               = faturamento × margem − juros da dívida
empresa privada     → imposto sobre o lucro (lei do imposto das empresas) → cofre
estatal             → dividendo (parte do lucro) → cofre; dependente → custo no cofre
investimento        → custo agora → capacidade a mais depois do prazo
```

- **Privatizar** (estudo das leis, seção 3.2): o cofre recebe o valor da
  estatal; o setor passa do grupo das estatais para o das grandes privadas;
  some o dividendo e aparece o imposto.
- **Estatizar:** o caminho contrário, pagando (compra) ou não (expropriação,
  com reação dos países e dos investidores).
- **Dívida das empresas:** juros altos comem o lucro; estatal com prejuízo
  vira dependente e passa a custar ao Tesouro.

## 5. Exemplo: energia elétrica

### 5.1 Onde o Brasil está (2024)

| Fonte         | Geração | Capacidade instalada |
| ------------- | ------- | -------------------- |
| Hidrelétrica  | 56,1%   | 110 GW               |
| Eólica        | 14,3%   | 30 GW                |
| Solar         | 9,4%    | 48 GW                |
| Biomassa      | 7,7%    | (térmicas: 46 GW)    |
| Gás natural   | 6,4%    | (térmicas)           |
| Nuclear       | 2,1%    | 2 GW                 |
| Carvão e óleo | 2,2%    | (térmicas)           |

88% da eletricidade vem de fontes renováveis (Balanço Energético Nacional
2025).

### 5.2 Quanto custa e quanto demora (EPE, 2022)

| Fonte                 | Custo por kW (referência) | Obra                   |
| --------------------- | ------------------------- | ---------------------- |
| Solar                 | R$ 3,8 mil                | 1 ano                  |
| Eólica em terra       | R$ 5 mil                  | 2 anos                 |
| Eólica no mar         | R$ 15 mil                 | 3 anos                 |
| Gás (ciclo combinado) | R$ 4,8 a 6,4 mil          | 3 anos                 |
| Hidrelétrica grande   | R$ 9 a 15 mil             | anos (varia por usina) |
| Nuclear               | R$ 30 mil                 | 5 anos                 |
| Bateria               | R$ 6 a 6,7 mil            | 1 ano                  |

Exemplo de conta: 1 GW de solar custa cerca de R$ 3,8 bilhões e fica pronto
em um ano; 1 GW nuclear custa cerca de R$ 30 bilhões e leva cinco.

### 5.3 A mesa da energia

| Camada       | Opções                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| Constituição | Quem é dono da geração: monopólio estatal · concessão do Estado (Brasil, CF art. 21 XII b) · mercado livre           |
| Lei          | Como se contrata: leilão regulado (Brasil, Lei 10.848/2004) · mercado livre · estatal escolhe                        |
| Lei          | Nuclear: proibida · só estatal (Brasil, CF art. 21 XXIII) · aberta a privados                                        |
| Alavanca     | **Estatal:** quanto o Estado investe em cada fonte (GW por ano). **Privada:** quanto o leilão contrata de cada fonte |

O minijogo: solar é barata e rápida, mas só gera de dia; hidrelétrica é
cara e lenta e sofre com a estiagem (situação que o jogo já tem); gás é
rápido, mas emite e depende do preço lá fora; nuclear é cara, lenta e firme.
Investir com dinheiro do Estado pesa no cofre e na dívida e rende dividendo;
contratar por leilão não pesa no cofre, mas a conta vai para a tarifa.

## 6. Exemplo: minas de ferro

- A Vale, maior produtora, previa 328 milhões de toneladas em 2024.
- A expansão de S11D (Pará) somou 20 milhões de toneladas por ano à
  capacidade, com investimento de US$ 1,5 bilhão aprovado em 2020 e partida
  prevista para 2024: cerca de **US$ 75 por tonelada de capacidade, em uns
  quatro anos**.
- No jogo: "expandir minas" custa por tonelada de capacidade, leva alguns
  turnos e depois aumenta a produção mineral e as exportações. Se a mina é
  estatal, o lucro volta como dividendo; se é privada, como imposto e royalty
  (3,5% da receita no ferro).

## 7. Leis novas amarradas

| Mesa                   | Camada       | Lei nova                                                                                               |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| Energia elétrica       | Constituição | Dono da geração (seção 5.3)                                                                            |
| Energia elétrica       | Alavanca     | Investimento ou leilão por fonte                                                                       |
| Propriedade e estatais | Lei          | Governança das estatais: indicação técnica (Brasil, Lei 13.303/2016) ou política                       |
| Propriedade e estatais | Lei          | Política de dividendos: mínimo da lei · o governo pede mais · tudo reinvestido                         |
| Propriedade e estatais | Lei          | Preço das estatais: preço de mercado · preço controlado pelo governo                                   |
| Propriedade e estatais | Alavanca     | Aporte em estatal (capital do Tesouro)                                                                 |
| Concessões e parcerias | Lei          | Concessões e PPP (Lei 8.987/1995; Lei 11.079/2004): outorga no leilão, metas e tarifa                  |
| Projetos estratégicos  | Alavanca     | Por setor: minas, petróleo, energia, ferrovias, portos, saneamento; cada um com custo, prazo e retorno |

Elas se juntam ao que já existe: estatais e privatização, regime do petróleo,
banco de desenvolvimento, saneamento, matriz energética, energia nuclear,
investimento estrangeiro e imposto das empresas.

## 8. Os dois minijogos (pedido do autor, 13/out)

Regra: um número do país só existe no jogo se tiver minijogo por trás ou mexer
em algum índice.

### 8.1 Estatizar e privatizar: a gangorra

As **estatais** e as **grandes privadas nacionais** ficam nas mãos das leis.
Em cada setor, as duas somam 100% da parte nacional grande, e o jogador muda a
divisão: privatizar aumenta a fatia privada e reduz a estatal, estatizar faz o
contrário. **Multinacionais** e **pequenos negócios** ficam em outras leis
(investimento estrangeiro, Simples, MEI) e não entram na gangorra.

| O jogador faz | Cofre no turno                                                  | Depois, a cada turno                                                                              | Quem reage                                                |
| ------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Privatiza X%  | Entra o valor de venda da fatia (uma vez)                       | Sai o dividendo dessa fatia; a empresa rende mais e paga mais imposto                             | Mercado gosta; sindicatos e funcionários das estatais não |
| Estatiza X%   | Sai o valor de compra da fatia (uma vez, vira dívida se faltar) | Entra o dividendo; rende menos, mas o governo pode usar a estatal (segurar preço, crédito barato) | Sindicatos gostam; mercado e investidores não             |
| Expropria X%  | Não sai nada                                                    | Igual a estatizar, mais um tombo na confiança empresarial e no investimento estrangeiro           | Patrocinadores estrangeiros e mercado reagem forte        |

A escolha de verdade é: **dinheiro agora** (vender) ou **renda e controle depois**
(manter ou comprar). A estatal dá uma alavanca a mais (segurar o preço do
combustível, juro baixo no banco público), que custa lucro.

Valor de venda: lucro da fatia × múltiplo do setor (com fonte de bolsa). A
fatia estatal de partida em cada setor (petróleo, bancos, energia,
saneamento, correios…) vai ter fonte no arquivo do país.

### 8.2 Energia: a corrida da capacidade

Hoje o jogo já tem `preco_energia`, `oferta_energia` e `apagao`, e 15 coisas
mexem neles, mas **nenhum deles mexe em nada** (conferido nas consequências
em 13/out). Ou seja, hoje o preço da energia não serve para nada. Proposta
para ele valer:

- **A demanda cresce junto com o PIB.** Se a capacidade não acompanha, falta
  energia: o preço sobe e, se faltar muito, vem o apagão.
- **O preço da energia** pesa na inflação (conta de luz), no custo da
  indústria (que fatura menos e paga menos imposto) e no humor dos mais pobres.
- **O apagão** derruba o PIB e a aprovação no turno.
- **O jogador escolhe onde investir**, e cada fonte é uma troca:

| Fonte   | Obra    | Custo      | Troca                                                                          |
| ------- | ------- | ---------- | ------------------------------------------------------------------------------ |
| Solar   | 1 ano   | Baixo      | Rápida e barata, mas só de dia: sem bateria ou gás, não segura o pico da noite |
| Eólica  | 2 anos  | Baixo      | Barata, mas varia com o vento                                                  |
| Gás     | 3 anos  | Médio      | Firme, mas emite e depende do preço do gás lá fora                             |
| Hidro   | 5+ anos | Alto       | Energia barata por décadas, mas alaga floresta e sofre na seca                 |
| Nuclear | 5 anos  | Muito alto | Firme e limpa, mas cara, lenta e com risco                                     |

O minijogo é planejar com anos de antecedência: quem não investe hoje tem
apagão daqui a 3 anos. Se o autor preferir não ter isso, a energia sai do
estudo e os três índices viram só pano de fundo.

## 9. Perguntas para você

1. A gangorra fica entre estatais e grandes privadas nacionais, com vender,
   comprar ou expropriar? Recomendo.
2. A energia vira a corrida da capacidade (demanda puxada pelo PIB, apagão,
   escolha de fonte)? Recomendo.
3. Faço o V1-35 antes de reescrever as 129 leis? Recomendo.

## Fontes

- IBGE, Cempre 2022 (via Mercado&Consumo, 20/06/2024).
- Mapa de Empresas, 3º quadrimestre de 2024 (via Fenacon, 05/02/2025).
- Ministério da Gestão, estatais federais em 2024 (via Poder360, 03/06/2025).
- Orçamento de 2024, 17 estatais dependentes (via Poder360).
- IBGE, PIB 2024 (Agência de Notícias do IBGE).
- EPE, Caderno de Custos de Geração e Transmissão do PDE 2034.
- EPE, Síntese do Balanço Energético Nacional 2025.
- Vale, expansão de S11D (via Forbes, 14/08/2020) e previsão de 2024.
