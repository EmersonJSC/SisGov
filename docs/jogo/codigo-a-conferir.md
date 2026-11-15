# Código a conferir

Lista para um modelo mais forte (ou uma pessoa) revisar o que foi escrito nos
passos 1 a 5 da ordem de construir (12/nov/2026). Cada item diz **onde**,
**o que me preocupa** e **como conferir**. Marquei o que eu **não verifiquei**
com "(não verificado)": são dúvidas, não defeitos provados.

Não é lista de tarefas: é lista de conferência. Quem revisar anota o resultado
ao lado (✅ ok, ❌ defeito, 🔧 melhorar) e o autor decide.

## Retrato de hoje (12/nov, depois do passo 5)

- 874 testes verdes, `npm run check` verde, 0 `any`, 0 `@ts-ignore`, 0
  `eslint-disable`.
- Código novo do motor (`politica`, `governo`, `mesa`, `fatos`): a maior função
  tem 53 linhas (`notaDoPartido`); as demais ficam abaixo de 48.
- Código antigo ou misto, o ponto fraco: a camada da tela (`MapaPolitico.tsx`
  com 2.386 linhas e uma função de 1.387; as janelas e o CSS), que vai ser
  reformulada e por isso ficou de fora da limpeza.
- Depois da limpeza de 12/nov: fora da tela sobraram 6 funções acima de 60
  linhas (61 a 102, quase todas montam um registro grande); na tela são 32,
  para a reformulação. `turno/index.ts` caiu de 1.759 para 96 linhas.
- 116 usos de `as` e 30 de `!` no `src/` (não revisados um a um).
- O hook `typescript-patterns-enforcer` reclama de números dentro de tabelas
  nomeadas e de laços `for`; o projeto inteiro usa os dois e eu segui o
  costume. Decidir se vale impor a regra do hook ou desligá-la.

## A. Regras do jogo: conferir se fazem o que o GDD diz

1. **O voto, a conta de cada partido.** `src/motor/politica/voto.ts`,
   `notaDoPartido` e `contar`.
   - Os pesos (0,5 grupos, 0,2 povo, ±0,4 lado, 0,3 ministro…) são de partida,
     não calibrados. No Brasil cerca de 30% das cadeiras aparecem como
     "indecisos" na maioria das leis; provavelmente alto demais.
   - `Math.round(n × coesão)` pode dar 0 fiéis em bancada de 1 ou 2 cadeiras
     (Senado pequeno). (não verificado com bancadas pequenas)
   - Exorbitante é `!aprovada && passaria sem a conta`. Conferir se isso bate
     com "a lei que perde a maioria pela conta" quando o déficit é zero.
   - O governo sempre vota sim; só nega se for exorbitante. Conferir se isso
     esconde leis ruins do próprio governo.

2. **A pauta, as casas e a sanção.** `src/motor/politica/pauta.ts`.
   - Se há uma lei esperando carimbo na mesa e o jogador propõe a mesma lei de
     novo, `entrarNaPauta` troca a pauta mas não a `sancao`: podem coexistir
     dois fluxos da mesma lei. (não verificado)
   - Lei emendada que depois cai na Câmara de volta: `negar` a barra por 2
     turnos; conferir se é o que se quer (a lei original já tinha passado no
     Senado).
   - `desde <= turno` decide quem é papel pendente; conferir os dois extremos
     (papel que chega no último turno antes da eleição).

3. **Decreto derrubado volta ao valor errado.** `src/motor/politica/moedas.ts`,
   `decretosVencidos`. Se a lei não existia antes (`antes` indefinido) volta
   para o mínimo da faixa, o que não é o mesmo que "não legislada" (a lei fica
   escrita com valor mínimo e entra em `leis`). (não verificado)

4. **Moedas: ordem de validar e gastar.** `moedas.ts`, tabela `COMPRAS`.
   - `cargos` e `emenda` gastam a reserva antes de `pagar`; se uma falha depois
     o turno todo é descartado (a sessão é local), mas conferir que nenhum
     estado de fora é tocado.
   - Promessa: o prazo conta `turno + 4`; conferir o caso do turno de eleição.

5. **Fatos que dependem do tamanho.** `src/motor/politica/relacao.ts`
   (`ressentidos`) lê `ministro-demitido` com `turno === e.turno − 1`. Isso só
   funciona porque o fato é **médio** (fica 2 turnos na mesa). Se alguém trocar
   o tamanho para pequeno, o ressentimento some em silêncio. Vale um teste que
   falhe, ou ler o fato de outro jeito.

