# Opiniões dinâmicas dos personagens

Contrato técnico para SG057-B2, registrado em 8 de outubro de 2026. O usuário
confirmou personagens gerados, opiniões que respondem a leis e dados do país, e
variação aleatória condicionada ao contexto. As escolhas técnicas abaixo tornam
essa direção implementável em SG058/SG099; parâmetros concretos pertencem aos JSONs.
Ainda não há motor de opinião política de personagens em execução.

## Definição e estado

Cada personagem tem identidade e traços gerados, partido atual, opinião atual
sobre o governo e relações próprias com grupos, personagens e instituições.
Filiação não é um valor fixo de aprovação. Traços iniciais influenciam a reação,
mas opiniões podem subir ou cair durante o jogo. História textual é atribuída
depois da geração e não define traços nem reescreve a opinião.

O JSON declara um mecanismo suportado, alvos, fontes, grandezas, pesos, limites,
tempo e amplitude possível da variação. A partida guarda instâncias, opinião
atual, contribuições por fonte e memória dos sorteios. Cada mudança mostra sua
causa: lei, efeito material, indicador, evento ou variação contextual.

Para grupos sociais, o mesmo sistema de fontes e contribuições permite mudança
de opinião. O acaso adicional de personagens não se aplica automaticamente aos
grupos; sua inclusão para um grupo teria de ser declarada em conteúdo validado.

## Cálculo proposto

No fechamento de cada turno político, o motor lê um único retrato consistente
das políticas efetivas e dos indicadores mensais já calculados. Para cada
personagem, calcula a posição-alvo a partir da base e das contribuições ativas
com origem identificada. As mesmas causas estáveis produzem o mesmo alvo; manter
uma lei por mais um turno não soma outro bônus à opinião anterior.

Um mecanismo de reação pode acrescentar uma variação limitada ao alvo do turno.
A chance, direção e amplitude dependem de traços e das fontes ativas no retrato;
o JSON declara os parâmetros. Com amplitude zero, o resultado é determinístico.
A variação representa interpretação/incerteza daquele momento, não um incremento
permanente reaplicado mês após mês. Limitar a opinião exibida a 0–100 somente
depois de combinar base, contribuições e variação, preservando as parcelas antes
do limite para permitir reversão correta.

Exemplo sintético: uma personagem tem base 50, uma lei contribui +8 e um índice
desfavorável contribui −3. O alvo é 55. Uma variação contextual configurada entre
−2 e +2 pode produzir 53–57 naquele fechamento. No próximo turno, com as mesmas
fontes, o novo alvo continua 55; não começa a soma em 57. Retirar a lei remove sua
contribuição +8. Coeficientes do exemplo não são valores finais do cenário.

Essa é a cadência inicial proposta: uma avaliação por turno político, após os
três meses técnicos. JSONs podem configurar a frequência de um mecanismo quando
o motor suportar essa frequência; não aceitar unidades ambíguas nem sortear ao
abrir uma ficha ou prévia. A avaliação de coligação consulta a opinião já
confirmada naquele estado e permanece determinística.

## Ordem, persistência e proteção contra repetição

Ordenar personagens e relações por ID estável. Cada fechamento usa o gerador
persistido da partida e registra um identificador para a avaliação do personagem
naquele turno. A confirmação do turno inclui opiniões, diário e estado do gerador
na mesma transação. Se o turno falha, nada disso avança. Restaurar e repetir a
mesma decisão produz o mesmo resultado; consultar estimativas não consome sorteios.

Novos personagens podem aparecer conforme condições declaradas no cenário.
Geração e escolha de história são eventos separados da atualização de opinião,
com sorteios e memórias próprios. Uma história escolhida não muda porque a
opinião atual mudou. O motor registra o partido que indicou a pessoa sem deduzir
apoio automático ao governo.

## JSON ilustrativo, ainda não aceito pelo carregador

```json
{
  "id": "reacao-governo-personagens",
  "alvo": "opiniao_governo",
  "mecanismo": "alvo_com_variacao_contextual",
  "frequencia": "turno_politico",
  "limites": { "minimo": 0, "maximo": 100 },
  "fontes": ["efeitos_politicas", "indicadores_pais"],
  "variacao": {
    "amplitudeMaxima": 2,
    "condicionadaPor": ["tracos", "fontes_ativas"]
  }
}
```

Nomes de mecanismos e campos são candidatos a esquema, não promessa de que mods
já podem usar esse arquivo. A implementação deve validar IDs, tipos, unidades,
amplitudes e frequências; não interpretar texto de histórias como fórmula.

## Aceites futuros

- Mesma semente, conteúdo e escolhas reproduzem personagens e opiniões.
- Alterar uma lei ou indicador muda apenas contribuições relacionadas; o diário
  identifica as fontes e a parcela da variação contextual.
- Três meses dentro de um turno não triplicam um efeito de apoio.
- Opinião pode divergir da filiação partidária e voltar a subir ou cair depois.
- Prévia e restauração não sorteiam nova reação.
- Uma política sem regra política para determinado personagem não cria bônus
  oculto; uma regra nova em JSON usa mecanismo validado sem editar nomes no código.
- Base e contribuições preservadas permitem retirar um efeito mesmo se a opinião
  exibida esteve limitada a 0 ou 100.

SG098/099 modelam definições e estado; SG058-A aplica reações; SG061 confirma o
fechamento atômico; SG069/071 explicam a mudança; SG081/082 salvam e restauram.
O esquema, intervalos concretos e peso das fontes ainda precisam ser fixados
antes da implementação. Cada partido escolhe candidatos gerados para a partida;
o jogador escolhe presidente e vice do seu partido e, se vencer, os ministros.
Opinião sobre o
governo é estado distinto da filiação e da ocupação de um cargo.
