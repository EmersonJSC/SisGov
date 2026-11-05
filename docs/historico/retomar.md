# Onde parei

**04/nov/2026**

## Onde está

Frente atual: **pops e grupos** (o autor pediu fechar antes do Partido, porque
a chapa e o perfil de rede dependem deles). Feito em 03/nov: os **25 pops**
(8 pobres, 11 médios, 6 ricos) em `mundo/pops/pops.json`, cada um com bússola;
parcelas dos dois países refeitas somando o mesmo que os 6 antigos; grupos
reapontados; aparecem na tela do Mercado. Testes e `tsc -b` verdes.
Efeito visível: "sem emprego formal" subiu (35→38% no teste-pobre) por causa de
estudantes e aposentados, que não têm setor.

**16 grupos** no lugar dos 4 (`mundo/grupos/grupos.json`); os 25 pops têm casa;
os partidos dos países (`congresso.json`) defendem os novos ids; testes e `tsc -b`
verdes; aparecem no mapa.

O Partido (GDD §4, R4.5–R4.10, R6.11–R6.12) está escrito e commitado, sem código.

**R8.5 (vida) feito**: cada pop desliza na bússola (renda + satisfação), a do
grupo anda junto; interno, o jogador sente só apoio e votos. Falta a mídia.
Em 12 turnos parados o deslize é pequeno (~0,005); não equilibrado.

**R11.6 feito**: gente sobe e desce de estrato com a renda real e a instrução
(`Estado.migracao`, escadas `sobe`/`desce` em `pops.json`). Em 24 turnos
parados mexe ~1% e quase tudo é descida; não equilibrado. A tela ainda não mostra
"quem subiu" direto: só aparece nos grupos e no emprego.

**R11.5 feito**: pop estuda e muda para o setor que paga mais (`Estado.setores`,
`treina` em `pops.json`, velocidade pela instrução). Universidade NÃO é
construção (decisão do autor): é só o índice. Em 24 turnos tecnologia sobe
~50% de empregos no `teste`; não equilibrado.

## Próximo

Pops e grupos **fechados sem a mídia** (03/nov, check verde, 229 testes).
R8.5/R11.4 ◐ "falta mídia"; R16.7–R16.10 são das construções: não marcar.
Partido adiado pelo autor ("precisamos de algumas coisas antes").

