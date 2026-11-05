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
- **Bolso:** o preço da moradia pede uma renda (`renda_por_ponto`, em vezes a
  renda média do turno 0, com a inflação tirada). A renda de cada pop diz quem
  paga. Nenhuma lei sabe disso: o resultado sai do país. Se mais famílias que no
  turno 0 deixam de pagar, elas perdem a casa formal aos poucos
  (`despejo_velocidade`), mais gente sem casa levanta casa precária e a empresa
  só constrói para quem paga. Quem volta a pagar volta para a casa. Com menos
  gente sem pagar que no turno 0, quem está sem casa formal levanta menos casa
  precária. A casa do governo não depende disso.
- **Campo:** as famílias dos pops do campo são o limite. Cada ponto de
  concentração acima do turno 0 tira `campo_por_ponto` delas do campo, aos
  poucos (`exodo_velocidade`), e elas entram no déficit; o êxodo para ao chegar
  nessa conta. Concentração abaixo disso abre vagas: famílias sem casa formal
  voltam e saem do déficit. Sem pop mudando nem renda da cidade pesando. A ficha
  da lei mostra o déficit no fim do êxodo; o mapa liga concentração a déficit.
- O país começa parado: as obras do turno 0 só repõem o desgaste.
- Não equilibrado: os números só dão a direção.
