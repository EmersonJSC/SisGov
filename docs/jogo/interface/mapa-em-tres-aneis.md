# Mapa em três anéis (tarefa para o Sonnet)

Pedido do autor (30/out/2026). Mudança **só de tela**: o motor e o conteúdo não mudam.

## Leia antes

1. `CLAUDE.md` (regras do projeto: fluxo enxuto, commit com assunto, `npx tsc -b`, mostrar na tela)
2. Este arquivo
3. `src/ui/mapa/layout.ts`: `montarBase`, `posicionarBolhas`, `posicionarGrupos`, `posicoesDasBolhas`, `montarLayout`
4. `src/ui/mapa/MapaPolitico.tsx`: desenho das ligações de fundo (perto da linha 1518) e o foco/hover
5. `src/tests/mapaPolitico.test.ts`
6. `docs/jogo/interface/area-aberta.md` (como a área abre hoje; esta tarefa muda isso no passo 3)

Não abra `docs/Exemplos/`, `docs/v1/desenho/` nem `docs/referencia/`.

## A ideia

O mapa passa a ser lido **de dentro para fora**: o que você mexe, depois o que muda e, por último, quem sente.

```
            centro:   Presidência (pétreas e constitucionais, como hoje)
   anel 1 (interno):  as leis, em fatias, uma por área (11 áreas, cor da área)
     anel 2 (meio):   os índices e as situações (bolhas)
   anel 3 (externo):  os grupos sociais (medalhões)
```

- Cada bolha fica **no ângulo médio das áreas cujas leis a afetam**, com peso pela ligação. Isso **já existe**: é o `vetor` em `posicionarBolhas`. O que muda é o raio. Hoje é uma elipse com relaxamento, e as bolhas se espalham; passa a ser **um anel só**, com espaçamento angular igual ao de `posicionarGrupos`.
- Os grupos continuam no anel externo (já é assim).
- **Linhas só no foco.** Sem foco, nenhuma ligação aparece. Com o mouse numa lei, acende lei → índices → grupos afetados. Num índice, acendem as leis que o mexem e os grupos que ele pesa. Num grupo, acendem os índices dele.

## Passos (um por vez; mostrar na tela e esperar o autor antes do próximo)

### Passo 1: bolhas num anel

- Generalizar o espalhamento de `posicionarGrupos` numa função pura (ex.: `espalharNoAnel(itens, raio, espaco)`) e usá-la para índices e grupos.
- Os índices vão para um anel (círculo ou elipse única) entre o núcleo e os grupos. O ângulo de partida é o do `vetor`; o espaçamento mínimo deve caber o rótulo (`caixaDaBolha`).
- Se não couberem numa volta, usar **dois sub-anéis alternados** (par por dentro, ímpar por fora) em vez de relaxamento livre.
- `relaxar` e `desembaracar` deixam de valer para os índices. Apague o que ficar sem uso.
- `posicoesDasBolhas` (desvio quando a esfera abre) continua funcionando até o passo 3.
- Testes: manter "as bolhas ficam fora do núcleo" e "nós e rótulos não se cobrem"; adicionar "a bolha fica a menos de X graus do ângulo médio das áreas dela" (escolha X; sugestão: 35°).

Commit: `tela: índices num anel, no ângulo das áreas que os mexem`

### Passo 2: linhas só no foco

- Em `MapaPolitico.tsx`, as ligações de fundo deixam de ser desenhadas sem foco.
- Foco (hover ou seleção) acende o caminho de **dois saltos** descrito acima, com a cor da área de origem.
- Respeitar o modo noturno e o que já existe de foco/lente; não mexer na câmera.
- Teste: "toda seta corresponde a uma consequência do conteúdo" continua passando; adicionar um teste da função pura que diz quais ligações acendem para um foco (tire essa função do componente se ela não existir).

Commit: `tela: ligações acendem só no foco`

### Passo 3: áreas viram fatias com as leis à vista

**Antes de começar, confirme com o autor**: é o passo maior e muda a `area-aberta.md`.

- As esferas que inflam dão lugar a **setores de anel** fixos, um por área, com ângulo proporcional ao número de leis (com mínimo, para áreas pequenas).
- As leis (cerca de 230 em vigor) ficam dentro do setor como fichas, agrupadas por ministério na ordem que `montarBase` já calcula.
- Nível de detalhe pelo zoom: de longe, ponto colorido (tamanho pela intensidade, como hoje); de perto, ficha com nome.
- Pétreas e constitucionais continuam na Presidência, como hoje (`ficaNaPresidencia`).
- O "abrir área" vira dar zoom no setor. `posicoesDasBolhas` (o desvio) deixa de ser necessário.
- Testes a refazer: "cria uma esfera por ministério…", "a Presidência aberta reúne…", "o foco revela as leis ligadas…". Troque por: um setor por área, sem sobreposição; toda lei em vigor dentro do setor da sua área; os setores somam 360°.

Commit: `tela: áreas em fatias, leis sempre à vista`

## Regras

- Tudo em `src/ui/mapa/`. O motor não lê posição (regra 6).
- Funções de posição continuam puras e testadas.
- `npx tsc -b` e os testes do mapa a cada passo. `npm run check` só ao fim do passo 3.
- Mostrar na tela (screenshot) antes de dizer que um passo está pronto: visão geral, um foco numa lei e um foco num índice.
- Sem `git push`. Atualizar o `RETOMAR.md` ao encerrar.
- Se travar três vezes no mesmo ponto, parar e perguntar ao autor.

## Pronto quando

- De longe, o mapa mostra três anéis legíveis, sem linhas cruzando.
- Passando o mouse numa lei, dá para seguir lei → índice → grupo sem procurar.
- Nenhuma bolha nem rótulo se sobrepõe; os testes do mapa estão verdes.
