# PLANO do SisGov: versão 1

> **Status: VIGENTE.** Documento mestre desde 12/out/2026 e **única fonte de
> status**. Substitui o plano anterior, que está desativado em
> [`docs/desativado/PLANO-antigo.md`](docs/desativado/PLANO-antigo.md) junto com os
> chamados SG001 a SG162.

## 1. Visão

O SisGov é um simulador de governo em português. Quem joga assume a Presidência
de um país, muda leis de verdade e vê o efeito no orçamento, nos indicadores e na
opinião das pessoas, até a eleição do fim do mandato. Quanto mais coisa a pessoa
pode mexer e entender, melhor.

A **versão 1** é um jogo do gênero do Democracy 4, melhorado: hierarquia jurídica
real, orçamento real, população baseada em pesquisas, grupos de pressão da
política real e explicação de cada número. **Nada é copiado do Democracy 4**; as
regras estão em [`docs/v1/diferenciacao-d4.md`](docs/v1/diferenciacao-d4.md).

Depois da versão 1, **dobramos a meta**: parlamento, partidos, coalizão,
personagens com mecânica e o dobro de conteúdo (seção 6).

## 2. O que entra e o que fica para depois

| Entra na versão 1 | Fica para a versão 2 |
| --- | --- |
| Catálogo de 350 a 400 leis reais em 10 áreas, com Constituição, lei e decreto | Votação no Congresso, Senado, tramitação |
| Configuração do país: dados, ministérios, características, história de abertura | Partidos, bancadas e coalizão |
| Orçamento real em % do PIB, com receita, gasto, juros e dívida | Medida provisória e PEC com rito próprio |
| Cerca de 100 índices e 60 situações com entrada e saída | Personagens com opinião e mecânica |
| 20 segmentos do eleitorado e perfis sintéticos com peso | Lobby e negociação |
| 20 grupos de pressão com repertório de ações | Campanha eleitoral |
| Capital político como custo das ações | Mais países jogáveis |
| Cerca de 120 eventos, 100 dilemas e 30 conquistas | Golpe, ruptura e reforma do Estado |
| Eleição no fim do mandato; vencer continua, perder encerra | |
| "Por que mudou?" em todo número | |
| Salvar e carregar | |
| Brasil 2026 completo | |

## 3. Princípios

1. **Um D4 melhorado, nunca uma cópia.** Toda lei, índice e grupo vem do mundo
   real, com fonte.
2. **O jogo roda o tempo todo.** Nenhum chamado deixa a `main` quebrada.
3. **Um chamado por vez**, com aceite verificável por teste
   ([`docs/v1/engenharia.md`](docs/v1/engenharia.md)).
4. **Primeiro o ciclo, depois o volume.** O mandato jogável (marco D) fica pronto
   antes do conteúdo em massa (marco E).
5. **Status só aqui.** Os outros documentos dizem como fazer; este diz o que está
   feito.

## 4. Documentos

| Documento | Para que serve |
| --- | --- |
| Este `PLANO.md` | Visão, escopo, marcos, status e decisões |
| [`docs/v1/chamados.md`](docs/v1/chamados.md) | O que cada chamado faz, aceite e divisão do trabalho |
| [`docs/v1/diferenciacao-d4.md`](docs/v1/diferenciacao-d4.md) | O que nunca vem do D4 e o processo de sala limpa |
| [`docs/v1/arquitetura.md`](docs/v1/arquitetura.md) | Camadas, módulos, dados e estado da partida |
| [`docs/v1/reestruturacao.md`](docs/v1/reestruturacao.md) | O destino de cada parte do código atual |
| [`docs/v1/conteudo.md`](docs/v1/conteudo.md) | Regras de leis, índices, população e ocorrências |
| [`docs/v1/engenharia.md`](docs/v1/engenharia.md) | Chamado, pronto, testes, git e documentos |
| [`docs/v1/ideias.md`](docs/v1/ideias.md) | Ideias que surgem durante um chamado |
| [`docs/README.md`](docs/README.md) | Índice de tudo: vigente, referência técnica e desativado |

## 5. Marcos e chamados

