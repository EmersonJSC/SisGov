# Mapa das mecânicas

> Refeito em 30/out/2026 a pedido do autor: o jogo dividido nas três partes do
> código (motor, jogo e conteúdo, interface). Cada parte lista as mecânicas que
> ela **deve ter**; o que já existe foi encaixado nelas, não o contrário.
> A numeração antiga (M1 a M13) está na tabela do fim.

Legenda: `[x]` feito · `[~]` parcial · `[ ]` falta · "não visto" = provado por
teste, falta conferir na tela.

## Frente atual

**J3 Economia e orçamento** (autor, 30/out): deixar a economia funcionando para
poder pôr e tirar leis econômicas e equilibrar depois. É conteúdo, não motor: o
motor já sabe tudo o que ela precisa (ver MO3).

## As três partes

| Parte | Pasta | O que faz | Estado |
|---|---|---|---|
| **Motor** | `src/engine` | Calcula o mundo a cada mês. Não conhece lei, partido nem país. | Fechado (30/out) |
| **Jogo e conteúdo** | `src/game`, `src/app/partida`, `src/conteudo` | Regras do jogo (Congresso, eleição, bússola…) e o mundo em JSON (leis, setas, índices, eventos). | Grande parte feita; é onde mora quase tudo que falta |
| **Interface** | `src/ui` | O que se vê e se clica. | Feita em boa parte; muito "não visto" |

Regra prática: se a mudança é **número ou ligação**, é conteúdo; se é **regra
de partida** (quem vota, quem ganha, o que trava), é jogo; só é motor se o
cálculo em si não existe.

---

## Parte 1. Motor (`src/engine`)

**MO1 Pacote**

- [x] Ler e validar os JSON, juntar mundo e país, checar coerência (`model/`)
- [x] Diagnóstico do pacote (`diagnostics/`)

**MO2 Tipos de variável**

- [x] Controle (as leis), estoque, calculado, derivado (fórmula), situação, grupo

**MO3 Setas**

- [x] Afim: `origem × coeficiente + termo`
- [x] Resposta gradual, atraso e duração, condições, transbordo
- [x] Derivado como soma de produtos (com escala, inverso e complemento): é o que permite "proporcional ao PIB" sem código novo

**MO4 Passo**

- [x] Avanço mês a mês em ordem fixa, histórico limitado, explicação do que mudou
- [x] Leis viram setas ativas (`translatePolicyCommands`)
- [x] Dilemas, eventos e situações avaliados a cada passo
- [x] Aprovação por perfil opcional (`profileApproval`, o jogo manda os perfis vivos)

**MO5 Salvar e retomar**

- [x] Exportar, restaurar e comparar a retomada

**Motor fechado (30/out).** Conferido rodando: 54 arquivos de teste que usam
o motor, 309 de 311 verdes, `tsc -b` limpo. As 2 falhas são contas do jogo
escritas para o turno de 3 meses (J1). Proporcional ao PIB já existe de
duas formas: derivado (`alíquota × pib_nominal`) e seta com
`normalizacao: { divisor: pib_nominal }`. Nada novo entra aqui sem um caso
que o conteúdo não consiga resolver.

---

## Parte 2. Jogo e conteúdo

**J1 Tempo**

- [x] Turno de 2 meses, mandato de 24 turnos; o conteúdo escrito em trimestres é convertido (`game/calendario.ts`)
- [ ] Acertar os testes que contam trimestres: `brasil2026` (juros explosivos) e `fichaV3` (três leis piloto)
- [ ] Rodar a suíte inteira com o turno novo e conferir na tela

**J2 Leis (regras e catálogo)**

- [x] Molde v4: 224 leis em 11 áreas e 2 pétreas, com verificador e inventário
- [x] Leis em três níveis, filhas e globais; leis do mundo, estado no país (`paises/brasil/leis-no-pais.json`)
- [x] Travas individuais, trava conjunta de 100% do PIB, alíquota e verba livre de 0 a 100%, pisos vinculados
- [x] Estado e custo das leis
- [~] Exclusão entre leis: a regra existe (`game/validatePolicyAction.ts`), nenhuma lei declara com quem não convive
- [ ] Aprovar uma lei que exclui outra pede revogar a outra (A4)
- [ ] Liberar opções travadas e converter em valor onde couber (A5)
- [ ] Separar Segurança e defesa em duas áreas (hoje uma com 45 leis)
- [ ] Pôr no molde a lei de "Tributação" que está fora dele
- [ ] Catálogo de ~250 leis, cada uma com lugar na bússola
- [ ] Explicação por lei e por opção, com teste que a exige (A6)
- [ ] Troca de nomes por país (ex.: "Selic")
- [ ] Ligação com a população, só no JSON das leis (vem depois de a população estar pronta): `gosta`/`odeia` dos desempregados, setas lei→grupo (ex.: `grupo_evangelicos`) e "esta lei mexe em tal tag". Teste de encaixe: seta de lei para um grupo move a satisfação

