# Gerador interno do grafo e do conteúdo

> **Status: RASCUNHO DE DESENHO (17/out/2026).** Proposta de ferramenta de
> desenvolvimento, não regra em vigor no jogo. O gerador não aparece para quem
> joga.

O protótipo roda internamente por comando de desenvolvimento. Não há painel ou
botão no jogo. `npm run gerador:base` gera uma base experimental de 25 JSONs em
`src/conteudo/`, que o jogo carrega ao atualizar a página. Não gera o catálogo
completo nem aprende parâmetros automaticamente.

## Base mínima executável: Ilha Teste (17/out/2026)

- `scripts/gerador/baseMinima.ts` define uma ilha isolada e fictícia. PIB,
  população, inflação, desemprego, dívida e todos os valores do ciclo elétrico
  são hipóteses para testar jogabilidade, não dados de um país real.
- O gerador produz 25 JSONs: país, estado inicial, estrutura das dez áreas do
  mapa, mundo, 17 variáveis, duas escolhas de rede elétrica e 12 consequências.
  A planilha de leis não é copiada para essa base.
- Energia tem um ciclo jogável: o jogador escolhe expansão e manutenção;
  execução depende do caixa experimental, expansão tem atraso, manutenção
  reduz perdas comerciais, e o risco responde à pressão sobre a rede.
- PIB mede produção anual e não entra no caixa. Receita, despesa e resultado
  fiscal não existem na rede deste piloto; a tela os marca como não
  implementados em vez de mostrar zeros. PIB, população, inflação, desemprego
  e dívida são referências iniciais estáticas.
- As outras nove áreas aparecem no mapa como **não implementadas**. A
  Constituição, sem leis neste pacote, também recebe esse aviso. Nenhum valor
  ou lei fictícia foi criado para preencher áreas vazias.
- A geração valida o pacote, simula quatro combinações por 36 meses e as duas
  escolhas máximas por 120 meses. O relatório fica em
  `docs/v1/desenho/relatorio-gerador-base.json`. A base anterior com números
  brasileiros foi desativada; os arquivos de país dela saíram do conteúdo.
- `npm run gerador:testar-ilha -- 50` roda a partida completa no terminal,
  sem gravar JSONs: compara nenhuma mudança com expansão e manutenção máximas.
  No turno 50, a trajetória ativa ficou com capacidade 149,17 (base 90),
  perdas 5,01 (base 8), risco inativo (base ativo) e caixa 214,83 (base
  1.000). O investimento continua depois que a pressão zera: demanda e
  capacidade não têm desgaste ou crescimento espontâneo. Também faltam
  receita fiscal, ligação do caixa piloto ao orçamento e resposta política.
  Na interface, o teste encontrou textos residuais sobre Brasília e
  “superávit zero” apesar de o fiscal estar não implementado.

## Objetivo

Manter uma fonte de definição do conteúdo, gerar dela os JSONs executados pelo
jogo e iterar em rodadas: gerar, validar, simular, confrontar com evidências,
ajustar parâmetros e gerar novamente. Leis, índices, situações, atores,
programas, países e cenários são nós ou configurações do grafo. Os JSONs em
`src/conteudo/` são artefatos de saída; não são editados manualmente.

## Arquitetura proposta

1. **Definição canônica:** declara nós, unidades, controles, relações causais,
   permissões, fontes, hipótese e parâmetros ajustáveis. IDs servem para
   referência, não bastam para considerar um ciclo completo.
2. **Gerador/compilador:** converte a definição para os esquemas JSON que o
   motor já carrega. Gera todos os arquivos do pacote e um manifesto reproduzível
   da rodada.
3. **Validação estrutural e causal:** verifica campos e referências, escolhas
   com variável concreta, caminho até um resultado, retorno para uma decisão,
   unidade, atraso, sinais, proveniência, duplicidade de efeitos e conciliação
   contábil. Falhas bloqueantes impedem a gravação do pacote.
4. **Simulação:** roda casos de referência, choques, recuperação, extremos e
   combinações de políticas; mede cobertura, capacidade, resultados, caixa,
   ativos e efeitos distributivos. Parâmetros sem série empírica continuam
   identificados como hipóteses.
5. **Ajuste:** busca automática pode ajustar parâmetros numéricos declarados
   ajustáveis, dentro de faixas justificadas e com objetivo/critério explícito.
   Ela não muda o sentido jurídico, não inventa fonte e não transforma uma
   hipótese em evidência. Mudanças estruturais voltam para revisão humana.
6. **Relatório e escrita:** cada rodada salva definição, parâmetros, fontes,
   cenários, métricas, falhas e diferença para a rodada anterior. A saída só é
   promovida para o diretório carregado pelo jogo quando passa os bloqueios.

## Evidência e realidade

Todo fato empírico tem fonte, unidade, população/setor, período e método. Toda
relação sem evidência suficiente é hipótese identificada com justificativa e
incerteza. O verificador pode conferir presença, formato e rastreabilidade das
fontes; a validade substantiva depende de dados e pesquisa, não de uma nota
produzida pelo próprio simulador.

## Propriedade e empresas: ciclo piloto

Por setor, o grafo precisa distinguir participação pública e privada, estoque de
ativos, compra/venda e pagamento, aportes, investimento realizado, capacidade,
produção, custos, preços, lucro, imposto, dividendos e caixa/dívida. Compra e
venda são transações patrimoniais; investimento é fluxo de caixa e formação de
capacidade em prazo posterior; impostos e dividendos são entradas fiscais
distintas; lucro e PIB não são receita do Tesouro. A escolha constitucional
define permissões. Nenhum efeito de produtividade ou fuga de capital é
automático sem condição e mecanismo declarados.

## Critérios por rodada

- Cada lei oferece escolha compreensível, muda estado concreto e liga a uma
  consequência observável.
- Cada ciclo tem problema, decisão recorrente, recurso/capacidade, gargalo,
  estado, consequência e retorno para outra decisão.
- As opções não são todas dominadas e falhas permitem resposta/recuperação.
- Alíquotas escolhíveis podem ser extremas; arrecadação resulta de base,
  comportamento, evasão e capacidade, sem teto arbitrário herdado.
- A contabilidade fecha e não conta receita, PIB, ativos, caixa, dívida ou
  dividendos duas vezes.
- O pacote inteiro é coerente; não basta preencher IDs ou passar validação de
  sintaxe.

## Primeira entrega técnica

Criar contratos internos do grafo, um validador de completude/proveniência, um
simulador experimental para o ciclo piloto e o ajuste numérico reproduzível.
Depois, ligar o compilador aos esquemas de conteúdo e definir a base mínima do
pacote antes de gerar JSONs executáveis em massa. O catálogo completo permanece
pendente até os ciclos e fontes passarem pelos critérios acima.
