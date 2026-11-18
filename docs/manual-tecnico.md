# Manual técnico do SisGov

Como o código está montado, por onde ele anda e onde mexer. Só código: regra de jogo está no GDD.
Escrito em 15/nov/2026 lendo o `src/` e o `scripts/`. Cerca de 31 mil linhas de TS/TSX fora os testes, 61 arquivos de teste, 511 leis em JSON.

---

## 1. Pilha

| Peça | Para quê |
| --- | --- |
| TypeScript 5.7, `strict` | todo o código (`tsconfig.app.json` cobre `src` e `scripts`) |
| Vite 6 | servidor de desenvolvimento (porta 5173, `0.0.0.0`) e build |
| React 19 | só na tela (`src/tela`) |
| d3-force | física das bolhas do mapa |
| @dicebear | rostos gerados das pessoas |
| Vitest 3 | testes (`src/**/*.test.ts`, `scripts/**/*.test.ts`) |
| vite-node | roda os scripts de `scripts/` direto em TS |
| exceljs | lê/escreve as planilhas `docs/jogo/*.xlsx` |
| ESLint + Prettier | estilo e **fronteiras entre camadas** |

Não há servidor nem banco. Tudo roda no navegador; o save vai para o `localStorage`.

---

## 2. Arquitetura: quatro camadas, dependência só desce

```
main.tsx ──► tela/ ──► partida/ ──► motor/
                          │
                          └──────► conteudo/ (JSON)
```

| Camada | Pasta | Pode importar | Não pode |
| --- | --- | --- | --- |
| Entrada | `src/main.tsx` | `tela` | motor, partida, conteúdo |
| Tela | `src/tela/` | `partida`, `motor` (tipos e funções puras) | `conteudo` |
| Partida | `src/partida/` | `motor`, `conteudo` | React, `tela` |
| Motor | `src/motor/` | só ele mesmo | React, JSON, `conteudo`, `partida`, `tela` |

Essas regras **não são convenção, são erro de lint**: `eslint.config.js` usa `no-restricted-imports` por pasta. Se você importar um JSON dentro do motor, o `npm run lint` quebra.

Ideia por trás de cada camada:

- **Motor**: funções puras em TS. Recebe dados, devolve dados novos, nunca altera nada no lugar. Não conhece nome de lei, partido ou país; só formatos ("uma lei tem opções", "um partido tem cadeiras").
- **Conteúdo**: os dados. O mundo (leis, índices, pops, grupos, potências…) e cada país (estado inicial, congresso, governo, pessoas…).
- **Partida**: a cola. Lê o JSON, valida, monta as `Regras` e o `Estado` inicial, chama o motor e prepara visões prontas para a tela. É a **única porta** entre tela e motor.
- **Tela**: React. Mostra e junta pedidos do jogador. Não calcula regra.

---

## 3. Os dois objetos centrais: `Regras` e `Estado`

Quase tudo no motor é uma função `(regras, estado, …) → algo`.

### `Regras` — o que não muda na partida
`src/motor/turno/regras.ts`. Montado uma vez em `criarPartida`. Contém:
- `leis: Record<id, Lei>` — todas as leis do mundo;
- `dominios` — mínimo/máximo de cada índice de jogabilidade;
- `pops`, `grupos` — tipos de população e grupos de interesse;
- `pais: ParametrosPais` — bases de imposto, crescimento, juros, fatias dos pops;
- vários opcionais (`congresso`, `governo`, `mercado`, `potencias`, `moradia`, `saneamento`, `atendimento`, `judiciario`, `fisco`, `organizacoes`, `colisoes`, `derivas`…).

**Padrão importante:** quase todo módulo é opcional nas `Regras`. Sem `congresso`, todo pedido passa; sem `governo`, a lei chega como escrita; sem `judiciario`, não há tribunal. Isso permite testar um módulo sozinho e é como o "sem Congresso/sem Senado" dos cheats funciona.

