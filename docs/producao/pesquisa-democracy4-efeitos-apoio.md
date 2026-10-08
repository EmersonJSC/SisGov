# Democracy 4 — efeitos e apoio político

Consulta: 8 de outubro de 2026. Pesquisa para SG057-B1/B2 e futura implementação
SG058-A/B. Não altera o motor nem adiciona mecânicas ao escopo automaticamente.
Fontes: documentação oficial e textos do desenvolvedor. Não houve inspeção do
código-fonte do jogo ou confirmação de versão instalada nesta pesquisa.

## 1. Conteúdo externo e motor

Políticas e relações de efeito são carregadas de arquivos CSV/texto, não definidas
individualmente no código. Efeitos ligam objetos como políticas, indicadores e
grupos. A documentação chama essa estrutura de rede neural, mas não descreve
treinamento de aprendizado de máquina. Portanto, não inferir que precisamos
treinar um modelo para reproduzir essa arquitetura.
[Fonte: modding oficial](https://www.positech.co.uk/democracy4/modding.html).

## 2. Magnitude, implantação e inércia não são a mesma coisa

O guia descreve efeito como destino, expressão dependente do nível da política
e inércia. Seu exemplo, com nível 0,5, produz contribuição 0,06; inércia 4 usa
a média dos quatro níveis anteriores. Isso não significa somar 0,06 indefinidamente
ao estado a cada turno. É uma contribuição calculada. A documentação também
permite expressões dependentes de outro indicador.
[Fonte: formato dos efeitos](https://www.positech.co.uk/democracy4/modding.html).

Separadamente, políticas têm duração de implantação/cancelamento, custos,
receitas, pré-requisitos e efeitos de saída. A competência ministerial pode
influenciar a implantação. Logo, inércia de uma relação não deve ser confundida
com tempo de implantação da política.
[Fonte: políticas](https://www.positech.co.uk/democracy4/mod_policies.html).

Implicação para o SisGov: nosso atraso por consulta a um retrato histórico e nossa
resposta gradual não são a média móvel descrita pelo D4. Não renomear um mecanismo
como se fossem equivalentes; adicionar média móvel exigiria contrato e testes próprios.

## 3. Reação direta e reação aos resultados

As saídas de uma política podem atingir grupos, situações e indicadores.
[Fonte: políticas](https://www.positech.co.uk/democracy4/mod_policies.html).
Indicadores também têm entradas e saídas, inclusive para grupos de eleitores.
Assim, a arquitetura admite política → grupo e política → indicador → grupo.
[Fonte: simulação](https://www.positech.co.uk/democracy4/mod_simulation.html).

Uso proposto: distinguir aprovação ideológica da medida de reação ao seu resultado
material. Ambas precisam de origem identificável; registrar duas ligações não
justifica contar o mesmo benefício duas vezes.

## 4. Efeitos temporários e memória política

Eventos podem criar objetos temporários chamados `grudges`, com alvo, magnitude
inicial e fator de retenção. O fator multiplica o efeito a cada turno; valores
mais próximos de 1 significam dissipação mais lenta. Não confundir esse objeto
temporário com incremento permanente de apoio em todos os turnos.
[Fonte: eventos](https://www.positech.co.uk/democracy4/mod_events.html).

Em resposta de 23/07/2021, Cliff Harris explica a complacência como perda de
reconhecimento por medidas antigas. O jogo a representa como efeito explícito
para ser visível ao jogador, em vez de apenas ocultar uma redução do impacto
de cada política. Isso permite que uma política continue benéfica sem garantir
eternamente a mesma gratidão política.
[Fonte: resposta do desenvolvedor](https://forums.positech.co.uk/t/question-regarding-complacency/17461).

## 5. Satisfação não é votação

No texto de 25/10/2021, o desenvolvedor descreve eleitores individuais e distingue
comparecimento de escolha eleitoral. Menciona elasticidade de opinião, campanha,
identificação partidária, percepção do líder, tempo no poder e ministros como
fatores. No mesmo artigo, voto de protesto aparece como ideia em desenvolvimento,
não como prova de implementação daquela data.
[Fonte: blog do desenvolvedor](https://www.positech.co.uk/cliffsblog/2021/10/25/protest-votes-in-democracy-4-final-piece-of-the-puzzle/).

Limite: essas fontes não fornecem uma fórmula completa e versionada da atual
conversão de satisfação em votos. Não usar fórmulas sugeridas por jogadores em
comentários como se fossem código confirmado. Também não deduzir delas regras
de coalizão, Senado ou Congresso para o SisGov.

## 6. Aplicação ao motor orientado por JSON do SisGov

Diretriz reafirmada pelo usuário: conteúdo e parâmetros vêm de JSONs; o motor
implementa mecanismos genéricos. Trocar país ou política não deve exigir um
`if` com seu nome no código. Isso não significa executar código arbitrário vindo
de mods: novos mecanismos matemáticos exigem implementação e validação no motor.

- JSONs: IDs, alvos, intensidade, parâmetros, unidades, atraso, duração, requisitos,
  grupos, instituições e regras permitidas pelo catálogo de mecanismos.
- Motor: valida referências/unidades, resolve relações, calcula contribuições,
  mantém memória temporal e explica suas origens.
- Estado da partida: contribuições ativas, histórico, consumo de ocorrências e
  sorteios; separado das definições dos JSONs.
- Interface: apresenta causas e comandos; não inventa coeficientes políticos.

Exemplo conceitual, NÃO formato atualmente aceito pelo carregador:

```json
{
  "id": "efeito-exemplo-apoio",
  "origem": "politica-exemplo",
  "alvo": "grupo-exemplo",
  "grandeza": "apoio_coalizao_pp",
  "mecanismo": "contribuicao_por_intensidade",
  "parametros": { "pontosNaIntensidadeMaxima": 2 },
  "temporal": { "unidade": "mes", "atraso": 0, "modo": "enquanto_efetiva" }
}
```

O valor 2 é ilustrativo, não constante do motor nem coeficiente do D4. Uma política
diferente pode declarar outro alvo, valor e prazo usando o mesmo mecanismo.

## 7. Decisão e próximos usos

Usuário aceitou que o apoio acompanhe o efeito da política, sem bônus mensal
repetido, diminuindo quando o efeito se perde. Registrar como decisão do SisGov,
não como cópia exata do D4. Os detalhes de herança, redistribuição e demais
propostas da minuta B2 não foram todos aprovados por essa resposta.

Na implementação SG058-A, testar contribuição persistente, intensidade parcial,
retirada, atraso, saturação reversível e restauração sem duplicidade. Configurar
esses casos por dados, sem tratamento exclusivo de política ou país.

Complacência, memória temporária de acontecimentos e voto comportamental ficam
como referências futuras: avaliar custo de gameplay antes de incluí-los na V1.
A pesquisa não autoriza acrescentar essas mecânicas agora.
