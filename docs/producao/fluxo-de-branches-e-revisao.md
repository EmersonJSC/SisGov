# Fluxo de branches e revisão

**Chamado:** SG005  
**Área:** Produção e produto  
**Estado:** Concluído

## Regra de trabalho

Cada chamado assumido recebe uma branch própria, criada a partir da `main` atualizada. Usar o padrão `codex/sgNNN-resumo-curto`, por exemplo, `codex/sg005-branches-e-revisao`.

Manter apenas um chamado de implementação em andamento por pessoa. Antes de alterar um arquivo, conferir se outra pessoa já o está alterando em uma branch ativa.

## Commits e integração

Os commits devem mencionar o ID do chamado e descrever a mudança de forma curta. Exemplos:

```text
docs: SG005 define fluxo de revisão
feat: SG027 implementa consulta de dependências
fix: SG041 corrige exibição do estado
```

Antes de integrar uma branch, atualizar sua base com a `main`, resolver conflitos, executar as verificações pertinentes e revisar o diff. A integração é feita por pull request ou, enquanto houver uma única pessoa responsável, por merge local registrado na issue do chamado.

## Revisão

Quem implementou deve reler o diff como primeira revisão e executar o percurso afetado como usuário. O registro na issue informa a verificação executada, o resultado e a evidência.

Quando houver outra pessoa disponível, a autora solicita revisão da pull request. A revisão verifica o aceite, contratos afetados, testes e efeitos visíveis. A mesma pessoa não se apresenta como revisora independente da própria alteração.

## Sobreposição de arquivos

Antes de duas pessoas alterarem o mesmo arquivo, elas devem combinar quem será responsável por cada parte. A preferência é dividir o trabalho por arquivos ou realizar uma alteração de cada vez.

Se duas branches passarem a alterar o mesmo trecho, a pessoa que iniciou depois atualiza sua branch a partir da `main` integrada e reaplica somente sua alteração necessária. Não descartar nem sobrescrever trabalho alheio para resolver um conflito. Caso a separação não seja clara, pausar o segundo chamado e registrar o bloqueio na issue.

## Registro na issue

Ao iniciar, registrar a branch e a data. Ao pausar, registrar o que foi feito, a verificação executada, o resultado, a pendência e o próximo passo. Ao concluir, registrar o commit ou pull request, a evidência do aceite, as decisões tomadas e o resultado da revisão.
