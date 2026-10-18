# Bolhas de leis, Tesouro e empresas públicas: regras e estudo de caso

> **Status: RASCUNHO DE PESQUISA (17/out/2026).** Estudo de design para organizar leis em bolhas jogáveis e ligar as decisões ao Tesouro, às empresas e à infraestrutura. Não aprova regras nem altera os chamados existentes. **Assinatura: gpto-revisar.**

## 1. Pergunta

Como organizar um mapa de leis em bolhas consistentes e jogáveis, ligar essas bolhas ao Tesouro e representar receitas públicas que não vêm de impostos, como dividendos, venda de participações e outorgas? Como mostrar que uma infraestrutura pública pode beneficiar empresas, ampliar atividade e gerar mais impostos ou dividendos sem contar o mesmo dinheiro duas vezes?

## 2. Síntese da pesquisa

O Tesouro não recebe apenas tributos. Ele pode ter receitas tributárias, dividendos de participações, venda de ativos/ações, outorgas e outras receitas. Também pode fazer aportes em empresas, pagar subsídios, comprar participações e financiar investimentos. Esses fluxos têm naturezas diferentes e não devem ser somados como se fossem uma receita permanente.

A Secretaria do Tesouro acompanha dividendos e juros sobre capital próprio devidos à União, resultado primário das estatais e riscos fiscais ligados a elas; também acompanha participações societárias e seus valores. O Tesouro registra ainda aumentos de capital e outros fluxos entre União e empresas. [Tesouro Nacional, Empresas Estatais](https://www.gov.br/tesouronacional/pt-br/ativos-da-uniao/empresas-estatais), [Boletim de Participações Societárias](https://www.tesourotransparente.gov.br/visualizacao/boletim-dinamico-participacoes-societarias-da-uniao), [relatórios de ativos e riscos fiscais](https://www.gov.br/tesouronacional/pt-br/paginas-complementares/bgu-e-relatorios-especiais)

Infraestrutura pode elevar produtividade e reduzir custos de empresas, mas o efeito depende de localização, uso, qualidade, gargalos complementares, manutenção e ambiente regulatório. O Banco Mundial identifica canais de aumento de produção e produtividade das empresas, mas também alerta que impostos distorcivos, baixa qualidade de execução ou deslocamento de investimento privado podem reduzir o retorno líquido. Um relatório recente destaca que priorização e coordenação entre setores importam tanto quanto o volume investido. [World Bank, Infrastructure Foundations](https://www.worldbank.org/en/topic/infrastructure/publication/infrastructure-foundations-from-current-assets-to-future-growth), [World Bank, public investment and private production](https://documents1.worldbank.org/curated/en/994971468140665756/pdf/439690PUB0Box310only109780821374153.pdf)

Em concessões, o Estado pode receber outorga, mas a receita do serviço pode ser tarifa paga pelos usuários à concessionária. A ANEEL descreve leilões com objetivos como menor tarifa e expansão de geração; isso reforça que “receita do setor” não é necessariamente “receita do Tesouro”. [ANEEL, leilões](https://www.gov.br/aneel/pt-br/assuntos/leiloes)

## 3. Unidade de mapa: a bolha de leis

### 3.1 Definição

Uma **bolha** é uma mesa visual e jogável em torno de um problema público ou sistema econômico. Ela agrupa:

- um objetivo ou necessidade reconhecível;
- um ou mais mecanismos de jogo;
- leis que habilitam, limitam ou definem responsabilidades;
- alavancas que o jogador realmente pode alterar;
- recursos e estoques que entram no sistema;
- resultados e indicadores observáveis;
- atores afetados;
- ligações explícitas com outras bolhas e com o Tesouro.

A bolha não é só uma categoria temática nem uma coleção de índices. Ela deve oferecer uma decisão clara e fechar pelo menos um ciclo de ação, resultado e próxima decisão.

### 3.2 Regras para bolhas consistentes

1. **Uma pergunta principal por bolha.** Ex.: “Como manter energia confiável a custo aceitável enquanto a demanda cresce?”
2. **Um mecanismo principal identificável.** A bolha pode incluir mecanismos auxiliares, mas deve dizer qual estrutura o jogador está administrando.
3. **Leis por função, não por semelhança de nome.** Agrupar juntas as regras que habilitam e limitam a mesma decisão. Uma lei pode ter links para outra bolha, sem ser copiada.
4. **Separar regra de escolha.** Lei define o que é permitido, quem decide e quais obrigações existem; alavanca é a escolha operacional, como taxa, orçamento, mistura de fontes, investimento ou prioridade.
5. **Separar capacidade de resultado.** Escolas, leitos, linhas de transmissão, vagas prisionais ou capacidade produtiva são estados/capacidades; aprendizagem, saúde, confiabilidade ou renda são resultados. Não representar ambos com o mesmo índice.
6. **Mostrar o gargalo.** A bolha deve revelar o recurso limitante atual: dinheiro, profissionais, infraestrutura, execução, aprovação política ou demanda.
7. **Poucas conexões, mas causais.** Toda ligação externa deve indicar o canal, atraso e sentido: “energia mais confiável reduz paradas industriais após a conclusão da rede”.
8. **Não duplicar leis ou fluxos.** Uma lei tem uma ficha e uma esfera principal. Outras bolhas exibem referência e efeito cruzado.
9. **Tesouro como nó compartilhado.** A bolha não cria dinheiro livre: registra quem paga, quem recebe, quando, em que natureza contábil e em qual estoque/fluxo.
10. **Janela temporal comum.** Mostrar efeito do turno, prazo de implantação e horizonte de maturação, sem misturá-los.
11. **Alternativas com custos próprios.** Não fazer a bolha ter um único botão “mais/menos” quando existirem alternativas de execução, financiamento ou governança relevantes.
12. **Fontes e confiança.** Cada relação quantitativa deve ter fonte ou etiqueta de hipótese, faixa de incerteza e responsável por sua revisão.
13. **Sem indicador órfão.** Cada índice da bolha deve entrar como demanda, capacidade, restrição, resultado ou sinal de risco, não apenas ocupar espaço.
14. **Recuperação possível.** Um erro deve pressionar o sistema e abrir escolhas de correção, salvo falhas terminais explicitamente previstas no jogo.

### 3.3 Ficha de bolha

| Campo | Pergunta a responder |
|---|---|
| `id`, nome e pergunta | Qual problema público esta bolha resolve para o jogador? |
| esfera principal | Onde ela fica no mapa? |
| mecanismo principal | Que ciclo transforma decisões em consequências? |
| leis ligadas | Quais leis definem competência, direitos, limites e incentivos? |
| alavancas | O que o governo pode escolher neste turno? |
| demanda | O que faz a necessidade crescer ou diminuir? |
| capacidade/estoque | O que existe, quanto dura e como se deprecia? |
| atores | Quem executa, paga, recebe, usa ou reage? |
| ligação fiscal | Quais fluxos entram/saem do Tesouro, em que data e natureza? |
| resultados | Quais serviços, preços, produção e índices mudam? |
| vínculos cruzados | Qual canal conecta esta bolha a outras? |
| fontes/hipóteses | Fonte, data, unidade e grau de incerteza de cada parâmetro |
| feedback | O que o jogador vê antes e depois de decidir? |

## 4. Ligar bolhas ao Tesouro

### 4.1 O Tesouro como livro de fluxos e estoques

O Tesouro deve ser o ponto comum de liquidação e acompanhamento, não a fonte mágica de todos os recursos. Para cada transação, guardar pelo menos:

`origem → destino → natureza → valor → período → recorrência → condição → fonte`.

**Fluxos** ocorrem por período: impostos, tarifas públicas, dividendos distribuídos, salários, compras, subsídios, juros e transferências.

**Estoques** existem ao longo do tempo: caixa/cofre, dívida, participações acionárias, reservas, ativos de infraestrutura e passivos contingentes.

Venda de participação reduz ativo e aumenta caixa uma vez. Dividendo é receita de acionista quando distribuído. Aporte é saída de caixa que aumenta a participação ou cobre a necessidade de uma estatal. Empréstimo/garantia pode não ser gasto no momento, mas cria risco fiscal. Essas operações não são equivalentes a tributos.

### 4.2 Classes de entrada pública

| Classe | Exemplo | Natureza no jogo | Recorrência e limite |
|---|---|---|---|
| Tributo | imposto de renda, consumo, lucro e propriedade | receita fiscal associada a base tributável e alíquota | recorrente enquanto base e regra existirem; depende de atividade, conformidade e comportamento |
| Dividendo/JCP | lucro distribuído de empresa em que o Estado tem participação | retorno de acionista, ligado a lucro e percentual de participação | variável; pode ser retido/reinvestido e não deve exceder lucro/distribuição disponível |
| Venda de participação/ativo | privatização ou venda de ações/terreno | conversão de patrimônio em caixa | extraordinária; reduz participação/ativo e dividendos futuros |
| Outorga/concessão | pagamento contratado por direito de operar ativo/serviço | receita contratual, normalmente concentrada na contratação ou em parcelas | limitada pelo contrato; não é imposto nem prova de que tarifa caiu |
| Tarifa pública | serviço operado diretamente pelo Estado | receita de serviço contra custo operacional | vinculada a volume, preço, qualidade e subsídio; deve ser apresentada separada de tributo |
| Royalties/participações | exploração de recurso natural | receita ligada à produção/preço e regra de partilha | volátil; pode ser não recorrente ao orçamento e depende de recurso e preço |
| Retorno de empréstimo | crédito público reembolsado | amortização/juros de ativo financeiro | depende de adimplência e contrato; separar principal de receita de juros |
| Transferências recebidas | repasse de outro nível de governo ou fundo | entrada intergovernamental | depende da regra de repartição e situação fiscal do ente |
| Emissão de dívida | venda de títulos | financiamento, não receita tributária | cria passivo e juros futuros; contabilizar no bloco de financiamento |

### 4.3 Saídas e riscos públicos

- **Gasto de serviço:** paga operação de programa e equipe.
- **Investimento:** compra/constrói ativo que pode elevar capacidade depois da execução.
- **Aporte de capital:** transfere recursos para uma empresa estatal; pode virar participação/ativo ou cobrir prejuízo, conforme o caso.
- **Subsídio/compensação:** reduz custo de usuário ou empresa, com custo fiscal explícito.
- **Compra de participação:** saída de caixa contra aumento de ativo acionário.
- **Juros/amortização:** custo financeiro e pagamento do principal.
- **Garantia/contingência:** risco que pode virar saída se ocorrer evento contratual.

A UI precisa mostrar, para cada decisão, o impacto em fluxo do período, posição patrimonial, obrigação futura e serviço público. Isso evita que uma venda pareça lucro recorrente ou que uma garantia pareça gratuita.

## 5. Modelo de empresas por setor

### 5.1 Grupos e atividade

O modelo proposto em `empresas-do-pais.md` separa estatais, grandes privadas nacionais, multinacionais e pequenos negócios por setor. Para cada setor, a simulação deve acompanhar apenas agregados necessários à decisão:

- capacidade física ou produtiva;
- produção/serviço entregue e utilização;
- receita/faturamento;
- custos operacionais, salários e insumos;
- lucro antes/depois de juros e tributos, quando disponível;
- dívida ou custo de capital agregado;
- investimento realizado e projetos em implantação;
- participação estatal/privada por grupo;
- impostos, dividendos, aportes, subsídios e passivos fiscais relacionados.

Não é necessário simular cada CNPJ. Grupos agregados com atributos e respostas causais são mais fáceis de calibrar e explicam melhor o efeito das leis.

### 5.2 Fluxo econômico e fiscal

```text
infraestrutura e regras → custo, capacidade e acesso das empresas
→ produção, preço, emprego e faturamento
→ custos e juros → lucro e decisão de investimento
→ imposto sobre base tributável (empresa privada)
  ou dividendo distribuído sobre lucro (empresa estatal)
→ Tesouro → novo orçamento, dívida ou cofre
```

Para cada fluxo, evitar contar bases incompatíveis: imposto incide na base definida pela lei (lucro, consumo, folha etc.); dividendo incide sobre lucro distribuído e participação do acionista; venda incide sobre preço de alienação e reduz o ativo vendido. A empresa estatal também pode pagar tributos legalmente aplicáveis; isso é separado do dividendo.

### 5.3 Cálculos conceituais, não fórmulas aprovadas

- `capacidade_efetiva = capacidade_instalada × disponibilidade × acesso à infraestrutura × eficiência`
- `produção = mínimo(demanda, capacidade_efetiva) × fator_operacional`
- `lucro = receita_operacional − custos − juros − tributos da empresa`
- `tributo_empresarial = base_tributável × alíquota efetiva × conformidade`
- `dividendo_do_estado = participação_estatal × lucro_distribuível × percentual_distribuído`
- `entrada_de_venda = participação_vendida × valor_de_mercado ajustado por preço, passivos e condições da transação`
- `aporte = capital público efetivamente transferido`, registrado como investimento patrimonial ou custo/subsídio conforme finalidade contábil

Essas expressões servem para separar conceitos. As fórmulas do motor, suas unidades, curvas e fontes são trabalho dos chamados próprios e precisam lidar com prejuízo, lucro retido, dívida e incerteza.

## 6. Infraestrutura e empresas beneficiadas

### 6.1 Cadeia causal

Investimento público em infraestrutura não deve acrescentar imposto diretamente. A cadeia plausível é:

1. O Tesouro paga projeto, manutenção ou cofinanciamento.
2. O projeto passa por execução, atraso, custo e qualidade; dinheiro empenhado não é capacidade pronta.
3. A infraestrutura entra em serviço e muda uma condição mensurável: tempo de transporte, confiabilidade de energia, acesso à água, conectividade ou custo logístico.
4. Empresas expostas à infraestrutura podem reduzir custo, aumentar utilização, atender mercados ou elevar capacidade, conforme setor e localização.
5. Produção, faturamento, emprego e lucro podem mudar após atraso.
6. Bases tributáveis podem crescer e produzir arrecadação adicional; se empresas beneficiadas forem estatais, a parte do lucro distribuída ao Tesouro pode elevar dividendos.
7. O aumento de receita é comparado ao custo público total e às despesas de operação/manutenção, sem atribuir toda a expansão observada à obra.

A evidência geral sustenta possíveis efeitos sobre produtividade, produção e investimento privado, mas o retorno depende da seleção e execução do projeto e pode ser reduzido por impostos distorcivos, baixa qualidade ou falta de complementos. Não se deve assumir multiplicador universal. [World Bank, infraestrutura e crescimento](https://www.worldbank.org/en/topic/infrastructure/publication/infrastructure-foundations-from-current-assets-to-future-growth), [World Bank, canais sobre produção privada e crowding out](https://documents1.worldbank.org/curated/en/994971468140665756/pdf/439690PUB0Box310only109780821374153.pdf), [Ipea, investimento em infraestrutura no Brasil](https://repositorio.ipea.gov.br/handle/11058/5192)

### 6.2 Regras de atribuição no jogo

- A obra beneficia setores e regiões declarados na ficha do projeto, com intensidade e atraso documentados ou marcados como hipótese.
- Benefício afeta primeiro a capacidade/custo/acesso da empresa; impostos e dividendos mudam apenas depois, seguindo a base tributável e o lucro distribuído.
- Não contar simultaneamente aumento de faturamento como aumento de lucro integral; custos, salários, juros e tributos mudam também.
- Não atribuir toda receita adicional ao projeto: comparar com cenário sem projeto e considerar atividade geral, preços, câmbio, outras leis e demanda.
- Separar retorno fiscal (receita que chega ao Tesouro) de retorno social (tempo, acesso, saúde, produtividade, segurança) e de retorno financeiro da empresa.
- Contabilizar manutenção, subsídio, garantia e custo de oportunidade do capital público.
- Se a obra for concessionada, separar investimento privado, receita de tarifa, outorga, subsídio e obrigação pública; tarifa pode ir à empresa, não ao Tesouro.
- Evitar dupla contagem entre setores: uma ferrovia pode beneficiar mineração e agricultura, mas efeitos agregados precisam evitar somar duas vezes a mesma carga/exportação.

## 7. Estudo de caso: corredor logístico financiado pelo Tesouro

### 7.1 Problema contínuo

A região produtora tem gargalo de transporte: estradas saturadas aumentam tempo e custo de levar produtos a portos e centros consumidores. O país tem empresas públicas e privadas em mineração, agro, transporte e logística. O Tesouro pode financiar uma ferrovia/corredor público, cofinanciar uma parceria, conceder a obra com outorga ou investir em manutenção viária. O objetivo não é provocar uma crise eventual; é reduzir um custo estrutural que limita a atividade.

Este exemplo é um protótipo de design. A localização, custo, prazo, setores beneficiados, elasticidades e efeitos fiscais precisam vir de estudo/projeto real e fonte específica. Não se presumem valores nem magnitude de retorno.

### 7.2 A bolha “Transporte e logística”

**Pergunta da bolha:** como aumentar capacidade e confiabilidade logística sem comprometer demais o orçamento e sem deslocar custos excessivos para usuários?

**Leis relacionadas:** planejamento e competência pública, regime de concessão/PPP, regras de tarifa, licenciamento e contratação. Uma única lei tem uma esfera principal; bolhas de Agro, Mineração e Finanças mostram links para ela e recebem os efeitos adequados.

**Alavancas:** escolher corredor/projeto; decidir manutenção versus expansão; definir parcela pública, concessão ou parceria; distribuir investimento por etapas; escolher metas de serviço, tarifa e manutenção dentro do marco legal; selecionar fonte de financiamento compatível com o Tesouro.

**Estado e resultados:** capacidade de carga, disponibilidade da via, tempo/custo de viagem, utilização, custo logístico por setor, acidente/emissões se houver mecanismo sustentado e emprego/produção afetados.

### 7.3 Sequência de turnos

**Turnos 1–2: escolha e financiamento.** O jogador compara projeto público, concessão e parceria. A opção pública sai do orçamento/caixa e pode elevar dívida; a concessão pode trazer investimento privado e eventualmente outorga, mas deixa tarifa, fiscalização, garantias e risco contratual. Nenhuma opção é “dinheiro grátis”.

**Turnos 3–5: implantação.** As parcelas pagas aparecem no Tesouro; a obra ainda não conta como capacidade utilizável. Atraso, custo ou restrição de execução pode adiar o benefício. Se a manutenção de infraestrutura existente foi cortada para financiar o projeto, o custo aparece no estoque de ativos já operacionais.

**Após a entrada em operação: produtividade e produção.** Menor tempo/custo logístico pode elevar a margem ou a utilização de empresas ligadas ao corredor. Algumas podem investir para expandir produção. A resposta depende de demanda, acesso a energia/mão de obra/crédito e preços externos; um corredor sem esses complementos pode ter retorno menor.

**Períodos seguintes: Tesouro.** Empresas privadas podem gerar mais lucro tributável; empresas estatais podem gerar mais lucro e dividendos se parte for distribuída. Outras receitas (folha, consumo, royalties) só aumentam se suas bases efetivamente crescerem e a regra vigente as alcançar. O jogo não deve somar imposto sobre faturamento quando a lei incide sobre lucro.

### 7.4 Comparação pública/privada

| Caminho | Tesouro no início | Operação futura | Receita pública possível | Riscos/custos que permanecem |
|---|---|---|---|---|
| Obra e empresa públicas | paga investimento; pode emitir dívida | controla ativo e serviço | tributos sobre atividade e eventual dividendo se empresa estatal lucrar e distribuir | atraso, custo excedente, manutenção, gestão, dívida e risco de demanda |
| Concessão privada | custo pode ser menor no orçamento inicial; pode receber outorga ou pagar subsídio | concessionária investe/opera sob contrato e regulação | tributos, outorga contratual e receitas previstas no contrato | tarifa paga por usuários, garantias, fiscalização, renegociação, risco de demanda e passivos |
| Parceria/cofinanciamento | divide aporte/risco conforme contrato | execução compartilhada | tributos e fluxos contratuais; eventual dividendo se houver participação estatal | complexidade contratual, garantias, fiscalização e risco alocado de forma incompleta |
| Manutenção sem expansão | custo menor que obra nova, conforme o estado do ativo | preserva capacidade existente | evita perda de atividade e base fiscal; não cria novo ativo | pode não remover gargalo e capacidade pode continuar insuficiente |

A receita de outorga e a receita tarifária devem ficar separadas. A tarifa é paga pelo usuário e pode ser recebida pela concessionária; a outorga é pagamento contratual ao poder público. A ANEEL descreve leilões em que coexistem objetivos de modicidade tarifária e expansão de geração. [ANEEL, leilões de energia](https://www.gov.br/aneel/pt-br/assuntos/leiloes)

### 7.5 Exemplo numérico sem inventar valores

A tela pode mostrar a comparação em variáveis de projeto, aguardando pesquisa:

| Variável | Obra pública | Concessão/PPP |
|---|---:|---:|
| Custo de capital total | `[fonte do projeto]` | `[fonte do edital/contrato]` |
| Parcela do Tesouro por período | `[cronograma orçamentário]` | `[aporte/subsídio/garantia]` |
| Prazo até capacidade utilizável | `[cronograma]` | `[cronograma contratual]` |
| Redução de tempo/custo logístico | `[estudo de demanda]` | `[estudo de demanda]` |
| Produção adicional por setor | `[hipótese calibrada/estudo]` | `[hipótese calibrada/estudo]` |
| Tributo incremental | `[base tributária × resposta]` | `[base tributária × resposta]` |
| Dividendo incremental | `[participação × lucro distribuível]` | `[somente se participação estatal]` |
| Tarifa e outorga | `[se houver]` | `[contrato, separadas]` |
| Manutenção e riscos fiscais | `[orçamento e riscos]` | `[matriz de risco/garantias]` |

A estrutura mostra exatamente que dados faltam antes de afirmar “a infraestrutura paga a si mesma”. Mesmo que a obra gere mais arrecadação, a receita fiscal incremental não precisa cobrir o custo; o benefício social pode existir sem retorno fiscal integral.

### 7.6 Feedback para o jogador

No fechamento de cada período, a bolha informa:

- recurso do Tesouro comprometido, pago e ainda a pagar;
- ativo/capacidade entregue e parte ainda em implantação;
- mudança no tempo/custo logístico e setores/regiões expostos;
- produção/custos/lucros estimados por grupo empresarial;
- variação separada de tributos, dividendos, tarifas, outorgas, subsídios e garantias;
- diferença entre cenário com projeto e cenário sem projeto;
- causas concorrentes e faixa de incerteza;
- próxima decisão disponível: manter, acelerar, reprogramar, reforçar manutenção ou rever contrato.

## 8. Exemplo complementar: privatização/estatização na bolha empresarial

A bolha “Empresas e ativos públicos” responde: **quem é dono, quem investe, quem assume o risco e como o retorno chega à sociedade e ao Tesouro?**

- Governo com prioridade de controle público pode comprar participação em etapas, pagar aquisição e aporte, e aceitar pressão imediata no caixa em troca de maior controle e dividendos potenciais futuros.
- Governo com prioridade de reduzir propriedade estatal pode vender participação ou conceder operação; recebe venda/outorga se houver, mas abre mão de parte de dividendos e depende de tributação, contrato e regulação.
- Em ambos os casos, o resultado depende de preço, competição, governança, investimento executado, demanda, custos, lucro e distribuição.
- A venda de uma estatal é caixa extraordinário com redução de ativo; não deve virar receita corrente permanente. O dividendo é variável e vem do lucro distribuído, não do faturamento bruto.
- Um aporte deve ser visível como uso de recursos e mudança de posição patrimonial ou subsídio, conforme sua finalidade.

O jogo deve permitir governos com prioridades comunistas/socialistas, liberais e combinações intermediárias, mas os efeitos vêm das decisões e mecanismos concretos, não de multiplicadores automáticos associados ao rótulo ideológico.

## 9. Interação entre bolhas

| Bolha de origem | Canal | Bolha que recebe efeito | Exemplo |
|---|---|---|---|
| Finanças/Tesouro | orçamento, caixa, dívida, tributo, aporte | todas as bolhas | orçamento de transporte compete com saúde e educação |
| Transporte/logística | tempo, custo e confiabilidade | Agro, mineração, comércio e indústria | menor custo logístico pode alterar produção e margem |
| Energia | preço e confiabilidade | indústria, serviços, famílias e Tesouro | menos interrupções podem elevar utilização e reduzir custo |
| Empresas/estatais | produção, lucro, investimento, dividendo | Finanças e setor correspondente | lucro distribuído aumenta dividendo; expansão aumenta capacidade após prazo |
| Saúde/educação | capacidade humana, participação e produtividade | trabalho, empresas e Tesouro | acesso/qualificação podem alterar emprego e renda no longo prazo |
| Regulação/concessão | tarifa, metas, investimento, fiscalização e risco | infraestrutura e usuários | tarifa acessível pode exigir equilíbrio com investimento e subsídio |

Toda ligação deve ter direção, atraso, condição e fonte/hipótese. O mapa pode mostrar uma trilha causal ao selecionar uma bolha, em vez de desenhar todas as ligações de uma vez.

## 10. Regras anti-duplicação contábil e causal

1. **Venda de ativo não é tributo:** registra-se caixa recebido e ativo/participação reduzido.
2. **Dívida não é receita:** financia fluxo e cria passivo/juros.
3. **Dividendo não é faturamento:** depende de lucro distribuível e percentual pago ao acionista.
4. **Estatal pode pagar tributos:** separar tributos incidentes da distribuição de lucro ao acionista.
5. **Outorga não é tarifa:** identificar pagador e recebedor em cada contrato.
6. **Investimento não é capacidade no mesmo instante:** separar autorização, pagamento, execução, entrega e operação.
7. **Atividade maior não vira arrecadação automaticamente:** aplicar as bases tributárias legais, informalidade, conformidade e comportamento.
8. **Atividade maior não vira dividendo automaticamente:** só se houver participação estatal, lucro e distribuição.
9. **Não somar efeitos de PIB em cascata sem contabilidade consistente:** o modelo escolhe onde produção/valor adicionado aparece e evita recontar vendas intermediárias.
10. **Retorno fiscal não é retorno social:** reportar separadamente arrecadação, dividendo, serviço, produtividade, acesso e bem-estar.
11. **Causalidade deve ser incremental:** comparar ao cenário sem a intervenção e considerar choques e outras políticas.
12. **Risco contingente tem valor e gatilho:** garantia pode não gerar caixa hoje, mas deve aparecer como exposição fiscal.

## 11. Próxima pesquisa antes de virar regra

- Escolher um projeto/trecho real de infraestrutura e obter custo, cronograma, demanda, beneficiários, manutenção, matriz de risco e modelo de contratação.
- Definir unidade e horizonte fiscal: Governo Central, governo geral ou setor público consolidado; dívida bruta ou líquida; caixa e ativos incluídos.
- Selecionar um ou dois setores empresariais beneficiados e medir sua participação estatal, estrutura de custo, base tributária e resposta ao gargalo.
- Separar efeitos observados, estimativas de avaliação e hipóteses de simulação.
- Prototipar a ligação infraestrutura → custos/produção → lucro/base tributável → tributo/dividendo, com cenário contrafactual e sensibilidade.
- Confirmar como venda, dividendo, aporte, subsídio e investimento afetam as contas já modeladas no V1-35/V1-38, evitando implementação duplicada.
- Submeter as regras das bolhas para revisão do autor antes de alterar o catálogo ou o motor.

## 12. Fontes consultadas

- Tesouro Nacional. [Empresas Estatais: dividendos, resultado e riscos fiscais](https://www.gov.br/tesouronacional/pt-br/ativos-da-uniao/empresas-estatais).
- Tesouro Transparente. [Boletim Dinâmico de Participações Societárias da União](https://www.tesourotransparente.gov.br/visualizacao/boletim-dinamico-participacoes-societarias-da-uniao).
- Tesouro Nacional. [Relatórios sobre participações, ativos e riscos fiscais](https://www.gov.br/tesouronacional/pt-br/paginas-complementares/bgu-e-relatorios-especiais).
- World Bank. [Infrastructure Foundations: From Current Assets to Future Growth](https://www.worldbank.org/en/topic/infrastructure/publication/infrastructure-foundations-from-current-assets-to-future-growth).
- World Bank. [Public infrastructure, production and private investment channels](https://documents1.worldbank.org/curated/en/994971468140665756/pdf/439690PUB0Box310only109780821374153.pdf).
- Ipea. [O investimento em infraestrutura no Brasil: histórico recente e perspectivas](https://repositorio.ipea.gov.br/handle/11058/5192).
- ANEEL. [Leilões de energia](https://www.gov.br/aneel/pt-br/assuntos/leiloes).
- Brasil. [Constituição Federal, art. 175](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm), [Lei 8.987/1995](https://www.planalto.gov.br/ccivil_03/leis/l8987cons.htm).
- SisGov. `docs/v1/desenho/empresas-do-pais.md`, `estudo-das-leis.md`, `rede.md`, `minijogo-financeiro.md`, `estudo-e-casos-de-uso-gamificacao.md`; chamados V1-35, V1-37 e V1-38.

## Assinatura

**gpto-revisar** — estudo e proposta de mecânicas gerados por GPT; conferir fontes, dados, causalidade, convenções contábeis e decisões do autor antes de tratar como regra do jogo.
