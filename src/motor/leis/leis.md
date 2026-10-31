# Leis

Formato e validador. A lei declara; o motor interpreta.

- `forma: "continua"`: valor em fração dentro de `faixa`, andando de `passo`.
  Pode apontar `calculo.base` (registro em `motor/calculos`); receita, PIB e
  juros vêm de lá, nunca de `efeitos`.
- `forma: "opcoes"`: ao menos duas opções, cada uma com seus efeitos.
- Efeito: índice de jogabilidade, `sentido` ±1, `forca` por nível (o motor
  converte em número), `atraso_turnos` até chegar inteiro.
- Quem apoia e quem rejeita entra no passo 7, com os grupos.
