---
name: sisgov-passo
description: Use when opening, implementing or closing a numbered step of the SisGov roadmap (passo 3, 4, 5…), or when the author says "pode seguir", "próximo passo", "fecha o passo".
---

# Andar um passo do roteiro

O roteiro está em `docs/jogo/plano-de-desenvolvimento.md` (seção 3). Cada
passo tem "Começa com", "Pronto quando" e "Expande depois". Um passo por vez.

## Abrir

1. Ler só a linha do passo no plano e a do escopo (seção 10). Nada de abrir
   código antigo "para ver"; peça antiga volta só lida e quando o passo pede.
2. Proposta curta no chat: o que entra (só o "Começa com"), o que fica de
   fora, e **uma** decisão que é do autor, com recomendação. Esperar o sim.
3. Escrever o comportamento esperado antes do código (no `.md` do módulo ou
   no topo do script de cenário).

## Durante

- `npx tsc -b` e `npx vitest run <arquivo>` do que mudou. `npm run check` só
  no fechamento.
- **Conferir o escopo a cada proposta** (pedido do autor, 01/nov): se a
  conversa passou do "Começa com" do passo, parar e mostrar ao autor em duas
  listas o que **é do passo** e o que **não é**. O que não é vai para a
  seção 11 do escopo, com o motivo (ex.: "precisa dos pops do passo 7").
  Avisar antes de seguir, não depois.
- O "Expande depois" **não** entra. Ideia nova vai para a seção 11 do escopo
  e o autor fica sabendo.
- Se o passo exigir mexer em passo pronto, parar: o desenho estava errado,
  rever com o autor.
- Terceira tentativa sem fechar: parar e rever com o autor.

## Fechar (checklist)

- [ ] Cada linha do "Pronto quando" conferida por teste, script ou tela, e
      mostrada ao autor (saída do script ou screenshot).
- [ ] `npm run check` verde.
- [ ] Plano: passo vira ✅, "⬅ próximo" vai para o seguinte, seção 1
      atualizada.
- [ ] Escopo, seção 10: linha do passo com ✅ e data.
- [ ] Se o passo fecha uma versão (seção 9 do plano), propor a tag ao autor.
- [ ] Commit com assunto (`motor: …`, `mundo: …`, `docs: …`).
- [ ] Rodada encerrada com a skill `sisgov-rodada`.
- [ ] Sem `git push` sem a palavra do autor.
