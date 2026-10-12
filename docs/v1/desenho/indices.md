# Índices com unidade real (V1-07)

**Status:** APROVADO pelo autor (12/out). Próximo passo: cada linha vira `medida` no `variaveis.json`.

## Como ler

O motor continua em 0 a 100. A `medida` diz o que 0 e 100 significam no mundo real: o valor do motor vira a medida por uma reta entre as duas balizas (ou a reta invertida, quando a linha diz "invertido"). A tela mostra a medida real; as fichas passam a escrever efeitos nessa unidade.

- **manter**: o índice já é a medida real; só ganha unidade e fonte.
- **converter**: o índice vira a medida indicada; os números de hoje são reescalados pelas balizas.
- **composto**: não há uma estatística única; usa um índice composto público.
- **juntar**: duplica outro índice ou é média de outros; proposta é fundir ou derivar sem número próprio.
- **técnico**: estado interno do motor, sem medida real; fica 0 a 100 e a tela explica o que é.

Balizas e fontes são propostas minhas a partir de estatísticas públicas; nenhuma veio do D4. Os valores do Brasil em jan/2025 entram na calibragem (passo seguinte), não aqui.

## Pilares (ideia do autor, 12/out)

Além dos índices medidos, cada área pode ter um **pilar**: um índice composto que resume o conjunto (método do *Handbook on constructing composite indicators*, OCDE/JRC). Ele não tem estatística própria: é a média ponderada dos índices da área, com pesos escritos e explicados na ficha da área. Exemplo: pilar Segurança = violência letal, crimes patrimoniais, vitimização e sensação de segurança. A sensação continua sendo um índice medido (pesquisa), uma das partes do pilar. Os pilares entram nos chamados de conteúdo (V1-14 a V1-23), começando por Segurança.

**Ajuste na carga dos valores (12/out).** PIB, consumo e renda das famílias são bases dos impostos na rede (o IVA multiplica o consumo, o IR multiplica a renda). Como taxa de crescimento, o número de partida mudava e a arrecadação ia de ~32% para ~40% do PIB. PIB e consumo viraram nível (jan/2025 = 100), e as balizas da renda e do envelhecimento foram ajustadas para o valor de hoje cair no real (R$ 2.020; 10,9% com 65+). O envelhecimento é base do gasto da previdência: em 3% a 30%, o gasto caía 2 pontos do PIB. O crescimento aparece como variação desse nível.

## Pilares por área (proposta, 12/out)

O pilar é o índice que resume a área e aparece na primeira página do
jornal, na abertura e a cada turno. Hoje o quadro tem 10 índices fixos no
código (`ui/mapa/jornal.ts`), 4 deles de economia, e 5 áreas sem nenhum.
Proposta: um pilar por área (saúde e proteção social com dois), marcado no
conteúdo (`pilar: true` na variável), e o jornal lê dali.

| Área | Pilar | Hoje no jornal? |
| --- | --- | --- |
| Segurança e justiça penal | Violência letal (depois: pilar composto Segurança) | sim |
| Contas, tributos e economia | PIB | sim |
| Poder e instituições | Aprovação do governo | sim |
| Direitos e liberdades | Liberdades civis | não |
| Defesa e mundo | Reputação internacional | sim |
| Trabalho e mercado | Desemprego | sim |
| Proteção social e saúde | Pobreza; Saúde da população | pobreza sim |
| Educação, ciência e cultura | Aprendizagem | não |
| Meio ambiente, energia e campo | Desmatamento | não |
| Cidades e transporte | Infraestrutura (média das três) | não |

Saem do quadro, mas continuam na seção Mercado do jornal, que já os lê:
inflação, taxa de juros, dívida pública e risco país.

## Resumo

116 índices: 30 manter, 77 converter, 1 composto, 3 juntar, 5 técnico.

| Área | Chamado | Índices |
|---|---|---|
| Segurança e justiça penal | V1-14 | 10 |
| Contas, tributos e economia | V1-15 | 30 |
| Poder e instituições | V1-16 | 13 |
| Direitos e liberdades | V1-17 | 6 |
| Defesa e mundo | V1-18 | 3 |
| Trabalho e mercado | V1-19 | 11 |
| Proteção social e saúde | V1-20 | 19 |
| Educação, ciência e cultura | V1-21 | 8 |
| Meio ambiente, energia e campo | V1-22 | 11 |
| Cidades e transporte | V1-23 | 5 |

