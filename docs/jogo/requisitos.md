# SisGov — Requisitos

> O que o jogo pronto precisa ter, tirado do [GDD](gdd.md), e **como cada
> mecânica se constrói**. Refeito em 12/nov/2026 e atualizado em 13/nov com a
> remontagem (instituições no lugar das esferas, caixas livres, tela inicial em
> passos, mapa orgânico) e as decisões do autor do mesmo dia. A ordem de construir
> está no fim e no [plano](plano-de-desenvolvimento.md); a arquitetura, em
> [arquitetura.md](arquitetura.md).
>
> **14/nov:** o GDD foi refeito por mecânica (Partes 1 a 9). Os números R
> não mudam; cada bloco abaixo diz em que parte do GDD está.
>
> **Status:** ✅ feito · ◐ parcial · ☐ falta. Medido no código em 13/nov.
>
> **Planilhas:** `docs/jogo/leis.xlsx` é o acervo; `docs/jogo/gdd.xlsx` é o que
> estamos construindo, já com mecânica (GDD, cabeçalho).
> Requisito novo só entra depois de decidido no GDD (seção 18).

## Como ler a construção

Cada sistema traz um bloco **Construção** com as mesmas 6 perguntas de
desenvolvedor:

1. **Dados:** de que aba da planilha vem, e para qual JSON o exportador manda.
2. **Estado:** o que o motor guarda de turno a turno.
3. **Módulo:** a pasta do motor que cuida disso (arquitetura, seção 4).
4. **Turno:** em que etapa roda.
5. **Fatos:** o que avisa aos outros e o que ouve deles.
6. **Tela e teste:** o que o jogador vê; o que o teste confere (direção, não número).

**Módulo** é uma pasta do motor com uma tarefa só e uma porta de entrada
(`index.ts`). Serve para mexer numa mecânica sem quebrar as outras: o
Congresso não sabe como a mídia funciona, só ouve o fato "manchete contra".

**Fato do turno** é um aviso que um módulo deixa no turno ("lei aprovada",
"decreto derrubado", "programa formado"). Quem se importa lê. É o que liga
Congresso, mesa, mídia, programas e grupos sem um chamar o outro.

## Resumo

| Sistema (GDD)          | ✅     | ◐      | ☐      |
| ---------------------- | ------ | ------ | ------ |
| 4. Partida e turno → Parte 1 nova (14/nov, abaixo) | — | — | — |
| 5. Partido             | 0      | 0      | 5      |
| 6. Governo             | 8      | 10     | 8      |
| 7. Leis e programas    | 13     | 6      | 2      |
| 8. Bússola             | 4      | 1      | 1      |
| 9. Índices             | 4      | 2      | 2      |
| 10. Contas             | 3      | 1      | 3      |
| 11. População e grupos | 5      | 3      | 11     |
| 12. Congresso          | 12     | 2      | 5      |
| 13. Eleição            | 4      | 2      | 5      |
| 14. Mídia              | 1      | 1      | 8      |
| 15. Mundo              | 2      | 1      | 8      |
| 16. Economia           | 4      | 4      | 31     |
| 17. Tela e mesa        | 11     | 8      | 5      |
| **Total**              | **80** | **43** | **95** |

---

## Parte 1. O jogo (refeita em 14/nov)

> Requisitos tirados do GDD, Parte 1 (1.1 a 1.5), e veredito da auditoria do motor de 14/nov. O texto completo (Entra, Sai, Aceite, Extremos, Depende de) e a prova de cada veredito estão em [`auditoria/`](auditoria/) (`parte-1-requisitos-*.md` e `parte-1-auditoria-*.md`). Substitui o antigo bloco 4 (R4.1 a R4.12). Veredito: CERTO · PELA METADE · ERRADO · FALTA · NÃO SE APLICA.

### 1.1 Visão (CERTO 1, FALTA 4, PELA METADE 10)

| ID | Regra | R antigo | GDD | Veredito | Onde |
| --- | --- | --- | --- | --- | --- |
| JOGO-1.1-01 | Quando o partido do jogador deixa de ocupar o poder federal, inclusive quando o vice de outro partido assume a Presidência, o motor encerra a partida e abre o placar final. | R4.4 | L151–L152 | PELA METADE | `motor/turno/etapas/eleicao.ts:311`, `motor/turno/index.ts:84-85` |
| JOGO-1.1-02 | Ao fim de cada turno, o motor grava no histórico do governo o valor de cada índice, o que melhorou, o que foi mais atacado, e os pops que mais gostaram e que mais odiaram. | R4.7 | L153–L153 | FALTA | `motor/turno/index.ts:42` |
| JOGO-1.1-03 | A cada 4 anos de partida (24 turnos), o motor monta o resumão do histórico e o entrega como dado à tela. | R4.7 | L153–L153 | FALTA | `motor/eleicao/index.ts:26`, `motor/governo/index.ts:140` |
| JOGO-1.1-04 | Ao fim da partida, o motor entrega como placar final o histórico completo do governo, sem nota única. | R4.7 | L153–L153 | FALTA | `motor/eleicao/index.ts:35-49`, `tela/mapa/ResultadoDoTurno.tsx:116` |
| JOGO-1.1-05 | Quando o presidente, um ministro ou um candidato deixa o cargo, o partido do jogador segue como o jogador e a partida continua enquanto ele ocupar o poder federal. | novo | L136–L136 | FALTA | `motor/judiciario/index.ts:604`, `motor/governo/index.ts:187-217` |
| JOGO-1.1-06 | Quando uma pessoa do partido age (erra, brilha, trai ou morre), o motor decide pela ficha dela e pelo estado do país. | novo | L129–L129 | PELA METADE | `motor/governo/ministerios.ts:82-85`, `motor/governo/orgaos.ts:155-159` |
| JOGO-1.1-07 | Quando uma lei vai a voto, o resultado sai de grupos e mídia juntos, com o Congresso como voz dos grupos, e o jogo não deixa a aprovação difícil a ponto de travar o jogador. | R12 (Congresso), sem número preciso | L128–L128 | PELA METADE | `motor/politica/voto.ts:148-200`, `voto.ts:166-170` |
| JOGO-1.1-08 | Quando um pop avalia uma lei, o gosto sai do efeito dela no bolso do pop (peso maior), da distância na bússola e da memória, e nenhuma lei é neutra na bússola. | novo | L132–L132 | PELA METADE | `motor/grupos/index.ts:157-179`, `governo/index.ts:140-150` |
| JOGO-1.1-09 | Quando o jogador passa o turno sem propor nada, o motor ainda abre e fecha empresas, a mídia reage e os outros países mudam de posição. | novo | L131–L131 | PELA METADE | `motor/turno/index.ts:79`, `etapas/economia.ts:104` |
| JOGO-1.1-10 | Quando o Estado financia uma obra, o prédio só é construído pela construção civil da economia, nunca pelo Estado direto. | novo | L137–L137 | PELA METADE | `motor/turno/etapas/obras.ts:21-42`, `motor/saneamento/index.ts:159-170` |
| JOGO-1.1-11 | Quando um índice piora, o motor guarda junto a causa (lei, fato ou índice que empurrou), para a tela mostrar por quê. | novo | L141–L141 | PELA METADE | `motor/efeitos/index.ts:15-25`, `partida/tiposVisao.ts:277-279` |
| JOGO-1.1-12 | Toda lei com valor é entregue ao jogador como régua com número, e não como duas ou três opções em palavras. | R7.1 | L146–L146 | PELA METADE | `motor/leis/tipos.ts:100-147`, `motor/leis/validar.ts:344-346` |
| JOGO-1.1-13 | Quando o jogador escolhe o país, o motor oferece as 10 maiores economias, com empresas, pessoas e direitos autorais reais de fora. | R4.3 | L154–L154 | PELA METADE | `partida/paises.ts:36-39` |
| JOGO-1.1-14 | Quando a chapa é montada, o motor calcula o lado do partido pela média da bússola das pessoas da chapa, sem o jogador escolher lado. | R4.8 | L156–L156 | CERTO | `partida/comeco.ts:80-88`, `motor/pessoas/ministros.ts:105-118` |
| JOGO-1.1-15 | Quando o jogador foca uma área na campanha, os pops que priorizam essa área pesam mais na intenção de voto dele. | novo | L147–L147 | PELA METADE | `motor/eleicao/promessa.ts:53-68`, `turno/etapas/eleicao.ts:189-206` |

### 1.2 As 3 mecânicas (CERTO 1, FALTA 2, NÃO SE APLICA 1, PELA METADE 13)

