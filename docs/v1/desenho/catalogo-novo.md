# Catálogo novo: proposta para revisão (V1-36)

**Status:** PROPOSTA (15/out/2026). Nada disto está no jogo. Gerado por `scripts/camadas/gerar_catalogo_novo.py` a partir das leis atuais, com as mudanças marcadas.

## 1. Regras

- **Leis do mundo.** Nenhuma lei, nome ou texto é do Brasil. O país só declara o estado inicial (D-03, D-04, D-38). Cada lei diz o que faz para qualquer país.
- **Cada lei de uma área vive na esfera da área.** A economia de saúde fica em Saúde, a de previdência em Previdência; **Economia só com o geral**: moeda, juros, câmbio, dívida e as regras fiscais e tributárias gerais.
- **Equilíbrio.** Nenhuma esfera com mais que o dobro da média nem com menos que a metade (média de hoje: 22). Hoje Segurança tem 48 e Ambiente 6.
- **Controle.** Toda lei com valores ordenados é um **deslizador com degraus** (o jogador sente aumentar e diminuir). Botões só para 2 opções ou escolhas sem ordem.
- **Processos, não botões nem ideologias.** Estatizar, privatizar, reformar: o jogo acompanha o processo (estoque que se move por etapas, com custo e reações). Ninguém escolhe "ser socialista" ou "liberal": isso é só um termômetro calculado (seção 2).
- **Marcas:** JUNTA (duas viram uma), SEPARA (uma vira várias), MOVE (muda de esfera), NOVO, SAI.

## 2. Estatização e privatização: um processo, não uma lei nem uma ideologia

**Correção (autor, 15/out).** Socialismo e liberalismo não são botões nem leis que o jogador escolhe: são **resultados** de um processo que o jogo acompanha. Ninguém "escolhe ser socialista". O jogador age sobre setores, e o país vai ficando mais estatal ou mais privado. Portanto saem do jogo as escolhas com nome de ideologia (hoje `propriedade-dos-meios-de-producao`: privada, mista, socialista; `planejamento-da-economia`) e a lei única de privatizar ou estatizar.

**Como fica o processo (por setor).**

1. **Participação do Estado em cada setor é um estoque (0% a 100%)**, que mora na esfera do setor (energia elétrica, petróleo e gás, saneamento, bancos públicos, correios, telecomunicações, transporte). Não é uma opção: é um número que muda aos poucos.
2. **O jogador abre um processo, escolhe a meta e o ritmo.** Privatizar: avaliação dos ativos → edital → venda em lotes, um por vez (4 a 8 turnos) → transferência. Estatizar: decreto → indenização (ou disputa na Justiça) → assunção da gestão (4 turnos). A participação do Estado se move lote a lote, não de uma vez.
3. **O processo tem custos e reações no caminho**: greve dos trabalhadores do setor, queda de braço no tribunal, fuga de capital, ágio dos compradores, tarifa que sobe ou cai, investimento que entra ou sai, corrupção e captura política. Cada etapa pode dar um dilema (aceitar o preço do lote? ceder à greve?).
4. **O que o jogo mostra é o andamento**: "Energia elétrica: Estado com 70%, em privatização (lote 2 de 5)". Ele não mostra "o país é liberal".
5. **A ideologia do país é só um termômetro** calculado (um índice): média da participação do Estado nos setores, mais controle de preços e planejamento, e mostrada como uma faixa (de "Estado mínimo" a "Estado dono"). Serve para o jogador ver o rumo, e não é um comando. A bússola política já faz isso para os costumes e a economia.

**O que a lei diz.** Não existe "lei da estatização". Existem regras concretas e neutras que limitam o processo, em camadas:

- Constituição, *Propriedade e indenização*: o que o Estado pode possuir e como indeniza (indenização prévia e justa; indenização só em títulos; sem indenização em setores estratégicos). Essa regra muda o custo e a facilidade do processo.
- Lei, *Concessões e parcerias*: por quanto tempo e em que condições o privado opera um serviço público.
- Alavancas: o **ritmo** e o **teto de preço (tarifa)** de cada setor, além da meta.

| Setor | Esfera | Por que ali |
| --- | --- | --- |
| Energia elétrica | Infraestrutura | geração, transmissão e distribuição |
| Petróleo e gás | Infraestrutura | energia fóssil e royalties |
| Saneamento | Infraestrutura | água e esgoto |
| Bancos públicos | Economia | crédito e fomento |
| Correios e logística postal | Educação e cultura (Comunicações) | serviço universal |
| Telecomunicações | Educação e cultura (Comunicações) | redes e espectro |
| Transporte (ferrovias, portos, aeroportos) | Infraestrutura | carga e passageiros |

**Mudanças no catálogo.** `propriedade-dos-meios-de-producao` e `planejamento-da-economia` saem (o termômetro substitui); `programa-de-privatizacao` e `nacionalizacao` viram o processo de cada setor; `papel-do-estado-empresario` vira *Propriedade e indenização* (Constituição). É preciso um tipo novo no motor: o **processo em etapas** (estoque que se move por lotes, com custo por turno e dilemas), que também serve para reforma agrária, reforma da previdência e outros.

## 3. Distribuição por área

| Esfera | Hoje | Proposta | Observação |
| --- | ---: | ---: | --- |
| Economia | 27 | 30 | ganha juros, meta de inflação, câmbio, tarifas e banco de desenvolvimento |
| Empresas e comércio | 21 | 16 | perde as 5 leis de macro; ganha as de propriedade por setor só na esfera do setor |
| Trabalho e emprego | 18 | 18 |  |
| Previdência e assistência | 20 | 20 |  |
| Saúde e esporte | 19 | 20 |  |
| Educação e cultura | 24 | 24 |  |
| Infraestrutura | 16 | 13 |  |
| Meio ambiente | 6 | 9 | ganha 3 leis do campo; ainda a menor: precisa de leis novas (água, resíduos, clima) |
| Segurança e justiça | 48 | 27 |  |
| Direitos e cidadania | 21 | 22 |  |
| Governo e instituições | 27 | 27 |  |
| Defesa e relações exteriores (nova) | 0 | 21 | esfera nova: tira 21 leis de Segurança |

## 4. Mudanças em relação ao jogo atual

### Junta (duplicatas: uma lei antiga e uma da ficha tratam do mesmo)