## Segurança e justiça penal (V1-14)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Armas em circulação (estoque)<br>`armas_em_circulacao` | converter | armas de fogo civis por 100 hab. | 0 a 120 | Small Arms Survey; registros Sinarm/SIGMA |
| Crime organizado<br>`crime_organizado` | composto | índice de criminalidade organizada (0 a 10) | 1 a 9 | Global Organized Crime Index (GI-TOC) |
| Crimes contra o patrimônio (roubos e furtos)<br>`crimes_patrimoniais` | converter | roubos e furtos registrados por 100 mil hab. | 0 a 3.000 | Anuário Brasileiro de Segurança Pública (FBSP) |
| Impunidade<br>`impunidade` | converter | % de homicídios sem autoria esclarecida | 10% a 90% | Instituto Sou da Paz ("Onde mora a impunidade") |
| Letalidade policial<br>`letalidade_policial` | converter | mortes por intervenção policial por 100 mil hab. | 0 a 10 | Anuário Brasileiro de Segurança Pública |
| Lotação dos presídios<br>`lotacao_prisional` | converter | presos por vaga (%) | 50% a 250% | Sisdepen/Senappen; World Prison Brief |
| Reincidência criminal<br>`reincidencia` | converter | % de egressos que voltam ao sistema em 5 anos | 10% a 70% | Depen/UFPE (2022); estudos do CNJ |
| Sensação de segurança<br>`sensacao_seguranca` | converter | % que se sente seguro andando à noite no bairro | 20% a 95% | Gallup Law and Order; PNAD 2021 (módulo vitimização) |
| Uso de drogas<br>`uso_drogas` | converter | % de adultos que usaram droga ilícita no último ano | 0% a 20% | UNODC World Drug Report; LENAD/Fiocruz |
| Violência letal<br>`violencia_letal` | manter | homicídios por 100 mil hab. | 0 a 60 | SIM/DATASUS; Atlas da Violência (Ipea/FBSP) |

**Falta (autor, 12/out):** um índice de segurança em si, não só letal. Proposta para o V1-14: `vitimizacao`, % de pessoas que sofreram algum crime em 12 meses (PNAD módulo vitimização; pesquisas estaduais de vitimização).