6. **Efeito da lei com ministro.** `src/motor/efeitos/index.ts` (`enfileirar`) e
   `src/motor/governo/ministerios.ts` (`ajusteDaLei`).
   - A lei de **partida** (`filaInicial`) não passa pelo ministro: os efeitos do
     começo valem como a lei escreve, e só as leis novas sofrem o ajuste. Isso é
     coerente? Mudar uma lei e desfazer a mudança dá força diferente da de
     partida.
   - Quando o efeito novo é zero (lei volta ao mínimo) o atraso vem da entrada
     antiga e o ajuste não entra.
   - O atraso do ajuste pode transformar atraso 0 em 1 (ministro fraco). Aceitável?

7. **Caixa e órgão.** `ministerios.ts` (`caixaDaLei`) e `orgaos.ts`.
   - O órgão é por esfera, mas a caixa é achada por uma heurística (`dePedaco`:
     a caixa que cita qualquer subesfera da esfera). Para esferas repartidas
     entre duas caixas (Cultura/Esporte, Meio ambiente/Povos indígenas) o órgão
     fica sob a primeira que aparece. Conferir no Brasil quais esferas caíram
     no gabinete e se isso faz sentido. (não verificado esfera por esfera)
   - `necessidadeAgora` usa "5% por lei ativa a mais"; conferir se leis que
     ligam e desligam no mesmo turno não fazem o rendimento oscilar.
   - A corrupção começa no equilíbrio (`corrupcaoDeEquilibrio`); se o ministro
     for trocado, a corrupção anda devagar (8% por turno). Conferir se o
     jogador percebe o efeito da troca.

8. **Mesa.** `src/motor/mesa/index.ts`. A mesa é refeita a cada turno a partir
   de `sancao` e das votações; conferir que nenhum aviso se perde se o jogador
   salvar e carregar no meio (o aviso depende das votações do turno).

9. **Salvar e carregar.** `src/partida/salvar.ts`. Partida antiga sem `governo`
   ou `mesa` recebe o estado de uma partida nova; conferir que um jogo salvo
   com ministros trocados não volta aos ministros do país por engano (o `??`
   preserva o salvo, mas o teste só cobre `congresso` e `fatos`).

## B. Manutenção e limpeza

10. **`turno/index.ts` foi dividido (12/nov).** As etapas foram movidas para
    `src/motor/turno/etapas/*.ts` (uma por assunto), `estadoInicial` para
    `inicio.ts` e quebrado em conferências e montadores pequenos. Foi uma
    mudança só de lugar, feita por script (`arquivo/_dividir_turno.cjs`,
    fora do repositório); os 874 testes passam. Conferir: nenhuma etapa ficou
    com dependência circular perigosa entre arquivos (hoje funciona porque só
    há funções e constantes de seta); `estadoBase` (63 linhas) ainda monta o
    estado inteiro de uma vez.

11. **Campos opcionais no estado.** `Estado` tem `congresso?`, `mesa?`,
    `governo?`, `fatos?`. Cada um gera `?? []`, `if (!regras.governo ||
!estado.governo)` e `as NonNullable<…>` espalhados (por exemplo em
    `entradaDoCongresso`). Avaliar: campos obrigatórios com valor vazio e uma
    migração em `salvar.ts`.

12. **Duas fontes da verdade para campos das leis.** `classe`, `esfera` e
    `subesfera` vêm da planilha, mas as 68 leis escritas à mão (sem
    `"origem": "planilha"`) foram corrigidas por **script de uma vez**; o
    exportador não as toca. Se a planilha mudar, elas ficam para trás sem
    aviso. Fazer o exportador conferir (e avisar) em vez de ignorar.

13. **Geração dos dados.** `scripts/gerar-governo.ts` sorteia as pessoas com
    semente fixa e **sobrescreve** `governo.json`. Se alguém editar o arquivo
    à mão, rodar o script apaga a edição. Decidir: o arquivo passa a ser dado
    mantido à mão (e o gerador só cria o primeiro rascunho)?

14. **Caches por identidade.** `src/motor/governo/indices.ts` usa `WeakMap`
    pelo objeto `leis`/`moldes`. Se alguém clonar ou mudar esses objetos, o
    cache só perde a vantagem (ou, se mutar, fica velho). Conferir que ninguém
    muta `regras.leis` depois de criar a partida.

15. **Votar duas vezes por chamada.** `voto.ts` `votar` calcula `contar` duas
    vezes (com e sem a conta) para achar o exorbitante, e a tela chama isso a
    cada movimento da régua. Medido: ~1 a 2 ms, dentro do orçamento (`npm run
medir`). Se crescer, calcular a nota uma vez e separar só o termo da conta.

