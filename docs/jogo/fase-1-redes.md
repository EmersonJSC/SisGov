# Fase 1: Serviços do Estado

Pedido do autor em 05/nov/2026: transformar saúde e saneamento numa mecânica só, as
**redes**, motor por trás de algumas esferas do Estado. Este arquivo é o desenho; o
código só começa depois das decisões da seção 6.

## 1. Como uma fase anda

O problema não era o conteúdo, e sim o ciclo: perguntar um detalhe, desenhar,
verificar, produzir, parar, perguntar de novo. Agora cada fase tem três momentos:

1. **Desenhar:** a fase inteira, num arquivo.
2. **Decidir:** o autor responde todas as decisões de uma vez.
3. **Produzir:** até o fim, sem parar. Só se para com um bloqueio real: algo que o
   desenho não previu e muda a mecânica. A verificação é uma só, no fim da fase.

## 2. O que é uma rede

Uma rede é um serviço que o Estado presta. Todas têm as mesmas peças:

| Peça | O que faz | Saúde | Saneamento | Educação | Segurança |
|---|---|---|---|---|---|
| Capacidade | quantos a rede comporta; obra leva tempo e disputa a construção civil | vagas | ligações | vagas na escola | delegacias e presídios |
| Desgaste | sem verba, a capacidade cai | fechamento | desgaste | fechamento | fechamento |
| Quem opera | capacidade sem gente não atende | profissionais | nenhum | professores | policiais |
| Privado | atende antes e tira gente da rede pública | planos, seguro | concessão | escola privada | segurança privada |
| Bolso | a renda dos pops diz quem paga | plano, cobrança | conta | mensalidade | nenhum |
| Procura | quanto cada pessoa usa | cobertura, cobrança | todos | matrícula | crimes |
| Índice | quem é atendido, pela contagem | `atendimento` | `saneamento` | novo: vagas na escola | `seguranca` |
| Empurra | outros índices, pela deriva | `saude` | `saude`, `meio_ambiente` | `instrucao` | a decidir |
| Desvio | verba parada vira corrupção | sim | não | sim | sim |

Moradia tem obra, desgaste e bolso, mas é estoque de casas, não serviço: fica fora
desta fase. Proteção social é transferência de renda: não é rede.

## 3. Arquitetura

> **Suspensa em 05/nov/2026.** O motor único saiu de uma leitura minha do pedido, sem comparar
> as contas. Os mecanismos se decidem depois da planilha `docs/jogo/leis.xlsx`.

**Hoje** (medido): `motor/atendimento` tem 819 linhas e `motor/saneamento` 325, cada
um com a sua conta. `motor/turno` tem 1552 linhas e cita atendimento 50 vezes e
saneamento 36. Lei nova da saúde mexe em 7 arquivos: regra, motor, turno, ficha, mapa,
JSON da rede e a própria lei. Em `RegraDoAtendimento` há um campo por lei.

**Depois:**

- `motor/rede/`: um motor só, com as peças da seção 2. Peça que a esfera não usa fica
  de fora do JSON.
- `mundo/redes/<esfera>.json`: declara as peças e a ligação de cada lei com uma
  **alavanca** (`alcance`, `procura`, `cobranca`, `reserva`…). Lei nova é o JSON da lei
  mais uma linha aqui, sem tocar no motor.
- `motor/turno`: um laço sobre as redes, no lugar das etapas de cada uma.
- `partida/previa.ts` e `partida/visao.ts`: ficha e setas saem das alavancas, não de
  linhas à mão. Isso resolve o dinheiro que falta na ficha das leis de opções.

Migrar é refatorar: mesmo resultado, com os testes atuais de guarda. Mudar
comportamento vem depois, em pedido separado (regra do projeto).

## 4. Requisitos de uma rede

- O índice sai da contagem; lei nenhuma mexe nele direto.
- A mesma lei muda de sentido pelo estado do país, sem condição escrita.
- Toda alavanca tem ganho e custo.
- O país começa parado: no turno 0 nada anda sozinho.
- O motor não conhece nome de lei, índice nem esfera.
- O jogador vê o efeito na ficha e no mapa, com o dinheiro junto.

## 5. Vícios (parte da área da Saúde)

Fechado pelo autor em 05/nov/2026. Não é área própria, e não é rede: é **consumo
regulado**, em dois temas, **drogas** e **jogos**. Só as escadas de liberação são fixas;
o resto é regulação tirada da [pesquisa](estudos/vicios.md). São 12 leis e 3 índices.

| Nível | Drogas: o que é permitido | Jogos: o que é permitido |
|---|---|---|
| 0 | tudo proibido | tudo proibido |
| 1 | bebida | loteria |
| 2 | mais cigarro | mais bingo e corrida |
| 3 | mais cannabis | mais cassino presencial |
| 4 | mais cocaína e sintéticas | mais apostas esportivas pela internet |
| 5 | mais crack e opioides | mais cassino pela internet |

### As 12 leis