| ID | Regra | R antigo | GDD | Veredito | Onde |
| --- | --- | --- | --- | --- | --- |
| JOGO-1.2-01 | Em cada turno, a Sociedade manda apoio e demanda à Máquina pública, a Máquina pública devolve leis e serviços, e a reação da Sociedade vira entrada do turno seguinte. | novo | L186–L189 | NÃO SE APLICA | `motor/turno/index.ts:54-76` |
| JOGO-1.2-02 | Ao fim do turno, os pops trabalham, consomem e investem, e isso entra como oferta de trabalho, demanda e capital na Economia. | novo | L226–L226 | PELA METADE | `motor/populacao/index.ts:121-170`, `etapas/economia.ts:102-150` |
| JOGO-1.2-03 | Ao fim do turno, as empresas pagam salário, abrem ou fecham vagas e definem preços, e o pop recebe a renda e paga o preço. | novo | L227–L227 | PELA METADE | `motor/mercado/demanda.ts:54-66`, `motor/mercado/emprego.ts:181` |
| JOGO-1.2-04 | Ao fim do turno, a Economia gera os impostos que entram nas contas da Máquina pública, na medida das leis de imposto em vigor. | novo | L228–L228 | CERTO | `motor/turno/etapas/economia.ts:405-413`, `motor/calculos/renda.ts:23-33` |
| JOGO-1.2-05 | Ao fim do turno, a lei em vigor cobra, gasta ou regula, e o resultado entra na Economia como imposto, verba ou regra. | novo | L229–L229 | PELA METADE | `etapas/economia.ts:359-376`, `etapas/populacao.ts:30-57` |
| JOGO-1.2-06 | Ao fim do turno, a instituição entrega serviço, transferência de renda e direito ao pop, na medida da verba que recebeu. | novo | L230–L230 | PELA METADE | `motor/governo/orgaos.ts:121-123`, `rendimento.test.ts:48` |
| JOGO-1.2-07 | Ao fim do turno, a opinião de cada pop vira voto, apoio e protesto, e chega à Máquina pública como pressão sobre leis e eleição. | novo | L231–L231 | PELA METADE | `motor/eleicao/votos.ts:30-53`, `etapas/politica.ts:21-30` |
| JOGO-1.2-08 | Quando o motor calcula a opinião de um pop, soma bolso (peso maior), bússola (peso menor) e memória. | novo | L207–L207 | PELA METADE | `motor/grupos/index.ts:228-247` |
| JOGO-1.2-09 | Toda lei declara o canal por onde chega ao pop (renda, emprego, preço, serviço ou direito) e o motor aplica o efeito por esse canal. | R7.12 | L214–L214 | PELA METADE | `motor/leis/validar.ts:119-137`, `partida/visao.ts:143` |
| JOGO-1.2-10 | O motor guarda, para todo número que o jogador sente, de onde ele veio (lei, fato ou índice), e entrega isso à tela. | novo | L217–L217 | PELA METADE | `motor/efeitos/index.ts:15-25` |
| JOGO-1.2-11 | A lei declara onde mexe no dinheiro e na vida; o motor calcula o gosto de cada pop a partir disso e da bússola, e a lei não guarda lista de quem a apoia. | novo | L215–L215 | PELA METADE | `motor/leis/tipos.ts:80-177`, `motor/grupos/index.ts:157-179` |
| JOGO-1.2-12 | Os módulos de população, leis e economia rodam um turno completo com os outros desligados, e as ligações entre eles vêm do conteúdo das leis. | novo | L219–L219 | PELA METADE | `motor/turno/regras.ts:56-95`, `etapas/mundo.ts:38` |
| JOGO-1.2-13 | Durante a partida, uma organização nasce de um grupo e passa a existir com nome, líder e ação, como camada separada de pop e de grupo. | novo | L220–L220 | FALTA |  |
| JOGO-1.2-14 | Quando a mídia atua, ela lê um fato do turno que já existe e muda como ele chega ao pop, sem criar fato novo. | novo | L195–L195 | PELA METADE | `motor/midia/jornal.ts:103-114`, `motor/midia/index.ts:34-57` |
| JOGO-1.2-15 | Quando comércio, preços de fora ou outros países mudam, o motor aplica o efeito na Sociedade, na Economia e na Máquina pública sem tratar o Mundo como uma das três mecânicas. | novo | L194–L194 | PELA METADE | `motor/mercado/preco.ts:70-88`, `demanda.ts:54-66` |
| JOGO-1.2-16 | Quando uma lei muda o lucro de uma empresa, o preço da ação muda, o patrimônio dos pops que têm a ação muda, e esses pops reagem no voto e no investimento. | novo | L211–L211 | FALTA | `motor/calculos/index.ts:34-60` |
| JOGO-1.2-17 | Toda lei é guardada numa instituição, e a instituição fica com um ministro responsável. | R7.13 | L197–L197 | PELA METADE | `motor/leis/tipos.ts:87`, `validar.ts:49-50` |

### 1.3 Princípios (CERTO 2, ERRADO 2, FALTA 2, NÃO SE APLICA 3, PELA METADE 14)

| ID | Regra | R antigo | GDD | Veredito | Onde |
| --- | --- | --- | --- | --- | --- |
| JOGO-1.3-01 | Toda ação do Estado que mexe em dinheiro, regra ou serviço é executada por uma lei em vigor; sem lei, o Estado não faz. | novo | L252–L252 | PELA METADE | `motor/turno/regras.ts:31-34`, `etapas/economia.ts:409` |
| JOGO-1.3-02 | Toda decisão de governo do jogador é uma lei com bolha no mapa, sem painel de gestão; o painel só mostra dados. | novo | L253–L253 | NÃO SE APLICA |  |
| JOGO-1.3-03 | Decisões do partido (chapa, ministros, coligação, campanha) são escolhas curtas, e o que os outros propõem chega como papel na mesa do jogador. | R17.6 | L253–L253 | PELA METADE | `motor/mesa/index.ts:8-52` |
| JOGO-1.3-04 | Quando o presidente toma uma decisão (Ato ou Operação) pelo clique num país ou companhia, ela tem custo, tempo e reação, e só vale dentro do que as leis permitem. | R7.16 | L254–L254 | PELA METADE | `motor/turno/etapas/congresso.ts:264-270`, `politica/constantes.ts:39-40` |
| JOGO-1.3-05 | Cada tema é dividido em leis menores, e cada lei tem uma escolha de verdade; o molde não aceita lei de controle único com efeito grande. | R7.6 | L255–L255 | FALTA | `motor/leis/validar.ts:163-164` |
| JOGO-1.3-06 | Toda lei declara ganhadores e perdedores entre os pops e as consequências no tempo, e o texto e a cor da lei descrevem sem chamar de boa ou ruim. | novo | L256–L256 | FALTA | `motor/leis/tipos.ts:80-177`, `grupos/index.ts:157-179` |
| JOGO-1.3-07 | Os textos entregues ao jogador não rotulam lei, ator ou resultado como de direita ou de esquerda; o lado aparece só como resultado nos dados. | R4.8 | L256–L256 | NÃO SE APLICA | `motor/fatos/index.ts:59` |
| JOGO-1.3-08 | Todo real gasto, cobrado, desviado ou ganho fora da lei, inclusive no ilegal, vira renda de alguém, circula, fica guardado ou sai do país no mesmo turno. | R10.7 | L257–L257 | ERRADO | `motor/contas/index.ts:85-94`, `motor/turno/index.ts:99-101` |
| JOGO-1.3-09 | Quando dinheiro é desviado, o motor registra quem recebeu e deixa um rastro que pode virar fato do turno. | R6.21 | L257–L257 | PELA METADE | `motor/governo/index.ts:262-270`, `orgaos.ts:22` |
| JOGO-1.3-10 | Todo dinheiro que entra no Estado entra por lei ou por bem do Estado, todo gasto sai por lei ou obrigação, e gastar acima da receita exige dívida ou emissão. | R10.1 | L257–L257 | PELA METADE | `motor/contas/index.ts:60-82`, `regras.ts:31-32` |
| JOGO-1.3-11 | Todo efeito de lei declara o atraso em turnos e chega inteiro ao fim dele, andando do valor antigo ao novo nesse prazo (GDD 1.5). | R4.2 | L258–L258 | CERTO | `motor/efeitos/index.ts:28-31` |
| JOGO-1.3-12 | Toda escolha do jogador muda ao menos um dado visível ao jogador, e passar o turno sem agir é uma escolha válida que o jogador pode fazer sem obrigação. | novo | L259–L259 | PELA METADE | `motor/turno/index.ts:79-82`, `partida/partida.test.ts:27` |
| JOGO-1.3-13 | Frase, manchete e evento são gerados a partir dos valores do turno, e nunca de um texto fixo sem dado por trás. | R7.5 | L260–L260 | PELA METADE | `partida/jornal.ts:42-61` |
| JOGO-1.3-14 | O validador aceita lei inventada se o número está na ordem de grandeza do país, e não exige precisão de dado empírico. | novo | L261–L261 | PELA METADE | `validar.ts:189-200`, `valor.ts:11-12` |
| JOGO-1.3-15 | O motor só lê leis, índices, partidos e mídias como dados do mundo, e o país declara apenas o estado de partida e os rótulos locais. | R4.11 | L262–L262 | CERTO | `etapas/economia.ts:498`, `politica/sessao.ts:50` |
| JOGO-1.3-16 | Quando o jogador propõe uma lei, o Congresso a barra só se for exorbitante; fora isso, o que segura é a consequência, e aprovar não pode travar o jogo. | R12.18 | L263–L263 | ERRADO | `motor/politica/pauta.ts:122-123`, `sessao.ts:174-185` |
| JOGO-1.3-17 | A ação de uma pessoa é calculada pela ficha e pelo estado do país, e não por um roteiro escrito. | novo | L264–L264 | PELA METADE | `ministerios.ts:82-85`, `orgaos.ts:155-160` |
| JOGO-1.3-18 | Toda lei tem um canal (renda, emprego, preço, serviço ou direito) até o pop, e o validador recusa lei sem canal. | R7.12 | L265–L265 | PELA METADE | `validar.ts:120-121` |
| JOGO-1.3-19 | A lei não guarda condição do tipo "se pobreza > X"; o efeito dela muda de sentido pela renda do pop contra a conta dele. | novo | L266–L266 | PELA METADE | `motor/leis/valor.ts:28-38`, `populacao.ts:30-57` |
| JOGO-1.3-20 | A régua de cada lei vai de "nada" a "mais" em um único lado, e cada lado da Bússola tem leis próprias. | novo | L267–L267 | PELA METADE | `leis/valor.ts:20-22`, `leis/colisao.ts:58-62` |
| JOGO-1.3-21 | O texto da lei e de cada opção traz um exemplo do dia a dia, sem jargão, mantendo a régua com número. | R7.5 | L268–L268 | NÃO SE APLICA | `partida/visao.ts:174-248` |
| JOGO-1.3-22 | Cada decisão do jogador tem ao menos um efeito próprio que o jogador sente, e o resultado não depende de um traço de personalidade do jogador. | novo | L269–L269 | PELA METADE | `motor/efeitos/index.ts:15-25` |
| JOGO-1.3-23 | Quando o Congresso está cheio, a lei nova entra na fila e atrasa, e o motor nunca proíbe o jogador de propor. | R12.18 | L270–L270 | PELA METADE | `motor/politica/pauta.ts:96-105`, `constantes.ts:45` |