### `Estado` — o que muda de turno a turno
`src/motor/estado/index.ts`. Nunca alterado no lugar: cada turno gera um objeto novo (`{...estado, campo: novo}`). Contém:
- `turno`, `acaso` (semente do sorteio, ver §6);
- `essenciais` — 16 índices fixos do motor (`INDICES_ESSENCIAIS`: população, PIB, inflação, dívida, juros…);
- `tesouro` — cofre e dívida em moeda;
- `jogabilidade` — os demais índices (definidos no JSON do mundo), e `base` (o mesmo sem as leis);
- `leis: Record<id, ValorLei>` — valor atual de cada lei legislada;
- `efeitos: EfeitoEmCurso[]` — efeitos de lei ainda chegando;
- `pops`, `grupos`, `congresso`, `governo`, `programas`, `midia`, `fatos`, `eleicao`, `moradia`, `capacidade`, `precos`…;
- `anteriores` — últimos 4 turnos de jogabilidade (para a tendência na tela).

### `Pedido` — o que o jogador manda
União em `regras.ts`: `PedidoCongresso` (mudar lei, oferecer moeda, decretar, vetar, assinar…), `PedidoCarimbar` (mesa de papéis), `PedidoNomear` (ministro), `PedidoPrometer` (campanha), `PedidoIndicar` (juiz). Cada um tem `tipo: "…"` como discriminante.

---

## 4. O turno: o coração do motor

`src/motor/turno/index.ts` → `avancarTurno(regras, estado, pedidos)`.

1. Recusa se `estado.encerrada`.
2. Soma 1 ao turno e envelhece os fatos.
3. Passa o estado por uma **lista fixa de etapas** com `reduce`. Cada etapa tem a assinatura `Etapa = (regras, estado, pedidos) => Estado` (`turno/comum.ts`).
4. Confere a contabilidade contra o estado anterior (`motivoContaNaoFecha`); se não fecha, **lança erro**.
5. Guarda `anteriores` e `mudanca` (PIB e dívida).

Ordem das etapas (`ETAPAS`, cada uma em `src/motor/turno/etapas/`):

| # | Etapa | Arquivo | O que faz |
| --- | --- | --- | --- |
| 1 | `congresso` | congresso.ts | pedidos vão à pauta, casas votam (`motor/politica`) |
| 2 | `leisNovas` | congresso.ts | o que passou muda de valor; efeitos entram na fila |
| 3 | `efeitosVencem` | congresso.ts | leis de prazo vencem |
| 4 | `judiciario` | judiciario.ts | vagas, indicações, julgamentos |
| 5 | `economiaReal` | economia.ts | crescimento real (tendência + sorteio), PIB |
| 6 | `precosEJuros` | economia.ts | inflação, preços, juros rumo ao alvo |
| 7 | `capacidades` | economia.ts | capacidade produtiva dos setores |
| 8 | `contas` | economia.ts | arrecadação, gasto, juros → cofre e dívida |
| 9 | `moradia` | moradia.ts | estoque de casas, obras |
| 10 | `saneamento` | saneamento.ts | rede de água e esgoto |
| 11 | `atendimento` | atendimento.ts | rede de saúde/atendimento |
| 12 | `indicesJogabilidade` | jogabilidade.ts | base + contribuição das leis, presos no domínio |
| 13 | `mundo` / `precosDoMundo` | mundo.ts | opinião das potências, preços externos |
| 14 | `popsEGrupos` | populacao.ts | renda, migração, emprego, saída; satisfação dos grupos |
| 15 | `organizacoes` | organizacoes.ts | organizações políticas nascem/crescem |
| 16 | `governo` | governo.ts | nomeações, corrupção dos órgãos |
| 17 | `programas` | programas.ts | leis formam/desfazem programas |
| 18 | `politica` | politica.ts | coligação: quem sai, quem entra |
| 19 | `eleicao` | eleicao.ts | promessa, 1º e 2º turno no fim do mandato |
| 20 | `midia` | midia.ts | jornal com as notícias de maior impacto |
| 21 | `invariantes` | invariantes.ts | confere tudo (números finitos, domínios, somas); erro se quebrar |

