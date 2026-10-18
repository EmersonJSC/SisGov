# Conciliação financeira entre tabela e JSONs
> **Status: RASCUNHO DE PESQUISA (17/out/2026).** Auditoria para migração; não altera o motor. Assinatura: gpto-revisar.

## Resultado da conferência

- 246 leis revisadas, 247 JSONs ativos. Os 247 JSONs têm destino: 228 associações diretas e 19 leis legadas vinculadas a um tema revisado.
- 18 leis revisadas ainda não têm JSON ativo. Essas exigem criação de ficha, controle, fonte e efeitos antes de entrar no catálogo.
- 871 opções revisadas; 555 textos coincidem literalmente após normalização. Em 184 das 228 leis diretamente associadas, a quantidade de opções coincide. As 44 restantes incluem alavancas contínuas e diferenças de conteúdo.
- Das 44 leis com quantidades diferentes de opções, 18 são alavancas contínuas, 20 acrescentam o marcador técnico `Ponto da faixa` e 6 mudam escolhas substantivas: regra fiscal, destino do resultado fiscal, pena de morte, maioridade penal, lei de drogas e cannabis.
- 33 leis têm pelo menos uma opção em posição correspondente com semelhança textual inferior a 75%; a maioria é texto de referência ou `Ponto da faixa`. O critério textual sozinho não autoriza substituir opções.
- 221 das 228 leis diretamente associadas não declaram fonte no próprio JSON. As descrições e números antigos não servem como calibração nova sem fonte verificável.
- O motor aceita `tributo` apenas em lei tributária e `orcamento` apenas em lei orçamentária. O estudo classifica fluxos de 8 leis de receita sem `tributo` e 86 leis de despesa sem `orcamento`; não é seguro trocar apenas a categoria.

**Conferência adicional (17/out):** o conversor agora lista as consequências fiscais realmente ativas de cada JSON, inclusive efeitos embutidos em fichas v3, e distingue falta de seta na lei da cobertura por outra camada do mesmo tema. Depois dos dois lotes de migração, há 110 JSONs com alguma seta fiscal, 55 sem seta para a conta esperada na própria lei e 45 sem cobertura por outra camada associada (43 temas). A conta esperada é uma triagem, não uma autorização para criar uma seta com valor arbitrário. Não se deve chamar as 45 de migração concluída.

