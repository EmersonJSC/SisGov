# Dilemas com lados e notificações no tablet (V1-13)

**Status:** APROVADO E FEITO (13/out). O que o código decidiu sozinho na seção 7.

## 0. Resumo

Hoje o dilema abre a mesa do presidente sozinho, no meio da tela, e muitas
opções são "bom, médio e ruim" (dar o reajuste, negociar, cortar o ponto),
onde a do meio quase sempre vence. Com o V1-13:

1. **Toda opção tem um lado.** Cada opção ganha um ponto na bússola, do mesmo
   jeito que as leis (`bussola.md`), e tem quem ganha e quem perde. Nenhuma
   opção sai de graça.
2. **O dilema chega como notificação no tablet.** Nada abre sozinho na tela. O
   turno só passa depois que você responde os dilemas.
3. **O tablet vira tablet:** tela inicial com os apps e as notificações.

## 1. A regra dos lados

Cada dilema ganha uma entrada em `mundo/bussola.json`, ao lado das leis:

```json
"dilemas": {
  "resgate-bancario": {
    "manifesto": ["per401", "per413"],
    "porque": "Socorro com dinheiro público é Estado na economia; deixar quebrar é mercado.",
    "opcoes": {
      "salvar": [-1.5, 0],
      "fusao-forcada": [-1, 0],
      "deixar-quebrar": [1.5, 0]
    }
  }
}
```

- O lado sai dos temas do Manifesto Project, como nas leis. Para dilemas que
  têm caso real (resgate de bancos, greves, vacina obrigatória), a fonte é o
  que governos de verdade fizeram e quem defendeu cada saída.
- A importância de um dilema na bússola é 1 (já decidido em `bussola.md` 4.3).
- O verificador recusa um dilema quando:
  - alguma opção não tem ponto na bússola;
  - as opções ficam todas no mesmo lugar (distância menor que 1 entre a mais
    à esquerda e a mais à direita, nos dois eixos);
  - alguma opção só tem ganho e nenhuma perda (nenhum grupo, segmento ou
    índice piora).

### 1.1 Dilemas de governo, sem lado na bússola

Uns 15 dilemas não são de esquerda nem de direita: aliado pede ministério,
emendas secretas, escândalo do ministro, obra na terra do aliado. Neles, a
escolha é **apoio no Congresso ou confiança nas instituições**. Esses dilemas
ficam marcados com `"eixo": "governo"`. Para eles, o verificador exige que
uma opção suba a base no Congresso e baixe a confiança, e outra faça o
contrário, em vez de cobrar lado na bússola.

### 1.2 O fim do "negociar" grátis

A opção do meio continua existindo, porque governo de verdade negocia. Mas ela
passa a custar alguma coisa:

- **Tempo:** o problema dura mais (a greve segue por mais meses).
- **Os dois lados meio insatisfeitos:** cada lado perde um pouco, em vez de um
  lado ganhar tudo.

O teste de "nenhuma opção só com ganho" pega a opção do meio que estiver de
graça.

### 1.3 Revisão dos 91 dilemas

Eu passo por todos e mando a lista com o lado de cada opção e a fonte, como
fizemos nas leis. Pela leitura dos títulos das opções (estimativa, a contar
de verdade na revisão):

- uns 55 já têm lados claros (resgate bancário, vacina, população de rua,
  segurança nas escolas, petróleo);
- uns 20 são "bom, médio e ruim" e precisam de opção nova ou de custo na do
  meio (as 7 greves, as 3 obras paradas, os 3 lobbies de isenção);
- uns 15 são de governo (seção 1.1).

O V1-24 completa o conjunto depois.

## 2. Notificações no tablet

- **Nada abre sozinho.** No fim do turno, chega o jornal, como hoje. Os
  dilemas novos aparecem como notificações, com um número no botão do tablet
  na barra de cima.
- **App "Notificações"** no tablet: uma lista com os dilemas esperando
  resposta e os pedidos das bancadas do Congresso. Tocar num dilema abre a
  escolha dentro do tablet. As opções mostram só o título e o texto: os
  efeitos, as leis que mudam e a prévia de um ano aparecem depois de assinar.
  A bússola muda calada; o jogador vê no app dela (pedido do autor, 13/out).
- **O turno espera os dilemas.** Se você tenta encerrar o turno com dilema sem
  resposta, o tablet abre nas notificações. Os pedidos do Congresso não
  travam o turno: o projeto fica parado na fila até você responder.
- **A mesa do presidente** (a janela atual) sai da tela. O conteúdo dela vira
  a tela do dilema dentro do tablet.

## 3. O tablet com cara de tablet

- **Tela inicial:** ao abrir pelo botão da barra, o tablet mostra a hora do
  jogo (trimestre e ano), as notificações no topo e os ícones dos apps:
  **Jornal, Rede, Bússola, Congresso e Notificações**, cada um com o seu
  número quando tem novidade.
- **Rede** vira app próprio: os posts que hoje ficam ao lado das notícias.
- O dock de baixo continua, para trocar de app sem voltar à tela inicial.
- **A frase do rumo** (prometida no V1-10): o jornal diz "O governo está cada
  vez mais perto de …" quando o ponto da bússola anda.

## 4. Diferença do D4

Conferi `diferenciacao-d4.md` (sem abrir os arquivos do D4). A regra de lá
vale aqui: dilemas e textos do D4 não são copiados nem traduzidos, e cada
dilema é escrito a partir de caso real. O que já é nosso:

- as opções vêm de casos reais, com fonte;
- cada opção tem lado medido na bússola, pelo Manifesto Project;
- a decisão é às cegas: os efeitos e a prévia de um ano aparecem depois;
- tudo chega pelo tablet, junto com o Congresso.

## 5. Aceite

- Todo dilema tem opções com posição diferente na bússola, ou é de governo
  com a troca entre base e confiança (teste do verificador).
- Nenhuma opção só com ganho (teste do verificador).
- Nenhum dilema abre janela sozinho; a notificação fica no tablet até a
  resposta (teste da tela).
- Checagem de `diferenciacao-d4.md` feita.

## 6. Ordem do trabalho

1. Tablet: tela inicial, app Notificações, dilema dentro do tablet, a mesa sai.
2. Lados: a entrada `dilemas` na bússola, o verificador e o ponto que anda
   com a escolha.
3. Revisão dos 91 dilemas, em lotes por área, com a lista para você ler.

## 7. Como ficou (13/out)

- **Lados:** os 91 dilemas têm lado em `mundo/bussola.json` (`dilemas`). 10
  são de governo: os 3 pedidos de ministério, emendas secretas, os 3
  escândalos, obra na terra do aliado, indicação ao Supremo e sobreviver ao
  impeachment.
- **Regra do dilema de governo:** precisa haver duas opções em que a que dá
  mais base no Congresso tem saldo pior nas instituições (confiança e força
  das instituições contam a favor; corrupção e captura política, contra).
  Todos os 10 já passavam.
- **Nenhuma opção de graça:** "gasto público sobe" conta como custo. Eram 20
  opções só com ganho; cada uma ganhou um custo pequeno e coerente com o
  texto (por exemplo, indicar um jurista respeitado tira 2 pontos da base, e
  recusar a emenda da reeleição tira 3).
- **O ponto anda:** cada resposta entra na média da bússola como uma lei de
  importância 1 (`importancia.dilema`) e fica guardada na partida
  (`compass.decisoes`).
- **Na tela:** nada antes de assinar. Depois, o cartão mostra o que a decisão
  mexe e a prévia de um ano, sem a bússola. A frase do rumo no jornal (seção 3) fica para depois.
