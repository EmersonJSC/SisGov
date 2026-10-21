# Diretriz de geração de leis em lotes

> **Status: VIGENTE.** Diretriz de design para produzir conteúdo de leis em lotes,
> alinhada às regras de fonte, ficha e hipótese do SisGov.

## 1. Objetivo

O SisGov é um simulador político voltado à jogabilidade e ao equilíbrio de causa
e efeito. A modelagem de uma lei não precisa ser uma estimativa acadêmica; precisa
ser plausível, legível, estruturalmente válida e interessante como decisão de jogo.

As fontes e os casos reais são **trilhos de sanidade**: demonstram que o objeto
político existe e ajudam a evitar resultados implausíveis. Não precisam
comprovar cada coeficiente interno do jogo.

## 2. Tríade de produção

Cada lote separa três tipos de afirmação:

1. **Fato de mundo.** A política ou instrumento existe ou existiu. Registrar
   jurisdição, período e fonte verificável. A fonte sustenta a existência e o
   contexto da política; não é apresentada como prova dos coeficientes do jogo.
2. **Hipótese de jogo.** A IA propõe opções, grupos afetados, mecanismos,
   coeficientes iniciais, atrasos e custos. Números sem estimativa empírica direta
   ficam explicitamente identificados como hipótese na ficha e no registro do
   lote. No JSON atual das consequências, `origem` é o nó causal do motor; não
   deve receber o texto `"hipotese"`. A IA deve usar apenas nós, unidades e
   mecanismos existentes, salvo proposta separada para ampliar a rede.
3. **Teste.** Ferramentas validam esquema, referências, faixas e combinações;
   simulações procuram instabilidade e efeitos dominantes; playtest avalia clareza
   e interesse das escolhas. Passar um teste não transforma hipótese em fato.

## 3. Fluxo de trabalho em lotes

1. Definir um tema e uma pergunta de política pública, sem pedir leis inventadas
   do zero.
2. Levantar um conjunto pequeno de casos e fontes, anotando o que cada fonte
   sustenta.
3. Pedir à IA um rascunho completo para cada ficha: alternativas reais,
   apoiadores e opositores plausíveis, ligações à rede, hipóteses numéricas,
   atrasos e possíveis efeitos colaterais.
4. Compilar os rascunhos no formato do jogo e executar validação estrutural e
   simulação. A IA propõe os números iniciais; a pessoa responsável revisa o lote
   e decide se a experiência é clara e divertida.
5. Registrar falhas e aprendizados do lote. Só depois de revisão e teste o
   conteúdo pode ser promovido ao catálogo oficial.

O lote é a unidade de revisão. Não é necessário aprovar cada coeficiente isolado
antes de experimentar; é necessário conseguir rastrear cada hipótese e alterar o
lote quando os testes ou o playtest apontarem um problema.

## 4. Regra obrigatória: cobertura dos quatro projetos políticos

Cada lote de um ministério deve permitir que, pela combinação das leis desse
ministério, o jogador construa rotas viáveis para os quatro projetos abaixo. A
cobertura é avaliada no **conjunto de opções**, não exige que toda lei represente
sozinha todos os projetos:

- **Esquerda econômica:** investimento e provisão pública, seguridade forte e
  tributação progressiva.
- **Direita econômica:** livre mercado, contenção de gastos, desregulamentação e
  parcerias privadas.
- **Progressismo:** direitos civis, sustentabilidade ambiental e modernização
  social.
- **Conservadorismo:** ordem, segurança, valores tradicionais e defesa nacional.

Para cada lote, registrar uma matriz simples que indique quais opções abrem ou
fecham cada rota e por quais consequências e grupos. Não basta rotular uma opção
“de esquerda” ou “conservadora”: a direção deve aparecer nos seus efeitos e nos
interesses atendidos. Não inventar preferências de grupos sem justificativa. Um
tema que não comporte um eixo social não deve receber opções artificiais; a rota
social correspondente precisa existir em outras leis do mesmo ministério.

## 5. Piloto econômico: quatro fichas candidatas

Este primeiro lote usa políticas já representadas no catálogo como **casos de
trabalho**, para exercitar o método sem duplicar leis. As fontes abaixo ancoram a
plausibilidade geral; as direções e intensidades descritas como hipótese são
propostas de jogo. A validação aqui é de enquadramento e rastreabilidade. As fichas
ainda precisam passar por auditoria de esquema, simulação integrada e playtest
antes de serem chamadas de validadas no jogo.

### 5.1 Imposto de renda pessoal progressivo

