# Análise técnica e de game design do SisGov

15/nov/2026. Fiz a análise lendo o código e rodando as ferramentas do projeto, sem me apoiar no GDD. Ela é crítica de propósito: o que já está bom aparece rápido, e o resto do texto fica com o que preocupa.

## Números medidos hoje

| Medida | Valor |
| --- | --- |
| Código (sem testes) | ~31 mil linhas TS/TSX |
| Commits desde o recomeço (31/out) | 201 em 15 dias |
| `npx tsc -b` | limpo |
| Testes | 1132 passando, 62 arquivos, **88 s** |
| Turno (`npm run medir`) | 23 ms; mandato de 24 turnos em 0,46 s; placar 0,9 ms |
| Leis no mundo | 511 |
| Leis com `canal: "espera"` (o mecanismo próprio delas não existe) | **336 (66%)** |
| Etapas por turno | 21 |
| Campos opcionais (`?:`) em `Estado` | 27 |

---

## 1. O que está certo (e vale proteger)

1. **A separação em camadas é boa, e o lint obriga a respeitá-la.** O motor é TS puro, a partida faz a cola, a tela só mostra. A maioria dos projetos de jogo de uma pessoa só perde essa disciplina no primeiro mês. Aqui ela está no `eslint.config.js`, então quebrar a regra quebra o lint.
2. **O turno é uma função pura e determinística.** `avancarTurno` reduz o estado por uma lista de etapas, e o acaso viaja dentro do estado. Isso dá save trivial, replay, testes reproduzíveis e scripts que jogam partidas no terminal. É a decisão técnica mais acertada do projeto.
3. **Os invariantes rodam a cada turno.** Contabilidade que não fecha lança erro e não fica escondida. Num simulador econômico, isso evita meses de bug silencioso.
4. **O desempenho sobra.** 23 ms por turno é cerca de 40 vezes mais rápido do que o jogo precisa, porque o jogador passa o turno com um clique e espera bem mais que isso.
5. **O conteúdo vem de uma fonte só.** A planilha vira JSON passando pelo validador do motor (`npm run leis`), e uma lei inválida não entra.

---

## 2. Tecnologias: fazem sentido?

| Escolha | Veredito | Comentário |
| --- | --- | --- |
| TypeScript strict | **Certa** | O jogo é regra e dado, e o tipo pega muito erro de formato |
| React 19 | **Certa para os painéis, discutível para o mapa** | Janelas, mesa e formulários combinam com React. O mapa de ~600 bolhas já precisou fugir do React: a câmera escreve direto no `viewBox`, e o fundo é um canvas. É o sinal clássico de que o mapa quer ser canvas puro, ou Pixi. Ainda não precisa trocar, mas qualquer efeito visual novo no mapa vai doer |
| Vite + vite-node | **Certa** | Rápido. O `import.meta.glob` prende os scripts ao vite-node (o `tsx` não serve), e isso já está anotado |
| d3-force | **Certa, com custo** | Dá o visual "orgânico", mas o layout muda conforme a física. O jogador não cria memória espacial ("a saúde fica ali em cima"), e num jogo de 511 leis memória espacial é usabilidade |
| SVG + canvas híbrido | **No limite** | Funciona com 600 nós. Com 800 ou mais nós, mais animação e filtros, o gargalo vai aparecer |
| Navegador, sem servidor | **Certa** | Nada no jogo pede servidor. Para distribuir na Steam depois, o caminho é Tauri ou Electron por fora, sem reescrever nada |
| `localStorage` | **Serve para a V1, não para o jogo final** | Um slot, limite de ~5 MB por origem, e o save some se o navegador limpar os dados. Para a V1 basta. Antes de ter jogador de fora: IndexedDB ou exportar e importar arquivo |
| exceljs, planilha como fonte | **Boa para o autor, frágil para o código** | O xlsx não tem diff legível no git. Editar o JSON à mão é sobrescrito na próxima exportação. Existe um `manifest-leis.json` com 220 ids mortos, e os ícones estão quebrados porque 90 leis mudaram de esfera. São sintomas de mais de uma fonte da verdade |
| Vitest | **Certa** | O problema não é a ferramenta, é o que se testa (ver §4) |

**Conclusão:** a pilha não precisa mudar. Não há motivo para engine de jogo, backend ou banco. O único ponto técnico que vai cobrar a conta é o mapa, e mesmo ele só depois da V1.

---

## 3. O escopo mudou? Sim, e o código não acompanhou

O escopo da V1 (plano, seção 0, de 15/nov) diz que *"o código que já existe dessas partes fica, desligado"*. Medido no `criarPartida`:

