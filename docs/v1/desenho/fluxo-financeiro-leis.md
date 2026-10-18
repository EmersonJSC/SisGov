# Fluxo financeiro das leis — etapa 1

> **Status: RASCUNHO DE DESENHO (17/out/2026).** Descreve a ligação a implementar; não altera o motor, não calibra coeficientes e não conclui V1-38. Assinatura: gpto-revisar.

## Unidade e ordem

O período do motor é mensal; o jogador decide por trimestre. Fluxos de receita e despesa são calculados no mês de execução, enquanto cofre, dívida e capacidade são estoques. As contas fiscais são exibidas em % do PIB e convertidas para moeda pelo PIB nominal do período. A mudança do denominador deve ser distinguida de uma entrada de dinheiro.

1. A opção vigente da lei define uma regra ou alavanca, sujeita a aprovação e implantação. Ela não é, por si, receita ou PIB.
2. Uma lei tributária calcula **receita recorrente** a partir de sua base, alíquota efetiva e execução. Uma lei de gasto calcula **despesa executada**; autorização ou verba prevista não é pagamento. Uma venda de ativo gera entrada patrimonial uma vez. Emissão de dívida é financiamento, não receita.
3. Receita e despesa primárias compõem o resultado primário. Juros entram separadamente no resultado nominal. O motor aplica a regra vigente de destino do resultado ao cofre e à dívida; déficit não pode simultaneamente reduzir todo o cofre e aumentar toda a dívida.
4. Gasto pode alterar serviço ou capacidade após seu prazo. PIB só muda pelo mecanismo econômico ou setorial correspondente: demanda, capacidade, produção e produtividade. Se a atividade muda, as bases tributárias são recalculadas no período devido. A nova arrecadação fecha o ciclo.

## Contrato mínimo por efeito

Para cada opção com efeito monetário: `lei/opção`, `tipo de fluxo` (receita, despesa, financiamento ou patrimônio), `base`, `pagador`, `recebedor`, `frequência`, `atraso`, `condição de execução`, `conta de destino`, `fonte` e `parâmetro` (valor com fonte ou hipótese explícita). Uma opção sem efeito monetário direto deve dizer isso. A classificação das 22 contas em `financas-leis.json` fornece apenas parte desse contrato; não fornece valores por opção.

## Uma causa, uma entrada em cada conta

- A mesma lei não deve gerar receita tanto por uma consequência direta para `arrecadacao` quanto por um cálculo tributário novo da mesma base. Ao ativar o cálculo novo, a seta antiga correspondente precisa sair da soma.
- **Decisão aplicada ao catálogo atual:** o investimento em infraestrutura paga `gasto_publico` agora, eleva os estoques de transporte e energia com atraso de 4 passos e eleva `produtividade` com atraso de 4 passos; `produtividade-move-pib` é o único caminho ativo dessa lei até `pib`. Retirei a seta direta `investimento-em-infraestrutura--pib` (atraso de 1 passo), que antecipava e somava o benefício. A bolha genérica `infraestrutura` não recebe esses dois estoques hoje; portanto `infraestrutura-eleva-pib` não é um segundo caminho **desta lei**. Um futuro cálculo setorial poderá substituir a seta direta para produtividade quando houver base e parâmetros próprios.
- Um aumento do PIB não é entrada no cofre. Ele pode ampliar bases de tributos posteriormente, conforme cada lei tributária; venda de ativo e emissão de dívida tampouco são crescimento do PIB por definição.
- Cada lançamento fiscal deve ter identificador de origem e período para permitir conferir se foi aplicado uma única vez e explicar a mudança ao jogador.

## Primeiro ciclo para implementação

O primeiro ciclo foi exercitado em `src/tests/orcamentoNaRede.test.ts`, sempre comparando a mesma partida com e sem mudança de lei:

- IVA: alíquota maior eleva arrecadação e resultado no primeiro turno; cofre/dívida absorvem a diferença. A lei reduz consumo com atraso, o que reduz PIB e diminui a própria base tributária em relação ao cenário de consumo constante. Há uma única relação dessa alíquota para `arrecadacao`.
- Investimento em infraestrutura: mais verba eleva gasto e piora o resultado no primeiro turno. Após oito turnos de adaptação da rede, a comparação mostra produtividade e PIB maiores, desemprego menor, consumo e arrecadação maiores. O percurso existente é `produtividade → PIB → desemprego → renda das famílias → consumo → arrecadação`; os efeitos nos estoques de transporte e energia também permanecem. A arrecadação futura maior não implica que o investimento se pagou: essa conta exige comparar os fluxos acumulados.

O teste demonstra o encadeamento com os coeficientes atuais; não valida empiricamente seus tamanhos. `pib` é um índice de atividade, enquanto `pib_nominal` usado na conversão das contas é outro nó; ainda não há atualização automática desse denominador pelo índice de atividade.

O desenho detalhado de dinâmica da dívida, juros, inflação e desemprego pertence ao V1-38, que continua pendente e precisa ser dividido. Esta etapa removeu uma relação direta duplicada e verificou o ciclo existente; não escolheu novos valores numéricos nem integrou `financas-leis.json` ao carregador.

## Base consultada

- `docs/v1/desenho/minijogo-financeiro.md`, seções 3, 7–9.
- `docs/v1/desenho/estudo-unificado-gamificacao-economia.md`, seções 4–9.
- `docs/v1/desenho/rede.md`, seção 8 (cofre e dívida já decididos).
- `src/app/partida/contas.ts` e as consequências atuais das duas leis piloto.