**Frente atual: moradia (leis ↔ índices, por área).** Hoje moradia é produto
comerciável do mercado (`produtos.json`, `produtores.json`), sem demanda nem
índice. Decidido: vira estoque local, sai dos produtores do mundo; construída
por empresas, governo e pops privados (pobre autoconstrói precário, médio
financia, rico investe). Três índices em estudo (ids ainda não criados, o autor
aprova): déficit, preço e favela.
**Regras do autor (03/nov):** (1) processo = estoque que anda sozinho pelos
turnos, empurrado pelas leis em vigor; NÃO é painel com meta/ritmo; (2) cada lei
vai de "nada" a "mais" em UM lado da bússola, nunca de um extremo ao outro;
(3) leis em todos os lados. Proposta no chat: processo "urbanizar favelas" com
leis de esquerda, direita, libertário, autoritário e verde. **Molde aprovado
(03/nov):** jogador monta "builds"; só leis que se colidem não valem juntas
(como anti-armas × pró-armas). Próximo: propor as leis dos processos déficit e
preço, e a lista de colisões, antes de qualquer código. **Feito:** 3 índices em
`variaveis.json` (`deficit_habitacional`, `preco_moradia`, `favela`, calculados,
ainda sem cálculo no motor). Lista das 18 leis (3 índices × 6 lados) e 5
colisões enviada no chat; autor concordou em manter os 3 índices separados.
**04/nov:** criado `docs/jogo/arquitetura.md` (camadas, turno, peças: índice,
lei, processo, colisão, área). O autor quer "mudar algumas coisas antes de
continuar": esperar o que muda. Falta: criar as 18 leis, o cálculo, tirar
moradia dos produtores.
**04/nov (2):** autor aprovou ligar **campo × cidade** pelo êxodo. Anotado no
GDD (§7 build/colisão/processo; §16 "Terra e moradia"; §18 dúvidas) e nos
requisitos (R7.9–R7.10, R16.17–R16.24). Índice `concentracao_terra` aprovado e
criado; os 4 índices novos têm valor de partida nos 2 países (sem isso 12 testes
quebravam). 229 testes e `tsc -b` verdes. Autor rejeitou "Reforma agrária X%":
é processo em 4 etapas, leis são as peças. Nova pergunta antes de toda lei:
"presidente real assinaria e pronto?". Leis do campo refeitas no chat.
Aprovado: fazendas em 3 tamanhos; vistoria → defesa → desapropriação. Regra nova
(GDD §7): jogador não escolhe fazenda/fábrica; leis dão verba ao órgão, força pela
verba, excesso vira corrupção (NÃO "régua que anda"). Órgãos no GDD §18.
Imposto sobre terra parada: 0–100% com o Laffer que o motor já tem
(`modelo: laffer`). Autor achou dividido demais: lista enxuta (13 leis, 4
reaproveitadas: indenizacao, policia-ambiental, areas-protegidas,
saneamento-basico) enviada no chat. Depois: + "Dono da terra" (essencial,
opções privada/arrendada/coletiva/do Estado) e + "Teto de tamanho da terra";
triagem-estrangeira ganha efeito em terra; zoneamento recusado (complexo).
Lista final de 15 leis e 4 índices no chat: esperando aprovação para criar.
**04/nov (3):** autor aprovou criar. "Dono da terra" RECUSADA: ia de um lado da
bússola ao outro. Proposta de troca no chat: "Terra comunal" (V) e "Arrendamento
de terra pública" (A); a privada é o padrão sem lei; "do Estado" vira caminho.
Criadas as 5 do campo (`teto-tamanho-terra`, `imposto-terra-parada`,
`verba-orgao-terras`, `credito-compra-terra`, `terra-invadida`), área nova
"Terra e moradia" no mapa, base de cálculo `terra` (Laffer, parcela por país);
indenização vale para terra (só o texto). 234 testes e `tsc -b` verdes, visto na
tela. Falta no motor: progressividade, corrupção por verba demais, estoques.
"Terra comunal" e "Arrendamento" descartadas (confusas, dependiam de terra que
o Estado não tem). No lugar, mecânica **Tomar e dar destino** anotada no GDD
§18, R16.25 e `arquitetura.md` (peças Órgão e Destino). Criadas as 6 da cidade
(`verba-habitacao`, `credito-imobiliario` como gasto % PIB e não "% dos juros",
`teto-aluguel`, `despejo-rapido`, `remocao-area-risco`, `titulo-posse`);
saneamento ganha favela −, áreas protegidas ganha preço +. Área com 11 leis,
240 testes e `tsc -b` verdes, visto na tela. Falta: triagem-estrangeira em
terra, código das colisões (aluguel × despejo; título × remoção), estoques e
cálculo dos 4 índices, tirar moradia de `produtores.json`. Commit `fc76e2aa`.
**04/nov (4): deriva feita** (modelo aprovado: índice = base + leis + deriva).
`motor/deriva` move a base a cada turno, medindo quem empurra contra o turno
0 (país começa parado); ligações em `mundo/indicadores/derivas.json`
(concentração → déficit; crescimento → déficit −; déficit → preço e favela;
pobreza → favela). 244 testes e `tsc -b` verdes. Teste-pobre em 20 turnos:
verba de habitação máxima tira 5 do déficit, 3 do preço e 5 da favela; teto de
terra 5× tira 10 da concentração e 6 do déficit. Na tela: sem lei, déficit
35→35,5 e favela 30→30,3 (o Congresso recusou a verba). Não equilibrado.
**04/nov (5):** caixa "Sem Congresso (teste)" na tela inicial (toda lei
passa; a eleição continua). Na tela, teste-pobre, verba de habitação máxima,
12 turnos: déficit 35→30,5, favela 30→27,4. "Terra invadida" retirada (área
com 10 leis; nota no GDD §18). 243 testes e `tsc -b` verdes. Sem commit.
Commits `4a724781` e `52f607f9`.
**04/nov (6): freio feito.** Ligação de deriva pode ter `freio` (lei contínua);
pobreza → favela freada pela verba de habitação, verba máxima corta inteira
(decisão do autor). 244 testes e `tsc -b` verdes. Na partida quase não se vê:
a pobreza do teste-pobre fica parada em 45 por 24 turnos. Commit feito (motor: freio na deriva).
**04/nov (7): colisões feitas.** `mundo/colisoes/colisoes.json` (teto de
aluguel × despejo rápido; título de posse × remoção). É um "ou" (autor): o
jogador põe uma ou outra, nunca as duas, e nenhuma lei manda na outra. Para
trocar, revoga uma e propõe a outra no turno seguinte. A tela não cita a outra
lei. 248 testes e `tsc -b` verdes; visto na tela. Commit feito (motor: colisão).
**04/nov (8): estoque de casas feito.** `motor/moradia` conta casas formais,
precárias e obras; déficit e favela saem dessa conta (família = pessoas ÷ 3).
Governo constrói com a Verba de habitação; empresas constroem pelo preço, pelo
setor construção civil, por juro, imposto e corrupção; quem fica sem casa levanta
casa precária. Casas desgastam 4% ao ano. A obra leva cerca de 1 ano. Saíram as
derivas de déficit e favela e o freio; ficou déficit → preço. Verba no máximo, no
teste: déficit 20 → 16,3 e favela 15 → 14,2 em 18 turnos, visto na tela. A ficha
da Verba mostra os pontos por ano e o mapa mantém as setas.
Commit `3a88543d`.
**04/nov (9): êxodo simples e pobreza na conta de casas.** Os pops do campo são
o limite (o país não declara tamanho do campo, decisão do autor). Concentração
acima do turno 0 tira famílias do campo, aos poucos, e elas entram no déficit;
abaixo, famílias sem casa formal voltam e saem do déficit, mesmo abaixo do
começo. Pobreza acima do turno 0 faz mais famílias sem casa levantarem casa
precária. Sem índice novo; ninguém muda de pop. 261 testes e `tsc -b` verdes.
Teste, verba do órgão de terras 2%, 23 turnos: concentração 45, déficit 19,8 → 19,2
e favela 15,0 → 14,6 contra a partida sem lei; 19,2 visto na tela. Efeito pequeno.
Commit `c6d17746`.
**04/nov (10): ligação à vista.** O mapa tem seta concentração → déficit, e a
ficha da lei que mexe na concentração mostra o déficit no fim do êxodo ("aos
poucos"). Verba do órgão de terras a 1,95% no teste-pobre: −4,9 concentração,
−1,2 déficit, visto na tela. 264 testes e `tsc -b` verdes. Nessas leis, a ficha
avisa que o déficit vem pelo êxodo. Pobreza → favela segue sem seta nem linha na ficha. Commitado.
**04/nov (11): favela com consequência.** Favela acima do começo piora saúde,
segurança e o índice novo `saneamento` (deriva fraca); a lei de saneamento move
esse índice. Grupos cobram favela, déficit e preço (rentistas querem preço alto).
Derivas têm seta no mapa, visto na tela. 266 testes e `tsc -b` verdes. Commitado.
`docs/jogo/indices-avaliacao.md` separa índices avaliados e não avaliados.
Organizações criminosas estão no GDD §18. Save antigo mostra saneamento 0%.
**04/nov (12): saneamento avaliado.** `motor/saneamento` conta as
famílias ligadas à rede (`mundo/saneamento/saneamento.json`). Pacote: Verba de
saneamento, Concessão da rede, Teto da tarifa de água e Tratamento de esgoto, sem
efeito direto; concessão × teto colidem. Setas saneamento → saúde e meio
ambiente; Sem trabalho formal e Gente do campo cobram. Casas e rede disputam o
setor de construção: passou de 2× o trabalho do turno 0, as obras das duas
atrasam. Prazo base da rede: 6 turnos. Número sem balanço.
**04/nov (13): bolso.** A lei não sabe do país: a renda real de cada
pop contra a conta diz quem paga (`parteAbaixoDe`, `apertoDoBolso`). Moradia:
preço alto tira a casa de quem não paga, sobe a favela e a empresa só constrói
para quem paga; saiu a regra da pobreza. Rede: quem não paga é cortado, e o índice
conta os atendidos. Em 20 turnos: preço +20 dá favela +3,5 no `teste` e +7 no
`teste-pobre`; teto máximo dá saneamento −1,2 e +1,0; concessão máxima +1,9 e
+0,8. Ficha e mapa mostram. Renda é medida contra a média do próprio país, como
nas cestas.

**05/nov (19): Cobertura gratuita feita, commitada.** Peça nova `procura`: quanto cada pessoa usa a rede pública; a Coparticipação vai baixá-la. Fila cresce, planos encolhem, vaga parada se enche; saúde sobe (`cuidado_cedo`) e desigualdade cai (`renda_indireta`). Medido em 20 turnos, `teste`: Tudo para todos 55→46 de atendimento, saúde 50→52; com verba 6%, atendimento 55 e saúde 57,5. Próximo: Coparticipação, Dedução, Conta de saúde, Filantrópicos.

**05/nov (18): Seguro na folha feito, commitado.** Parte do salário cobre quem tem emprego formal, fora do orçamento (4 níveis). O segurado entra com os planos, mas pesa `peso_seguro` 1,2 (plano pesa 1,5; com 1,5 o seguro só piorava a fila). Planos passam de 18%: 30% no `teste` com Todo emprego. Custos: gente vai para `informais-urbanos` aos poucos, rede pública perde profissionais, desigualdade sobe. Deixa cortar a verba sem perder atendimento. Índice novo `emprego_informal` mostra a saída para o informal na ficha (parte das pessoas no pop informal). Próximo: Cobertura gratuita, Dedução, Coparticipação, Conta de saúde, Filantrópicos.

**05/nov (17): Atenção preventiva, Telemedicina livre e Serviço obrigatório feitas, commitadas (`a006d7d1`).** Atenção preventiva: verba (até 3% do PIB) que alcança parte da fila sem vaga nem profissional; rende mais no país pobre (0,5% do PIB: +6,6 no `teste-pobre`, +4,9 no `teste`). Telemedicina e Serviço esticam o profissional da rede pública (`valores.alcance`, `fraco`, `abandono`): só rendem onde falta profissional, e sozinhas no país sem parede mostram só o custo. Fichas conferidas na tela. Lei nova com `leis_alcance` é só JSON.

**05/nov (16): Abertura com custo, commitada.** Saúde de dois andares: "com plano × na fila" sobe a desigualdade (`desigualdadeDaRede`), então a verba e o Limite baixam esse custo. Mercado aberto em 20 turnos: `teste` +7,2 atendimento e +2,1 desigualdade; `teste-pobre` +3,6 e +3,4. Seta e ficha conferidas na tela.

**04/nov (15): verba da saúde corrigida, commitada.** A verba rende menos a cada ponto; vaga sem profissional vira corrupção e sai quando a vaga fecha ou o profissional chega. Instrução leva 6 anos para virar formados. "Médicos por habitante" virou "Profissionais de saúde", em "por mil habitantes". Planos param em cerca de 18% (Seguro na folha deve resolver).

**04/nov (14): saúde, primeira parte, commitada.** A bolha Atendimento mostra a fila ("45 % na fila da saúde"); a bolha Desigualdade passou a mostrar o Gini pelo mesmo conserto. Saúde virou área própria no
mapa. `motor/atendimento` conta vagas, planos e profissionais; índices novos
`atendimento` (mostra a fila da saúde) e `profissionais_saude`. Verba e Remoção
de área de risco não mexem mais direto na saúde. Leis novas: Abertura e Limite aos
planos, que colidem. Profissionais saem de `instrucao` e emigram quando perdem
renda real; a população cai. Em 20 turnos: verba acima de +2 pontos do PIB não
rende mais, porque falta profissional; abertura máxima dá atendimento +7,2 no
`teste` e +3,6 no `teste-pobre`. Número sem balanço.

**Próximo:** commit com a palavra do autor; depois as 16 leis da saúde que faltam
(lista no GDD §18), uma pergunta por vez. A educação é a próxima área.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c, 46799fda, f8b8a705, 0d121456 e os de pops/grupos) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**03/nov/2026**

## Onde está

**Premissa (autor, 02/nov):** bolsa moderna no lugar do mercado vitoriano e da
fatia 8. Minigame **Pregão**: blocos de 2%, tudo no mesmo turno, sem efeito
neutro. Quer tudo junto: várias empresas, criar empresa, cofre real.

**Feito nesta rodada (sem commit):**
- Passo 1: fatia 8 apagada (ficha.ts, propriedade.ts, fichas.json, Fichas.tsx,
  botão "Setores", previaDaFicha, 36 leis de setor, 5 leis de propriedade:
  metodo-venda, preco-minimo-venda, setores-do-estado, fabrica-no-exterior,
  acordo-com-potencias). Energia voltou às 3 camadas antigas. tsc e 187 testes ok.
- Ficam 8 leis na área "Propriedade" (indenizacao, prazo-pagamento,
  regra-pos-venda, politica-estatal, triagem-estrangeira, remessa-de-lucro,
  fabrica-de-fora, concorrencia); ainda sem efeito (campo `valores` no motor).
- Passo 2: `empresas.json` por país (teste: 5, teste-pobre: 3; nomes inventados),
  `empresasDoPais` em `src/partida/index.ts`, Pregão com uma aba por empresa.

**GDD reescrito (autor, 02/nov):** `docs/jogo/gdd.md` descreve o **jogo
pronto**, sem plano nem "depois". Entraram: você é o partido (chapa,
presidente do partido, coesão, caixa); sucessão (assassinato; sucessor de
outro partido = desvantagem até a eleição); ministros como fichas de RPG;
mídia com mecânica própria; coligação; campanha; mandatos e reeleição.
O feito e a ordem foram para o plano (seção 1). Ideia nova = GDD seção 18
(Perguntas em aberto).

**Mesa (autor, 03/nov):** GDD seção 17 virou "Tela: mapa e mesa". A mesa
recebe papéis (lei aprovada pelo Congresso, situação, pedido) para assinar,
vetar, recusar, encaminhar ao ministro ou ignorar; ignorar tem consequência.
Respostas do autor na seção 18 foram para os sistemas; a 18 tem só o que
segue aberto.

