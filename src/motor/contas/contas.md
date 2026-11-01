# Contas

O Tesouro em cinco contas separadas. Juros não descontam da receita: são
uma linha própria.

| Conta   | O que é                                    | Tipo           |
| ------- | ------------------------------------------ | -------------- |
| Receita | leis com cálculo + `receita_fora_das_leis` | fluxo do turno |
| Gasto   | leis de gasto + `gasto_fora_das_leis`      | fluxo do turno |
| Juros   | taxa de juros × dívida                     | fluxo do turno |
| Cofre   | dinheiro guardado no Tesouro               | estoque        |
| Dívida  | o que o país deve                          | estoque        |

Por turno (2 meses), na moeda do país:

- primário = receita − gasto; nominal = primário − juros.
- **Sobra:** vai para o cofre. Abater dívida é decisão de lei futura
  (regra fiscal), não automática.
- **Falta:** sai do cofre; acabou o cofre, emite dívida.
- A dívida não vence: o governo paga os juros e rola o principal.

Os estoques ficam em dinheiro no estado (`tesouro`); os essenciais mostram
tudo em % do PIB (fluxos anualizados).

**Contabilidade fecha** (invariante, todo turno): a variação de
cofre − dívida é igual ao resultado nominal do turno.

`receita_fora_das_leis` é o imposto que ainda não virou lei. Cada lei de
imposto do passo 6 tira a sua parte desse número. Do mesmo jeito,
`gasto_fora_das_leis` é o gasto que ainda não virou lei (previdência,
salários…); o país declara `gasto_publico` = leis de gasto + esse número, e a
partida confere ao carregar.

Comportamento esperado (passo 5):

- imposto de renda baixo → déficit, a dívida sobe; alto → sobra vai para o
  cofre e a dívida para de subir;
- dívida inicial acima da tolerância do país → juros sobem ao longo do
  mandato; abaixo → ficam perto de neutro + inflação.

Fora deste passo: calote, emissão de moeda, inflação que se move, prazo da
dívida, dívida externa.
