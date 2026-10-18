# Testes da Ilha Teste — alcance e lacunas

> **Status: REGISTRO DE TESTE (18/out/2026).** Descreve execuções já realizadas. Não aprova o catálogo, os coeficientes nem a jogabilidade do país.

## O que foi testado

- **No jogo:** um turno sem alterar leis; depois, expansão da rede e manutenção no nível máximo por três turnos. Foram observados os valores exibidos no mapa.
- **No terminal:** `npm run gerador:testar-ilha -- 50` executou duas partidas de 50 turnos (12,5 anos), uma sem mudanças e outra com as duas escolhas no nível máximo desde o início. O script usa `criarPartida`, `mudarLei` e `encerrarTurno`, as mesmas funções da partida. Desativou ocorrências e eleição para isolar as leis existentes; não gerou JSONs.
- **Testes automatizados existentes:** 15 passaram nos arquivos `gerador.test.ts`, `updateStock.test.ts` e `medida.test.ts`. Os oito testes de `gerador.test.ts` tratam principalmente do protótipo de empresas; não substituem o teste longo da ilha.

## Valores observados

| Turno | Cenário | Capacidade | Perdas totais | Pressão | Risco ativo? | Caixa do piloto |
| ---: | --- | ---: | ---: | ---: | --- | ---: |
| 0 | Ambos | 90 | 8 | 18 | Sim | 1.000 |
| 3 | Duas escolhas máximas | 91,19 | 7,00 | 16,50 | Sim | 905,44 |
| 8 | Duas escolhas máximas | 102,02 | 5,71 | 4,36 | Não | 769,47 |
| 50 | Sem mudanças | 90 | 8 | 18 | Sim | 1.000 |
| 50 | Duas escolhas máximas | 149,17 | 5,01 | 0 | Não | 214,83 |

Os valores são **hipóteses do cenário fictício**, não medidas reais nem efeitos calibrados. A interface mostra a pressão inteira como valor da bolha de risco enquanto a situação está ativa; por isso o risco visível inicial é 18. O motor guarda internamente o excesso acima do limiar de saída (13 no início).

## O que o teste confirmou

1. A escolha gera execução e gasto antes de surgir capacidade nova; a capacidade começa a crescer no terceiro turno da partida testada.
2. A manutenção reduz perdas comerciais; as perdas técnicas permanecem em 5 unidades hipotéticas.
3. Mais capacidade e menos perdas reduzem a pressão da rede. A situação de risco se encerra quando a pressão cai abaixo do limiar de saída.
4. O caixa do piloto permaneceu não negativo nos 50 turnos. PIB, população, inflação, desemprego e dívida ficaram fixos, como esperado para referências iniciais sem mecanismos.

## O que **não** foi demonstrado

Este é um teste de **um único setor**, com duas escolhas que afetam variáveis ligadas ao mesmo problema. Ele mostra que o motor transmite efeitos, mas **não demonstra um ciclo de país completo ou boa jogabilidade**. Ainda não existem escolhas suficientes para comparar prioridades entre saúde, educação, trabalho, impostos, orçamento e energia. PIB, desemprego, inflação e dívida não respondem às decisões. O caixa experimental não recebe arrecadação e não se concilia com receita, despesa ou dívida do governo.

Mesmo no setor elétrico, o ciclo não se sustenta: demanda não cresce, capacidade não se desgasta e não há novo choque que obrigue o jogador a reconsiderar a decisão. Depois de o risco desaparecer, a expansão máxima continua consumindo caixa e elevando capacidade acima da necessidade (149,17 contra demanda fixa de 100 no turno 50). Assim, a comparação de 50 turnos revela uma **lacuna de desenho**, não uma política vencedora.

## Problemas de apresentação encontrados

- O jornal da ilha exibiu “Trimestre calmo em Brasília”.
- O resumo exibiu “superávit de Cr 0 mi/ano” embora o módulo fiscal esteja marcado como não implementado.
- Esses textos não foram corrigidos nesta rodada de testes.

**Conclusão:** podemos usar a Ilha Teste para verificar o motor e as próximas relações que forem adicionadas ao gerador. Ainda não há base para julgar equilíbrio, realismo ou qualidade dos ciclos políticos do país.
