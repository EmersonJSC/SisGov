# Mecânica 2: Leis

> **Status: VIGENTE.** Define como as leis funcionam no jogo. O status de
> cada mudança de código fica no [PLANO](../../../PLANO.md).
> Escrito com o autor em 21/out/2026. Índice: [mecânicas](README.md). Base técnica:
> [arquitetura/leis-em-tres-niveis.md](../../arquitetura/leis-em-tres-niveis.md).

## 1. O que é

A lei é a única ferramenta do jogador. Ele não constrói nada: aprova,
muda e revoga leis, e são elas que movem a economia, os índices e a
opinião.

**Não existe "lei do Brasil".** A lei é do mundo e vale igual em todo país.
O país só declara quais leis começam em vigor e em que valor.

## 2. Regras

### 2.1 Leis de valor

- Leis com número (alíquota de imposto, gasto com educação, salário
  mínimo, quantas câmeras corporais) têm **controle livre e sem travas**:
  vão de 0% a 100%, ou ao valor que o jogador quiser.
- A tela não marca a faixa "normal" do país nem impede nada. O que segura
  o jogador são as consequências.
- Ao deslizar, o jogador vê em palavras o que muda. Exemplo: imposto de
  renda de 27,5% para 30% mostra "aumento de 9% na alíquota · arrecadação
  de R$ 420 bi para R$ 458 bi/ano".

**Só duas coisas travam um valor:**

1. **A soma dos gastos.** O total gasto pelo governo não passa de
   **100% do PIB**. Para subir um gasto além do que sobra, o jogador reduz
   outro. Exemplo: com 30% do PIB na educação, a segurança vai no máximo a
   70%. Gastar **acima da arrecadação** é permitido e não trava: vira
   déficit, dívida e juros.
2. **Outra lei.** Uma lei pode fixar piso ou teto para outra. Exemplo: a
   Constituição fixa um piso de gasto com educação; enquanto ela estiver
   em vigor, o controle não desce abaixo dele. Para passar, o jogador muda
   primeiro a lei que trava. Já existe no código (`pisoPorLei`): o mínimo
   da verba de saúde e de educação depende da opção da lei constitucional
   do piso (sem vinculação = 0%; vigente = 13,69% e 17,51%).

### 2.2 Leis de escolha

- Usadas só quando o mundo real é discreto (permitido / restrito /
  proibido). No máximo 3 opções, e cada uma diz em uma frase o que
  acontece no jogo.
- **Todas as opções ficam liberadas**, inclusive as extremas, como abolir
  a polícia.
- **Caso a caso**, uma lei de escolha vira lei de valor quando o assunto
  permitir. Exemplo: "ensino superior gratuito ou pago" vira "% do custo
  que o Estado paga".

### 2.3 Como uma lei deve ser

1. **Uma coisa só, concreta.** "Verba para ferrovias", "Vouchers para
   escolas privadas". Nada de "modelo de Estado".
2. **Deslizar antes de escolher.** Se dá para ser faixa, é faixa.
3. **Uma medida só.** Situação atual, nova redação e impacto usam a mesma
   unidade, lado a lado.
4. **Um efeito que o jogador sente.** Toda lei mexe em pelo menos um índice
   ou grupo que aparece na tela.
5. **Lei sem sigla.** O nome de uma lei, de um imposto ou de um programa
   explica o que ele é: "Imposto sobre o consumo", não "IVA"; "Imposto sobre
   a propriedade", não "IPTU"; "Imposto sobre veículos", não "IPVA". Siglas
   que só existem num país (FGTS, PPP, EC 132) também não entram.
   **Organizações conhecidas pela sigla podem aparecer**, sempre com o nome
   real junto na primeira vez: "ONU (Organização das Nações Unidas)",
   "OTAN (Organização do Tratado do Atlântico Norte)". PIB e TV ficam como são.
6. **Bate o olho e entende.** O nome e a descrição dizem o que a lei faz
   em linguagem de quem não estuda leis. Sem jargão jurídico.
