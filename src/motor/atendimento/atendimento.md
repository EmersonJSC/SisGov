# Atendimento

O índice `atendimento` conta quem é atendido quando precisa; o resto está na
fila da saúde. `saude` é outra coisa: quão saudável o país está, e recebe o
atendimento pela deriva.

## Conta

- **Planos primeiro:** quem tem plano ocupa mais o profissional (`peso_plano`) e
  paga mais, então o privado escolhe antes.
- **Rede pública:** atende o menor entre quem sobrou, as vagas e os profissionais
  que restam. Hospital sem profissional não atende.
- **Índice de profissionais:** quantos existem contra os que atenderiam todo
  mundo (`pessoas_por_profissional`).

## Vagas

A verba paga vagas (`custo_vaga`). Verba a mais vira obra, que disputa o setor de
construção com casas e rede de água. Verba a menos fecha vagas aos poucos
(`fechamento`). A corrupção encarece. `vagas_fora` guarda o que o país tem além
do que a verba paga no turno 0, para o país começar parado.

## Planos

Só tem plano quem tem renda (`renda_plano`, em vezes a renda média do turno 0,
como nas cestas). A abertura sobe a parte que compra; o limite corta, e no máximo
proíbe. Quem perde o plano volta para a fila.

## Profissionais

São o pop `pop_profissionais`, e mudam pela migração dos pops:

- entram na medida do índice de instrução (a rede escolar substitui isso depois);
- param no ritmo de `aposentadoria`;
- emigram quando a renda real cai abaixo da do turno 0: o pop encolhe, a
  população do país cai, e não voltam sozinhos.

A parte da população que emigra fica em `pop_origem`: a soma das parcelas dos
pops precisa continuar em 1.
