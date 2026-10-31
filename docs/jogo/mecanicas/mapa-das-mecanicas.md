# Mapa das mecânicas

> Reescrito em 31/out/2026 a pedido do autor. Meta: **quando o JSON de todas as
> leis estiver preenchido, a V1 está pronta.** Por isso o mapa vem em fases: primeiro
> se fecha o que uma lei declara (o contrato), depois os sistemas que leem esse
> contrato e, por último, o preenchimento e a calibragem.
> A versão de 30/out (partes Motor, Jogo, Interface) está no git. As tabelas do
> fim mostram onde foi parar cada item antigo (J1–J14, M1–M13).

Legenda: `[x]` feito · `[~]` parcial · `[ ]` falta · "não visto" = provado por
teste, falta conferir na tela · **(decidir)** = só o autor decide.

## Frente atual

**Fase 0. Base verde.** Depois, a Fase 1 começa com a proposta do contrato no chat.

## Princípios (técnicas adotadas)

| Técnica | Como fica no SisGov | Estado |
|---|---|---|
| Núcleo isolado (headless) | `src/engine` calcula; `src/ui` só lê o estado e manda ações | [x] |
| Passo fixo (tick) | Passo mensal, turno de 2 meses, sem depender da tela; sorteios por semente | [x] |
| Orientado a dados | Leis, índices, setas, grupos e regras em JSON; o motor não conhece nomes | [x] |
| Módulos que se falam por estado e tags | População, leis e economia não chamam o código umas das outras: leem o estado e as tags. É a versão por turnos do "sistema de eventos" e é mais fácil de reproduzir | [x] |
| Lote sobre dados puros (espírito do ECS) | Perfis do eleitorado processados em lote; sem reescrever para ECS formal | [x] |
| Grafo de dependências com verificação | Já acha ciclos e arquivos órfãos (`engine/diagnostics/analyzePackage.ts`). Falta medir laço que explode e lei que não chega a nada (Fase 1) | [~] |
| Economia fechada (fontes e drenos) | Receita, caixa e dívida existem; falta o dreno principal e o freio da dívida (Fase 2a) | [~] |
| Máquina de estados | Existe na tramitação do Congresso; falta nos grupos (Fase 2c) | [~] |
| Agentes com LLM | Fora: a população é IA de jogo, sem LLM | — |

Regra prática: **número ou ligação** é conteúdo (JSON); **regra de partida**
(quem vota, quem ganha, o que trava) é jogo; só é motor se o cálculo não existe.

---

## Fase 0. Base verde

Sem a suíte verde, preencher 224 leis é trabalhar às cegas.