- `delacao-premiada` + `delacao-premiada-e-acordos`: a ficha nova substitui a antiga.
- `idade-minima-aposentadoria` + `idade-minima-para-se-aposentar`: a mesma regra; a ficha vira a Constituição e a antiga vira a alavanca.
- `reajuste-de-beneficios` + `regra-de-reajuste-dos-beneficios`: a mesma regra.
- `transferencia-de-renda` + `transferencia-de-renda-as-familias-pobres`: lei (regra) + alavanca (verba).
- `piso-educacao` + `piso-de-gasto-em-educacao`: lei (regra) + alavanca (valor).
- `piso-saude` + `verba-da-saude-acima-do-piso`: lei (regra) + alavanca (valor).
- `programa-habitacao-popular` + `verba-do-programa-habitacional`: a verba é a alavanca do programa.
- `habitacao-publica` + `como-o-estado-entrega-casa`: mesma mesa.
- `imposto-propriedade-urbana-rural` + `imposto-sobre-a-propriedade`: mesma regra.
- `tributacao-dividendos` + `tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter`: mesma regra.

### Separa
- `programa-de-privatizacao` e `nacionalizacao` → o processo de cada um dos 7 setores (seção 2); `papel-do-estado-empresario` vira *Propriedade e indenização*.
- `banco-de-desenvolvimento` → o banco público vira um dos 7 setores.

### Move

- `acordos-comerciais`: → nova esfera Defesa
- `alianca-militar`: → nova esfera Defesa
- `alinhamento-externo`: → nova esfera Defesa
- `apostas-e-jogos-de-azar`: → Direitos (mesa das apostas)
- `banco-de-desenvolvimento`: → Economia (política macro)
- `controle-civil-das-forcas-armadas`: → nova esfera Defesa
- `cooperacao-internacional`: → nova esfera Defesa
- `credito-rural-e-assistencia-tecnica`: → Meio ambiente
- `exportacao-de-armas`: → nova esfera Defesa
- `fiscalizacao-ambiental`: → Meio ambiente
- `gasto-com-defesa`: → nova esfera Defesa
- `imposto-seletivo`: → Saúde (imposto de saúde pública)
- `industria-de-defesa`: → nova esfera Defesa
- `integracao-regional`: → nova esfera Defesa
- `intervencao-cambial`: → Economia (política macro)
- `investimento-em-defesa`: → nova esfera Defesa
- `missoes-de-paz`: → nova esfera Defesa
- `papel-das-forcas-armadas`: → nova esfera Defesa
- `politica-de-imigracao`: → nova esfera Defesa
- `politica-de-sancoes`: → nova esfera Defesa
- `programa-nuclear-lei`: → nova esfera Defesa
- `protecao-da-vegetacao-nativa-nas-propriedades-rurais`: → Meio ambiente
- `protecao-de-fronteiras`: → nova esfera Defesa
- `protecao-social-dos-militares`: → nova esfera Defesa
- `rede-diplomatica`: → nova esfera Defesa
- `saida-do-pais`: → nova esfera Defesa
- `servico-militar`: → nova esfera Defesa
- `tarifas-de-importacao`: → Economia (política macro)
- `taxa-basica-de-juros`: → Economia (política macro)
- `tribunais-e-tratados-internacionais`: → nova esfera Defesa
- `valor-da-meta-de-inflacao`: → Economia (política macro)

### Novo (leis do mundo que faltam; a pesquisar, com fonte)

- **Renda básica universal** (Previdência): de piloto (Finlândia, Quênia) a programa nacional; degraus por valor.
- **Controle de aluguéis** (Previdência/moradia): livre, teto de reajuste, congelamento (Berlim, Espanha).
- **Poupança compulsória individual** (Previdência): fundo de aposentadoria de conta própria (Singapura).
- **Controle da internet e censura** (Governo): livre, moderação regulada, filtro de Estado (China, UE).
- **Cotas de gênero no parlamento** (Governo): sem cota, lista com cota, cadeiras reservadas (Ruanda, França).
- **Tarifa zero no transporte público** (Infraestrutura): pago, subsidiado, gratuito (Luxemburgo).
- **Água: preço e acesso** (Meio ambiente/Infraestrutura) e **Resíduos** (Meio ambiente): para equilibrar Ambiente.

### Sai
- `nacionalizacao`, `programa-de-privatizacao`, `propriedade-dos-meios-de-producao`, `planejamento-da-economia` (seção 2).

## 5. Lista por área (como ficaria)

Colunas: lei · camada · controle · o que faz (uma linha, vale para qualquer país) · mudança.