### 1.4 A partida (CERTO 20, ERRADO 1, FALTA 3, PELA METADE 5)

| ID | Regra | R antigo | GDD | Veredito | Onde |
| --- | --- | --- | --- | --- | --- |
| JOGO-1.4-01 | No começo da partida, o jogador escolhe um país entre os declarados em `conteudo/paises/<id>/`, e o estado inicial, as leis vigentes, o Congresso, os ministérios, os programas de antes e os rótulos vêm dele. | R4.3 | L277–L280, L313 | CERTO | `partida/paises.ts:18`, `paises.ts:27` |
| JOGO-1.4-02 | Na criação do partido, o jogador informa nome e sigla e não escolhe lado, posição nem bússola. | R4.5 | L280 | CERTO | `partida/comeco.ts:22-23`, `comeco.ts:57-58` |
| JOGO-1.4-03 | A sigla do partido do jogador vira o id dele, e a criação recusa uma sigla igual à de outro partido do país. | R4.5 | L308 | CERTO | `comeco.ts:43-49`, `comeco.ts:62-63` |
| JOGO-1.4-04 | Na montagem da chapa, o jogador preenche as vagas de presidente do partido, candidato a presidente e vice com pessoas de qualquer partido do país. | R4.6 | L281 | CERTO | `comeco.ts:25`, `comeco.ts:64-67` |
| JOGO-1.4-05 | Cada partido de onde sai uma pessoa da chapa, que não seja o do jogador, entra na coligação do jogador. | R4.6 | L281 | CERTO | `comeco.ts:101-103`, `comeco.ts:120-126` |
| JOGO-1.4-06 | Quando a chapa fica pronta, a média da bússola das pessoas dela define o lado do partido e os 5 grupos que ele defende. | R4.8 | L307 | CERTO | `comeco.ts:104`, `motor/pessoas/ministros.ts:23` |
| JOGO-1.4-07 | No começo da partida, o partido do jogador entra no Congresso com 6% das cadeiras. | R4.9 | L297, L300 | CERTO | `motor/pessoas/partido.ts:10`, `partido.ts:73-76` |
| JOGO-1.4-08 | No começo da partida, o partido que governava o país vai para a oposição, e o jogador pode, nesse momento, pôr esse partido na coligação. | R4.9 | L297, L299, L300 | CERTO | `comeco.ts:119`, `comeco.ts:124` |
| JOGO-1.4-09 | No começo da partida, a Aprovação do presidente começa no valor que o país declara no estado de partida, sem regra de lua de mel à parte. | R4.9 | L297, L298 | ERRADO | `variaveis.json:597`, `partida/index.ts:435-437` |
| JOGO-1.4-10 | Antes das caixas, o jogador escolhe o tamanho do governo em um de quatro degraus (Enxuto, Clássico, Do país, Inchado), e o degrau define quantas caixas o governo tem. | R6.25 | L282, L301 | CERTO | `partida/gabinete.ts:19-24`, `gabinete.ts:53-64` |
| JOGO-1.4-11 | Depois do tamanho, cada cadeira de ministro recebe uma pessoa sorteada com base na chapa. | R6.26 | L301 | CERTO | `partida/index.ts:292-314`, `motor/pessoas/ministros.ts:44-71` |
| JOGO-1.4-12 | Para cada cadeira, o jogador troca o ministro sorteado por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista. | R6.26 | L301 | CERTO | `tela/inicio/EtapaMinisterios.tsx:127-140`, `EtapaMinisterios.tsx:243` |
| JOGO-1.4-13 | A partida só inicia depois que todas as cadeiras de ministro estão preenchidas, e o passo "Governo" da ordem de construção inclui esses ministros. | R6.26 | L302 | CERTO | `motor/governo/index.ts:82-83`, `partida/index.ts:287` |
| JOGO-1.4-14 | A montagem do começo exige os passos nesta ordem: país, partido, chapa, governo, ministros, iniciar, e cada passo lê o resultado do anterior. | R4.10 | L306 | PELA METADE | `TelaInicio.tsx:32-39`, `TelaInicio.tsx:98-105` |
| JOGO-1.4-15 | A duração do mandato do presidente é a que a lei do país declara, em turnos, e o fim dele marca a eleição. | R4.1 | L304 | CERTO | `motor/eleicao/index.ts:62-75`, `turno/etapas/eleicao.ts:323-326` |
| JOGO-1.4-16 | Quando o partido vence a eleição no fim do mandato, começa um novo mandato com desgaste maior que o anterior. | R4.4 | L304 | PELA METADE | `turno/etapas/eleicao.ts:296-312`, `inicio.ts:315` |
| JOGO-1.4-17 | A cada turno de governo, o desgaste do partido sobe. | novo | L286 | CERTO | `turno/etapas/politica.ts:35`, `motor/eleicao/index.ts:26` |
| JOGO-1.4-18 | Quando o partido do jogador deixa de governar o país, a partida termina e não há vitória final; se o vice de outro partido assume a Presidência, o partido deixou de governar e a partida acaba. | R4.4 | L305, L338 | PELA METADE | `turno/etapas/eleicao.ts:311`, `turno/index.ts:87-88` |
| JOGO-1.4-19 | No fim da partida, o placar entrega quanto tempo o partido governou e o histórico do país que ele deixou, sem nota única (decisão do autor, GDD L152). | R4.7 | L305, L338 | FALTA | `turno/index.ts:101`, `tela/mapa/ResultadoDoTurno.tsx:116` |
| JOGO-1.4-20 | Em cada turno, o jogador propõe quantas leis quiser, e nenhum contador de pontos de ação limita o que ele pode pedir. | novo | L310 | CERTO | `motor/politica/pauta.ts:26-40`, `pauta.ts:94-100` |
| JOGO-1.4-21 | A partida salva sozinha a cada turno, e o menu do brasão permite salvar, carregar e recomeçar. | R17.3 | L292, L309 | CERTO | `tela/App.tsx:74-79`, `App.tsx:19-20` |
| JOGO-1.4-22 | Quando um módulo faz algo que os outros devem saber, ele deixa um fato do turno, e os módulos que se importam o leem sem chamar o módulo de origem. | R4.12 | L290, L315 | PELA METADE | `congresso.ts:153`, `politica.ts:36-40` |
| JOGO-1.4-23 | Ao iniciar, a partida entrega o partido e a chapa ao Partido e à Política, que os usam para a base de grupos e a posição na bússola. | novo | L314 | CERTO | `partida/comeco.ts:93-144`, `partida/index.ts:591-593` |
| JOGO-1.4-24 | Ao iniciar, a partida entrega o governo e os ministros a Leis, que os usa como instituições, ministros e caixas. | novo | L314 | CERTO | `partida/index.ts:556-562`, `index.ts:608` |
| JOGO-1.4-25 | Cada país declara em `conteudo/paises/<id>/` o estado inicial, as leis vigentes, o Congresso, os ministérios, os programas de antes e os rótulos, e o motor não contém nome de lei, partido ou país. | R4.3 | L313 | CERTO | `partida/index.ts:120` |
| JOGO-1.4-26 | No começo da partida, o histórico do país (golpes, crises, guerras, governos, empresas e mídias tradicionais) vem do que o país declara, e os geradores criam o que ele não declara, sem empresa real. | novo | L294 | PELA METADE | `partida/index.ts:317-336`, `index.ts:339-348` |
| JOGO-1.4-27 | Cada pessoa aparece com o perfil de rede social dela, sem rótulo de lado, e a rede é uma só, sem nome, e resume as redes do país. | novo | L284, L285, L303 | CERTO | `partida/perfil.ts:66-77`, `perfil.ts:26` |
| JOGO-1.4-28 | Quando o jogador usa o botão Espiar sobre uma pessoa, as informações pessoais que aparecem dependem da Verba de inteligência e dos Poderes da agência. | novo | L293, L303 | FALTA | `motor/turno/regras.ts:84-91` |
| JOGO-1.4-29 | Cada Espiar fere a privacidade da pessoa e grava uma linha no registro, que pode vazar. | novo | L293, L303 | FALTA | `motor/governo/tipos.ts:16` |

