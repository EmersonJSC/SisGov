# Fisco

Regras de dinheiro que leem leis pelo **papel** (onda 1 das leis, 14/nov). O
mundo declara em `src/conteudo/mundo/fisco/fisco.json` qual lei faz cada papel;
o motor não conhece nomes. Sem o arquivo, nenhuma destas regras vale.

## Transferência (cobertura)

- A lei de cobertura diz que fração da população recebe a transferência de um
  estrato (ex.: 25% das famílias).
- Se a cobertura passa da parte da população que é daquele estrato, o excesso
  vai ao estrato de cima: `(cobertura − parte) / cobertura` do dinheiro.
- O dinheiro total é o da lei de verba; cobrir mais gente divide o mesmo bolo.

## Juros com Banco Central

- Alvo do mercado: `taxaAlvo` (dívida e inflação, `calculos.md`).
- Com a Meta de inflação, o alvo do Banco Central soma
  `peso_da_meta × (inflação − meta)`.
- A Autonomia (opção com `valores.autonomia`, de 0 a 1) pesa o alvo do BC contra
  a Taxa básica pedida pelo governo. Sem a lei de autonomia, o governo manda.

## Regra fiscal

- A cada turno, nas contas, confere quatro regras pelo papel:
  - teto de gasto: gasto real ÷ turno 0 acima de `(1 + teto)^anos`;
  - meta de resultado: resultado primário abaixo da meta menos a folga;
  - limite da dívida: dívida acima do limite (% do PIB);
  - teto da carga: arrecadação acima do teto (fração do PIB).
- Regra que estoura pela primeira vez vira o fato `regra-fiscal-estourou`
  (grande com crime de responsabilidade).
- A punição em vigor vale enquanto houver regra estourada:
  - `valores.corte`: toda verba cai nessa fração (gasto e transferência);
  - `valores.trava`: o Congresso barra pedido que sobe uma verba;
  - `valores.crime`: o fato fica grande.
- **Piso:** a verba de uma instituição não desce abaixo de `piso × arrecadação`;
  o pedido que desce além é barrado (fato `regra-fiscal-barrou`).

## Conta da previdência

- Índice do déficit = (benefícios − contribuição) em % do PIB × pontos.
- Benefícios: o gasto efetivo das leis de verba declaradas (com a escala das leis
  que mudam o gasto, `escala_gasto`, e o corte da regra fiscal).
- Contribuição: a arrecadação da base declarada (folha).
- O índice sai da conta: efeito de lei sobre ele é ignorado.
