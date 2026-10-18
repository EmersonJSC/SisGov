# Mecanismo de cálculo: empresas, produtividade, infraestrutura e Tesouro

> **Status: RASCUNHO TÉCNICO DE PESQUISA (17/out/2026).** Proposta de mecanismo computável sobre o motor existente. Não implementa nem aprova fórmulas. **Assinatura: gpto-revisar.**

## Resumo curto

Usar uma **simulação agregada por setor e propriedade**, não uma simulação de cada empresa. Em cada passo mensal, calcular demanda, capacidade usada, produção, vendas, custos, lucro, imposto e dividendo. O SisGov já representa infraestrutura com estoques agregados, como `infraestrutura_transportes` e `infraestrutura_energia`, que sobem com investimento e atraso. A proposta-base é usar esses estoques para alterar gradualmente custo ou capacidade dos setores expostos. **Não pressupõe projetos nem obras individuais.** O Tesouro recebe fluxos separados: tributo recorrente, dividendo variável, venda extraordinária, outorga/tarifa contratual; aporte e subsídio são saídas. O motor de rede continua calculando relações e índices, mas a camada econômica passa a ser a fonte dos fluxos empresariais. Assim não se conta duas vezes a arrecadação.

## 1. O que o motor já faz e o que falta

O motor atual tem:

- rede determinística de leis, índices, situações e estoques;
- atualização de estoques por taxas recebidas e transbordo entre cofre e dívida;
- índices agregados como PIB, produtividade, arrecadação, infraestrutura e dívida;
- controles e leis para investimento em infraestrutura, imposto de renda das empresas e papel do Estado empresário;
- atrasos, implantação e consequências de conteúdo.

Mas ainda não existe no estado do jogo um balanço por grupo empresarial. Hoje, a consequência de investimento em infraestrutura empurra diretamente produtividade; o imposto de renda das empresas usa `pib` como base da regra tributária e uma consequência direta soma arrecadação; a lei do papel do Estado também altera arrecadação diretamente. Se adicionarmos empresas calculadas e mantivermos esses efeitos, duplicaremos ou contradiremos a receita. A camada nova precisa substituir essas contribuições agregadas por fluxos calculados a partir de atividade e lucro empresarial.

**Achados no código/conteúdo:** `src/conteudo/mundo/leis/imposto-renda-empresas.json` declara `tributo.base: "pib"`; `src/conteudo/mundo/consequencias/imposto-renda-empresas--arrecadacao.json` altera `arrecadacao`; `empresas-estatais-e-privatizacao--arrecadacao.json` também altera `arrecadacao`; a consequência `investimento-em-infraestrutura--produtividade.json` muda produtividade de forma direta. A ficha de empresas já propõe grupos e setores, mas só apresenta “faturamento × margem − juros”, sem decomposição de produção, custo, imposto e lucro distribuível.

## 2. Unidade de simulação: células setor × propriedade

Começar com células agregadas, não empresas individuais:

| Grupo | Significado | Entrada ao Tesouro |
|---|---|---|
| Estatal | produção de empresas controladas pelo Estado | tributos legais sobre a atividade + dividendos distribuídos; pode receber aporte/subsídio |
| Privada nacional grande | produção de grandes empresas privadas do país | tributos sobre as bases legais |
| Multinacional | operação local controlada por capital externo | tributos sobre atividade local; lucro pode ser remetido, conforme regra |
| Pequenos negócios | micro/pequenas empresas e atividade simplificada | tributos conforme regime e conformidade próprios |

Cada célula guarda poucos agregados: `capacidade`, `produtividade`, `utilizacao`, `demanda`, `preco`, `custo_unitario`, `divida` (opcional na primeira versão) e propriedade/participação. Setores iniciais devem ser limitados aos que têm dados e mecanismos fortes: energia, transporte/logística, mineração, agro, indústria e comércio. Não inventar dez balanços detalhados sem fonte.