| # | Lei | Tema | Bússola | Como funciona | Ganho | Custo |
|---|---|---|---|---|---|---|
| 1 | Liberação das drogas | drogas | tradicional a libertário | escada acima | abre mercado legal | mais consumo |
| 2 | Imposto das drogas | drogas | esquerda | taxa o que é legal | dinheiro, menos consumo | com corrupção, abre contrabando |
| 3 | Venda pelo Estado | drogas | esquerda | farmácias e lojas do Estado vendem | controle, pouco consumo novo | pouca oferta mantém o mercado ilegal |
| 4 | Lojas licenciadas | drogas | direita e libertário | empresas vendem com licença | muita oferta derruba o mercado ilegal | mais consumo |
| 5 | Cuidado com o usuário | drogas | esquerda e libertário | escada: tratamento; troca de seringas e salas de uso; usuário não é preso | menos dependência e mortes | ocupa a rede de saúde |
| 6 | Liberação dos jogos | jogos | tradicional a libertário | escada acima | abre mercado legal | mais apostas |
| 7 | Imposto dos jogos | jogos | esquerda | taxa o que é legal | dinheiro, menos apostas | imposto alto empurra para sites de fora |
| 8 | Monopólio do Estado | jogos | esquerda | só o Estado explora | o lucro vai para o cofre | parte aposta em sites de fora |
| 9 | Licenças de apostas | jogos | direita e libertário | empresas exploram com licença | imposto e concorrência | mais apostas |
| 10 | Proteção do apostador | jogos | esquerda | limite de depósito, autoexclusão, sem cartão de crédito | menos famílias endividadas | quem foge das regras vai para o ilegal |
| 11 | Propaganda e embalagem | os dois | esquerda e tradicional | limita anúncio e marca | menos gente começa | indústria, clubes e mídia perdem dinheiro |
| 12 | Fiscalização e repressão | os dois | direita e tradicional | verba para apreender, prender e bloquear sites e pagamentos | encolhe o mercado ilegal | lota presídios, tira liberdade; verba demais vira corrupção |

Colisões: Venda pelo Estado × Lojas licenciadas e Monopólio × Licenças de apostas. A
colisão do jogo vale para a lei inteira: é um "ou". A Liberação cruza a bússola, exceção
pedida pelo autor. A lei 12 se liga à polícia quando a rede de segurança existir.

### Os 3 índices novos

| Índice | O que mede | Empurra |
|---|---|---|
| `dependencia_drogas` | quem tem problema com drogas | piora `saude` |
| `dependencia_jogos` | quem tem problema com apostas | sobe `pobreza` |
| `mercado_ilegal` | o que se vende fora da lei | sobe `corrupcao`, piora `seguranca` |

Quando a Segurança entrar, `mercado_ilegal` fortalece o crime organizado. Os grupos que
cobram cada índice se decidem na avaliação deles.

### A conta de cada turno, por tema

1. **Procura:** sobe com a liberação, cai com o imposto e a propaganda limitada.
2. **Consumo legal:** a procura que acha quem venda. **Liberar sem ninguém vendendo não
   abre mercado:** sem oferta, o consumo legal é zero. Sai da conta, sem condição escrita.
3. **Mercado ilegal:** a procura que sobra, mais o que o imposto alto empurra para fora.
   Cai com a fiscalização, sobe com a corrupção. Vale para o nível 0: proibir bebida e
   cigarro é o maior mercado de todos.
4. **Dependência:** sai do consumo, legal e ilegal; cai com o Cuidado e a Proteção.
5. **Dinheiro:** consumo legal × imposto. O proibido não rende nada.

### Ligações

- **Saúde:** a dependência de drogas aumenta a procura da rede; a fila cresce e o
  `atendimento` cai. O Cuidado usa a capacidade da rede: com hospital lotado, rende pouco.
- **Segurança:** repressão sobre mercado grande sobe `lotacao_presidios`; sobre mercado
  pequeno, quase não sobe.
- **País:** `leis-vigentes.json` declara o nível inicial, com bebida, cigarro e loteria
  já legais e com quem venda, para nada andar sozinho no turno 0.

### O que o motor ganha

Um módulo `motor/vicios`, e a base de imposto de drogas e de jogos em `motor/calculos`.
Os empurrões são linhas em `derivas.json`.

Leis de Educação e Segurança: só quando essas redes forem desenhadas.

## 6. Decisões do autor

Responder todas de uma vez; basta dizer "todas como recomendado" ou só as que mudam.

| # | Decisão | Recomendo |
|---|---|---|
| 1 | Quais esferas viram rede nesta fase | Saúde, Saneamento, Educação e Segurança |
| 2 | Migrar saúde e saneamento antes de criar as novas | Sim: um motor só desde o começo |
| 3 | Educação: o índice novo de vagas, ao lado de `instrucao` | Sim: vagas pela rede; `instrucao` recebe pela deriva e forma os profissionais |
| 4 | Segurança: presídio é a mesma rede da polícia | Sim: duas capacidades numa rede; a lotação sai da conta |
| 5 | Vícios | Fechado pelo autor em 05/nov: 12 leis e 3 índices, seção 5 |

## 7. Ordem da produção e "pronto quando"

| Passo | Pronto quando |
|---|---|
| 1. `motor/rede` e migração de saúde e saneamento | os testes atuais passam sem mudar número |
| 2. Ficha e mapa pelas alavancas | toda lei de rede mostra efeito e dinheiro |
| 3. Rede da Educação | vagas, professores e escola privada agem; profissionais de saúde saem dela |
| 4. Rede da Segurança | polícia e presídios agem; lotação sai da conta |
| 5. Vícios | as 12 leis agem, liberar sem vendedor não abre mercado, e proibir sem fiscalizar gera mercado ilegal |
| 6. Fechamento da fase | `npm run check` verde, tudo visto na tela, GDD e plano atualizados |

**Fica de fora:** números finos (balanço final), Moradia na rede, organizações
criminosas (fase 4).

**GDD depois das decisões:** seção 9 ganha as redes, seção 18 perde o que foi
decidido, e a seção 16 aponta para cá onde fala de obras.
