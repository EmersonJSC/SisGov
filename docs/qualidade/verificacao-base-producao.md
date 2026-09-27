# Verificação da base de produção

**Chamado:** SG008
**Área:** Qualidade e validação
**Estado:** Concluído

## Alteração exercitada

Este registro é uma alteração documental pequena usada para exercitar o fluxo completo de produção após a preparação inicial.

## Roteiro de verificação

1. Criar uma branch por chamado a partir da `main` atualizada.
2. Instalar dependências pelo lockfile com `npm ci`.
3. Executar `npm run check` para validar formatação, lint, tipos, build e testes.
4. Revisar o diff e registrar a evidência na issue do chamado.
5. Enviar a branch ao GitHub para que o GitHub Actions repita as verificações.

## Resultado

- Branch criada: `codex/sg008-verificar-base-producao`.
- `npm ci` concluiu usando o lockfile.
- `npm run check` concluiu com sucesso: formatação, lint, build e 2 testes passaram.
- O diff desta alteração documental foi revisado antes do commit.
- A branch foi enviada ao GitHub e o workflow [Verificações](https://github.com/EmersonJSC/SisGov/actions/runs/36282871026) concluiu com sucesso.

O npm informou duas vulnerabilidades moderadas em dependências e que a versão escolhida do ESLint não recebe mais suporte. Nenhuma correção automática foi aplicada, pois `npm audit fix --force` pode alterar dependências além do escopo deste chamado. Essas pendências não impediram a instalação, o build ou os testes e devem ser avaliadas em um chamado próprio.