## Contas, tributos e economia (V1-15)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Arrecadação<br>`arrecadacao` | manter | carga tributária bruta (% do PIB) | 10% a 50% | Tesouro Nacional; OCDE Revenue Statistics |
| Cofre do Tesouro (estoque)<br>`cofre` | manter | ativos do fundo soberano / caixa livre (% do PIB) | 0% a 10% (teto) | Tesouro (conta única); SWF Institute |
| Complexidade tributária<br>`complexidade_tributaria` | converter | horas por ano para pagar tributos (empresa média) | 100 a 2.000 | Banco Mundial Doing Business (série até 2020) |
| Concentração de mercado<br>`concentracao_mercado` | converter | % de setores com HHI acima de 2.500 | 0% a 60% | Cade; OCDE (competition indicators) |
| Confiança empresarial<br>`confianca_empresarial` | manter | índice de confiança empresarial (100 = neutro) | 70 a 120 | FGV/IBRE (ICE) |
| Consumo das famílias<br>`consumo` | converter | consumo real das famílias (jan/2025 = 100) | 50 a 150 | IBGE Contas Nacionais |
| Cooperação fiscal internacional (estoque)<br>`transparencia_fiscal_internacional` | converter | nota no Global Forum (troca de informações), 0 a 4 níveis | 0 a 4 | OCDE Global Forum |
| Crédito disponível<br>`credito` | converter | crédito ao setor privado (% do PIB) | 20% a 150% | Banco Central; Banco Mundial |
| Câmbio<br>`cambio` | converter | câmbio real efetivo (base 100 = média de 10 anos) | 60 a 160 | Banco Central (IPCA-REER); BIS |
| Déficit da previdência<br>`deficit_previdenciario` | manter | déficit da previdência pública (% do PIB) | −2% a 8% | Tesouro (RTN); Secretaria de Previdência |
| Dívida pública (estoque)<br>`divida_publica` | manter | dívida bruta do governo geral (% do PIB) | 0% a 150% | Banco Central (DBGG); FMI WEO |
| Endividamento das famílias<br>`endividamento_familias` | converter | dívida das famílias / renda de 12 meses (%) | 10% a 100% | Banco Central (RNDBF) |
| Expectativas de inflação<br>`expectativas_inflacao` | manter | inflação esperada 12 meses à frente (%) | 0% a 20% | Banco Central (Focus) |
| Exportações<br>`exportacoes` | converter | exportações de bens e serviços (% do PIB) | 5% a 60% | IBGE; Secex/MDIC |
| Fuga de capitais<br>`fuga_capitais` | converter | saída líquida de capital de residentes (% do PIB) | 0% a 6% | Banco Central (balanço de pagamentos) |
| Gasto público<br>`gasto_publico` | manter | despesa primária do governo geral (% do PIB) | 10% a 55% | Tesouro Nacional; FMI Fiscal Monitor |
| Importações<br>`importacoes` | converter | importações de bens e serviços (% do PIB) | 5% a 60% | IBGE; Secex/MDIC |
| Inflação<br>`inflacao` | manter | inflação ao consumidor em 12 meses (%) | −2% a 30% | IBGE IPCA |
| Investimento<br>`investimento` | converter | formação bruta de capital fixo (% do PIB) | 10% a 35% | IBGE Contas Nacionais |
| Investimento estrangeiro direto<br>`ied` | manter | investimento direto no país (% do PIB) | 0% a 6% | Banco Central (BP) |
| Juros da dívida<br>`juros_da_divida` | manter | juros nominais da dívida (% do PIB) | 0% a 10% | Banco Central (NFSP) |
| PIB<br>`pib` | converter | PIB real (jan/2025 = 100) | 55 a 155 | IBGE Contas Nacionais |
| Poupança doméstica (estoque)<br>`poupanca_domestica` | manter | poupança bruta nacional (% do PIB) | 5% a 35% | IBGE Contas Nacionais |
| Produtividade<br>`produtividade` | converter | PIB por hora trabalhada (US$ PPC) | 5 a 80 | Penn World Table; Conference Board |
| Reservas internacionais (estoque)<br>`reservas_internacionais` | manter | reservas internacionais (% do PIB) | 0% a 40% | Banco Central |
| Resultado fiscal<br>`resultado_fiscal` | manter | resultado primário (% do PIB) | −10% a +10% | Banco Central (NFSP); Tesouro |
| Risco país<br>`risco_pais` | converter | spread soberano (pontos-base) | 50 a 1.500 | JP Morgan EMBI; CDS 5 anos |
| Sonegação<br>`sonegacao` | converter | hiato de conformidade tributária (% da arrecadação potencial) | 5% a 40% | Sindifisco/IBPT; FMI (tax gap) |
| Taxa de juros<br>`taxa_juros` | manter | taxa básica de juros (% ao ano) | 0% a 30% | Banco Central (Selic) |
| Turismo<br>`turismo` | converter | chegadas de turistas estrangeiros por 100 hab. | 0 a 100 | Embratur; ONU Turismo |

## Poder e instituições (V1-16)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Aprovação do governo<br>`popularidade_governo` | técnico | % que aprova o governo | 10% a 80% | Datafolha; Quaest; CNT/MDA — real, mas é saída do motor político |
| Base de apoio no Congresso<br>`base_congresso` | técnico | % de deputados que votam com o governo | 0% a 100% | Basômetro (Estadão); Câmara (votações nominais) — mede algo real, mas é o motor político |
| Capacidade do Estado<br>`capacidade_estatal` | converter | eficácia do governo (WGI, −2,5 a +2,5) | −2,5 a +2,5 | Banco Mundial (Worldwide Governance Indicators) |
| Captura política<br>`captura_politica` | converter | controle da corrupção (WGI) invertido | −2,5 a +2,5 | Banco Mundial (WGI); V-Dem |
| Confiança nas instituições<br>`confianca_instituicoes` | converter | % que confia no Congresso, Justiça e governo (média) | 5% a 80% | Latinobarómetro; OCDE Trust Survey |
| Corrupção<br>`corrupcao` | converter | 100 − nota no Índice de Percepção da Corrupção | 10 a 90 | Transparência Internacional (IPC) |
| Desigualdade regional<br>`desigualdade_regional` | converter | razão do PIB per capita da região mais rica para a mais pobre | 1 a 8 | IBGE (PIB dos Municípios/UFs) |
| Desinformação<br>`desinformacao` | converter | disseminação de desinformação pelo governo e partidos (V-Dem) | 0 a 4 | V-Dem (Digital Society Project) |
| Estabilidade política<br>`estabilidade_politica` | converter | estabilidade política e ausência de violência (WGI) | −2,5 a +2,5 | Banco Mundial (WGI) |
| Força das instituições<br>`forca_instituicoes` | converter | índice de democracia liberal (0 a 1) | 0 a 0,9 | V-Dem (LDI) |
| Margem de manobra do governo<br>`margem_manobra_governo` | técnico | sem medida real; folga política acumulada | — | interno ao motor (deriva de base e aprovação) |
| Participação eleitoral<br>`participacao_eleitoral` | manter | comparecimento na última eleição nacional (%) | 40% a 95% | TSE; IDEA Voter Turnout |
| Polarização<br>`polarizacao` | converter | polarização política (V-Dem, 0 a 4) | 0 a 4 | V-Dem (v2cacamps) |

