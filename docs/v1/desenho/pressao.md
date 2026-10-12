# Grupos de pressão (V1-09)

**Status:** PARA APROVAÇÃO. O código só começa depois do seu ok.

## 1. O que existe hoje (medido em 12/out)

- **Não há grupo de pressão no motor.** `politica.json` tem 4 "grupos"
  antigos (trabalhadores, cuidadoras, jovens, empreendedores) que só servem
  à eleição antiga.
- **Já há ações soltas, sem ator.** Eventos como greve dos servidores,
  ocupação de terras, panelaço, corrida contra a moeda, ataques de facção e
  milícia toma o bairro disparam por chance e por um índice (ex.: greve se
  `grupo_servidores` < 40). Ninguém "decide" a ação, e ela não para quando
  o governo atende.
- **Situações com histerese** (V1-07): surgem quando a pressão passa de
  `entrada` e só acabam quando cai a `saida` ou menos. Greve geral, greve de
  professores e protestos já são situações.
- **Gatilho dos eventos:** chance por turno, condição, e `fatores` que
  multiplicam a chance numa faixa de um índice (ex.: chance × 3 quando a
  classe média vai de 45 a 20 de satisfação).

## 2. Métodos atuais

- **Repertório de ação** (Tilly, *From Mobilization to Revolution*, 1978;
  *Contentious Performances*, 2008): cada ator tem um conjunto pequeno de
  ações que sabe fazer (o sindicato faz greve, o movimento por terra ocupa) e
  escala dentro dele: campanha, depois ato, depois greve ou ocupação.
- **Mobilização de recursos** (McCarthy e Zald, 1977): insatisfação não basta;
  quem tem dinheiro, gente organizada e acesso à mídia age mais e com mais
  efeito. Grupos pequenos e concentrados se organizam com mais facilidade
  que grupos grandes e difusos (Olson, *A lógica da ação coletiva*, 1965).
- **Limiar** (Granovetter, 1978): cada grupo entra em ação quando a
  insatisfação passa do limite dele, e o limite muda de grupo para grupo.
- **Rebelião por queixa e risco** (Epstein, PNAS 2002): o agente age quando
  queixa (privação × falta de legitimidade) menos o risco de ser punido passa
  do limiar. Dá a ideia de que a legitimidade do governo e a repressão também
  mexem na mobilização, não só a insatisfação.
- **Ciclos de protesto** (Tarrow, *Power in Movement*): a mobilização sobe e
  desce em ciclos; quem desmobiliza não volta no mês seguinte. No motor isso
  já existe: a histerese das situações.

## 3. Proposta

### 3.1 Mobilização = uma situação por grupo

Cada grupo vira um nó `pressao_<grupo>` do tipo **situação**, sem mecanismo
novo no motor:

- **Pressão** = insatisfação da base: `Σ peso × (100 − satisfação)` dos
  segmentos que o grupo representa (pesos somando 1). Mais as leis que tocam
  o interesse do grupo (ex.: câmeras corporais para associações de
  policiais) e, para quem não tem base no eleitorado (facções, povos
  originários), índices.
- **Mobiliza** com pressão ≥ `entrada` = **60** (a base com satisfação 40 ou
  menos). **Desmobiliza** com pressão ≤ `saida` = **50** (a base com
  satisfação 50 ou mais: foi atendida). Entre os dois, fica como estava.
- **Intensidade** enquanto mobilizado = pressão − 50, que é o valor da
  situação no mapa.
- O país não declara valor para esses nós: sem contexto, quem está
  mobilizado no turno 0 é o que a base diz.

Com o limite comum 60/50 e a satisfação de jan/2025 (V1-08), a conta dá
mobilizados no turno 0: confederação da indústria (60,8), comércio e
serviços (62), agronegócio (62), mercado financeiro (60,2) e grandes grupos
de mídia (60,2). Logo abaixo: frentes evangélicas (59,3) e associações de
policiais (58,8). Os movimentos sociais ficam entre 42 e 49. Facções e
povos originários não têm base: a pressão deles vem de índices, e proponho
calibrar as facções para começar mobilizadas, porque o crime organizado age
hoje.

### 3.2 Recursos

