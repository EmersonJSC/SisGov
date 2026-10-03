# Comandos de política

**Chamado:** SG026

**Data:** 2 de outubro de 2026

**Estado:** implementado

A camada de jogo só chama esta operação depois que a política já estiver autorizada. Ela entrega ID da política e intensidade aplicada. O tradutor encontra o controle declarado pela política e devolve o comando numérico e as relações que devem ficar ativas naquele passo.

Exemplo: `material-escolar` com intensidade 20 produz o comando `verba_educacao = 20` e ativa `material-escolar:0:melhora-educacao`.

O tradutor recusa política inexistente, intensidade não finita, intensidade fora do domínio e duas mudanças para o mesmo controle no lote. Política ausente do lote não ativa relações nem termos constantes. A autorização legislativa real continua na camada de jogo futura; este contrato não simula votação.