### Economia (30)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Banco de desenvolvimento | Lei | deslizador, 4 degraus | O país tem um banco público que empresta às empresas, e a que preço? | MOVE → Economia (política macro) |
| Conselho fiscal independente | Lei | deslizador, 3 degraus | Existe um órgão técnico independente que projeta a dívida e confere as contas do governo, e com que poder? |  |
| Controle de capitais | Lei | deslizador, 4 degraus | O dinheiro pode entrar e sair do país livremente? |  |
| Destino do resultado fiscal | Lei | deslizador, 3 degraus | Decide quanto do superávit vai para pagar a dívida e quanto fica guardado no cofre do Tesouro.  |  |
| Devolução de imposto aos pobres | Lei | deslizador, 3 degraus | O governo devolve aos mais pobres parte do imposto que eles pagam no consumo? |  |
| Imposto de renda da pessoa física | Lei | valor (faixa) | Define a alíquota máxima cobrada sobre a renda das pessoas (salários, aluguéis, ganhos), com faixas progressivas abaixo dela. |  |
| Imposto de renda das empresas | Lei | valor (faixa) | Define a alíquota nominal cobrada sobre o lucro das empresas. |  |
| Imposto sobre a propriedade | Lei | deslizador, 4 degraus | Quanto pagam imóveis, terras e veículos, e com que valor de referência? | JUNTA com `imposto-propriedade-urbana-rural`: mesma regra |
| Imposto sobre consumo (IVA) | Lei | valor (faixa) | Define a alíquota padrão do imposto cobrado sobre bens e serviços em cada etapa da venda, com crédito do que foi pago antes. |  |
| Imposto sobre grandes fortunas | Lei | valor (faixa) | Define a alíquota anual máxima cobrada sobre o patrimônio líquido dos mais ricos, acima de um limite de isenção. |  |
| Imposto sobre herança e doações | Lei | valor (faixa) | Define a alíquota máxima cobrada sobre heranças e doações, acima de uma faixa isenta. |  |
| Imposto sobre imóveis urbanos e rurais | Lei | valor (faixa) | Define quanto se arrecada todo ano com imóveis urbanos e terras rurais, com valores venais atualizados ou não. | JUNTA em `imposto-sobre-a-propriedade` |
| Imposto sobre transações financeiras | Alavanca | valor (faixa) | Define a alíquota cobrada sobre cada movimentação financeira, de débitos em conta corrente a compras de ações e operações de câmbio. |  |
| Intervenção cambial | Alavanca | deslizador, 3 degraus | Quantos dólares das reservas o banco central compra ou vende neste turno? | MOVE → Economia (política macro) |
| Mandato do banco central | Lei | deslizador, 4 degraus | O banco central persegue só a inflação, também o emprego, ou nenhuma meta? |  |
| Meta de resultado primário | Alavanca | deslizador, 4 degraus | Quanto o governo promete economizar (ou gastar a mais) antes dos juros neste ano? |  |
| Modelo tributário | Constituição | deslizador, 5 degraus | Sobre quais bases o país cobra imposto (consumo, renda, capital) e quanto pesa a carga total? |  |
| Quem controla o banco central | Constituição | deslizador, 3 degraus | O governo manda nos juros ou o banco central decide sozinho, com mandato fixo? |  |
| Regime cambial | Lei | deslizador, 4 degraus | O preço do dólar é fixado pelo governo, segue uma faixa ou flutua no mercado? |  |
| Regime simplificado para pequenas empresas | Lei | deslizador, 4 degraus | Pequenas empresas pagam imposto por um regime mais simples e mais barato? |  |
| Regra fiscal | Constituição | deslizador, 4 degraus | Define se o governo tem uma regra numérica que limita déficit ou gasto, e de que tipo. |  |
| Regulação dos bancos | Lei | deslizador, 4 degraus | Quanto capital e quantas regras os bancos precisam cumprir para emprestar? |  |
| Revisão de gastos tributários | Alavanca | deslizador, 3 degraus | O governo revê ou corta as isenções e benefícios fiscais que já existem? |  |
| Tarifas de importação | Alavanca | deslizador, 3 degraus | Qual a tarifa média sobre o que o país importa? | MOVE → Economia (política macro) |
| Taxa básica de juros | Alavanca | deslizador, 3 degraus | Quanto o governo fixa para os juros básicos da economia, quando é ele quem decide? | MOVE → Economia (política macro) |
| Tributação de dividendos | Lei | valor (faixa) | Define a alíquota máxima cobrada do acionista quando a empresa distribui lucro. | JUNTA em `tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter` |
| Tributação do lucro distribuído e da renda guardada no exterior | Lei | deslizador, 4 degraus | O lucro que a empresa paga ao sócio, e a renda que fica parada em empresas no exterior ou em fundos de um só dono, pagam imposto na pesso… | JUNTA com `tributacao-dividendos`: mesma regra |
| Uso do cofre (fundo soberano) | Lei | deslizador, 4 degraus | Decide o que fazer com o dinheiro que sobra quando a dívida acaba: guardar no Tesouro, aplicar fora do país, emprestar às empresas ou inv… |  |
| Valor da meta de inflação | Alavanca | deslizador, 4 degraus | Qual inflação por ano o banco central deve perseguir? | MOVE → Economia (política macro) |
| Vinculações orçamentárias | Constituição | 2 botões | A Constituição pode carimbar parte da receita para um gasto fixo? |  |

### Empresas e comércio (16)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Conteúdo local | Lei | deslizador, 3 degraus | O governo exige que compras públicas, petróleo e carros usem uma parte de peças feitas no país? |  |
| Controle de preços | Lei | deslizador, 4 degraus | O governo fixa preços de produtos, e de quais? |  |
| Cooperativas e autogestão | Lei | deslizador, 3 degraus | O governo incentiva empresas de propriedade dos trabalhadores e cooperativas? |  |
| Defesa comercial | Lei | deslizador, 3 degraus | O governo põe sobretaxas contra importações vendidas abaixo do custo ou que crescem de repente? |  |
| Defesa da concorrência | Lei | deslizador, 4 degraus | O governo impede fusões e cartéis ou ajuda a criar grandes empresas nacionais? |  |
| Indexação de contratos | Lei | deslizador, 3 degraus | Contratos, aluguéis, tarifas e salários podem ser corrigidos automaticamente pela inflação passada? |  |
| Investimento estrangeiro | Lei | deslizador, 5 degraus | Empresas de fora podem investir em quais setores e com quais regras? |  |
| Licença para abrir negócio | Lei | deslizador, 3 degraus | Quem quer abrir uma empresa precisa pedir licença antes? |  |
| Nacionalização | Lei | deslizador, 3 degraus | Quando o Estado toma uma empresa privada, como ele paga? | SAI: vira o processo de cada setor (seção 2) |
| Papel do Estado empresário | Constituição | deslizador, 4 degraus | O Estado pode ter empresas e em quais setores? |  |
| Planejamento da economia | Constituição | deslizador, 3 degraus | O governo planeja a economia toda, só orienta o setor privado ou deixa o mercado decidir? | SAI: ideologia: sai; o termômetro do rumo substitui (seção 2) |
| Política de preços das estatais | Lei | deslizador, 3 degraus | A petroleira e outras estatais cobram o preço internacional ou o governo segura o preço? |  |
| Política industrial | Lei | deslizador, 4 degraus | O governo escolhe setores da indústria para ajudar, e como? |  |
| Programa de privatização | Lei | deslizador, 3 degraus | O governo vende empresas estatais, e quantas? | SAI: vira o processo de cada setor (seção 2) |
| Propriedade dos meios de produção | Constituição | deslizador, 3 degraus | Empresas, terras e fábricas são privadas, mistas ou do Estado? | SAI: ideologia: sai; o termômetro do rumo substitui (seção 2) |
| Volume de incentivo à indústria | Alavanca | deslizador, 3 degraus | Quanto dinheiro público vai para a política industrial por ano? |  |