| Fora da V1 pelo plano | Situação no código |
| --- | --- |
| 5.7 Judiciário | **desligado** (`comJudiciario` falso por padrão) ✔ |
| 2.2 Demografia | **ligado**: `demografia: carregarDemografia()` |
| 2.7 Organizações | **ligado**: `organizacoes: carregarOrganizacoes()` e etapa no turno |
| 2.8 Saída (informal, emigrar) | **ligado**: `saida: carregarSaida()` |
| 2.9 Estados | **ligado** quando o país tem `estados.json` (o Brasil tem) |
| 4.8 Programas | **ligado**: etapa `programas` |
| 3.2 Empresas/obras, 3.4 Lucro, 3.8 Pregão | lucro e obras rodam em `economia.ts`/`construcoes.ts`; `Pregao.tsx` e `Mercado.tsx` estão na tela |
| 7.1–7.6 Mundo | **ligado**: opinião das potências, reputação, defesa (etapa `mundo`) |

Na prática, a V1 roda quase todo o motor de um jogo maior. Isso tem três custos concretos:

1. **Balancear fica mais difícil.** Cada número que o jogador vê sai de 21 etapas acopladas. Quando "o desemprego subiu", ninguém sabe se veio da lei, da demografia, da emigração ou da obra.
2. **Os invariantes e os testes protegem também o que nem está no escopo.** Um bug na organização política derruba a partida da V1.
3. **O jogador não sente a decisão,** que é a única métrica da V1 segundo o próprio plano. Ruído de sistemas fora do escopo encobre o sinal da lei.

**Recomendação, que é barata porque a arquitetura já permite:** todo módulo já é opcional em `Regras`. Basta um conjunto `V1` em `criarPartida` que não carregue demografia, saída, organizações, territórios, programas e mundo (com preços externos fixos). É uma mudança de comportamento, então pede aprovação do autor, mas são poucas linhas.

### O escopo de tecnologia também mudou

- O mapa começou como "a única tela", com bolhas soltas no estilo do Democracy 4. Hoje tem hierarquia (trindade → ministros → instituições → leis), anéis, câmera própria e medidor de quadros. Virou um motor gráfico pequeno dentro do React. Ninguém decidiu isso de uma vez: aconteceu por acúmulo.
- O save nasceu simples (`versao: 1`), mas o formato do `Estado` mudou dezenas de vezes e continua `versao: 1`. A compatibilidade virou 27 campos opcionais e uma pilha de `?? nova.estado.x` em `carregarPartida`. Isso funciona até o dia em que um campo muda de **significado** e não só aparece.

---

## 4. Crítica de engenharia

### 4.1 Velocidade e tamanho
31 mil linhas em 15 dias (com reaproveitamento do projeto antigo) é muito código para um jogo que ainda não tem um mandato divertido de ponta a ponta. O código não é ruim. O risco é outro: **cada linha é coisa que precisa continuar certa quando o equilíbrio mudar.** O projeto já recomeçou uma vez (31/out). O padrão a evitar é construir largura até o peso obrigar a recomeçar de novo.

### 4.2 Arquivos que viraram central de tudo
- `partida/index.ts` (870 linhas): carga, validação de todos os JSON, montagem das regras, API da tela e leituras. São quatro responsabilidades num arquivo. Separar em `carga/` (um carregador por módulo) e `api.ts` é refatoração pura, um pedido à parte.
- `tela/mapa/MapaOrganico.tsx` (1092), `organico.ts` (1002), `icones.ts` (1123).
- `motor/populacao/index.ts` (826), `atendimento/index.ts` (842), `turno/etapas/populacao.ts` (596) e `economia.ts` (571). As etapas deviam ser finas e chamar o módulo, mas acumularam regra.

### 4.3 Estado como um saco de opcionais
`Estado` tem 27 campos `?:`. Parte deles existe para módulo opcional, parte para save antigo. Os dois casos se misturam, e todo leitor precisa de `??`. Sugestão: o `Estado` em memória sempre completo, e a migração de save num lugar só, com versões numeradas (`migrar_1_para_2`…). O motor deixaria de saber que saves antigos existem.

### 4.4 Testes
1132 testes verdes é bom, mas:
- **88 s** é lento demais para rodar a cada mudança, e por isso o projeto já criou a regra de "check só no fim da mecânica". A causa provável é que os testes de `partida/` criam o Brasil inteiro e jogam turnos.
- Esses testes ficam **acoplados ao ajuste do conteúdo**: qualquer número mexido no Brasil pode quebrar um teste que não tem nada a ver com a mudança. Funciona como teste de regressão do *balanço*, e a memória do projeto já reconhece isso ("sem teste em mecânica instável").
- Proposta: os testes do motor ficam com dados mínimos (os rápidos), e uns poucos testes de partida ficam no país `teste`, com propriedades no lugar de números ("imposto maior → arrecadação maior até o pico"), nunca "o PIB dá 4,37".