Para empresas estatais e privadas nacionais da mesma indústria, compartilhar parâmetros setoriais de tecnologia e demanda, mas permitir diferenças de gestão/eficiência, custo de capital, objetivo de serviço e governança apenas quando houver lei, estado ou fonte para isso. Propriedade muda para quem vai o lucro e quem financia o investimento; não aplica automaticamente um multiplicador de eficiência.

## 3. Cálculo mensal mínimo

Para cada setor `s` e grupo `g`, na ordem abaixo:

### 3.1 Demanda e vendas

`demanda[s] = demanda_base[s] × atividade_da_economia × efeitos_de_renda/preço/leis`

A demanda setorial e elasticidades vêm de fontes ou são hipóteses calibradas. No piloto, pode-se usar uma demanda normalizada e fixar uma linha de base, antes de tentar reproduzir todos os mercados.

### 3.2 Capacidade efetiva

`capacidade_efetiva[s,g] = capacidade_instalada[s,g] × disponibilidade[s,g] × acesso_infraestrutura[s,g]`

`acesso_infraestrutura` deve ser calculado a partir do **estoque agregado existente** por tipo de infraestrutura, exposição do setor e atraso/ritmo de transmissão. Exemplo: o estoque nacional de transporte pode afetar custo/tempo de agro e mineração; o estoque de energia pode afetar disponibilidade e custo da indústria. Na proposta-base, não se escolhe uma estrada nem se cria uma entidade “obra”: o jogador muda o investimento agregado já previsto, esse fluxo altera gradualmente o estoque, e o estoque altera os setores conforme coeficientes documentados. Uma mesma variação de estoque não beneficia todos os setores igualmente.

### 3.3 Produção

`produção[s,g] = mínimo(demanda_alocada[s,g], capacidade_efetiva[s,g]) × eficiência_operacional[s,g]`

A demanda alocada respeita participações de mercado. A versão inicial pode manter quotas por grupo estáveis e alterá-las somente em resposta a preços, investimento, entrada/saída ou lei explicitamente modelados.

### 3.4 Receita de venda e custos

`faturamento[s,g] = produção[s,g] × preço[s]`

`custo_operacional[s,g] = custo_fixo[s,g] + produção[s,g] × custo_unitario[s,g]`

`resultado_antes_imposto[s,g] = faturamento − custo_operacional − custo_financeiro`

O preço pode ser controlado por mercado, tarifa, contrato ou política da estatal. Preço controlado não apaga o custo: diferença entre custo e preço precisa aparecer como prejuízo, subsídio/aporte, redução de investimento ou outro mecanismo especificado.

### 3.5 Tributo, dividendo e lucro retido

`base_tributavel[s,g] = função definida pela lei tributária (não usar PIB como substituto do lucro sem justificativa)`

`imposto[s,g] = máximo(0, base_tributavel) × alíquota_efetiva × conformidade`

`lucro_liquido[s,g] = resultado_antes_imposto − imposto`

`lucro_distribuível_estatal = máximo(0, lucro_liquido − reserva/retido obrigatório)`

`dividendo_Tesouro = participação_pública × percentual_distribuído × lucro_distribuível_estatal`

A empresa estatal pode estar sujeita a tributos como qualquer empresa, conforme a legislação; dividendos são um fluxo acionário distinto. Empresa com prejuízo não paga dividendo positivo neste cálculo e pode solicitar aporte, receber subsídio, reduzir investimento, tomar dívida ou cortar operação, de acordo com regras separadas.

### Exemplo numérico demonstrativo (números fictícios)

Suponha um setor de transporte de carga antes e depois de uma elevação gradual do estoque agregado `infraestrutura_transportes`. Todos os valores abaixo são unidades abstratas por mês; servem somente para mostrar a ordem da conta. Não representam uma obra individual nem valores reais.

**Antes do aumento do estoque de infraestrutura**