**Requisitos (03/nov):** `docs/jogo/requisitos.md`, 108 requisitos (R4.1…)
tirados do GDD com status medido no código: 31 feitos, 17 parciais, 60
faltam (~30% do jogo).

## Próximo

Pilar 1 do Mercado fechado (1a, 1b, 1c). Perguntar ao autor: pilar 2
(empresas) e pilar 3 (bolsa) ainda entram na 12b ou o autor muda de frente?
`npm run check` roda ao fechar a mecânica.

**Feito 03/nov: fatia 1a (46799fda), 1b (f8b8a705) e 1c (tela do Mercado: linha "Construções" por setor, lucro × o de antes, aviso de prejuízo e fechamento).**
`construcoes.ts` + `obras` em `produtos.json`; PIB real = capacidade pronta;
investimento privado abre obras (decisão A do autor). 1b: lucro por setor
(receita − salários − imposto), investimento vai para a margem relativa que
melhorou, 3 turnos de prejuízo fecham 5%/turno, setor do Estado não fecha.
Teste 2,0%/ano e teste-pobre 3,3%/ano, iguais ao 1a. Cenários:
`npm run construcoes`; testes `scripts/construcoes.test.ts` (10).

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

---

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado.
Mercado tipo Vic3 em código até a fatia 7 (comida, Remédios, Energia).
**Fatia 8 (Propriedade) redesenhada e aprovada pelo autor em 02/nov:** o
protótipo v2 (barra de 50 blocos) foi descartado. **Regras gerais = leis
(bolhas)**; **decisão por setor = ficha do setor** (dono estatal/mista/privada,
importação, teto de capital estrangeiro, preço), e cada mudança é um projeto de
lei votado, que segue as leis gerais (indenização, método de venda, prazo,
triagem, Déficit e Superávit etc.). Tudo em `src/motor/mercado/mercado.md`,
fatia 8. Princípios 8 e 9 do escopo (bolha; dados antes da narrativa) escritos.
Skill nova `sisgov-gamedesign` (6 perguntas antes de desenhar).

## Próximo

**Fatia 8 (Propriedade) fechada em 02/nov** (passos 1 a 8; `npm run check` verde,
254 testes). Autor aprovou o jeito da janela "Setores" ("serve, depois
corrigimos"). Próxima ação: autor escolhe a frente seguinte (recomendo
confirmar Energia e Remédios na tela, depois o passo 13, leis em pacotes).
Ajuste menor para depois: depois de "Propor" o botão continua "Propor ao
Congresso" (não diz "na fila"). Investidores = opinião média das potências
(ficou assim; bolsa simulada foi para a seção 11 do escopo).

## Pendências do autor

- Confirmar Energia e Remédios na tela.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (paz × militarismo, seção 11); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado
(`npm run check` verde, 137 testes). **Nova frente: mercado de verdade, bem
parecido com o do Vic3** (autor): a comida do país depende de pessoas, produção,
preço e de quem consegue pagar. Pesquisa salva em
`docs/jogo/mercado-vic3-referencia.md`. Desenho na
**fatia 6** de `src/motor/mercado/mercado.md`; **6a a 6d em código** (comida e Remédios como cestas; falta o autor confirmar Remédios na tela): demanda dos pops, oferta, preço
do país (faixa de 25% a 175%) e segurança alimentar. Autor decidiu: Agro é
grupo de pop, não produto; produtos novos **Grãos** e **Frutas**; todos os
produtos, mas a comida primeiro e só depois de confirmada na tela os outros.

## Próximo

**Fatia 8 (Propriedade e processos)**, desenho em `mercado.md`, ajustado em
02/nov após o protótipo: passos de **2%**, votação só no Congresso (câmara
única), e **sem cofre único**: venda e compra seguem duas leis novas de opções,
*Déficit* e *Superávit* (hoje fixas em `src/motor/contas`). Próximo: **protótipo
v2** (barra de 50 blocos, medidor de custo/destino) para o autor ver; depois
motor das duas leis fiscais, motor do processo, energia, setores, pacotes.

Autor olha a **Energia** (bolha "Infra", 8 leis: 5 verbas por fonte e 3 de
"quem constrói / opera / vende") e o bloco "Energia: capacidade contra demanda"
na janela Mercado, e confirma, junto com Remédios. Em aberto: as outras 5 leis do
pacote (tarifa social, subsídio à limpa, imposto sobre fóssil, licenciamento,
fiscalização nuclear), uma por vez; risco da nuclear. Depois, **uma regra
própria por vez**: Moradia, Infraestrutura (estradas, obras), Militar.
Industriais, informação e luxo ficam para depois. Equilibrar com "Brasil" e
"EUA" só no fim (ver a regra de país real). Demografia é etapa própria.

Outro chat trata da **economia das leis militares**. Em aberto: **eixos novos**
da bússola (paz × militarismo, seção 11).

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado (mecânicas não são protegidas, expressão é; ver pesquisa no chat de 02/nov).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

**Passo 12 (mercado) em andamento.** **Passo 11 (mundo) fechado** em 02/nov: `npm run check` verde (107 testes),
plano e escopo com ✅. Fez: 5 potências (sem nome real) com opinião pela
bússola, reputação = média pesada, poder defensivo, segurança externa =
poder defensivo − (100 − reputação), leis de segurança (blocos A a E),
losangos no mapa e chips "Reputação" e "Seg. externa" na barra do topo.
Comportamento: `src/motor/mundo/mundo.md` e `src/tela/mapa/mapa.md` (fatia 5).
Sem tag (o passo 11 não fecha versão).

**Controle das leis em % (02/nov, depois do passo 11):** as 14 leis em % vão
de 0 a 100% (o Congresso é quem barra: mais de 1/3 da faixa cai). A bússola
continua calibrada pelo máximo antigo (`bussola.ate` na lei). O slider é
novo: régua em %, pino com o valor, marca do valor em vigor, zonas (imposto:
amarelo perto do pico da receita e vermelho depois; verba: vermelho acima do
ponto em que o gasto passa da receita) e sem caixa de número. Comportamento em
`src/tela/mapa/mapa.md` (fatia 6).

## Próximo

**Passo 12 (Mercado) fechado em 02/nov, sem a 5b** (`npm run check` verde, 134
testes). Fez: 7 setores e 22 produtos, cobertura do país, preço do mundo com
ciclo e choques, pops com setores e capital (empregos, salário e lucro), janela
Mercado. A janela é vitrine: PIB e impostos ainda não leem o mercado (5b, na
seção 11 do escopo).

**Dinheiro na tela fechada (02/nov):** barra do topo, Mercado (salários e lucro
por setor) e, ao lado dos controles das leis, "≈ arrecada/custa X por ano · Y
no turno" com a diferença contra o valor em vigor. Por ano e por turno juntos;
símbolo da moeda por país (`moeda` no `estado-inicial.json`); `estado.mudanca`.
Comportamento em `src/tela/mapa/mapa.md` (fatias 7, 8 e 9). `npm run check`
verde (137 testes). **Pergunta ao autor:** compra e vende do Mercado seguem em %
da demanda, porque o motor não tem o valor da demanda de cada produto; converter
pede uma regra nova. Depois: **mais pops** (e mais grupos) e a 5b do mercado.

Outro chat trata da **economia das leis militares**. Também em aberto: quais
**eixos novos** entram na bússola (paz × militarismo, seção 11).

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções (sem regra / permissão prévia / permissão e apagar) foi criada sem confirmação explícita; ver se serve.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**02/nov/2026**

## Onde está

Passo 11 (mundo) em andamento; comportamento esperado em
`src/motor/mundo/mundo.md`. Pedaços 1 a 6 feitos: potências, opinião (curva),
reputação e **segurança externa** = poder defensivo − (100 − reputação), sem
corte (autor aprovou; só pesa de verdade com leis nas pontas da bússola).
Índices novos: `poder_defensivo`, `seguranca_externa`, `lotacao_presidios`
(maior é pior); `seguranca` mostra "Segurança pública". Leis contínuas aceitam
`unidade: "meses" | "anos"` (usadas pelo serviço militar e pela idade do voluntário).

## Próximo

**Pedaço 6 feito** (02/nov): as 5 potências são losangos num anel logo atrás
dos grupos (nome, opinião no anel e dica ao passar o mouse), e a barra do topo
ganhou os chips "Reputação" e "Seg. externa" (`src/tela/mapa/mapa.md`, fatia 5).
Visto na tela. Passo 11 só falta fechar: `npm run check`, plano e escopo ✅.
Antes disso o autor ainda decide: como as leis militares funcionam na economia
(ele pediu) e quais eixos novos entram na bússola (paz × militarismo está no
escopo, seção 11). Depois: passo 12 Mercado. Ideia do autor, ainda não feita:
empresas em volta, perto do anel das potências (outra frente).
Leis de segurança: todas criadas (blocos A a E).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções (sem regra / permissão prévia / permissão e apagar) foi criada sem confirmação explícita; ver se serve.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**01/nov/2026**

## Onde está