### 1.5 O turno (CERTO 11, FALTA 1, PELA METADE 9)

| ID | Regra | R antigo | GDD | Veredito | Onde |
| --- | --- | --- | --- | --- | --- |
| JOGO-1.5-01 | Cada turno corresponde a 2 meses de calendário do jogo, e um ano tem 6 turnos. | R4.1 | L347 | CERTO | `motor/turno/comum.ts:5`, `partida/visao.ts:62` |
| JOGO-1.5-02 | `avancarTurno(regras, estado, pedidos)` devolve um novo estado, e, com a mesma semente e os mesmos pedidos, devolve sempre o mesmo estado. | novo | L348 | CERTO | `motor/turno/index.ts:82-110`, `economia.ts:104` |
| JOGO-1.5-03 | Ao passar o turno, o estado do turno anterior continua igual, e o motor devolve outro estado. | novo | L364 | CERTO | `motor/turno/index.ts:90-94`, `congresso.ts:147-154` |
| JOGO-1.5-04 | A semente e a posição do sorteio ficam guardadas no estado, e cada sorteio do turno avança a posição dentro do novo estado. | novo | L348, L364 | PELA METADE | `motor/estado/index.ts:56`, `motor/acaso/index.ts:5` |
| JOGO-1.5-05 | O motor roda as etapas do turno nesta ordem: Congresso, Leis novas, Efeitos, Economia real, Preços e juros, Contas, Moradia, Jogabilidade, Pops e grupos, Governo, Programas, Política, Eleição, Mídia, Invariantes. | novo | L360, L375 | PELA METADE | `motor/turno/index.ts:57-79`, `congresso.ts:150` |
| JOGO-1.5-06 | Uma lei do mundo que não está na lista de leis vigentes do país não arrecada, não gasta e não mexe em índice até ser legislada. | novo | L365 | CERTO | `turno/inicio.ts:279`, `efeitos/index.ts:48` |
| JOGO-1.5-07 | Quando um pedido legisla uma lei, os efeitos dela andam de zero até o valor novo, no tempo que cada efeito declara. | novo | L365 | CERTO | `efeitos/index.ts:72-101`, `efeitos/index.ts:27-31` |
| JOGO-1.5-08 | Cada efeito de lei declara em quantos turnos chega inteiro, e o efeito só chega por inteiro depois desse prazo. | R4.2 | L366 | CERTO | `motor/leis/tipos.ts:77`, `efeitos/index.ts:41` |
| JOGO-1.5-09 | Quando o atraso declarado de um efeito é zero, o efeito chega inteiro no turno seguinte ao do pedido. | R4.2 | L366 | CERTO | `efeitos/index.ts:29`, `congresso.ts:115-128` |
| JOGO-1.5-10 | O módulo `turno` chama cada módulo na ordem e junta os fatos que eles deixam, e a regra de cada coisa fica no módulo dela. | novo | L367, L375 | PELA METADE | `turno/index.ts:95`, `etapas/eleicao.ts:259-271` |
| JOGO-1.5-11 | Cada fato do turno fica na memória de 1 a 3 turnos, conforme o tamanho dele, e depois some. | R4.12 | L368 | CERTO | `motor/fatos/index.ts:48`, `fatos/index.ts:77` |
| JOGO-1.5-12 | Para cada índice, o motor entrega o valor de 8 meses atrás (4 turnos), e a tendência é de alta ou de queda quando a diferença for de 2 pontos ou mais, e estável quando for menor. | R17.18 | L369 | PELA METADE | `partida/visao.ts:478`, `saudeDosIndices.ts:54-55` |
| JOGO-1.5-13 | A aprovação de uma lei vem da conta de votos do Congresso e do apoio dos grupos, sem nenhum sorteio, e passa quem tem votos. | R12.11 | L355, L370 | CERTO | `motor/politica/voto.ts:1`, `voto.ts:253` |
| JOGO-1.5-14 | Na votação do Congresso, a lei que o Congresso considera exorbitante cai, mesmo com o jogador propondo. | R12.12 | L355 | PELA METADE | `voto.ts:255-256`, `pauta.ts:134-138` |
| JOGO-1.5-15 | Quando o jogador propõe uma lei e depois desiste dela, o Congresso perde paciência (propor a mesma lei de novo fica mais difícil) e o presidente perde Aprovação. | novo | L371 | FALTA | `motor/turno/regras.ts:84-91`, `politica/constantes.ts:32-34` |
| JOGO-1.5-16 | Para cada lei, o motor entrega o prazo, em turnos, do efeito mais longo dela, para que a tela mostre "efeito em N turnos". | novo | L366, L372 | PELA METADE | `partida/previa.ts:356-380`, `previa.ts:364` |
| JOGO-1.5-17 | Antes de passar o turno, o jogador entrega ao motor pedidos de propor leis, trocar ministro, negociar com aliados e, em tempo de campanha, fazer campanha. | novo | L351–L356 | CERTO | `motor/turno/regras.ts:84-91`, `etapas/governo.ts:68` |
| JOGO-1.5-18 | Antes de propor uma lei, o motor entrega os grupos que ganham e os grupos que perdem com ela, para a tela mostrar. | novo | L353 | CERTO | `partida/previa.ts:380-395`, `partida/index.ts:700` |
| JOGO-1.5-19 | Em cada papel da mesa, o jogador escolhe assinar, vetar, recusar, encaminhar ou deixar na pilha, e a escolha entra nos pedidos do turno. | R17.2 | L354 | PELA METADE | `motor/mesa/index.ts:51`, `pauta.ts:44-80` |
| JOGO-1.5-20 | Ao passar o turno, os efeitos chegam, a mídia reage aos fatos do turno e novos fatos (escândalo, choque de preço, atentado) podem acontecer. | novo | L356, L389 | PELA METADE | `etapas/midia.ts:9-16`, `motor/midia/jornal.ts:46-57` |
| JOGO-1.5-21 | Na última etapa, o motor confere as invariantes do estado novo e avisa se alguma falha. | novo | L360, L375 | PELA METADE | `etapas/invariantes.ts:112-129`, `turno/index.ts:97-98` |

## 5. O partido

> No GDD: 5.1.

- ☐ **R5.1** Ficha do partido: bússola (da chapa), base, cadeiras, caixa, desgaste, coesão.
- ☐ **R5.2** Governar longe da base derruba a coesão; o partido muda de lugar devagar.
- ☐ **R5.3** Presidente do partido pesa na negociação e na campanha; troca custa coesão.
- ☐ **R5.4** Caixa: entra por financiamento (lei), sai na campanha; doação privada traz interesse.
- ☐ **R5.5** Coesão baixa: deputados do próprio partido votam contra.

**Construção**

- Estado: `partido` (bússola, caixa, coesão, desgaste).
- Módulo: `congresso` (o partido do jogador é um partido do Congresso com caixa e coesão).
- Fatos: ouve "lei aprovada" (distância da base) e "escândalo"; emite "coesão caiu".
- Teste: governar sempre longe da base derruba a coesão em poucos turnos.

## 6. Governo: presidente, ministros, instituições, Judiciário, estados

> No GDD: 5.2 a 5.8 e 4.18 a 4.21.

**Pessoas e fichas**

- ◐ **R6.1** Retratos genéricos (feito, provisório: o autor não gostou); ficha com atributos (falta).
- ◐ **R6.6** Gerador de pessoas; envelhecem, se aposentam e morrem. (12/nov: o gerador existe e o país declara só os nomes. Falta envelhecer, aposentar e morrer.)
- ◐ **R6.11** Perfil de rede social da pessoa, gerado da ficha; sem rótulo de lado. (12/nov: posts, lugares e quem segue; falta a "Informações pessoais descobertas" e o Espiar.)
- ✅ **R6.12** Lista de pessoas por vaga (chapa, ministério), com o perfil ao clicar. (12/nov)
- ☐ **R6.2** Presidente pesa por carisma (aprovação), honestidade (escândalo) e habilidade (Congresso).

**Instituições e ministérios** (13/nov)

