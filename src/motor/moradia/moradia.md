# Moradia

Estoque de casas do país, só no motor (a tela mostra os índices). Aprovado em
04/nov/2026.

- **Família** = pessoas dos pops ÷ tamanho da família (`pessoas_por_familia`).
- **Déficit** = famílias sem casa formal, em %. **Favela** = famílias em casa
  precária, em %. Os dois saem da contagem; as outras leis continuam somando
  direto nos índices.
- A contagem move a **base** do índice: índice = base + leis.
- **Desgaste:** as casas formais perdem o desgaste das obras (4% ao ano).
- **Governo:** constrói com a lei de verba. Cada casa custa `custo_casa` anos de
  PIB por pessoa; a corrupção encarece.
- **Empresas:** partem do ritmo que repõe o desgaste no turno 0 e constroem mais
  com o setor de construção maior, o preço da moradia alto, juro e imposto
  baixos e menos corrupção.
- **Obras:** governo e empresas entram na mesma fila; levam o prazo das obras, e
  a corrupção alonga.
- **Sem casa:** quem fica sem casa formal levanta casa precária aos poucos, na
  proporção do turno 0 (`autoconstrucao` é a velocidade).
- O país começa parado: as obras do turno 0 só repõem o desgaste.
- Não equilibrado: os números só dão a direção.
