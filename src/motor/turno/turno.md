# Turno

`avancarTurno(regras, estado, pedidos) → novo estado`. Turno = 2 meses.
O estado anterior não muda; o acaso mora no estado, então mesma semente e
mesmos pedidos dão a mesma partida.

Ordem (plano, seção 5). Hoje (passo 4):

| #   | Etapa          | Hoje                                                                    |
| --- | -------------- | ----------------------------------------------------------------------- |
| 1   | Congresso      | pula (passo 8): todo pedido passa                                       |
| 2   | Leis novas     | valor muda; efeitos entram na fila (`motor/efeitos`)                    |
| 3   | Efeitos        | andam um turno rumo ao inteiro                                          |
| 4   | Economia real  | crescimento real = tendência + sorteio; PIB nominal cresce              |
| 5   | Preços e juros | pula (passo 5)                                                          |
| 6   | Contas         | arrecadação das leis com cálculo, em % do PIB; dívida no passo 5        |
| 7   | Jogabilidade   | base do país + contribuições das leis, dentro do domínio                |
| 8   | Pops e grupos  | pula (passo 7)                                                          |
| 9   | Política       | pula (passos 8 e 9)                                                     |
| 10  | Invariantes    | números finitos, ocupados ≤ população, índices no domínio, leis válidas |

Comportamento esperado (passo 4): imposto de renda mais alto dá mais
arrecadação até o pico do país e padrão de vida menor, que chega em 2 turnos.