16. **Funções grandes na tela, que cresceram nos passos 2 a 5.**
    `ResultadoDoTurno.tsx` (209 linhas), `Governo.tsx` (184),
    `DocumentoLei.tsx` (279), `BarraDoTopo.tsx` (215). O JSX tem retornos
    longos e callbacks inline. Extrair componentes (lista de partidos, lista de
    caixas) e funções puras para o que não é JSX. `MapaPolitico.tsx` já era
    assim antes dos passos.

17. **CSS que só cresce.** `src/tela/mapa/mapa.css` passa de 8.500 linhas e
    meus blocos foram colados no fim. Agrupar por janela (Mesa, Governo,
    Placar), ou separar em um arquivo por janela.

18. **Testes frágeis ao formato do estado.** `src/partida/partida.test.ts`
    (`comPapel`, `comMinistro`) monta o estado à mão; mudar o formato quebra
    esses testes mesmo sem mudar o comportamento. Criar um construtor de estado
    de teste num lugar só.

19. **Constantes soltas.** Os pesos do voto estão em `voto.ts`, as demais em
    `constantes.ts` (tramitação) e `orgaos.ts`/`ministerios.ts` (governo).
    Decidir um lugar só para o que será calibrado, com nome e unidade.

## C. Dados e ferramentas

20. **A planilha foi regravada por script Python (openpyxl).**
    `docs/jogo/leis.xlsx` recebeu a coluna **Classe**. O openpyxl pode perder
    coisas que o LibreOffice grava (formatação condicional, validação de dados,
    larguras, comentários). O arquivo ficou parecido (401 KB contra 399 KB, 44
    partes nos dois) e há cópia de antes em `arquivo/leis-antes-classe.xlsx`,
    mas **ninguém abriu a planilha depois**. Conferir no LibreOffice: formatação,
    filtros, abas. (não verificado)

21. **Nomes das pessoas.** Os nomes são "nome comum + sobrenome montado de
    sílabas". Não há garantia de que nenhum coincida com pessoa real. Olhar a
    lista das 81 pessoas de `paises/brasil-2026/governo.json` antes de mostrar
    o jogo a alguém.

22. **Ordem das fases do turno.** `src/motor/turno/index.ts`, `ETAPAS`: o
    Congresso vem primeiro, o governo (fase 8b) logo antes da política. Conferir
    que `governo` lê as leis já atualizadas e que os fatos que ele escreve só
    são lidos pelo Congresso no turno seguinte (é o desenho atual).

## D. Perguntas de desenho para um modelo mais forte

- A **sessão mutável** de `src/motor/politica/sessao.ts` (fases que alteram uma
  cópia) é melhor que funções puras que devolvem o estado novo? Ganhei
  legibilidade e perdi garantia de imutabilidade; o estado de fora nunca é
  tocado, mas isso depende de disciplina.
- O motor cumpre a regra "não conhece nomes"? As chaves `ministerio`,
  `cargos`, `emenda` e `decreto` das moedas são do jogo, não de um país; mas
  `LeisDoCongresso` aponta ids de lei do mundo (`quorum-das-votacoes`,
  `poder-de-decreto`) dentro de `congresso.json`. É aceitável?
- A **mesa de fatos** (`motor/fatos`) comunica de verdade os módulos, ou o
  Congresso, a Mesa e o Governo ainda se conhecem por tipos e pelo `turno`?
  Hoje o `turno` liga todos e injeta funções (`candidato`, `ministros`).
- O custo do turno escala? Hoje ~10 ms (Brasil). Estados, governadores e o mundo
  leve vão multiplicar. Onde pôr o orçamento e o teste de regressão de tempo.

## E. A limpeza de 12/nov: o que conferir

Tudo abaixo foi refatoração sem mudar o comportamento, protegida pelos 874
testes. Os testes não cobrem tudo; conferir estes pontos:

23. **Ordem das mensagens de `invariantes`.** `etapas/invariantes.ts` virou uma
    lista de conferências. A ordem em que as falhas aparecem na mensagem mudou
    um pouco (desgaste vem antes de casas, rede de saneamento e atendimento).
    Só importa se algum teste ou tela depender da ordem exata.
24. **Validadores quebrados em funções** (`leis/validar.ts`, `mercado/index.ts`,
    `mercado/capacidade.ts`, `mundo/index.ts`). Conferir que nenhuma regra de
    validação se perdeu na quebra: comparar a lista de mensagens de erro de
    antes e depois. `conferirEfeitosDeReacao` passou a ser compartilhado entre
    o mercado e as capacidades.
