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