Marque `[x]` só com o aceite demonstrado e `npm run check` verde, anotando data,
commit e teste. O detalhe de cada chamado está em
[`docs/v1/chamados.md`](docs/v1/chamados.md). Tamanho: P (uma sessão), M (duas ou
três).

### Marco A. Fundação (v0.1)

O código fica menor e com camadas claras. Nada muda para quem joga.

- [x] **V1-01** Documentos novos e antigos desativados (P). 12/out, `94f1134`, verificador de links e `npm run check` do autor
- [x] **V1-02** Tirar código morto e restos do D4 (P). 12/out, `6e29d15`, busca sem D4 e `npm run check` do autor
- [x] **V1-03** Dividir a partida em módulos (M). 12/out, `f994ad4`, 17 testes da partida sem alteração e `npm run check` do autor
- [ ] **V1-04** Tirar o parlamento da versão 1 e fixar as camadas (M). Feito em 12/out, commit local; estado do Brasil após 4 turnos idêntico, teste de camadas; aguarda o `npm run check` do autor

### Marco B. Formato e país (v0.2)

A ficha de lei v3, a configuração do país e os índices com situações.

- [ ] **V1-05** Ficha de lei v3, verificador e conversor (M). Feito em 12/out, commit local; 3 leis piloto migradas, Brasil após 4 turnos idêntico; aguarda revisão da ficha piloto e o `npm run check` do autor
- [ ] **V1-06** Configuração do país (M). Feito em 12/out, commit local; Brasil em 7 arquivos com turno 0 idêntico, país de teste sem litoral; aguarda revisão da abertura em `historia.json` e o `npm run check` do autor
- [ ] **V1-07** Índices e situações (M)

### Marco C. População (v0.3)

Os 20 segmentos do eleitorado e os 20 grupos de pressão.

- [ ] **V1-08** Segmentos do eleitorado e perfis sintéticos (M)
- [ ] **V1-09** Grupos de pressão (M)

### Marco D. Ciclo do mandato (v0.4)

O mandato jogável do começo ao fim: capital político, níveis legais, eleição, salvar. **Primeira versão jogável da V1.**

- [ ] **V1-10** Capital político (M)
- [ ] **V1-11** Níveis legais na jogabilidade (P)
- [ ] **V1-12** Eleição do fim do mandato (M)
- [ ] **V1-13** Salvar e carregar (P)

### Marco E. Conteúdo (v0.5 a v0.7)

O catálogo de 350 a 400 leis, área por área, eventos, dilemas e o Brasil 2026 completo.

- [ ] **V1-14** Conteúdo: Segurança e justiça penal (M)
- [ ] **V1-15** Conteúdo: Contas e tributos (M)
- [ ] **V1-16** Conteúdo: Poder e instituições (M)
- [ ] **V1-17** Conteúdo: Direitos e liberdades (M)
- [ ] **V1-18** Conteúdo: Defesa e mundo (M)
- [ ] **V1-19** Conteúdo: Trabalho e mercado (M)
- [ ] **V1-20** Conteúdo: Proteção social (M)
- [ ] **V1-21** Conteúdo: Educação, ciência e cultura (M)
- [ ] **V1-22** Conteúdo: Meio ambiente, energia e campo (M)
- [ ] **V1-23** Conteúdo: Cidades e transporte (M)
- [ ] **V1-24** Eventos e dilemas (M)
- [ ] **V1-25** Brasil 2026 completo (M)

### Marco F. Interface (v0.8)

Mapa, janela da lei, explicação dos números, metas e ajuda.

- [ ] **V1-26** Mapa da versão 1 (M)
- [ ] **V1-27** Janela da lei e catálogo (M)
- [ ] **V1-28** Por que mudou? (P)
- [ ] **V1-29** Metas e conquistas (P)
- [ ] **V1-30** Ajuda e primeiro mandato guiado (M)

### Marco G. Fechamento (v1.0)

Balanceamento, realismo e lançamento.

- [ ] **V1-31** Balanceamento e realismo (M)
- [ ] **V1-32** Versão 1.0 (P)

## 6. Depois da versão 1

A versão 2 dobra a meta. A lista abaixo é direção, não compromisso; cada item vira
chamado só depois da versão 1.0.