Passo 11 (mundo) em andamento; comportamento esperado em
`src/motor/mundo/mundo.md`. Pedaços 1 a 3 feitos: as 5 potências (sem nome
real); opinião de cada uma anda 10% por turno rumo à desejada, que é uma
**curva** (100 × (1 − f²)); posição do país = média das leis na bússola;
reputação internacional = média das opiniões pesada pelo `peso`. A bússola
(2 eixos, 4 polos) está resumida em `docs/jogo/bussola.md`.

## Próximo

Pedaço 4: segurança externa (proposta feita ao autor no chat, espera o sim).
Feito nesta rodada: opiniões de partida dos testes perto da desejada; conta
da bússola em laço sobre `EIXOS` (aceita mais eixos). Falta o autor dizer
quais eixos novos entram (decisão dele). Peso por lei fica para o passo 13.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).

---

**01/nov/2026 (bússola política)**

## Onde está

O mapa é a única tela do jogo (fatias 1 a 4 feitas, `src/tela/mapa/mapa.md`).
Frente atual: **motor de leis**. Feito: **bússola política**. Leis (cada
ponta da faixa ou opção) e grupos têm posição em dois eixos; o grupo reage
eixo por eixo ao quanto a lei se aproximou dele, até ±15 por lei. Satisfação,
voto dos partidos, prévia e setas do mapa leem a bússola
(`src/motor/grupos/grupos.md`). A lista `grupos` saiu das leis.

## Próximo

Espera decisão do autor: o passo seguinte é o lote de leis novas, já com
bússola (índices órfãos Desigualdade e Polarização primeiro), ou os pops com
posição que desliza pela renda (seção 11 do escopo)?

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

**01/nov/2026 (tela: o mapa)**

## Onde está

Versão 1.0 enviada (`v1.0`). Frente nova, decidida com o autor: **a tela do
jogo é o mapa da tela antiga, reaproveitado** (`src/tela/mapa/`, lendo a
`VisaoPartida` de `src/partida/visao.ts`). Comportamento em
`src/tela/mapa/mapa.md`.
**Fatia 1 feita:** mapa com esferas, leis, bolhas e setas.
**Fatia 2 feita:** clicar numa lei abre a janela do antigo (`DocumentoLei.tsx`):
controle, efeitos diretos do motor (`partida/previa.ts`) e "Enviar ao
Congresso", que põe o pedido na fila do turno (a mesma do Painel).
**Fatia 3 feita:** barra do topo do antigo (`BarraDoTopo.tsx`: caixa, dívida,
apoio com dica) e "Passar o turno" no mapa, que abre o "Resultado do turno"
(`ResultadoDoTurno.tsx`: votações e eleição). O mapa já joga uma partida
inteira sem o Painel.
**Fatia 4 feita:** o Painel de tabelas saiu (e `Leis.tsx`); Salvar, Carregar e
Recomeçar agora ficam na barra do topo. O mapa é a única tela do jogo.

## Próximo

Frente A: mais leis e revogar lei. Proposta curta para o autor aprovar antes
de implementar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Mais leis e revogar lei (frente A) esperam o mapa ficar jogável.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

**01/nov/2026 (passo 10, versão 1.0; commit e tag já enviados)**

## Onde está

**Passo 10 (Tela) fechado em 01/nov; versão 1.0 completa, tag `v1.0`
criada (sem push).**
Tela simples em React (`npm run dev`): escolher país e semente, grupos,
índices, leis com controle para propor, fila de pedidos, votação do
Congresso e resultado da eleição. Salvar e carregar no navegador
(`src/partida/salvar.ts`, texto JSON com país, semente e estado). Jogada uma
partida inteira na tela: parado perde em 24 turnos e a partida encerra;
transferência de renda vence e segue.

## Próximo

Conversar com o autor sobre o que vem depois da 1.0
(plano, seção 9; seção 11 do escopo guarda as ideias). O push do commit e da
tag `v1.0` espera a palavra do autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- A tela é a versão simples: o autor decide o que melhorar primeiro.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).

---

**01/nov/2026**

## Onde está

**Passo 9 (Eleição e desgaste) fechado em 01/nov; versão 0.4 completa, tag
`v0.4` criada (sem push).**
Desgaste de 2,25 por mandato; a lei `duracao-mandato` (4 ou 5 anos, campo
`mandato_anos` nas opções) define o mandato; no fim dele o apoio (satisfação
pesada por pessoas − desgaste) decide, e perder encerra a partida
(`npm run eleicao`). Os grupos agora medem a renda contra o crescimento
esperado do país: parado, o governo perde por pouco; a transferência de
renda vence.

## Próximo

**Passo 10, Tela:** proposta curta para o autor aprovar. O push do
commit e da tag `v0.4` espera a palavra do autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.

---

**01/nov/2026**

## Onde está

**Passo 8 (Congresso) fechado em 01/nov; versão 0.3 completa (passos 7 e 8),
tag `v0.3` publicada.**
Partidos são do país (`paises/<id>/congresso.json`): cadeiras, grupos que
defendem, governo e coligação. Toda mudança de lei vai a voto; mais de 1/3
da faixa num pedido é exorbitante e cai (`npm run congresso`). Scripts de
economia usam `criarPartida(pais, semente, { semCongresso: true })`.

## Próximo

**Passo 9, Eleição e desgaste:** proposta curta para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

---

**01/nov/2026**

## Onde está

**Passo 7 (População e grupos) fechado em 01/nov.** 6 pops com renda pelo
motor (`npm run pops`); 4 grupos (trabalhadores, classe média, empresários,
ambientalistas) com satisfação, radicais e lealistas (`npm run grupos`).
Cada lei declara no JSON o que cada grupo quer dela. Versão 0.3 fecha com o
passo 8.

## Próximo

**Passo 8, Congresso:** proposta curta (o que entra, o que fica de fora, uma
decisão) para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 7 (População e grupos), parte 7a feita:** 6 pops (lista aprovada),
renda por pessoa calculada pelo motor (bruta − imposto de renda +
transferência); `npm run pops` confere. Imposto plano; lei de gasto com
`para: { estrato }` vira renda do estrato.

## Próximo

**7b, grupos:** proposta curta dos 4 grupos (quem forma cada um, o que
cobra, quais leis apoia ou rejeita) para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 6 (Leis da V1) fechado em 01/nov, versão 0.2** (tag `v0.2`). 14 leis
conferidas por script; o país declara só as leis que tem; dois países de
teste (`teste` e `teste-pobre`); força dos efeitos 2/5/10.

## Próximo

**Proposta curta do passo 7 (População e grupos)** para o autor aprovar:
ler só a linha do passo 7 no plano e no escopo (seção 6). Espera o autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passo 5 (Contas) fechado e no GitHub. **Passo 6 (Leis da V1)**: 6a, 6b,
6c-0, 6c e 6d feitos; `npm run check` verde.

- 14 leis (impostos, gasto, pena de morte, 6 ambientais); o país declara só
  as leis que tem.
- 6d: força dos efeitos 2/5/10 pontos (era 1/3/6); segundo país
  `teste-pobre` só em JSON; `npm run paises` joga os dois.

## Próximo

Autor confere `npm run paises` e aprova **fechar o passo 6** (plano e escopo
com ✅, tag v0.2). Depois, abrir o passo 7 (Grupos) com proposta curta.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passos 2b, 3 e **4 fechados: versão 0.1** (um mandato jogado por script),
com tag `v0.1` e enviada ao GitHub.

- `src/motor/turno`: `avancarTurno(regras, estado, pedidos)`, 10 etapas;
  as vazias pulam (`turno.md` diz o que cada uma faz hoje).
- `src/motor/efeitos`: força fraca/média/forte = 1/3/6 pontos, **tamanho
  inteiro** do efeito, que chega em linha reta ao longo do atraso.
- `src/motor/acaso`: semente no estado; mesma semente, mesma partida.
- `src/conteudo/paises/teste/`: país inventado (pico 0,5).
- `npm run mandato`: IR 10/30/50% → arrecadação sobe, padrão de vida cai.

## Próximo

**Passo 5, Contas**: proposta curta para o autor aprovar
(receita − gasto − juros → dívida; juros sobem com a dívida).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Onde está

[Escopo](docs/jogo/escopo.md) e [plano](docs/jogo/plano-de-desenvolvimento.md)
aprovados; passos 2b e **3 fechados**.

- `src/motor/estado`: ids dos índices essenciais.
- `src/motor/calculos`: registro de bases com `renda` (Laffer + evasão; o
  **país declara o pico**, padrão 0,6; fonte em `calculos.md`).
- `src/motor/leis`: tipo da lei e validador (erro com arquivo, campo, motivo).
- `src/conteudo/mundo/leis/`: `imposto-renda.json` e `pena-de-morte.json`.
- Contrato em `src/partida/conteudo.test.ts`: toda lei nova é validada sozinha.

## Próximo

**Passo 4, Turno mínimo:** proposta curta para o autor aprovar (turno,
fila de efeitos com atraso, acaso com semente, país de teste e
`scripts/mandato.ts`). Decisão em aberto para propor: quanto vale em número
cada força (`fraca`, `media`, `forte`).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow); demo temporária vai em `rascunho/` e sai depois.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.

---

**31/out/2026**

## Recomeço do mundo