- ✅ **R6.10** 36 instituições (+ regras dos poderes, no miolo), todas em todo país; toda lei mora numa delas. Ministério é uma caixa com nome e zero ou mais instituições inteiras; cada instituição numa caixa só; a que nenhuma cita vai para a caixa da sobra (o gabinete), que pesa 3 a mais. (13/nov: as 512 leis já apontam uma instituição.)
- ✅ **R6.25** Tamanho do governo numa régua: Enxuto (9), Clássico (19), Do país, Inchado (do país + 5 sem pasta); "Ajustar caixas" arrasta instituições, cria e tira ministério; nome automático pela caixa sugerida mais parecida. (13/nov)
- ✅ **R6.26** Ministros no começo: sorteio pela chapa; cada cadeira mostra quanto o ministro rende ali e troca por três cartas (técnico, aliado, do seu partido) ou pela lista. (13/nov)
- ◐ **R6.14** O país começa com os ministérios dele; o jogador muda no começo; depois só pela lei Organização dos ministérios (escada de 4 degraus). (13/nov: Brasil com 34 caixas. Faltam os outros países e a lei.)
- ◐ **R6.15** Toda caixa tem ministro, custa estrutura e agrada quem é parecido com o ministro; superministério divide a competência. (13/nov: ministro e divisão feitos. Faltam o custo de estrutura, que é do caminho do dinheiro, e agradar quem é parecido.)
- ✅ **R6.7** Ficha do ministro: competência, habilidade, carisma, honestidade, lealdade, bússola, origem. (12/nov: agem competência e honestidade; habilidade, carisma e lealdade esperam Congresso, mídia e fatos do ministro.)
- ◐ **R6.8** A ficha muda a força e o atraso das leis das instituições da caixa e o rendimento delas. (Competência muda força e atraso; o rendimento age na lei desde 14/nov, R7.11.)
- ◐ **R6.24** Trocar ministro a qualquer momento, sem esperar turno nem lei; toda troca causa revolta e polêmica (o demitido reage pela lealdade, o partido dele se irrita no Congresso, a mídia cobra). (13/nov) (Feito: partido ressentido, notícia maior a cada troca do mandato, mágoa de 3 turnos nos grupos parecidos com quem saiu. Falta: a reação do demitido pela lealdade e a mídia ter efeito, seção 18 do GDD.)
- ☐ **R6.9** Fatos do ministro (escândalo, crise, demissão barulhenta, vira candidato).

**Instituição por dentro** (11 e 13/nov)

- ✅ **R6.16** Cada instituição tem verba (das leis de gasto dela), necessidade, rendimento = verba ÷ necessidade e corrupção interna. Não tem chefe próprio: quem manda é o ministro. (O rendimento age sobre a lei desde 14/nov, R7.11.)
- ✅ **R6.17** Verba de sobra vira corrupção; cargos de livre nomeação e ministro desonesto também; escândalo ao cruzar 60.
- ◐ **R6.18** Ficha da instituição no mapa, só de leitura (cor do rendimento, fila, leis que mexem). (13/nov: escudo sob o ministro, "Recebe X% do PIB" e o painel Atrapalham / Ajudam. Falta a ficha com rendimento, corrupção e fila.)

**Perder o poder** (12/nov)

- ☐ **R6.13** Caminhos: eleição, morte, assassinato, renúncia, impeachment, moção (parlamentarismo), golpe, guerra civil, ala rival; vice de outro partido assumindo acaba a partida.
- ☐ **R6.3** Sucessão pelo vice e pela linha do país; do mesmo partido, choque de aprovação.
- ☐ **R6.5** Impeachment: fato grave, aprovação < 30%, 2/3; Senado julga se houver.
- ☐ **R6.19** Caminho autoritário: cada passo sobe a raiva dos contrários; sem armas leais, sobe o Risco de golpe.

**Judiciário, Justiça e prisões e estados** (13/nov: Judiciário é poder, Justiça e prisões é instituição)

- ◐ **R6.20** Judiciário (poder, no miolo, sem ministro): fila de processos, independência, caso em etapas (rastro, investigação, processo, sentença). (14/nov: tribunais do país e juízes de verdade em `motor/judiciario`; a independência sai de quem senta. Falta fila e caso.)
- ✅ **R6.27** Eleições sem ministro, sempre com o Judiciário (a corte eleitoral, quando houver tribunais); nenhuma caixa a leva. (14/nov: no mapa, pendura no tribunal eleitoral; sem ele, no constitucional.)
- ☐ **R6.21** Corrupção em cadeia: rastro nunca some; a chance de achar usa a independência de hoje.
- ◐ **R6.22** Tribunal superior: cadeiras com lado; vaga vira papel; suspende lei que bate em direito. (14/nov: cadeiras com lado, aposentadoria abre vaga, papel importante com 3 cartas; a lei Quem escolhe os juízes diz se é a carreira, o Senado ou o presidente sozinho. Falta suspender lei.)
- ☐ **R6.23** Governadores: partido, bússola e termômetro; falam com o governo pela instituição Estados e municípios (repasses e dívida dos estados); o ministro dela faz a verba render e esquenta o termômetro; oposição atrasa e culpa.

**Construção**

- Dados: `mundo/ministerios/instituicoes.json`, `moldes.json` (caixas sugeridas) e `tamanhos.json`, da `gdd.xlsx`; cada lei traz a instituição no campo `esfera` (renomear é pedido à parte); país em `paises/<id>/governo.json` (caixas, quem manda) e `pessoas.json`.
- Estado: `governo` (caixas com ministro, órgão por instituição: corrupção), `pessoas` (fichas); depois `justica` (rastros, casos).
- Módulo: `governo` (instituições, caixas, fichas, órgãos); `pessoas` (gerador); `justica` nasce dentro de `governo` até crescer.
- Turno: etapa Governo, depois de pops e grupos (o órgão muda o rendimento e a corrupção); a ficha entra na força e no atraso das leis novas.
- Fatos: emite "ministro caiu", "escândalo", "presidente morreu", "impeachment aberto"; ouve "papel assinado" (rastro), "CPI".
- Tela: começo com Governo (régua e caixas) e Ministros (cadeiras e cartas); no mapa, ministros no anel e instituições como escudos; juízes no miolo.
- Teste: ministro competente faz a mesma lei chegar antes; verba acima da necessidade sobe a corrupção; mais instituições na caixa, menos rendimento; governo pronto sem instituição repetida.

## 7. Leis e programas

> No GDD: Parte 4.

**Leis**

- ✅ **R7.1** Duas camadas e duas formas (régua e degraus).
- ✅ **R7.2** A lei declara efeito, força, atraso, bússola e base; o motor calcula.
- ✅ **R7.3** Validador com arquivo, campo e motivo.
- ✅ **R7.4** País declara as leis que tem; o resto fica "não legislada".
- ✅ **R7.5** Texto da tela sai dos números da lei.
- ✅ **R7.14** Leis saíram da `leis.xlsx` (512 no jogo, 12/nov; ver R4.11); unidade livre (km/h, mandatos, % acima de 100).
- ✅ **R7.15** Formas especiais divididas: dois controles em duas leis, divisão de 100% em pesos, régua por setor geral.
- ✅ **R7.9** Colisão: leis que colidem não valem juntas.
- ✅ **R7.10** Processo: índice que anda sozinho (deriva).
- ◐ **R7.6** Temas em pacotes de leis pequenas (planilha completa; 5 escolhas de lista fora: vistos por país, setores, verba das estatais, ministérios).
- ◐ **R7.12** Toda lei chega ao pop por renda, emprego, preço, serviço ou direito. (14/nov: toda lei declara o `canal`; hoje 120 de 512 chegam por um caminho do motor e 392 esperam a triagem da onda delas.)
- ◐ **R7.13** Toda lei numa instituição (13/nov: as 512; serão refeitas instituição por instituição) e índice preso ao ministro responsável (no mapa). As 8 áreas antigas saem (autor, 13/nov); o código ainda as usa.
- ◐ **R7.22** Leis padronizadas por instituição, a partir da `gdd.xlsx`; o dinheiro que entra e sai "fora das leis" se resolve aí. (14/nov: base pronta, plano em `docs/historico/plano-leis-onda1-14nov.md`; faltam as 4 ondas.)
- ✅ **R7.8** Revogar = propor a volta a "não legislada", com voto. (14/nov: botão na folha da lei; lei essencial não se revoga.)
- ✅ **R7.11** Lei age pelo órgão: a regra funciona na medida da verba do órgão (ver R6.16). (14/nov: efeito × rendimento da instituição, teto 1.)
- ☐ **R7.16** Tipos de lei: Lei com prazo (acaba sozinha), Ato, Posição por país, Operação.
- ☐ **R7.17** Parte da divisão: a fatia vale o peso dela sobre a soma, quando a mecânica ler.

**Programas** (12/nov)

