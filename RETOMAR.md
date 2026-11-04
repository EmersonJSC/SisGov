# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

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
**Próximo:** proposta do que a favela piora e quais grupos cobram moradia (GDD §18).

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