`src/motor/turno/turno.md` descreve o comportamento esperado. `obras.ts` não é etapa: são funções comuns usadas por moradia/saneamento/atendimento.

**Para acrescentar uma etapa:** escreva `export const minhaEtapa: Etapa = (regras, estado, pedidos) => ({...estado, …})` em `etapas/`, coloque na posição certa de `ETAPAS` e, se ela cria invariantes, confira em `invariantes.ts`.

`src/motor/turno/inicio.ts` → `estadoInicial(...)` monta o `Estado` do turno zero a partir do que o país declara.

---

## 5. Os módulos do motor (`src/motor/<módulo>/`)

Cada módulo tem `index.ts` (re-exportado por `src/motor/index.ts`) e quase sempre um `<módulo>.md` explicando o comportamento. **Leia o .md antes de mexer.**

| Módulo | Papel | Funções-chave |
| --- | --- | --- |
| `acaso` | gerador aleatório com semente (mulberry32) | `semear`, `sortear`, `sortearNormal` |
| `leis` | formato da lei, validação, valor, colisões | `tipos.ts` (formato), `validarLei`/`lerLei`, `efeitosDoValor`, `valorDesligado`, `colisoesDe` |
| `efeitos` | fila de efeitos: lei muda → contribuição anda em linha reta até o novo valor em `atraso_turnos` | `enfileirar`, `envelhecer`, `contribuicao`, `somaPorIndice`, `PONTOS_FORCA` (2/5/10) |
| `calculos` | contas econômicas estudadas: bases de imposto, Laffer, juros | `BASES`, `arrecadacaoRenda`, `taxaAlvo`, `proximaTaxa` |
| `contas` | tesouro: fecha receita/gasto/juros em cofre e dívida; regra fiscal | `fecharTurno`, `regraFiscal`, `motivoContaNaoFecha` |
| `fisco` | papéis das leis de dinheiro, estouros e punição | `estourosFiscais`, `punicao`, `indiceDaPrevidencia` |
| `estado` | tipo `Estado` e lista dos essenciais | `INDICES_ESSENCIAIS` |
| `populacao` | pops (estratos, escadas, renda, migração, emprego, demografia, territórios, saída, serviços) | `comFilhos`, `pedacos`, `saida.ts`, `servicos.ts` |
| `grupos` | grupos de interesse: posição na bússola, satisfação, mágoas, deslize | `posicaoDaLei`, `pontosLei(s)`, `parecenca`, `rendaDoGrupo` |
| `organizacoes` | organizações políticas que nascem na partida | `atracao`, `ameaca`, `nivelDa` |
| `mercado` | setores, produtos, cestas, preços, produção, emprego, capacidade, obras | `demanda.ts`, `preco.ts`, `producao.ts`, `emprego.ts`, `capacidade.ts`, `construcoes.ts` |
| `moradia`, `saneamento`, `atendimento` | redes físicas com obras e estoque | `andarMoradia`, `andarSaneamento`, `indiceDoAtendimento` |
| `mundo` | potências estrangeiras, reputação, defesa | `reputacao`, `andarOpinioes`, `segurancaExterna` |
| `politica` | Congresso: partidos, voto, pauta, moedas de troca, decreto, veto | `tramitar`, `votar`, `placarPrevisto`, `moedas.ts`, `relacao.ts`, `sessao.ts`, `constantes.ts` |
| `governo` | ministérios (caixas de instituições), ministros, órgãos, corrupção | `iniciarGoverno`, `andarGoverno`, `orgaos.ts`, `ministerios.ts` |
| `programas` | conjuntos de leis que viram "programa" com nome | `andarProgramas`, `situacoesDosProgramas` |
| `eleicao` | mandato, chapas, promessas, votos em 2 turnos | `apurar`, `primeiroTurno`, `segundoTurno`, `promessa.ts` |
| `judiciario` | tribunais, juízes, vagas, quem indica | (632 linhas, desligado por padrão: `comJudiciario`) |
| `midia` | mídias do país e jornal do turno | `jornalDoTurno`, `impactoDoFato` |
| `fatos` | registro do que aconteceu (alimenta mídia e tela) | `novoFato`, `consultar`, `envelhecerFatos` |
| `mesa` | papéis que chegam à mesa do jogador e o carimbo | `montarMesa`, `traduzirCarimbos` |
| `pessoas` | gera pessoas (políticos, ministros) a partir de modelo | `gerarPessoas`, `sortearMinistros`, `bussolaDoPartido` |
| `deriva` | índices que andam sozinhos empurrados por outros | `andarDerivas` |