### 4.5 Coisas soltas
- `npm run format:check` falha em 16 arquivos, então o `npm run check` completo não passa hoje.
- `npm run icones` está quebrado.
- Há um `SisGov-backup-2026-09-25.bundle` (1,2 MB), `inventario.csv`, `auditoria.json`, `passe1c-*.csv`, `_lixo/` e `rascunho/` na raiz. Nada disso quebra o jogo, mas é ruído para quem chega ao projeto.

---

## 5. Crítica de game design

### 5.1 O problema principal: 66% das leis agem só por "pontos genéricos"
336 das 511 leis têm `canal: "espera"`: o caminho real delas até o bolso do pop (imposto, verba, preço, regra) não existe. Elas ainda agem, porque o validador aceita e os `efeitos` entram na fila genérica de pontos (+2/+5/+10 num índice de 0 a 100, em rampa linear). Na tela, uma lei de verdade (o imposto de renda muda a renda do pop) e uma lei de espera (os agrotóxicos somam 2 pontos em "meio ambiente") aparecem iguais.

É exatamente o sintoma registrado como "o jogo não se sente": o jogador mexe e um número abstrato anda 2 pontos daqui a 8 meses. **Não é falta de código, é excesso de leis falsamente prontas.**

### 5.2 Quantidade contra legibilidade
O Democracy 4, referência citada no próprio mapa, tem cerca de 100 a 150 políticas, e muita gente já acha isso pesado. Com 511 bolhas e layout que muda pela física, o jogador não tem como formar um modelo mental. Para a V1, eu mostraria **só as leis com canal real** (perto de 175) e esconderia ou desligaria as de espera, até que cada uma ganhe o seu mecanismo.

### 5.3 O modelo de efeito por pontos satura
Efeitos fixos em pontos, somados e presos no domínio, têm dois defeitos conhecidos:
- **Saturação:** com muitas leis puxando o mesmo índice, ele bate no teto e as próximas leis não fazem nada. Isso fere a regra "nenhum efeito neutro".
- **A lei não depende do contexto:** +5 em saúde vale o mesmo num país rico ou pobre. A memória do projeto pede o contrário ("a mesma lei muda de sentido pelo estado do país"). As leis com canal real (imposto, verba, transferência) já fazem isso, e as de pontos não. Mais um motivo para o caminho ser "canal real ou fora da V1".

### 5.4 Simulação profunda, explicação rasa
O motor modela demografia, emigração, organizações, corrupção de órgãos, opinião de potências… mas a mídia "não pesa em nada" (pendência no RETOMAR), e o noticiário da V1 é uma manchete. Para o jogador, **o sistema que ele não entende é o mesmo que um número aleatório.** Em simulador de governo, a explicação ("o desemprego subiu porque a lei X encareceu o frete") é metade do jogo. Recomendo inverter a prioridade: antes de qualquer sistema novo, uma tela de causa ("por que este índice mudou"), lendo o que os `fatos` e as contribuições dos efeitos já registram.

### 5.5 Balanço sem jogador
Já existem scripts que jogam partidas (`mandato`, `sentir`, `eleicao`). Falta o passo seguinte: **robôs com estratégias** (o liberal, o gastador, o que não faz nada, o extremista) jogando 24 turnos com várias sementes, e uma tabela de quem ganha a eleição. Se "não fazer nada" ganha tanto quanto governar, o jogo está quebrado, e isso se descobre em segundos, sem testador humano. O motor determinístico e rápido (0,46 s por mandato) é ideal para isso. É o maior retorno disponível.

### 5.6 Turno de 2 meses e mandato de 24 turnos
A escolha é boa para o ritmo. Mas com atrasos de 4 turnos (8 meses) e rampa linear, uma lei aprovada no último ano mal aparece antes da eleição. Isso pode ser intencional (realismo), mas tem de ser **visível**: a tela precisa mostrar "chega inteiro em out/2028".

---

## 6. Prioridades que eu sugeriria (para o autor decidir)

1. **Desligar na V1 os módulos fora do escopo** (§3). É barato, segue o plano já aprovado e reduz o ruído.
2. **Esconder ou desligar as 336 leis de espera na V1** (§5.1, §5.2).
3. **Robô de balanço** com 4 ou 5 estratégias e várias sementes (§5.5).
4. **Tela de causa** a partir dos efeitos e fatos que já existem (§5.4).
5. Depois da V1, como pedidos de refatoração separados: versões de save com migração (§4.3), quebrar o `partida/index.ts` (§4.2), testes de propriedade no país `teste` (§4.4), e pensar o mapa em canvas com posições estáveis (§2).

O que **não** recomendo: trocar de tecnologia, backend, engine ou reescrever o motor. A base técnica está boa. O risco do projeto é de escopo e de legibilidade, não de pilha.
