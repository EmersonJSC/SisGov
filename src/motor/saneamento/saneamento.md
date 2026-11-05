# Saneamento

Rede de água e esgoto do país, só no motor (a tela mostra os índices). Aprovado
em 04/nov/2026.

- **Índice** = famílias atendidas, em %: quem tem a rede na porta menos quem foi
  cortado. A contagem move a **base** do índice; a favela continua puxando o
  índice pela deriva.
- **Desgaste:** a rede perde `desgaste` ao ano. O país começa parado: as obras
  do turno 0 só repõem isso.
- **Governo:** faz obras com a lei de verba. Cada ligação custa `custo_ligacao`
  anos de PIB por pessoa; a corrupção encarece.
- **Operadoras locais:** fazem o resto da reposição, com o setor de construção,
  o ânimo do investimento e a corrupção.
- **Bolso:** a conta pede uma renda (`renda_minima`, em vezes a renda média do
  turno 0, com a inflação tirada). A renda de cada pop diz quem paga, e `corte`
  é a parte de quem não paga que acaba cortada, aos poucos. Nenhuma lei sabe
  disso: o mesmo aumento quase não pesa onde sobra renda e corta muita gente
  onde falta. A renda que sobe também religa famílias.
- **Concessão:** empresas ligam famílias sem gastar verba, mas só onde dá lucro:
  favela e campo ficam fora da conta. A tarifa sobe, tira padrão de vida e deixa
  mais gente sem pagar (`tarifa_por_concessao`).
- **Teto da tarifa:** a conta fica barata, dá padrão de vida e mais gente paga;
  entra menos dinheiro, a rede desgasta mais e as operadoras fazem menos. Colide
  com a concessão.
- **Tratamento:** cada obra fica mais cara, a rede cresce menos e o meio
  ambiente melhora na medida da rede ligada.
- **Setor cheio:** casas e rede disputam as mesmas vagas. Até `folga_do_setor`
  vezes o trabalho do turno 0 (vezes o tamanho do setor), nada atrasa; acima
  disso, as obras das duas andam mais devagar.
- **Setas:** saneamento empurra saúde e meio ambiente pela deriva.
- Não equilibrado: os números só dão a direção.
