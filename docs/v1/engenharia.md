# Como trabalhamos

> **Status: VIGENTE.** Processo de engenharia da versão 1. Substitui as regras
> anti-ciclo e o fluxo de trabalho do PLANO antigo. Decisão D-71.

## 1. Chamado

Todo trabalho nasce de um chamado em `docs/v1/chamados.md`. Um chamado tem:

| Campo | O que diz |
| --- | --- |
| Objetivo | Uma frase com o resultado |
| Entra / não entra | O escopo, dito dos dois lados |
| Depende de | Chamados que precisam estar prontos |
| Aceite | Condições verificáveis, com o teste que prova cada uma |
| Você vê | O que muda para quem joga (ou "nada visível") |
| Divisão do trabalho | O que o Claude faz e o que o autor confere |
| Tamanho | P (uma sessão), M (duas ou três), G (dividir antes de começar) |

Regras:

1. **Um chamado por vez.** Ideia nova durante o trabalho vai para a lista de ideias
   (`docs/v1/ideias.md`), não para o chamado em andamento.
2. **Chamado G não começa.** É dividido antes.
3. **Refatorar e mudar comportamento são chamados separados.**
4. **Sistema novo começa pelo desenho.** Chamado que cria um sistema (população,
   pressão, eleição, capital político, calibragem) tem uma etapa 0: pesquisar os
   métodos usados hoje, com fontes, e escrever `docs/v1/desenho/<tema>.md` com o
   problema, duas ou três opções, a escolha, as fórmulas (nossas), os dados reais
   e como testar. O código só começa com o desenho aprovado pelo autor.
5. **Na terceira tentativa sem fechar**, o chamado é revisto com o autor: escopo
   errado, dependência faltando ou decisão pendente.

## 2. Pronto

Um chamado está pronto quando:

1. Todos os itens do aceite passaram, cada um com o seu teste.
2. `npm run check` está verde na máquina do autor.
3. Os documentos que o chamado muda foram atualizados no mesmo commit.
4. A linha do chamado no PLANO foi marcada com data, commit e teste.
5. Em chamado de conteúdo ou interface: a checagem de `diferenciacao-d4.md` foi
   feita.

## 3. Divisão entre o autor e o Claude

| Claude | Autor |
| --- | --- |
| Lê o chamado, propõe o caminho em poucas linhas e implementa | Aprova o caminho quando o chamado pede decisão |
| Escreve os testes do aceite e roda só os testes do chamado | Roda `npm run check` completo |
| Faz commit local com a mensagem padrão | Decide quando fazer `git push` |
| Atualiza o PLANO e os documentos | Joga o resultado e diz se está bom |
| Mostra capturas de tela quando muda a interface | Abre a revisão de conteúdo e marca o que muda |

## 4. Git

- Trabalho na `main`, com commits pequenos. Um chamado pode ter vários commits.
- Mensagem: `V1-NN: o que mudou` (ex.: `V1-03: divide a partida em módulos`).
- Etiqueta por marco: `v0.1` (fundação) … `v1.0` (lançamento). Antes da
  reestruturação: `v0-antes-da-v1`.
- `push` só com a palavra do autor.

## 5. Testes

| Camada | Tipo | Exemplo |
| --- | --- | --- |
| Motor | Unidade, com números calculáveis à mão | `afim`, `pontos`, atraso, situação com entrada e saída |
| Conteúdo | Verificador em todo `npm test` | Toda ficha válida, toda fonte com link, nenhum índice órfão |
| Jogo | Partida curta com semente fixa | Aprovar uma lei e ver o efeito no turno certo |
| Fachada | Contrato da `VisaoPartida` | A tela recebe tudo o que precisa sem ler o motor |
| Interface | Componente e captura de tela por marco | Janela da lei mostra custo e efeitos |
| Realismo | Partida longa sem ação contra valores reais | Brasil não explode em 16 turnos parado |

Teste que depende de sorte usa semente fixa. Teste lento (mais de 5 s) fica fora
do `npm test` e roda no fechamento do marco.

## 6. Documentos

- Todo documento começa com o status: **VIGENTE**, **REFERÊNCIA TÉCNICA** (descreve
  o código como está e muda junto com ele) ou **DESATIVADO**.
- Vigentes ficam em `PLANO.md`, `AGENTS.md`, `README.md` e `docs/v1/`.
- Desativados ficam em `docs/desativado/`, com o motivo e o substituto em
  `docs/desativado/LEIA-ME.md`.
- Decisão nova entra na tabela de decisões do PLANO, com número (D-67 em
  diante), data e motivo.

## 7. Versões

- Versão do jogo: `0.x` até a versão 1, depois `1.0.0`.
- Cada formato de arquivo de conteúdo tem `versaoEsquema`. Mudou o formato, sobe
  o número e o carregador recusa a versão errada com mensagem clara.
- Partida salva guarda a versão do jogo e do esquema.