- demanda: 100 unidades;
- capacidade: 80;
- produção/vendas: `mínimo(100, 80) = 80`;
- preço por unidade: 10; faturamento: `80 × 10 = 800`;
- custo operacional por unidade: 7; custo total: `80 × 7 = 560`;
- lucro antes de imposto: `800 − 560 = 240`;
- alíquota efetiva: 20%; imposto: `240 × 0,20 = 48`;
- lucro após imposto: `240 − 48 = 192`.

Se for privada, o Tesouro recebe 48 de imposto. Se for estatal com 100% de participação pública e distribuir 50% do lucro após imposto, o Tesouro recebe `192 × 0,50 = 96` de dividendo, além do tributo aplicável. A regra real de tributação e distribuição precisa ser definida e calibrada; a conta ilustra apenas que são fluxos diferentes.

**Depois que o estoque maior transmite seu efeito ao setor**

Suponha, apenas para demonstração, que a elevação do estoque reduz o custo por unidade de 7 para 6 e a capacidade efetiva sobe de 80 para 100. A demanda continua em 100:

- produção/vendas: `mínimo(100, 100) = 100`;
- faturamento: `100 × 10 = 1.000`;
- custo operacional: `100 × 6 = 600`;
- lucro antes de imposto: `1.000 − 600 = 400`;
- imposto: `400 × 0,20 = 80`;
- lucro após imposto: `400 − 80 = 320`.

Resultado fiscal incremental nesse exemplo:

- **empresa privada:** imposto sobe de 48 para 80, então o Tesouro recebe 32 a mais por mês;
- **empresa estatal 100% pública, distribuindo 50%:** o dividendo sobe de 96 para 160, ou 64 a mais, e o imposto continua sendo calculado separadamente;
- **empresa com participação estatal de 40%:** dividendo após a obra é `320 × 0,50 × 0,40 = 64`, antes era `192 × 0,50 × 0,40 = 38,4`; aumento de 25,6.

O jogo não deposita esse aumento no cofre quando o investimento sobe. O estoque agregado de infraestrutura aumenta ao longo do tempo, conforme a consequência e o atraso já definidos no motor; o cálculo empresarial então aplica o efeito setorial calibrado, recalcula vendas e custos e, por fim, tributo e dividendo. Se a demanda fosse só 70, o aumento de capacidade não elevaria vendas acima de 70: o benefício poderia vir apenas da redução de custos.

**Conta líquida do investimento:** para avaliar se valeu fiscalmente, comparar os tributos/dividendos adicionais acumulados com `custo da obra + manutenção + subsídio/aporte + juros do financiamento`, no mesmo horizonte. Mesmo que a conta fiscal fique negativa, pode haver benefício social; por isso o jogo deve manter retorno fiscal e resultado social em medidas separadas.

## 4. Produtividade: como representar

Não usar produtividade como um botão que todas as leis alteram diretamente. Definir no piloto a produtividade setorial como produção/insumo ou produtividade total agregada, conforme dados disponíveis. Para cada célula:

`produtividade[s,g] = produtividade_base[s] × fator_de_tecnologia × fator_de_habilidades × fator_de_infraestrutura × fator_de_gestão`

A forma multiplicativa é só candidata de implementação, por ser fácil de interpretar e limitar. Cada fator deve:

- partir de 1 na linha-base;
- ter limites e unidade documentados;
- ser alterado apenas por um canal causal declarado;
- ter atraso de implantação quando o efeito não é imediato;
- ser calibrado contra séries reais e análise de sensibilidade;
- evitar somar de novo efeitos que já estejam embutidos em PIB/produtividade na rede.

Para manter o primeiro modelo manejável, infraestrutura pode atuar primeiro em **custo unitário ou disponibilidade** em setores específicos. Só depois adicionar produtividade multifatorial, se necessário. Isso reduz risco de contar a mesma obra simultaneamente como “mais produtividade”, “mais PIB”, “mais capacidade” e “mais faturamento” sem identidade contábil.

