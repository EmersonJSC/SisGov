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
  Na lei contínua, `bussola.ate` diz até onde a bússola anda: de `min` na
  base da faixa até `max` em `ate`; acima disso a lei fica na ponta (100% de
  imposto é tão extremo quanto 90%). Sem `ate`, vale o máximo da faixa. Assim
  a faixa do controle (0 a 100%) não mexe no equilíbrio das leis.
- `canal` (14/nov, plano das leis): como a lei chega à vida do pop. `imposto`
  (anda junto com `calculo`), `verba` (`conta: "gasto"`), `transferencia`
  (`para`), `preco` (preço ou custo de um setor), `regra` (um módulo ou o
  arquivo do país lê a lei), `direito` (muda uma liberdade) ou `espera`, com
  `espera` dizendo o quê ("triagem" até a onda da lei, ou a mecânica que
  falta). O validador confere que o canal bate com o que a lei faz.
- **Revogar:** o pedido `mudar_lei` com `revogar: true` leva a lei ao valor
  desligado (`valorDesligado`: mínimo da régua ou primeiro degrau) e passa pelo
  Congresso como qualquer mudança; aprovado, a lei sai de `estado.leis` (volta a
  "não legislada") e os efeitos dela voltam a zero. Lei `essencial` não se
  revoga.
- **Lei pela instituição:** o efeito de toda lei em índice vale vezes o
  rendimento do órgão onde ela mora, com teto em 1 (`rendimentoDasLeis`,
  motor/governo). Lei sem órgão (regras dos poderes) rende inteira.
- **Fonte:** a planilha `docs/jogo/gdd.xlsx` (abas Leis, Leis - degraus, Leis -
  efeitos). `npm run leis` gera os JSONs; `npm run leis:planilha` faz o
  caminho de volta. Molde em `scripts/leis/molde.ts`.