- ✅ **R7.18** 73 programas (aba Programas; 1 espera leis que o jogo ainda não tem): forma-se quando a maior parte das leis anda o mínimo na direção dele dentro do mandato; desfaz-se se elas voltam. (12/nov)
- ◐ **R7.19** Lembrança e nostalgia: formado, os grupos lembram (pesa no voto); desfeito, vira nostalgia; recriado, o jogo pergunta se usa o mesmo nome. (12/nov: a lembrança de cada grupo é guardada e a nostalgia fica; refeito, volta com o mesmo nome. Falta pesar no voto e perguntar o nome.)
- ◐ **R7.20** Nome: o país dá o nome próprio; senão o gerador cria pelos moldes e pelas 4 palavras; o jornal anuncia. (12/nov: feito; o jornal do turno anuncia o programa formado.)
- ✅ **R7.21** Programa espalhado por vários ministérios anda no passo do ministro mais fraco. (12/nov: o programa espera o maior atraso entre as leis dele, 0 ou 1 turno.)

**Construção (programas)**

- Dados: abas Programas e Programas - leis → `mundo/programas/programas.json` (`npm run programas`); moldes de nome em `mundo/programas/nomes.json`; país em `paises/<id>/programas.json` (`nomes` e `formados`, com a lembrança dos grupos se ele quiser dizê-la).
- Estado: `programas` (formados, turno em que formou, lembrança por grupo, nome dado).
- Módulo: `programas`.
- Turno: depois do Congresso e da mesa (lei assinada conta na hora da aprovação).
- Fatos: ouve "lei aprovada"; emite "programa formado", "programa desfeito" (o jornal e os grupos leem).
- Tela: bolha do programa no mapa, com as leis que faltam; aviso antes de uma lei desfazer.
- Teste: aprovar 3 de 4 leis na direção forma; voltar uma desfaz e deixa nostalgia.

## 8. Bússola

> No GDD: 2.5.

- ✅ **R8.1** Eixos `economico` e `social`, de −1 a +1.
- ✅ **R8.2** Leis, partidos, grupos e potências têm posição.
- ✅ **R8.3** Posição do país = média das leis com peso.
- ✅ **R8.4** Quem gosta sai da distância.
- ◐ **R8.5** Pops deslizam com a vida (feito) e com a mídia (falta; R14.8).
- ☐ **R8.6** O jogo percebe padrões ("corte de gastos").

## 9. Índices

> No GDD: 4.16.

- ✅ **R9.1** Índices essenciais do motor.
- ✅ **R9.2** Índices de jogabilidade do mundo (147, da planilha; valor de partida 50 se o país não disser).
- ✅ **R9.8** Seis índices principais marcados (aba Índices, coluna Principal).
- ◐ **R9.3** Inflação que se move.
- ◐ **R9.4** Todo índice tem efeito além da cobrança dos grupos.
- ☐ **R9.5** Desemprego e ocupados se movem com a economia (R16.27).
- ☐ **R9.6** Índice da bolsa.
- ✅ **R9.9** Aprovação = satisfação média dos pops pesada pelo tamanho. (12/nov: é `satisfacaoMedia`, lida pelo Congresso e pela eleição; aparece na janela Eleição.)

## 10. Contas do Estado

> No GDD: 3.12.

- ✅ **R10.1** Receita, gasto, juros, cofre e dívida separados.
- ☐ **R10.7** Caminho do dinheiro: impostos → Tesouro → verba por lei → máquina do ministério → filtro da corrupção (dinheiro some de verdade) → instituição. A pensar depois das leis (GDD §18).
- ✅ **R10.2** Juros sobem com dívida e inflação.
- ✅ **R10.3** Regra fiscal por lei.
- ◐ **R10.4** Dinheiro na moeda do país.
- ☐ **R10.5** Emissão de moeda.
- ☐ **R10.6** Calote.

## 11. População e grupos

> No GDD: Parte 2.

- ◐ **R11.1** Pops com renda vinda da economia (renda ainda é parte fixa do PIB; R16.26).
- ✅ **R11.2** Grupos com bússola, tamanho e satisfação.
- ✅ **R11.3** Radicais e lealistas.
- ◐ **R11.4** Satisfação lê renda, índices e leis (falta mídia e programas).
- ✅ **R11.5** Pops mudam de setor estudando.
- ✅ **R11.6** Pops sobem e descem de estrato.
- ✅ **R11.7** Cada pop tem bússola e desliza com a vida.
- ◐ **R11.19** Raiva do grupo (0–100), separada da satisfação (falta: mídia mobiliza).
- ☐ **R11.8** Pop guarda idade, cidade ou campo, vínculo, escolaridade, patrimônio.
- ☐ **R11.9** Nascer, envelhecer, morrer.
- ☐ **R11.10** Insatisfeito sai: informalidade, fuga de dinheiro, emigração.
- ☐ **R11.11** Grupo forte torna mais populares as leis perto dele.
- ☐ **R11.12** 32 pops em 4 blocos, com crianças.
- ☐ **R11.13** 25 grupos atravessam os pops.
- ☐ **R11.14** Organizações políticas nascem de radicais e têm líder e ação.
- ☐ **R11.15** Crime organizado nasce do mercado ilegal e da falta de Estado.
- ☐ **R11.16** Gerador de organizações.
- ☐ **R11.17** Pops por estado (medido possível em 12/nov).
- ☐ **R11.18** Financiadores de organizações e rastro.

## 12. Congresso

> No GDD: 5.5.

**Voto** (11–12/nov)

- ✅ **R12.1** Toda mudança de lei é votada.
- ✅ **R12.2** Partidos do país com cadeiras, bússola e grupos.
- ✅ **R12.11** Placar previsto = placar real, sem sorteio; muda só com fato do turno, que aparece. (12/nov: `placarPrevisto` usa a mesma conta da votação; tela na janela da lei.)
- ✅ **R12.12** Nota do partido: bússola, grupos, base ou oposição, apoio da população, aprovação e **conta da lei** (% do PIB, pesando mais com déficit alto); exorbitante é a lei que perde a maioria pela conta. (12/nov: voto.ts; pesos de partida, a calibrar.)
- ✅ **R12.13** Fiéis e livres pela coesão; ano de eleição puxa o voto para o povo. (12/nov.)
- ✅ **R12.14** Quórum por classe (comum, absoluta, constitucional, mandato), mudado pela lei Quórum das votações. (12/nov: coluna Classe na planilha, 59 leis fora da comum.)
- ✅ **R12.7** Duas casas em sequência: Câmara no turno 1, Senado no turno 2; Senado muda, volta à Câmara; país de uma casa vota uma vez. (12/nov: Brasil com Senado de 81 cadeiras; Senado emenda a lei de régua que cai pela conta.)
- ☐ **R12.15** Bancadas temáticas e lobby das companhias.

**Moedas e relação**

- ✅ **R12.3** Coligação: convidar (oposição acima de 70), sair (termômetro abaixo de 20), voltar pelo convite (12/nov). Falta cobrar o que o partido pediu na mesa (passo Mesa).
- ◐ **R12.4** Seis moedas: ceder na régua, ministério, cargos, emenda, promessa de lei, decreto; cada compra sobe o preço do próximo voto. Falta: botões de promessa e decreto na tela; ceder, cargos, emenda e ministério têm botão (12/nov).
- ✅ **R12.16** Termômetro por partido (0–100): base sai abaixo de 20; oposição entra acima de 70. (12/nov: convite pelo pedido `convidar`.)
- ✅ **R12.17** Paciência por casa (0–100): abaixo de 30 a casa pune o governo. (12/nov.)
- ✅ **R12.18** Carga da casa: passou do limite, a lei entra na fila (sem pontos de ação). (12/nov: carga padrão 3 por casa.)
- ◐ **R12.19** Decreto: vale já, Congresso confirma em 2 turnos; fato consumado; alcance pela lei Poder de decreto (4 degraus). Falta: os grupos que ganhavam ficarem com raiva de quem derruba (fato `grupo-com-raiva`; depende dos grupos) e o botão na tela.

**A casa agindo**

- ✅ **R12.6** Veto com observação e derrubada do veto. (12/nov: só vale para lei emendada; observação guardada na votação.)
- ☐ **R12.5** Rejeitar, emendar, propor lei popular, travar a pauta, CPI.
- ☐ **R12.10** Lei popular passa mais fácil; o Congresso propõe por conta própria.
- ☐ **R12.8** Sistemas: presidencialismo, parlamentarismo (moção), semipresidencialismo (coabitação), partido único (alas, congresso do partido, expurgo). (13/nov: reformular os tipos de parlamento com as caixas livres; GDD §18.)
- ☐ **R12.9** Cadeiras mudam a cada eleição.

**Construção**

- Dados: `paises/<id>/congresso.json` (casas, partidos com nome e cor reais, cadeiras, bússola, grupos, coesão, quórum de partida, sistema); classe de cada lei (coluna nova na planilha).
- Estado: `congresso` (por casa: paciência, carga, fila; por partido: termômetro, preço que sobe, coesão; votações em andamento com turno de cada casa; decretos vigentes).
- Módulo: `congresso` (nasce do `politica` de hoje).
- Turno: primeira etapa (pedidos do jogador → votações).
- Fatos: emite "lei aprovada", "lei rejeitada", "emenda", "veto derrubado", "decreto derrubado", "partido saiu da base", "CPI aberta"; ouve "manchete contra", "escândalo", "grupo com raiva", "aprovação".
- Tela: anel de cadeiras no miolo do mapa (feito, 13/nov), termômetro em arco, ponteiro da paciência, barra de carga, placar com linha do quórum, "até aqui passa" na régua.
- Teste: placar previsto igual ao apurado; lei cara perde votos com déficit alto; Senado que muda devolve à Câmara; decreto derrubado deixa os grupos que ganhavam com raiva de quem derrubou.

