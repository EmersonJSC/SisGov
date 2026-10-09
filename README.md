# SisGov

SisGov é um jogo web de estratégia política e gestão econômica em que a pessoa jogadora representa um partido e conduz o governo enquanto ocupa a Presidência. Propõe políticas definidas em JSON, considera a opinião pública, busca apoio no Senado e observa consequências em um país que já começa com políticas vigentes. A população tem interesses sociais combinados e elege a Presidência e o Senado. Vencer a eleição presidencial inicia outro mandato preservando o estado do país; perder encerra a partida.

O motor numérico, o laboratório, o domínio de propostas e o fiscal já existem. A fase atual integra tudo isso num turno real da partida (marco M1 do plano).

## Antes de começar

1. **[PLANO.md](PLANO.md)** — documento mestre: o que existe, o que falta, chamados SG100–SG134, regras anti-ciclo e a **única fonte de status** (seção 10).
2. [Contrato do motor e dos JSONs](docs/arquitetura/contrato-motor-json.md) — limite entre motor e conteúdo; leis, países e estado inicial.
3. [Modelagem do domínio](docs/arquitetura/modelagem-do-dominio.md) — entidades da partida e seus estados.
4. [Primeira versão](docs/producao/primeira-versao.md) — público, escopo e critérios de sucesso.
5. [Mapa de influência](docs/producao/mapa-de-influencia.md) — direção visual aprovada.
6. [Motor do jogo](docs/motor-do-jogo.md) — proposta técnica do motor.

Documentos em `docs/producao/sg0xx-*`, o [plano de produção antigo](docs/plano-de-producao.md) e `docs/historico/` são registro histórico: explicam decisões passadas, mas não definem status. `docs/Exemplos/` e o estudo do Democracy 4 são referência de pesquisa, não contrato de conteúdo.

## Estrutura

- `src/engine`: motor de simulação (só variáveis, relações e mecanismos).
- `src/domain`: regras de domínio puras (propostas, políticas vigentes, fiscal).
- `src/game`: partida — criação, preparo e commit do turno, votações, eleições.
- `src/scenarios`: conteúdo JSON (cenário Brasil).
- `src/ui`: componentes React.
- `src/tests`: testes automatizados (Vitest).
- `docs/`: plano, arquitetura, produção e referências.

## Ambiente

Verificado em 9 de outubro de 2026: Node.js 22.23.2, npm 10.9.8.

```bash
npm ci          # instalar dependências
npm run dev     # ambiente de desenvolvimento
npm run check   # formatação, lint, tipos, build e testes
```

Em 9 de outubro de 2026, `npm run check` passou com 194 testes em 51 arquivos.

## Como trabalhar

Projeto pessoal, trabalho direto na `main` (decisão D-22 do plano).

1. Pegue o próximo chamado aberto na seção 10 do [PLANO.md](PLANO.md).
2. Faça só o que o chamado pede; ideia nova vai para o backlog (seção 8).
3. Rode `npm run check`. Verde = aceite técnico.
4. Commit com o ID do chamado (`SG1NN: …`) e marque `[x]` na seção 10 com data, commit e teste.
