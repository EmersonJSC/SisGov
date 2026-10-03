# Histórico limitado

**Chamado:** SG033

**Data:** 2 de outubro de 2026

**Estado:** implementado

Uma execução agora guarda retratos anteriores com passo, valores e comandos que iniciaram o passo. O limite vem do maior atraso declarado nas relações do pacote. Assim, o motor não cresce a memória sem necessidade.

Quando uma relação futura pedir um passo anterior que ainda não existe, a leitura usa os valores iniciais do cenário. No pacote de exemplo, o maior atraso declarado é um passo; por isso apenas o retrato anterior é mantido.

O SG034 usará esses retratos para fazer o campo `atrasoPassos` produzir efeito real.