- **Caso de mundo:** imposto de renda pessoal com faixas progressivas é prática
  existente; políticas recentes da OCDE incluem medidas para tornar o imposto
  mais progressivo. [OCDE, Tax Policy Reforms 2026](https://www.oecd.org/en/about/news/press-releases/2026/09/governments-reforming-tax-systems-to-boost-growth-but-revenue-pressures-continue-to-mount.html).
- **Questão de jogo:** quanto arrecadar de rendas altas sem pressionar demais
  renda disponível, trabalho formal e investimento?
- **Opções:** alíquota marginal máxima baixa; progressividade moderada; alta;
  muito alta com base ampla.
- **Hipóteses iniciais:** alíquota efetiva maior eleva arrecadação e reduz
  desigualdade após impostos; reduz renda disponível no topo e pode aumentar
  planejamento tributário/fuga de base. Não aplicar queda automática de
  investimento proporcional à alíquota: usar resposta menor e com atraso.
- **Nós candidatos:** `arrecadacao`, `desigualdade`, `renda_familias`, `consumo`,
  `sonegacao`, `fuga_capitais`, `inovacao`, segmentos de renda e `grupo-ricos`.
- **Origem dos parâmetros de jogo:** hipótese da IA, identificada na ficha e no
  registro do lote; calibrar na simulação. No JSON do motor, `origem` continua
  sendo o nó causal.

### 5.2 Imposto geral sobre consumo (IVA)

- **Caso de mundo:** impostos sobre valor agregado e escolhas de alíquotas,
  isenções e compensações são usados em diversos países. A OCDE documenta que a
  carga pode ser regressiva em relação à renda anual e que isenções nem sempre
  atingem melhor as famílias pobres. [OCDE, revisão de impostos indiretos](https://www.oecd.org/en/publications/oecd-tax-policy-reviews-slovenia-2018_9789264303898-en/full-report/component-8.html).
- **Questão de jogo:** arrecadação ampla e administração simples versus preço ao
  consumidor e peso proporcionalmente maior sobre famílias de baixa renda.
- **Opções:** alíquota baixa e muitas exceções; alíquota moderada com poucas
  exceções; alíquota alta e base ampla; base ampla com devolução focalizada.
- **Hipóteses iniciais:** alíquota/base maiores elevam arrecadação; elevam preços
  no curto prazo e reduzem consumo; sem compensação, pioram pobreza/desigualdade
  disponível. Devolução focalizada amortece esses efeitos, com custo fiscal.
- **Nós candidatos:** `arrecadacao`, `inflacao`, `consumo`, `desigualdade`,
  `pobreza`, `sonegacao`, `informalidade` e grupos por renda.
- **Origem dos parâmetros de jogo:** hipótese da IA, identificada na ficha e no
  registro do lote; o sentido distributivo deve
  depender de desenho e compensação, não só do rótulo “IVA”.

### 5.3 Transferência de renda focalizada

- **Caso de mundo:** o Brasil mantém programas de transferência focalizada; o
  Banco Mundial registra resultados associados a Bolsa Família e transferências
  sociais em pobreza, desigualdade e indicadores de saúde e educação.
  [Banco Mundial, resultados no Brasil](https://www.worldbank.org/en/results/2020/04/22/strengthening-conditional-cash-transfers-and-the-single-registry-in-brazil).
- **Questão de jogo:** cobertura e valor do benefício versus custo fiscal,
  capacidade de cadastro e possíveis falhas de inclusão/exclusão.
- **Opções:** inexistente; focalizada de baixo valor; focalizada adequada ao
  custo de vida; benefício amplo/universal de custo elevado.
- **Hipóteses iniciais:** benefício focalizado reduz pobreza e insegurança
  alimentar e aumenta consumo das famílias atendidas; custo recorrente aumenta
  gasto público. Efeitos em escolaridade são graduais; não presumir redução do
  trabalho adulto sem evidência ou hipótese explícita.
- **Nós candidatos:** `pobreza`, `desigualdade`, `inseguranca_alimentar`,
  `escolaridade`, `consumo`, `gasto_publico` e segmentos de baixa renda.
- **Origem dos parâmetros de jogo:** hipótese da IA, identificada na ficha e no
  registro do lote; manter custo explícito em
  % do PIB e declarar implantação/atraso.

### 5.4 Investimento público em infraestrutura

- **Caso de mundo:** investimento público pode elevar produto no curto e médio
  prazo e reduzir desigualdade, mas os efeitos variam com eficiência, dívida,
  capacidade ociosa e qualidade dos projetos. [FMI, investimento público em
  economias em desenvolvimento](https://www.elibrary.imf.org/view/journals/001/2017/217/article-A001-en.xml).
- **Questão de jogo:** ampliar infraestrutura e produtividade assumindo custo,
  demora de execução e risco de desperdício.
- **Opções:** manutenção mínima; investimento moderado e selecionado; expansão
  acelerada; **Grandes Obras Estruturantes via Estatais**.
- **Hipóteses iniciais:** gasto sobe imediatamente; infraestrutura e produtividade
  respondem com atraso; o PIB pode subir depois. Corrupção/desperdício reduz a
  conversão de gasto em ativo útil. Em recessão, a resposta de curto prazo pode
  ser maior; com dívida alta ou baixa eficiência, menor.
- **Nós candidatos:** `gasto_publico`, `resultado_fiscal`, `divida_publica`,
  `infraestrutura_transportes`, `infraestrutura_energia`, `produtividade`, `pib`,
  `corrupcao` e emprego.
- **Origem dos parâmetros de jogo:** hipótese da IA, identificada na ficha e no
  registro do lote; não copiar multiplicadores
  de estudos diretamente para a escala do motor.

## 6. Lote 2 aprovado: Energia, Transporte e Indústria

**Aprovado pelo autor para avaliação de game design em 18/out/2026.** Isso
aprova o cardápio e o foco das alavancas; não declara as hipóteses testadas no
motor nem autoriza, por si só, integração ao catálogo.

Este lote reformula alavancas já presentes no catálogo e sugere uma lei setorial
de logística. A escolha deve ter consequência tátil: contratar capacidade, abrir
crédito, construir corredor, alterar custo de insumos. Os grupos e direções são
hipóteses de jogo. Os indicadores de ranking que ainda não existem ficam marcados
como proposta, não como nós já disponíveis no motor.

### 6.1 Estatais de energia e petróleo

- **Caso de mundo:** o Brasil usa leilões de energia, inclusive leilões
  específicos para renováveis; a expansão eólica e solar exige também rede e
  flexibilidade para equilibrar o sistema. [IEA, leilões de energia renovável no
  Brasil](https://www.iea.org/policies/5750-brazil-renewable-energy-auctions);
  [IEA, Brazil 2025](https://www.iea.org/reports/brazil-2025/executive-summary);
  [Estatuto da Petrobras](https://www.presidencia.gov.br/ccivil_03/leis/l9478.htm),
  que registra a empresa de economia mista sob controle da União.
- **Dilema:** controlar petróleo e ativos estratégicos para financiar o Estado,
  ou mudar propriedade e contratação para acelerar investimento e diversificar
  geração, equilibrando preço, confiabilidade e emissões.
- **Opções e efeitos de ranking esperados (hipóteses):**
  1. **Monopólio estatal de petróleo e gás.** Apoiam: Petróleo e mineração,
     servidores. Rejeitam: Movimento ambientalista. Oferta firme e receita
     pública podem subir; emissões sobem; preço pode cair no curto prazo e risco
     de dívida/volatilidade fiscal permanece. Rankings: PIB talvez suba no curto
     prazo; energia limpa cai relativamente; emissões pioram.
  2. **Estatal reinveste royalties em eólica, hidrelétricas e armazenamento
     públicos.** Apoiam: Movimento ambientalista, trabalhadores, interior.
     Rejeitam: Petróleo e mineração, mercado financeiro se o custo subir.
     Infraestrutura e oferta limpa crescem com atraso; preço pode subir durante
     as obras e cair se rede/flexibilidade acompanhar. Rankings: energia limpa
     melhora; PIB e indústria podem melhorar depois; dívida piora no investimento.
  3. **Privatização ampla e leilões abertos a operadores privados nacionais e
     estrangeiros.** Apoiam: Mercado financeiro, empresários. Rejeitam:
     sindicatos de servidores, grupos que priorizam controle público.
     Investimento e oferta podem crescer, mas preço, acesso e confiabilidade
     dependem da regulação. Rankings: PIB pode subir se houver investimento;
     dívida pode melhorar com receitas de venda, mas não se presume efeito
     recorrente.
  4. **Fim do monopólio, com hidrelétricas estratégicas sob controle público.**
     Apoiam: Confederação da indústria, trabalhadores, grupos favoráveis à
     segurança energética. Rejeitam: mercado financeiro mais pró-privatização,
     Petróleo e mineração se perderem privilégios. Combina entrada privada com
     capacidade pública de firmar o sistema. Rankings: infraestrutura energética
     e oferta podem subir; o efeito em preço e emissões depende do despacho.
- **Rede atual:** `infraestrutura_energia`, `oferta_energia`, `preco_energia`,
  `emissoes`, `pib`, `divida_publica`. A participação limpa/fóssil da geração é
  uma métrica comparável desejável, ainda ausente.

### 6.2 Ferrovias de carga e terminais portuários

- **Caso de mundo:** projetos ferroviários podem reduzir custo de frete,
  emissões e melhorar a competitividade logística, com resultados dependentes do
  corredor e da operação. [Banco Mundial, The Power of Rail Investment](https://www.worldbank.org/en/results/2025/08/28/transforming-logistics-the-power-of-rail-investment).
- **Dilema:** pagar por corredores ferroviários de longa maturação ou priorizar
  rodovias e obras mais rápidas, com custos operacionais e ambientais diferentes.
- **Opções e efeitos de ranking esperados (hipóteses):**
  1. **Manter carga principalmente em rodovias; recuperar trechos críticos.**
     Apoiam: Caminhoneiros autônomos, grupos do interior. Rejeitam:
     ambientalistas, produtores exportadores com gargalos logísticos. Resultado
     rápido e investimento inicial menor; custo e emissões do frete continuam
     altos. Rankings: PIB pode ter ganho curto; emissões pioram relativamente.
  2. **Construir corredores ferroviários de carga até portos.** Apoiam:
     Confederação da indústria, Entidades do agronegócio, trabalhadores.
     Rejeitam: grupos deslocados por desapropriação, mercado financeiro se o
     custo estourar. Infraestrutura e exportações melhoram com atraso; emprego
     de obra sobe temporariamente. Rankings: PIB e produção podem subir depois;
     emissões por tonelada transportada tendem a cair.
  3. **Concessões privadas integradas, com metas de tarifa e acesso aberto.**
     Apoiam: empresários, mercado financeiro, exportadores. Rejeitam:
     sindicatos se houver perda de emprego/controle e usuários se a tarifa for
     alta. Pode reduzir pressão fiscal e acelerar obra, condicionado à
     fiscalização. Rankings: infraestrutura e exportações sobem se cumprir metas;
     efeito fiscal é de mão dupla.
  4. **Rede pública de carga, com terminais intermodais e prioridade para
     regiões isoladas.** Apoiam: Interior, trabalhadores, agricultura familiar.
     Rejeitam: mercado financeiro se houver subsídio sem retorno; caminhoneiros
     em rotas concorrentes. Acesso regional melhora, mas requer gasto e gestão.
     Rankings: emprego e PIB regional podem subir; dívida pode piorar no curto
     prazo.
- **Rede atual:** `infraestrutura_transportes`, `exportacoes`, `pib`,
  `produtividade`, `emissoes`. Atenção: o índice atual de infraestrutura de
  transportes mede qualidade da malha rodoviária, não ferrovias; criar indicador
  ferroviário antes de atribuir essa melhora a ele.

### 6.3 Crédito produtivo para indústria e inovação

- **Caso de mundo:** bancos de desenvolvimento e financiamento misto são usados
  para mobilizar crédito em projetos produtivos; os efeitos variam por desenho,
  seleção e governança. [Banco Mundial, How Can Development Banks Boost Firms’
  Productivity?](https://openknowledge.worldbank.org/bitstream/handle/10986/13265/9780821398791.pdf);
  [Banco Mundial, blended concessional finance](https://ppp.worldbank.org/library/annual-reports-dfi-working-group-blended-concessional-finance-private-sector-projects).
- **Dilema:** reduzir a falta de crédito de longo prazo para fábricas e novas
  tecnologias sem socializar perdas ou sustentar empresas improdutivas.
- **Opções e efeitos de ranking esperados (hipóteses):**
  1. **Só crédito privado a preço de mercado.** Apoiam: Mercado financeiro.
     Rejeitam: Confederação da indústria, pequenos negócios. Custo fiscal baixo;
     investimento depende das condições de crédito. Rankings: dívida preservada;
     manufatura pode ficar atrás de países com financiamento produtivo acessível.
  2. **Banco público de segundo piso, emprestando por bancos privados.** Apoiam:
     Mercado financeiro, pequenos negócios. Rejeitam: defensores de crédito
     dirigido. Expande acesso com risco partilhado; adicionalidade é incerta.
     Rankings: investimento e produtividade sobem pouco se financiar projetos
     que não ocorreriam sem a linha.
  3. **Crédito subsidiado a fábricas, máquinas e fornecedores nacionais, com
     metas de produtividade e exportação.** Apoiam: Confederação da indústria,
     trabalhadores. Rejeitam: Mercado financeiro, contribuintes se houver
     inadimplência. Investimento/manufatura sobem com atraso; gasto ou dívida
     contingente sobem.
  4. **Crédito de longo prazo para máquinas limpas, baterias, rede e P&D, aberto
     a empresas públicas e privadas com metas verificáveis.** Apoiam:
     ambientalistas, progressistas, indústria inovadora. Rejeitam: setores
     excluídos, mercado financeiro se subsídio e risco forem altos. Inovação e
     energia limpa sobem no longo prazo; custo pode elevar dívida e tarifas.
- **Rede atual:** `investimento`, `produtividade`, `inovacao`, `exportacoes`,
  `pib`, `gasto_publico`, `divida_publica`, `preco_energia`. O ranking de
  produção manufatureira exigirá um índice setorial próprio.

### 6.4 Tarifas de importação para indústria nascente

- **Caso de mundo:** tarifas podem proteger produtores finais, mas também
  encarecem insumos importados usados por fabricantes locais e exportadores.
  [OMC, tarifas sobre insumos intermediários e custo de produção](https://www.wto.org/english/res_e/reser_e/ersd201422_e.pdf).
- **Dilema:** dar tempo e escala a produtores locais sem encarecer máquinas e
  componentes de que a própria indústria precisa.
- **Opções e efeitos de ranking esperados (hipóteses):**
  1. **Tarifa baixa em máquinas e insumos; importação aberta.** Apoiam:
     Comércio e serviços, Confederação da indústria exportadora. Rejeitam:
     produtores protegidos. Inflação cai e produtividade pode subir; algumas
     fábricas locais enfrentam concorrência maior. Rankings: consumo e
     competitividade de exportadores melhoram; produção protegida pode cair.
  2. **Proteção temporária a bens finais, com prazo e meta de exportação.**
     Apoiam: Confederação da indústria, trabalhadores. Rejeitam: comércio,
     consumidores e exportadores que usam insumos importados. Manufatura pode
     ganhar escala se atingir produtividade; inflação sobe no curto prazo.
  3. **Tarifas altas e amplas para substituir importações.** Apoiam: setores
     protegidos, grupos que priorizam soberania produtiva. Rejeitam: Comércio e
     serviços, classe média, pequenos negócios. Produção local de alguns bens
     pode subir, enquanto custo de máquinas/insumos, inflação e retaliação
     comercial também sobem.
  4. **Tarifa diferenciada: insumos e máquinas baratos, proteção decrescente a
     bens finais.** Apoiam: indústria, exportadores, consumidores de bens de
     capital. Rejeitam: setores que dependem de proteção permanente. Busca
     combinar aprendizagem com modernização; efeito industrial é condicional a
     investimento, crédito e infraestrutura.
- **Rede atual:** `importacoes`, `inflacao`, `produtividade`, `pib`, `exportacoes`,
  `desemprego`, `arrecadacao`, `desigualdade`.

### 6.5 Como ler os rankings e checar cobertura

Os efeitos acima são sinais qualitativos esperados, não resultados já simulados.
O motor atual tem alguns nós relevantes, mas ainda não entrega todos os rankings
propostos:

| Métrica de competição proposta | Situação atual no SisGov |
| --- | --- |
| PIB total | `pib` existe; falta comparar com série mundial coerente |
| PIB per capita | não há indicador comparável completo no catálogo |
| Fome e pobreza extrema | há `inseguranca_alimentar` e `pobreza`; faltam série mundial consistente e recorte de pobreza extrema |
| Produção manufatureira | falta índice de valor adicionado/emprego manufatureiro comparável |
| Energia limpa versus fóssil | há `emissoes`, `oferta_energia` e `preco_energia`; falta participação da geração por fonte |
| Inflação e dívida | há `inflacao` e `divida_publica`; falta base mundial para ranking e metas de sustentabilidade |

Rotas políticas neste lote: esquerda econômica via crédito produtivo e corredores
públicos; direita econômica via abertura, concessão e crédito de mercado;
progressismo via energia limpa e crédito para inovação; conservadorismo via
segurança energética, soberania de insumos e continuidade de serviços. São rotas
possíveis por combinação, sujeitas a revisão dos grupos e efeitos.

Os nomes e os elos propostos são alavancas de jogo, não autorização para alterar o
motor ou duplicar fichas. A implementação deve reutilizar e tornar mais
específicas as leis existentes, separando mecanismos quando uma lei genérica
misturar resultados diferentes.

## 7. Lote 3 aprovado: Trabalho e Emprego

**Aprovado pelo autor para avaliação de game design em 18/out/2026.** O
conteúdo abaixo registra o cardápio aprovado para design; suas hipóteses não
foram simuladas ou testadas em playtest e ainda não estão autorizadas para
integração ao catálogo.

As fichas e o conteúdo vigente já distinguem valor do salário mínimo, fórmula de
reajuste, legislação trabalhista, terceirização, negociação coletiva e ensino
técnico. Este lote reúne os temas pedidos em quatro decisões de jogo. Os apoios,
rejeições e sinais de efeito são hipóteses para revisão; fontes sustentam a
existência das políticas, não os coeficientes.

### 7.1 Piso nacional de remuneração

- **Caso de mundo:** o Brasil tem política legal de salário mínimo com correção
  pela inflação e ganho real atrelado ao PIB em período recente. Há países sem
  piso legal nacional em que acordos coletivos cobrem pisos de fato; o nível e o
  contexto importam para emprego e renda. [Lei brasileira 14.663/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm);
  [OCDE, salário mínimo e proteção ao emprego](https://www.oecd.org/en/topics/employment-protection-and-minimum-wages.html);
  [OIT, efeitos de pisos mínimos](https://www.ilo.org/resource/72-effects-wages).
- **Dilema:** elevar o piso e a renda de quem recebe menos sem tornar a contratação
  formal inviável para trabalhadores e empresas de baixa produtividade; lembrar
  que o piso também pode elevar benefícios indexados e gasto previdenciário.
- **Opções:**
  1. **Sem piso legal nacional; piso vem da negociação coletiva.** Apoiam:
     mercado financeiro, empresários. Rejeitam: trabalhadores com carteira,
     centrais sindicais. Emprego: custo de entrada menor, mas proteção e renda
     podem variar muito; informalidade: pode cair para alguns contratos ou subir
     onde não houver cobertura; produtividade: dispersa; contas públicas: gasto
     com benefícios indexados ao piso cai, mas a arrecadação contributiva pode
     perder base.
  2. **Piso baixo, corrigido apenas pela inflação.** Apoiam: pequenos negócios,
     empresários. Rejeitam: centrais sindicais, progressistas. Emprego: menor
     pressão sobre a contratação; informalidade: pouca mudança esperada;
     produtividade: sem impulso forte; contas públicas: previsibilidade maior,
     com reajuste de benefícios acompanhando o piso.
  3. **Piso intermediário, inflação mais parcela de produtividade.** Apoiam:
     trabalhadores com carteira, empresários que valorizam previsibilidade.
     Rejeitam: grupos que preferem piso mais alto ou congelado. Emprego: efeito
     moderado e dependente da produtividade; informalidade: risco limitado se o
     ganho acompanhar a capacidade de pagamento; produtividade: incentivo à
     qualificação e modernização; contas públicas: benefícios sobem junto com a
     regra e precisam caber na trajetória fiscal.
  4. **Piso alto com meta gradual em relação ao salário mediano.** Apoiam:
     trabalhadores com carteira, centrais sindicais, progressistas. Rejeitam:
     pequenos negócios, empresários. Emprego: pode elevar renda e consumo, mas
     pressionar vagas de baixa produtividade; informalidade: risco maior se
     fiscalização e produtividade não acompanharem; produtividade: possível
     incentivo à modernização, sem garantia; contas públicas: maior despesa com
     benefícios indexados e possíveis ganhos de arrecadação.

### 7.2 Regime de contratação e flexibilidade

- **Caso de mundo:** o Brasil tem regimes legais de contrato por prazo
  indeterminado, temporário, intermitente, trabalho autônomo e prestação de
  serviços terceirizados. A regulação de proteção afeta fluxos de contratação,
  demissão e qualidade do emprego. [Lei brasileira 13.429/2017](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13429.htm);
  [Lei brasileira 13.467/2017](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13467.htm);
  [OCDE, tendências de proteção ao emprego](https://www.oecd.org/en/publications/oecd-employment-outlook-2026_7e710f54-en/full-report/component-10.html).
- **Dilema:** permitir que empresas ajustem equipes e adotem novos modelos de
  produção sem tornar instável a renda, a proteção social e a capacidade de
  qualificação dos trabalhadores.
- **Opções:**
  1. **Contrato padrão protegido; exceções temporárias estritas.** Apoiam:
     trabalhadores com carteira, centrais sindicais. Rejeitam: empresários que
     precisam ajustar equipes rapidamente. Emprego: vínculos mais estáveis,
     contratação pode ser mais cautelosa; informalidade: pode subir se o custo ou
     a fiscalização forem desproporcionais; produtividade: mais treinamento no
     posto e retenção; contas públicas: contribuições mais previsíveis, com maior
     custo de seguro e proteção.
  2. **Contrato padrão com flexibilização negociada por setor e empresa.**
     Apoiam: empresários, trabalhadores cobertos por negociação representativa.
     Rejeitam: pequenos negócios sem poder de negociação e grupos que preferem
     regra uniforme. Emprego: ajustes com salvaguardas; informalidade: tende a
     cair se o contrato ficar simples; produtividade: pode subir com adaptação
     de jornada e treinamento; contas públicas: impacto intermediário.
  3. **Vários contratos formais flexíveis, com direitos portáteis e contribuição
     proporcional.** Apoiam: jovens, trabalhadores por projeto e empresários.
     Rejeitam: centrais sindicais se a proteção for menor ou fragmentada.
     Emprego: entrada e transição entre contratos podem ficar mais fáceis;
     informalidade: pode cair se a cobertura for simples e universal;
     produtividade: aumenta a mobilidade, mas vínculos curtos podem reduzir
     treinamento; contas públicas: arrecadação depende de contribuição efetiva
     em cada contrato.
  4. **Flexibilidade ampla para temporários, intermitentes, autônomos e
     terceirização, com proteção básica.** Apoiam: empresários e mercado
     financeiro. Rejeitam: trabalhadores com carteira, centrais sindicais.
     Emprego: pode ampliar vagas de entrada e reduzir custo de ajuste;
     informalidade: pode cair se relações autônomas forem genuínas, ou subir se
     substituírem emprego formal; produtividade: depende de treinamento e
     previsibilidade; contas públicas: custo imediato menor, com risco de menor
     arrecadação contributiva e maior demanda por proteção pública.

### 7.3 Negociação coletiva e sindicatos

- **Caso de mundo:** acordos coletivos podem ser negociados na empresa, no setor
  ou em nível nacional e podem regular salários, jornada, treinamento e segurança.
  A OCDE encontra resultados diferentes conforme cobertura, coordenação e
  flexibilidade do sistema. No Brasil, a CLT prevê matérias negociáveis e limites
  legais. [OCDE, Employment Outlook 2018](https://www.oecd.org/en/publications/oecd-employment-outlook-2018_empl_outlook-2018-en/full-report/component-7.html);
  [Lei brasileira 13.467/2017](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13467.htm).
- **Dilema:** regras uniformes protegem condições mínimas; negociação permite
  adaptar jornada, remuneração e formação à realidade de cada local de trabalho.
- **Opções:**
  1. **Regras uniformes definidas em lei; acordos só podem melhorar condições.**
     Apoiam: trabalhadores com carteira, centrais sindicais. Rejeitam:
     empresários, mercado financeiro. Emprego: previsibilidade alta, adaptação
     menor; informalidade: risco se regras forem difíceis de cumprir;
     produtividade: favorece padrões comuns, mas pode travar arranjos locais;
     contas públicas: custo indireto por salários e benefícios, sem gasto direto
     automático.
  2. **Acordo setorial define o piso; empresas negociam melhorias e ajustes
     limitados.** Apoiam: sindicatos, trabalhadores com carteira, empresários
     de setores organizados. Rejeitam: empresas que não querem cobertura setorial
     ou sindicatos menores. Emprego: coordenação pode sustentar emprego e
     cobertura; informalidade: pode cair se houver extensão e fiscalização;
     produtividade: combina padrões setoriais com adaptação; contas públicas:
     efeitos indiretos moderados.
  3. **Acordo por empresa prevalece em temas definidos, com representação dos
     empregados.** Apoiam: empresários, trabalhadores de empresas com alta
     produtividade. Rejeitam: centrais sindicais e trabalhadores de empresas
     menores. Emprego: ajustes podem preservar postos em choques, mas cobertura
     fica desigual; informalidade: depende da facilidade de formalizar o acordo;
     produtividade: pode alinhar salário e resultado local; contas públicas:
     custo direto baixo, arrecadação varia com salários e emprego.
  4. **Negociação coordenada nacional com espaço para acordos setoriais e
     empresariais.** Apoiam: trabalhadores, sindicatos representativos,
     empresários que valorizam previsibilidade. Rejeitam: defensores de acordos
     sem coordenação ou de regra exclusivamente legal. Emprego: coordenação pode
     amortecer choques; informalidade: pode cair com cobertura ampla; produtividade:
     depende de permitir adaptação no nível da empresa; contas públicas: efeitos
     indiretos através de emprego e salários.

### 7.4 Capacitação profissional e ensino técnico

- **Limite institucional:** o catálogo atual atribui ensino técnico à área de
  Educação. Neste lote, a proposta é tratar a capacitação para o trabalho como
  agenda coordenada entre Trabalho e Educação; não mover a ficha atual sem rever
  ministério e competência. A LDB prevê formação técnica integrada, concomitante
  ou subsequente ao ensino médio, e a OIT descreve aprendizagem profissional como
  caminho para empregabilidade e produtividade. [LDB, arts. 36-A a 42](https://www.planalto.gov.br/ccivil_03/leis/l9394compilado.htm);
  [OIT, aprendizagem profissional](https://www.ilo.org/topics-and-sectors/apprenticeships);
  [OIT, educação técnica e profissional](https://www.ilo.org/topics-and-sectors/skills-and-lifelong-learning/technical-and-vocational-education-and-training).
- **Dilema:** treinar para vagas concretas que a indústria precisa hoje sem
  reduzir a educação a necessidades de empregadores atuais nem deixar adultos e
  jovens sem acesso a uma carreira em mudança.
- **Opções:**
  1. **Formação geral como base; qualificação técnica fica principalmente com
     empregadores e instituições privadas.** Apoiam: mercado financeiro,
     empresários que valorizam autonomia de contratação. Rejeitam: trabalhadores
     de baixa renda, interior, indústria com falta de técnicos. Emprego: pode
     atender empresas com recursos; informalidade: pouco efeito amplo;
     produtividade: alta onde houver treinamento, desigual entre empresas;
     contas públicas: gasto baixo.
  2. **Rede pública de escolas técnicas com vagas amplas e cursos ligados a
     demandas regionais.** Apoiam: trabalhadores, jovens, interior, sindicatos
     de professores. Rejeitam: mercado financeiro se o custo crescer; empresas
     se cursos não refletirem suas vagas. Emprego: empregabilidade cresce com
     atraso; informalidade: pode cair com certificação; produtividade: aumenta
     pela oferta de técnicos; contas públicas: gasto recorrente em escolas,
     laboratórios e docentes.
  3. **Aprendizagem remunerada em empresas, combinada com formação técnica e
     certificação portátil.** Apoiam: indústria, pequenos negócios, jovens.
     Rejeitam: empresas que não querem custo de supervisão e sindicatos se a
     aprendizagem substituir vaga regular. Emprego: porta de entrada e
     experiência aumentam; informalidade: cai se contrato e direitos forem
     registrados; produtividade: sobe com treinamento prático; contas públicas:
     custo dividido entre empresas e Estado, com subsídio possível.
  4. **Contas individuais de formação contínua, com crédito público para áreas
     técnicas, digitais e de transição energética.** Apoiam: trabalhadores em
     mudança de carreira, progressistas, setores tecnológicos. Rejeitam:
     contribuintes preocupados com subsídios e empregadores que preferem formar
     só sua própria força de trabalho. Emprego: facilita recolocação;
     informalidade: pode cair se cursos e certificações forem acessíveis;
     produtividade: melhora se cursos forem relevantes e de qualidade; contas
     públicas: gasto limitado por crédito e critérios, mas exige controle de
     qualidade e prestação de contas.

### 7.5 Cobertura política do lote

| Projeto | Rotas principais no lote |
| --- | --- |
| Esquerda econômica | Piso mediano/alto; proteção contratual; negociação setorial/nacional; rede pública técnica |
| Direita econômica | Piso negociado ou moderado; contratos flexíveis; negociação por empresa; formação empresarial/privada |
| Progressismo | Piso contra desigualdade; direitos portáteis e igualdade de acesso; acordos com representação; formação acessível para novas tecnologias e transição energética |
| Conservadorismo | Regras previsíveis de reajuste; aprendizagem remunerada e responsabilidade compartilhada; negociação coordenada para estabilidade; formação prática e valorização de ofícios |

As rotas são combinações possíveis, não rótulos fixos de grupos. O lote precisa
mostrar trade-offs reais: piso alto com custo fiscal e laboral; flexibilidade com
risco de precarização; coordenação coletiva com menor ajuste local; capacitação
pública com custo e atraso até o ganho de produtividade.

## 8. Lote 4: Previdência e Assistência Social

Este lote reúne quatro alavancas já presentes no catálogo. O foco é tornar
visíveis os dilemas entre proteção na velhice, sustentabilidade fiscal,
contributividade e cobertura de pessoas com trajetórias de trabalho diferentes.
Os fatos de mundo abaixo ancoram a existência das políticas; impactos e
preferências dos grupos são hipóteses de jogo, não estimativas atuariais.

### 8.1 Modelo do sistema previdenciário

- **Caso de mundo:** o Brasil tem regime público contributivo, regimes próprios
  e previdência complementar; a EC 103/2019 alterou regras do sistema. Modelos
  de repartição e capitalização têm riscos e custos de transição distintos.
  [EC 103/2019](https://www.presidencia.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm);
  [Banco Mundial, custos de transição para capitalização](https://documents1.worldbank.org/curated/en/964361468340745524/pdf/333900rev0PRPNoteTransition.pdf).
- **Dilema:** repartir risco e financiar benefícios coletivamente ou vincular
  mais a aposentadoria às contribuições acumuladas de cada pessoa.
- **Opções (hipóteses):**
  1. **Repartição pública solidária, com benefício básico e contribuição
     progressiva.** Apoiam: centrais sindicais, trabalhadores, aposentados,
     progressistas. Rejeitam: mercado financeiro e contribuintes que priorizam
     menor encargo. Contas: contribuição e gasto recorrente altos; dívida depende
     de emprego formal, demografia e regras. Pobreza idosa: tende a cair com
     cobertura ampla. Gerações: aposentados atuais e trabalhadores de baixa renda
     ganham segurança; jovens podem rejeitar contribuições crescentes.
  2. **Sistema misto: pilar público básico mais poupança complementar
     capitalizada.** Apoiam: classe média, empresários, parte dos trabalhadores.
     Rejeitam: centrais sindicais se o pilar público for reduzido. Contas:
     gasto público pode desacelerar no longo prazo, mas a transição custa e a
     dívida pode subir antes de cair. Pobreza idosa: queda se o piso público for
     suficiente; risco para carreiras interrompidas. Gerações: diversifica fontes,
     mas transfere mais risco de mercado aos jovens.
  3. **Capitalização individual obrigatória, com contribuição definida e
     salvaguardas mínimas.** Apoiam: mercado financeiro e defensores de escolha
     individual. Rejeitam: aposentados, sindicatos e grupos sem capacidade
     contributiva estável. Contas: custo de transição alto por décadas; dívida
     pode aumentar ao financiar benefícios já prometidos. Pobreza idosa: pode
     subir sem piso solidário e contribuições contínuas. Gerações: jovens podem
     acumular ativos, mas suportam risco de mercado e lacunas de contribuição.
  4. **Pilar público universal básico e complemento voluntário privado.**
     Apoiam: progressistas, associações de aposentados e grupos de inclusão.
     Rejeitam: defensores de benefício estritamente contributivo e contribuintes
     de alta renda. Contas: gasto tributário recorrente maior; dívida pressionada
     se não houver receita estável. Pobreza idosa: tende a cair; benefício pode
     ser insuficiente para manter padrão de vida. Gerações: proteção mínima
     previsível, financiada também por contribuintes que não receberão benefício
     equivalente.

### 8.2 Critérios de aposentadoria e idade mínima

- **Caso de mundo:** no RGPS brasileiro há idade mínima e regras de transição
  após a EC 103/2019; os requisitos variam por modalidade e trajetória. Não
  tratar a alternativa de aposentadoria apenas por tempo como regra vigente
  geral. [INSS, regras de aposentadoria](https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/regras-de-aposentadorias);
  [EC 103/2019](https://www.presidencia.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm).
- **Dilema:** equilibrar tempo de contribuição e longevidade do sistema com
  diferenças de saúde, expectativa de vida e condições de trabalho.
- **Opções (hipóteses):**
  1. **Acesso flexível por tempo de contribuição, com redutor atuarial.**
     Apoiam: trabalhadores de carreiras longas e categorias de desgaste elevado.
     Rejeitam: mercado financeiro e grupos preocupados com equilíbrio fiscal.
     Contas/dívida: benefício começa antes e pressiona gasto; redutor amortece,
     sem eliminar custo. Pobreza idosa: pode cair para quem contribuiu cedo;
     informais ficam de fora. Gerações: alivia trabalhadores mais velhos, mas
     transfere custo aos contribuintes futuros.
  2. **Idade mínima moderada, com transição longa e exceções por atividade.**
     Apoiam: trabalhadores, progressistas e associações de aposentados se as
     exceções forem acessíveis. Rejeitam: defensores de regra uniforme mais
     rígida. Contas/dívida: gasto cresce mais lentamente, com custo de transição.
     Pobreza idosa: depende do acesso a benefício assistencial durante a espera.
     Gerações: mantém previsibilidade e reduz choque entre coortes.
  3. **Idade mínima alta e uniforme, com exigência contributiva estrita.**
     Apoiam: mercado financeiro e setores que priorizam contenção de despesas.
     Rejeitam: trabalhadores braçais, pessoas com saúde frágil e progressistas.
     Contas/dívida: gasto tende a cair e contribuições podem durar mais. Pobreza
     idosa: risco de alta entre quem não consegue trabalhar até a idade. Gerações:
     jovens podem ver maior equilíbrio, mas trabalhadores de baixa renda arcam
     com maior custo físico.
  4. **Idade mínima com gatilho gradual ligado à longevidade e proteção por
     ocupação/desgaste.** Apoiam: reformistas fiscais, progressistas e grupos
     favoráveis a regras previsíveis. Rejeitam: trabalhadores expostos a aumento
     automático e quem desconfia dos dados ou do gatilho. Contas/dívida: ajustam-se
     gradualmente; não há economia automática se emprego e saúde não permitirem
     trabalhar mais. Pobreza idosa: protegida se exceções e assistência forem
     efetivas. Gerações: regra previsível, mas cada coorte pode enfrentar idade
     maior.

### 8.3 Previdência rural e seguridade especial

- **Caso de mundo:** a legislação brasileira reconhece segurado especial e
  formas próprias de comprovação e contribuição para trabalhadores rurais,
  incluindo economia familiar. [Lei 8.213/1991](https://planalto.gov.br/ccivil_03/leis/l8213compilado.htm).
- **Dilema:** garantir proteção a quem trabalha sem salário formal estável sem
  criar barreiras de acesso nem abrir espaço excessivo para fraude ou subsídio
  sem financiamento.
- **Opções (hipóteses):**
  1. **Cobertura rural solidária, com benefício básico e comprovação simplificada
     da atividade.** Apoiam: agricultura familiar, sindicatos rurais, grupos do
     interior e progressistas. Rejeitam: contribuintes urbanos preocupados com
     subsídio sem fonte e defensores de contributividade estrita. Contas/dívida:
     gasto público maior e recorrente. Pobreza idosa rural: tende a cair.
     Gerações: protege famílias rurais atuais e futuras, com custo partilhado
     nacionalmente.
  2. **Contribuição rural subsidiada e proporcional à produção/renda, com piso
     garantido.** Apoiam: agricultura familiar, trabalhadores rurais e gestores
     fiscais moderados. Rejeitam: grupos que consideram a contribuição uma
     barreira de acesso. Contas/dívida: gasto menor que benefício amplo se a
     arrecadação funcionar; subsídio permanece. Pobreza idosa: cai, mas pode
     persistir para renda irregular. Gerações: aproxima contribuição e benefício,
     exigindo cadastro simples ao longo da vida.
  3. **Contribuição individual obrigatória semelhante à urbana, com subsídio
     focalizado.** Apoiam: defensores de regras uniformes e parte dos contribuintes.
     Rejeitam: agricultores familiares, sindicatos rurais e progressistas.
     Contas/dívida: reduz transferências se houver formalização e arrecadação;
     implementação e fiscalização custam. Pobreza idosa: risco de aumento para
     quem não consegue contribuir regularmente. Gerações: aumenta vínculo
     contributivo, mas penaliza ocupações sazonais.
  4. **Proteção rural financiada por contribuição sobre comercialização, com
     benefício proporcional e piso assistencial.** Apoiam: agricultores
     familiares, cooperativas e conservadores ligados ao interior. Rejeitam:
     grandes compradores e produtores que temem encargo sobre venda. Contas/dívida:
     receita acompanha produção, mas oscila com preços e safras. Pobreza idosa:
     cai quando há comercialização registrada; fica protegida pelo piso nos
     demais casos. Gerações: preserva vínculo com atividade rural e divide risco
     da volatilidade.

### 8.4 BPC e amparo a idosos e pessoas com deficiência

- **Caso de mundo:** o BPC brasileiro é benefício assistencial não contributivo
  para idosos e pessoas com deficiência em situação de baixa renda, sujeito a
  critérios legais e avaliação. [MDS, BPC](https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/beneficios-assistenciais/beneficio-assistencial-ao-idoso-e-a-pessoa-com-deficiencia-bpc);
  [Lei 8.742/1993 (LOAS)](https://www.planalto.gov.br/ccivil_03/leis/l8742.htm).
- **Dilema:** focalizar recursos em pobreza extrema ou ampliar cobertura para
  vulnerabilidade e custos de cuidado, com gasto previsível e acesso simples.
- **Opções (hipóteses):**
  1. **Critério estrito de renda e revisão frequente, com benefício só à pobreza
     extrema.** Apoiam: defensores de focalização e contenção de despesa.
     Rejeitam: organizações de pessoas com deficiência, progressistas e famílias
     com renda instável. Contas/dívida: gasto mais contido e custo administrativo
     de revisão. Pobreza idosa: cai entre elegíveis, mas exclusões podem deixar
     idosos sem proteção. Gerações: protege o orçamento futuro, com risco de
     insegurança para cuidadores e famílias.
  2. **Focalização por renda com faixa de transição e benefício gradual.**
     Apoiam: grupos de assistência, progressistas e gestores preocupados com
     barreiras abruptas. Rejeitam: quem quer focalização mais estreita ou benefício
     universal. Contas/dívida: gasto intermediário e mais previsível; cadastro
     requer capacidade estatal. Pobreza idosa: tende a cair e reduz penalidade
     por pequena variação de renda. Gerações: melhora segurança familiar sem
     universalizar o gasto.
  3. **Cobertura ampliada para vulnerabilidade, deficiência e necessidade de
     cuidado, com avaliação multidimensional.** Apoiam: organizações de pessoas
     com deficiência, cuidadores, progressistas e parte dos conservadores
     comunitários. Rejeitam: defensores de focalização estrita e contribuintes
     preocupados com expansão permanente. Contas/dívida: gasto cresce; avaliação
     e cuidado exigem equipe e serviços. Pobreza idosa: tende a cair mais, inclusive
     onde renda não captura dependência. Gerações: melhora segurança de pessoas
     cuidadoras, mas exige receita intergeracional estável.
  4. **Piso de renda universal na velhice, com complemento focalizado por
     deficiência e cuidado.** Apoiam: universalistas, associações de aposentados
     e progressistas. Rejeitam: defensores de benefícios apenas contributivos e
     grupos de ajuste fiscal. Contas/dívida: maior despesa bruta, compensável
     apenas com fonte tributária explícita e desenho de benefícios. Pobreza idosa:
     tende a cair amplamente. Gerações: previsibilidade e cobertura simples, com
     custo tributário distribuído por toda a população.

### 8.5 Cobertura política e limites de medição

| Projeto | Rotas principais no lote |
| --- | --- |
| Esquerda econômica | Repartição solidária; transições protetivas; cobertura rural ampla; BPC ampliado ou piso universal, com receita explícita |
| Direita econômica | Pilar misto/capitalizado; gatilho demográfico; contribuição rural vinculada à produção; focalização estrita e controle de despesas |
| Progressismo | Piso universal e acessível; exceções para desigualdade de saúde e trabalho; reconhecimento de trabalho rural; avaliação de deficiência e cuidado |
| Conservadorismo | Segurança para aposentados atuais; transições previsíveis; proteção à família rural e ao interior; amparo focalizado com governança e responsabilidade fiscal |

O catálogo já possui `deficit_previdenciario`, `gasto_publico`, `divida_publica`,
`pobreza`, `grupo_aposentados` e `grupo_jovens`. Não há indicador específico de
pobreza entre idosos nem um índice de satisfação por geração; portanto, os efeitos
de pobreza na velhice são aproximações via pobreza/cobertura e os efeitos
geracionais devem ser lidos como resposta qualitativa dos grupos existentes. Uma
implementação futura que queira comparar coortes precisa propor novos indicadores
e fontes antes de conectá-los ao motor.

Todas as direções descritas neste lote são hipóteses de jogo, não resultados de
simulação. Na consolidação do catálogo, `sistema-previdenciario`,
`idade-minima-aposentadoria` e `previdencia-rural` foram mantidas como fichas
canônicas; as três fichas sobrepostas foram retiradas e suas referências ativas
foram migradas.

## 9. Critério de validação dos lotes

O lote só recebe o rótulo **validado no jogo** depois de:

- cada política estar ligada a fonte e jurisdição reais;
- cada hipótese estar identificada e usar unidades e nós existentes;
- a matriz do lote demonstrar rotas viáveis para os quatro projetos políticos
  através das leis do ministério;
- as fichas passarem pelo verificador e não terem referências órfãs;
- a simulação isolada e combinada não produzir explosão, colapso ou dominância
  automática em horizonte de mandato;
- playtest confirmar que as opções são compreensíveis e oferecem escolhas com
  custos e benefícios distintos.

Até isso acontecer, este documento registra propostas de desenho baseadas em
fontes. O autor aprovou a consolidação das sobreposições identificadas: a ficha
`ferrovias-e-terminais-portuarios` foi criada separada de
`investimento-em-infraestrutura`, e o cashback passou a ser uma opção de
`imposto-sobre-consumo`. As opções de crédito, tarifas, negociação coletiva,
ensino técnico e BPC foram revistas nas fichas existentes. O imposto de renda
continua como controle contínuo no motor; suas quatro alternativas de desenho
permanecem propostas até que o modelo represente diferenças de base e
progressividade além da alíquota marginal. A integração e a checagem estrutural
dessas fichas não substituem o playtest nem validam equilíbrio e diversão.

## 10. Registro de integração: lote 5, Educação e Ciência

Este registro guarda as decisões do lote para que revisões futuras partam dos
arquivos do jogo. A lei `piso-de-gasto-em-educacao` é a regra constitucional;
`piso-educacao` é a verba executada como porcentagem da receita agregada. A
segunda lê o mínimo da opção vigente da primeira. O Brasil inicia em 17,51% da
receita agregada. Os pisos de 22% e 31,5% nas opções mais ambiciosas são
**hipóteses de jogo**, não conversões literais dos percentuais constitucionais
por ente federativo. O gasto é lançado pela alavanca executada uma só vez.

Em `acesso-ao-ensino-superior`, as quatro rotas são mensalidade integral,
cobrança segundo renda com isenção, gratuidade com seleção e gratuidade com
expansão. `vagas-publicas-no-ensino-superior` e `credito-estudantil` têm travas
`requer` por opção. A bolsa para faculdade privada continua possível com
universidade pública gratuita; empréstimos amplos para mensalidades exigem uma
opção em que famílias pagam. Se a regra superior mudar, a filha migra para a
alternativa permitida mais próxima.

O elo de endividamento familiar da universidade foi ajustado para diminuir
quando a gratuidade pública aumenta, mantendo o valor da opção brasileira de
referência. O coeficiente é hipótese de jogo.

`piso-salarial-professores` mantém seus quatro níveis e efeitos na rede; as
opções agora distinguem autonomia local, piso nacional, adicional a escolas
vulneráveis e carreira de tempo integral. Em `bolsas-de-pos-graduacao`, a quarta
opção usa contrapartida privada. O custo público estimado de cada opção entra
em `gasto_publico`: 0; 0,01; 0,025; 0,06% do PIB. Esses coeficientes têm
**origem: hipótese** e devem ser calibrados com simulação e playtest. A regra
real brasileira de vinculação da educação tem base na [Constituição, art. 212](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm);
o piso nacional docente tem base na [Lei 11.738/2008](https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11738.htm).

Integração estrutural e testes não autorizam chamar o lote de equilibrado ou
divertido; isso depende do critério de validação acima.
