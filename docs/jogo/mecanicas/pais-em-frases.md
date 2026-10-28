# País em frases

> **Status: PROPOSTA (28/out/2026).** Aguardando aprovação do autor.
> Item 2 da ordem de 25/out no [PLANO](../../../PLANO.md).

## 1. O que é

O mapa diz como o país está em frases, não em números internos do motor.

## 2. Regras

### 2.1 O encanamento sai do mapa

Passo de conta não é indicador. O motor precisa do hiato da meta e do primário
antes do corte; o jogador não tem o que fazer com eles. Eles saem do mapa pela
área `Dados internos`, que já era a convenção.

**`medida.tecnico` não quer dizer "esconder".** Quer dizer "sem estatística
real". A aprovação do governo é técnica nesse sentido — é construto do jogo, não
número de instituto de pesquisa — e é a bolha mais importante da tela. Confundir
as duas coisas apaga a aprovação do jogo.

### 2.2 Cada bolha tem faixas com frase

No molde das réguas que já existem (`conteudo/mundo/reguas.json`): a faixa diz
até que valor vale e a frase que a descreve.

| Hoje | Depois |
| --- | --- |
| Atividade econômica: 44,7 | A economia está parada |
| Concentração de mercado: 31% | Poucas empresas dominam a maioria dos setores |

A frase descreve o **estado**, não o movimento. O movimento vem da comparação
(2.4).

### 2.3 A frase descreve, não julga

Sai o `tom: "bom" | "ruim"` das faixas. O jogo não diz ao jogador que a lei
dele é ruim nem que o caminho dele é errado: diz o que aconteceu e com o que
comparar. Quem julga é quem joga.

Isso vale também para cor: verde e vermelho julgam. A faixa pode ter intensidade
(quanto o valor é extremo) sem ter sinal (se isso é bom).

### 2.4 Comparação em vez de adjetivo

Em vez de "desemprego alto", "o desemprego é o maior desde 2017". A referência
sai de uma destas, nesta ordem de preferência:

1. **O próprio país no passado** — o motor já guarda o valor de turnos
   anteriores, e é a comparação que o jogador entende sem estudar.
2. **O país sem as decisões do jogador** (o piloto automático, já na visão como
   `semVoce`) — responde "o que eu causei?".
3. **Outro país** — só onde a comparação for honesta; exige dado de país.

### 2.5 O número não desaparece, recua

A bolha mostra a frase. O número real aparece ao abrir a bolha, na medida de
verdade (`medida.valor`), nunca nos pontos do motor.

Razão: o jogador precisa ver quanto mexeu quando muda uma lei, senão perde a
noção de causa e efeito — que é o jogo inteiro. Esconder a frase atrás do
número é ruído; jogar o número fora é tirar o aprendizado.

## 3. Entradas e saídas

- **Lê:** valor da bolha, a medida real, o valor do piloto automático
  (`semVoce`) e o histórico de turnos.
- **Entrega:** a frase de cada bolha para o mapa, o jornal e a janela da bolha.

## 4. No código

- `conteudo/mundo/reguas.json`: o molde `{ate, tom, rotulo}` já existe. Hoje são
  30 réguas, para 15 controles e 14 do PIB — **nenhuma das 148 bolhas do mapa**.
  O `rotulo` já é frase ("acima de 120% da média"); falta cobrir indicador e
  tirar o `tom`.
- `app/partida/pressao.ts`, `nosForaDoMapa`: exclui `Dados internos` do mapa.
  A parte 1 usou isso, sem código novo.
- `app/partida/visao.ts:349`: a visão já omite `medida` de quem é `tecnico`.
- `ui/mapa/formatos.ts`, `valorNaTela`: converte pontos do motor para a medida
  real; é por onde a frase entra na tela.

## 5. Fases

| Fase | O que se constrói | Estado |
| --- | --- | --- |
| 1. Encanamento fora | 11 passos de conta vão para `Dados internos`; teste que separa conta de país | **feito** (28/out, `paisEmFrases.test.ts`) |
| 2. Piloto do tom | ~10 bolhas de áreas diferentes ganham faixas com frase, para o autor aprovar o tom | a fazer |
| 3. Lote | as ~140 restantes, em lotes por área; `tom` sai das réguas de lei | a fazer |

A fase 2 vem antes da 3 de propósito: são ~440 frases no total, e escrever
todas num tom que o autor rejeita é o desperdício mais caro possível.

## 6. Testes (comportamento)

- Nenhum passo de conta tem bolha no mapa; o motor continua calculando todos.
- As coisas do país ficam no mapa mesmo sem estatística real (a aprovação).
- Toda bolha do mapa tem nome e área.
- Toda bolha com faixas tem frase em cada faixa, e as faixas cobrem a escala
  inteira sem buraco.
- Nenhuma faixa de indicador tem `tom` de julgamento.

## 7. Em aberto (decisão do autor)

1. **O tom das frases.** Jornal sóbrio ("a economia não cresce há dois anos") ou
   mais direto ("a economia está parada")? A fase 2 serve para isso.
2. **A referência de comparação** (2.4): começar só com o passado do próprio
   país, ou já usar o piloto automático ("o que eu causei")?
3. **Confirmar 2.5:** frase na frente, número ao abrir.