Leis, índices, consequências, dilemas e eventos **apagados** para refazer do zero.
O jogo não roda até o mundo novo existir (de propósito).

Backup: tag `mundo-antigo-2026-10-31` e `arquivo/mundo-antigo-2026-10-31/`.

## Próximo

1. Escrever os índices novos (lista aprovada abaixo) em `src/conteudo/mundo/indicadores/`.
2. Modelo de lei: efeito declarado em unidade humana; o motor converte (sem a armadilha do ÷3).
3. Contas essenciais em TS só com identidades contábeis; o que é de lei ou país vai para JSON.
4. Primeiras leis genéricas, uma por vez, cada uma com o comportamento esperado escrito antes.
5. Adaptar módulos (economia, população, Congresso). Dilemas, eventos e ministros só depois.

## Índices aprovados

- **Essenciais** (física de qualquer país): população, ocupados, desemprego, PIB real,
  crescimento, inflação (nível de preços), PIB nominal, receita, gasto, resultado,
  dívida, taxa de juros.
- **Jogabilidade**: padrão de vida, instrução, industrialização, saúde, segurança,
  pobreza, desigualdade, corrupção, liberdades, polarização, meio ambiente,
  reputação internacional, aprovação; por grupo: satisfação, radicais, lealistas.

## Ainda aponta para o mundo antigo (refazer junto)

- `src/conteudo/mundo/`: bussola, gatilhos, pressao, populacao, reguas, congresso.
- `src/conteudo/paises/brasil/`: estado inicial e níveis das leis antigas.
- 57 ids citados em `src/game/` e `src/app/`.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)).

Feito: PIB nominal consertado (setas `*--pib-nominal` com coeficiente 0,01 → 0,25;
estava 25× fraco). Agora 12,8 → 16,3 mi em 24 turnos (+28%).

Mesmo assim os dois seguem iguais (24 turnos, semente 7):

| | Mujica | Bolsonaro |
|---|---|---|
| Satisfação | 47,5 → 44,9 | 47,5 → 44,6 |
| Dívida | 79,6 → 95% | 79,6 → 101% |
| Bússola final | (0,1; −3) | (1,2; −0,1) |
| Eleição | venceu | venceu |

Próximo suspeito: **o programa do Bolsonaro em `src/conteudo/bussola/programas.json`**.
As 16 leis chegam todas ao alvo (8 já valiam, 8 passaram, nenhuma caiu), e mesmo assim
a bússola para em (1,2; −0,1), longe de (7,3; 7,7). Não é o Congresso: é o programa
fraco ou o peso das leis na bússola.

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (~6 min).

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)). Passo 2: descobrir por que o
PIB nominal não cresce (12,03 → 12,15 mi em 24 turnos com ~5% de inflação; esperado ~+22%).

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (24 turnos, ~6 min).
Hoje: satisfação 44,4 × 44,5, dívida 97 × 105%, os dois vencem a eleição.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Bolsonaro aprova só 8 leis e a bússola para em (1,2; −0,1), longe de (7,3; 7,7).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

A economia vai ser redesenhada e é a próxima frente. Antes de código, o autor diz o
que está errado ou faltando nela; depois, proposta curta no chat.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026` (juros), `cooperacaoInternacional`: economia, voltam com a economia nova.
- `gabinete` (ministro sem grupo leal com 25 grupos): ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Não joguei uma partida na tela até a eleição depois do turno de 2 meses.
- Esperando o autor: industrialização (índice ou setores), mídia na V1, estado dos grupos.

## Jeito de trabalhar (combinado em 31/out)

- Toda rodada fecha um item, interno ou visível.
- Nada de teste em mecânica que ainda vai mudar.
- Ideia nova vira uma linha no fim do PLANO; o mapa não é reescrito.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 31/out/2026 (mapa das mecânicas refeito em fases; próximo: Fase 0, base verde).**

## Mapa refeito em fases (31/out)

O autor pediu um plano em que **preencher o JSON de todas as leis = V1 pronta**. O [mapa das mecânicas](docs/jogo/mecanicas/mapa-das-mecanicas.md) agora vem em fases:

- **0. Base verde**
- **1. Contrato da lei e verificador**
- **2. Sistemas que leem o contrato:** economia fechada, a lei vira motivo, estado dos grupos, partido e fim de jogo, feed
- **3. Preenchimento**
- **4. Calibragem e acabamento**

O mapa tem também uma tabela das técnicas adotadas: núcleo isolado, passo fixo, orientado a dados, módulos que se falam por estado e tags, grafo com verificação, economia fechada e máquina de estados.

O PLANO aponta para essa ordem ("Ordem em vigor"). Os 48 efeitos em reais fixos deixaram de ser edição à mão: viram regra única no carregamento das leis (Fase 1).

**Esperando o autor:**
- Industrialização: índice simples ou setores?
- Mídia na V1?
- O estado dos grupos entra?

**Próximo:** Fase 0, que é acertar os 11 testes que falham (lista abaixo) e jogar uma partida na tela até a eleição. Na mesma rodada, propor no chat o contrato da lei (Fase 1).

## Estado em 31/out, fim da rodada

**Commits locais, sem push (só com a palavra do autor):** `959d89cc` população, `b20e435c` regra da lei no mapa (J2), `b0d73e87` formatação e lint, `2c0226d0` cache do `pacoteVivo` por memória, e o do tempo limite dos testes lentos de ocorrências. Fora de commit, por decisão do autor: `PLANO.md` (modificado), `arquivo/`, `docs/jogo/interface/mapa-em-tres-aneis.md`.

**`npm run check` (~36 min):** formato, lint e build passam. 14 testes falharam; 3 eram da população (lint/teste, corrigidos) e **11 falham igual no commit `53f77220`, antes da população**: `contasSemFuros` A1 e A2, `brasil2026` (juros), `fichaV3`, `mesaDoSalarioMinimo`, `cooperacaoInternacional`, `natalidadeNatalidade`, `saudeMortalidade`, `partida.test.ts` (2 de prévia), `previdenciaTransferenciaSeparada`. Causas por descobrir, em outra frente. `pisosVinculados` passa sozinho (92 s); o estouro no check veio da carga.

**Custo por turno:** gargalo era o cache do `pacoteVivo` derrubado por quem lê sem memória. Agora 1,70 s por turno contra 0,97 s antes da população (era 2,21 s). Sobram 6 montagens por turno (eram 3). Cortar mais = cache por conteúdo ou passar o pacote pronto entre os passos do turno, pedido de refatoração separado (anotado no PLANO). Por isso `ocorrencias.test.ts` (2 testes) e `ocorrenciasVariedade.test.ts` ganharam tempo limite de 240 s e 300 s; passam em 115 s e 180 s.

**Depois do check (31/out):** commits `e0698104` (ex-informal desempregado faz bico, 40% da renda da faixa), `5f112e57` (seguro-desemprego acaba com o tempo: 5 meses, corte linear de 1× a 2× pela memória da coorte) e o dos **4 grupos novos** (`grupo_centro`, `grupo_fora_do_mercado`, `grupo_metropoles`, `grupo_outras_religioes`; valores iniciais 48/50/47/52, ligações e efeitos de lei copiados dos grupos análogos por `scripts/populacao/ligacoes.ts`, que agora grava `efeitos` na lei e aceita filtro por segmento: `npm run populacao:ligacoes -- grupo_centro`). `pais:ancorar` **não** foi rodado inteiro (ajuste antigo mantido, mais 4 novos). Seis leis sem ligação para copiar ficam sem efeito no grupo: regra-fiscal, valor-da-meta-de-inflacao, taxa-basica-de-juros (centro); vagas-de-creche, quem-cuida-do-idoso-dependente (fora do mercado); policias-dos-estados (metrópoles). Teste: `populacao.test.ts` 13 verdes, censo 26. **Não vi na tela do app** (fluxo exige chapa e 11 ministros), só por script. A suíte inteira depois dos 4 grupos não tinha fechado quando escrevi isto: conferir contra as 11 falhas antigas.

**Próximo (substituído pelo mapa em fases, acima):** ~~resto da J5, depois J14~~. Pontas antigas: 47 efeitos em reais fixos (`normalizacao`); `transparencia_fiscal_internacional` sem lei; `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria" (não rodar sem checar).

## População J5 (31/out): passos 1, 2 e 3 feitos (falta a causa da memória)

