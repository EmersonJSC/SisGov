# Leis

Formato e validador. A lei declara; o motor interpreta.

- `forma: "continua"`: valor em fração dentro de `faixa`, andando de `passo`.
  Pode apontar `calculo.base` (registro em `motor/calculos`); receita, PIB e
  juros vêm de lá, nunca de `efeitos`. Ou `conta: "gasto"`: o valor é gasto
  do governo em fração do PIB e entra direto nas contas (sem cálculo).
- `unidade` da lei contínua: `"fracao"` (padrão; `faixa` e `passo` entre 0 e 1,
  a tela mostra %), `"meses"` ou `"anos"` (`faixa` e `passo` na unidade real,
  ex.: serviço de 0 a 24 meses, passo 1; a tela mostra "12 meses"). Lei em
  meses/anos não tem `calculo` nem `conta` (esses são sempre fração). O motor
  usa o valor como vem; só a tela e a prévia convertem.
- `forma: "opcoes"`: ao menos duas opções, cada uma com seus efeitos.
- Efeito: índice de jogabilidade, `sentido` ±1, `forca` por nível (o motor
  converte em número), `atraso_turnos` até chegar inteiro.
- `bussola`: onde a lei fica nos dois eixos (econômico e social), no
  mínimo e no máximo da faixa ou em cada opção. Quem gosta sai da
  distância até cada grupo (motor/grupos).