Convenções de nome que se repetem:
- `motivoXInvalido(...)`: devolve `string` com o erro ou `undefined`/`null` se está ok. É o jeito do projeto validar.
- `lerX(json)`: valida e converte o dado cru em tipo do motor (lança erro com caminho do campo).
- `andarX(...)`: avança aquele subsistema um turno.
- `xInicial(...)` / `iniciarX(...)`: monta o estado de partida.
- `situacaoDeX(...)`: leitura pronta para a tela, sem efeito colateral.

---

## 6. Determinismo

O estado do sorteio (`acaso`) mora no `Estado`. Quem sorteia recebe o `acaso` e devolve o próximo:
```ts
const [z, acaso] = sortearNormal(estado.acaso);
return { ...estado, acaso, ... };
```
Mesma semente + mesmos pedidos = mesma partida, sempre. É por isso que o save guarda só país, semente, opções e estado. Nunca use `Math.random()` no motor.

---

## 7. Conteúdo (`src/conteudo/`)

Todo JSON tem `"versao": 1`; quem lê confere e recusa outra versão.

### Mundo (`conteudo/mundo/`)
| Pasta | O que tem |
| --- | --- |
| `leis/*.json` | uma lei por arquivo (511). Lidas por `import.meta.glob` em `partida/index.ts` |
| `indicadores/variaveis.json` | índices de jogabilidade, domínio, unidade |
| `indicadores/principais.json`, `derivas.json` | índices principais (eleição) e derivas |
| `pops/pops.json` | tipos de pop + regras de emprego, demografia, saída, serviços |
| `grupos/grupos.json` | grupos de interesse |
| `organizacoes/`, `potencias/`, `mercado/` (produtos, produtores) | o resto do mundo |
| `ministerios/` (moldes, instituições), `programas/`, `judiciario/`, `fisco/`, `moradia/`, `saneamento/`, `atendimento/`, `colisoes/`, `jornal/` | regras de cada módulo |

### Formato de uma lei (`motor/leis/tipos.ts`)
Campos comuns: `id`, `nome`, `descricao`, `camada` (`essencial`/`jogabilidade`), `classe` (quórum), `esfera` (instituição), `canal` (`imposto`, `verba`, `transferencia`, `preco`, `regra`, `direito`, `espera`), `jeito` (`regua`, `verba`, `niveis`, `escolha`), `tipo` (`lei`, `prazo`, `ato`).

Duas formas:
- `forma: "continua"` — régua numérica: `unidade`, `faixa`, `passo`, e opcionais `calculo` (Laffer sobre uma base), `conta: "gasto"`, `para` (vira renda de pops), `encolhe`, `escala_gasto`, `arrecada`, `valores` (tomadas), `bussola`, `efeitos`.
- `forma: "opcoes"` — lista de `opcoes`, cada uma com `id`, `rotulo`, `bussola` e `efeitos`.

Cada efeito: `{ indice, sentido: 1|-1, forca: fraca|media|forte, atraso_turnos }`. Canal `espera` + campo `espera` marca lei cujo mecanismo ainda não existe (ela existe, mas não age).

`validarLei` (`leis/validar.ts`) confere tudo isso na carga; lei inválida derruba a partida com mensagem dizendo arquivo e campo.

