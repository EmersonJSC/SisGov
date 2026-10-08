# Contrato de referência: motor, leis e países em JSON

Decisões confirmadas pelo usuário em 8 de outubro de 2026. Este documento é a
referência curta para implementar o motor político do SisGov. O
[plano de produção](../plano-de-producao.md) continua sendo a fonte dos estados
dos chamados. **Direção aprovada não significa funcionalidade implementada.**

## Ideia central

O SisGov é um jogo. Primeiro construímos o motor que entende os tipos de JSON,
as relações entre eles e os mecanismos de cálculo. Depois criamos o conteúdo:
leis, constituições, situações, índices e países. O Brasil é o primeiro cenário
e o recorte da V1, mas nenhuma quantidade ou regra brasileira deve virar uma
constante universal do motor. O motor deve poder receber outros países no
futuro sem duplicar sua lógica.

Uma escolha política mutável pelo jogador é representada por uma **lei**. O JSON
da lei define o que ela faz, o que exige, com quais leis é incompatível, como
pode ser alterada e quais mecanismos já suportados pelo motor utiliza. Leis
ordinárias e constitucionais têm processos de autorização distintos. Uma lei
ordinária não pode contornar uma proteção constitucional.

Índices, situações, eventos, grupos, personagens e organização política também
têm JSONs próprios. Não são todos “leis”: eles fornecem condições, alvos,
resultados ou participantes das relações criadas pelas leis.

## Catálogo comum e estado de cada país

As definições das leis ficam em um catálogo compartilhado. Não criamos uma lei
de Imposto de Renda duplicada para cada país só para mudar seu estado inicial.
Cada JSON de país identifica o país e declara quais leis do catálogo já estão
vigentes, seus valores iniciais e o estado herdado. Na abertura do jogo, o
carregador lê os JSONs, apresenta os países configurados, o jogador escolhe um
e a partida nasce do estado daquele país. Inicialmente só haverá Brasil.

**Lei ausente no início não é lei proibida.** Ela continua no catálogo e pode
ser proposta pelo jogador naquele país se os requisitos para aprová-la forem
cumpridos. O país não precisa manter uma lista artificial de “leis permitidas”.
O motor deve validar IDs, dependências, incompatibilidades e condições
institucionais antes de aceitar a mudança.

## O que o motor decide — e o que o JSON decide

O motor fornece operações genéricas e matemática reutilizável: ler e validar
arquivos, resolver referências, calcular relações e efeitos, verificar
autorização, aplicar/revogar/substituir leis, apurar votos e eleições pelos
mecanismos suportados, atualizar a partida e guardar histórico. Ele não escolhe
por conta própria quantas cadeiras existem, quantos turnos tem uma eleição ou
qual porcentagem aprova uma emenda.

Esses valores e escolhas ficam nos JSONs das leis e do país. Exemplo: a
pergunta “a eleição presidencial tem um ou dois turnos?” é respondida pela lei
constitucional eleitoral vigente na partida, não por um `if (pais === Brasil)`.
Duas leis eleitorais incompatíveis para a mesma eleição não podem vigorar juntas;
uma mudança constitucional substitui a anterior conforme o processo vigente.
A lei aparece na bolha da Constituição, dentro da esfera federal.

“Suportar o mundo” significa desenhar operações parametrizadas, não escrever
agora todas as regras de todos os países. A V1 implementa os mecanismos
necessários ao conteúdo inicial do Brasil. Um país futuro pode reutilizá-los só
com JSON. Um mecanismo matemático realmente novo exige extensão e testes no
motor; JSON seleciona e parametriza mecanismos, não executa código arbitrário.

Na revogação, a lei declara o limiar opcional que encerra uma redução assintótica
(`revocationEpsilon`). A taxa ou os passos dessa redução pertencem ao fluxo de
implantação da partida: o contrato da lei não fixa uma velocidade extra que ainda
não é executada pelo jogo.

## O que já funciona e o que falta

O motor numérico atual já lê políticas, consequências e situações do cenário
por JSON. Há um primeiro resolvedor isolado em
`src/engine/laws/resolveLawSetup.ts`: ele lê um catálogo de leis e configurações
iniciais de países, seleciona um país e verifica vínculos, requisitos e
incompatibilidades. Os testes provam que dois países podem começar com leis
diferentes usando o mesmo catálogo e que uma lei não vigente continua nele.

Isso **ainda não é uma partida política funcional**. Faltam, nesta ordem lógica:

1. Integrar catálogo de leis e JSONs de países ao carregador real, separando o
   rascunho atual `organizacao-politica.json` em definições reutilizáveis e
   estado inicial do país.
2. Definir e validar no pacote os campos de leis para autorização, parâmetros,
   efeitos, dependências e exclusões; referenciar índices, situações e eventos
   sem nomes especiais no código.
3. Fazer a partida aplicar, alterar, revogar e substituir leis por comandos,
   inclusive proteções constitucionais, sem mutar o catálogo nem repetir efeitos.
4. Conectar os mecanismos matemáticos necessários à V1 brasileira — votação,
   eleição, cadeiras, opinião e consequências — aos parâmetros dessas leis.
5. Integrar a partida à interface e ao salvamento; provar o percurso com o
   Brasil carregado dos JSONs. Só então chamar esse ciclo de jogável.

Esses itens são entregas distribuídas por SG057-B2, SG098–SG099, SG058–SG061,
SG067–SG071 e SG081–SG083 no plano. Nenhum desses chamados fica concluído só
porque este contrato existe ou porque o resolvedor isolado passou nos testes.

## Regra para futuras decisões de projeto

Antes de perguntar ao usuário “quantos?”, “qual porcentagem?” ou “qual formato
de governo?”, verificar se a resposta é um parâmetro ou uma lei do conteúdo.
Se for, não transformá-la em regra fixa do motor nem bloquear a arquitetura por
ela. Perguntar apenas quando a escolha muda o **mecanismo genérico** que o motor
precisa suportar ou define o recorte concreto do primeiro cenário brasileiro.