## 5. Infraestrutura: estoque agregado e efeito setorial

O estado atual do conteúdo já tem investimento agregado e estoques de infraestrutura; as consequências de investimento alimentam esses estoques com atraso. A proposta-base reaproveita esse desenho, sem fila de projetos individuais:

1. O controle de investimento em infraestrutura gera o fluxo fiscal existente.
2. A consequência com atraso aumenta gradualmente os estoques pertinentes, como `infraestrutura_transportes` e `infraestrutura_energia`.
3. Cada setor recebe uma exposição explícita a cada estoque relevante (por exemplo, transporte para agro/mineração; energia para indústria).
4. O estoque altera gradualmente custo unitário, disponibilidade ou capacidade efetiva do setor. Qual canal e coeficiente dependem de fonte/calibração.
5. A camada empresarial recalcula produção, vendas, custos, lucro e depois tributos/dividendos.

Não presumir que o índice agregado de infraestrutura identifique uma localização, rota ou empresa beneficiada. A primeira versão pode usar efeitos nacionais/setoriais agregados. Projetos individuais, localização regional, fila de execução, estouro de custo e conclusão de obra são uma possível extensão, mas **não fazem parte desta proposta-base e continuam sem decisão**.

## 6. Propriedade, privatização e estatização

Usar uma participação `q[s]` estatal por setor, entre 0 e 1. Privatizar/vender reduz `q`; estatizar comprando aumenta `q` e cria fluxo de aquisição; expropriação é caminho legal separado e não deve ser codificada como compra gratuita.

A propriedade não muda a produção instantaneamente. Ela redistribui:

- quem decide investimento e preço, segundo leis e governança;
- quem financia e assume risco;
- parcela de lucro destinada ao Tesouro como dividendo;
- parcela da base tributável que pertence a cada grupo;
- receitas/obrigações de transição, venda, compra, indenização ou contrato.

Venda: reconhecer entrada extraordinária de caixa e redução do ativo estatal. Nos períodos seguintes, menor participação pode reduzir dividendos e aumentar lucro privado tributável. Estatização: caixa sai ou dívida sobe; nos períodos seguintes, aumenta a parcela potencial de dividendos e o risco fiscal. Nenhum dos dois caminhos deve alterar produtividade sem um mecanismo adicional de gestão, investimento, concorrência ou preço.

## 7. Integração com o motor existente

A rede atual deve continuar calculando leis e indicadores gerais. Uma camada econômica determinística recebe o estado após as leis e antes do fechamento fiscal, calcula as células empresariais e devolve taxas/efeitos nomeados:

- `tributo_empresas` por base e setor;
- `dividendos_estatais`;
- `aporte_estatal` e `subsidio_empresarial`;
- `investimento_empresarial` e capacidade futura;
- `producao_setorial`, `lucro_setorial` e `produtividade` para a rede;
- caixa de venda/compra/outorga e obrigações contratuais.

O fluxo total ao Tesouro deve ter categorias identificáveis, não uma única bolha de arrecadação sem proveniência:

`receita_tributaria = tributos das bases legais + demais tributos existentes`

`receita_nao_tributaria = dividendos + tarifas públicas + royalties + outorgas + receitas patrimoniais, cada uma separada`

`financiamento = emissão/amortização de dívida; nunca classificar como receita`

`resultado fiscal = receitas reconhecidas − despesas primárias − juros`, com convenção e escopo fiscal consistentes com V1-38.

### Integração por passo

Como a partida calcula meses dentro do turno, a camada deve ser chamada em cada passo mensal, mantendo previsibilidade e ordenação determinística. Sequência candidata: atualizar controles/efeitos legais; resolver fila de projetos e capacidade concluída; calcular empresas com o estado econômico vigente; emitir fluxos fiscais; atualizar estoques Tesouro/dívida; recalcular índices derivados. A sequência final precisa ser conferida contra a ordem real do orquestrador e os testes de semântica mensal antes da implementação.