**Primeiro lote ligado ao jogo:** `fundo-de-equalizacao`, `verba-de-publicidade-oficial-e-comunicacao-publica`, `intermediacao-e-qualificacao`, `orcamento-do-judiciario`, `mutirao-de-cirurgias`, `missoes-de-paz` e `bolsa-de-permanencia-no-ensino-medio` agora têm uma consequência para `gasto_publico` cada. Cada ponto usa a opção e o custo em % do PIB já anotados na ficha; `leitura: nivel` impede multiplicar o pagamento pela eficácia da política. O valor de referência de 1,2% do PIB para o Judiciário em 2024 tem base no [CNJ, Justiça em Números 2025](https://www.cnj.jus.br/wp-content/uploads/2025/09/justica-em-numeros-2025.pdf); 0,6% e 2% são cenários do jogo. Os demais custos seguem como hipóteses da ficha ou números que exigem conferência de escopo e fonte. Esses números não são calibração final do orçamento. O fundo eleitoral ficou de fora porque a despesa depende do calendário eleitoral; a verba habitacional ficou de fora porque já existe uma alavanca de pagamento no mesmo tema.

**Segundo lote gerado por script:** `alfabetizacao-na-idade-certa`, `policiamento-orientado` e `gestao-da-escola-publica` receberam consequências de gasto público. A especificação em `efeitos-fiscais-aplicados.json` fixa cada opção e valor, e `scripts/fichas/aplicar_efeitos_fiscais.py` confere os IDs antes de escrever os arquivos da lei, da consequência e do manifesto. Os valores são hipóteses extraídas das opções: ausência de programa ou realocação de pessoal foi tratada como gasto incremental zero. Não houve teste de partida neste lote.

Seis pares anteriormente classificados apenas como “mesmo tema” são camadas complementares: `farmacia-popular`/`remedios-em-farmacias-credenciadas` (verba/modelo), `imposto-propriedade-urbana-rural`/`imposto-sobre-a-propriedade` (alíquota/modelo), `piso-educacao`/`piso-de-gasto-em-educacao` (valor/regra), `programa-habitacao-popular`/`verba-do-programa-habitacional` (verba/regra), `transferencia-de-renda`/`transferencia-de-renda-as-familias-pobres` (verba/elegibilidade) e `tributacao-dividendos`/`tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter` (alíquota/modelo). As duas leis de cada par permanecem jogáveis até que uma migração conjunta preserve os dois controles. As outras 13 relações legadas ainda exigem decisão individual.

## Leis revisadas sem JSON ativo

- `pagamento-da-divida`
- `emprego-publico-garantido`
- `moeda-propria`
- `cargos-de-confianca`
- `emendas-parlamentares`
- `inelegibilidade-de-condenados`
- `governo-digital`
- `pagamento-por-servicos-ambientais`
- `controle-de-aluguel`
- `microcredito`
- `exigencia-de-trabalho-para-beneficio`
- `piso-profissionais-de-saude`
- `contas-de-saude`
- `subsidio-ao-seguro-saude`
- `rito-sumario`
- `programas-para-jovens-de-risco`
- `controle-de-municao`
- `educacao-prisional`

## JSONs legados com destino no estudo

| JSON ativo | Lei revisada | Estado |
| --- | --- | --- |
| `codigo-florestal` | `protecao-da-vegetacao-nativa-nas-propriedades-rurais` | mesmo tema; revisar opções |
| `delacao-premiada` | `delacao-premiada-e-acordos` | mesmo tema; revisar opções |
| `farmacia-popular` | `remedios-em-farmacias-credenciadas` | mesmo tema; revisar opções |
| `garantias-penais` | `pena-de-morte` | correspondência parcial; revisar opções |
| `habitacao-publica` | `como-o-estado-entrega-casa` | mesmo tema; revisar opções |
| `idade-minima-aposentadoria` | `idade-minima-para-se-aposentar` | mesmo tema; revisar opções |
| `imposto-propriedade-urbana-rural` | `imposto-sobre-a-propriedade` | mesmo tema; revisar opções |
| `licenca-parental` | `licenca-para-cuidar-do-bebe` | mesmo tema; revisar opções |
| `licenciamento-ambiental` | `licenciamento-de-obras-e-empresas` | mesmo tema; revisar opções |
| `matriz-energetica` | `fontes-de-energia-favorecidas` | correspondência parcial; revisar opções |
| `piso-educacao` | `piso-de-gasto-em-educacao` | mesmo tema; revisar opções |
| `policia-militar` | `natureza-da-policia-de-rua` | mesmo tema; revisar opções |
| `policias-dos-estados` | `coordenacao-das-policias` | mesmo tema; revisar opções |
| `previdencia-rural` | `aposentadoria-do-trabalhador-rural` | mesmo tema; revisar opções |
| `programa-habitacao-popular` | `verba-do-programa-habitacional` | mesmo tema; revisar opções |
| `reajuste-de-beneficios` | `regra-de-reajuste-dos-beneficios` | mesmo tema; revisar opções |
| `sistema-previdenciario` | `como-a-aposentadoria-e-financiada` | mesmo tema; revisar opções |
| `transferencia-de-renda` | `transferencia-de-renda-as-familias-pobres` | mesmo tema; revisar opções |
| `tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter` | `tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exterior` | mesmo tema; revisar opções |

## Seis diferenças substantivas de opções

| Lei | Estudo / JSON | Diferença principal |
| --- | ---: | --- |
| `regra-fiscal` | 6 / 4 | O estudo inclui balanço estrutural e freio da dívida. |
| `destino-do-resultado-fiscal` | 4 / 3 | O estudo inclui gastar a sobra em investimento/programa. |
| `pena-de-morte` | 4 / 2 | O JSON omite abolição e exceção de guerra. |
| `maioridade-penal` | 3 / 2 | O estudo distingue a internação longa sem baixar a idade. |
| `lei-de-drogas` | 4 / 3 | O estudo distingue o critério objetivo de porte. |
| `cannabis` | 5 / 3 | O JSON omite proibição e uso medicinal. |

## Caminho de migração

1. Criar os 18 JSONs ausentes e resolver as 6 diferenças substantivas de opções. Confirmar, para as 19 leis legadas, se a nova lei substitui ou divide o conteúdo antigo.
2. Fazer um único conversor determinístico da tabela/fichas para os JSONs ativos, com diff por lei; manter IDs vigentes ou migrar as referências do Brasil e dos programas no mesmo lote.
3. Migrar primeiro regras sem efeito monetário direto e estruturas com fonte; depois receita, despesa e patrimônio. Cada conta precisa base, pagador, recebedor, recorrência e atraso.
4. Só ligar caixa e PIB após definir parâmetros com fonte; testar identidade do caixa, dívida, tributação por base, despesa por execução, fluxo único de venda e ausência de dupla contagem.

O mapa completo por lei está em `conciliacao-financeira-json.json`. A conta monetária da planilha é uma proposta de classificação, não efeito calibrado.

## Conversão disponível

`python3 scripts/fichas/converter_financeiro.py --write` lê as abas `Índices monetários` e `Finanças por lei` de `tabela-leis-revisada.xlsx`, cruza os IDs com este mapa e gera `src/conteudo/mundo/financas-leis.json`. Sem argumento, confere as entradas sem gravar; `--check` falha se a saída estiver desatualizada. O conversor exige cobertura dos 247 JSONs ativos e referências válidas às 22 contas; agora também confere cada consequência citada e identifica as setas fiscais existentes. O arquivo gerado é uma classificação provisória, não está no manifesto do mundo e não cria efeitos no caixa ou no PIB.
