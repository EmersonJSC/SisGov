# Confirmação do passo

**Chamado:** SG030

**Data:** 2 de outubro de 2026

**Estado:** implementado

O executor recebe o retrato anterior e um lote de comandos. Ele aplica controles em uma cópia de trabalho, calcula as relações ativas, combina valores calculados, atualiza estoques e só então confirma passo e valores novos.

Todas as relações leem o retrato do começo do passo, com os controles aplicados pelo lote. Relações em cadeia só propagam seu resultado no passo seguinte. Se qualquer comando, cálculo ou domínio falhar, a execução recebida permanece sem alteração.