Visão do autor: a população é uma IA de jogo (não LLM), módulo independente; cada pessoa pensa e lembra. Leis e economia falam com ela por tags e índices, sem nome de lei. **Feito (commitado em `959d89cc`):** (1) `game/congresso/motivos.ts`: satisfação = 50 + soma de motivos (`grupo`, `bolso`), produtores em lista; (3, só a mecânica) `game/congresso/pessoas.ts`: `pessoaDaChave` sorteia uma pessoa de um perfil por peso, nome e idade fixos pela semente, guarda em `EstadoDoCongresso.pessoas` (salvar e carregar, opcional) e devolve a mesma no segundo clique; `opiniaoDaPessoa` dá os motivos ordenados. A rede social (J14) só entrega a chave do post e passa os nomes de `eleicao.json`. Bússola ganhou a aba **População** (nuvem dos perfis, % por quadrante; `populacao` em `VisaoBussola`). Visto na tela. Testes: `motivos` 3, `pessoas` 4. **Passo 2 feito:** `Motivo` leva `tags`; memória de coorte do desemprego (`game/congresso/memoria.ts`, `EstadoDoCongresso.memoria`, atualizada em `passarTurnoNoCongresso` com `fracoesDeDesemprego` de `vivo.ts`) vira o produtor `memoria` (gratidão de quem voltou a trabalhar, desalento de quem espera há meses), parâmetros em `mundo/congresso.json` (`memoria`, chutes a calibrar). `pacoteVivo(content, valores, memoria?)`: a memória entra na chave do cache; passada em `passarTurnoNoCongresso`, `retratoDoCongresso`, eleição e nas telas da bússola, carisma e visão. **Não passada** (só usam pesos, não satisfação): `aprovacaoViva`, `pedidos`, `tramitacao.chancesDoProjeto`, `contas`, `prepareGameQuarter`. Também consertado: `passarTurnoNoCongresso` perdia `pessoas` no turno de troca-troca. Testes: `memoria` 6. Não há tela da memória (ela aparece na opinião da pessoa sorteada, J14). **Falta:** a causa (por tags ou índices, depende do módulo das leis), seguro e renda de bico do ex-informal. Faixas sem grupo na tela: feito (4 grupos novos, ver acima). **Lei como produtor de motivo (J2):** a lei incomoda quem ela afasta do ponto dele na bússola (distância do ponto do país ao da pessoa, antes e depois), mesma régua do voto do Congresso.

## Mapa das mecânicas refeito (30/out), substituído pela versão em fases de 31/out

`docs/jogo/mecanicas/mapa-das-mecanicas.md` agora é dividido em três partes: Motor (MO1–MO5), Jogo e conteúdo (J1–J13) e Interface (I1–I6). Há uma tabela com a numeração antiga M1–M13. Conferido no código: o motor está pronto. O "proporcional ao PIB" se faz com variável `derivado` (soma de produtos), sem código novo. A exclusão entre leis é regra do jogo (`validatePolicyAction.ts`). O teto de 4× é da tela (`Documentos.tsx`). **Frente escolhida pelo autor: J3 Economia**, que é só conteúdo, para poder pôr e tirar leis econômicas e equilibrar depois. **Motor fechado depois de rodar os testes:** 54 arquivos que usam o motor, 309 de 311 verdes, `tsc -b` limpo. As 2 falhas (`brasil2026`, `fichaV3`) são contas escritas para o turno de 3 meses. Os achados estão no PLANO, em "Achados da conferência do motor (30/out)": 47 efeitos em reais fixos em 11 leis de verba (a correção é só JSON) e `transparencia_fiscal_internacional` sem lei que a mova. Próximo passo: propor por onde começar a J3.

## Mapa em três anéis (30/out), passo 1 feito; faltam 2 e 3

Doc: `docs/jogo/interface/mapa-em-tres-aneis.md`. **Passo 1:** índices e situações (174) ficam em 2 a 5 anéis elípticos (`posicionarIndices` em `ui/mapa/layout.ts`), cada um no lugar livre mais perto do ângulo médio das áreas dele (desvio máximo 35°, teste novo). `relaxar` e `desembaracar` saíram. **Desvio do doc:** dois anéis não cabiam (medido: 111 de 174 com rótulo), então a caixa reservada no anel é só o nó (`caixaDaBolha()`, `raioBolhaReservado` 48) e o nome só aparece com zoom ≥ 1 (`ZOOM_DO_NOME`), em letra que encolhe no mundo, ou no foco. `espalharNoAnel` serve aos grupos. Visto na tela (visão geral e zoom, sem erro de console); **foco numa lei e num índice ainda não conferi**. Próximo: passo 2 (linhas só no foco), esperando o autor.

## Diagnóstico "o jogo responde?" (30/out), antes de mexer em grafo e dilemas

Scripts em `scripts/diagnostico/` (`vite-node`). Resultados, semente 4, 12 turnos:
- `mundo-responde.ts`: jogador parado × tudo no máximo × tudo no mínimo. ~4 ocorrências por turno, mas só 2 dilemas em 12 turnos; o resto é aviso de pressão de grupo (21 a 32), evento solto e fake news. 72 de 91 dilemas têm só sorte pura (~1% por turno).
- `uma-lei-por-vez.ts`: jogador normal mexe em UMA lei (17 leis amostradas). **A lei move bastante coisa**: 16 de 17 mudaram de 6 a 51 das 195 bolhas do mapa; só `regra-de-repasse` não mexeu nada (também serve de controle: sem efeito, não há ruído de sorte). Ou seja, o problema não é "nada se move" e sim "o que se move não vira dilema/evento sentido".
- Próximo (decidido pelo autor): olhar **bolha por bolha** e entender as leis de cada uma (M2.6), conforme o veredito acima.


## M8 em curso: fatia A feita, faltam B, D e a promessa

**Fatia A (29/out):** a partida tem vice e um ministro por área do governo (as 11 áreas de `politica.json`, `game/eleicao/chapa.ts`). A primeira tela escolhe presidente, vice e ministros (aba por área, `Gabinete.tsx`), com o botão "Sortear ministros": 2/3 saem o mais perto do ponto médio da chapa, 1/3 de fora (cota de coalizão). O que ficar vago o jogo sorteia na posse. Na eleição (turno da escolha) o partido vê novos vices e ministros e decide manter ou trocar; a troca vale se vencer (`chapaNova` em `EstadoDaEleicao`). O limite de mandatos segue o `limiteDeMandatos` do país (a lei estender ou encurtar ainda não existe). Testes: `eleicao.test.ts` 16, `tsc -b` limpo. **Visto na tela** a primeira tela (escolher, sortear, tomar posse, sem erro de console); **a troca de chapa dentro do tablet da eleição não foi vista na tela**, só por teste.

**Conserto da tela (29/out, `d423764c`):** a primeira tela rola e vem em dois passos (chapa; depois ministros). Visto na tela.

**Fatia B (29/out), popularidade do ministro:** `game/gabinete.ts`. A nota de cada ministro é a satisfação média dos 3 grupos mais perto do ponto dele na bússola (o ponto do grupo é a média dos perfis de eleitor), pesada pelo tamanho. Não é guardada: sai do estado, e como a satisfação já vem do aquecimento, nasce calibrada pelo país (decisão do autor: nada de 50 para todos). A média das notas, fora de 50, ×0,1 com teto ±4, soma em todos os grupos em `prepareGameMonth` (popularidade do motor) e em `valoresComReacao` (eleição e Congresso). Tela: seção "Gabinete" no tablet da Eleição (cargo, nome, nota, grupos leais). Testes: `gabinete.test.ts` 3, `gatilhos.test` ajustado (sem gatilho **e sem gabinete** os valores são os do motor), `eleicao`, `camadas`; `tsc -b` limpo. **Visto na tela** (notas de 34% a 54%, sem erro de console). **Pesos (0,1 e ±4) são chute.**

**Fatia D, passo 1 (30/out), lealdade exclusiva:** `gruposLeais` agora reparte os grupos: cada grupo é leal a um só ministro, fechando primeiro os pares (grupo, ministro) mais perto na bússola, com cota de ⌈grupos ÷ ministros⌉ por ministro (2 com 21 grupos e 11 ministros). Motivo: só com "o mais perto", um ministro levou 19 dos 21 grupos, porque os ministros nascem juntos na bússola. Ministro sem grupo leal teria nota neutra (50), mas a cota garante ao menos 1 cada. Visto na tela (1 a 2 grupos por ministro, notas de 35% a 60%). Limite: os ministros nascem sem ligação com a área, então "Saúde" pode ficar com Ricos e Classe média; a ideologia dele vem do sorteio da chapa. Se incomodar, o ponto do ministro deveria puxar para o lado típico da área.

**Decisões do autor (29/out):** a cada eleição o jogo pergunta se mantém ou troca; passados 2 mandatos seguidos a troca é obrigatória, se a lei assim mandar. Ministro é o da bolha (um por área), no centro dela. O Senado só olha a lei, não a popularidade do ministro. Grupos são leais ao ministro pelo lado ideológico dele (conta, não sorteio).

**Fatia D, passo 2 (30/out), ministro porta-voz:** `game/pedidos.ts` (puro) e `app/partida/pedidos.ts`. Por turno, cada ministro pode trazer um pedido (chance 2% + 2% × articulação, dobra se a nota dele está abaixo de 45); no máximo um por turno, e o que ninguém respondeu caduca no turno seguinte. O pedido é a opção de uma lei da área dele (`ESTRUTURAS[país].ministerios`) mais alinhada com o ponto médio dos grupos leais (produto escalar com o vetor da bússola), nunca a que já vale nem lei na fila. Aceitar chama `mudarLei` (vai ao Congresso se a lei pede) e dá +3 de satisfação aos grupos leais; recusar dá −3. O favor fica em `election.favores`, decai pela metade por turno e entra por `pontosDoGabinete` (popularidade do governo e eleição). O Senado só vê a lei. Tela: seção "Pedido do ministro" na Eleição do tablet, com Aceitar e Recusar. Testes: `pedidos.test.ts` 2; `gabinete`, `eleicao`, `gatilhos`, `camadas` seguem verdes. Visto na tela (pedido no 1º turno, Recusar respondeu). **O "e depende…" do autor ficou cortado:** pus como dependências a articulação do ministro e a insatisfação dos grupos dele; ajustar se era outra coisa. Limites: a nota do ministro (`notasDoGabinete`) não lê o favor; os pesos (3, 2%, 45) são chute.