**Origem das leis:** a planilha `docs/jogo/gdd.xlsx` é a fonte. `npm run leis` (`scripts/leis/exportar.ts`) lê as abas, valida com o validador do motor e reescreve só os JSONs que mudaram. Mexer no JSON à mão funciona, mas a próxima exportação sobrescreve.

### País (`conteudo/paises/<id>/`)
Países hoje: `brasil-2026`, `teste`, `teste-pobre`. Arquivos (lidos por `partida/paises.ts` → `arquivoPais(pais, nome)`):

| Arquivo | Obrigatório | Conteúdo |
| --- | --- | --- |
| `estado-inicial.json` | sim | essenciais, parâmetros (bases, crescimento, juros, pops), moeda |
| `leis-vigentes.json` | sim | valor de partida das leis que o país tem; lei fora da lista = não legislada |
| `congresso.json` | sim | partidos, cadeiras, bússola |
| `governo.json`, `pessoas.json` | para ser jogável na tela inicial | ministérios e elenco |
| `estados.json`, `producao.json`, `midias.json`, `programas.json`, `judiciario.json`, `empresas.json` | não | territórios, produção, mídia… |

`paisesJogaveis()` lista só quem tem `pessoas` e `governo`. Na carga, `criarPartida` confere que o gasto declarado bate com a soma das leis de gasto + `gasto_fora_das_leis` e lança erro se não bater.

---

## 8. Partida (`src/partida/`)

`index.ts` (870 linhas) é a API pública que a tela usa:

| Função | O que faz |
| --- | --- |
| `criarPartida(pais, semente, opcoes)` | carrega mundo + país, valida, monta `Regras` e `estadoInicial`. `opcoes`: `ajustes`, `semCongresso`, `semSenado`, `comJudiciario`, `comeco` (escolhas da tela inicial) |
| `avancar(partida, pedidos)` | chama `avancarTurno` e devolve a partida nova |
| `jogar(partida, n, pedidos)` | avança n turnos (scripts e testes) |
| `placarDaLei(...)` | previsão de votos para a tela (orçamento: < 5 ms) |
| `leiTravada(partida, lei, fila)` | a lei colide com outra em vigor ou na fila? |
| `apoioAtual`, `mesesParaEleicao`, `nomesPartidos`, `nomesDoGoverno`, `empresasDoPais` | leituras para a tela |

Os `carregarX()` privados leem cada JSON e validam com o `motivoXInvalido` do motor. Leis carregadas ficam em cache (`leisCarregadas`).

Outros arquivos:
- `salvar.ts` — `salvarPartida` (JSON com país, semente, opções, estado) e `carregarPartida` (recria a partida e **migra** saves antigos: lei que saiu do mundo some, valor inválido volta ao de partida, campos novos ganham o valor padrão). Regras em `salvar.md`.
- `visao.ts` + `tiposVisao.ts` — `montarVisao(partida)`: transforma tudo numa `VisaoPartida` pronta para o mapa (bolhas, ligações, grupos, pessoas). Só lê.
- `previa.ts` — `previaDaLei`: o que uma lei vai fazer antes de aprovar (meses de obra, valor do nível).
- `comeco.ts`, `inicio.ts`, `gabinete.ts`, `perfil.ts` — tela inicial: partido do jogador, chapa, ministérios sugeridos, mover instituição entre caixas.
- `hierarquia.ts`, `poderes.ts` — árvore e poderes para o mapa.
- `eleicao.ts` (pesquisa de voto), `jornal.ts` (manchete), `saudeDosIndices.ts` (alerta/tendência de índice), `paises.ts` (acesso aos arquivos do país).

---

## 9. Tela (`src/tela/`)

Fluxo: `main.tsx` → `tela/index.tsx` (`montarTela`, monta o React) → `App.tsx`.