Cada grupo tem quatro recursos, de 1 a 3: **gente** (quantos pode pôr na
rua), **dinheiro**, **mídia** (acesso à pauta) e **força** (capacidade de
parar serviço essencial ou usar violência). O recurso entra como
multiplicador no efeito da ação que usa aquele recurso. Exemplo: a greve
usa gente; a campanha na mídia usa dinheiro e mídia.

### 3.3 Ações = eventos com o grupo como ator

Cada ação do repertório é um evento ligado ao grupo:

- **Condição:** o grupo está mobilizado (`pressao_<grupo>` > 0).
- **Chance:** uma base por turno, multiplicada pela intensidade (fator de 1 a
  3 entre intensidade 0 e 30), o mesmo `fatores` que os eventos já usam.
- **Escala:** as ações leves (campanha, ato) disparam com qualquer
  intensidade; as pesadas (greve, ocupação, fuga de investimento, ataque) só
  com intensidade 10 ou mais.
- **Efeito** em índice e na aprovação do governo, multiplicado pelo recurso.
  Quando o capital político existir (V1-10), as ações passam a gastar o
  capital em vez da aprovação.
- **Reaproveita os eventos que já existem**, trocando o gatilho solto pelo
  ator: greve dos servidores, ocupação de terras, panelaço, corrida contra a
  moeda, ataques de facção, milícia toma o bairro. Os outros são novos.

### 3.4 Os 20 grupos

| Grupo | Base (peso) | Também reage a | Recursos (gente, dinheiro, mídia, força) | Ações |
| --- | --- | --- | --- | --- |
| Centrais sindicais | trabalhadores 0,6; informais 0,2; pobres 0,2 | legislação trabalhista, salário mínimo | 3, 2, 1, 2 | campanha, ato, greve geral |
| Sindicatos de servidores | servidores 1 | estabilidade, reajuste | 2, 2, 1, 3 | ato, greve de servidores, greve de professores |
| Associações de aposentados | aposentados 1 | idade mínima, reajuste de benefícios | 2, 1, 1, 1 | campanha, ato |
| Confederação da indústria | empresários 0,8; trabalhadores 0,2 | tarifas, juros, imposto das empresas | 1, 3, 3, 1 | campanha na mídia, fuga de investimento |
| Entidades do comércio e serviços | pequenos empreendedores 0,6; empresários 0,4 | imposto sobre consumo, regime simplificado | 1, 2, 2, 1 | campanha na mídia, fechar portas |
| Entidades do agronegócio | agronegócio 1 | código florestal, agrotóxicos, terras indígenas | 2, 3, 2, 2 | campanha na mídia, tratoraço, fuga de investimento |
| Mercado financeiro | ricos 0,5; empresários 0,5 | risco país, juros, regra fiscal | 1, 3, 3, 1 | campanha na mídia, corrida contra a moeda |
| Movimentos por terra | agricultura familiar 0,6; pobres 0,4 | reforma agrária | 3, 1, 1, 2 | ato, bloqueio, ocupação de terras |
| Movimentos por moradia | periferias 0,6; pobres 0,4 | habitação popular, déficit habitacional | 3, 1, 1, 1 | ato, ocupação urbana |
| Movimento estudantil | jovens 0,7; progressistas 0,3 | acesso ao ensino superior, piso da educação | 3, 1, 2, 1 | ato, ocupação de escolas |
| Movimento negro | pobres 0,4; periferias 0,3; progressistas 0,3 | ações afirmativas, letalidade policial | 2, 1, 2, 1 | campanha, ato |
| Movimento feminista | progressistas 0,7; famílias com filhos 0,3 | aborto, igualdade salarial, violência doméstica | 2, 1, 2, 1 | campanha, ato |
| Movimento LGBT | progressistas 0,7; jovens 0,3 | casamento e união civil, discriminação | 2, 1, 2, 1 | campanha, ato |
| Movimento ambientalista | ambientalistas 1 | desmatamento, licenciamento | 2, 1, 2, 1 | campanha, ato, bloqueio |
| Povos originários | (nenhuma) | terras indígenas, desmatamento, conflitos fundiários | 1, 1, 2, 2 | ato, bloqueio, retomada de território |
| Frentes evangélicas | evangélicos 0,7; conservadores 0,3 | leis de costumes | 3, 2, 2, 1 | campanha, mobilização de fiéis |
| Hierarquia católica | católicos 0,7; pobres 0,3 | aborto, eutanásia, fome | 2, 1, 2, 1 | campanha, mobilização de fiéis |
| Associações de policiais e militares | conservadores 0,6; servidores 0,4 | câmeras corporais, ciclo policial, previdência | 2, 1, 1, 3 | operação padrão, greve branca |
| Grandes grupos de mídia | ricos 0,5; empresários 0,5 | regulação das redes, liberdade de imprensa | 1, 3, 3, 1 | pauta negativa |
| Facções e milícias | (nenhuma) | repressão (polícias, penas, vagas em presídio) e Estado fraco (capacidade estatal baixa) | 2, 2, 1, 3 | ameaça, ataque, domínio de bairro |