7. **Escolha que o jogador vê acontecer.** Nada de "Meios de produção:
   privada · mista · estatal" com um efeito abstrato. O jogador escolhe
   **o quê**: quais setores estatizar ou privatizar (petróleo, energia,
   bancos, correios…), e vê as empresas mudando de mãos.
8. **Separar pelo que se sente.** Um assunto amplo vira várias leis, uma por
   alvo. Tributação: imposto sobre o consumo, sobre a renda das pessoas,
   sobre o lucro das empresas, sobre o patrimônio, sobre heranças…
9. **Nenhum tema é proibido.** Lei polêmica (permitir o suicídio assistido,
   por exemplo) entra se for jogável. O critério é jogabilidade, não tabu.

### 2.4 Os três níveis

| Nível | O que é | Como muda | Custo à vista | No mapa |
| --- | --- | --- | --- | --- |
| **1. Pétrea** | Princípio que define o país: federação, direitos fundamentais, reeleição | Não muda por votação comum | Não | Centro, na Presidência (escudo) |
| **2. Constitucional** | O esqueleto do Estado: ciclo policial, polícia militar, ensino superior gratuito | Emenda constitucional | Raramente; o custo vem das derivadas | No ministério (quadrado) |
| **3. Derivada** | A operação prática: lei ordinária, lei complementar, decreto, medida provisória | Maioria simples, decreto ou MP | Sempre | No ministério (círculo) |

#### Pétrea

- Sem STF na versão atual. Tentar mudar uma pétrea provoca **reação do
  Senado e da população**. _(força e forma da reação: ver seção 5)_
- Pétrea não é revogada como as outras.

### 2.5 Níveis abrem e fecham caminhos

- Cada lei declara de quais outras depende (`requer`). Sem a base exigida,
  a lei fica **bloqueada**: aparece apagada, com cadeado e o motivo, e se
  estava em vigor é revogada, em cascata.
- Exemplo: com o ensino superior **pago pela família**, liberam-se
  "Crédito estudantil" e "Bolsas em faculdades privadas"; com ele
  **gratuito**, liberam-se "Vagas nas universidades públicas" e "Cotas".
- No código: dependência por opção (`src/game/policyRequirements.ts`) e por
  valor (`pisoPorLei` nas leis de verba) já existem.

### 2.6 Em vigor e catálogo

- O mapa mostra só as leis **em vigor**. As outras ficam num **catálogo**,
  aberto por um botão no mapa; as bloqueadas aparecem nele trancadas, com
  o motivo.
- **Aprovar** uma lei do catálogo põe ela no mapa, pelo trâmite do nível
  dela. **Revogar** tira do mapa e devolve ao catálogo.
- Assim o jogador muda o país, e não só ajusta o que já existe: criar uma
  estatal, adotar voto distrital, legalizar uma droga.

### 2.7 Como uma lei muda

_(este trecho vai para a mecânica 3, tramitação e Congresso, quando ela for escrita)_

- **Não há pontos de força política** (como no Democracy 4). Uma lei passa
  se conseguir os votos no Legislativo.
- **O motor é genérico:** cada país declara o próprio caminho
  legislativo (quais casas votam, quóruns, turnos, decreto, veto). O
  motor não conhece nenhum país.

#### Brasil (primeiro país)

| Caminho | Regra |
| --- | --- |
| Emenda constitucional | 3/5 em dois turnos, na Câmara e no Senado |
| Lei complementar | Maioria absoluta: 257 deputados e 41 senadores |
| Lei ordinária | Maioria simples, na Câmara e no Senado |
| Decreto | Sem votação, só para regulamentar o que uma lei já permite |
| Medida provisória | Vale na hora; se o Congresso não confirmar no prazo, caduca e o que havia antes volta. Já existe em `src/game/tramitacao` |

**Versão 2:** o Congresso propõe leis sozinho e o jogador pode vetar.

### 2.8 Custo e efeito