### Trabalho e emprego (18)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Contribuição sindical | Lei | deslizador, 3 degraus | Como os sindicatos se financiam: só quem quer paga, ou todos os cobertos pelo acordo? |  |
| Custo de processar na Justiça do Trabalho | Lei | deslizador, 3 degraus | Quem paga honorários e perícia quando o trabalhador perde a ação? |  |
| Direito de greve | Lei | deslizador, 3 degraus | Os trabalhadores podem parar, e com que regras? |  |
| Fiscalização do trabalho | Alavanca | deslizador, 4 degraus | Quantos auditores e quanta verba o governo põe para fiscalizar o cumprimento das leis do trabalho? |  |
| Fundo de garantia | Lei | deslizador, 4 degraus | O que o trabalhador recebe quando é demitido? |  |
| Fórmula do salário mínimo | Lei | deslizador, 4 degraus | A regra que corrige o salário mínimo todo ano: sem regra fixa, só a inflação, a inflação mais o crescimento da economia ou uma meta em re… |  |
| Intermediação e qualificação | Alavanca | deslizador, 4 degraus | Quanto o governo gasta com agências de emprego e cursos para quem procura trabalho? |  |
| Jornada de trabalho | Lei | deslizador, 5 degraus | Qual é o limite de horas de trabalho por semana? |  |
| Legislação trabalhista | Constituição | deslizador, 5 degraus | Que direitos mínimos todo contrato de trabalho garante, e o acordo entre as partes pode valer mais que a lei? |  |
| Licença parental | Lei | deslizador, 4 degraus | Define quanto tempo de licença paga mães e pais têm com a chegada de um filho, e se o pai tem parte reservada. |  |
| Negociação coletiva e sindicatos | Constituição | deslizador, 4 degraus | Em que nível os salários e as condições são negociados, e os sindicatos são livres do Estado? |  |
| Quem decide o salário mínimo | Constituição | deslizador, 4 degraus | Se o país tem salário mínimo e quem fixa o valor: ninguém, os sindicatos com os patrões, uma comissão técnica ou a lei nacional. |  |
| Redução de jornada subsidiada | Lei | deslizador, 3 degraus | Na crise, o governo paga parte do salário para a empresa reduzir horas em vez de demitir? |  |
| Seguro-desemprego | Constituição | deslizador, 5 degraus | Quem perde o emprego tem direito a renda, e por quanto tempo? |  |
| Terceirização | Lei | deslizador, 4 degraus | A empresa pode contratar outra empresa para fazer sua atividade principal? |  |
| Trabalho infantil e aprendizagem | Lei | deslizador, 5 degraus | A partir de que idade se pode trabalhar, e como funciona o contrato de aprendiz? |  |
| Trabalho por aplicativo | Lei | deslizador, 4 degraus | Que contrato tem quem trabalha por plataforma digital? |  |
| Valor do salário mínimo | Alavanca | deslizador, 4 degraus | O valor do salário mínimo deste ano, medido em relação ao salário típico do país.  |  |

### Previdência e assistência (20)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Aposentadoria do trabalhador rural | Lei | deslizador, 4 degraus | O agricultor familiar se aposenta como o urbano ou com regra própria? |  |
| Como a aposentadoria é financiada | Constituição | deslizador, 4 degraus | O trabalhador de hoje paga o aposentado de hoje, cada um poupa para si, ou uma mistura? |  |
| Como o Estado entrega casa | Lei | deslizador, 5 degraus | O Estado ajuda a pagar o aluguel, financia a compra, vende o imóvel público, aluga casa própria dele ou dá casa primeiro a quem está na rua? | JUNTA com `habitacao-publica`: mesma mesa |
| Direito à moradia na Constituição | Constituição | deslizador, 3 degraus | Ter onde morar é um direito, e ele pode ser cobrado na Justiça? |  |
| Garantia de comida | Lei | deslizador, 4 degraus | Além do dinheiro, como o Estado garante que as pessoas comam? |  |
| Idade mínima de aposentadoria | Lei | deslizador, 5 degraus | Define a partir de que idade se pode receber a aposentadoria: sem idade (só tempo de contribuição), idade baixa, moderada, alta ou atrela… | JUNTA em `idade-minima-para-se-aposentar` |
| Idade mínima para se aposentar | Constituição | deslizador, 5 degraus | A partir de que idade a pessoa pode se aposentar? | JUNTA com `idade-minima-aposentadoria`: a mesma regra; a ficha vira a Constituição e a antiga vira a alavanca |
| Licença para cuidar do bebê | Lei | deslizador, 5 degraus | Quanto tempo pai e mãe ficam em casa com o bebê, quem paga e como a licença se divide? |  |
| Organização dos programas sociais | Lei | 2 botões | Cada ministério cuida do seu programa, ou o governo junta todos em missões com meta comum (por exemplo, "zerar a fome")? |  |
| Pensão por morte | Lei | deslizador, 4 degraus | Define o que a família recebe quando morre quem contribuía: nada, uma ajuda temporária, uma parte do benefício por dependente ou o benefí… |  |
| Previdência rural | Lei | deslizador, 4 degraus | Define como o pequeno agricultor, que quase nunca tem salário fixo nem carteira, entra na previdência: fora dela, por adesão voluntária, … |  |
| Quem cuida do idoso dependente | Lei | deslizador, 4 degraus | O idoso que não consegue se cuidar fica com a família, com a assistência para pobres, com um seguro obrigatório ou com um serviço público? |  |
| Reajuste de aposentadorias e benefícios | Alavanca | deslizador, 5 degraus | Define como aposentadorias e benefícios são corrigidos todo ano: à vontade do governo, pela inflação, pelos salários, pelo salário mínimo… | JUNTA em `regra-de-reajuste-dos-beneficios` |
| Regra de reajuste dos benefícios | Alavanca | deslizador, 5 degraus | Como aposentadorias e pensões são corrigidas a cada ano? | JUNTA com `reajuste-de-beneficios`: a mesma regra |
| Renda para idosos e pessoas com deficiência pobres | Constituição | deslizador, 4 degraus | O Estado paga renda a idoso ou pessoa com deficiência pobre que nunca contribuiu?  |  |
| Sistema previdenciário | Constituição | deslizador, 4 degraus | Define quem carrega o risco da velhice: cada um sozinho, cada um com sua conta individual, um sistema misto ou um pacto coletivo em que q… |  |
| Transferência de renda às famílias pobres | Alavanca | deslizador, 4 degraus | Quanto o Estado transfere em dinheiro às famílias pobres, e com que regra? | JUNTA com `transferencia-de-renda`: lei (regra) + alavanca (verba) |
| Transferência de renda às famílias pobres | Alavanca | valor (faixa) | Define quanto do PIB vai para pagamentos mensais em dinheiro às famílias pobres, com ou sem exigências como frequência escolar e vacinação. | JUNTA em `transferencia-de-renda-as-familias-pobres` |
| Vagas de creche | Alavanca | deslizador, 4 degraus | Quantas crianças de 0 a 3 anos têm vaga em creche paga pelo Estado? |  |
| Verba do programa habitacional | Alavanca | deslizador, 3 degraus | Quanto o governo gasta por ano para construir ou subsidiar moradia popular? | JUNTA com `programa-habitacao-popular`: a verba é a alavanca do programa |