**Promessa contra ação (30/out):** `game/promessa.ts`. O lado que o presidente quer é o do ponto dele na bússola em relação ao `compass.inicio`; se o ponto atual do governo andou ao contrário nesse eixo, a soma do caminho contrário, acima de 1 ponto de tolerância, tira 0,5 de satisfação por ponto de todos os grupos (teto 4). Não cumprir o que prometeu (ficar parado) não pesa; só o caminho contrário. Entra junto com o gabinete por `pontosDoGoverno` (motor em `prepareGameMonth` e `valoresComReacao`). Tela: frase na Bússola, em "Como o seu governo está sendo visto", só quando pesa (sem mostrar o lado do presidente). Testes: `promessa.test.ts` 2; `gabinete`, `gatilhos`, `camadas` verdes. Visto: Bússola abre sem erro e sem a frase no começo; **a frase em si não vi na tela** (só no teste). Limites: usa o ponto do presidente, não as frases dele; os números (1, 0,5, 4) são chute.

**Carisma vivo (30/out):** `game/carisma.ts` + `app/partida/carisma.ts`; `EstadoDaEleicao.carismaViva` (desvio ±1,5), 20% por turno rumo ao alvo (satisfação média ±30 e promessa quebrada); vale no voto do presidente que concorre (`candidatosDaEleicao`) e na ficha. Reinicia com presidente novo. Chutes: 1,5 / 20% / 30 / 0,5. Falta o lado dos ataques da mídia (M13). Teste `carisma.test.ts`.

**Turno de 2 meses (30/out):** `MESES_POR_TURNO=2`, mandato de 24 turnos, `turnosDoConteudo`/`chanceNoTurno` em `calendario.ts` convertem o conteúdo escrito em trimestres (implantação, intervalos, janelas, chances, investigação, pedidos). Congresso `turnosPorAno` 6, pesquisas e escolha da eleição reescaladas. Falta conferir na tela e rodar a suíte; próximo: M9.

**M9 fatia A (30/out):** cada projeto da fila mostra a chance de sim de cada bancada e o motivo que mais pesa; seu partido em dourado. Não vi a fila na tela (só o plenário); teste em `tramitacao.test.ts`. **Fatia B (30/out):** cada votação feita guarda o motivo de cada bancada (`porBancada.motivo`) e o tablet mostra em "Por que cada bancada votou assim"; não vi na tela. `tramitacao.test.ts` 23/23 (a falha antiga foi carga). **Quem mudou de lado:** a votação guarda a `chance` da bancada; o tablet marca "mudou de lado" quando o voto da maioria contraria o lado esperado (chance ≥ 50%). Não vi na tela. **Pétrea (fatia D):** `enviarAoCongresso` numa pétrea não muda a lei nem entra na fila; as bancadas perdem `humor.petrea` (-10) e cada grupo perde `petreaNaPopulacao` (4 pontos, via `favores`, que decaem à metade por turno); a tela avisa. Constantes chutadas. Não vi na tela: o tablet das leis pode travar a pétrea (cadeado) antes de chegar aqui. **Plenário fiel (fatia E):** a legenda de cada casa mostra a disposição de cada bancada com o governo (de bem ≥55, de mal ≤45, neutra), vista na tela. Falta: conferir a pétrea e a fila na tela. Teste `ocorrencias` "mesma semente" estourou 120 s com a máquina carregada (lentidão, rodar sozinho).

**Ordem do autor (30/out):** ministros são tempero (não mexem na jogabilidade) e ficam para o final; não abrir item deles até ele chamar. O jogo ainda não é desafiador nem aceitável como jogo depois de escolher a chapa: essa é a prioridade.

**Falta, na ordem:** M13 Mídia (ataques entram no carisma). O ministro hoje só tem ficha e opinião; a gestão dele ainda não mexe na eficácia das leis. 3 testes (`contasSemFuros` ×2, `ocorrenciasVariedade`) estouram tempo por lentidão, não por asserção; a decidir antes da calibragem.

**Atualizado antes em 29/out (M7.3, grupos reagem aos gatilhos, feita).**

## Grupos fechado (30/out), pushado

Tudo na `main` e pushado (`f74f0849`; depois dele, itens 2, 4 e 5 até `b1a8596a`). Passos feitos hoje: (1) o bolso entra na satisfação do perfil (±10, só eleição e Congresso); (2) `pacoteVivo` usa o eleitorado inteiro vivo (emprego, renda, valores, religião), em cache por turno; (3) radicais e lealistas na tela (topo do painel Eleitorado e em cada grupo); (4) desempregado com ponto de economia. Limites (13) a (17) no PLANO, item 3. Visto na tela: "aprovação 45% · 11% contra · 6% a favor" e a mesma linha em cada grupo, sem erro de console.

**Check (30/out):** `npm run check` rodou: 649/650, a única falha era `camadas.test` (UI importava `game/congresso/polarizacao`; corrigido pelo re-export em `app/partida/tipos.ts`, teste agora verde).

**País em frases fechado (30/out):** a Informalidade mostra "38,6%" e "Em % de ocupados informais" (`jaEPorcento` em `formatos.ts`; teste em `medida.test.ts`; visto no boletim).

**Item 4 fechado (30/out):** `taxa_mortalidade` virou calculado, com seta de `saude_populacao` (coef −0,3, termo 29,62, atraso 1; neutra no início). Pandemia agora mata (+3‰). Mexer no coeficiente pede refazer o termo (o motor não escala o termo pela população). Falta o `npm run check`.

**Item 5 fechado (30/out):** `taxa_natalidade` virou calculado, com seta da fecundidade (`natalidade`, coef 0,2446, termo 6,115, atraso 1; neutra: 12‰). Política de natalidade intensa agora sobe a taxa e a população. `populacaoEmPessoas.test` ajustado (natalidade e mortalidade são calculadas; o teste as derruba a cada turno).

**Check dos itens 2, 4 e 5 (30/out):** passou, 652/652, e foi pushado (`b1a8596a`). O 1º check achou 4 falhas: o país mínimo declarava `taxa_natalidade`/`taxa_mortalidade` (D-41, calculada não leva valor no país) e as duas variáveis estavam sem `medida`. Corrigido (`conserto: taxas … com medida`). Coeficientes de natalidade e mortalidade são chutes, a calibrar.

**Piso do salário mínimo fechado (30/out):** carteira e servidor ganham no mínimo o salário mínimo da lei (`bolso.piso` + `seguePiso` em `mundo/populacao.json`, lido em `game/congresso/bolso.ts`). Neutro no início; só sobe. Visto por script (`scripts/teste/piso-minimo.ts`: com o mínimo em 100%, carteira pobre vai de R$ 1.862 a R$ 2.468/mês); **não visto jogando na tela** (a lei do mínimo exige criar partida e votar). Testes: `bolso.test` 33 e `bolsoNaSatisfacao.test` 4; `tsc -b` limpo. Falta `npm run check` e push.

**Check do piso (29/out):** passou, rodado pelo autor em outra sessão. Falta o push (só com a palavra do autor).

**Reorganização (29/out):** o jogo agora é mapeado por mecânicas e submecânicas em `docs/jogo/mecanicas/mapa-das-mecanicas.md` (proposta; o PLANO ainda não foi remanejado). Ordem: M7 primeiro; M2 por último (motor antes, conteúdo lei por lei no fim, com a calibragem).

**M7.1 feita (29/out):** a `popularidade_governo` agora lê o eleitorado vivo (emprego, renda, valores, religião e bolso), o mesmo da eleição. O motor aceita uma `approval` opcional em `advanceExecution` (`ProfileApproval.perfis[].ajuste` = bolso); o jogo a monta por mês em `prepareGameMonth` com `aprovacaoViva` (`game/congresso/index.ts`). Turno 0 não muda (45%). Testes: `aprovacaoViva.test.ts` 4, mais `paisV1`, `tramitacao`, `jornal`, `mesaDoSalarioMinimo`, `populacao`, `gruposSociais`, `camadas`; `tsc -b` limpo. Visto na tela: turno 0 em 45%, um turno encerrado sem erro de console (a queda a 41% veio junto com uma ocorrência de escândalo, então não prova a M7.1 sozinha). **Falta `npm run check`** (só ao fechar a M7 inteira). O limite (13) do PLANO ("a aprovação do motor não lê o bolso") deixou de valer. Sem remanejar o PLANO ainda.