- **Antes de aprovar**, o documento da lei mostra o relatório de impacto
  com números: quanto cada índice muda, em que unidade e o valor atual, em
  dois horizontes ("Próximo turno" e "Em 1 ano"). Mantido como está hoje
  (`src/ui/mapa/Documentos.tsx`).
- **Depois de aprovada**, a lei entra com atraso e faz efeito aos poucos
  (`src/engine/aplicacao-de-atrasos-e-duracao.md`, `resposta-gradual.md`).
- A consequência é **universal**: a mesma lei tem a mesma força em todo
  país. A diferença entre países vem do estado inicial.

### 2.9 Como escrever uma lei nova

**Princípio: jogabilidade primeiro, realidade como base.** O jogo segue
dados e fontes reais, mas não é um modelo empírico. Quando a precisão
atrapalhar a diversão ou a clareza, vence a jogabilidade.

- **Lei inventada é permitida**, desde que tenha **ligação com o mundo
  real**: uma lei, um programa ou um debate que existe ou existiu em algum
  país.
- **Não existe "hipótese"** como marca de conteúdo.
- Fonte real é ponto de partida, não exigência de precisão. Um número
  pode ser arredondado, simplificado ou ajustado.
- Não se gasta tempo buscando a evidência perfeita. Referência razoável e
  efeito que faz sentido no jogo bastam.
- Nada é copiado do Democracy 4 nem do Victoria 3.

#### Exemplo: segurança

| Nível | Lei | Controle |
| --- | --- | --- |
| Pétrea | Pacto federativo na segurança | Polícias com os governadores · federalizada |
| Pétrea | Garantias fundamentais | Proíbe tortura, pena de morte e execução sumária |
| Constitucional | Ciclo policial | Dividido · completo |
| Constitucional | Natureza da polícia de rua | Militar · civil |
| Derivada | Lei de drogas | Guerra às drogas · descriminalizar o uso · regular e tributar |
| Derivada | Posse e porte de armas | Faixa de proibir a armamento civil |
| Derivada | Câmeras corporais (decreto) | R$/ano |
| Derivada | Verba da Polícia Federal | R$/ano |

## 3. Entradas e saídas

- **Lê:**
  - orçamento (mecânica 4): quanto do PIB já está gasto, para a trava de 100%;
  - bússola (mecânica 10): quais leis o país permite propor;
  - estado inicial do país: leis em vigor e valores de partida.
- **Entrega:**
  - para a tramitação (mecânica 3): o projeto, com o nível e o caminho;
  - para a rede (mecânica 5): o valor da lei em vigor, que move os nós;
  - para os grupos (mecânicas 8 e 9): a lei que cada grupo vigia;
  - para a tela: o relatório de impacto antes de aprovar.

## 4. No código

| O quê | Onde |
| --- | --- |
| As 242 leis do mundo | `src/conteudo/mundo/leis/*.json` e `catalogo-leis.json` |
| Leis em vigor no Brasil | `src/conteudo/paises/brasil/leis.json` |
| Estado e regras de cada lei | `src/game/leis/` |
| Leitura das regras do conteúdo | `src/game/policyRulesFromContent.ts` |
| Dependência entre leis e pétreas | `src/game/policyRequirements.ts` |
| Validar, confirmar e implantar a mudança | `src/game/validatePolicyAction.ts`, `commitPolicyAction.ts`, `advancePolicyImplementation.ts` |
| Fachada para a tela | `src/app/partida/leis.ts` |
| Documento da lei e relatório de impacto | `src/ui/mapa/Documentos.tsx` |

**O que muda na implementação da versão 1:**
- tirar os limites por lei e por país, e o teto de 3×/4× do controle;
- criar a trava da soma dos gastos (100% do PIB);
- tirar o teto de 40% dos pisos de saúde e educação;
- criar a reação do Senado e da população a uma pétrea (sem STF);
- converter leis de escolha em valor, caso a caso.

## 5. Em aberto

- Força e forma da reação quando o jogador tenta mudar uma pétrea.
- Quais leis de escolha viram leis de valor.
