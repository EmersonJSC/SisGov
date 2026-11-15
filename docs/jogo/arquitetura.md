# Arquitetura

Como o jogo está montado no código. Refeita em 13/nov/2026, depois da
remontagem (instituições no lugar das esferas, caixas livres, tela inicial em
passos, mapa orgânico). Detalhe de cada módulo fica no `.md` dele.
`docs/arquitetura/` é do projeto antigo.

## 1. Camadas

```
conteudo  →  motor  →  partida  →  tela
(o mundo)   (regras)   (ponte)    (o que se vê)
```

| Camada   | Onde            | O que tem                                                                                             | Pode ver             |
| -------- | --------------- | ----------------------------------------------------------------------------------------------------- | -------------------- |
| Conteúdo | `src/conteudo/` | `mundo/` (leis, índices, instituições, pops, grupos, mercado, potências) e `paises/` (estado inicial) | nada: é JSON         |
| Motor    | `src/motor/`    | as regras; funções puras; **não conhece nomes** de lei, país, partido ou ministério                   | só a si mesmo        |
| Partida  | `src/partida/`  | monta as regras do conteúdo, começo da partida, salvar e carregar, e a **visão** que a tela lê        | conteúdo e motor     |
| Tela     | `src/tela/`     | `inicio/` (os passos antes do mandato) e `mapa/` (o jogo)                                             | **só** `src/partida` |

Clean Architecture, sem banco e sem rede (KISS: nada de interface sem duas
implementações).

| Camada Clean | Pasta                            | O que é                                                                                                  |
| ------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Domínio      | `motor/`                         | regras puras em TS; sem React, sem JSON, sem relógio, sem `Math.random` (o acaso entra com semente)      |
| Casos de uso | `partida/`                       | Nova partida, Avançar turno, Propor lei, Salvar e carregar, Prévia, montar a visão; dependem só do motor |
| Borda        | `conteudo/`, `scripts/`, `tela/` | JSON e validadores; scripts de geração e medida; React, que só manda pedidos e mostra a visão            |

**Portas (só as que variam):** `Armazenamento` (salvar no navegador ou em
arquivo) e `Conteudo` (ler os JSON do mundo e do país).

## 2. As peças do jogo

| Peça            | O que é                                                                                                                                                       | Onde                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Lei**         | regra do país, bolha no mapa. Um lado da bússola, de "nada" a "mais". **Mora numa instituição** (campo `esfera`, que hoje guarda o id da instituição)         | `mundo/leis/*.json`, `motor/leis`                        |
| **Instituição** | órgão que executa a lei ("quem executa?"). 36 + Regras dos poderes, todas em todo país. Pode ficar sem ministro (`semMinistro`: Eleições, Regras dos poderes) | `mundo/ministerios/instituicoes.json`, `motor/governo`   |
| **Órgão**       | o estado da instituição na partida: verba (soma das leis de gasto dela), necessidade, rendimento (verba ÷ necessidade) e corrupção interna                    | `motor/governo/orgaos.ts`                                |
| **Caixa**       | um ministério: `{id, nome, instituicoes, ministro, sobra}`. Uma instituição fica numa caixa só; a que nenhuma cita vai para a caixa da `sobra` (o gabinete)   | `paises/<id>/governo.json`, `motor/governo`              |
| **Molde**       | caixa sugerida e genérica ("Fazenda", "Saúde"); dá nome à caixa que o jogador monta                                                                           | `mundo/ministerios/moldes.json`                          |
| **Tamanho**     | governo pronto da régua: Enxuto (9), Clássico (19), Do país, Inchado (do país + 5 sem pasta)                                                                  | `mundo/ministerios/tamanhos.json`, `partida/gabinete.ts` |
| **Pessoa**      | ficha de RPG: competência, habilidade, carisma, honestidade, lealdade, bússola, origem (partido ou técnico). Gerada com semente; o país dá só os nomes        | `motor/pessoas`, `paises/<id>/pessoas.json`              |
| **Índice**      | número que o jogador vê (0–100 ou %). `estoque`, `derivado` ou `calculado`                                                                                    | `mundo/indicadores/variaveis.json`                       |
| **Processo**    | índice que anda sozinho (**deriva**), empurrado por outro índice, medido contra o turno 0                                                                     | `mundo/indicadores/derivas.json`, `motor/deriva`         |
| **Rede**        | serviço que o Estado presta, contado por quem é atendido: atendimento (saúde), saneamento, moradia                                                            | `motor/atendimento`, `motor/saneamento`, `motor/moradia` |
| **Programa**    | conjunto de leis que vira nome próprio quando forma; tem lembrança e nostalgia                                                                                | `mundo/programas`, `motor/programas`                     |
| **Colisão**     | duas leis que não valem juntas; é um "ou"                                                                                                                     | `mundo/colisoes/colisoes.json`, `motor/leis/colisao.ts`  |
| **Pop**         | fatia da população: profissão num estrato                                                                                                                     | `mundo/pops`, `motor/populacao`                          |
| **Grupo**       | interesse que atravessa os pops; gosta da lei pela distância na bússola                                                                                       | `mundo/grupos`, `motor/grupos`                           |
| **Organização** | nasce na partida (política ou crime) _(a construir)_                                                                                                          | —                                                        |