**M7.2 feita (29/out), gatilhos:** `mundo/gatilhos.json` define 11 gatilhos (corte e expansão de gastos, agenda de mercado, estatista, conservadora, liberal nos costumes, social, linha dura, verde, pró-trabalhador, reforma constitucional). `game/gatilhos/index.ts` os liga a partir do `history` de cada lei (mudança de meta nos últimos 4 turnos, mínimo 3) e do caminho da bússola (rumo ≥ 0,3 em 4 turnos); nada é guardado no estado. A Bússola mostra "Como o seu governo está sendo visto". Testes: `gatilhos.test.ts` 14, `tsc -b` limpo. **Visto na tela só o estado vazio** (turno 0, sem erro de console); a ativação está provada por teste, não jogando. Limiares (3 em 4, 0,3) são chutes, a calibrar. **M7 fechada (29/out), `npm run check`:** formato, lint e build passaram; nos testes, 20 de 122 arquivos rodaram até eu parar (~31 min) e 5 testes estouraram tempo por carga (`contasSemFuros`, `ocorrencias`, `ocorrenciasVariedade`, `pisosVinculados`); `pisosVinculados` passa sozinho e leva o mesmo tempo sem a M7. O restante da suíte não foi rodado; autor aceitou assim. **Eleição e Congresso leem a reação (29/out):** `valoresComReacao` (`app/partida/bussola.ts`) soma a reação dos gatilhos à satisfação `grupo_x` (0 a 100) e é o que `passarTurnoNaEleicao`, `renovarCongresso`, `passarTurnoNoCongresso` e `retratoDoCongresso` recebem como `valores`; devolve o mesmo objeto enquanto a reação não muda (o eleitorado vivo é guardado por valores). Testes em `gatilhos.test.ts` (27). **Gatilhos fiscais feitos (29/out):** `arrocho-fiscal` e `farra-fiscal` (regra `fiscal`: resultado fiscal andou ±2,5 pontos do PIB em 4 turnos). O `caminho` da bússola passou a guardar `resultado` por turno (campo opcional, saves antigos não ligam nada). Dívida não é guardada: nenhuma regra a usa. São 13 gatilhos; `gatilhos.test.ts` 24 verdes, `tsc -b` limpo; `scripts/teste/gatilhos-fiscais.ts` mostra o resultado guardado (sem mexer nas leis o déficit só anda ~0,27 por turno, então não liga sozinho; limiar 2,5 é chute). `npm run check` só ao fechar a M7 inteira.

**M7.3 feita (29/out), grupos e frases reagem aos gatilhos:** cada gatilho em `mundo/gatilhos.json` ganha `reacoes` (grupo, pontos de satisfação, frase e, opcional, `areas`: só reage se a decisão caiu nelas). O corte e a expansão de gastos dependem da área: corte na saúde derruba pobres e periferias, em educação derruba jovens e famílias com filhos, na defesa os conservadores. Os pontos mexem na satisfação do grupo na tela (`gruposDaPartida`) e na popularidade do motor (`aprovacaoViva(content, valores, reacoes)`, via `prepareGameMonth`); somam por grupo com teto de ±8. A fala do grupo no jornal vira a frase da reação, e o jornal ganha a linha de leitura da imprensa (neutra sem gatilho). Testes: `gatilhos.test.ts` 20, mais `aprovacaoViva`, `jornal`, `gruposSociais`, `camadas`; `tsc -b` limpo. Script: `scripts/teste/gatilhos-na-tela.ts` (liga o corte à mão). **Visto na tela só o estado sem gatilho** (frase neutra no Jornal, sem erro de console); a reação está provada por teste e script. **Limite:** a eleição e o Congresso (`pacoteVivo`) ainda não leem a reação, só a popularidade e a tela; pontos (±3/±4, teto 8) e as ~70 frases são chutes, a calibrar e revisar na revisão de texto. **Falta `npm run check`** (só ao fechar a M7 inteira).

**Próximos itens (não abrir sem perguntar):** antipartido/desgaste.

## (histórico) Os quatro achados da camada B, corrigidos em 29/out

- **Aposentadoria × reajuste:** o benefício agora é valor médio × `nivel_reajuste_de_beneficios`/100 (tabela: campo `reajuste`). Na tela, aposentado sobra R$ 2.343/mês, abaixo de carteira e servidor, e a lei de reajuste mostra "aposentados, R$ 631 a mais".
- **Imposto sobre consumo:** a arrecadação do motor é dividida entre todos que consomem (benefício incluso). A soma dos perfis fecha com a arrecadação (razão 1,000000, teste novo).
- **Lucros:** empresário, agro patronal e pequeno empreendedor (`capital: true`, sem salário) repartem `lucros`; pagam também renda de empresas e dividendos. Os lucros fecham (teste novo).
- **Quem pagou:** `quemPagouAConta` agora agrega por ocupação × renda e mostra as 6 faixas que mais sentiram.
- Testes: `bolso.test.ts` 22 e `censo` + `treemap`, 38/38; `tsc -b`, eslint e prettier limpos. **`npm run check` completo ainda não rodou sobre estas correções.**

**Calibragem aberta, não é bug:** empresário sobra R$ 95 mil/mês e agro patronal R$ 89 mil, porque `lucros` (6,8 mi contra 3,6 mi de salários) é repartido por 6,7% do eleitorado. O número vem do motor; vai para a calibragem (item 12 do PLANO).

**Menores ainda abertos:** salário médio negativo sem guarda; `MESES = 12` repetido em três lugares; a prévia compara só o último mês do horizonte; `censoDoPais(content)` sem valores devolve bolso zerado; a parte do eleitorado arredonda para "0%" nas ocupações pequenas.

## Por onde continuar

0. **Fechar a camada C** (revisão e `npm run check`, ver o topo).
1. **Camada C, partes seguintes**: valores, religião. A renda pela sobra está feita (30/out, só leitura): `app/partida/rendaViva.ts` move peso entre pobre/média/rica quando a sobra do perfil, em salários médios, muda desde o turno 0 (`GameState.valoresIniciais`, novo e opcional). Uma faixa por vez; só o censo usa, a eleição e os grupos não. Script: `scripts/teste/renda-viva.ts`. Visto na tela só no turno 0 (sem variação); o movimento está provado por teste e script, não jogando. Limite: a distância entre faixas é a das médias do início, e o rico quase não se move (chute de direção, calibragem).
   **Valores e religião feitos (30/out, só leitura):** `app/partida/faixasVivas.ts` move peso entre faixas por fluxos declarados em `mundo/populacao.json` (`mudancas`), pela pressão do país desde o turno 0. Valores: segurança, escolaridade, desigualdade. Religião: fluxos diretos entre as três (católico e sem religião → evangélico; católico e evangélico → sem religião). Solto de propósito, a calibrar. Visto na tela só no turno 0; movimento provado por teste e por `scripts/teste/valores-vivos.ts`. **A camada C está completa.** O `npm run check` completo roda só quando o Grupos inteiro terminar.
2. **Ligar o bolso na satisfação** (hoje ele só aparece na tela, decisão de
   29/out). Tem desenho próprio; mexe no que já está calibrado.
3. (feito) Ponta solta da Informalidade.
4. (feito) Saúde → mortalidade. 5. (feito) Natalidade.

## O que fechou nesta rodada

**País em frases** (fase 3): a bolha diz como está em vez de mostrar pontos do
motor. 55 das 192 falam; o resto cai no número, de propósito.

**Censo da população** (Grupos, camada A): a aba População, uma ficha por
atributo — pizza até seis faixas, treemap acima disso. Duas telas foram
descartadas antes por não se lerem (lista de barras, cem bonecos).

**Bolso e ocupação** (Grupos, camada B): cada perfil tem renda, imposto,
benefício e sobra, repartidos dos agregados que o motor já calcula. O censo
mostra quanto sobra por faixa, e a lei diz no bolso de quem ela bate.

## Decisões desta rodada, para não refazer a conversa

- **O agregado manda, o perfil divide.** A economia continua calculando o bolo;
  os 2.090 perfis repartem. A virada para "o perfil manda e o PIB é a soma" (o
  Victoria 3 inteiro) fica para depois e continua barata, porque o bolso guarda
  a **fonte** do dinheiro com nome.
- **Os setores econômicos vão existir** (indústria, serviços, agro). Hoje são só
  nome dentro de ocorrências de lobby; a ocupação segura o lugar deles, e eles
  entram pela fonte sem reescrever a camada B.
- **O bolso só mostra, não mexe na satisfação** — por ora.
- **Faixa escrita se julga jogando**: as frases de Gini, HHI e PIB em índice vão
  para a revisão manual bolha por bolha, lá na frente, não agora.

## Limitação conhecida, que não é bug

O imposto é proporcional: todos pagam a mesma fração do que ganham. O sistema
brasileiro é regressivo no consumo e progressivo na renda. Entra na calibragem
(item 12 do PLANO).

## Ferramentas que ficaram

- `npx vite-node scripts/teste/frases-das-bolhas.ts` — a frase de cada bolha
- `npx vite-node scripts/teste/bolso-dos-perfis.ts` — ganha/paga/sobra por faixa

Foram esses dois scripts que acharam o que os testes não achavam: a fração que
mentia em valores pequenos, e o imposto em 61% da renda.

## Armadilhas do projeto, aprendidas na marra

- **`npx tsc --noEmit` não checa nada aqui** — sai 0 com erro na cara. O projeto
  usa project references: o comando é `npx tsc -b`.
- **Reescrever um arquivo grande com o dev server ligado** pode fazer o Vite
  cachear um módulo vazio e dar tela branca. `Ctrl+Shift+R` resolve.