## Direitos e liberdades (V1-17)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Diferença salarial de gênero<br>`diferenca_salarial_genero` | manter | diferença de rendimento mulheres/homens (%) | 0% a 40% | IBGE PNAD Contínua; OIT |
| Discriminação<br>`discriminacao` | converter | % que relata ter sofrido discriminação no último ano | 5% a 50% | Pesquisas de vitimização; Latinobarómetro |
| Imigração<br>`imigracao` | converter | imigrantes residentes (% da população) | 0% a 30% | ONU DESA (International Migrant Stock); SisMigra |
| Liberdades civis<br>`liberdade_civil` | converter | nota de liberdades civis (0 a 60) | 0 a 60 | Freedom House (Freedom in the World) |
| Proteção efetiva às mulheres<br>`protecao_efetiva_mulheres` | converter | feminicídios por 100 mil mulheres (invertido) | 0 a 5 | Anuário Brasileiro de Segurança Pública; SIM |
| Vício em apostas<br>`vicio_em_apostas` | converter | % de adultos com aposta problemática | 0% a 10% | Datafolha/LENAD; Banco Central (Pix para bets) |

## Defesa e mundo (V1-18)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Capacidade de defesa (estoque)<br>`capacidade_defesa` | converter | gasto militar (% do PIB) acumulado em capacidade | 0% a 5% | SIPRI Military Expenditure |
| Reputação internacional<br>`reputacao_internacional` | converter | nota de imagem do país (0 a 100) | 0 a 100 | Anholt-Ipsos Nation Brands Index; Pew Global Attitudes |
| Tensão internacional<br>`tensao_internacional` | técnico | sem medida única; clima externo do país | — | interno (eventos e diplomacia); referência: GDELT |

## Trabalho e mercado (V1-19)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Custo de contratar<br>`custo_trabalhista` | converter | encargos sobre a folha (% do salário) | 10% a 100% | OCDE Taxing Wages; Dieese |
| Desemprego<br>`desemprego` | manter | taxa de desocupação (%) | 2% a 30% | IBGE PNAD Contínua |
| Idosos no mercado de trabalho<br>`participacao_trabalho_idosos` | manter | % de 65+ ocupados | 0% a 40% | IBGE PNAD Contínua; OCDE |
| Informalidade<br>`informalidade` | manter | % de ocupados informais | 5% a 80% | IBGE PNAD Contínua |
| Litígio trabalhista<br>`litigio_trabalhista` | converter | novos processos trabalhistas por 1.000 empregados | 0 a 60 | TST (Relatório Geral); CNJ Justiça em Números |
| Oportunidades para jovens<br>`oportunidades_juvenis` | converter | % de 15 a 29 anos que nem estudam nem trabalham (invertido) | 5% a 40% | IBGE (Síntese de Indicadores Sociais); OCDE NEET |
| Participação no trabalho de quem cuida<br>`participacao_trabalho_cuidadoras` | converter | taxa de participação das mulheres 25–54 anos (%) | 30% a 90% | IBGE PNAD Contínua; OIT |
| Qualificação do trabalho<br>`qualificacao_trabalho` | converter | % dos ocupados com ensino médio completo | 10% a 95% | IBGE PNAD Contínua |
| Renda das famílias<br>`renda_familias` | converter | rendimento domiciliar per capita real (moeda local de 2025) | 300 a 4.122 | IBGE PNAD Contínua |
| Rotatividade no emprego<br>`rotatividade_emprego` | manter | taxa de rotatividade anual do emprego formal (%) | 10% a 70% | Caged/Rais; Dieese |
| Trabalho infantil<br>`trabalho_infantil` | manter | % de 5 a 17 anos em trabalho infantil | 0% a 25% | IBGE PNAD Contínua; OIT/UNICEF |

