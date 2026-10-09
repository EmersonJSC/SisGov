# Plano de fechamento — SG057-B, SG058-A/B e SG059

Data: 9 de outubro de 2026. Este plano transforma os quatro chamados em uma
sequência de entregas verificáveis. Ele não muda o contrato de que leis e
parâmetros vivem no conteúdo: o motor só executa mecanismos suportados.

> **Mudança de estratégia — 9 de outubro de 2026.** Os quatro chamados não
> serão mais perseguidos como entregas isoladas. Eles descrevem etapas do mesmo
> percurso político e a tentativa de concluí-los separadamente revelou uma
> dependência circular artificial. A unidade de entrega passa a ser o percurso
> mínimo abaixo. Os IDs continuam registrando responsabilidade e aceite, mas
> só serão atualizados para concluídos quando o percurso demonstrar sua parte.

## Percurso mínimo de aceitação

Partindo de `estado-inicial-brasil`, executar em uma única bancada de integração:

1. **Intenção:** o jogador escolhe alterar uma política; SG059 valida domínio,
   requisitos, incompatibilidades e rota, sem mutar nem sortear.
2. **Rota:** ajuste já autorizado muda a meta executiva; mudança que exige o
   Legislativo cria proposta. SG059 e SG057-B compartilham esta fronteira.
3. **Tramitação e voto:** a proposta é apresentada, abre no prazo, amostra votos
   a partir da bancada e do gerador salvo e é aprovada ou rejeitada. SG057-B
   fornece quórum, pesos e prazo; SG058-B fornece a decisão de adiamento.
4. **Efeito político:** somente uma proposta aprovada altera a implantação; as
   relações JSON recalculam o apoio de grupos a partir da base. SG058-A prova
   que não há dupla contagem, inclusive após repetir o passo ou retirar efeito.
5. **Eleição:** candidaturas recebem apoio explícito; Presidência e Senado são
   apurados pela lei eleitoral vigente. O resultado troca somente as cadeiras
   vencidas depois do fechamento. SG058-B responde com novo mandato ou derrota.
6. **Próxima decisão:** a nova composição é usada pela próxima votação. Isso
   prova que o ciclo fechou, não apenas que suas funções existem isoladamente.

Dois roteiros obrigatórios atravessam esse mesmo percurso: uma proposta popular
rejeitada por bancada insuficiente e uma proposta impopular aprovada por bancada
suficiente. Ambos devem preservar estado aleatório, política anterior em caso de
rejeição, efeitos sociais rastreáveis e soma eleitoral sem duplicação.

**Fronteira:** essa bancada integra exclusivamente o percurso político. A
confirmação atômica de meses, finanças e ocorrências continua SG061; ela receberá
este percurso como uma operação já demonstrada, em vez de redefinir as regras.

## Resultado de aceite

Ao final, uma partida criada pelo pacote Brasil poderá:

1. validar uma escolha contra requisitos, conflitos, autorização e rota
   institucional;
2. apresentar e votar uma proposta sem consumir sorteio fora da confirmação;
3. transformar efeitos declarados de políticas e indicadores em contribuições
   rastreáveis aos perfis sociais, sem acumular o mesmo efeito a cada mês;
4. apurar Presidência e Senado usando a lei eleitoral constitucional vigente;
5. persistir no `GameState` os resultados, contribuições e estado aleatório
   necessários para repetir a mesma confirmação.

Isso é o fechamento de domínio dos quatro chamados. A transação do trimestre
inteiro continua sendo SG061 e a tela final continua em SG065–SG072. Não
marcaremos os chamados como concluídos por terem apenas contrato ou testes
isolados: o aceite exige carga pelo pacote, operação sobre a partida e testes.

## Ordem e divisões de responsabilidade

### Bloco 1 — SG057-B: regras políticas executáveis

1. Consolidar as regras já documentadas numa configuração tipada: instituições,
   quóruns, prazo de proposta, tipos de autorização e regra eleitoral vigente.
2. Implementar a apuração parlamentar que já existe como uma operação de estado:
   proposta aberta -> cálculo de probabilidades -> amostra determinística ->
   aprovação ou rejeição. A fórmula é a média ponderada
   `(base × pesoBase + afinidade × pesoAfinidade + opinião × pesoOpinião) /
somaDosPesos`; todos os componentes e pesos vêm do conteúdo.
3. Proibir empate como aprovação parlamentar. Para eleição, reservar sorteio d20
   somente quando houver empate na maior votação; cada novo d20 é extraído do
   gerador salvo e registrado no resultado.
4. Conservar Senado e Presidência como regras declaradas por leis constitucionais,
   nunca como `if (brasil)`. A Presidência seleciona a candidatura de maior total
   nacional; o Senado apura cada UF pelas vagas, divisores e mandatos declarados.
5. Registrar a fronteira explícita de campanha. A V1 não pode ter cinco turnos
   "vazios" fingindo ser campanha: ou as ações terão catálogo JSON mínimo e
   efeitos/testes, ou serão removidas deste aceite e mantidas como chamado
   posterior, sem bloquear a eleição.

### Bloco 2 — SG058-A: reação de grupos e preferência partidária

1. Acrescentar ao conteúdo os perfis agregados, grupos, associações ponderadas,
   preferência-base, coalizões e relações `política -> grupo` e
   `política -> indicador -> grupo`.