25. **`partida/visao.ts`** (`ligacoes`, `montarVisao`, `visaoDoMercado`,
    `visaoDaLei`) e **`partida/previa.ts`** foram divididos; as setas e as
    linhas da prévia saem na mesma ordem (conferido nos testes de visão), mas a
    tela não foi reaberta depois: abrir o mapa e uma lei de saúde e de
    saneamento.
26. **`motor/atendimento`** (`andarAtendimento`, `pontosDoAtendimento`):
    extraídas `andarVagas`, `andarPlanos`, `redeDasLeis`. É código numérico:
    conferir que as contas ficaram idênticas (as expressões foram copiadas, não
    reescritas).
27. **`estadoInicial` e as conferências do país** (`turno/inicio.ts`): a ordem
    em que os erros do país são lançados é a mesma, mas agora há um
    `erro(): never` e três auxiliares (`faltaIndice`, `faltaPop`, `faltaLei`)
    que juntam mensagens parecidas. Conferir as mensagens de erro.
28. **Restam 6 funções acima de 60 linhas fora da tela:** `atendimentoInicial`
    (102), `previaDoAtendimento` (93), `segurancaDaCesta` (65), `estadoBase`
    (63), `andarMoradia` (61), `previaDoSaneamento` (61). Quase todas montam um
    registro grande; vale decidir se dividir ajuda ou só espalha.

## F. Programas (passo 6, 12/nov)

29. **Direção e mínimo lidos da planilha** (`scripts/gerar-programas.ts`,
    `motor/programas/direcao.ts`). A planilha tem 30 jeitos de dizer a direção
    ("aberto", "mais livre", "mais punido", "mais curto"…); tudo que não começa
    com "desce" ou "igual/muda" foi lido como `sobe`. Em lei de escada, "sobe"
    só está certo se a escada vai no mesmo sentido do texto. Conferir as ~20
    direções que o script lista ao rodar.
30. **"Andou" é posição na régua** (`posicaoNaRegua`): régua contínua usa
    `(valor − min) ÷ (max − min)`; escada usa `índice ÷ (n − 1)`, então os
    degraus valem o mesmo mesmo em escadas de tamanhos diferentes. Mínimo
    `degrau` = um passo da régua. Conferir em leis de faixa muito larga (a
    verba da saúde vai de 0 a 1; 10% da régua é muito).
31. **Mínimo "1 fatia"** (leis de divisão de 100%) foi lido como 10% da régua;
    foi chute.
32. **Espera do ministro mais fraco.** Li "anda no passo do ministro mais
    fraco" como: o programa espera o maior atraso entre as leis (0 ou 1
    turno). Pode ser que o autor quisesse outra coisa (ex.: força da
    lembrança).
33. **Referência por programa formado.** Programa formado guarda o valor das
    leis do mandato em que se formou; só se desfaz se elas voltam abaixo do
    mínimo contra esse ponto. Conferir se isso é o que se quer quando o
    mandato muda (hoje: o programa sobrevive ao mandato novo).
34. **Nomes do país** em `paises/brasil-2026/programas.json` (Farmácia Popular,
    Saúde da Família, Bolsa Família): escolhi três da coluna "programas reais
    parecidos". Nomes de programas, não de pessoas.
35. **Programas que o país já tem** (`programaDeAntes`). Nascem formados com
    referência vazia ("desde sempre") e lembrança calculada das leis de hoje
    (Brasil: os 3 declarados). Conferir se a lembrança calculada diz o que o
    Brasil real sentiu (quem gosta do Bolsa Família etc.); o país pode
    declarar a sua à mão.

## G. Jornal mínimo (passo 7, 12/nov)

36. **Tabela de apelo por tipo de fato** (`motor/midia/jornal.ts`): números
    chutados (eleição 3, escândalo 2,5, programa 1,5…). Só decidem qual
    manchete abre o jornal.
37. **Audiência das mídias** (`scripts/gerar-midias.ts`): fórmula
    `alcance × (1 − distância/máxima)²` entre a bússola do grupo e a da mídia.
    Os alcances e as bússolas das 9 mídias do Brasil são palpite; as mídias
    são inventadas, sem marca real.
38. **Manchetes saíram do `switch` da tela** para
    `mundo/jornal/manchetes.json` + `partida/jornal.ts`. O texto é o mesmo;
    conferir a tela do Resultado do turno com os 24 tipos de fato.

## H. Eleição nova (passo 8, 12/nov)

