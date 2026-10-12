# SisGov

> **Status: VIGENTE.** Atualizado em 12/out/2026 (V1-01).

SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país, muda leis de verdade (Constituição, leis e decretos) e acompanha o efeito no orçamento, nos indicadores e na opinião de cada parte da população, até a eleição do fim do mandato. Vencer continua a partida; perder encerra.

A meta da versão 1 é um jogo do gênero do Democracy 4, melhorado e sem copiar nada dele: leis reais de vários países, orçamento real, população baseada em pesquisas, grupos de pressão da política real e a explicação de cada número.

## Antes de começar

1. **[PLANO.md](PLANO.md)**: visão, escopo da versão 1, marcos, decisões e a única fonte de status.
2. [docs/v1/chamados.md](docs/v1/chamados.md): o que cada chamado faz e como é aceito.
3. [docs/v1/engenharia.md](docs/v1/engenharia.md): como trabalhamos.
4. [docs/v1/diferenciacao-d4.md](docs/v1/diferenciacao-d4.md): o que nunca vem do Democracy 4.
5. [docs/README.md](docs/README.md): índice de todos os documentos, com o que é vigente, referência técnica ou desativado.

Documentos em `docs/desativado/` são histórico e não são para seguir.

## Estrutura

- `src/engine`: motor de simulação (variáveis, ligações, mecanismos). Não conhece leis nem países.
- `src/game`: regras do jogo (leis, turno, ocorrências, ministérios).
- `src/app`: fachada da partida, a única porta entre a tela e o jogo.
- `src/ui`: componentes React (mapa, janelas, painéis).
- `src/conteudo`: conteúdo em JSON, `mundo/` (vale para todos os países) e `paises/` (estado inicial de cada país).
- `src/domain` e `src/scenarios`: saem na reestruturação (V1-02 e V1-04).
- `scripts/`: ferramentas de conteúdo (fichas e rede).
- `src/tests`: testes automatizados (Vitest).

O destino de cada parte está em [docs/v1/reestruturacao.md](docs/v1/reestruturacao.md).

## Ambiente

Verificado em 9 de outubro de 2026: Node.js 22.23.2, npm 10.9.8.

```bash
npm ci          # instalar dependências
npm run dev     # ambiente de desenvolvimento
npm run check   # formatação, lint, tipos, build e testes
```

## Como trabalhar

Projeto pessoal, trabalho direto na `main` (D-22).

1. Pegue o próximo chamado aberto na seção 5 do [PLANO.md](PLANO.md).
2. Faça só o que o chamado pede; ideia nova vai para [docs/v1/ideias.md](docs/v1/ideias.md).
3. Rode `npm run check`. Verde mais os itens do aceite = chamado pronto.
4. Commit com o ID do chamado (`V1-NN: …`) e marque `[x]` no PLANO com data, commit e teste.