## Proteção social e saúde (V1-20)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Carga do evento de demanda<br>`carga_evento_demanda` | técnico | sem medida real; demanda extra aberta por um evento | — | interno ao motor (eventos) |
| Cobertura da atenção básica<br>`cobertura_aps` | manter | % da população coberta pela atenção primária | 20% a 100% | Ministério da Saúde (e-Gestor) |
| Cobertura previdenciária<br>`cobertura_previdenciaria` | manter | % de idosos 65+ que recebem aposentadoria ou pensão | 20% a 100% | IBGE PNAD Contínua; OIT (World Social Protection) |
| Cobertura vacinal<br>`cobertura_vacinal` | manter | cobertura do calendário infantil (média das vacinas, %) | 40% a 100% | PNI/DataSUS; OMS/UNICEF (WUENIC) |
| Consumo de tabaco e álcool<br>`consumo_tabaco_alcool` | converter | % de adultos fumantes + consumo abusivo de álcool (média) | 5% a 40% | Vigitel; OMS |
| Desigualdade<br>`desigualdade` | converter | índice de Gini da renda domiciliar per capita | 0,25 a 0,65 | IBGE PNAD Contínua; Banco Mundial |
| Envelhecimento (estoque)<br>`envelhecimento` | converter | % da população com 65+ | 0% a 27,25% | IBGE (Projeções da População) |
| Falta de médicos<br>`falta_de_medicos` | converter | médicos por 1.000 hab. (invertido) | 0,2 a 5 | CFM (Demografia Médica); OMS |
| Gasto do bolso com saúde<br>`gasto_bolso_saude` | manter | gasto direto das famílias (% do gasto total em saúde) | 5% a 70% | OMS (Global Health Expenditure Database) |
| Insegurança alimentar<br>`inseguranca_alimentar` | manter | % de domicílios em insegurança alimentar moderada ou grave | 0% a 40% | IBGE PNAD (EBIA); Rede Penssan |
| Natalidade<br>`natalidade` | converter | taxa de fecundidade total (filhos por mulher) | 0,8 a 4 | IBGE; ONU World Population Prospects |
| Pessoas com plano de saúde<br>`cobertura_planos_saude` | manter | % da população com plano de saúde | 0% a 60% | ANS (Sala de Situação) |
| Pobreza<br>`pobreza` | manter | % abaixo da linha de US$ 6,85/dia PPC | 0% a 60% | IBGE (Síntese de Indicadores Sociais); Banco Mundial |
| População em situação de rua<br>`populacao_de_rua` | converter | pessoas em situação de rua por 100 mil hab. | 0 a 300 | CadÚnico/MDHC; Ipea |
| Pressão hospitalar<br>`pressao_hospitalar` | converter | taxa de ocupação de leitos públicos (%) | 40% a 110% | DataSUS (SIH/CNES) |
| Preço dos medicamentos<br>`preco_medicamentos` | converter | variação real do preço de remédios (% ao ano) | −5% a +15% | IBGE IPCA (produtos farmacêuticos); CMED |
| Qualidade de vida<br>`qualidade_de_vida` | juntar | IDH (0 a 1), ou média de saúde, renda e educação já existentes | 0,4 a 1 | PNUD (Relatório de Desenvolvimento Humano) |
| Saúde da população<br>`saude_populacao` | converter | expectativa de vida ao nascer (anos) | 50 a 85 | IBGE (Tábuas de Mortalidade); OMS |
| Sofrimento mental<br>`sofrimento_mental` | converter | % de adultos com diagnóstico de depressão | 2% a 20% | IBGE PNS; OMS |