39. **Segundo turno** (`eleicao/votos.ts`): quem votou numa chapa que saiu vai
    para o governo na proporção da semelhança entre elas, vezes 0,25
    (`REJEICAO_AO_GOVERNO`), mais um piso de 0,1; o resto vai ao rival. Com a
    rejeição em 1, o governo parado do país de teste vencia o segundo turno e
    quebrava 3 testes antigos; 0,25 foi o valor que manteve "parado perde".
    Conferir o desenho do segundo turno com o autor.
40. **Constantes da promessa** (`eleicao/promessa.ts`): tamanho cheio com 30%
    do domínio, efeito máximo 0,06 no voto, desgaste 1 por promessa cheia
    quebrada, pesos 2 e 0,25 para quem se importa ou não. Tudo palpite.
41. **Coligação da oposição** (`eleicao/chapas.ts`): semelhança (cosseno) de 0,6
    entre o que os partidos defendem; ordem do maior para o menor. No Brasil
    saíram 4 chapas (a pesquisa mostra "PSDB + Novo + Cidadania" etc.). A
    coligação pode estar juntando partidos que o autor não juntaria.
42. **Perda no último turno jogável.** Perder a eleição encerra a partida no
    turno M (não no M−1), como o primeiro turno cai no M−1: a etapa `eleicao`
    e o teste "governo parado perde no turno 24" conferem. Antes a eleição
    única também era no turno M.
43. **Etapa Política dividida**: a eleição saiu de `etapas/politica.ts` para
    `etapas/eleicao.ts`; reiniciar o mandato (zerar cargos e emendas usados)
    foi junto. Conferir que nada ficou para trás.

## I. Passo 9 (começo da partida)

44. **Elenco sorteado** (`motor/pessoas/gerar.ts`): notas normais em torno de 55 com
    desvio 18; bússola em torno do partido de origem (0,25) e dos técnicos (0,45);
    30% de técnicos; 160 pessoas no Brasil. Tudo palpite; o jogo fica bom ou ruim
    conforme o elenco que sai.
45. **Partido do jogador** (`motor/pessoas/partido.ts`): 6% das cadeiras, tiradas dos
    partidos da chapa; defende os 5 grupos mais perto da bússola da chapa, peso
    total 1,2. A "Aprovação alta" do R4.9 não foi feita.
46. **Ministros sorteados** (`motor/pessoas/ministros.ts`): nota = competência +
    0,8 × afinidade com a chapa + 0,3 × acaso, caixa por caixa na ordem do país
    (guloso: as primeiras caixas ficam com os melhores).
47. **Perfil de rede** (`mundo/pessoas/perfil.json`): 3 frases por eixo e tom, escritas
    pelo Claude; "segue" são as 3 pessoas mais próximas na bússola. Conferir o tom
    dos textos e se algum denuncia o lado.

## Auditoria da Parte 1 (14/nov)

Achado pela auditoria dos requisitos (`docs/jogo/auditoria/parte-1-auditoria-*.md`). Não apagar sem pedido.

- **Aprovação em três cálculos:** `popularidade_governo` (declarado pelo país, 3 leis mexem, ninguém lê: morto); `satisfacaoMedia(grupos) - desgaste` (`partida/index.ts:435`, `motor/eleicao/index.ts:66`, em uso); `aprovacao(grupos)` em `motor/politica/voto.ts:113` (cópia da média, devolve 50 sem pessoas).
- **Cadeiras do partido novo (6%)** contadas duas vezes: `motor/pessoas/partido.ts:66` (Câmara) e `partida/comeco.ts:105` (Senado).
- **Nome e sigla do partido** validados em `partida/comeco.ts:57` e `tela/inicio/escolhas.ts:57`.
- **Turnos por ano, meses por turno e mandato de 24 turnos** repetidos em 10 arquivos; `TURNOS_DO_MANDATO` (`motor/governo/index.ts:142`) e `DESGASTE_POR_TURNO = 2.25 / 24` ignoram a duração do mandato do país.
- **Atraso do efeito** calculado por caminhos diferentes na prévia (`partida/previa.ts:364`, sem o ministro) e no turno (`congresso.ts:278`, com `ajusteDaLei`): os números podem divergir.
- **Distância na bússola** em três lugares (`pessoas/ministros.ts:96`, `grupos/index.ts:201`, `pessoas/partido.ts:20`).
- **Eleição:** `apurar` morta (antiga) ao lado de `primeiroTurno/segundoTurno`.
- `TECNICO` declarado 8 vezes; `limitar`/`prender`/`entre` redefinidos por módulo.
- Campo `parte_de` das leis: ninguém lê.