Notas:

- **Pauta negativa** (mídia): enquanto dura, os eventos ruins pesam mais na
  aprovação. Versão 1: a ação derruba a aprovação e sobe a polarização; o
  "aumenta o efeito das crises" de verdade fica para quando houver capital.
- **Facções** reagem ao contrário dos outros: a pressão sobe com a repressão
  (mais polícia e pena) e também quando o Estado recua (capacidade estatal
  baixa), como diz o `conteudo.md` 3.2.
- **Movimento negro** não tem segmento próprio no eleitorado (o V1-08 não
  tem eixo de raça); a base é uma aproximação por renda e território.

### 3.5 Patrocínio (ideia sua de 12/out)

Empresas, setores e países estrangeiros financiam atores. Proposta para a
versão 1: cada grupo pode ter **financiadores** (um segmento ou um índice,
como "exportações" para um país estrangeiro). Quando uma lei ameaça o
interesse de quem paga, a pressão do grupo financiado sobe, mesmo com a
base satisfeita. O jogador vê "financiado por: ?" até uma investigação
revelar. A investigação (CPI, Polícia Federal) é do capital político e das
instituições, então a revelação fica para depois; nesta etapa entra só o
efeito.

## 4. Tela

- **Jornal:** a ação sai como manchete com o nome do grupo ("Centrais
  sindicais convocam greve geral"), como os eventos já saem.
- **Painel:** uma aba "Pressão" ao lado do "Eleitorado", com os 20 grupos,
  a barra de pressão (com os traços de 50 e 60) e a última ação de cada um.

## 5. Aceite (do chamado, com o que o teste confere)

- Grupo se mobiliza quando a base passa do limite de insatisfação e
  desmobiliza quando é atendida: baixar a satisfação dos servidores leva os
  sindicatos de servidores a mobilizar; subir de novo até 50 desmobiliza; no
  meio do caminho (entre 50 e 60), continua como estava.
- Cada ação tem efeito em índice ou capital: o teste percorre as ações dos 20
  grupos e confere que toda ação tem ao menos uma ligação para um índice (ou
  para a aprovação, até o V1-10).

## 6. Decisões para você

1. **Mobilização como situação** (sem mecanismo novo), com o limite comum
   60/50? Recomendo sim. A outra opção é um limite por grupo, que exige um
   número por grupo de alguma fonte.
2. **Mobilizados no turno 0:** indústria, comércio, agro, mercado, mídia e
   facções (evangélicos e policiais por pouco fora). Faz sentido para
   jan/2025?
3. **Reaproveitar os eventos que já existem** como ações dos grupos?
   Recomendo sim, para não ter duas greves de servidores.
4. **Patrocínio:** só o efeito agora e a revelação depois (recomendo), ou
   deixar tudo para depois?
5. **Tabela da seção 3.4:** algum grupo com a base, os recursos ou as ações
   errados?

## Fontes

- Tilly, C. (1978). *From Mobilization to Revolution.* Addison-Wesley.
- Tilly, C. (2008). *Contentious Performances.* Cambridge University Press.
- McCarthy, J. D.; Zald, M. N. (1977). *Resource mobilization and social
  movements: a partial theory.* American Journal of Sociology 82(6).
- Olson, M. (1965). *The Logic of Collective Action.* Harvard University
  Press.
- Granovetter, M. (1978). *Threshold models of collective behavior.*
  American Journal of Sociology 83(6).
- Epstein, J. M. (2002). *Modeling civil violence: an agent-based
  computational approach.* PNAS 99 (supl. 3).
- Tarrow, S. (1998). *Power in Movement.* Cambridge University Press.