`App.tsx` guarda quatro estados:
- `partida` (ou `null` → mostra a tela inicial),
- `fila: PedidoMudarLei[]` — mudanças de lei do turno,
- `extras: Pedido[]` — moedas, vetos, nomeações, promessas,
- `aviso` — mensagem de erro/informação.

Ações: `comecar` (cria partida e salva), `carregar` (lê `localStorage`, chave `sisgov-partida`), `passar` (`avancar(partida, [...fila, ...extras])`, salva sozinho, limpa a fila). Todo erro lançado pelo motor vira `aviso`.

`fila.ts`: `comPedido` (um pedido por lei; voltar ao valor atual tira da fila) e `comRevogacao`.

`cheats.ts` + `useCheats.ts`: digitar `senado` ou `pular` fora de campo de texto.

### `tela/inicio/` — começo da partida
`TelaInicio.tsx` conduz as etapas `EtapaPais → EtapaPartido → EtapaChapa → EtapaMinisterios/EtapaGoverno → EtapaIniciar`. A partida só nasce no último passo (`criarPartida` com `comeco`).

### `tela/mapa/` — a partida em si
- `TelaMapa.tsx` — moldura: monta a visão (`montarVisao` em `useMemo`), guarda seleção, abre janelas.
- `MapaOrganico.tsx` + `organico.ts` + `useMapaVivo.ts` + `fundoDoMapa.ts` — o mapa de bolhas. `organico.ts` define a hierarquia (trindade → ministros → instituições → leis; índices presos ao ministro; grupos num anel; potências mais longe) e a física; `useMapaVivo.ts` roda o d3-force; `fundoDoMapa.ts` desenha fios e manchas em canvas atrás do SVG. A câmera (zoom/arrasto) escreve o `viewBox` direto no SVG, fora do React, para não re-renderizar ~600 bolhas. `camera.ts`, `gestos.ts`, `vistaDoMapa.ts`, `medidorDeQuadros.ts` cuidam disso. Detalhes em `mapa.md`.
- `BolhaDoMapa.tsx`, `Icone.tsx`, `icones.ts`, `iconesPersonalizados.ts`, `tema.ts`, `intensidade.ts`, `formatos.ts` — desenho das bolhas, ícones (SVGs em `src/assets/svg/`), cores e formatação de número.
- `DocumentoLei.tsx` (janela da lei), `PlacarDaLei.tsx`, `NaoPromulgadas.tsx`, `PainelDeAfetadas.tsx`/`afetadas.ts`.
- `BarraDoTopo.tsx`, `ResultadoDoTurno.tsx`, `MesaDePapeis.tsx`, `Governo.tsx`, `TrocaDeMinistro.tsx`, `Eleicao.tsx`, `Programas.tsx`, `Mercado.tsx`, `Pregao.tsx`, `PoderesDoMapa.tsx`, `TrindadeDoMapa.tsx`, `Retrato.tsx` — painéis.
- CSS por componente (`*.css`) mais `tela.css` e `estilo/mesa.css`.

---

## 10. Seguindo uma ação de ponta a ponta

**Jogador muda uma lei e passa o turno:**

1. Clica na bolha → `TelaMapa` abre `DocumentoLei`.
2. Mexe na régua/opção → `comPedido(fila, partida, lei, valor)` → `setFila`. `placarDaLei` e `previaDaLei` mostram a previsão.
3. Clica em passar → `App.passar` → `partida.avancar` → `motor.avancarTurno`.
4. Etapa `congresso` (`etapas/congresso.ts` → `motor/politica/tramitar`): a lei entra na pauta; cada partido vota (`politica/voto.ts`) segundo bússola, satisfação, moedas oferecidas.
5. Se passou, `leisNovas` troca `estado.leis[lei]` e `efeitos.enfileirar` cria `EfeitoEmCurso` com `de` (contribuição antiga) e `para` (nova).
6. Lei de imposto/gasto entra em `contas` (`etapas/economia.ts` → `arrecadacao`, `gastoDasLeis` → `contas.fecharTurno`).
7. `indicesJogabilidade` soma `base + contribuições` dos efeitos e prende no domínio.
8. `popsEGrupos` recalcula renda dos pops e satisfação dos grupos (que olham a bússola da lei).
9. `invariantes` confere; `midia` gera o jornal; `fatos` registram o que houve.
10. Volta à tela: `guardar` salva, `montarVisao` redesenha, `ResultadoDoTurno` mostra o que mudou.

