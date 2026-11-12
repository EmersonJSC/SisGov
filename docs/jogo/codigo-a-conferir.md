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
- Código antigo ou misto, o ponto fraco: `src/tela/mapa/MapaPolitico.tsx` (2.386
  linhas, uma função de 1.387), `src/motor/turno/index.ts` (1.759 linhas;
  `estadoInicial` com 334) e `validarLei` (190).
- 53 funções passam de 60 linhas em todo o `src/`; 116 usos de `as` e 30 de `!`.
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

10. **`estadoInicial` e `turno/index.ts`.** `src/motor/turno/index.ts:~1425`.
    Cada módulo novo acrescenta algumas linhas ao estado inicial, à lista de
    etapas e ao `Pedido`. O certo é cada módulo ter o seu `iniciar*` (já temos
    `iniciarCongresso`, `iniciarGoverno`) e o `estadoInicial` só montar. Quebrar
    em funções, sem mudar comportamento.

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