### Saúde e esporte (20)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Campanha de vacinação | Alavanca | deslizador, 3 degraus | Fazer campanha e busca ativa para vacinar quem está atrasado? |  |
| Divisão da verba: atenção básica x hospitais | Alavanca | deslizador, 4 degraus | Que parte da verba da saúde vai para a atenção básica e que parte vai para os hospitais? |  |
| Farmácia popular | Alavanca | valor (faixa) | Fixa quanto o Estado gasta para dar de graça ou com desconto, na farmácia, os remédios de uso contínuo (pressão, diabetes, asma). |  |
| Forma de gestão hospitalar | Lei | deslizador, 4 degraus | Quem administra o hospital público? |  |
| Genéricos e patentes de medicamentos | Lei | deslizador, 5 degraus | Quanto tempo a patente protege um remédio e quando a cópia mais barata pode entrar? |  |
| Imposto seletivo | Lei | deslizador, 4 degraus | O país cobra imposto extra sobre produtos que fazem mal à saúde ou ao ambiente? | MOVE → Saúde (imposto de saúde pública) |
| Lista de remédios e incorporação | Lei | deslizador, 3 degraus | Quem decide quais remédios e tratamentos o sistema público paga: uma lista técnica ou o juiz, caso a caso? |  |
| Modelo do sistema de saúde | Constituição | deslizador, 5 degraus | Quem tem direito ao cuidado de saúde e quem paga por ele? |  |
| Mutirão de cirurgias | Alavanca | deslizador, 4 degraus | Pôr verba extra e temporária para baixar a fila de cirurgias agora? |  |
| Piso de gasto em saúde | Alavanca | valor (faixa) | Fixa a parte da receita pública que vai, no mínimo, para a saúde (hospitais, postos, remédios e vigilância saem daqui).  | JUNTA em `verba-da-saude-acima-do-piso` |
| Programa de médicos no interior | Lei | deslizador, 5 degraus | Como levar médicos para os lugares onde eles não querem trabalhar? |  |
| Regulação de vagas | Lei | deslizador, 3 degraus | Quem decide quem é atendido primeiro e onde? |  |
| Regulação dos planos de saúde | Lei | deslizador, 6 degraus | O que o plano de saúde é obrigado a cobrir, como reajusta e se o gasto com saúde abate imposto de renda? |  |
| Remédios em farmácias credenciadas | Alavanca | deslizador, 4 degraus | Quanto o governo paga de remédio para o paciente retirar em farmácia privada? |  |
| Restrição a tabaco e álcool | Lei | deslizador, 5 degraus | Até onde o Estado limita propaganda, venda e uso de cigarro e bebida? |  |
| Saúde mental | Lei | deslizador, 4 degraus | Onde e como se trata quem tem transtorno mental grave? |  |
| Vacinação obrigatória | Lei | deslizador, 5 degraus | O Estado só oferece a vacina ou obriga a tomar, e com que punição? |  |
| Vagas de residência médica | Alavanca | deslizador, 4 degraus | Quantas vagas de especialização médica o governo paga por ano? |  |
| Verba da saúde acima do piso | Alavanca | deslizador, 5 degraus | Quanto gastar com saúde além do mínimo obrigatório? | JUNTA com `piso-saude`: lei (regra) + alavanca (valor) |
| Vigilância epidemiológica | Alavanca | valor (faixa) | Fixa quanto o Estado gasta para detectar surtos cedo: laboratórios, notificação de casos, rastreamento, estoques estratégicos e equipes d… |  |

### Educação e cultura (24)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Acesso ao ensino superior | Constituição | deslizador, 5 degraus | Quem paga a universidade pública, e quem entra nela? |  |
| Alfabetização na idade certa | Alavanca | deslizador, 4 degraus | O governo central organiza um esforço para que toda criança leia e escreva até o fim do 2º ano? |  |
| Avaliação das escolas | Lei | deslizador, 4 degraus | O país mede o que os alunos aprendem, e o que faz com o resultado? |  |
| Bolsa de permanência no ensino médio | Alavanca | deslizador, 3 degraus | O governo paga o jovem pobre para ele ficar na escola até concluir o médio? |  |
| Bolsas de pós-graduação | Alavanca | deslizador, 3 degraus | Quantas bolsas o governo paga a mestrandos e doutorandos, e de que valor? |  |
| Concessões de rádio e TV | Lei | deslizador, 3 degraus | Como o governo dá e renova as licenças de rádio e TV? |  |
| Conteúdo moral e sexual | Lei | deslizador, 4 degraus | O que a escola pode ensinar sobre sexualidade, gênero e valores? |  |
| Crédito estudantil | Lei | deslizador, 4 degraus | O governo empresta ou paga para o jovem estudar em faculdade privada? |  |
| Educação domiciliar | Lei | deslizador, 4 degraus | A família pode ensinar o filho em casa, sem matricular na escola? |  |
| Ensino obrigatório | Constituição | deslizador, 4 degraus | Até que idade o Estado obriga a criança a estar na escola e garante a vaga? |  |
| Ensino religioso | Lei | deslizador, 3 degraus | A escola pública dá aula de religião, e ela é obrigatória? |  |
| Ensino técnico e profissional | Lei | deslizador, 4 degraus | Que espaço o ensino técnico tem na escola? |  |
| Escola em tempo integral | Alavanca | deslizador, 3 degraus | Quantas escolas funcionam o dia inteiro? |  |
| Financiamento com resultado | Lei | deslizador, 3 degraus | O dinheiro que vai para as redes de ensino depende só do número de alunos ou também do resultado? |  |
| Gestão da escola pública | Lei | deslizador, 4 degraus | Quem escolhe e comanda o diretor da escola pública? |  |
| Incentivo fiscal a pesquisa nas empresas | Lei | deslizador, 4 degraus | A empresa que faz pesquisa paga menos imposto? |  |
| Incentivo à cultura | Lei | deslizador, 5 degraus | Como o Estado financia a cultura? |  |
| Investimento em pesquisa e desenvolvimento | Alavanca | valor (faixa) | Fixa a meta nacional de investimento em pesquisa e desenvolvimento (% do PIB) que o Estado banca e puxa com agências, bolsas, laboratório… |  |
| Piso de gasto em educação | Constituição | deslizador, 3 degraus | O governo é obrigado a gastar uma parte mínima da receita com educação? | JUNTA com `piso-educacao`: lei (regra) + alavanca (valor) |
| Piso de gasto em educação | Alavanca | valor (faixa) | Fixa a parte da receita pública que vai, no mínimo, para a educação (escolas, professores, merenda e transporte escolar).  | JUNTA em `piso-de-gasto-em-educacao` |
| Piso salarial dos professores | Alavanca | deslizador, 4 degraus | Define se há um salário mínimo nacional para o professor da rede pública e quão alto ele é em relação a outras profissões de nível superior. |  |
| Programa espacial e satélites | Alavanca | valor (faixa) | Quanto o governo põe por ano em satélites próprios: imagens de floresta, fronteira e garimpo, e comunicação que não depende de outro país. |  |
| Vagas públicas no ensino superior | Alavanca | deslizador, 3 degraus | Quantas vagas a universidade pública oferece? |  |
| Vouchers escolares | Lei | deslizador, 4 degraus | O dinheiro público pode pagar escola privada escolhida pela família? |  |