## 13. Eleição, campanha e mandatos

> No GDD: 5.6.

- ✅ **R13.1** Mandato e eleição pela lei do país.
- ✅ **R13.2** Desgaste sobe sempre.
- ◐ **R13.3** Voto por grupo (satisfação feita; falta bússola dos candidatos, campanha e mídia).
- ✅ **R13.9** Adversários são os partidos de oposição, que lançam chapa e podem se coligar. (12/nov)
- ✅ **R13.10** Dois turnos: segundo no último turno jogável do mandato, primeiro no anterior. (12/nov)
- ◐ **R13.11** Promessa: meta do mandato (principal, subíndice ou programa), prêmio pelo tamanho, cumprir em parte vale em parte, avaliada no primeiro turno; trocar é quebrar. (12/nov: tudo feito, falta descontar o que o país faria sozinho.)
- ☐ **R13.4** Limite de reeleição: o partido troca de candidato.
- ☐ **R13.5** Chapa entre fichas do partido e aliados.
- ☐ **R13.6** Coligação eleitoral (TV, caixa, eleitores; cobra lugar).
- ☐ **R13.7** Campanha nos últimos turnos: ações com alvo pagas pelo caixa, rendimento cai ao repetir.
- ☐ **R13.8** Reduzir o desgaste (nunca zera).

**Construção**

- Estado: `eleicao` (promessa com meta e base, chapas, resultado do 1º turno).
- Módulo: `eleicao`; a Aprovação (R9.9) é conta da `populacao`/`grupos`, lida aqui.
- Turno: última etapa, só nos turnos de eleição.
- Fatos: ouve "programa formado" (promessa de programa), "escândalo"; emite "eleição vencida/perdida", "segundo turno".
- Teste: promessa pequena cumprida rende pouco; perder no segundo turno acaba a partida.

## 14. Mídia

> No GDD: Parte 6.

- ◐ **R14.1** Mídias do país (8 maiores e redes): dono, bússola, audiência por grupo, credibilidade. (12/nov: Brasil com 8 mídias inventadas e as redes, no estado; ninguém lê ainda, é o passo 12.)
- ✅ **R14.4** Jornal do turno: a notícia de maior impacto sai dos fatos. (12/nov: as 3 maiores, no topo do Resultado do turno.)
- ☐ **R14.3** Pauta: cada mídia escolhe uns 3 fatos (tamanho, lado, dono, medo).
- ☐ **R14.2** Enquadramento: o efeito da lei na opinião passa pela mídia.
- ☐ **R14.8** A mídia muda o lado do pop devagar (bolha, redes, freio da instrução).
- ☐ **R14.9** A mídia mobiliza a raiva (R11.19).
- ☐ **R14.10** Fato e versão; mentira descoberta.
- ☐ **R14.5** Leis de mídia agindo (publicidade, emissora estatal, regulação, censura).
- ☐ **R14.6** Redes: rápidas, polarizam, boato com instrução baixa.
- ☐ **R14.11** Atos do presidente com a mídia (entrevista, pronunciamento…).

**Construção**

- Dados: `paises/<id>/midias.json` (nome inventado, dono, bússola, audiência, credibilidade); manchetes por moldes em `mundo/jornal/manchetes.json`.
- Estado: `midias` (credibilidade, pauta do turno).
- Módulo: `midia`.
- Turno: depois de todos os módulos que emitem fatos.
- Fatos: ouve todos; emite "manchete contra/a favor de X" (Congresso e grupos leem).
- Tela: jornal do turno; a mídia no mapa; perfil da emissora.
- Teste: o mesmo fato sai a favor na mídia perto do governo e contra na longe.

## 15. Mundo

> No GDD: Parte 7.

- ✅ **R15.1** Potências com bússola, peso e relações (inventadas; trocar pelos 30 reais).
- ✅ **R15.2** Reputação = média das opiniões pesada; segurança externa.
- ◐ **R15.3** Potência reage (opinião anda; falta o cardápio).
- ☐ **R15.7** Países reais: os 30 maiores, vizinhos e resto do mundo; 11 jogáveis com as duas fichas.
- ☐ **R15.8** País leve: ficha leve (economia resumida, governo, regime, poder militar, jeito).
- ☐ **R15.9** IA em 3 passos com o cardápio (comércio, dinheiro, segurança, palavra), linhas vermelhas e um degrau por vez com aviso.
- ☐ **R15.10** Governos que já existiram: a cada eleição o novo governo cai perto de um ponto da história.
- ☐ **R15.11** Posições por país no menu do país (não são leis).
- ☐ **R15.4** Sanção pelo mercado.
- ☐ **R15.5** Ataque externo (sem revide).
- ☐ **R15.12** Tela do Mundo: ranking com a relação e a ficha do país.

**Construção**

- Dados: abas Países e Países - governos → `mundo/paises-leves.json`.
- Estado: `mundo` (por país leve: governo, opinião sobre cada um, posições).
- Módulo: `mundo`.
- Turno: depois da economia do jogador; o que toca o jogador vira papel.
- Teste: virar ditadura derruba a opinião dos democráticos em um turno; nada vai de amigo a sanção num turno só.

## 16. Economia

> No GDD: Parte 3.

A V1 pede só R16.26 e R16.27 (passo 10 da ordem); o resto vem depois.

**Mercado**

- ✅ **R16.1** Produtos em setores, mercado do país e do mundo.
- ✅ **R16.2** Demanda dos pops; falta de comida vira fome.
- ✅ **R16.3** Energia como capacidade (usinas contra demanda).
- ◐ **R16.4** Comércio por tarifa, subsídio e acordo.
- ◐ **R16.5** Cadeia entre setores (aço → máquinas → veículos).
- ☐ **R16.6** Setores com regra própria (moradia, remédios, militar).

**Terra e moradia (campo × cidade)**

- ☐ **R16.17** Moradia é estoque local (formal e precária) e sai do mercado do mundo.
- ☐ **R16.18** Quem constrói: empresas, governo (lei) e pops (pobre autoconstrói, médio financia, rico investe).
- ✅ **R16.19** Índices déficit, preço e favela (deriva em `derivas.json`, 04/nov; não equilibrado).
- ☐ **R16.20** Leis da cidade em 4 alavancas × 6 lados, com colisões.
- ☐ **R16.21** Terra rural de donos grandes, pequenos ou parada; concentração muda quanta gente vive do campo.
- ☐ **R16.22** Êxodo: gente do campo vai à cidade quando a renda esperada lá passa a do campo.
- ☐ **R16.23** Quem chega à cidade pede casa; sem oferta, sobe déficit e favela.
- ☐ **R16.24** Leis do campo nos 6 lados, ligadas à cidade só pelo êxodo.
- ☐ **R16.25** Bem tomado pelo Estado (terra ou empresa) ganha destino por lei: comunidade, Estado ou famílias com título; uma lei por destino (GDD, Em aberto da 3.11).

**Construções** (pilar 1)

- ☐ **R16.7** Construções produzem, empregam e dão lucro; o PIB é a soma delas.
- ☐ **R16.8** Obra com custo e prazo por tipo, em fila; construção civil decide quantas andam.
- ☐ **R16.9** Lucro = receita − salários − insumos − impostos; prejuízo seguido fecha.
- ☐ **R16.10** Corrupção atrasa e encarece obras.

**Empresas e dono** (pilar 2)

- ◐ **R16.11** Empresas declaradas pelo país (feito `empresas.json`; falta ligar às construções).
- ☐ **R16.12** Lucro vai ao dono (investidores e reserva, exterior, cofre, trabalhadores).
- ☐ **R16.13** Reserva privada abre obras; verba estatal por lei; patrocínio do Estado.
- ☐ **R16.14** Atos do Estado por lei (estatizar, criar, vender, cooperativa) com leis de propriedade.

**Bolsa** (pilar 3)

- ◐ **R16.15** Pregão: blocos de 2%, dividendo sem mando (protótipo na tela).
- ☐ **R16.16** Preço = lucro × múltiplo; compradores com caixa; cofre real; ficha da empresa.
- ☐ **R16.28** Ações fazem parte do patrimônio dos pops; dividendo vira renda.
- ☐ **R16.29** Bolsa funciona sem o governo: empresas, investidores e preços andam sozinhos.
- ☐ **R16.34** Preço da ação sai de lucro, juros, risco, crescimento esperado e humor.
- ☐ **R16.35** Investidores com caixa e comportamento próprio geram alta, euforia, pânico e quebra.
- ☐ **R16.30** Base do mercado e leis para regulamentar ou entrar, com caminhos liberal, coordenado e Estado dono.
- ☐ **R16.31** Serviços do Estado são prédios fora do mercado: pagos pelo orçamento, com emprego e sem lucro.
- ☐ **R16.32** Terceirizar serviços do Estado por lei, como segurança, presídios, hospitais e escolas.