## 8. Dupla contagem a remover

Antes de ligar o modelo empresarial, mapear as fontes atuais do índice agregado `arrecadacao`. No mínimo, revisar:

- consequência direta de `imposto-renda-empresas` sobre arrecadação;
- consequência direta de `papel-do-estado-empresario`/`empresas-estatais-e-privatizacao` sobre arrecadação;
- qualquer efeito de PIB/produtividade que já passe para arrecadação;
- orçamento que use `arrecadacao` ou `receita_total` como base;
- receita de venda de ativos e dividendos prevista em outros efeitos.

A decisão técnica recomendada é: **a camada agregada de firmas assume a parcela empresarial da arrecadação; as leis alimentam alíquotas, propriedade e comportamento, não somam novamente pontos ao índice**. Arrecadação de famílias, consumo, folha, propriedade e demais tributos continua nos mecanismos próprios. Fazer a transição em um piloto setorial para garantir identidade.

## 9. Estudo de caso: investimento em infraestrutura e retorno fiscal

### Estado inicial

Escolher um projeto real de transporte que conecte uma região de produção a mercado/porto e registrar custo, cronograma, cobertura geográfica, capacidade atual, empresas e grupos beneficiados. O exemplo é estrutural, sem números inventados.

### Cálculo passo a passo

1. O investimento agregado em infraestrutura sai do orçamento conforme as regras existentes; se não há caixa, V1-38 define dívida/financiamento.
2. O estoque `infraestrutura_transportes` sobe gradualmente conforme a consequência com atraso; não há projeto individual nem salto imediato.
3. A camada empresarial usa a variação do estoque e a exposição setorial para ajustar custo/tempo logístico de agro, mineração ou outros setores definidos.
4. Produção só aumenta se havia demanda e capacidade complementar; se a demanda não limita, o efeito pode aparecer apenas como custo menor. Preços e custos também atualizam.
5. O resultado antes de imposto cresce apenas se o aumento de margem/produto exceder os custos adicionais. A base de imposto da empresa privada aumenta conforme a lei tributária.
6. Na empresa estatal, o lucro líquido pode aumentar; o dividendo só aumenta se houver lucro distribuível e política de distribuição. Se a estatal retiver lucro para reinvestir, o Tesouro não recebe esse dinheiro naquele passo.
7. O Tesouro compara tributos/dividendos incrementais com investimento, manutenção, juros e outros custos. O projeto pode ser socialmente valioso mesmo que o retorno fiscal não cubra o custo.
8. Registrar cenário contrafactual sem projeto para separar efeito do corredor de PIB, preços internacionais, câmbio, outras leis e tendência econômica.

### Comparar forma de propriedade

| Mesmo projeto | Estado como proprietário/operador | Empresa privada/concessionária |
|---|---|---|
| Financiamento inicial | orçamento, dívida ou aporte estatal | capital privado, eventualmente aporte/subsídio/garantia público |
| Retorno direto ao Tesouro | tributos aplicáveis + dividendos distribuídos | tributos legais + outorga contratual; tarifa tende a ser receita da concessionária |
| Efeito de infraestrutura | pode elevar produtividade da própria estatal e de outras empresas | pode elevar produtividade da concessionária/usuários e de outras empresas |
| Risco público | custo excedente, operação, dívida, aporte e demanda | garantia, regulação, tarifa, contrato, renegociação e risco residual |
| Teste de eficiência | comparar custo, qualidade, prazo e serviço entregue | comparar custo, qualidade, prazo e serviço entregue |

Não codificar “estatal produz menos” ou “privada produz mais” por padrão. A comparação depende de parâmetros observados ou hipóteses explícitas sobre produtividade, investimento, custo de capital, metas e governança.