**Bússola:** `economico` (esquerda − ↔ direita +) e `social`
(verde/libertário − ↔ tradicional/autoritário +), de −1 a +1.

### Como o ministro age

```
lei → instituição → caixa que a leva (ou a sobra; ou ninguém, se semMinistro)
                       ↓
               ficha do ministro
   competência ÷ divisão (sqrt(min(1, 3/instituições))) → força e atraso da lei
   honestidade, cargos e verba demais → corrupção do órgão
```

- A caixa da sobra conta as soltas + 3 a mais: mandar tudo para o gabinete
  pesa.
- Os ministros de cada partido entram no Congresso (`ministrosPorPartido`):
  ministério é moeda da coligação.
- O ministro não mexe na verba: verba é lei.

## 3. O turno

Turno = 2 meses. `avancarTurno(regras, estado, pedidos) → novo estado`; o
anterior não muda. Mesma semente e mesmos pedidos, mesma partida. A mesa de
fatos envelhece antes das etapas; no fim, a conta do Tesouro tem de fechar.

Ordem (`ETAPAS` em `src/motor/turno/index.ts`):

1. Congresso vota os pedidos
2. Leis novas mudam de valor; efeitos entram na fila
3. Efeitos vencem
4. Economia real (crescimento)
5. Preços e juros
6. Capacidades (mercado, construções)
7. Contas (cofre e dívida)
8. Moradia
9. Saneamento
10. Atendimento
11. Índices de jogabilidade (a deriva anda antes)
12. Mundo (potências)
13. Preços do mundo
14. Pops e grupos
15. Governo (órgãos: rendimento e corrupção)
16. Programas
17. Política (coligação)
18. Eleição
19. Mídia (jornal)
20. Invariantes

