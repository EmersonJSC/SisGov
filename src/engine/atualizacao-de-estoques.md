# Atualização de estoques

**Chamado:** SG029

**Data:** 2 de outubro de 2026

**Estado:** implementado

Estoque conserva o saldo anterior e soma as taxas recebidas durante a duração do passo. Uma taxa precisa ter unidade compatível: `moeda` recebe `moeda_por_passo`; `quantidade` recebe `quantidade_por_passo`.

O motor não corrige um saldo fora do domínio. Se o resultado ficar impossível para a variável declarada, a atualização falha. Déficit ou dívida continuam válidos quando o domínio do cenário permitir valores negativos.
