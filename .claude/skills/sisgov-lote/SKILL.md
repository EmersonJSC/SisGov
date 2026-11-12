---
name: sisgov-lote
description: Use when a SisGov task is braçal and repetitive across hundreds of items (fill a column for 489 laws, set Brazil's value for 512 laws, draft degrees) and you plan to split it among background agents.
---

# Trabalho em lote com agentes

## Montar

1. Instruções num arquivo único (`instrucoes.md`), com o formato exato da
   saída, um exemplo e o que fazer na dúvida (`null` + motivo).
2. Lotes de ~120 itens, um agente cada, em segundo plano. Modelo
   `sonnet` (ou `haiku` se for só copiar); nunca Fable.
3. Saída em JSON puro: `{ "id": valor }`, um arquivo por lote.
4. **Guardar no projeto**, fora dos commits (ex.: `arquivo/lote-<assunto>/`),
   não só no scratchpad: o `/tmp` já foi limpo no meio do trabalho.

## Juntar

- Script, não à mão: ler as saídas, conferir que todo id existe, validar
  cada valor com o validador do motor e listar o que falhou.
- O que o agente inventou é rascunho: marcar na planilha (coluna Revisão,
  "rascunho <data>") e dizer ao autor quantos ficaram para revisar. Não
  esconder: ele perguntou "322 leis ainda pra REVISAR?" sem ter sido avisado.

## Avisar

No fim, uma linha: quantos itens, quantos válidos, quantos `null`, quantos
para revisar.