## Educação, ciência e cultura (V1-21)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Aprendizagem dos alunos<br>`aprendizagem` | converter | nota média no PISA (leitura, matemática, ciências) | 300 a 600 | OCDE PISA; Inep (Saeb) |
| Desenvolvimento (estoque)<br>`desenvolvimento` | juntar | IDH (o mesmo de qualidade_de_vida) — juntar os dois | 0,4 a 1 | PNUD |
| Escolaridade (estoque)<br>`escolaridade` | converter | anos médios de estudo da população 25+ | 2 a 14 | IBGE PNAD Contínua; Barro-Lee |
| Evasão escolar<br>`evasao_escolar` | manter | % de jovens 15–17 fora da escola sem o médio | 0% a 30% | IBGE PNAD Contínua; Inep (Censo Escolar) |
| Fuga de cérebros<br>`fuga_de_cerebros` | converter | doutores do país vivendo fora (% dos titulados) | 0% a 20% | CGEE; OCDE (DIOC) |
| Inovação<br>`inovacao` | converter | gasto em P&D (% do PIB) | 0% a 5% | MCTI; Unesco UIS; OCDE MSTI |
| Segregação escolar<br>`segregacao_escolar` | converter | índice de dissimilaridade socioeconômica entre escolas | 0 a 0,7 | OCDE PISA (isolation/dissimilarity) |
| Vitalidade cultural<br>`vitalidade_cultural` | converter | % da população que frequentou atividade cultural no ano | 10% a 90% | IBGE (Sistema de Informações e Indicadores Culturais) |

## Meio ambiente, energia e campo (V1-22)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Concentração de terras (estoque)<br>`concentracao_fundiaria` | converter | Gini da distribuição de terras | 0,3 a 0,9 | IBGE (Censo Agropecuário) |
| Conflitos no campo<br>`conflitos_fundiarios` | converter | conflitos no campo por ano | 0 a 2.500 | CPT (Conflitos no Campo Brasil) |
| Desmatamento<br>`desmatamento` | converter | área desmatada por ano (mil km²) | 0 a 30 | Inpe (Prodes) |
| Emissões de carbono<br>`emissoes` | converter | emissões de GEE (t CO₂e por habitante) | 0 a 20 | SEEG/Observatório do Clima; EDGAR |
| Infraestrutura de energia (estoque)<br>`infraestrutura_energia` | converter | % de domicílios com energia sem interrupção longa (DEC invertido) | DEC 0 a 40 h | Aneel (DEC/FEC) |
| Oferta de energia<br>`oferta_energia` | converter | folga de capacidade sobre demanda máxima (%) | −10% a +40% | ONS; EPE (Balanço Energético Nacional) |
| Preço da energia<br>`preco_energia` | converter | tarifa residencial média (moeda local por MWh, preços de 2025) | 300 a 1.500 | Aneel |
| Preço dos alimentos<br>`preco_alimentos` | converter | inflação dos alimentos no domicílio em 12 meses (%) | −5% a +25% | IBGE IPCA |
| Produção agropecuária<br>`producao_agropecuaria` | converter | crescimento real do valor bruto da produção (% ao ano) | −15% a +15% | Mapa (VBP); IBGE (PAM/PPM) |
| Produção de petróleo e minérios<br>`producao_mineral` | converter | produção de petróleo (mil barris/dia equivalentes) | 0 a 6.000 | ANP; ANM |
| Qualidade ambiental<br>`qualidade_ambiental` | converter | nota no Environmental Performance Index (0 a 100) | 20 a 80 | Yale EPI |

## Cidades e transporte (V1-23)

| Índice | Ação | Medida real | Balizas (0 → 100) | Fonte |
|---|---|---|---|---|
| Déficit habitacional<br>`deficit_habitacional` | converter | déficit habitacional (% dos domicílios) | 0% a 20% | Fundação João Pinheiro |
| Infraestrutura (estoque)<br>`infraestrutura` | juntar | média das três infraestruturas (sem medida própria) | — | derivado de energia, saneamento e transportes |
| Infraestrutura de saneamento (estoque)<br>`infraestrutura_saneamento` | converter | % da população com coleta de esgoto | 0% a 100% | SNIS/SINISA (Ministério das Cidades) |
| Infraestrutura de transportes (estoque)<br>`infraestrutura_transportes` | converter | % da malha rodoviária em estado bom ou ótimo | 10% a 90% | CNT (Pesquisa de Rodovias) |
| Mobilidade urbana<br>`mobilidade_urbana` | converter | tempo médio casa–trabalho nas metrópoles (min) | 20 a 90 | IBGE (Censo 2022); Moovit |

## O que eu preciso de você

1. Corrigir qualquer medida que não represente o que o índice quer dizer no jogo.
2. Confirmar os **juntar** (qualidade de vida e desenvolvimento viram o IDH; infraestrutura vira média das três).
3. Confirmar os **técnico** (aprovação, base, margem, carga de evento, tensão internacional).