**Ligação entre pops e economia** (base do jogo)

- ☐ **R16.26** A renda do pop sai de salário, lucro, aluguel e transferência.
- ☐ **R16.27** Falta de trabalhador freia a produção; o desemprego sai daí.
- ☐ **R16.36** Consumo: pops, pequenos mercados, mercados, prédios, Estado e exterior compram.
- ☐ **R16.37** Prédio contrata por qualificação; salário sai de qualificação, lucro e disputa por gente.
- ☐ **R16.38** Crédito de bancos a pops, prédios e Estado.
- ☐ **R16.39** Câmbio, regime e reservas ligam comércio, inflação, dívida e investidores.
- ☐ **R16.33** Caminho do lucro completo: valor adicionado, salário, encargos, desgaste, juros, imposto, reinvestimento e dividendo.

## 17. Tela e mesa

> No GDD: Parte 8.

**Mapa** (13/nov)

- ✅ **R17.1** Mapa orgânico: bolhas soltas sobre uma hierarquia (trindade → ministros → instituições → leis em pétalas); índices presos ao ministro; grupos num anel de fora, potências mais longe.
- ✅ **R17.12** Mapa por ministério e instituição, sem as 8 áreas antigas. (13/nov: cor, ordem do anel e manchas vêm do ministério; a lei clareia o tom pela instituição; `mundo/areas`, o mapa antigo e o `layout.ts` saíram.)
- ◐ **R17.16** Três Poderes no miolo: trindade (Executivo), juízes em volta (Judiciário), anel de cadeiras (Câmara em cima, Senado embaixo). (Juízes de verdade por tribunal desde 14/nov; em aberto se cada instituição e lei responde a um poder.)
- ✅ **R17.17** Prioridade visual Ministro > Instituição > Índice > Lei; visões Padrão, Ligações, Nível, Dinheiro e Popularidade como filtros dentro do degrau. (Popularidade sem dado: o motor não calcula popularidade por lei.)
- ✅ **R17.18** Alerta do índice: cor do anel pelo nível, seta pela tendência. (13/nov: compara com 8 meses atrás, corte de 2 pontos de saúde.)
- ✅ **R17.19** Só leis promulgadas no mapa; as outras num botão no canto, com a folha para promulgar.
- ✅ **R17.20** Painel Atrapalham / Ajudam de ministro, instituição e índice.
- ✅ **R17.21** Barra do topo: caixa, dívida, PIB, apoio, eleição e passar o turno.
- ✅ **R17.22** Navegação: busca, enquadrar, miniatura, pinça, roda, setas e teclado.
- ✅ **R17.23** Onde moram as janelas (13/nov): menu no brasão (Salvar, Carregar, Recomeçar; salva sozinho a cada turno); Governo pelo clique na trindade; Eleição pelos medidores de apoio e eleição; Mercado pelo do PIB; Mesa por um botão ao lado de Passar o turno; Programas por um botão ao lado de Leis não promulgadas. Pregão (protótipo sem motor) fica escondido.
- ✅ **R17.24** Trocar ministro pelo mapa (R6.24): o painel do ministério clicado traz a troca e o preço dela.
- ◐ **R17.15** Causa e efeito: "o que empurra" no índice, "a conta que vem" na lei, marca da lei no gráfico. (Fios de efeito e o painel Atrapalham / Ajudam; faltam a conta que vem e o gráfico.)

**Turno e fichas**

- ✅ **R17.2** Votação, passar o turno, resultado do turno.
- ◐ **R17.3** Salvar e carregar. (Funciona; ficou sem botão, R17.23.)
- ◐ **R17.4** Fichas por cima do mapa (retrato feito; atributos faltam).
- ◐ **R17.5** Prévia de quem ganha e perde antes de propor.

**Mesa**

- ◐ **R17.6** Mesa: carimbos assinar, vetar (com observação), recusar, encaminhar, pilha. (12/nov: feitos assinar e vetar com observação na janela Mesa, hoje sem botão; faltam recusar, encaminhar e pilha.)
- ◐ **R17.7** Famílias de papel: leis, crises, pedidos, ofertas, instituições, partido, duvidosos; conteúdo sai dos números. (Só a família Leis.)
- ◐ **R17.13** Prazos: ignorar tem consequência. (Papel de lei vale 1 turno; falta crise e aliado se afastar.)
- ☐ **R17.14** Papéis duvidosos deixam rastro (R6.21).
- ☐ **R17.8** Encaminhar ao ministro: ele decide pela ficha.
- ☐ **R17.9** A mídia lê a mesa.
- ☐ **R17.10** Mesa do partido.
- ☐ **R17.11** Momentos do partido como telas curtas.

**Construção (mesa)**

- Estado: `mesa` (papéis com tipo, prazo, opções e quem pediu).
- Módulo: `mesa`.
- Turno: logo depois do Congresso (lei aprovada vira papel) e depois de cada módulo que pede algo.
- Fatos: ouve "lei aprovada", "emenda", "crise", "pedido"; emite "papel assinado/vetado/ignorado".
- Teste: lei ignorada até o prazo segue a regra do país (sanção ou veto).

---

## Ordem de construir

A ordem segue a dependência: primeiro o que os outros usam. Cada passo fecha
jogável (teste ou tela) antes do próximo. Até o passo 10c é a **V1**: o Brasil
de hoje jogado por um mandato inteiro, para mostrar a pessoas.

| #   | Passo                  | Requisitos                                        | Por que nesta ordem                                                                                                                         |
| --- | ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Brasil 2026            | R4.3                                              | Sem país de verdade, nada se mostra. Começa com o que o motor lê hoje; ministérios, mídias e programas de antes entram no passo de cada um. |
| 2   | Fatos do turno         | R4.12                                             | Congresso, mesa, programas, mídia e eleição conversam por fatos; sem eles, um chamaria o outro.                                             |
| 3   | Congresso novo         | R12.11–R12.14, R12.7, R12.16–R12.19, R12.4, R12.6 | É o coração da jogada: toda lei passa por ele.                                                                                              |
| 4   | Mesa mínima            | R17.6, R17.7 (só família Leis), R17.13            | Lei aprovada, emenda e veto chegam como papel.                                                                                              |
| 5   | Governo                | R6.10, R6.14, R6.15, R6.7, R6.8, R6.16, R6.17     | Ministério é moeda do Congresso; ficha muda força e atraso.                                                                                 |
| 6   | Programas              | R7.18–R7.21                                       | Usa leis aprovadas (3) e ministros (5).                                                                                                     |
| 7   | Jornal mínimo          | R14.1, R14.4                                      | Anuncia programa, escândalo e votação; dá sentido ao turno.                                                                                 |
| 8   | Eleição nova           | R9.9, R13.9–R13.11                                | Aprovação, promessa e dois turnos fecham o mandato.                                                                                         |
| 9   | Começo da partida      | R4.5, R4.6, R4.8–R4.10, R6.25, R6.26              | Junta país, partido, chapa e ministérios num menu.                                                                                          |
| 10  | Base do jogo e tela V1 | R16.26, R16.27, R17.12, R17.15                    | O jogador sente a lei no bolso do pop e vê causa e efeito. **V1.**                                                                          |
| 10a | Mapa da raiz às pontas | R17.12, R17.16, R17.18, R17.23, R17.24, R6.24     | Ordem do autor (13/nov): com os ministros prontos, corrigir o mapa e as mecânicas do miolo até as leis antes de mexer nas leis.             |
| 10b | Leis padronizadas      | R7.22, R7.13, R4.11                               | As leis refeitas instituição por instituição, na `gdd.xlsx`.                                                                                |
| 10c | Caminho do dinheiro    | R10.7, R6.15                                      | Depende das leis padronizadas; dá custo ao tamanho do governo.                                                                              |
| 11  | Perder o poder         | R6.13, R6.3, R6.5, R6.19                          | Sucessão, impeachment, golpe.                                                                                                               |
| 12  | Mídia completa         | R14.2, R14.3, R14.8–R14.11                        | Enquadramento, raiva, fato e versão.                                                                                                        |
| 13  | Mundo leve             | R15.7–R15.12                                      | Países reais com IA.                                                                                                                        |
| 14  | Justiça e estados      | R6.20–R6.23, R17.14                               | Rastro, tribunal, governadores.                                                                                                             |
| 15  | Partido e campanha     | R5.*, R13.4–R13.8, R17.10                         | Caixa, coesão, chapa, ações de campanha.                                                                                                    |
| 16  | Economia completa      | R16.*                                             | Construções, empresas, bolsa (plano, passo 12b).                                                                                            |
| 17  | População completa     | R11.8–R11.18                                      | Idade, saída, organizações, pops por estado.                                                                                                |

## Fora do jogo pronto

Guerra iniciada pelo país, pesquisa como árvore (GDD 7.6 e 3.11).