**J3 Economia e orçamento** ← frente atual

- [x] Economia em reais: PIB, ocupados, massa salarial, lucros, consumo, patrimônios (fases 1 a 6)
- [x] Imposto = alíquota × base × (1 − o que escapa), cada receita com a sua lei
- [x] Caixa, déficit e dívida
- [~] Fase 2: juntar leis repetidas, converter em faixa, leis novas
- [~] Ligação das leis econômicas ao grafo: conferir bolha por bolha (`scripts/diagnostico/mundo-responde.ts` e o script por bolha)
- [ ] Coeficientes proporcionais ao PIB: 47 efeitos em 11 leis de verba ainda usam coeficiente por real; pôr `normalizacao` pelo `pib_nominal`, como os outros 59 (só JSON)
- [ ] `transparencia_fiscal_internacional` não é movida por nenhuma lei
- [ ] Gasto fixo da rede (~30% do PIB)
- [ ] Destino da sobra: fundo soberano
- [ ] Contribuição sobre salários
- [ ] Setores: indústria, serviços, agro

**J4 Rede de consequências (fora da economia)**

- [x] Saúde → mortalidade e natalidade; piso do salário mínimo
- [ ] Conferir a ligação das leis ao grafo nas outras áreas (M2.6): o autor suspeita que o jogador não sente efeito porque as leis estão mal ligadas
- [ ] Rever quais índices o jogo mostra e se são os certos

**J5 População**

> Visão do autor (30/out): a população é uma **IA de jogo** (não LLM). Cada
> pessoa "pensa", tem memória e opinião própria, separada por grupos e
> pessoas. Ela é um **módulo independente**: existe sem leis nem governo e se
> adapta quando eles chegam. Só guarda o registro e o efeito na satisfação; a
> causa vem como lista de índices ou **tags**, nunca como nome de lei.

- [x] Censo, bolso e movimento (renda, valores e religião mudam com o país)
- [x] Motivos por pessoa (passo 1): satisfação = 50 + soma de motivos; hoje produzem motivos o grupo e o bolso (`congresso/motivos.ts`). Memória e leis entram depois como novos produtores
- [x] Tags nos motivos (passo 2): cada `Motivo` leva `tags`. O de grupo leva o id do grupo, o de bolso leva `bolso`, o de memória leva as tags do JSON (`regras.memoria.desemprego.tags` em `mundo/congresso.json`). Leis e economia apontam para essas tags nos próprios JSON; é assim que os módulos conversam
- [x] Memória por pessoa, no salvar e carregar (`game/congresso/memoria.ts`, `EstadoDoCongresso.memoria`): memória de coorte por linha do eleitorado, com a fração que já foi desempregada e voltou (gratidão, esfria por turno) e os meses de quem segue sem emprego (desalento). Entra como produtor de motivos `memoria`. [ ] **Causa** ("quais políticas levaram a isso") fica por tags ou índices e depende de o módulo das leis declará-la
- [ ] Desemprego: cobertura do seguro e ex-informal com renda de bico (desalento e gratidão já feitos); calibrar `gratidao` 6, `desalento` 8, `mesesDoDesalento` 12 e `esquecimentoPorTurno` 0,05 (chutes)
- [x] Sortear uma pessoa (passo 3, só a mecânica): o módulo gera a pessoa de um perfil sorteado por peso, com nome e idade fixos pela semente, guarda no estado (salvar e carregar) e devolve a mesma a cada clique na mesma chave; a opinião sai dos motivos do perfil ao vivo. Falta a memória dela (passo 2)
- [ ] Futuro: inverter para "o perfil manda e o agregado é a soma". Depende de o bolso guardar a fonte do dinheiro e de os setores (J3) existirem (PLANO, item 3)

**J6 Opinião e grupos**

- [x] Satisfação por perfil (com bolso), apoio pesado pelo tamanho
- [x] Radicais e lealistas
- [~] País em frases (55 de 192 bolhas)
- [ ] Neutralidade das réguas e das cores

**J7 Bússola e padrões**

- [x] Bússola, aprovação lida dos perfis vivos
- [x] 13 gatilhos (incluindo os fiscais), com reação nos grupos, na eleição e no Congresso
- [x] Promessa contra ação

**J8 Partido e governo**

