# SisGov

SisGov é um jogo web de estratégia política e gestão econômica em que a pessoa jogadora representa um partido e conduz o governo enquanto ocupa a Presidência. Propõe políticas definidas em JSON, considera a opinião pública, busca apoio no Senado e observa consequências em um país que já começa com políticas vigentes. A população tem interesses sociais combinados e elege a Presidência e o Senado, com resultados separados e sem duplicar seu peso eleitoral. Na primeira versão, vencer a eleição presidencial inicia outro mandato preservando o estado do país; perder encerra a partida. O motor numérico e a bancada já existem; a próxima fase integra turnos, orçamento, financiamento e regras políticas. O mapa de escala visual continua sendo um laboratório demonstrativo.

## Antes de começar

Leia estes documentos na ordem abaixo:

1. [Plano de produção](docs/plano-de-producao.md): catálogo de chamados, dependências e critérios de aceite.
2. [Primeira versão](docs/producao/primeira-versao.md): público, escopo e critérios de sucesso do jogo.
3. [Quadro de chamados](docs/producao/quadro-de-chamados.md): estados e fluxo de acompanhamento.
4. [Motor do jogo](docs/motor-do-jogo.md): proposta técnica do motor de simulação.
5. [Estudo Democracy 4](docs/Estudo%20Democracy%204%20Politicas%20Grupos%20e%20Efeitos.docx): referência de pesquisa; não é um contrato de conteúdo para o jogo.

A direção visual aprovada está em [Mapa de influência](docs/producao/mapa-de-influencia.md): esferas ministeriais, resultados externos e interface de jogo.

A próxima etapa está detalhada em [Turnos, orçamento e capacidade](docs/producao/sg057-proxima-fase-e-economia.md).

Também há versões Word do plano e do motor em `docs/`. O Markdown é o texto mestre do plano de produção.

## Estrutura

- `src/engine`: contratos e cálculo do motor de simulação.
- `src/scenarios`: definições de cenários e conteúdo do jogo.
- `src/ui`: componentes de interface.
- `src/types`: tipos compartilhados.
- `src/tests`: testes automatizados.
- `src/assets`: recursos estáticos da interface.
- `docs/producao`: decisões e processos de produção.
- `docs`: plano, proposta do motor e referências de pesquisa.
- `.github/workflows`: verificações executadas no GitHub Actions.

## Ambiente de desenvolvimento

Versões verificadas em 26 de setembro de 2026:

- Node.js 22.23.2
- npm 12.0.2

Instale as dependências a partir do lockfile:

```bash
npm ci
```

## Comandos

Iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Executar os testes:

```bash
npm test
```

Gerar uma versão de produção e validar os tipos:

```bash
npm run build
```

Em 26 de setembro de 2026, `npm run build` e `npm test` concluíram com sucesso. Os testes executados foram 2, sem falhas.

## Verificação local

Execute todas as verificações antes de concluir um chamado:

```bash
npm run check
```

O comando confere formatação, lint, tipos, build e testes.

## Como trabalhar em um chamado

1. No plano de produção, escolha um chamado com dependências concluídas e mova sua issue para **Em andamento** no GitHub Project.
2. Crie uma branch a partir da `main` atualizada com o padrão `codex/sgNNN-resumo-curto`.
3. Faça uma alteração pequena e verificável. Antes de editar um arquivo, confira se não há outro chamado ativo que o altere.
4. Execute `npm run check` e revise o diff como pessoa usuária do percurso afetado.
5. Registre na issue a branch, a verificação executada, o resultado, a evidência do aceite e as decisões tomadas. Em seguida, mova o cartão para **Concluído**.

Para regras sobre commits, integração, revisão e sobreposição de arquivos, consulte o [fluxo de branches e revisão](docs/producao/fluxo-de-branches-e-revisao.md).

## Situações de bloqueio

Se uma dependência estiver pendente, um comando falhar ou outra alteração estiver no mesmo arquivo, mova o chamado para **Bloqueado**. Registre o motivo, o que falta e quem pode resolver. Não contorne o bloqueio criando escopo novo sem atualizar o plano.