- [ ] Acertar os 11 testes que falham: `contasSemFuros` A1 e A2, `brasil2026` (juros explosivos), `fichaV3`, `mesaDoSalarioMinimo`, `cooperacaoInternacional`, `natalidadeNatalidade`, `saudeMortalidade`, `partida.test.ts` ×2, `previdenciaTransferenciaSeparada`. Vários são contas do turno de 3 meses
- [ ] `npm run check` verde e conferir na tela com o turno de 2 meses
- [ ] `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria": conferir

**Termina quando:** check verde e uma partida jogada na tela até a eleição.

---

## Fase 1. Contrato da lei e verificador

O que uma lei declara, e quem lê cada campo. Preencher a lei = preencher o
contrato; todos os sistemas leem dele.

| Campo da lei | Quem lê | Estado |
|---|---|---|
| `controle`, `dinheiro` (alíquota, verba, opções) | Economia e orçamento | [x] |
| Verba em % do PIB: regra única, todo controle `moeda_ano` age por `pib_nominal`, sem `normalizacao` à mão. Converter uma vez os 48 coeficientes por real (11 leis de verba) | Carregamento das leis | [ ] |
| `efeitos` (setas para índices) | Motor | [x] |
| `efeitos` para grupos (`grupo_*`) | População | [x] |
| Ponto na bússola | População (motivo), Congresso, bússola | [~] o Congresso usa; a população ainda não |
| `tags` ("esta lei mexe em tal tag") | Memória (causa), feed | [ ] |
| Com quem não convive | Exclusão entre leis (`game/validatePolicyAction.ts`); aprovar uma pede revogar a outra (A4) | [~] a regra existe, nenhuma lei declara |
| Explicação por lei e por opção | Tela (A6), com teste que a exige | [ ] |
| Opções travadas: liberar e converter em valor onde couber (A5) | Jogo | [ ] |
| Nome por país (ex.: "Selic") | País | [ ] |
| Nível, travas, pisos vinculados, trava conjunta de 100% do PIB | Jogo | [x] |

**Verificador** (amplia o do molde v4): a lei está **completa** quando

- [ ] tem todos os campos do contrato;
- [ ] chega a pelo menos um índice que aparece na tela e a pelo menos um grupo;
- [ ] não cria laço de realimentação que explode (ganho do laço > 1; caso conhecido: juros do `brasil2026`);
- [ ] roda no `scripts/diagnostico/uma-lei-por-vez.ts` sem quebrar o caixa.

**Termina quando:** três leis piloto passam no verificador e mexem em tudo na
tela: uma verba (gasto com defesa), uma alíquota e uma moral (maioridade penal).

---

## Fase 2. Sistemas que leem o contrato

Uma mecânica por vez, nesta ordem. Cada uma termina testada e vista na tela com
as leis piloto.

### 2a. Economia fechada (era J3)

- [x] Economia em reais: PIB, ocupados, massa salarial, lucros, consumo, patrimônios
- [x] Imposto = alíquota × base × (1 − o que escapa), cada receita com a sua lei
- [x] Caixa, déficit e dívida
- [ ] Dreno principal: gasto fixo da rede (~30% do PIB)
- [ ] Destino da sobra: fundo soberano
- [ ] Juros com canal de credibilidade e PIB em reais que dilui a dívida (hoje a dívida cresce até nos cenários de crescimento)
- [ ] Corte de gasto que não derruba a atividade e a arrecadação demais
- [ ] `transparencia_fiscal_internacional`: nenhuma lei a move
- [~] Ligação das leis econômicas ao grafo, bolha por bolha (`scripts/diagnostico/mundo-responde.ts`)
- [ ] **(decidir)** Industrialização, índice essencial da V1: composição simples (produtividade + infraestrutura + desenvolvimento) ou setores (indústria, serviços, agro)? Setores aumentam bastante esta fase

### 2b. Lei vira motivo na população (era J5 e o fim da J2)

- [x] Censo, bolso e movimento; motivos por pessoa com tags; memória de coorte do desemprego; bico e seguro de 5 meses; 4 grupos novos; sortear uma pessoa (`pessoaDaChave`)
- [ ] Lei como produtor de motivo: incomoda quem ela afasta do ponto da pessoa na bússola (antes e depois), com a régua `sensibilidade` do Congresso. Vale para lei moral e política
- [ ] Causa da memória por tag ou índice, lida do contrato
- [ ] `aprovacaoPorPerfis` do motor lendo bolso e memória (hoje usa perfis fixos)
- [ ] `gosta`/`odeia` dos desempregados
- [ ] Fluxos de valores e religião que faltam: evangélico→católico, sem religião→católico, polarização esvaziando o centro
- [ ] Informalidade de 80% que chega só a ~62%
- [ ] Futuro (fora da V1): o perfil manda e o agregado é a soma; depende do bolso guardar a fonte do dinheiro e dos setores

### 2c. Estado dos grupos (máquina de estados, nova) **(decidir se entra)**

- [x] Satisfação por perfil, apoio pesado pelo tamanho, radicais e lealistas
- [ ] Cada grupo tem um estado: calmo → insatisfeito → protestando → radicalizado, com regras de entrada e saída lidas do JSON
- [ ] Protestos e greves nascem do estado e viram ocorrências: os dilemas passam a vir do país, não da sorte (hoje 72 de 91 são só sorte, ~1% por turno)
- [ ] O jogo percebe padrões (ex.: várias verbas cortadas = corte de gastos); a bússola só mostra. 13 gatilhos já feitos (era J7)

### 2d. Partido, desgaste e fim de jogo (eram J8 e J10)

- [x] Gerador de pessoas; presidente, vice e ministros; popularidade do ministro; ministro porta-voz
- [x] Eleição existe; troca de chapa [~]
- [ ] Partido: o que defende, alas, disciplina da bancada
- [ ] Afinidade de cada grupo com o partido
- [ ] Desgaste (sobe sempre, cruzeiro e queda) e antipartido
- [ ] Adversário na eleição
- [ ] Fim de jogo: perder a eleição encerra
- [ ] Lei estender ou encurtar o limite de mandatos

### 2e. Feed das redes sociais (era J14)

- [ ] Cada motivo forte de uma pessoa sorteada vira um post curto (modelo de texto por tag e sinal, no JSON). Uma amostra por turno, clicável até o perfil
- [ ] Só lê da população; sem seguidores, respostas nem curtidas
- [ ] **(decidir)** Mídia (era J12, sem desenho): ataque na mídia mexe no carisma, na popularidade e no Senado. Entra na V1 aqui, junto do feed, ou fica para depois?

### Já fechado (não volta à fila)

- [x] Motor: pacote, tipos de variável, setas (afim, gradual, atraso, condições, transbordo, derivado), passo, salvar e retomar. 309 de 311 testes verdes em 30/out
- [x] Tempo: turno de 2 meses, mandato de 24 turnos (`game/calendario.ts`)
- [x] Congresso: tramitação, votação, motivo do voto, disposição, pétrea
- [x] Bússola, promessa contra ação
- [x] Partida: criar, salvar, carregar, exportar
- [x] Saúde → mortalidade e natalidade; piso do salário mínimo

---

## Fase 3. Preenchimento das leis (só JSON)

Área por área, com o verificador verde em cada uma. Nenhum código novo aqui; se
faltar código, volta para a Fase 2.

- [x] Molde v4: 224 leis em 11 áreas e 2 pétreas, com verificador e inventário
- [ ] Separar Segurança e defesa em duas áreas (hoje uma com 45 leis)
- [ ] Pôr no molde a lei de "Tributação" que está fora dele
- [ ] Juntar leis repetidas, converter em faixa, leis novas (fase 2 da economia)
- [ ] Contribuição sobre salários
- [ ] Ligar as 6 leis sem efeito nos grupos novos: regra-fiscal, valor-da-meta-de-inflacao, taxa-basica-de-juros, vagas-de-creche, quem-cuida-do-idoso-dependente, policias-dos-estados
- [ ] Conferir a ligação ao grafo nas áreas fora da economia: o jogador precisa sentir cada lei
- [ ] Rever quais índices o jogo mostra e se são os certos
- [ ] Catálogo de ~250 leis, cada uma com lugar na bússola
- [ ] País em frases: hoje 55 de 192 bolhas

**Termina quando:** todas as leis passam no verificador. **Aqui a V1 está
completa em regras.**

---

## Fase 4. Calibragem e acabamento

- [ ] Calibragem: lista única com os limites (1) a (17) do Grupos, os chutes do item 12 do PLANO e C1–C2, uma linha por chute com o arquivo onde mora. Inclui `gratidao` 6, `desalento` 8, `mesesDoDesalento` 12, `esquecimentoPorTurno` 0,05 e os chutes dos 4 grupos novos
- [ ] Neutralidade das réguas e das cores
- [ ] Revisão jogando
- [ ] Tela:
  - mapa com linhas só no foco (`docs/jogo/interface/mapa-em-tres-aneis.md`) e ícones próprios por índice;
  - meses do turno animados;
  - régua nas leis de opções? (A7, decidir);
  - teto de 4× em `faixaNumerica` (`Documentos.tsx`) para unidades que não são moeda nem percentual;
  - feed e clique no post até a pessoa;
  - faixas sem grupo [x];
  - tela de abertura à altura da promessa;
  - conferir o que está "não visto" (troca de chapa, voto de cada bancada, aviso da pétrea, 4 grupos, bico, seguro)
- [ ] Ministros por último: competência na eficácia da pasta, troca e demissão, nome nas ocorrências (`occurrences.ts`), carisma vivo
- [ ] Refatoração (pedido separado): cortar as 6 montagens do `pacoteVivo` por turno

---

## Fora da V1 (pelo escopo)

- Mercado no estilo Victoria 3; população em blocos (opção B do escopo)
- Escolha de país (V2); produtos, tecnologias e pesquisa (V5)
- STF

## Onde foi parar cada item antigo

| 30/out | Agora |
|---|---|
| MO1–MO5 Motor | Fase 2, "Já fechado" |
| J1 Tempo | Fase 0 (testes) e "Já fechado" |
| J2 Leis | Fase 1 (contrato) e Fase 3 (catálogo) |
| J3 Economia | Fase 2a; coeficientes por real na Fase 1 |
| J4 Rede | Fase 3 |
| J5 População | Fase 2b |
| J6 Opinião e grupos | Fase 2c; país em frases na Fase 3; neutralidade na Fase 4 |
| J7 Bússola e padrões | "Já fechado"; padrões na Fase 2c |
| J8 Partido e governo | Fase 2d; ministros na Fase 4 |
| J9 Congresso | "Já fechado" |
| J10 Eleição e fim | Fase 2d |
| J11 Ocorrências | Fase 2c; ministros com nome na Fase 4 |
| J12 Mídia | Fase 2e (decidir) |
| J13 Partida | "Já fechado" |
| J14 Redes sociais | Fase 2e |
| I1–I6 Interface | Fase 4 |

| Antes de 30/out | Agora |
|---|---|
| M1 Tempo | Fase 0 |
| M2 Leis | Fases 1 e 3 |
| M3 Economia | Fase 2a |
| M4 Rede | Motor fechado e Fase 1 (coeficientes ao PIB) |
| M5 População | Fase 2b |
| M6 Opinião | Fase 2c |
| M7 Bússola | Fase 2c |
| M8 Partido | Fase 2d |
| M9 Congresso | Já fechado |
| M10 Eleição | Fase 2d |
| M11 Ocorrências | Fase 2c |
| M12 Partida | Já fechado e Fase 4 |
| M13 Mídia | Fase 2e |