### Infraestrutura (13)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Energia nuclear | Constituição | deslizador, 4 degraus | o país pode ter usinas nucleares, e pode construir novas? |  |
| Fontes de energia favorecidas | Lei | deslizador, 4 degraus | que fontes de energia o Estado favorece nos leilões e nos subsídios? |  |
| Habitação pública | Lei | deslizador, 3 degraus | Como o Estado ajuda a família a ter casa: moradia pública alugada, financiamento subsidiado para comprar ou venda da moradia pública a qu… | JUNTA em `como-o-estado-entrega-casa` |
| Incentivos fiscais regionais | Constituição | deslizador, 4 degraus | O país dá benefício fiscal para atrair empresas a regiões mais pobres, e de que jeito? |  |
| Investimento em geração por fonte | Alavanca | deslizador, 5 degraus | quanto da expansão de energia vai para cada fonte nos leilões? |  |
| Investimento em infraestrutura | Alavanca | valor (faixa) | Define quanto do PIB o Estado investe por ano em estradas, ferrovias, portos, energia e redes. |  |
| Licenciamento de obras e empresas | Lei | deslizador, 4 degraus | quem precisa de licença ambiental para obra ou empresa, em quantas etapas, e se as comunidades afetadas são ouvidas? |  |
| Matriz energética | Lei | deslizador, 4 degraus | Define se o Estado barateia o combustível fóssil, fica neutro, incentiva renováveis ou força a saída do fóssil. |  |
| Programa de habitação popular | Alavanca | valor (faixa) | Define quanto do PIB o Estado gasta para dar moradia a quem não pode pagar: construção subsidiada, financiamento barato ou auxílio-aluguel. | JUNTA em `verba-do-programa-habitacional` |
| Regime do petróleo e mineração | Lei | deslizador, 4 degraus | Quem explora petróleo e minérios e quanto fica com o Estado? |  |
| Transporte público | Lei | deslizador, 4 degraus | quem paga o ônibus e o metrô: o passageiro, o Estado, ou os dois? |  |
| Usinas a carvão | Lei | deslizador, 3 degraus | o Estado sustenta, deixa no mercado ou fecha com data as usinas e minas de carvão? |  |
| Água e esgoto | Lei | deslizador, 5 degraus | quem leva água tratada e coleta esgoto nas cidades: município, companhia estadual ou empresa privada, e com que metas? |  |

### Meio ambiente (9)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Crédito rural e assistência técnica | Alavanca | deslizador, 5 degraus | quanto o Estado barateia o crédito do produtor rural e paga técnicos para orientá-lo, e para quem vai esse dinheiro? | MOVE → Meio ambiente |
| Código florestal | Lei | deslizador, 4 degraus | Define quanto de vegetação nativa cada propriedade rural é obrigada a manter de pé. |  |
| Fiscalização ambiental | Alavanca | deslizador, 4 degraus | quanto o governo gasta para vigiar a floresta por satélite, multar, embargar e cortar o crédito de quem desmata? | MOVE → Meio ambiente |
| Licenciamento ambiental | Lei | deslizador, 4 degraus | Define se e como uma obra ou empreendimento precisa provar que não vai destruir o ambiente antes de sair do papel. |  |
| Preço do carbono | Lei | deslizador, 4 degraus | quem emite gás de efeito estufa paga por isso, e quanto? |  |
| Proteção da vegetação nativa nas propriedades rurais | Lei | deslizador, 4 degraus | quanto de cada imóvel rural deve ficar com mata nativa, e o que acontece com quem desmatou antes? | MOVE → Meio ambiente |
| Redistribuição de terras | Constituição | deslizador, 4 degraus | o Estado pode tomar terra para dar a quem não tem, e com que regra? |  |
| Registro de agrotóxicos | Lei | deslizador, 5 degraus | quem registra os pesticidas, e por qual critério: o perigo do produto ou o risco do uso? |  |
| Terras indígenas | Lei | deslizador, 4 degraus | o Estado reconhece as terras dos povos indígenas, por qual regra, e com quanto autogoverno? |  |

### Segurança e justiça (27)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Alternativas penais e audiência de custódia | Lei | deslizador, 3 degraus | Quem ainda não foi julgado ou cometeu crime leve vai para a prisão ou cumpre pena fora dela? |  |
| Armas de fogo | Lei | deslizador, 3 degraus | Quem pode ter e portar arma, quantas e com quanta munição? |  |
| Cibersegurança | Lei | deslizador, 4 degraus | Quem protege o país na internet, e com que poder? |  |
| Ciclo policial | Constituição | 2 botões | Se a mesma polícia patrulha e investiga o crime, ou se o trabalho é dividido entre duas. |  |
| Coordenação das polícias | Constituição | deslizador, 3 degraus | Quem manda nas polícias e quem faz a regra geral da segurança: cada estado, um sistema nacional coordenado ou uma polícia nacional? |  |
| Câmeras corporais | Alavanca | valor (faixa) | Quanto a União paga por ano para os estados comprarem câmeras para os uniformes da polícia. |  |
| Câmeras e reconhecimento facial | Lei | deslizador, 4 degraus | A polícia pode identificar rostos em câmeras públicas, e onde? |  |
| Delação premiada | Lei | deslizador, 3 degraus | Se o acusado pode ganhar pena menor por entregar comparsas e provas. | JUNTA em `delacao-premiada-e-acordos` |
| Delação premiada e acordos | Lei | deslizador, 3 degraus | O acusado pode trocar informação ou confissão por pena menor, e com que controle? | JUNTA com `delacao-premiada`: a ficha nova substitui a antiga |
| Dinheiro para as polícias dos estados | Alavanca | valor (faixa) | Quanto a União repassa por ano aos estados pelo Fundo Nacional de Segurança Pública (viaturas, armas, inteligência). |  |
| Excludente de ilicitude | Lei | 2 botões | Quando o policial que mata em serviço deixa de ser punido? |  |
| Gestão dos presídios | Lei | deslizador, 3 degraus | Quem administra a prisão: o Estado, uma empresa que presta serviços ao Estado ou uma empresa que constrói e opera? |  |
| Interceptação de comunicações | Lei | deslizador, 4 degraus | A polícia pode escutar telefone e ler mensagens, e com que ordem e prazo? |  |
| Lei de drogas | Lei | deslizador, 3 degraus | O que acontece com quem é pego usando drogas. |  |
| Maconha legal e regulada | Lei | deslizador, 3 degraus | Se a maconha pode ser vendida legalmente, com registro e imposto, e por quem. |  |
| Maioridade penal | Constituição | 2 botões | A partir de que idade quem comete crime vai para a prisão comum. |  |
| Natureza da polícia de rua | Constituição | 2 botões | A polícia que patrulha a rua é militar, com justiça militar, ou civil, com justiça comum? |  |
| Pena de morte | Constituição | 2 botões | Se a Justiça pode condenar à morte, e por quais crimes. |  |
| Penas e progressão | Lei | deslizador, 4 degraus | Quanto tempo se fica preso e como o preso volta aos poucos para a rua? |  |
| Poderes de investigação | Lei | deslizador, 3 degraus | A polícia pode infiltrar agentes, adiar prisões para seguir o grupo e pedir dados sem ordem do juiz? |  |
| Policiamento orientado | Lei | deslizador, 4 degraus | O governo adota um programa de prevenção focada, e qual: lugares quentes, metas com dados ou dissuasão com serviços? |  |
| Polícia de rua militar ou civil | Constituição | 2 botões | Se a polícia que patrulha a rua é militar (com quartel e Justiça Militar) ou civil. |  |
| Proteção de dados | Lei | deslizador, 4 degraus | Que regras empresas e governo seguem para coletar e usar dados pessoais? |  |
| Regime contra facções | Lei | deslizador, 3 degraus | O Estado cria regras especiais contra facções, e até onde vão: isolar líderes e tomar bens, ou suspender garantias? |  |
| Vagas em presídios | Alavanca | valor (faixa) | Quanto a União repassa por ano (Fundo Penitenciário) para abrir vagas e melhorar presídios. |  |
| Verba da Polícia Federal | Alavanca | valor (faixa) | Quanto a Polícia Federal recebe por ano para investigar o crime organizado, a corrupção e as fronteiras. |  |
| Vigilância de bairro | Lei | deslizador, 3 degraus | Moradores ajudam a vigiar o bairro, e sob o controle de quem? |  |