- Congresso com votação, Senado, partidos, bancadas e coalizão.
- Medida provisória e PEC com rito próprio; o capital político da versão 1 vira
  negociação.
- Personagens com opinião, cargo e história gerada na partida.
- O dobro de leis, índices, eventos e dilemas; segmentos e grupos de pressão novos.
- Outros países com a mesma configuração.

## 7. Decisões

### 7.1 Decisões da versão 1

| ID | Data | Decisão |
| --- | --- | --- |
| D-67 | 12/out/2026 | **Diferenciação do D4.** Nada do D4 entra no SisGov: dados, números, fórmulas, listas, textos, arte ou nomes. Os arquivos do D4 ficam só na máquina do autor, fora do git. Ver `docs/v1/diferenciacao-d4.md`. |
| D-68 | 12/out/2026 | **Arquitetura em camadas** `ui → app → jogo → motor`, com teste que barra importação no sentido errado. Parlamento, Senado, eleição antiga e laboratório saem do código da versão 1 e ficam guardados na etiqueta `v0-antes-da-v1`. Ver `docs/v1/arquitetura.md` e `docs/v1/reestruturacao.md`. |
| D-69 | 12/out/2026 | **Ficha de lei v3** com três níveis jogáveis (Constituição, lei, decreto e orçamento), custo em capital político, dinheiro em % do PIB, efeitos dentro da ficha e fonte obrigatória. Altera a D-65 (sai o nível pétreo) e substitui as D-23 a D-26. |
| D-70 | 12/out/2026 | **População e pressão próprias.** 20 segmentos do eleitorado com perfis sintéticos e 20 grupos de pressão da política real, com repertório de ações. Substitui a D-60. |
| D-71 | 12/out/2026 | **Processo de engenharia** da versão 1 (`docs/v1/engenharia.md`). Substitui as regras anti-ciclo R-01 a R-11 do plano antigo. |

### 7.2 Decisões antigas que continuam valendo

O texto completo está na seção 9 do
[plano antigo](docs/desativado/PLANO-antigo.md). Continuam valendo:

| ID | Em uma linha |
| --- | --- |
| D-01, D-02 | Turno de 3 meses calculado em 3 passos mensais; mandato de 16 turnos |
| D-03 | O motor não conhece nomes de leis, partidos ou países |
| D-04, D-38, D-39 | Mundo e país: leis, índices e ligações são do mundo; o país é o estado inicial |
| D-22 | Projeto pessoal: trabalho direto na `main`; aceite é `npm run check` verde no notebook; push só com a palavra do autor |
| D-31, D-34, D-35 | O jogador é o partido que acabou de vencer; dá nome, sigla e cor; começa com a popularidade da eleição |
| D-40 a D-59 | A rede viva e o orçamento na rede: nada escondido, contas em % do PIB, juros como bolha, contas sem furos |
| D-61 | Lei filha: cai em cascata quando a mãe muda |
| D-62 | Ocorrências: eventos, dilemas e situações na partida |
| D-64 | Ministérios reais declarados pelo país |
| D-66 | Leis e índices universais, com nomes neutros; o país escolhe a opção de partida |

### 7.3 Decisões antigas que saem

| ID | Motivo |
| --- | --- |
| D-05, D-32, D-36 | Personagens ficam para a versão 2 |
| D-06, D-07 | Substituídas pelo escopo da seção 2 |
| D-08, D-10, D-12, D-13, D-14, D-37 | Senado, votação e tramitação ficam para a versão 2 |
| D-11 | Campanha fica para a versão 2 |
| D-15, D-16 | Substituídas pela rede (D-47 a D-59) e pela população da D-70 |
| D-17 | Substituída pela fonte obrigatória da D-67 |
| D-18, D-19, D-20, D-21 | Substituídas pelo processo da D-71 |
| D-23 a D-26 | Substituídas pela ficha v3 (D-69) |
| D-27 a D-30 | Absorvidas pelas D-40 a D-59 e pela D-69 |
| D-33 | Executada no V1-02 |
| D-60 | Substituída pela D-70 |
| D-63, D-65 | Alteradas pela D-64 e pela D-69 |