**Para descobrir onde algo é calculado:** procure o id do índice ou o campo da lei.
```bash
grep -rn "preco_da_comida" src/motor src/partida
```
Ou use a skill `sisgov-mecanica`, que existe para isso.

---

## 11. Scripts (`scripts/`, `npm run <nome>`)

| Comando | Para quê |
| --- | --- |
| `dev` | servidor Vite |
| `build` | `tsc -b && vite build` |
| `test` | vitest |
| `lint`, `format`, `format:check` | estilo e fronteiras |
| `check` | format + lint + build + test (rodar ao fechar uma mecânica inteira) |
| `medir` | custo de um turno (meta < 50 ms) e do placar (< 5 ms) |
| `leis` / `leis:planilha` | planilha → JSON das leis / JSON → planilha |
| `inventario`, `sentir`, `gasto`, `impostos`, `contas` | relatórios sobre as leis e o orçamento |
| `pops`, `grupos`, `congresso`, `eleicao`, `mundo`, `construcoes`, `ambiente`, `paises`, `mandato` | jogam partidas no terminal e imprimem um módulo |
| `programas`, `midias` | geram conteúdo de programas e mídias |
| `icones`, `icones:faltam`, `icones:buscar` | ícones das leis (game-icons) |

Scripts usam `criarPartida`/`jogar` da `partida`, igual à tela. São o jeito mais rápido de ver um número mudar sem abrir o navegador.

Verificação de tipo: `npx tsc -b` (o projeto usa project references; `--noEmit` não serve).

---

## 12. Testes

Ficam ao lado do código (`x.ts` → `x.test.ts`). Três níveis:
- motor: funções puras com dados mínimos montados no teste;
- partida (`src/partida/*.test.ts`): cria a partida do país real ou de teste e joga turnos (`partida.test.ts`, `onda1.test.ts`, `salvar.test.ts`…);
- tela: só a lógica pura (`formatos`, `gestos`, `organico`, `cheats`); componentes React não são testados.

Os países `teste` e `teste-pobre` existem para testes com números controlados.

---

## 13. Pastas fora do `src/`

| Pasta | O que é |
| --- | --- |
| `docs/` | GDD, plano, histórico (não é código) |
| `public/` | arquivos servidos crus (artes) |
| `dist/` | saída do build |
| `arquivo/`, `_lixo/`, `rascunho/` | código antigo/abandonado, ignorado pelo lint e pelos testes |
| `dados/`, `arte-originais/` | material de apoio |

---

## 14. Receitas rápidas

- **Lei nova:** planilha `gdd.xlsx` → `npm run leis` (ou JSON em `conteudo/mundo/leis/`). Se o país a tem desde o início, entra em `leis-vigentes.json`. Skill: `sisgov-lei`.
- **Índice novo:** `conteudo/mundo/indicadores/variaveis.json`; a etapa `indicesJogabilidade` já soma efeitos para ele.
- **Cálculo econômico novo:** `motor/calculos/` (skill `sisgov-calculo`), ligado em `etapas/economia.ts`.
- **Módulo novo:** pasta em `motor/` com `index.ts` + `.md`, exporta em `motor/index.ts`, campo opcional em `Regras` e `Estado`, etapa em `turno/etapas/`, carga e validação em `partida/index.ts`, leitura para a tela em `visao.ts`.
- **País novo:** pasta em `conteudo/paises/` com os três obrigatórios (skill `sisgov-pais`).
- **Erro "invariante no turno N":** a etapa `invariantes` ou a conferência do tesouro achou estado impossível; a mensagem diz qual regra. Comece pela etapa que escreve aquele campo.