### Direitos e cidadania (22)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Aborto | Lei | deslizador, 6 degraus | Em que casos o aborto deixa de ser crime? |  |
| Acolhida e interiorização de imigrantes | Alavanca | deslizador, 4 degraus | Quanto o governo gasta por ano para receber imigrantes na fronteira e levá-los a cidades com trabalho? |  |
| Apostas e jogos de azar | Lei | deslizador, 5 degraus | As apostas online e os cassinos podem funcionar, e sob qual regra? | MOVE → Direitos (mesa das apostas) |
| Ações afirmativas | Lei | deslizador, 5 degraus | A universidade reserva vagas para grupos em desvantagem? |  |
| Bloqueio de pagamentos a casas sem licença | Alavanca | 2 botões | Bancos e o Pix devem recusar pagamentos a casas de apostas sem licença? |  |
| Casamento e união civil | Lei | deslizador, 4 degraus | Casais do mesmo sexo podem casar? |  |
| Crimes da ditadura | Lei | deslizador, 3 degraus | Os agentes do Estado que cometeram crimes num regime autoritário passado são perdoados, expostos ou julgados? |  |
| Discriminação e crimes de ódio | Lei | deslizador, 4 degraus | Como o Estado pune a discriminação por raça, orientação sexual, religião e origem? |  |
| Eutanásia | Lei | deslizador, 5 degraus | Um médico pode abreviar a vida a pedido do paciente? |  |
| Identidade de gênero | Lei | deslizador, 3 degraus | Como uma pessoa trans muda nome e sexo no registro? |  |
| Igualdade racial | Lei | deslizador, 4 degraus | O Estado usa a raça para focar suas políticas? |  |
| Igualdade salarial de gênero | Lei | deslizador, 4 degraus | Como a lei garante que mulheres e homens recebam o mesmo pelo mesmo trabalho? |  |
| Imunidade e dinheiro para igrejas | Constituição | deslizador, 3 degraus | As igrejas pagam impostos, e o Estado ajuda a financiá-las? |  |
| Laicidade do Estado | Constituição | deslizador, 6 degraus | Qual a relação entre o Estado e as religiões? |  |
| Política de natalidade | Lei | deslizador, 6 degraus | O Estado tenta mudar o número de filhos que as famílias têm, e com que meios? |  |
| Proteção contra violência doméstica | Lei | deslizador, 4 degraus | Como o Estado trata a violência contra a mulher dentro de casa? |  |
| Proteção da vida desde a concepção | Constituição | 2 botões | A Constituição deve dizer que a vida é protegida desde a concepção? |  |
| Publicidade de apostas | Alavanca | deslizador, 4 degraus | Casas de apostas podem anunciar e patrocinar times? |  |
| Refúgio e asilo | Lei | deslizador, 5 degraus | Quem foge de perseguição ou de crise recebe proteção no país? |  |
| Tributo sobre apostas | Alavanca | deslizador, 4 degraus | Quanto as casas de apostas pagam de imposto sobre o que ganham dos apostadores? |  |
| Verba de planejamento familiar e de aborto legal | Alavanca | deslizador, 4 degraus | Quanto o governo gasta por ano com contraceptivos e com os serviços de aborto previstos em lei? |  |
| Verba para juventude negra e saúde da população negra | Alavanca | deslizador, 4 degraus | Quanto o governo gasta por ano em políticas focadas em jovens negros e na saúde da população negra? |  |

