# Turno

`avancarTurno(regras, estado, pedidos) → novo estado`. Turno = 2 meses.
O estado anterior não muda; o acaso mora no estado, então mesma semente e
mesmos pedidos dão a mesma partida.

Ordem (plano, seção 5). Hoje (passo 5):

| #   | Etapa          | Hoje                                                                                                             |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Congresso      | pula (passo 8): todo pedido passa                                                                                |
| 2   | Leis novas     | valor muda; efeitos entram na fila (`motor/efeitos`)                                                             |
| 3   | Efeitos        | andam um turno rumo ao inteiro                                                                                   |
| 4   | Economia real  | crescimento real = tendência + sorteio; PIB nominal cresce por ele                                               |
| 5   | Preços e juros | inflação (fixa) sobe preços e PIB nominal; juros andam rumo ao alvo                                              |
| 6   | Contas         | receita, gasto e juros fecham no cofre e na dívida (`motor/contas`)                                              |
| 7   | Jogabilidade   | base do país + contribuições das leis, dentro do domínio                                                         |
| 8   | Pops e grupos  | pula (passo 7)                                                                                                   |
| 9   | Política       | pula (passos 8 e 9)                                                                                              |
| 10  | Invariantes    | números finitos, ocupados ≤ população, índices no domínio, leis válidas, cofre e dívida ≥ 0, contabilidade fecha |

O país declara só as leis que tem. Lei do mundo fora dessa lista fica **não
legislada**: não arrecada, não gasta, não mexe em índice; um pedido a
legisla e os efeitos andam de zero até o valor novo.

Comportamento esperado (passo 4): imposto de renda mais alto dá mais
arrecadação até o pico do país e padrão de vida menor, que chega em 2 turnos.