**Fatos do turno:** cada etapa deixa avisos ("lei aprovada", "programa
formado", "escândalo") na mesa de fatos (`motor/fatos`); quem se importa lê.
Ninguém chama o módulo do outro para avisar. A **Mesa** (`motor/mesa`) é outra
coisa: os papéis que esperam o carimbo do presidente.

## 4. Módulos do motor

Cada um é uma pasta com `index.ts` público; ninguém importa arquivo de dentro
da pasta de outro.

| Módulo                                                    | Uma linha                                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| [acaso](../../src/motor/acaso/acaso.md)                   | sorteio com semente                                               |
| [atendimento](../../src/motor/atendimento/atendimento.md) | rede da saúde: vagas, profissionais, planos, fila                 |
| [calculos](../../src/motor/calculos/calculos.md)          | bases de cálculo (renda, consumo, lucro, emissões, terra; Laffer) |
| [contas](../../src/motor/contas/contas.md)                | Tesouro: receita, gasto, juros, cofre, dívida                     |
| [deriva](../../src/motor/deriva/deriva.md)                | índice anda sozinho, empurrado por outro                          |
| [efeitos](../../src/motor/efeitos/efeitos.md)             | leis somam pontos aos índices, com atraso                         |
| [eleicao](../../src/motor/eleicao/eleicao.md)             | mandato, aprovação, promessa, dois turnos                         |
| `estado`                                                  | o estado da partida e os índices                                  |
| [fatos](../../src/motor/fatos/fatos.md)                   | a mesa de fatos do turno                                          |
| [governo](../../src/motor/governo/governo.md)             | instituições, caixas, ficha do ministro, órgãos e corrupção       |
| [grupos](../../src/motor/grupos/grupos.md)                | satisfação e apoio pela bússola                                   |
| [leis](../../src/motor/leis/leis.md)                      | formato, validador e colisões                                     |
| [mercado](../../src/motor/mercado/mercado.md)             | setores, produtos, preço, emprego, construções                    |
| [mesa](../../src/motor/mesa/mesa.md)                      | papéis e prazos do presidente                                     |
| [midia](../../src/motor/midia/midia.md)                   | jornal mínimo                                                     |
| [moradia](../../src/motor/moradia/moradia.md)             | estoque de casas: déficit e favela                                |
| [mundo](../../src/motor/mundo/mundo.md)                   | potências e opinião sobre o país                                  |
| [pessoas](../../src/motor/pessoas/pessoas.md)             | gerador de pessoas, fichas, ministros sorteados                   |
| [politica](../../src/motor/politica/politica.md)          | Congresso e coligação                                             |
| [populacao](../../src/motor/populacao/populacao.md)       | pops: renda, estrato, setor                                       |
| [programas](../../src/motor/programas/programas.md)       | formar e desfazer programas, nomes                                |
| [saneamento](../../src/motor/saneamento/saneamento.md)    | rede de água e esgoto                                             |
| [turno](../../src/motor/turno/turno.md)                   | a ordem das etapas                                                |

## 5. Partida: a ponte

| Arquivo                     | O que faz                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `comeco.ts`, `inicio.ts`    | começo da partida: país, partido novo, chapa, caixas e ministros sorteados (`ComecoDoJogador`)        |
| `gabinete.ts`               | régua de tamanhos, mover instituição, nome automático pelo molde, quanto cada ministro rende na caixa |
| `visao.ts`, `tiposVisao.ts` | a `VisaoPartida`: tudo o que a tela mostra, já com nomes locais do país                               |
| `hierarquia.ts`             | trindade, ministros, instituições e o ministério responsável por cada lei                             |
| `poderes.ts`                | Legislativo (cadeiras por partido, Câmara e Senado) e Judiciário (ainda de mentira)                   |
| `saudeDosIndices.ts`        | saúde de cada índice (crítico a bom) e tendência contra o turno anterior                              |
| `previa.ts`                 | quem ganha e quem perde antes de propor                                                               |
| `salvar.ts`                 | salvar e carregar                                                                                     |

## 6. Tela

### Começo (`tela/inicio/`)

Passos em ordem: **País → Partido → Chapa → Governo → Ministros → Iniciar.**

- **Governo** (`EtapaGoverno.tsx`): régua de tamanhos; "Ajustar caixas" abre a
  mesa onde o jogador arrasta as instituições (escudos) entre os ministérios,
  cria e tira ministério; a bandeja é a caixa da sobra. Mostra só efeitos que o
  motor tem: o ministro mais carregado, o que fica sem ministério próprio, as
  cadeiras sem pasta.
- **Ministros** (`EtapaMinisterios.tsx`): uma cadeira por caixa, com retrato e
  quanto o ministro rende ali; clicar abre três cartas (o técnico, o aliado, o
  do seu partido) ou a lista de todos.

### O mapa (`tela/mapa/`)

Um mapa orgânico e vivo: bolhas soltas, puxadas por uma hierarquia por baixo.
Do centro para fora:

```
            Congresso (anel de cadeiras: Câmara em cima, Senado embaixo)
         Judiciário (9 juízes parados em volta)
      Executivo: a trindade (presidente do partido, eleito, vice)
   ─────────────────────────────────────────────────────────────
   anel de ministros (fatia proporcional ao que cuidam)
      → instituições (escudo com ícone) sob cada ministro
         → leis em pétalas para fora (só as promulgadas)
      índices presos ao ministro responsável
   grupos num anel de fora; potências mais longe
```

- **Prioridade visual:** Ministro > Instituição > Índice > Lei, no tamanho e em
  quem fica por cima.
- **Visões** (filtros que pesam o tamanho dentro da faixa de cada degrau):
  Padrão, Ligações, Nível, Dinheiro, Popularidade (sem dado ainda).
- **Fios:** hierarquia em ouro; efeito verde (+) e vermelho (−), com o raio
  correndo só com a bolha em foco. Bolha sem ligação no motor tem anel
  tracejado.
- **Alerta:** a cor do anel do índice diz o nível; a seta, a tendência.
- **Leis não promulgadas** ficam fora do mapa, num botão no canto.
- Barra do topo (caixa, dívida, PIB, apoio, eleição, passar o turno).

| Peça                                       | O que faz                                                         |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `organico.ts`                              | monta as bolhas e as forças (`d3-force`); raio e peso de cada uma |
| `useMapaVivo.ts`                           | anda a simulação quadro a quadro e escreve direto no SVG          |
| `MapaOrganico.tsx`, `BolhaDoMapa.tsx`      | câmera, mouse, arrastar, foco, bilhete                            |
| `fundoDoMapa.ts`, `assentos.ts`            | canvas de fundo: fios, raios e as cadeiras do Congresso           |
| `TrindadeDoMapa.tsx`, `PoderesDoMapa.tsx`  | o miolo dos três poderes                                          |
| `visoes.ts`, `vistaDoMapa.ts`, `gestos.ts` | visões, câmera pura, pinça e arrasto                              |
| `ControlesDoMapa.tsx`                      | visões, busca, enquadrar, miniatura                               |
| `afetadas.ts`, `PainelDeAfetadas.tsx`      | "Atrapalham / Ajudam" de um ministro, instituição ou índice       |
| `DocumentoLei.tsx`, `NaoPromulgadas.tsx`   | a folha da lei; as leis que o país não tem                        |
| `BarraDoTopo.tsx`                          | medidores e passar o turno                                        |

**Desempenho:** fios no canvas, câmera no `viewBox`, bolha só reescreve a
posição se mudou; ~1 ms de JS por quadro parado. Tecla F mede os quadros.

**Herança:** o mapa antigo (`MapaPolitico.tsx`, `layout.ts`) e as 8 áreas
(`mundo/areas`) saíram em 13/nov; cor, ordem e manchas vêm do ministério
(`tema.ts`, `corDoMinisterio`). O índice ainda traz um `area` que é o tema
dele (nome de instituição antiga), usado só para achar o ministro quando
nenhuma lei liga nele. As janelas Governo, Programas, Eleição, Mesa,
Mercado e Pregão existem, mas nada as abre (o autor vai dizer onde moram).

## 7. Dados

- **Duas planilhas (13/nov):** `docs/jogo/leis.xlsx` é o acervo (o que se
  pensou por semanas); `docs/jogo/gdd.xlsx` é o que estamos construindo, já com
  mecânica. Instituições, moldes e tamanhos saíram da `gdd.xlsx` e estão
  escritos à mão em `mundo/ministerios/`. As leis serão refeitas instituição
  por instituição, a partir da `gdd.xlsx`.
- **País** (`paises/brasil-2026/`): estado inicial, leis vigentes e nomes
  locais, Congresso, governo (34 caixas), pessoas, programas, mídias. Molde do
  Brasil em `docs/jogo/molde-brasil.xlsx`.
- Validação ao carregar; `npm run inventario` lista leis sem ligação,
  repetidas e parecidas.

## 8. Regras fixas

- O motor não conhece nomes. Leis e índices são do mundo; o país declara só o
  estado inicial.
- Lei só mexe em índice de `variaveis.json`. Índice novo é pedido ao autor.
- Todo efeito declara atraso em turnos e força (`fraca`, `media`, `forte`).
- Lei é descrita pela bússola, nunca por grupo, e não cita país real.
- Toda decisão é uma bolha no mapa; nada de painel de gestão.
- Módulos funcionam sozinhos; as ligações vêm no JSON das leis.
- **Função pequena, uma tarefa.** Sem função de 100 linhas; regra do módulo
  mora no módulo.
- **Eficiência é medida.** `npm run medir`: turno abaixo de 50 ms, placar
  abaixo de 5 ms.

Regras da lei e da rede: GDD, Partes 4 e 3.
GDD 4.17 (Serviços do Estado).

## 9. Dívidas conhecidas

- O `turno` tem ~2.500 linhas com regra dentro; sai aos poucos, quando um
  módulo novo nascer.
- `atendimento`, `saneamento` e `moradia` viram `servicos` quando a próxima
  rede entrar.
- O campo `esfera` da lei guarda a instituição; renomear é pedido à parte.
- Área (8 temas antigos) sai do mapa (decidido 13/nov), falta tirar do código.
- Caminho do dinheiro a reformular depois das leis (GDD 3.6).
