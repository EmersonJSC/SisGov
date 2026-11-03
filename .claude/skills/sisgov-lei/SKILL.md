---
name: sisgov-lei
description: Use when writing, reviewing or changing a SisGov law JSON in src/conteudo/mundo/leis/, or when the author proposes a new law.
---

# Escrever uma lei

**Formato:** a fonte da verdade é o tipo e o validador em `src/motor/leis/`
(passo 3). Se divergir desta skill, vale o código; corrigir a skill.

## Antes de escrever

1. A lei está na lista aprovada pelo autor? Lei fora da lista é proposta no
   chat, não arquivo.
2. Escrever o **comportamento esperado** em 2–4 frases: o que sobe, o que
   desce, em quanto tempo, quem gosta, quem não gosta. É isso que o script de
   cenário vai conferir (direção, não número).
3. Pesquisar a direção dos efeitos em estudo ou consenso, não em outro jogo.
   **Nada do Democracy 4** (nomes, números, ligações). Efeito sem base clara
   fica fraco ou fica de fora; dizer isso ao autor.

## Regras do formato

- `"versao"` sempre; `id` em kebab-case igual ao nome do arquivo.
- `camada`: `essencial` (estrutura do Estado, muda raro) ou `jogabilidade`.
- `forma`: `continua` se tem valor em % (alíquota, gasto), na unidade real
  (fração: 0.275) com faixa própria; `opcoes` se não tem.
- Efeito em receita, PIB, juros, dívida **não** se escreve na lei: a lei
  aponta a base do motor (`calculo.base`) e o motor calcula.
- Efeitos de jogabilidade só nos índices de
  `src/conteudo/mundo/indicadores/variaveis.json`; índice novo é pedido ao
  autor, não criado de carona.
- Força por nível (`fraca`, `media`, `forte`), nunca número solto.
- Todo efeito declara o atraso em turnos (turno = 2 meses).
- Nenhum nome de país na lei. Nome local ("Selic") é rótulo do país.
- **Nenhuma referência a país real** em opção, faixa ou texto ("moderado,
  como o Brasil" é proibido; foi o problema da versão antiga). A régua é o
  próprio país da partida: renda média, salário, PIB, população dele.
- A lei diz **quanto**; quem paga ou quem recebe pode ser outra lei
  (ex.: alíquota do imposto de renda × progressividade).
- Gasto é lei contínua em % do PIB; público e privado são esferas separadas,
  cada uma com a sua lei (GDD, seção 7).
- **Bússola, nunca grupo:** a lei diz onde fica (`bussola`, eixos
  `economico` esquerda − ↔ direita + e `social` verde/libertário − ↔
  tradicional/autoritário +, de −1 a +1): `min`/`max` na lei contínua, um
  ponto por opção. Nunca citar grupo na lei; quem gosta sai da distância
  (`src/motor/grupos/grupos.md`). Meio ambiente fica no lado − do social.
- Lei inventada vale se for plausível; número na ordem de grandeza certa.

## Conferir

- Validador passa (`npx vitest run` do teste de contrato).
- Script de cenário mostra a direção prometida com a lei em valores
  diferentes (a partir do passo 4).
