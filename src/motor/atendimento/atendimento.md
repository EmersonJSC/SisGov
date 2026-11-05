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

A verba paga vagas (`custo_vaga`), e cada vaga nova custa mais que a anterior:
o retorno cai sem parar. Verba a mais vira obra, que disputa o setor de
construção com casas e rede de água. Verba a menos fecha vagas aos poucos
(`fechamento`). A corrupção encarece. `vagas_fora` guarda o que o país tem além
do que a verba paga no turno 0, para o país começar parado.

Vaga sem profissional não atende e o dinheiro fica parado: vira pontos no índice
de desvio (`desvio`). Quando a vaga fecha ou o profissional chega, os pontos saem.

Esticar a rede: Telemedicina e Serviço obrigatório fazem o profissional da rede
pública atender mais (`alcance`), andando na `velocidade`. Só rendem onde falta
profissional, e tiram a verba parada da corrupção. Quem é atendido assim conta
menos para a saúde (`fraco`), e o serviço duro faz gente largar a profissão
(`abandono`).

Seguro na folha: parte do salário paga atendimento para quem tem emprego formal,
sem sair do orçamento. Cada opção traz `valores.parte` (quem da folha entra) e
`valores.informal` (parte dos `pops_encargo` que perde o emprego formal). O
segurado entra junto com os planos, antes da rede pública, mas pesa
`peso_seguro` (paga tabela, não luxo) e o limite aos planos não o toca. Por isso
a rede pública perde profissionais, e a verba dela pode cair sem perder
atendimento. Quem fica de fora conta nos dois andares. Quem sai da folha vai para
`pop_informal` aos poucos e volta se a lei cair; `indice_informal` mostra essa
parte das pessoas.

Cobertura gratuita: cada opção traz `valores.procura` (quanto a mais cada pessoa
usa a rede pública) e `valores.saida` (parte que larga o plano). Quem procura
mais ocupa mais vaga e mais profissional, então a fila cresce e a vaga parada se
enche. Em troca, a gente na rede soma `cuidado_cedo` ao índice de vida e tira
`renda_indireta` do índice de desigualdade, por ponto de procura. O seguro não
muda.

Atendimento básico: a Atenção preventiva paga agentes da comunidade, que alcançam
parte da fila (`basico_teto`), sem vaga e sem profissional. Por pegar uma parte da
fila, rende mais no país pobre. A corrupção encarece, como nas vagas.

Saúde de dois andares: quem tem plano é atendido e o resto fica na fila. O índice
de desigualdade sobe com "com plano × na fila" (`desigualdade`). Sem fila, ou sem
plano, não há dois andares; por isso a verba também baixa esse custo, e a mesma
Abertura pesa mais no país com fila grande.

## Planos

Só tem plano quem tem renda (`renda_plano`, em vezes a renda média do turno 0,
como nas cestas). A abertura sobe a parte que compra; o limite corta, e no máximo
proíbe. Quem perde o plano volta para a fila.

## Profissionais

São o pop `pop_profissionais`, e mudam pela migração dos pops:

- entram na medida do índice de instrução, com `formatura` turnos de atraso (a
  rede escolar substitui isso depois);
- param no ritmo de `aposentadoria`: 3% ao ano, carreira de uns 33 anos;
- emigram quando a renda real cai abaixo da do turno 0: o pop encolhe, a
  população do país cai, e não voltam sozinhos.

A parte da população que emigra fica em `pop_origem`: a soma das parcelas dos
pops precisa continuar em 1.