### Governo e instituições (27)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Agência de inteligência e contrainteligência | Alavanca | valor (faixa) | Quanto a agência que investiga espionagem, dinheiro estrangeiro e ameaças ao Estado recebe por ano. |  |
| Cláusula de desempenho | Lei | deslizador, 3 degraus | Quantos votos um partido precisa ter para receber fundo, tempo de TV e liderança no Congresso? |  |
| Estabilidade dos servidores públicos | Constituição | deslizador, 4 degraus | O servidor público pode ser demitido, e por quem? |  |
| Federalismo | Constituição | deslizador, 3 degraus | Quanto poder e dinheiro ficam com estados e municípios, e quanto com o governo central? |  |
| Financiamento de campanhas | Lei | deslizador, 4 degraus | Quem paga as campanhas eleitorais: empresas, pessoas ou o Estado? |  |
| Foro privilegiado | Lei | deslizador, 4 degraus | Autoridades são julgadas pela Justiça comum ou direto pelas cortes mais altas? |  |
| Fundo de equalização | Alavanca | deslizador, 4 degraus | Quanto dinheiro extra o governo central põe para igualar estados e municípios pobres aos ricos? |  |
| Garantias penais | Constituição | 2 botões | Se o Estado pode matar ou prender para sempre quem cometeu um crime. |  |
| Governadores | Constituição | 2 botões | Os governantes dos estados são eleitos pelo povo ou indicados pelo governo central? |  |
| Independência do Judiciário | Constituição | deslizador, 3 degraus | Os juízes podem decidir contra o governo sem medo de perder o cargo? |  |
| Lei anticorrupção | Lei | deslizador, 3 degraus | Quem é punido pela corrupção, só as pessoas ou também as empresas, e quem investiga? |  |
| Liberdade de imprensa | Constituição | deslizador, 4 degraus | O governo pode controlar o que jornais, rádios e TVs publicam? |  |
| ONGs e financiamento estrangeiro | Lei | deslizador, 3 degraus | Organizações sociais podem receber dinheiro de fora do país, e com que controle? |  |
| Orçamento do Judiciário | Alavanca | deslizador, 4 degraus | Quanto o país gasta com juízes, tribunais e servidores da Justiça? |  |
| Participação direta | Lei | deslizador, 4 degraus | O cidadão decide diretamente sobre orçamento, leis ou mandatos, ou só pelo voto? |  |
| Partidos | Constituição | deslizador, 3 degraus | Quantos partidos podem disputar o poder? |  |
| Polícias dos estados | Constituição | 2 botões | Quem manda na polícia de rua e na polícia que investiga: os governadores ou o presidente. |  |
| Reeleição | Constituição | deslizador, 4 degraus | O chefe do Executivo pode se candidatar de novo, e quantas vezes? |  |
| Regra de repasse | Lei | deslizador, 4 degraus | Como o dinheiro federal é repartido entre estados e municípios? |  |
| Regulação das redes sociais | Lei | deslizador, 5 degraus | As plataformas respondem pelo conteúdo que circula nelas, e quem manda tirar o que é ilegal? |  |
| Sistema de governo | Constituição | deslizador, 4 degraus | Quem chefia o governo e se o Congresso pode derrubá-lo? |  |
| Transparência pública | Lei | deslizador, 4 degraus | O cidadão pode ver documentos, gastos e dados do governo? |  |
| Tribunais superiores | Lei | deslizador, 4 degraus | Quem escolhe os juízes das cortes mais altas, quantos são e por quanto tempo ficam? |  |
| Valor do fundo eleitoral | Alavanca | deslizador, 4 degraus | Quanto dinheiro público vai para as campanhas? |  |
| Verba de controle | Alavanca | deslizador, 4 degraus | Quanto o governo gasta com auditoria e fiscalização do próprio gasto, inclusive sorteio de municípios auditados? |  |
| Verba de publicidade oficial e comunicação pública | Alavanca | deslizador, 4 degraus | Quanto o governo gasta com propaganda própria e com mídia pública? |  |
| Voto obrigatório | Lei | deslizador, 3 degraus | O cidadão é obrigado a votar, e com que punição? |  |

### Defesa e relações exteriores (nova) (21)

| Lei | Camada | Controle | O que faz | Mudança |
| --- | --- | --- | --- | --- |
| Acordos comerciais | Lei | deslizador, 4 degraus | Com quem o país faz acordos para baixar tarifas? | MOVE → nova esfera Defesa |
| Aliança militar | Constituição | deslizador, 5 degraus | Com quem o país se compromete a lutar? | MOVE → nova esfera Defesa |
| Alinhamento externo | Lei | deslizador, 5 degraus | De que lado do mundo o país fica? | MOVE → nova esfera Defesa |
| Controle civil das Forças Armadas | Constituição | deslizador, 4 degraus | Quem manda nos militares e eles podem fazer política? | MOVE → nova esfera Defesa |
| Cooperação internacional | Alavanca | deslizador, 4 degraus | Quanto da renda nacional o país dá em ajuda a outros países? | MOVE → nova esfera Defesa |
| Exportação de armas | Lei | deslizador, 4 degraus | A quem o país pode vender armas? | MOVE → nova esfera Defesa |
| Gasto com defesa | Alavanca | valor (faixa) | Define quanto do PIB vai para Forças Armadas, equipamentos e indústria de defesa. | MOVE → nova esfera Defesa |
| Indústria de defesa | Lei | deslizador, 4 degraus | O país compra armas prontas ou fabrica aqui? | MOVE → nova esfera Defesa |
| Integração regional | Lei | deslizador, 4 degraus | Quanto o país se amarra aos vizinhos em blocos políticos e de defesa? | MOVE → nova esfera Defesa |
| Investimento em defesa | Alavanca | deslizador, 5 degraus | Que fatia do gasto com defesa vai para equipamento e custeio, e não para pessoal? | MOVE → nova esfera Defesa |
| Missões de paz | Lei | deslizador, 4 degraus | O país manda soldados para missões de paz da ONU? | MOVE → nova esfera Defesa |
| Papel das Forças Armadas | Constituição | deslizador, 4 degraus | Para que servem as Forças Armadas dentro do país? | MOVE → nova esfera Defesa |
| Política de imigração | Lei | deslizador, 5 degraus | Quem pode entrar no país para morar e trabalhar? | MOVE → nova esfera Defesa |
| Política de sanções | Lei | deslizador, 4 degraus | O que o país faz com as sanções que outros países aplicam? | MOVE → nova esfera Defesa |
| Programa nuclear | Constituição | deslizador, 4 degraus | Para que o país usa o átomo e quanto deixa ser inspecionado? | MOVE → nova esfera Defesa |
| Proteção de fronteiras | Lei | deslizador, 4 degraus | Quem vigia a fronteira e com que poder? | MOVE → nova esfera Defesa |
| Proteção social dos militares | Lei | deslizador, 4 degraus | Como se aposentam os militares e quanto recebem as pensões? | MOVE → nova esfera Defesa |
| Rede diplomática | Alavanca | deslizador, 4 degraus | Quantas embaixadas e consulados o país mantém no exterior? | MOVE → nova esfera Defesa |
| Saída do país | Constituição | 2 botões | O cidadão precisa de autorização para sair do país? | MOVE → nova esfera Defesa |
| Serviço militar | Constituição | deslizador, 5 degraus | Quem serve nas Forças Armadas, e é obrigado? | MOVE → nova esfera Defesa |
| Tribunais e tratados internacionais | Constituição | deslizador, 4 degraus | Quanto as cortes e os tratados de fora valem dentro do país? | MOVE → nova esfera Defesa |

## 6. Perguntas para você

1. A esfera nova **Defesa e relações exteriores** (12ª) é boa, ou prefere manter 11 esferas e dividir Segurança de outro jeito?
2. Os **7 setores** estão certos? Falta algum (mineração, ferrovias separadas de portos)?
3. Confirma o **processo em etapas** (lotes, custos por turno, dilemas) como tipo novo do motor, no lugar de leis com opções?
4. Quer que eu pesquise as **leis novas do mundo** da seção 4 com fonte antes de escrever as fichas?