## 10. Calibração e validação do cálculo

O primeiro protótipo deve usar um setor e um grupo de empresas de cada tipo, com valores normalizados. Validar:

1. No cenário-base, produção, produtividade e margens não explodem nem caem sem mudança de estado.
2. Alíquota zero zera o tributo empresarial correspondente; alíquota maior aumenta receita mecânica só dentro da base e resposta comportamental modelada.
3. Venda de participação muda o ativo/caixa uma vez e muda dividendos futuros proporcionalmente, sem duplicar tributo.
4. Empresa com prejuízo não gera dividendo positivo; aportes aparecem como saída fiscal.
5. Infraestrutura não gera retorno direto ao Tesouro: os estoques agregados sobem com o atraso já modelado; só depois setores expostos podem mudar custo/capacidade, produção e lucro.
6. Aumento de produção com lucro maior gera tributo ou dividendo conforme propriedade, sem contar os dois sobre a mesma parcela de lucro.
7. Receita extraordinária de venda/outorga não é tratada como fluxo recorrente de impostos.
8. Um cenário sem projeto e um com projeto permitem medir efeitos incrementais e custo fiscal líquido.
9. Valores agregados são comparados com IBGE Contas Nacionais, RTN, demonstrações das estatais e dados setoriais relevantes.
10. Sensibilidade mostra quais resultados dependem de parâmetros frágeis; hipóteses ficam marcadas.

## 11. Decisões ainda abertas

- Escopo empresarial inicial: energia, logística, mineração ou outro setor com bons dados.
- Se o primeiro protótipo usa lucro tributável ou uma aproximação por excedente operacional; precisa alinhar com a lei e os dados disponíveis.
- Como representar lucro retido, distribuição, impostos pagos por estatais e empresas deficitárias.
- Que estoque guarda participação/valor de ativos e como operações patrimoniais entram no V1-38.
- Se produtividade é calculada por setor e agregada para o índice `produtividade`, ou se o índice existente permanece aproximado por consequências de rede.
- Se em algum momento o jogo precisa de projetos individuais de infraestrutura; este rascunho não os assume.
- Como preservar consistência com `pib_nominal`, `pib`, `arrecadacao`, `cofre`, `divida_publica` e contas já implementadas.

## 12. Fontes e arquivos consultados

- Tesouro Nacional. [Empresas Estatais](https://www.gov.br/tesouronacional/pt-br/ativos-da-uniao/empresas-estatais).
- Tesouro Transparente. [Boletim das Participações Societárias da União](https://www.tesourotransparente.gov.br/visualizacao/boletim-dinamico-participacoes-societarias-da-uniao).
- IBGE. Contas Nacionais, Cempre e pesquisas setoriais (escolher séries no piloto).
- BCB/Tesouro. Estatísticas fiscais e RTN (fluxos e dívida; escopo precisa coincidir com V1-38).
- SisGov: `src/engine/mechanisms/updateStock.ts`, `src/engine/runtime/computeNetwork.ts`, `src/engine/model/contentTypes.ts`, `src/game/pais/fichaV3/tipos.ts`, `src/conteudo/mundo/indicadores/variaveis.json`, as três leis acima e respectivas consequências.
- Desenhos: `docs/v1/desenho/empresas-do-pais.md`, `rede.md`, `minijogo-financeiro.md` e chamados V1-35/V1-38.

## Assinatura

**gpto-revisar** — mecanismo e fórmulas candidatas gerados por GPT; revisar base tributária, dados, causalidade, unidade fiscal e compatibilidade com motor antes de aprovar.

## Nota de revisão

“Obra concluída” no exemplo anterior era apenas uma forma de ilustrar um atraso e não decide que o jogo terá obras/projetos individuais. A proposta-base usa os estoques agregados de infraestrutura já existentes no motor, que sobem gradualmente com investimento e atraso; projetos individualizados permanecem uma opção futura em aberto.