2. Validar IDs, unidades, mecanismos, pesos finitos não negativos, vetores que
   somam 100 e escolha explícita da origem da preferência. Associação ausente é
   erro; associação vazia é válida e produz reação zero.
3. Para cada parcela, normalizar usando **todos** os pesos da parcela:
   `contribuição = Σ(pesoDoGrupo / somaDosPesos × efeitoDoGrupo)`. Grupo não
   afetado ainda fica no denominador. Guardar cada contribuição por
   `relação + origem + alvo`; recalcular a fotografia corrente substitui a
   contribuição anterior, não a soma ao mês anterior.
4. Somar base e contribuições antes da saturação `[0, 100]`. Assim, `99 + 2`
   mostra `100`, mas ao retirar `2` volta a `99`.
5. Aplicar a mudança da coalizão e compensar os partidos elegíveis do lado oposto
   proporcionalmente aos pesos de referência. Se a soma de referência for zero,
   dividir igualmente; se não houver destinatário, devolver diagnóstico em vez
   de dividir por zero.
6. Produzir diário explicável: relação, origem, grupo, valor em pp e mês de
   ativação. Testar estabilidade, retirada parcial, sobreposição, ordem dos IDs
   e restauração.

### Bloco 3 — SG058-B: candidaturas, apuração e resposta institucional

1. Definir estado de eleição, candidaturas e apoios explicitamente. Partido só
   transfere seu apoio integral à chapa que declarou apoiar; aliança de governo
   não transfere voto por inferência.
2. Apurar a Presidência a partir das preferências agregadas das parcelas, sem
   duplicar eleitor por pertencer a mais de um grupo. Aplicar a lei vigente e o
   desempate d20 somente se o maior total empatar.
3. Apurar o Senado por UF com a regra constitucional selecionada, registrar
   cadeiras e vencimentos e realizar a troca no turno posterior: a composição
   anterior vota até o fechamento da eleição.
4. Aplicar resposta institucional: vitória presidencial abre mandato preservando
   país, dívida, implantação e mandatos; derrota termina a V1. A coordenação
   atômica de todos os passos continua SG061, mas a operação isolada deverá ser
   pura e testável.

### Bloco 4 — SG059: porta única de validação

1. Criar um validador de intenção de ação que recebe estado da partida, definição
   de política e comando. Ele devolve `aceita`, `rejeita` ou `exige-proposta`,
   sempre com motivos tipados.
2. Conferir requisitos de leis, incompatibilidades, instituição/autorização,
   opções permitidas, proposta pendente, prazo e conflito de alteração sobre a
   mesma política.
3. Encaminhar ajuste coberto por autorização para a rota executiva; criar
   proposta para alteração que exige Parlamento. Popularidade baixa entra no
   cálculo político, mas nunca vira bloqueio automático.
4. Garantir que validação e prévia não mutem partida, não consumam aleatoriedade
   e não criem efeitos. Só a confirmação muda estado.

## Provas de aceite e documentação

Cada bloco terá testes unitários de cálculo, testes de pacote inválido e ao menos
um teste de integração `JSON -> createGame -> ação -> novo GameState`. O registro
de cada incremento incluirá arquivos alterados, fórmula/precedência usada,
cenário exercitado e comando de verificação. Antes do aceite final executaremos
`npm test`, `npm run check`, `npm run build` e `git diff --check`.

## Decisões confirmadas em 9 de outubro de 2026

1. Campanha detalhada fica fora destes quatro chamados. A janela poderá existir
   no calendário futuro, mas não terá ações vazias, custos ou efeitos escondidos.
   Um chamado próprio definirá seu catálogo JSON quando esse recorte for iniciado.
2. O primeiro Brasil usa partidos, grupos, pesos e preferências pequenos e
   explicitamente marcados como `hipotese`. Eles validam jogabilidade e não são
   apresentados como pesquisa, partido ou resultado eleitoral real.

## Registro de implementação

Primeiro incremento, em 9 de outubro:

- `socialSupport.ts` calcula cada contribuição com a soma de todos os pesos do
  perfil no denominador e recompõe o apoio a partir da base; uma relação ausente
  é removida, portanto não há acúmulo mensal indevido.
- A redistribuição conserva uma soma de 100 pontos entre coalizão e oposição,
  preserva proporções e usa pesos de referência ou divisão uniforme quando um
  lado começa em zero.
- `elections.ts` implementa pluralidade nacional e maiores quocientes; o d20
  é chamado somente em empate e o `commitElection.ts` só aceita um empate
  preparado pelo estado aleatório corrente.
- O estado inicial do Brasil passou a declarar perfis e preferências hipotéticos;
  a validação rejeita partido/grupo repetido, peso inválido e vetor que não soma 100. `createGame` calcula e guarda sua base partidária sem alterar o JSON.
- `validatePolicyAction.ts` é a porta sem mutação da SG059; ele verifica nível,
  requisitos, exclusões e proposta aberta e roteia para execução ou proposta.
  `commitPolicyAction.ts` aplica somente a rota já validada em novo snapshot.

Os testes focados cobrem os cálculos, efeitos estáveis e removidos, extremos de
redistribuição, d20, rejeição de snapshot aleatório errado e as duas rotas de
ação. A integração da relação JSON ativa com o fechamento do turno ainda deve
ser feita no coordenador SG061; não é declarada concluída por este registro.