- [x] Gerador de pessoas; presidente, vice e ministros (um por área)
- [x] Popularidade do ministro pelos grupos leais; ministro porta-voz (pedidos)
- [~] Carisma vivo (falta o lado da mídia, J12)
- [~] Troca de chapa na eleição (falta a lei estender ou encurtar o limite de mandatos)
- [ ] Partido: o que defende, alas, disciplina da bancada
- [ ] Afinidade de cada grupo com o partido
- [ ] Desgaste do partido e antipartido
- [ ] A decidir: o que o candidato muda de fato; competência do ministro na eficácia da pasta; troca e demissão de ministro

**J9 Congresso**

- [x] Tramitação e votação
- [x] Motivo do voto de cada bancada, quem mudou de lado, disposição com o governo
- [x] Pétrea: tentar mexer custa humor no Senado e satisfação nos grupos

**J10 Eleição e fim**

- [~] Eleição existe, falta o adversário
- [ ] Fim de jogo (perder encerra)

**J11 Ocorrências e pressão**

- [x] Ocorrências, crises, grupos de pressão
- [ ] Dilemas que nascem do estado do país (hoje 72 de 91 são só sorte, ~1% por turno)
- [ ] Ministros com nome nas ocorrências (`occurrences.ts` usa o nome da pasta)

**J12 Mídia**

- [ ] Ideia do autor, sem desenho: ataque na mídia mexe no carisma, na popularidade e pressiona o Senado. Abre depois da J8.

**J13 Partida**

- [x] Criar, salvar, carregar, exportar

**J14 Redes sociais** (mecânica própria, apoiada na população; autor, 30/out)

- [ ] Feed vivo: cada motivo forte de uma pessoa sorteada vira um post curto (texto de modelo por tag e sinal, no JSON, preenchido com os dados dela). Uma amostra por turno, clicável até o perfil
- [ ] Não simula uma rede social inteira: sem seguidores, respostas nem curtidas
- [ ] Só lê da população (motivos, tags, memória); a população não depende dela

---

## Parte 3. Interface (`src/ui`)

**I1 Mapa político**

- [x] Índices em anéis, no ângulo das áreas que os mexem (passo 1; foco numa lei e num índice não visto)
- [ ] Linhas só no foco (passo 2, `docs/jogo/interface/mapa-em-tres-aneis.md`)
- [ ] Ícones próprios para cada índice

**I2 Turno na tela**

- [x] Passar o turno, jornal
- [ ] Os meses do turno animados

**I3 Leis na tela**

- [x] Busca, catálogo, janela da lei, régua, prévia do efeito e do bolso
- [~] Teto de 4× em `faixaNumerica` (`Documentos.tsx`) ainda vale para unidades que não são moeda nem percentual
- [ ] Régua também nas leis de opções? (A7, decisão do autor)

**I4 População, grupos e bússola**

- [x] Censo, painel de grupos com radicais e lealistas, bússola com os gatilhos
- [ ] Faixas sem grupo na tela (centro, fora da força de trabalho…)
- [x] Bússola: camada "População" (nuvem dos perfis em quadradinhos de meio ponto, % por quadrante)
- [ ] Clique no post da rede traz a pessoa (`pessoaDaChave`) e mostra a opinião dela; sem tela própria de sorteio (ver J14)
- [ ] Feed de posts que leva ao perfil (ver J14)

**I5 Governo, Congresso e eleição (tablet)**

- [x] Escolha da chapa, plenário com a disposição das bancadas, pedido do ministro, noite da apuração
- [~] Não visto: troca de chapa na eleição, fila com o voto de cada bancada, por que cada bancada votou, aviso da pétrea

**I6 Abertura**

- [x] Menu, salvar e carregar
- [ ] Tela de abertura à altura da promessa

---

## Transversal, no fim: Calibragem

Lista única com os limites (1) a (17) do Grupos, os chutes do item 12 do PLANO
e C1–C2. Uma linha por chute, com o arquivo onde ele mora. A revisão manual
jogando entra aqui, junto com o conteúdo das leis (J2) e o texto (J6).

## Numeração antiga

| Antes | Agora |
|---|---|
| M1 Tempo | J1 e I2 |
| M2 Leis | J2, J3/J4 (M2.6), I3 |
| M3 Economia | J3 |
| M4 Rede | MO1 a MO5 (o motor) e J3 (coeficientes ao PIB) |
| M5 População | J5 e I4 |
| M6 Opinião | J6 |
| M7 Bússola | J7 |
| M8 Partido | J8 |
| M9 Congresso | J9 e I5 |
| M10 Eleição | J10 |
| M11 Ocorrências | J11 |
| M12 Partida | J13 e I6 |
| M13 Mídia | J12 |
