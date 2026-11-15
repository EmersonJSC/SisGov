# SisGov: Documento de design (GDD)

> **O jogo como ele deve ser quando estiver pronto**, organizado por mecânica.
> Refeito em 14/nov/2026 juntando o GDD antigo, o mapa de mecânicas, as regras
> das leis, os requisitos, os `.md` do motor, as planilhas, os estudos e as
> memórias do autor. Cada regra traz a data em que foi decidida. O que ainda
> não tem resposta fica em **Em aberto**; o que não tem referência diz
> **ESTUDAR**. O GDD antigo está em `docs/historico/gdd-ate-14nov.md`.
>
> **Como ler cada mecânica:** O que é · O jogador · Peças · Regras · Ligações
> · Referências · No motor hoje (✅ feito · ◐ pela metade · ☐ falta, com o
> número R de [requisitos.md](requisitos.md)) · Em aberto.
>
> **Ideia nova** entra no "Em aberto" da mecânica dela, com data. Decidida
> pelo autor, vira Regra.
>
> **Revisão do autor:** Parte 1 lida e corrigida em 14/nov (com reflexos em
> 4.1, 5.5, 5.7, 6.3 e 9.2). As outras partes ainda não foram lidas por ele.

## Índice

- **Parte 1. O jogo**
  - 1.1 Visão
  - 1.2 As 3 mecânicas
  - 1.3 Princípios (as regras que nunca mudam)
  - 1.4 A partida: começo, mandato e fim
  - 1.5 O turno
- **Parte 2. Sociedade (a população e como ela funciona)**
  - 2.1 Pops e renda
  - 2.2 Demografia (vida)
  - 2.3 Padrão de vida
  - 2.4 Opinião (interesse, ideologia e memória)
  - 2.5 Bússola
  - 2.6 Grupos de interesse
  - 2.7 Organizações
  - 2.8 Saída e voz (informal, emigrar, tirar dinheiro)
  - 2.9 Território (estados)
- **Parte 3. Economia**
  - 3.1 Mercado e produtos
  - 3.2 Empresas, prédios e obras
  - 3.3 Mercado de trabalho
  - 3.4 Propriedade e lucro
  - 3.5 Consumo e necessidades
  - 3.6 Fluxo do dinheiro (nenhum dinheiro some)
  - 3.7 Sistema monetário e financeiro
  - 3.8 Mercado de capitais (bolsa)
  - 3.9 Companhias e estatais (operações do Estado)
  - 3.10 Setor externo
  - 3.11 Setores com regra própria
  - 3.12 Finanças públicas
- **Parte 4. Máquina pública (as leis e quem as executa)**
  - 4.1 O que é uma lei
  - 4.2 Tipos de lei
  - 4.3 Jeitos: Régua, Verba e Níveis
  - 4.4 Instrumentos (canais: como a lei chega ao pop)
  - 4.5 Ponto doce e regulador
  - 4.6 Escassezes e o que torna a lei jogável
  - 4.7 Nome e texto da lei
  - 4.8 Programas
  - 4.9 Processos
  - 4.10 Colisão e revogar
  - 4.11 Lei pela instituição
  - 4.12 Roteiro da lei (8 passos)
  - 4.13 Implementação (força e atraso)
  - 4.14 Processo de revisão por instituição
  - 4.15 Lei boa e lei ruim
  - 4.16 Índices
  - 4.17 Serviços do Estado e Vícios
  - 4.18 Instituições
  - 4.19 Ministros
  - 4.20 Ministérios (caixas)
  - 4.21 A fronteira do governo
- **Parte 5. Política**
  - 5.1 Partido e chapa
  - 5.2 Presidente e vice
  - 5.3 Sucessão
  - 5.4 Pessoas (fichas)
  - 5.5 Congresso e coligação (o coração do voto)
  - 5.6 Eleição, campanha e mandatos
  - 5.7 Judiciário e Justiça e prisões
  - 5.8 Governadores
  - 5.9 Como se perde o poder
  - 5.10 Caminho autoritário
- **Parte 6. Mídia**
  - 6.1 A mídia como lente das três mecânicas
  - 6.2 Emissoras e redes
  - 6.3 Noticiário: jornal e pauta
  - 6.4 Fato e versão, mentira, escândalo e vazamento
  - 6.5 A mídia muda o lado do pop e mobiliza a raiva
  - 6.6 Atos do presidente e leis de mídia
- **Parte 7. Mundo**
  - 7.1 Os países e as fichas
  - 7.2 A IA dos países e o cardápio
  - 7.3 Opinião, relação e reputação
  - 7.4 Comércio e preços de fora
  - 7.5 Posições por país, atos, sanções e aliança
  - 7.6 Segurança externa, ataque e guerra fora do jogo
- **Parte 8. Tela**
  - 8.1 Mapa
  - 8.2 Mesa (assinar e carimbar)
  - 8.3 Janelas (Mercado, Governo, Programas, Eleição, Mesa e outras)
  - 8.4 O comum às duas telas
  - 8.5 Tela inicial e começo da partida em passos
  - 8.6 Salvar e carregar
  - 8.7 Ícones e direção de arte (só o que define a tela)
  - 8.8 SisGovpedia (dicas em camadas)
- **Parte 9. Narrativas e eventos**
  - 9.1 A mesa de fatos
  - 9.2 Gatilhos
  - 9.3 Eventos e crises
  - 9.4 Atos com custo e duração
  - 9.5 O acaso e a deriva
- **Anexo A. Regras de conteúdo**
- **Anexo B. Glossário**

---

## Parte 1. O jogo

### 1.1 Visão

**O que é**
- SisGov é um simulador da **máquina pública** (e também de governo), em português. Quem joga assume a Presidência de um país, assina leis e vê o efeito no dinheiro, nos indicadores e na opinião da população. (autor, 14/nov)
- Em uma frase: você é um partido que ganhou a eleição e agora faz parte importante da máquina pública do país. (autor, 14/nov)
- Gênero: simulador político de governo, com economia viva de empresas, obras e bolsa.

**O que faz o SisGov ser o SisGov**
- **Política de verdade, não gestão.** Cada lei passa pelo Congresso, pela mídia, pelos grupos e pelo cofre. Mas aprovar não pode ser tão difícil que o jogador não jogue: aprovar lei e medida provisória é importante. Passar lei é uma mecânica conjunta de mídia e grupos; o Congresso é a "voz" dos grupos (não do povo, porque no meio há dinheiro e influência). (autor, 14/nov)
- **Você é um partido com gente dentro.** Pessoas com ficha erram, brilham, traem e morrem; o partido sobrevive a elas, ou não.
- **A conta sempre chega.** O que agrada hoje cobra depois, pela contabilidade, pela economia ou pela urna.
- **O país vive sozinho.** Empresas abrem e fecham, a mídia escolhe lado, os outros países mudam de ideia.
- **O gosto vem do bolso, da bússola e da memória.** Todo mundo e toda lei têm lado na Bússola (esquerda ou direita na economia, libertário ou tradicional nos costumes), e nenhuma lei é neutra. Mas o que mais pesa é o bolso: o que a lei faz com o dinheiro e a vida de cada um (14/nov).
- **Toda lei é uma bolha no mapa.** O jogador decide abrindo a bolha. Painéis só mostram.

**O jogador** (faz e sente)
- Quem joga é o partido, não uma pessoa. Presidentes, ministros e candidatos passam; o partido fica enquanto vencer.
- O governo age por leis. O Estado pode comprar empresas e ações e financiar obras, mas quem constrói é a economia.
- Governar é administrar a máquina pública (instituições, ministros, verbas e leis), seja de esquerda ou de direita.
- Não há meta pronta: o jogador leva o país para onde quiser.
- O jogador controla tudo o que um governo controla.
- Quando dá certo, ele sente um grupo contrário passar a apoiar, a indústria voltar a contratar, a eleição vencida por pouco. Quando dá errado, entende por quê, e nunca parece azar.
- Vê o país mudar sem placar: PIB, empresas, empregos, pessoas enriquecendo ou empobrecendo.
- O que o autor chama de "jogo não está jogável" é o jogador não sentir modificação, não importa o que faça. Dilemas, eventos e ligações genéricos não bastam.

**Público**
- O jogador é criativo, gosta de testar o extremo e de números, mesmo os que não aparecem na tela. Por isso a lei tem régua com número, não duas ou três opções em palavras.
- O autor recusou cortar um núcleo de cerca de 40 leis: o jogo deve ter centenas de caminhos. Quem foca numa área (segurança, por exemplo) pode ganhar a eleição nessa promessa.
- Isso não impede tirar leis: pode cortar mais, desde que faça sentido (regras da Parte 4). (autor, 14/nov)

**Regras**
- Perder é perder o poder federal; a partida acaba. Jogar como oposição fica para depois. (12/nov)
- Se o vice de outro partido assume, a partida também acaba (5.2). (autor, 14/nov)
- **Placar e histórico:** o jogo guarda o histórico todo do governo: PIB, Segurança, Saúde e os outros números, o que melhorou, o que foi mais atacado, quais pops mais gostaram e quais mais odiaram. De 4 em 4 anos aparece um resumão de tudo, e o placar final é esse histórico inteiro. (autor, 14/nov)
- Países reais podem entrar: as 10 maiores economias jogáveis; empresa, pessoa e direito autoral seguem de fora. (08/nov)
- A V1 jogável já tem narrativas e gatilhos; podem ser montados antes. Depois de pronta, ganha uma base de gatilhos para parecer o mais real possível. (autor, 14/nov; substitui "narrativas só depois do motor", 07/nov)
- O jogo não fala de lado político ao jogador. O lado do partido sai das pessoas da chapa.
- Fora do jogo pronto: guerra iniciada pelo país, pesquisa e tecnologia como árvore.

**Ligações**
- A visão chega às demais partes pelos princípios (1.3) e pelo ciclo (1.2).

**Referências**
- Victoria 3: só como ideia. A ligação economia, pop e política dele é a mais elogiada do gênero; Frostpunk tem ligação fraca; Democracy 4 tem ligação que ninguém entende. Nada do Democracy 4 entra (nome, número, ligação).
- Estudo de mercado do Victoria 3: `mercado-vic3-referencia.md`.
- Referência de "visão" para um jogo de governo com personagens: **ESTUDAR**.

**No motor hoje**
- Auditoria de 14/nov (`requisitos.md`, Parte 1; prova em `docs/jogo/auditoria/`): 1 certo, 10 pela metade, 4 faltam.
- Falta: histórico do governo gravado a cada turno, resumão de 4 em 4 anos, placar final, partido que continua quando muda a pessoa.
- A partida acaba só pela eleição.

**Em aberto**
- Jogar como oposição depois de perder o poder: para depois.

---

### 1.2 As 3 mecânicas

**O que é**
- O jogo gira em torno de três mecânicas, que se controlam em ciclo: **Sociedade**, **Economia** e **Máquina pública** (nomes decididos em 14/nov; antes eram Gosto, Economia e Leis).
  - **Sociedade:** os pops, uma sociedade viva que reage ao setor público. O que cada pop acha é a **Opinião**, uma peça dela. (autor, 14/nov)
  - **Economia:** empresas e os pops que trabalham nelas, dinheiro, preços e as contas do Estado.
  - **Máquina pública:** as leis e quem as executa (instituições, ministros, caixas).
- O modelo é o sistema político de David Easton (estudo em [`estudos/nomes-das-mecanicas-14nov.md`](estudos/nomes-das-mecanicas-14nov.md)):
  - **Entradas:** a Sociedade manda demandas e apoio.
  - **Conversão:** a Máquina pública transforma isso em leis e serviços.
  - **Saídas:** as leis voltam para a Sociedade e a Economia.
  - **Retorno:** a reação vira nova entrada, e o ciclo não para.
  - **Ambiente:** a Economia é o ambiente de dentro, e o **Mundo** é o ambiente de fora.
- O Easton trata o governo como "caixa-preta". O SisGov abre a caixa: instituições, ministros e Congresso mostram como se decide. Esse é o diferencial do jogo (autor, 14/nov).
- Ao redor das três ficam Política, Mídia, Mundo, Tela e Narrativas.
  - **Política** (Congresso, partidos, grupos, eleição) é o caminho pelo qual a Sociedade controla o governo.
  - **Mundo** é o ambiente de fora: outros países, comércio e preços de fora pressionam as três sem fazer parte delas.
  - **Mídia** é lente: age em cima dos fatos que já existem, não cria fato novo (14/nov).
- Cada mecânica tem seu lugar:
  - **Máquina pública:** a lei e quem a executa. Instituições, ministros, caixas e a fronteira do governo ficam aqui, porque a lei mora numa instituição e a instituição fica com um ministro (decisão C1, 14/nov).
  - **Economia:** as contas do Estado (Tesouro, receita, gasto, dívida), porque são dinheiro (decisão C1, 14/nov).
  - **Política** (em volta): presidente, vice, sucessão, pessoas e governadores (decisão C1, 14/nov).
  - A parte "Estado" deixa de existir como mecânica própria.

**O jogador** (faz e sente)
- Mexe numa ponta (uma lei) e sente a volta pela outra: o ciclo não tem começo nem fim.
- O jogo quer a ligação do Victoria 3: a economia mexe no pop, o pop mexe na política, a política (as leis) mexe na economia.

**Peças**
- **Sociedade:** os pops, uma sociedade viva que reage ao setor público. A opinião é bolso (o mais forte) mais bússola (peso menor) mais memória (14/nov).
- **Economia:** dinheiro, empresas, preços, bolsa, e as contas do Estado. Tão importante quanto as outras duas.
- **Máquina pública:** o que o governo decide (as leis), e as instituições, ministros e caixas que executam.
- **Em volta:** Congresso, eleição, partido, Judiciário, mídia, mundo, tela e narrativas.
- A bolsa é onde o ciclo vira preço: lei muda lucro, lucro muda a ação, a ação muda o patrimônio dos pops, e os pops reagem no voto e no investimento.

**Regras**
- Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. (05/nov)
- A lei não diz quem gosta dela: diz onde mexe no dinheiro e na vida, e o gosto nasce daí. A Bússola continua, com peso menor que o bolso. Tudo o que existe no ciclo tem posição na Bússola, e a distância diz quem gosta de quê, mas ela não é mais "a raiz". (14/nov)
- Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula, fica guardado ou sai do país. (14/nov)
- O porquê à vista: todo número que o jogador sente mostra de onde veio ao passar o mouse (SisGovpedia). (14/nov)
- Ordem decidida: primeiro o dinheiro (caminho e conservação), depois a opinião pelo bolso, depois a revisão das leis instituição por instituição. (14/nov)
- Cada módulo (população, leis, economia) funciona sozinho; as ligações vêm depois, no conteúdo das leis. (31/out)
- Pop, grupo e organização são camadas diferentes; organização nasce durante a partida. (06/nov)

**Ligações**

| De | Para | Como controla |
| --- | --- | --- |
| Sociedade | Economia | trabalha, consome e investe |
| Economia | Sociedade | paga salário, dá emprego e define preços |
| Economia | Máquina pública | gera o dinheiro dos impostos |
| Máquina pública | Economia | cobra, gasta e regula por lei |
| Máquina pública | Sociedade | dá serviços, renda e direitos |
| Sociedade | Máquina pública | vota, apoia e protesta |

**Referências**
- Victoria 3 (ligação economia, pop e política).
- Sistema político de Easton e a tríade Estado, mercado e sociedade civil (Bresser-Pereira), para os nomes e o ciclo (14/nov).
- Como fazer a opinião sem copiar outro jogo: **ESTUDAR**.
- Como a mídia mexe em cada uma das 3 mecânicas: **ESTUDAR** (14/nov).

**No motor hoje**
- Auditoria de 14/nov (`requisitos.md`, Parte 1; prova em `docs/jogo/auditoria/`): 1 certo, 13 pela metade, 2 faltam, 1 não se aplica.
- Hoje a satisfação do grupo lê renda, índices cobrados e bússola das leis. O bolso só se mexe por imposto de renda e transferência; as outras leis agradam ou irritam pelo ponto na bússola.
- Falta: organizações que nascem na partida; a bolsa (lei → lucro → ação → voto).

**Em aberto**
- Como a renda de cada pop sai de salário e lucro sem o turno 0 mudar de valor; quanto falta de trabalhador freia a produção.
- Opinião central: estruturar direito uma mecânica própria, com a mesma régua para todo ator, desenhada inteira antes do código e antes de padronizar as leis (10b).
- Nomes das **peças** dentro de cada mecânica: mais profissionais (autor, 14/nov). **ESTUDAR**.

---

### 1.3 Princípios (as regras que nunca mudam)

1. **Leis são o núcleo do governo.** Tudo o que o Estado faz passa por lei; mudar uma lei muda o jogo.
2. **Decisão de governo é uma bolha de lei no mapa**, nunca um painel de gestão. Decisões do partido (chapa, ministros, coligação, campanha) são escolhas curtas, sem painel. O que os outros propõem chega como papel na mesa.
   - **Lei x decisão (08/nov):** lei é regra permanente e tem bolha; decisão do presidente (Ato ou Operação) aparece ao clicar num país ou companhia, tem custo, tempo e reação, e é limitada pelas leis.
3. **Nenhuma lei é um controle só que faz coisa grande.** Cada tema se divide em leis menores, cada uma com escolha de verdade.
4. **Nada é bom ou ruim.** Toda lei tem ganhadores, perdedores e consequências; textos e cores descrevem. Parecer de direita ou esquerda é resultado, nunca objetivo. O jogo nunca fala de lado ao jogador.
5. **Nenhum dinheiro some (14/nov).** Vale para toda a economia, inclusive o ilegal. Todo real gasto, cobrado, desviado ou ganho fora da lei vira renda de alguém, circula, fica guardado ou sai do país. A corrupção vai ao bolso de alguém e deixa rastro. Para o Estado, isso quer dizer que a conta sempre fecha: todo dinheiro do Estado entra por lei ou por bem do Estado, e todo gasto sai por lei ou obrigação. Gastar exige imposto, dívida ou emissão.
6. **O que dá resultado demora.** Cada efeito declara quanto tempo leva.
7. **Decisão no turno, nada neutro.** Toda escolha mexe em algo visível; esperar também é opção. Jogável não é demorado: a decisão acontece agora, esperar é vantagem que o jogador escolhe, nunca obrigação.
8. **Dados primeiro, narrativa depois.** Frases, manchetes e eventos leem os números.
9. **Jogabilidade primeiro, realidade como base.** Lei inventada vale se plausível; número na ordem de grandeza certa, sem precisão empírica.
10. **O motor conhece o Estado, não os nomes.** Leis, índices, partidos e mídias são dados do mundo; o país declara só o estado de partida e os rótulos locais.
11. **O Congresso é a trava, não o jogo.** O jogador propõe qualquer coisa; o exorbitante o Congresso barra. Fora isso, o que segura é a consequência. Aprovar não pode travar o jogo; o Congresso é a voz dos grupos, junto com a mídia (autor, 14/nov).
12. **Pessoas são fichas, não roteiros.** O que elas fazem sai da ficha e do país, não de história escrita.
13. **Toda lei chega ao pop.** Por renda, emprego, preço, serviço ou direito.
14. **O resultado emerge.** A lei não traz condição escrita ("se pobreza > X"); a mesma lei muda de sentido pelo estado do país, pela renda contra a conta.
15. **Lados equilibrados.** A lei vai de "nada" a "mais" num lado só; os dois lados da Bússola têm leis próprias.
16. **Texto para leigo.** Lei e opção com exemplo do dia a dia, sem jargão, sem cortar a régua numérica.
17. **Simulador de governo, não de personalidade.** Cada decisão deve ter consequência própria e sentida.
18. **Sem pontos de ação.** O limite vem do mundo (Congresso cheio) e só atrasa, nunca proíbe. (11/nov)

**No motor hoje**
- Auditoria de 14/nov (`requisitos.md`, Parte 1; prova em `docs/jogo/auditoria/`): 2 certos, 14 pela metade, 2 errados, 2 faltam, 3 não se aplicam.
- Errado: **dinheiro some** (princípio 5): a conta do Estado fecha, mas a verba gasta só vira renda nas 4 leis que pagam pops; as outras leis de verba tiram do cofre e o dinheiro desaparece.
- Errado: **o Congresso barra toda lei sem maioria** (princípio 11), não só a exorbitante, e recusa repropor a barrada.
- Falta: o molde não impede lei de controle único (princípio 3); lei não declara ganhadores e perdedores (princípio 4), eles só saem do cálculo por grupo.

---

### 1.4 A partida: começo, mandato e fim

**O que é**
- O esqueleto do jogo: escolher o país, montar o começo, passar turnos, acabar.

**O jogador** (faz e sente)
- Escolhe o país e cria o partido com nome e sigla. Não escolhe lado, posição nem bússola.
- Monta a chapa de três vagas (presidente do partido, candidato a presidente, vice) com pessoas de todos os partidos; é assim que nascem as coligações. A chapa já venceu.
- Monta o governo: primeiro o tamanho numa régua (Enxuto, Clássico, Do país, Inchado), depois as caixas e os ministros.
- Inicia e governa.
- Conhece cada pessoa pelo perfil de rede social dela, sem rótulo de lado: o jogador deduz, como na vida real.
- Descobre o lado do próprio governo pelas consequências, não por um rótulo.
- Sente o que é difícil: o resultado demora, cada lei agrada um grupo e irrita outro, aliado cobra, a mídia decide o que o eleitor vê, o desgaste sobe sempre.

**Peças**
- Começo da partida.
- Fatos do turno.
- Fim e placar.
- Salvar e carregar.
- A rede da pessoa e a inteligência (botão Espiar, registro que pode vazar).
- Histórico do país: cada país declara golpes, crises, guerras, governos, empresas e mídias tradicionais; o que não declara, os geradores criam. Nenhuma empresa real.

**Regras**
- Como se chega lá: o país começa como está e o partido que governava vira oposição. O jogador entra com uma história ("no meio de uma polarização, você surge como a salvação do país"): partido novo, poucas cadeiras, presidente popular. A Aprovação começa alta e a base se constrói com coligação. (12/nov)
- A Aprovação inicial é declarada pelo país, como o resto do estado de partida. Não há "lua de mel" como regra à parte. (autor, 14/nov)
- No começo, o jogador pode pôr o partido que governava na coligação. (12/nov)
- Partido novo com 6% das cadeiras; o antigo governo vai para a oposição ou para a coligação.
- Governo: o tamanho vem numa régua; os ministros são sorteados pela chapa e cada cadeira troca por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista. (13/nov)
- Os ministros fazem parte da partida desde o começo: a tela de início e o passo "Governo" da ordem de construção os incluem. (12 e 13/nov)
- A rede é uma só, sem nome, e resume todas as redes do país. Informações pessoais aparecem conforme a Verba de inteligência e os Poderes da agência; espiar fere a privacidade e fica num registro que pode vazar. (07/nov)
- Mandato: a duração da lei do país (4 anos = 24 turnos). No fim há eleição; vencer abre outro mandato, com desgaste maior.
- A partida termina quando o partido perde o poder federal. Não há vitória final: o placar é quanto tempo o partido governou e que país deixou.
- Tela de início em sequência: país, partido, chapa, governo, ministros, iniciar. (13/nov)
- O lado do partido sai da média da bússola da chapa, que define os 5 grupos que ele defende. (12/nov)
- A sigla do partido vira o id e não pode repetir a de outro. (12/nov)
- Salva sozinho; menu no brasão. (R17.3, R17.23)
- Sem pontos de ação por turno (princípio 18). (11/nov)

**Ligações**
- Recebe: país (dados em `conteudo/paises/<id>/`: estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos).
- Entrega: partido e chapa ao Partido e à Política (base de grupos e posição na bússola); governo e ministros a Leis (instituições, ministros, caixas); fatos do turno a Congresso, mesa, mídia, programas e eleição.
- Fato do turno é um aviso que um módulo deixa e quem se importa lê: liga Congresso, mesa, mídia, programas e grupos sem um chamar o outro.

**Referências**
- Jogo de partida com começo escolhido e fim por perda do poder: **ESTUDAR**.
- Rede social do político como forma de conhecer pessoa: **ESTUDAR**.

**No motor hoje**
- Auditoria de 14/nov (`requisitos.md`, Parte 1; prova em `docs/jogo/auditoria/`): 20 certos, 5 pela metade, 1 errado, 3 faltam.
- Certo: país, partido, sigla, chapa, coligação, 6% das cadeiras, ministros, tela de início, salvar.
- Errado: a Aprovação declarada pelo país (`popularidade_governo`) ninguém lê; a Aprovação que vale é a satisfação média dos grupos menos o desgaste.
- Falta: placar final (histórico do governo), espiar pela inteligência e o registro que vaza.
- Velho no número: mandato de 24 turnos e desgaste por turno fixos no código, sem ler a duração do mandato do país.

**Em aberto**
- A história de entrada aparece como texto, tela ou só nos números?
- O que um país precisa declarar para ser jogável (lista de arquivos obrigatórios)? Só o Brasil 2026 existe.
- Quais mecânicas ainda não escrevem fato (ministro, instituição, economia, mundo) e quais fatos cada uma precisa.
- Regras de encadeamento: fato gera fato (escândalo, CPI, queda).
- Os outros caminhos de perder o poder (mecânica 12) e o placar final.
- Partida salva antiga quando o formato muda (hoje se perde ou se remenda no código).
- Ministros: a memória de 30/out está velha; refazer com o que já existe e o que falta (decisão C2, 14/nov).

---

### 1.5 O turno

**O que é**
- Um turno dura 2 meses (6 por ano).
- Em código: `avancarTurno(regras, estado, pedidos)` devolve um novo estado; mesma semente e mesmos pedidos dão a mesma partida.

**O jogador** (faz e sente)
Cinco passos:
1. **Lê o país** no mapa: bolhas de leis e índices, grupos satisfeitos ou não, mídias, países, manchetes.
2. **Age:** propõe leis (vendo antes quem ganha e quem perde), troca ministro, negocia com aliados; em tempo de campanha, faz campanha.
3. **Despacha a mesa:** assina, veta, recusa, encaminha ou deixa na pilha os papéis.
4. **O Congresso vota.** Passa quem tem votos; o exorbitante cai.
5. **Passa o turno:** efeitos chegam, alguns agora, outros anos depois; a mídia reage; acontecem fatos (escândalo, choque de preço, atentado).

**Peças**
Ordem das etapas no motor hoje (passo 8):
1. Congresso. 2. Leis novas. 3. Efeitos. 4. Economia real. 5. Preços e juros. 6. Contas. 6b. Moradia. 7. Jogabilidade. 8. Pops e grupos. 8b. Governo. 8c. Programas. 9. Política. 9a. Eleição. 9b. Mídia. 10. Invariantes.
- Detalhe de cada etapa: `src/motor/turno/turno.md`.

**Regras**
- O estado anterior não muda; o acaso mora no estado.
- Lei do mundo fora da lista do país fica não legislada: não arrecada, não gasta, não mexe em índice. Um pedido a legisla e os efeitos andam de zero até o valor novo.
- Cada efeito declara quanto tempo leva para chegar inteiro (princípio 6). Atraso zero quer dizer que o efeito vem no turno seguinte. (14/nov)
- O módulo `turno` só chama os módulos em ordem e junta os fatos; a regra fica no módulo dela. Hoje o `turno` tem cerca de 2.500 linhas com regra dentro, para tirar aos poucos.
- Fatos do turno somem em 1 a 3 turnos, pelo tamanho. (12/nov)
- A seta de tendência na tela compara com 8 meses atrás, corte de 2 pontos.
- Sem sorteio para a lei passar: a aprovação vem do Congresso e dos grupos. (14/nov)
- Mudar de ideia custa: propor e desistir de uma lei não pode ser de graça. (14/nov) Paga-se nas duas pontas: o Congresso perde paciência (propor a mesma lei de novo fica mais difícil) e o presidente perde Aprovação. (autor, 14/nov)
- Mostrar o atraso: a lei diz "efeito em N turnos". (14/nov)

**Ligações**
- O turno chama Congresso, efeitos, economia, contas, moradia, população, grupos, governo, programas, política, eleição e mídia, e fecha conferindo invariantes. A ordem por mapa de dependência está em `docs/jogo/arquitetura.md`.

**Referências**
- Plano de desenvolvimento (a ordem das etapas veio da seção 5 do plano).
- Referência externa de ordem de turno em simulador de governo: **ESTUDAR**.

**No motor hoje**
- Auditoria de 14/nov (`requisitos.md`, Parte 1; prova em `docs/jogo/auditoria/`): 11 certos, 9 pela metade, 1 falta.
- Certo: turno de 2 meses, mesma semente dá a mesma partida, efeito anda em rampa e chega inteiro no fim do atraso, fatos somem pelo tamanho.
- Falta: desistir de uma lei (não existe pedido de retirar).
- Duplicado: o atraso da prévia não usa o ajuste do ministro e o do turno usa; os números podem divergir.

**Em aberto**
- A ordem das etapas fica certa quando entrarem mídia, organizações e mundo? (quem lê o fato de quem no mesmo turno)
- Efeito da mídia: hoje o jornal só mostra manchetes e nenhuma notícia mexe em grupo, voto ou aprovação. A mídia deve agir em cima dos fatos que já existem (lente); falta estudar como (ver 1.2).

---

## Parte 2. Sociedade (a população e como ela funciona)

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`. O GDD é a meta; onde o motor está atrás (grupos 16 contra 25, pops 25 contra 32), isso vem dito em "No motor hoje".

**Abertura.**

- População, Economia e Governo controlam uns aos outros, com a População no centro. O ciclo não tem começo nem fim.
- A população trabalha, consome e investe (para a Economia). Vota, apoia e protesta (para o Governo). A Economia paga salário, dá emprego e define preços. O Governo dá serviços, renda e direitos.
- Política não é um quarto pilar. Partidos, grupos, Congresso e eleição são o caminho pelo qual a População controla o Governo.
- Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que só mexe na opinião não basta.
- **Opinião = bolso (mais forte) + bússola (peso menor) + memória (14/nov).** A lei não diz quem gosta dela: o gosto nasce do que o motor calcula. A bússola continua, como a parte da ideologia, mas não é mais a raiz do jogo.
- Três camadas (06/nov): o **pop** é quem a pessoa é na economia. O **grupo** é como as pessoas agem juntas na política. A **organização** tem nome, líder e ação própria.
- **A mídia é lente (14/nov).** Ela age sobre fatos que já existem e não cria gosto novo. Em cada seção abaixo há uma linha "Mídia" dizendo o que as fontes já decidem e o que falta ESTUDAR.
- Referência da ligação "a economia mexe no pop, o pop mexe na política, a política mexe na economia": Victoria 3, elogiado pelos jogadores. Outros jogos são criticados por ligação fraca (Frostpunk) ou que ninguém entende (Democracy 4).

---

### 2.1 Pops e renda

**O que é.** Um pop é uma fatia da população (uma profissão num estrato) que trabalha, ganha, consome e vota. É o centro do jogo.

**O jogador** (faz e sente)
- Não escolhe pop. Ele passa leis, e cada pop sente de um jeito.
- Quando a economia muda, cada pop sente de um jeito, e a renda nunca é uma parte fixa do PIB.
- Na tela vê o país mudar sem placar: pessoas enriquecem ou empobrecem, empregos aparecem ou somem.

**Peças**
- **Tipos:** 32 pops em 4 blocos: fora do trabalho (5), donos (5), conta própria (4) e empregados (18).
- **Como separar:** primeiro a situação (trabalha ou não), depois o vínculo e a ocupação. Estudantes, Aposentados e Crianças não têm estrato fixo.
- **Dados de cada pop (colunas da planilha):** tamanho, estrato, renda (vezes a média), bússola econômica e social, onde trabalha, se vive de lucro, para onde sobe e desce, para onde pode estudar.
- **Dados dentro do pop:** faixas de idade, cidade ou campo, vínculo de trabalho (formal, informal, público, próprio), escolaridade (fundamental, médio, superior), patrimônio e filhos por pessoa.
- **Renda:** sai de salário, lucro, aluguel e transferência, nunca de uma parte fixa do PIB. Hoje, a renda disponível é a bruta menos imposto mais transferência.
- **Subir e descer de estrato:** pela renda real contra o esperado. Sobe só com o índice exigido (ex.: instrução). Até 1% do pop por turno e 30% do total declarado. Pobre não desce e rico não sobe.
- **Estudar e mudar de setor:** até 0,5% do pop por turno vezes a instrução. O destino precisa pagar 5% a mais.
- **Cesta e bolso (feito no motor):** compara o preço da cesta com a renda de cada pop e mostra fome e carência. Conta quantos ficam abaixo da renda necessária para pagar conta, plano ou casa.
- **Ponto de partida do estudo (Ipea, Brasil 2021):** a revisão mapeia cada pop no estudo do Ipea.

**Regras**
- 32 pops em 4 blocos, com crianças, estudantes e aposentados sem estrato fixo.
- Renda vem de salário, lucro, aluguel e transferência (05/nov).
- Cada pop tem a sua bússola (R11.7, 03/nov).
- A lei vai ao pop pelo bolso: o motor calcula o efeito em cada pop (14/nov).
- Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula, fica guardado ou sai do país (14/nov).
- Resultado emerge: a lei muda só um número. Se ela é boa ou ruim sai da renda do pop contra a conta, nunca de condição escrita na lei (04/nov).
- A cesta é uma fatia da renda por estrato (meta do GDD).
- Decidido em 15/nov (fase dos pops):
  - Estudantes, Aposentados e Crianças são pops separados; cada um guarda por dentro a divisão entre pobre, médio e rico.
  - Renda por fonte: cada setor tem um tamanho (no turno 0, o que os pops de hoje dão) e paga salário e lucro aos pops que estão nele. A Economia completa (3.3, 3.4) depois só calcula melhor esse tamanho.
  - Quem não tem setor tem a renda ligada à de quem paga por ele: a doméstica à das famílias média e rica, o vendedor de rua à dos pobres.
  - Fontes da renda (15/nov): salário de setor (anda com capacidade e preço do setor); lucro de setor (a parte de dono); salário do Estado (anda com o gasto público; parte paga pelo Estado: servidores, militares, policiais e altos funcionários 100%, professores 80% (mais de 80% das matrículas são públicas), saúde 60% (55% dos médicos e 62% da enfermagem com vínculo público)); pago por outros pops (domésticos pelos médios e ricos, informais pelos pobres; números para calibrar); desvio (a corrupção do órgão vira renda de altos funcionários e de quem tem contrato com o Estado).
  - Aposentado vive da aposentadoria, se a lei existir; desempregado do seguro por um tempo, se existir, depois de bico ou da família; estudante de bolsa ou bico. A transferência passa a poder mirar um pop, não só um estrato. No turno 0 tudo fica igual, menos esses pops, cujo dado do Brasil está errado (aposentados 1,4% da população) e será acertado.
  - Limite assumido: a verba muda quem recebe, não o tamanho do PIB (o PIB anda pela capacidade). O gasto puxar a economia fica para a Economia.
  - Terceiro caminho: o pop também muda para outro pop da mesma faixa quando o destino paga mais (ex.: o eletricista que abre a oficina vira Autônomo com negócio). É onde ligam as leis de quem trabalha por conta própria.
  - Fase dos pops, na ordem: 31 pops, renda por fonte, desemprego, cesta e padrão de vida, demografia, estados, saída, lugar das tomadas de serviço e direito, organizações.

**Ligações**
- Recebe da Economia: salário, emprego, preços, lucro, aluguel.
- Recebe das Leis: renda direta (imposto de renda e transferência), mudança de pop, serviço.
- Entrega à Economia: trabalho, consumo e investimento.
- Entrega aos Grupos: os pops são a base dos grupos (cada grupo soma frações dos pops).
- Entrega à Bolsa: o patrimônio dos pops muda com a ação, e eles reagem no voto e no investimento.
- Mídia: a mídia não muda a renda nem o preço. Ela só decide o quanto o pop percebe e como conta o que ele vive. **ESTUDAR** como a mídia entra no bolso.

**Referências**
- Victoria 3: pops no centro (prédio sem pop não faz nada; pop com salário compra).
- Ipea Nota Técnica 64: ordem situação, vínculo, ocupação.
- OIT (ISCO-08, ICSE-18, força de trabalho), Oesch, Great British Class Survey, Pew, ESeC: cada um dá um corte da lista de pops. O ESeC diz que 25 a 35 pops bastam para um jogo.
- Democracy 4: a pessoa em vários grupos para o voto.

**No motor hoje**
- ◐ R11.1 Pops com renda da economia (B1, 15/nov): salário e lucro de setor, salário do Estado, pago por outros pops e desvio da corrupção (B2: verba × corrupção × 0,3; altos funcionários, grandes empresários e industriais); quem não trabalha vive de família ou bico, mais as transferências do país (B3: a transferência pode mirar um pop; aposentadoria vai aos aposentados, bolsa de pesquisa aos estudantes; no Brasil os aposentados passaram de 1,4% a 12% da população). Seguro-desemprego vem no passo C.
- ✅ R11.5 Pops mudam de setor estudando. ✅ R11.6 Sobem e descem de estrato. ✅ R11.7 Cada pop tem bússola e desliza com a vida.
- ☐ R11.8 Dados dentro do pop. ☐ R11.12 31 pops em 4 blocos, com crianças. O motor tem 25 tipos (8 pobres, 11 médios, 6 ricos); o GDD é a meta.
- A cesta no motor dá a mesma quantia por pessoa; a meta é a fatia da renda por estrato.
- O índice Desemprego e o pop Desempregados ainda não se ligam. O emprego e o salário saem da renda do pop, não o contrário.
- Uma lei só (Transferência de renda) divide verba para um estrato.

**Em aberto**
- Quantos tipos de pop rodam de verdade no motor sem pesar.
- Como a lei mira "idosos do campo" sem multiplicar pops.
- Como a renda sai de salário e lucro sem o turno 0 mudar de valor.
- Como a conta do bolso de Crianças lê a família (Crianças não têm renda própria).
- Faltam pesca e artesãos como pops próprios? O estudo diz que faltam; a revisão trata pesca em "Pequenos agricultores e pescadores".

---

### 2.2 Demografia (vida)

**O que é.** Gente nasce, envelhece e morre. Jovem vira estudante e trabalhador. Idoso se aposenta.

**O jogador** (faz e sente). É daqui que saem a Previdência, a escola e a procura por saúde. O jogador sente isso pelas leis dessas áreas. (Como ele vê, não está decidido.)

**Peças**
- **Faixas de idade dentro do pop:** criança, jovem (15 a 29), adulto (30 a 59) e idoso (60+).
- **Filhos por pessoa:** quantas crianças dependem de cada pessoa do pop, em média. Liga com benefício por filho, natalidade e bolso.
- **Nascido fora (08/nov):** dado dentro do pop, com o país de origem e a situação (legal, sem documento, refugiado). Alimenta imigração, remessas e a tensão com imigrantes.
- **Pops que mudam:** estudar e ir ao setor que paga mais leva turnos.

**Regras**
- Imigração aumenta o PIB. O salário cai um pouco só nos pops parecidos com os imigrantes. O crime não sobe por ser imigrante, e sim pelo desemprego e pela falta de acesso a serviços (08/nov).
- Natalidade e mortalidade pelo padrão de vida: é o que o estudo propõe aproveitar do Victoria 3, ainda sem decisão do autor. Ver 2.3.

**Ligações**
- Entrega à Previdência, à Educação e à Saúde (idosos, estudantes, procura).
- Recebe do Mercado: o pop estuda e vai ao setor que paga mais.
- Entrega à Economia (imigração e PIB).
- Mídia: a mídia pode dar tom à tensão com imigrantes sobre fatos que já existem (desemprego, serviços). **ESTUDAR.**

**Referências**
- Victoria 3: natalidade e mortalidade caem quando o padrão de vida sobe, a mortalidade mais rápido. Abaixo de um ponto a população encolhe.
- Pew: idade, escolaridade e lugar separam muito a política (EUA).
- OIT: quem tem idade de trabalhar se divide em empregado, desempregado e fora da força de trabalho.

**No motor hoje**
- ☐ R11.9 Nascer, envelhecer, morrer. ☐ R11.8 Dados de idade dentro do pop.
- Estudantes e Aposentados têm tamanho fixo.
- Pessoas (elenco): idade de 35 a 74, e envelhecer, aposentar e morrer ainda não existem.
- Imigração (nascido fora): sem R próprio na seção 11 dos requisitos.

**Em aberto**
- Regras e números de nascer, envelhecer e morrer, e como ficam nas faixas do pop.
- Números de natalidade e mortalidade; como mexem em Previdência, escola e saúde.

---

### 2.3 Padrão de vida

**O que é.** No Victoria 3, o padrão de vida (1 a 99) de cada grupo de pessoas vem da renda líquida contra o custo das necessidades. No SisGov, o padrão de vida é a leitura da vida do pop: o que ele ganha contra o que precisa pagar. Hoje ele se apoia na **cesta** (fome e carência) e no **bolso** (quem paga conta, plano ou casa). O que importa para o jogo é a **variação**: a piora do padrão de vida é o que gera radicais (14/nov, ver 2.6).

**O jogador** (faz e sente). Sente pelas consequências: fome, contas que não fecham, gente que se radicaliza quando a vida piora.

**Peças**
- **Cesta e bolso:** ver 2.1.
- **Índice "Padrão de vida":** existe e os grupos o cobram (ex.: Sindicatos pedem "mais Padrão de vida, menos Desemprego, mais Saúde").

**Regras**
- Radicais nascem da **piora** do padrão de vida, não do nível (14/nov).
- Preço alto dos bens encarece as necessidades e derruba o padrão de vida.

**Ligações**
- No Victoria 3, o padrão de vida mexe em natalidade, mortalidade, lealdade (radicais e lealistas) e na força política do grupo.
- Entrega ao bolso do gosto (2.4) e aos radicais e lealistas (2.6).
- Mídia: a mídia não muda o padrão de vida; ela muda o quanto a piora é notada e culpada em alguém. **ESTUDAR.**

**Referências.** Victoria 3, diário 13 (padrão de vida). O estudo recomenda aproveitar "quase tudo" para população e grupos: padrão de vida por grupo (renda × custo de vida), radicais e lealistas pela **variação**, e natalidade e mortalidade pelo padrão. O estudo é de 22/out e "não decide nada"; a parte dos radicais foi decidida pelo autor em 14/nov.

**No motor hoje.** Não há padrão de vida por pop. Cesta e bolso existem. Os radicais ainda crescem pelo nível da satisfação (ver 2.6).

**Em aberto**
- ~~O padrão de vida vira um número por pop?~~ Decidido em 15/nov: sim, um número por pop (renda real ÷ custo da cesta e das contas); é a base dos radicais e da saída.
- O bolso do gosto (renda, preço do que ele compra, emprego, serviço que recebe) é a mesma coisa que o padrão de vida, ou o padrão é só uma parte dele?

---

### 2.4 Opinião (interesse, ideologia e memória)

**O que é.** A régua comum de gostar e não gostar, para todo ator, feita de bolso, ideologia e memória.

**O jogador** (faz e sente)
- Quando dá certo: um grupo que estava contra passa a apoiar; a eleição é vencida por pouco.
- Quando dá errado: entende por quê. Nunca parece azar.
- **Porquê à vista:** ao passar o mouse, cada parte com o seu número ("Operários: −6 imposto, +4 salário mínimo, −3 ideologia"), como faz o CK3. Todo número que o jogador sente mostra de onde veio (SisGovpedia).
- A SisGovpedia é uma enciclopédia em camadas: a frase curta, depois o porquê, depois a conta.
- A bússola é interna: o jogador não a vê, só sente o apoio, a satisfação e os votos. O jogo nunca fala de lado político ao jogador.

**Peças**
- **Bolso (o mais forte):** renda, preço do que ele compra, emprego, serviço que recebe. Calculado pelo motor a partir do que a lei mexe.
- **Ideologia (bússola), com peso menor.**
- **Memória:**
  - Tirar dói mais do que dar agrada (no CK3, aumentar exigência custa −15 e reduzir dá +5).
  - O ganho de um benefício antigo some com o tempo, mas a raiva de cortar continua.
  - O eleitor julga a melhora, não o ideal: desemprego de 12% caindo a 10% agrada; de 6% subindo a 8% irrita.
  - Mágoa passageira: pontos da bússola com força descontada pelo tempo (hoje, o ministro demitido). Cada grupo perde força vezes parecença, e as mágoas somadas tiram no máximo 15 pontos.
- **Satisfação do grupo (como funciona hoje):** 0 a 100, começa em 50 (o marco do turno 0) e soma renda, índices cobrados e leis.
  - Renda: 1 ponto por 1% de diferença, até ±25, contra a renda esperada. Crescer no ritmo normal não agrada ninguém.
  - Índices cobrados: 1 ponto por ponto, até ±15 por índice.
  - Leis (bússola): quanto cada lei se aproximou do grupo desde o marco. Uma lei move o grupo no máximo ±15.
  - Na meta do GDD, a satisfação é renda contra o esperado, leis perto ou longe, e o que a mídia que o grupo vê diz.
- **Raiva do grupo (0 a 100):** separada da satisfação.
- **Aprovação:** satisfação média dos pops, pesada pelo tamanho; é lida pelo Congresso e pela eleição (R9.9).
- **Lista à mão de quem gosta:** evitar. Tropico, Stellaris e Democracy 4 fazem isso, e o veterano adivinha tudo; vira tarefa; "falta contexto". Com 500 leis, vira sorteio.
- **Régua para todo ator** (ideia do autor, 13/nov): grupo, partido, ministro, juiz, mídia e potência com a mesma régua, feita de ideologia, interesse e memória que some com o tempo, e faixas que destravam o que o ator faz (apoia, cobra, protesta, trai).
- **A rede da pessoa e o Botão Espiar:** ver a subseção abaixo.

**Regras**
- A lei não diz quem gosta dela (14/nov).
- Opinião = bolso (mais forte) + bússola (peso menor) + memória (14/nov).
- Tirar dói mais do que dar agrada (14/nov).
- Benefício vira costume; a raiva de cortar fica (14/nov).
- Eleitor julga a melhora, não o nível (14/nov).
- Porquê visível ao passar o mouse (14/nov).
- Evitar lista à mão de quem gosta (14/nov).
- Uma lei nunca decide sozinha o humor de um grupo: limite de ±15 (01/nov).
- Até a mídia pesar, a troca de ministro cobra direto nos grupos parecidos com quem saiu (13/nov).

**Mídia como lente (14/nov).** A mídia age sobre fatos que já existem e não cria gosto novo. O efeito da lei na opinião deve passar pela mídia (R14.2 ☐) e a mídia mobiliza a raiva (R14.9 ☐). **ESTUDAR** como ela mexe em cada uma das três peças do gosto: no bolso (o que o pop percebe), na bússola (empurra quem a assiste, R14.8 ☐) e na memória (o que fica lembrado e por quanto tempo).

**Ligações**
- Recebe das Leis: onde a lei mexe no dinheiro e na vida (quem paga, quem recebe, preço, emprego, serviço).
- Recebe da Economia: renda, preço, emprego.
- Recebe da Bússola: a ideologia.
- Recebe de Índices: grupos cobram índices.
- Recebe da Mídia (falta): ver acima.
- Entrega ao Congresso: nota do partido soma grupos que ele defende, povo (grupos pesados por pessoas), aprovação do governo.
- Entrega ao partido: o termômetro anda 1/4 do caminho até a satisfação dos grupos dele.
- Entrega à Eleição: aprovação (R9.9).

**Referências**
- Memória, nomes da literatura (estudo 14/nov, [`estudos/nomes-das-mecanicas-14nov.md`](estudos/nomes-das-mecanicas-14nov.md)):
  - Tirar dói mais: **aversão à perda** (teoria da perspectiva, Kahneman e Tversky); a aprovação cai mais na piora do que sobe na melhora (Kappe, 2013).
  - O benefício vira costume: **retroalimentação de políticas** e **efeito catraca**; o programa cria quem o defende, e cortar vira "fugir da culpa" (Pierson; Huber e Stephens).
  - O eleitor julga a melhora: **voto retrospectivo** (Fiorina, 1981); olha o passado recente do país, não só o próprio bolso.
  - Apoio que segura o governo na crise: **apoio difuso** contra **apoio específico** (Easton).
- Na tela, "bolso" continua; no GDD, a parte chama **interesse** (14/nov).
- CK3: cada causa da opinião visível ao passar o mouse; −15 contra +5.
- Victoria 3: padrão de vida caindo e desemprego radicalizam; riqueza dá peso político. Ponto fraco: o porquê nem sempre aparece.
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
- Frostpunk e Democracy 4: ligação fraca ou opaca.
- Aviso das próprias fontes: elas "podem estar velhas" e são lição, não conteúdo.

**No motor hoje**
- Satisfação lê renda, índices e leis pela bússola. ◐ R11.4 (falta mídia e programas).
- O bolso só se mexe por imposto de renda e transferência. As outras cerca de 480 leis agradam ou irritam só pelo ponto chutado na bússola. A verba gasta não chega a ninguém, exceto a transferência.
- ◐ R11.19 Raiva separada da satisfação.
- ☐ Memória, faixas e régua comum para todo ator: tudo "A pensar".
- A seta de tendência na tela compara com 8 meses atrás (corte de 2 pontos); o voto ainda não a usa.
- Ordem decidida: primeiro o dinheiro (caminho e conservação), depois a opinião pelo bolso, depois a revisão das leis instituição por instituição.

**Em aberto**
- Os pesos entre bolso, ideologia e memória.
- Como o bolso de um pop vira gosto do grupo que o atravessa.
- Como mostrar sem virar painel.
- Escala da régua (0 a 100? −100 a +100?) e se ela substitui satisfação, termômetro e opinião das potências ou fica por cima.
- O que fica lembrado (traição, promessa, programa, escândalo), com que força e em quanto tempo some.
- Em cada faixa, o ator apoia, cobra, protesta ou trai? Quais ações cada tipo tem?
- O limite de ±15 por lei e a fórmula da distância valem como a "parte política" do gosto, ou mudam com o bolso e a memória?
- "Evitar lista à mão" vale também para o Congresso? O partido "defende" grupos por lista.

#### A rede da pessoa

Cada pessoa da lista tem um perfil de rede social, como o de uma rede real. É por ele que o jogador conhece a pessoa:

- **O que ela posta:** opiniões, fotos, o que anda curtindo, quem segue.
- **Onde ela vai e o que frequenta:** lugares, eventos, companhias.
- **O que ela diz sobre os temas do país:** a opinião aparece em texto solto, nunca como rótulo de esquerda ou direita.

O perfil é gerado da ficha da pessoa (bússola, origem, grupos, honestidade). Nada diz "esta pessoa é de tal lado"; o jogador deduz, como na vida real.

**A rede do presidente e a inteligência (07/nov).** A rede é uma só, sem nome, e resume todas as redes do país: o jogador sente o país vivo. Ela é diferente das redes das empresas, que são prédios da economia. Cada perfil tem **"Informações pessoais descobertas"**, uma narrativa gerada da ficha da pessoa. Quanto mais Verba de inteligência e Poderes da agência, mais aparece: onde trabalha, rotina, o que gosta e não gosta, o que assiste, opiniões pelos posts compartilhados, com quem fala, dívidas e segredos. O jogador deve pensar "eles têm todos esses dados?". Proteção de dados alta reduz o que se vê; cada espiada pode vazar e virar escândalo.

**Botão Espiar.** A partir do nível médio de inteligência, ver dados pessoais é uma espiada que fere a privacidade e fica num **registro**. O registro pode vazar um dia (pela Independência dos investigadores, pela imprensa livre, pela corrupção interna da agência, pelo Controle da agência) e virar escândalo. A chance sobe com a importância de quem foi espiado: espiar um zé-ninguém quase ninguém procura; espiar um líder, juiz ou jornalista, sim.

---

### 2.5 Bússola

**O que é.** A régua comum das peças: dois eixos de −1 a +1, que mostra para onde as escolhas levam o país, sem decidir nada sozinha. No gosto ela é a parte da ideologia, com peso menor que o bolso (14/nov).

**O jogador** (faz e sente)
- Não vê a bússola. Sente o apoio, a satisfação e os votos.
- O jogo nunca fala de lado político e nunca pede que o jogador escolha um lado. O lado do partido sai das pessoas da chapa.
- "Parecer de direita ou de esquerda é resultado, nunca objetivo."

**Peças**
- **Eixos:** `economico` (esquerda − ↔ direita +) e `social` (libertário e verde − ↔ autoritário e tradicional +). O meio ambiente mora no lado de baixo do eixo social (01/nov).
- **Peso por eixo:** cada grupo declara o quanto liga para cada eixo (0 a 1).
- **Quem tem posição:** leis (um ponto por opção, ou um em cada ponta da faixa), partidos, grupos, pops, mídias, ministros, países e juízes.
- **Posição do país:** média das leis vigentes, com peso por lei.
- **Pops deslizam devagar (a bússola do pop move):** a vida deles puxa (renda real abaixo do esperado puxa para a esquerda, acima para a direita, só no eixo econômico) e o governo também (satisfeito se aproxima da posição do país; insatisfeito se afasta, os dois eixos). Até ±0,02 por eixo por turno. Teto: 0,3 de onde começou. Isso muda os votos do Congresso e a satisfação.
- **Bússola do grupo:** a declarada mais a média, por pessoas, do deslize dos pops dele.
- **Padrões:** o jogo percebe padrões (cortar várias verbas é "corte de gastos") sem lei com esse nome.
- **Lei no motor:** a lei diz onde fica na bússola, nunca qual grupo gosta dela. Lei sem bússola não mexe na ideologia de ninguém.

**Regras**
- Quem gosta sai da distância, nunca de uma lista de grupos na lei (01/nov).
- Lei grande empurra mais o país.
- Eixo GAL-TAN (Chapel Hill) para o social (01/nov).
- A bússola continua como a parte da ideologia na opinião, com peso menor que o bolso (14/nov).
- Grupo novo só declara a própria posição; nenhuma lei precisa mudar.
- O jogo nunca escreve "esquerda" ou "direita" ao jogador (princípio 4).
- A bússola do pop move (03/nov).

**Mídia como lente.** A mídia empurra quem a assiste: decidido no GDD, e o motor deixa "para depois" (R14.8 ☐). Como lente, ela puxa a bússola do pop sobre fatos que existem, sem inventar posição. **ESTUDAR** o tamanho do empurrão e quem a mídia alcança.

**Ligações**
- Entrega às Leis e aos Grupos: a distância.
- Entrega ao Congresso: o partido nasce dos grupos que defende; a bússola do partido é a média deles.
- Entrega à Chapa e às pessoas do elenco: a bússola da pessoa é em torno da do partido de origem (desvio 0,25); técnico em torno do centro (desvio 0,45).
- Entrega ao Partido do jogador: a bússola é a média da chapa.
- Recebe da Mídia (falta).

**Referências**
- Chapel Hill (GAL-TAN) para o eixo social.
- Lipset e Rokkan: quatro divisões históricas, garantem grupos dos dois lados de cada divisão.
- Terceiro eixo (paz × militarismo): **ESTUDAR**, "precisa de estudo".

**No motor hoje**
- ✅ R8.1 eixos. ✅ R8.2 posição de leis, partidos, grupos e potências. ✅ R8.3 país = média das leis. ✅ R8.4 quem gosta sai da distância.
- ◐ R8.5 pops deslizam com a vida (feito) e com a mídia (falta; R14.8).
- ☐ R8.6 padrões.
- Falta: mídias e organizações com posição usada no motor.

**Em aberto**
- Entra um terceiro eixo (paz × militarismo, talvez um cubo)? Precisa de estudo.
- Quais padrões existem, quem os lê (mídia, grupos) e o que causam.

---

### 2.6 Grupos de interesse

**O que é.** Pops organizados pelos seus interesses, que atravessam os pops: cada pop se divide entre vários grupos, em partes diferentes.

**O jogador** (faz e sente)
- Vê um grupo que estava contra passar a apoiar.
- Ir contra um grupo forte custa mais, mas o jogador continua livre.
- Grupo descontente fala com o ministro da instituição dele; sem ministro, vai direto ao presidente ou pressiona pelo Congresso (13/nov).

**Peças**
- **25 grupos em 3 tipos:** econômicos (10), identidade e valores (9) e causa (6).
- **Lista da planilha:** Sindicatos, Sem trabalho formal, Servidores públicos, Educação e saúde, Pequenos negócios, Classe profissional, Indústria e grandes empresas, Finanças, Agronegócio, Agricultura familiar e sem-terra, Religiosos conservadores, Religiosos sociais, Laicos, Direitos e minorias, Povos originários, Regionalistas, Nacionalistas, Aposentados e idosos, Jovens e estudantes, Ambientalistas, Armamentistas, Lei e ordem, Militares e polícia, Liberais de mercado, Cultura e imprensa.
- **O que cada grupo declara:** quem entra, o que defende, divisão social, bússola econômica e social, o que cobra, tamanho, se pode pegar em armas, organização (1 a 5), dinheiro (1 a 5).
- **Membros:** fração de cada pop que pertence ao grupo (0 a 1); grupos podem se sobrepor. A planilha "Grupos - pops" é a matriz pop por grupo (32 linhas, 25 colunas).
- **Cobra:** índices e o sentido que o grupo quer (1 sobe, −1 desce).
- **Satisfação:** ver 2.4.
- **Radicais e lealistas:** radicais pesam na polarização, na violência política e no risco de atentado; lealistas seguram o voto do seu partido.
  - **Radicais nascem da piora do padrão de vida, não do nível (14/nov, ver 2.3).** O que vale é a queda: quem vive mal faz tempo, mas estável, não se radicaliza por isso; quem viu a vida piorar, sim.
  - Hoje no motor (por nível): alvo dos radicais = 5 + 2 × (35 − satisfação), se abaixo de 35; senão 5. Alvo dos lealistas = 5 + 2 × (satisfação − 65), se acima de 65; senão 5. Cada um anda no máximo 1 ponto por turno. Começam em 5.
  - "Uma crise curta não vira revolta; um mandato inteiro vira."
- **Força do grupo:** quanto mais força (gente e dinheiro), mais populares as leis perto dele. Lei popular passa mais fácil, e o Congresso pode tentar aprová-la sozinho.
- **Três reações do insatisfeito:** protestar, ficar leal ou sair. Ver 2.8.
- **Limite de cada grupo:** um grupo pacifista nunca pega em armas; no máximo forma movimento de rua.
- **O país declara:** os grupos fortes dele e a satisfação de partida.

**Regras**
- Grupo não escolhe lei.
- A lei diz onde fica na bússola, nunca qual grupo gosta dela (01/nov).
- Grupos de todos os lados de cada divisão (Lipset e Rokkan).
- Todo lado gera extremistas (princípio 4).
- Três tipos de grupo: econômico, identidade e valores, causa.
- Tudo é medido contra o marco do turno 0: todo grupo parte de 50.
- Resultado emerge: o grupo reage ao estado do país, não a um limite escrito (04/nov).
- Radicais pela piora do padrão de vida (14/nov).

**Mídia como lente.** A satisfação do grupo no GDD inclui "o que a mídia que ele vê diz". A mídia não cria o descontentamento: ela mostra, esconde ou amplia fatos que já existem, e mobiliza a raiva (R14.9 ☐). **ESTUDAR** como ela mexe nos radicais (aumenta a piora percebida?) e nos lealistas.

**Ligações**
- Recebe dos pops: o tamanho vem de pessoas por pop; o grupo cresce e encolhe sozinho.
- Recebe de Índices: o que ele cobra.
- Entrega ao Congresso: o partido defende grupos, e a nota do voto soma a distância na bússola × peso, mais o "povo".
- Entrega à Eleição: lealistas seguram o voto do seu partido.
- Entrega às Organizações: radicais de vários grupos próximos na bússola.
- Entrega aos Ministérios: grupo descontente fala com o ministro da instituição.
- Entrega ao pop (bússola): pop satisfeito (média dos grupos) se aproxima do governo.

**Referências**
- Victoria 3: radicais e lealistas; peso (clout) pela riqueza e pelo voto. Peso × aprovação para a mecânica 8.
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
- Britannica (tipos de interesse), Lipset e Rokkan (divisões).
- McCauley e Moskalenko, Gómez e outros (radicalização): só parte dos radicais vira organização.

**No motor hoje**
- ✅ R11.2 Grupos com bússola, tamanho e satisfação. ✅ R11.3 Radicais e lealistas (ainda pelo nível, a meta é pela piora). ◐ R11.4 Satisfação lê renda, índices e leis.
- ☐ R11.13 25 grupos atravessam os pops. O motor tem 16 grupos; o GDD é a meta. Os números e os nomes dos cenários do `grupos.md` são "da época dos 4 grupos".
- ☐ R11.11 Grupo forte torna mais populares as leis perto dele.

**Em aberto**
- Como medir a força de um grupo (gente e dinheiro) e quanto ela muda a popularidade de uma lei.
- Como o bolso de um pop vira gosto do grupo que o atravessa.
- Quanto de piora, em quanto tempo, vira radical, e quando o radical volta a esfriar.
- Se o êxodo aparece como índice ou só como gente mudando de pop.

---

### 2.7 Organizações

**O que é.** Uma organização tem nome, líder e ação própria, nasce durante a partida de radicais de vários grupos ou do lucro e da falta de Estado, e vive, racha e acaba.

**O jogador** (faz e sente)
- Várias existem, poucas preocupam. A ameaça é pequena, relevante, grave ou crítica.
- No mapa: pequenas aparecem discretas; graves viram alerta e eventos.
- Enfrenta com polícia, inteligência, negociação, e força militar contra organização grande e armada.
- Resposta mal feita pode criar mais radicais; caçar chefes pode rachar a organização.

**Peças**
- **Gerador:** não há lista fixa. Cria organizações conforme os grupos agradam ou não ao governo e agem. Os tipos da planilha são moldes.
- **Gatilho:** grupos com muitos radicais e insatisfação longa criam chance (e os radicais nascem da piora, ver 2.6).
- **Quem pode:** o grupo tem limite (coluna "Pode pegar em armas").
- **Organização política:** nasce de radicais de vários grupos próximos na bússola. Armamentistas ligados a conservadores e religiosos fundamentalistas são uma mistura perigosa. A mistura define nome, alvo e objetivo.
- **Insatisfação não basta:** precisa de ideia, líder ou rede; só parte dos radicais usa violência.
- **Atributos:** gente, dinheiro, armas, poder, organização. Dão a ameaça.
- **Moldes da planilha (12):** 6 políticos (Movimento de rua, Extremistas religiosos, Revolucionários, Milícia política, Radicais ambientais, Separatistas), 4 de crime (Facção de presídio, Tráfico, Milícia de bairro, Rede corrupta) e 2 legais (Igreja, Sindicato ou associação).
- **Nome (gerador):** tipo + ideia + lugar ou símbolo. Duas organizações não usam o mesmo nome; nenhum nome é real.
- **Crime organizado:** nasce do lucro (mercado ilegal, presídio lotado, favela, falta de Estado, corrupção). Vende, corrompe e disputa território.
- **Organizações legais (07/nov):** igrejas, sindicatos e associações, sem armas. A igreja é também dono sem lucro. Tem vertente (bússola) e engajamento: quietista, ativa ou militante.
- **Corrupção interna:** toda organização tem. Sobe com dinheiro fácil, isenção, sigilo e repasse sem controle; desce com fiscalização. Passa do limite: escândalo, racha, perda de apoio. O dinheiro dela vai ao bolso de alguém e deixa rastro (14/nov).
- **Financiamento:** outros países, empresas na bolsa e doadores podem pagar. Todo pagamento deixa rastro.
- **Investigação:** polícia, órgãos e imprensa descobrem quem paga. Pode prender líderes, cortar dinheiro, derrubar ações, gerar sanção e escândalo.
- **Mudar:** rachar, virar partido, virar crime (ou trocar a causa pelo lucro).
- **Acabar:** polícia, inteligência, negociação, perda de apoio.
- **Presos com nome (07/nov):** líder preso ganha ficha. Para os grupos aliados vira preso político; a bancada pede Anistia e o presidente pode dar a Graça (ato, não lei).
- **Certeza x peso da pena:** o crime reage forte à certeza de punição e pouco ao peso das penas. Pena dura é popular, lota presídios e custa caro.

**Regras**
- Pop, grupo e organização são camadas diferentes (06/nov).
- Decidido em 15/nov: as organizações entram na fase dos pops, junto com os radicais pela piora (2.6).
- Nomes sempre inventados; extremistas em todos os lados.
- Não há lista fixa; o gerador cria.
- Cada grupo tem limite (pacifista nunca pega em armas).
- Organização política precisa de ideia ou líder, não só raiva.
- Crime não precisa de grupo para nascer.
- Organização legal tem engajamento político (07/nov).
- Financiamento e rastro (ideia do autor).
- Nenhum dinheiro some, nem o ilegal: ele vai ao bolso de alguém e deixa rastro (14/nov).

**Mídia como lente.** A imprensa investiga e revela quem paga, e pode virar escândalo. A mídia não cria a organização: ela mostra ou esconde o que já existe. **ESTUDAR** como a mídia dá tamanho à ameaça e ao recrutamento.

**Ligações**
- Recebe de Grupos: radicais de vários grupos.
- Recebe da Economia: o lucro do crime e do mercado ilegal.
- Recebe da Justiça e prisões: presídio lotado, facção, certeza da punição.
- Entrega à Bolsa: investigação derruba ações.
- Entrega ao Mundo: financiamento por outros países; sanção.
- Entrega ao Congresso: bancada pede Anistia; igreja elege bancada, negocia leis.
- Entrega à Política: igrejas militantes agem em toda eleição.
- Entrega ao Governo: ameaça a gente, polícia e Defesa.

**Referências**
- McCauley e Moskalenko, Gómez e outros: radicalização.
- Della Porta: violência em protestos; organização é peça própria.
- RAND (268 grupos terroristas que acabaram: política 43%, polícia 40%, vitória 10%, força militar 7%), Cronin.
- Gambetta e Varese (máfia vende proteção), Skarbek (facções de presídio).
- Estudo de vícios: caça aos chefes.
- Nenhum jogo é citado para organizações. **ESTUDAR** referência de jogo.

**No motor hoje**
- ☐ R11.14 Organizações políticas. ☐ R11.15 Crime organizado. ☐ R11.16 Gerador. ☐ R11.18 Financiadores e rastro.
- "Falta: tudo." Igrejas e sindicatos já aparecem como donos sem lucro na Economia.

**Em aberto**
- Regras e números de nascer e crescer, ações de cada tipo, como o jogador as enfrenta.

---

### 2.8 Saída e voz (informal, emigrar, tirar dinheiro)

**O que é.** O grupo insatisfeito tem três reações: protestar, ficar leal ou sair. Sair tem três caminhos: informalidade, tirar o dinheiro do país ou emigrar.

**O jogador** (faz e sente)
- Fuga da regra: a regra forte demais alcança menos gente (informal, ilegal), conforme a verba de quem fiscaliza; junto, a sonegação que cresce com o imposto (14/nov).
- Sente a conta chegar por esse canal.

**Peças**
- **Informalidade:** hoje só o encargo do Seguro na folha faz formal virar informal.
- **Tirar o dinheiro do país:** sem regra além do nome. O dinheiro que sai não some: sai do país (14/nov).
- **Emigrar:** hoje só Profissionais de saúde, o único caso em que a população muda.
- **Nascido fora:** é o outro lado, imigração. Ver 2.2.
- **Protesto e lealdade** passam pelos radicais e lealistas (2.6).

**Regras**
- Três reações e três caminhos de saída.
- A regra forte demais alcança menos gente (14/nov).

**Mídia como lente.** A mídia não faz ninguém sair; ela pode dar a notícia que acelera a fuga de dinheiro ou de gente sobre uma piora que já existe. **ESTUDAR.**

**Ligações**
- Recebe dos Grupos: insatisfação.
- Entrega à Economia: informal deixa de pagar imposto; dinheiro e gente saem do país.
- Entrega às Leis: fiscalização (verba de quem fiscaliza).
- Entrega à Saúde e à Imigração (profissionais de saúde que emigram).

**Referências.** **Saída, voz e lealdade** (Hirschman, 1970): o insatisfeito sai (informal, emigrar, tirar dinheiro), reclama (voz: protesto, greve, voto) ou fica por apego (lealdade). Estudo de 14/nov.

**No motor hoje**
- ☐ R11.10 Insatisfeito sai: informalidade, fuga de dinheiro, emigração.
- ◐ Só dois casos soltos: o Seguro na folha e os profissionais de saúde.

**Em aberto**
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração, e com que números.

---

### 2.9 Território (estados)

**O que é.** Todo pop tem campo e cidade e fica num estado. Cada país declara todos os seus estados, as pessoas de cada um e como se dividem.

**O jogador** (faz e sente). A tela não está descrita nas fontes.

**Peças**
- **Estado vale para tudo:** pops, prédios, voto e energia.
- **Fallback:** se o país não declarar a divisão de um pop num estado, vale a divisão nacional.
- **País sem estados:** declara um só; regionalistas e separatistas não aparecem.
- **Campo e cidade:** hoje só a Moradia separa os pops do campo, sem êxodo de pop.

**Regras**
- Lugar (08/nov): todo pop tem campo e cidade e fica num estado.
- O país declara os estados.
- Decidido em 15/nov: o país declara as pessoas de cada estado e a divisão campo/cidade; cada pop segue a divisão nacional até ter dado próprio.

**Mídia como lente.** **ESTUDAR** se a mídia tem alcance por estado.

**Ligações**
- Entrega ao Voto (por estado), à Energia, a Governadores e à Moradia e Terra.
- Entrega às Organizações: regionalistas e separatistas só existem com estados.

**Referências.** Pew: cidade ou campo separa muito a política (EUA). Nenhum jogo citado para estados. **ESTUDAR.**

**No motor hoje**
- ☐ R11.17 Pops por estado ("medido possível em 12/nov").
- ◐ Campo e cidade só na Moradia.

**Em aberto**
- Se entra na V1 ou depois, e o que depende disso (voto por estado, energia, governadores). Decidido em 15/nov: entra na fase dos pops.
- Se o êxodo aparece como índice ou só como gente mudando de pop.

---

## Parte 3. Economia

A Economia é um dos três pilares do jogo (Sociedade, Economia e Máquina pública). Ela paga os pops
e o Estado, e é controlada pelos dois. O Mundo não é pilar: outros países, comércio
e preços de fora pressionam os três.

**O que o jogador faz:** cria as condições (imposto, juro, regra, verba,
propriedade) e, como Estado, compra, vende e patrocina. Quem produz e constrói é a
economia.

**O ciclo.** População, Economia e Governo controlam uns aos outros, com a
População no centro. A população trabalha, consome e investe. A economia paga
salário, dá emprego e define preços. A economia gera o dinheiro dos impostos. O
governo cobra, gasta e regula por lei. A bolsa é onde o ciclo vira preço: lei muda
lucro, lucro muda a ação, a ação muda o patrimônio dos pops, e os pops reagem no
voto e no investimento.

**A lei não diz quem gosta dela (14/nov).** Ela diz onde mexe no dinheiro e na vida
(quem paga, quem recebe, que preço sobe, que emprego abre). O motor calcula o efeito
em cada pop. Toda lei chega ao pop por renda, emprego, preço, serviço ou direito.

**Nenhum dinheiro some (14/nov).** Todo real cobrado ou gasto tem caminho: circula,
fica guardado ou sai do país, mesmo o ilegal. O caminho do dinheiro é a 3.6.

**Modelo de base (14/nov):** o do Victoria 3 (prédios, bens, mercados, pops com
emprego, salário e padrão de vida), atualizado para hoje.
- Levar do Victoria 3: pop no centro (prédio sem gente não produz); necessidades
  atendidas por vários bens, com preferência; padrão de vida; padrão caindo ou
  desemprego radicaliza; riqueza dá peso político; dono recebe o lucro e investe
  parte; impostos por tipo de base; déficit vira dívida.
- Mudar em relação ao Victoria 3: o dinheiro se conserva (lá os bens surgem do nada
  e a sobra é vendida "ao vazio"); ciclo econômico e crise (lá não há); o jogador
  não constrói prédio (lá virou "jogo de construção").
- Atualizar para hoje (lá não existe, nada a copiar): serviços como setor maior,
  trabalho informal, crédito e bancos, banco central e inflação, economia digital,
  capital entrando e saindo do país.

**Ordem decidida (14/nov):** primeiro o dinheiro (caminho e conservação), depois a
opinião pelo bolso, depois a revisão das leis instituição por instituição.

**Hoje no motor (conferido em 14/nov):** a satisfação do grupo lê renda, índices
cobrados e bússola das leis; o bolso só se mexe por imposto de renda e
transferência; a verba gasta não chega a ninguém, exceto a transferência.

**Glossário curto da Economia (08/nov).** Companhia é a dona, com ações, reserva de
investimento e várias empresas. Empresa é a parte de uma companhia em um setor, um
conjunto de prédios. Prédio é a unidade que produz ou presta serviço. Obra é o ato
de construir um prédio novo, na fila da construção civil. Órgão é o mesmo que
instituição: recebe a verba por lei e executa; o jogador dá a verba, não escolhe
fábrica nem fazenda. Ação (cota) dá dividendo, não dá mando. Estatal é empresa cujo
dono é o Estado. Serviço do Estado é prédio do Estado fora do mercado. (O glossário
completo vai ao Anexo.)

---

### 3.1 Mercado e produtos

**O que é**
O mercado é onde setores e produtos do mundo têm oferta, demanda e preço, no país e
no mundo.

**O jogador**
- Não existe lei que dê lucro à carne ou ao aço. As leis mexem em todas as
  empresas, na demanda ou no custo, e a cadeia espalha o efeito. Subsídio para
  comprar máquinas aquece máquinas e, junto, o aço; o Bolsa Família faz as famílias
  comprarem alimento.
- Sente o preço e a falta: o que chega a cada pop depende de quanto há, de quanto
  custa e de quem pode pagar; falta de comida vira fome.
- Vê o mercado na janela "Mercado": produtos por setor, o que o país produz,
  importa (e de quem) e exporta; a aba Mundo mostra preço, seta de alta ou baixa e
  quem vende mais barato.

**Peças**
- **Setores:** 15, aprovados em 05/nov. Setor separa atividade, nunca tipo de bem:
  quem compra luxo é um pop, não um setor. A planilha lista os 15 com a seção da
  ONU, os prédios e os pops que trabalham ali.
- **Produtos** agrupados em setores, com cadeia entre eles (aço, máquinas,
  veículos). A cadeia liga uma empresa à outra na bolsa: lei que encarece o aço
  derruba o lucro da montadora.
- **Dois mercados:** o do país e o do mundo, com ciclos e choques. O país produz uma
  parte e compra o resto.
- **Cobertura:** quanto da demanda do país a produção atende. Passa a ser resultado
  (produção ÷ demanda), não número declarado.
- **Preço do mundo** (base 100, entre 40 e 250): anda 25% do caminho até o alvo por
  turno, mais ruído pequeno.
- **Preço do país:** faixa de 25% a 175% do preço base, misturada com o preço do
  mundo conforme a importação.
- **Ciclo e choque:** a demanda do mundo ondula (24 turnos = 4 anos); choques de
  preço somem aos poucos.
- **Cestas e fome:** comida e remédios são as duas cestas em código; a segurança
  alimentar sai do gasto com comida e da falta.
- **Prédios à vista, sem simular um a um:** o produto declara uma unidade (ex.:
  "fazendas") e a tela mostra "≈ N unidades".

**Regras**
- 02/nov: setores e produtos são do mundo; o motor não conhece nomes.
- 02/nov: o país declara cobertura por produto; o mundo declara quem fornece;
  importa = o que falta para 100, exporta = o que passa de 100.
- 02/nov: dois mercados, preço do mundo por oferta e demanda, choque com 2% de
  chance por produto e por turno.
- 02/nov: demanda de comida = população × cesta; Grãos, Frutas e Alimentos atendem a
  mesma necessidade e o pop troca pelo preço.
- 02/nov: segurança alimentar = 100 − gasto com comida − falta; fome leve abaixo de
  40 e grave abaixo de 20 (pontos de partida).
- 02/nov: o índice abastecimento (0 a 100) é cobrado pelos grupos; fome grave
  derruba saúde e reputação, abastecimento melhor faz o contrário.
- 08/nov: o mercado se move por demanda e custo, nunca por lei de produto.
- 14/nov: produto que falta vem do mercado do mundo (de quem tem sobra) ou fica
  faltando (preço sobe, fome, fila); nunca aparece do nada. A sobra é vendida a
  alguém ou fica parada; nunca vai "ao vazio".
- 14/nov: pop compra o que precisa e paga imposto; cada necessidade é atendida por
  vários produtos com preferência e regras próprias (energia de casa: eletricidade,
  gás ou lenha; lenha quando a luz falta ou encarece).
- 14/nov: o preço é calculado uma vez por turno (2 meses).
- Sem data: setores com regra própria são moradia, remédios e militar (demanda pelo
  tamanho das forças).

**Ligações**
- Sociedade: demanda dos pops; fome e carência mexem em saúde, pobreza e apoio dos
  grupos pobres.
- Leis: tarifa, subsídio, custo e demanda (nunca preço ou lucro direto).
- Mundo: potências com sobra fornecem o que falta; o preço do mundo vem delas; o
  Mundo pressiona preço, comércio e sanção.

**Referências**
- Victoria 3: preço sobe quando a compra passa da venda; fórmula
  `base × [1 + 0,75 × clamp(...)]`, entre 25% e 175%; falta e sobra (perda de
  produção na falta grande). ([referência do mercado do Victoria 3](estudos/mercado-vic3-referencia.md))
- Pesquisa de jogadores: preço por oferta e procura sem estoque; crítica ao Victoria
  3 por criar bens para cobrir falta e vender a sobra "ao vazio".
  ([pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Estudo da ONU (ISIC) para os setores.

**No motor hoje**
- ✅ Produtos em setores, mercado do país e do mundo (R16.1) e demanda dos pops com
  fome (R16.2).
- ✅ Ciclo de 4 anos e choques no preço do mundo (fatia 5a).
- ✅ Preço do país e do mundo "funciona"; 23 produtos em 7 setores (os 15 setores
  aprovados são a meta).
- ◐ Cadeia entre setores (R16.5).
- ◐ Demanda só da cesta de comida e de remédio, sem demanda por setor.
- ☐ Setores com regra própria (R16.6).
- ☐ Os outros 18 produtos com a mesma regra da comida.

**Em aberto**
- Os 15 setores aprovados contra os 7 do motor (essenciais, infraestrutura,
  indústria, tecnologia, militar, luxo, construção civil): o estudo diz que Luxo e
  Essenciais são tipo de bem, não atividade.
- Ciclo e crise "de verdade" só quando o mundo tiver países funcionando.
- Pesos 0,5 / 0,2 / 0,3 e cesta de 12% da renda são pontos de partida a ajustar
  medindo.
- "Marcas na régua" e outros números de calibração seguem a regra de ordem de
  grandeza, sem precisão empírica.

---

### 3.2 Empresas, prédios e obras

**O que é**
Prédio é a unidade que produz, emprega e dá lucro; empresa é um conjunto de prédios
de um setor; obra é o ato de construir prédio novo.

**O jogador**
- Não constrói prédio: a lei dá condição e a economia constrói. Vê os prédios em
  conjunto ("≈ N fazendas").
- Dá a verba e escolhe as leis; o órgão age sozinho.
- Sente o PIB subir quando uma obra termina e cair quando um prédio fecha. Sente a
  corrupção que atrasa e encarece obra.

**Peças**
- **Prédio:** produz, emprega e dá lucro; o PIB é a soma do que os prédios
  produzem; as bases dos impostos saem dos prédios e dos pops.
- **Método de produção** (insumos, produto, empregos).
- **Insumos e cadeia:** um prédio compra do outro (aço vira máquina). A planilha
  lista os prédios por setor, o que produzem e usam, quem emprega e se pode ser
  terceirizado.
- **Empresa e companhia:** o país declara as de partida.
- **Obra e fila:** cada tipo tem custo e prazo; obra difícil pesa mais; a construção
  civil decide quantas andam ao mesmo tempo.
- **Verba de obra separada (07/nov):** a verba de cada área mantém o que existe
  (salários e insumos); construir é a Verba de construção, dividida em 100% entre as
  áreas, na instituição Infraestrutura e transporte. Prédio pronto sem verba da área
  fica vazio.
- **Desgaste e fechamento:** prejuízo por vários turnos fecha o prédio e demite.
- **Prédio precisa de gente;** o desemprego sai daí.
- **Terceirizar** por lei o que aceita terceirização (segurança, presídios,
  hospitais, escolas).

**Regras**
- 03/nov (construções, pilar 1): capacidade por setor; desgaste de 4% ao ano;
  investimento privado abre obras; juro acima do equilíbrio tira 8% por ponto;
  imposto sobre lucro acima do turno 0 tira 3% por ponto; construção civil limita o
  volume (1,5× o ritmo do turno 0).
- 03/nov: corrupção alonga o prazo (até 2×) e encarece a obra (até +50%).
- 03/nov: o investimento vai para onde a margem melhorou; 3 turnos seguidos de
  prejuízo tiram 5% da capacidade por turno; setor do Estado nunca fecha.
- 07/nov: verba de obra separada da verba de manutenção.
- 14/nov: o investimento sai do lucro do dono; é ele que abre as obras (hoje sai de
  uma conta, sem dono).
- 14/nov: a divisão da verba de um órgão entre pessoal, compras e obras não é fixa.

**Ligações**
- Sociedade: sem trabalhadores com a formação certa o prédio produz menos; quem não
  acha vaga vai para Desempregados.
- Leis: corrupção, juros, imposto sobre lucro e a lei Prioridade das obras.
- Mundo: insumo vem do país ou de fora, conforme a oferta nacional.

**Referências**
- Victoria 3: prédio com método de produção; produtividade e saldo; vazão; lucro vai
  ao caixa e a dividendos. ([referência](estudos/mercado-vic3-referencia.md))
- Pesquisa de jogadores: prédio sem pop não faz nada; métodos de produção definem
  insumo, produto e emprego; crítica de que o Victoria 3 virou "jogo de construção"
  e barra de progresso. ([pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Estudo "Prédios e lucro", Victoria 3: vira prédio, dono e reserva, sem copiar
  nomes ou números.

**No motor hoje**
- ◐ Capacidade por setor, desgaste, investimento que abre obras, fila, corrupção
  que atrasa, lucro por setor e fechamento. É por setor, não por prédio (por isso
  as obras por prédio aparecem como ☐ abaixo).
- ☐ Prédios produzem, empregam e dão lucro, PIB é a soma (R16.7).
- ☐ Obra com custo e prazo por tipo (R16.8).
- ☐ Corrupção atrasa e encarece (R16.10).
- ◐ Empresas declaradas pelo país (R16.11), sem prédios; 5 empresas de teste.
- ☐ Ligar ao pop: a renda do pop ainda é parte fixa do PIB; demissão, salário e
  lucro do setor não chegam a ele (fatia 5b, adiada).

**Em aberto**
- Custo e prazo de cada tipo de obra (números).
- Duas filas (pública e privada) na mesma capacidade, lei Prioridade das obras.
- Como definir a divisão da verba de um órgão em pessoal, compras e obras (14/nov:
  ela não é fixa; falta decidir como o jogo a calcula).

---

### 3.3 Mercado de trabalho

**O que é**
Cada prédio pede pops com um nível de qualificação (elementar, operacional, técnico,
superior) e paga um salário que nasce do piso do pop, da disputa por gente, do
lucro e das leis.

**O jogador**
- Mexe nas leis de trabalho (salário mínimo, participação nos lucros).
- Piso legal e negociação coletiva seguram quedas e aproximam salários.
- Sente desemprego e informalidade: sem vaga, a pessoa vai para Desempregados,
  Informais ou Autônomos.

**Peças** (modelo de 7 passos)
1. **Piso do pop:** a qualificação define o salário base e quem ocupa a vaga.
2. **Disputa por gente:** falta de qualificados sobe o salário; sobra segura.
3. **Teto pelo lucro:** o lucro limita a alta; prédio muito lucrativo paga bônus
   pequeno.
4. **Lei e negociação:** piso legal e sindicato seguram quedas.
5. **Queda lenta:** o salário cai devagar; antes de cair muito, o prédio demite.
6. **Formação:** salário alto atrai estudo e, depois de anos, mais gente qualificada.
7. **Estado disputa:** salário público é por lei, mas salário baixo perde gente para
   o privado.

Peças da planilha: vaga por pop e por nível; piso (salário mínimo só vale para o
emprego formal, alto demais empurra para o informal); desemprego; informal; falta de
gente (vaga aberta reduz produção); formação; salário público; gente disponível
(entra quem se forma e quem vem de fora; sai quem se aposenta, emigra ou muda de
setor; vagas são por pop, não por profissão). Tabela de qualificação por pop (nível,
anos de formação, salário base × piso, força para negociar, vínculo).

**Regras**
- Sem data: o salário cai devagar.
- Sem data: vagas são por pop, não por profissão (decisão do autor).
- Sem data: desemprego e falta de gente são "conserto aprovado".
- Salário público é por lei, mas se ficar baixo o Estado perde gente.

**Ligações**
- Sociedade: a renda do pop vem de salário, lucro, aluguel e transferência (R16.26).
- Leis: salário mínimo, jornada, sindicatos; encargo alto empurra para o informal.
- Mundo: vem gente de fora e sai gente por emigração.

**Referências**
- Victoria 3: prédio com vaga aumenta salário até o lucro acabar; com prejuízo
  reduz. O Victoria 3 não explica como o salário é fixado; não copiar o que não se
  sabe. ([referência](estudos/mercado-vic3-referencia.md))
- OIT: quatro níveis de habilidade; renda do trabalho em cerca de 52% do PIB
  mundial.
- Lucro maior aumenta salário, efeito pequeno (Blanchflower e outros); acordo
  coletivo reduz a diferença (Mannheim).
- Salário mínimo mexe pouco no emprego total em países em desenvolvimento (Fang e
  Ha).

**No motor hoje**
- ☐ Falta de trabalhador freia a produção e o desemprego sai daí (R16.27);
  contratação por qualificação (R16.37).
- ◐ Informal (parte com Seguro na folha) e formação (mudar de setor existe).
- Hoje o emprego é medido a partir da renda dos pops; nada contrata.

**Em aberto**
- Quanto falta de trabalhador freia a produção.
- Quanto o salário cai devagar antes de o prédio demitir.
- Como a renda do pop sai de salário e lucro sem o turno 0 mudar de valor.
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração.

---

### 3.4 Propriedade e lucro

**O que é**
O lucro é o que sobra da receita do prédio depois de insumos, salários, encargos,
desgaste, juros e imposto. Ele vai para o dono, que gasta uma parte e investe outra.

**O jogador**
- Mexe no lucro só por leis gerais (imposto sobre lucro, remessa, salário mínimo,
  dividendos), nunca num produto.
- O Estado patrocina: lei de incentivo, crédito barato ou obra pública puxa o
  investimento privado para um setor sem o Estado ser dono.
- Sente lucro concentrado nos donos, lucro que sai do país, estatal que devolve ao
  cofre.

**Peças**
- **Caminho do lucro, 14 passos** (exemplo com receita de 100): vender (100);
  comprar insumos (−40); valor adicionado (a soma de todos é o PIB); pagar salários
  (−30); encargos (−5); guardar para o desgaste (−6); pagar juros (−3); lucro antes
  do imposto; imposto sobre lucro (−4); lucro líquido (12); reinvestir (−7,8); pagar
  dividendo (−4,2); virar renda do pop; abrir nova obra.
- **Tipos de dono (os 9 da planilha, valem por enquanto):** privado nacional,
  empresa na bolsa, estrangeiro, estatal, mista, cooperativa, conta própria, serviço
  do Estado e entidade sem lucro (igrejas e beneficentes; a fé vive nos grupos, o
  jogo não tem religiões com nome). O quadro de donos traz, para cada tipo,
  reinvestimento, lucro, ganho e custo.
- **Para onde vai o lucro:** privado nacional (investidores e reserva); estrangeiro
  (sai do país, pela lei de remessa); estatal (cofre); cooperativa (trabalhadores);
  mista (por cotas); conta própria (renda mista).
- **Reserva de investimento:** o lucro do privado enche a reserva, que abre obras
  nas empresas que dão mais lucro; juro alto encarece o crédito.
- **Estatal:** cresce quando o jogador põe verba por lei; paga do cofre, e sem cofre
  da dívida.
- **Leis de propriedade:** indenização, prazo, regra pós-venda, política estatal,
  triagem estrangeira, remessa de lucro, fábrica de fora, concorrência.

**Regras**
- Sem data (seção 16 do GDD): prejuízo por vários turnos fecha o prédio.
- 03/nov: imposto sobre lucro só incide se há lucro; margem relativa divide o
  investimento entre setores.
- 14/nov: o lucro vai ao bolso do dono (pop rico, Estado, fundo, estrangeiro); o
  dono gasta uma parte e investe outra, e o investimento abre as obras.
- 14/nov: os 9 tipos de dono da planilha valem por enquanto.
- Ponto de partida do estudo: 35% do lucro em dividendo (a conta de exemplo usa 65%
  reinvestido).

**Ligações**
- Sociedade: dividendo vira renda dos pops donos, paga imposto e vira consumo ou
  poupança.
- Leis: imposto sobre empresas, imposto sobre dividendos, remessa de lucro,
  incentivos.
- Mundo: o lucro do estrangeiro sai do país.

**Referências**
- Victoria 3: lucro em parte para o caixa do prédio e o resto em dividendos aos
  donos; donos investem parte no fundo de investimento.
  ([referência](estudos/mercado-vic3-referencia.md); [pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Contas nacionais (ONU e Eurostat): produção menos insumos dá valor adicionado; em
  negócio familiar salário e lucro se misturam (renda mista).
- Reinvestimento: 83% de 2.886 empresas britânicas usam reservas para investir.
- Dividendos em torno de 30% a 50% do lucro (MSCI, FactSet).
- Tipos de dono: **ESTUDAR** se os 9 fazem sentido, se falta ou sobra algum.

**No motor hoje**
- ✅ Imposto sobre lucro; obra e fila.
- ◐ Receita (capacidade × preço médio do setor), salário (não chega ao pop), reserva
  de investimento (taxa, sem dinheiro real).
- ☐ Dono e dividendo.
- ☐ Caminho do lucro (R16.9, R16.33), lucro vai ao dono (R16.12), reserva privada
  abre obras (R16.13).

**Em aberto**
- Quanto do lucro privado vai aos investidores e quanto à reserva.
- ESTUDAR os tipos de dono (14/nov): o GDD também fala em 5 tipos (Estado, privado
  nacional, estrangeiro, cooperativa, entidade sem lucro) e em 6 destinos do lucro;
  valem os 9 da planilha até o estudo.

---

### 3.5 Consumo e necessidades

**O que é**
Todo produto tem comprador (pops, pequenos mercados, mercados, outros prédios,
Estado, exterior). O pop compra pela cesta da sua renda.

**O jogador**
- Mexe na renda e no preço; o consumo muda. Quem ganha mais gasta parte menor com
  comida e poupa mais.
- Sente falta de comida (fome), conta de luz e preço de moradia.

**Peças**
- **Quem compra:** pops, pequenos mercados, mercados, outros prédios, Estado e
  exterior.
- **Cesta por estrato** (pobre, médio, rico, em % da renda; as três colunas somam
  100): comida 45/22/8, roupas 6/5/4, moradia e contas 22/22/15, casa 3/5/6, saúde
  5/8/7, infraestrutura e transporte 8/11/9, comunicação 4/5/4, lazer e luxo 1/5/10,
  educação 1/4/4, restaurantes e turismo 1/4/8, seguros e finanças 0/3/6, serviços
  pessoais 4/3/4, poupança 0/3/15.
- **Mapa produto a produto:** categoria do pop, quais pops compram, como chega ao
  pop, quais prédios compram, se o Estado compra e o que vai ao exterior.
- **Comércio é ponte:** produto vai ao atacado, aos pequenos mercados ou aos
  mercados, e daí ao pop; serviços chegam direto.
- **Necessidade atendida por vários produtos** com preferência.

**Regras**
- Sem data (seção 16): o pop compra pela cesta, com a renda de cada estrato dividida
  em fatias por categoria. O motor, que dá a mesma quantia por pessoa (mínimo para
  viver, 12% da renda média, com o pobre gastando fatia maior), está atrás dessa
  meta.
- 14/nov: necessidade atendida por vários produtos; energia de casa tem regra
  própria (eletricidade, gás, lenha).
- Dado de partida: riqueza vira consumo em cerca de 3% do ganho.

**Ligações**
- Sociedade: o bolso (renda, preço do que compra, emprego, serviço) é a parte mais forte
  do gosto.
- Leis: imposto sobre consumo, tarifas.
- Mundo: cada produto indica se exporta, importa ou não viaja.

**Referências**
- Victoria 3: necessidades por nível de riqueza, atendidas por vários bens em
  qualquer mistura; padrão de vida sobe e desce.
  ([referência](estudos/mercado-vic3-referencia.md); [pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Lei de Engel (maior renda, menor parte em comida) e COICOP 2018 (consumo por
  finalidade) para a cesta.
- Federal Reserve: riqueza vira consumo em 2 a 5 centavos por dólar.

**No motor hoje**
- ◐ Só a cesta de comida e remédios, com a mesma quantia por pessoa; não há demanda
  por setor.
- ☐ Quem compra (R16.36); cesta por estrato.

**Em aberto**
- Quem compra de verdade (pequenos mercados, mercados, prédios, exterior) ainda é
  planilha.
- A linha "Total" da cesta está vazia na planilha.

---

### 3.6 Fluxo do dinheiro (nenhum dinheiro some)

**O que é**
Todo real cobrado ou gasto tem caminho: circula na economia, fica guardado ou sai do
país, mesmo o ilegal. Esta regra substitui o antigo princípio de que só o dinheiro do
Estado fecha a conta: agora a conta fecha para a economia inteira (14/nov).

**O jogador**
- Sente o custo em gente, não num número: a verba da saúde mexe em emprego, setor e
  serviço.
- Passa o mouse e vê de onde veio o número (preço, salário, gosto).

**Peças**
- **Três destinos do dinheiro:** circula (salário, compra, lucro, aluguel); fica
  guardado (poupança, banco, cofre); sai do país (importação, remessa, fuga, conta
  lá fora).
- **O ilegal também:** a corrupção não apaga dinheiro; vai para o bolso de alguém
  (pop rico, ministro, organização), é gasto, lavado ou mandado para fora, e deixa
  rastro.
- **Conferência:** como o Tesouro (cofre − dívida = resultado), a economia inteira
  fecha a conta todo turno.
- **Caminho da verba (reformulado em 14/nov):** a verba vira salário de quem
  trabalha na instituição (médico, professor, policial, que são pops), compra de
  bens e serviços (de companhias daqui ou de fora) e serviço entregue a um pop; o
  desvio vira bolso de alguém.
- **Filtro da verba:** a corrupção desvia parte; desvio = índice Corrupção × 0,5
  (índice 40 = 20% desviado), valor de partida; o desvio vai a alguém e deixa rastro.
- **Destino da verba:** o que chega ao prédio vira salário e insumos; exemplo: 100 de
  verba, 20 desviados, 50 salários, 20 insumos do país, 10 importados.
- **Os bolsos do jogo** (pops, companhias, Estado, bancos, exterior, o ilegal) ainda
  são "a pensar".

**Regras**
- 14/nov: nenhum dinheiro some, nem o ilegal.
- 14/nov: o desvio da corrupção vai ao bolso de alguém e deixa rastro.
- 14/nov: a verba precisa virar salário, compras e serviço, não parar na
  "população".
- 14/nov: a divisão da verba entre pessoal, compras e obras não é fixa.
- 13/nov: o caminho antigo (impostos, Tesouro, verba por lei, instituição que rende
  verba ÷ trabalho; verba demais vira pontos de corrupção) já dizia "nenhum dinheiro
  some".

**Ligações**
- Sociedade: salário público vira renda de pops.
- Leis: toda lei de verba.
- Mundo: importação, remessa e fuga são saídas.

**Referências**
- **Modelo estoque-fluxo consistente** (Godley e Lavoie): toda linha e coluna da tabela de fluxos soma zero, "não há buracos negros". É o nome profissional do "nenhum dinheiro some" (estudo 14/nov).
- Crítica ao Victoria 3: "a lousa é apagada" a cada tick; bens criados para cobrir
  falta e excedente vendido "ao vazio".
  ([pesquisa](estudos/pesquisa-jogadores-14nov.md); [referência](estudos/mercado-vic3-referencia.md))
- Estudos: gasto público rende pouco em países mal governados (filtro da
  corrupção); contratação atrasada deixa verba sem gastar.
- Gasto em saúde público tirou gasto privado em Taiwan.

**No motor hoje**
- ☐ A verba gasta some (só a transferência chega a um estrato); a renda do pop é
  parte fixa do PIB.
- ☐ Caminho do dinheiro completo (R10.7).
- ☐ A corrupção não reduz a verba hoje.
- ☐ A verba não passa pelos prédios.

**Em aberto**
- Custo fixo por ministério e por cargo (sem ele o governo Inchado não tem
  desvantagem), quanto a corrupção desvia e o dinheiro "fora das leis" de hoje.
- Os bolsos do jogo e o que é contado um por um ou aproximado.
- Como o jogo divide a verba entre pessoal, compras e obras: a divisão não é fixa
  (14/nov) e falta definir como calculá-la.

---

### 3.7 Sistema monetário e financeiro

**O que é**
O Banco Central, os bancos, a inflação e o câmbio ligam juros, crédito, preço da
moeda e o exterior.

**O jogador**
- Dá autonomia ao Banco Central por lei; com autonomia, a régua da Taxa básica só
  mostra a decisão do banco.
- Define a Faixa do câmbio (preço-alvo do dólar de −20% a +40% sobre o início, e
  largura de 0% travado a 30% quase solto); ao bater na parede decide no turno:
  gastar reservas, subir juros, fechar a saída de dinheiro (só com Controle de
  capital) ou deixar o corredor quebrar.
- Resgate de bancos é evento: deixar quebrar, ficar com o banco (vira estatal),
  emprestar com condições ou salvar sem condições.
- Cripto: quando a moeda vai mal, parte do povo compra; a lei decide mercado
  paralelo, imposto ou livre.

**Peças**
- **Juros:** o Banco Central reage à inflação e à economia (regra de Taylor); juros
  de mercado somam o risco do país.
- **Crédito:** bancos emprestam depósitos e reservas a pops, prédios e Estado;
  confiança e lucro ampliam; juros e calote reduzem; crédito farto infla a bolsa.
- **Inflação:** vem de demanda, custo, expectativas e moeda emitida.
- **Câmbio:** taxa, moeda fraca (exporta mais, encarece importados e dívida
  externa), moeda forte (importa barato, indústria sofre), regime e reservas.
- **Regime:** o país escolhe dois de três (câmbio estável, capital livre, juros
  próprios); reservas seguram o câmbio até acabar.
- **Reservas** são um índice, não uma lei.
- **Exterior:** comércio, investimento e sanções passam pelo câmbio.
- **Juros do motor:** `alvo = neutro + inflação + 0,05 × max(0, dívida −
  tolerância)`; a taxa anda 20% do caminho até o alvo por turno.
- **Banco Central no motor:** o alvo soma `peso_da_meta × (inflação − meta)`; a
  Autonomia (0 a 1) pesa o alvo do BC contra a Taxa básica do governo.

**Regras**
- 08/nov: câmbio como corredor; resgate de bancos é evento; cripto; autonomia do
  Banco Central destrava a Taxa básica.
- 14/nov: o modelo do Victoria 3 é atualizado com crédito, banco central, inflação
  e capital entrando e saindo.
- Sem data: crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à
  moeda) são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.

**Ligações**
- Sociedade: crédito popular (casa, carro, ação) e parcela.
- Leis: Autonomia, Meta de inflação, Faixa do câmbio, Seguro-depósito, Exigência de
  capital, Controle de capital.
- Mundo: a moeda do extremo é a de um país da lista do Mundo.

**Referências**
- Regra de Taylor; trindade impossível; repasse do câmbio (BIS, mais forte em
  emergentes); canal do crédito (Bernanke e Gertler); inflação por demanda, custo e
  expectativas (Banco da Austrália).
- Calibração dos juros: Reinhart, Rogoff e Savastano (2003); Laubach (2009); Clarida,
  Galí e Gertler (2000).
- Democracy 4: nota de crédito que define juros; Victoria 3: juros baixos que não
  viram espiral. Estudo de 22/out, antes do recomeço, só como ideia.
  ([estudo](estudos/victoria3-e-democracy4.md))
- Victoria 3 não tem inflação nem crédito moderno (o jogo vai até 1936).
  ([pesquisa](estudos/pesquisa-jogadores-14nov.md))

**No motor hoje**
- ◐ Inflação que se move (R9.3).
- ✅ Juros por dívida e inflação, com Banco Central e autonomia pelo papel.
- ☐ Crédito dos bancos (R16.38); câmbio, regime e reservas (R16.39).
- ☐ Tudo da planilha de inflação por demanda, custo, expectativa e moeda.
- Simplificado hoje: uma taxa só; sem prazo da dívida; prêmio linear, sem crise de
  confiança.

**Em aberto**
- Como crédito, câmbio e reservas ligam comércio, inflação, dívida e investidores.
- Peso da meta de inflação, números de alvo e do prêmio de risco: **ESTUDAR** (só
  existe o ponto de partida dos juros).

---

### 3.8 Mercado de capitais (bolsa)

**O que é**
A bolsa é onde empresas abrem capital e investidores negociam ações; o preço anda
pelo lucro e pela confiança, e a bolsa funciona sem o governo.

**O jogador**
- Regulamenta ou entra: o Estado compra e vende de verdade, o dinheiro entra e sai
  do cofre, e grupos, mídia e outros países reagem.
- Cada país escolhe o caminho (liberal, coordenado ou Estado dono); cada um exige
  estrutura e cobra um preço, sem lado certo.
- Ação dá dividendo, não dá mando.
- Sente alta e quebra: a quebra reduz patrimônio, consumo, investimento e emprego.

**Peças**
- **Preço:** lucro × múltiplo × humor; múltiplo cai com juros e risco e sobe com
  crescimento esperado; humor volta ao valor justo aos poucos.
- **Conta de valor justo (exemplo):** lucro 12; retorno exigido = juros 8% + risco 5%
  = 13%; crescimento esperado = 65% × 12% = 7,8%; múltiplo = 35% ÷ (13% − 7,8%) ≈ 6,7;
  valor justo ≈ 81; humor entre 0,6 e 1,6.
- **Prêmio de risco:** sobe com corrupção, dívida, regra fraca, ameaça de estatizar e
  violência; cai com proteção e transparência.
- **Ciclo:** novidade, euforia, aperto, pânico, consequência.
- **Investidores:** pequenos, pops ricos, fundos nacionais, bancos e corretoras,
  multinacionais, estrangeiros de curto prazo, potências e o Estado, cada um com
  origem do dinheiro, quando compra e quando vende.
- **Base do mercado:** propriedade, contratos, regras claras, moeda estável e apoio
  da população; sem isso a bolsa encolhe ou quebra.
- **Regras que o país pode criar** (ideias de lei): transparência, proteção do
  pequeno acionista, informação privilegiada, órgão da bolsa, limite de risco dos
  bancos, imposto sobre ganhos, pausa do pregão, fundo do Estado, socorro.
- **Índice da bolsa** e **confiança do mercado.**
- **Patrimônio dos pops:** ação sobe ou cai e muda a riqueza; dividendo vira renda;
  queda vira reação no voto e no investimento.
- **Captação:** preço alto ajuda empresa a vender ação e pagar obras.
- **Compra da propriedade** pelo valor na bolsa.

**Regras**
- Sem data (seção 16): a bolsa funciona sem o governo; mercado precisa de base; ação
  dá dividendo, não dá mando.
- Sem data: humor nasce de alta recente, crédito barato, confiança e notícias, sem
  sorteio.
- Sem data: vender muito de uma vez derruba o preço.
- 02/nov: jogável não é demorado; nenhuma opção com efeito neutro (revisão do
  bolsa).
- Ponto de partida: 3% do ganho vira gasto (estudo do Federal Reserve).

**Ligações**
- Sociedade: queda reduz a satisfação de Finanças, Indústria e dos pequenos investidores
  (pressão por socorro).
- Leis: imposto sobre ganhos, remessa, regras da bolsa.
- Mundo: estrangeiros saem rápido e derrubam preço e moeda; potências compram.

**Referências**
- Modelo de Gordon (valor justo); Minsky e Kindleberger (bolhas); Rodrik (base do
  mercado); IOSCO (regras mínimas); La Porta e outros (proteção do investidor);
  Levine e Zervos (liquidez); Hall e Soskice (tipos de capitalismo); Wolff e Axios
  (quem tem ações); estudo da Índia (fuga de estrangeiro).

**No motor hoje**
- ◐ Protótipo na tela com blocos de 2% e dividendo sem mando (R16.15); empresas,
  preço e compradores de protótipo, que só mudam a tela.
- ☐ Preço = lucro × múltiplo × humor (R16.16, R16.34); investidores e quebra
  (R16.35); bolsa sem o governo (R16.29); ações no patrimônio dos pops (R16.28); base
  e caminhos (R16.30); índice da bolsa (R9.6).

**Em aberto**
- Blocos: o protótipo usa "blocos de 2%"; o desenho diz que as ações são negociadas
  no turno, "sem blocos fixos", e fala também em "preço do bloco". Decidir o que
  vale quando o protótipo da bolsa virar motor.
- **Pregão** (autor, 14/nov): não é o minigame da bolsa; é uma **consequência de ignorar a dívida**. Ligar à 3.12 (Finanças públicas). **ESTUDAR** como funciona.
- A ordem e o tamanho de cada regra de bolsa (as "ideias de lei" ainda não viraram
  leis).

---

### 3.9 Companhias e estatais (operações do Estado)

**O que é**
Camadas: ação (fatia que dá dividendo, sem mando), empresa (conjunto de prédios de um
setor, com dono que manda) e prédio. Trocar o dono não mexe no prédio. Companhias e
estatais mudam de dono por Operação, nunca por lei.

**O jogador**
- Abre a lista de companhias (filtro por setor ou dono; colunas de lucro, valor na
  bolsa, empregos, parte do Estado, dividendo, risco político) e escolhe: comprar
  cotas, estatizar, privatizar, transformar em cooperativa, criar estatal. Cada uma
  é Operação, não lei.
- Comprar cotas (jogo A): define meta, prazo e discrição; o jogo divide a meta pelos
  turnos; passar do Limite de aviso ao mercado sobe preço e risco.
- Estatizar ou privatizar (jogo B): decide só querer ou não; o resto chega como
  papéis para assinar na mesa; no leilão vê os compradores e define o preço mínimo.
- Só mexe em companhias, nunca em fábrica solta.

**Peças**
- **Leis que controlam as operações:** Indenização, Prazo de pagamento, Regra depois
  da venda, Política da empresa estatal, Limite de aviso ao mercado, Ação de ouro,
  Autorização para estatizar e vender (presidente, Congresso ou plebiscito).
- **Verbas:** Verba das estatais (por setor, % do PIB) mantém e opera o que existe;
  Construção de estatais paga obras novas na fila.
- **Papéis na mesa (11/nov):** Autorização, Proposta do órgão e Resposta; cada um com
  prazo; a mídia lê cada passo; papel duvidoso pode surgir. Comprar cotas, Encomendar
  usina e Megaobra não têm papel.
- **Pedidos na mesa:** empresas e compradores mandam pedidos para comprar estatais.
- **O partido não compra nem vende:** quem faz é o Estado, por lei ou decreto;
  doação de companhia é conflito de interesse.
- **Ficha da empresa na bolsa:** mostra prédios, da extração ao refino.
- **Operações do Estado** (estatizar, criar estatal, cooperativa, vender companhia ou
  prédio); empresas de energia podem ser vendidas; transporte fica no fundo do
  cálculo.

**Regras**
- 08/nov: Operação e Ato não são lei; só lei é regra permanente com bolha.
- 08/nov: só mexemos em companhias. A decisão sobre uma empresa é Operação sobre a
  companhia, não ficha por setor com projeto de lei.
- 11/nov: o mesmo molde de 3 papéis em Estatização, Privatização e Cooperativa.
- 08/nov: o Estado compra e vende de verdade; o dinheiro entra e sai do cofre.

**Ligações**
- Sociedade: acionistas reagem de um jeito por tipo; grupos e mídia reagem.
- Leis: as sete acima.
- Mundo: o país do dono reage na Justiça; multinacional compra controle.

**Referências**
- Victoria 3: companhias (1.8), dono por nível e investimento estrangeiro.
  ([pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Estatais e Mehr (Irã): Estado constrói e tira obra do privado.
- Demais jogos de compra e venda de estatal: **ESTUDAR** (só existe o desenho
  próprio).

**No motor hoje**
- ◐ Empresas declaradas pelo país (R16.11).
- ☐ Estatizar, privatizar, criar estatal, cooperativa e comprar cotas como Operação
  com 3 papéis (R16.14); lista de companhias.
- ☐ Estatais e ações rendendo ao cofre e podendo ser vendidas.

**Em aberto**
- Leilão (preço mínimo, compradores); oferta pública × obrigar a vender; quem reage
  (acionistas, país do dono).
- A Verba das estatais é uma lei por estatal ou uma por setor? O GDD descreve "por
  setor" e mantém a pergunta aberta.

---

### 3.10 Setor externo

**O que é**
O país importa o que falta e exporta o que sobra, pelas tarifas, subsídios e acordos
(leis).

**O jogador**
- Mexe na régua de tarifa, imposto de exportação e subsídio, por setor (aba por setor
  e aba "Todos"). Nenhuma lei dá lucro a um produto.
- Sente dependência de uma potência (média do que o país compra dela) e preço do que
  vem de fora.

**Peças**
- **Leis (08/nov):** Tarifa de importação, Facilitação aduaneira, Zonas francas,
  Imposto sobre exportação, Subsídio às exportações, Defesa comercial, Controle de
  exportação de produtos estratégicos, Venda de armas ao exterior, Triagem de compra
  estrangeira, Remessa de lucro ao exterior, Fábrica estrangeira no país.
- **Leis gerais de estrangeiros (02/nov, Fatia 8):** triagem, remessa, fábrica
  estrangeira, fábrica nossa no exterior, concorrência e acordo com potência.
- **Cobertura, fornecedores e dependência.**
- **Sanção pelo mercado** (com o Mundo); terras raras: quem produz pode sancionar
  pelo mercado.
- **Câmbio** como ligação com o exterior.

**Regras**
- 08/nov: régua por setor; nenhuma lei dá lucro a um produto.
- 02/nov: produto que o país não declara conta cobertura 0 (compra tudo do mundo).
- Evidência apontada no GDD: a tarifa recai quase toda sobre quem compra; abrir o
  comércio sobe a produtividade com ganhadores e perdedores; menos burocracia nos
  portos corta o custo (10 a 20% em simulações); zonas francas dependem da
  governança.

**Ligações**
- Sociedade: a tarifa mexe no preço do que o pop compra.
- Leis: as 11 acima.
- Mundo: preço do mundo, fornecedores, sanções, acordos.

**Referências**
- Victoria 3: acesso ao mercado mundial por porto; tarifas e subsídios (0, 12,5, 25,
  50%); embargos. ([referência](estudos/mercado-vic3-referencia.md))
- A evidência do GDD não traz fonte nomeada: **ESTUDAR** (achar as fontes).

**No motor hoje**
- ◐ Tarifa, subsídio e acordo (R16.4); falta tarifa e subsídio na conta.

**Em aberto**
- Régua por setor; sanção que passa pelo mercado (com o Mundo).

---

### 3.11 Setores com regra própria

Cada um precisa de plano quando for a vez; todos já estão desenhados no GDD. Não há
estudo nem jogo de referência para Energia, Agricultura, Ciência, Meio ambiente,
Construção civil, Transporte, Cultura, Defesa civil e Minério: em cada um, a
referência fica **ESTUDAR**. Para todos, no motor ainda não há mecânica própria nem
R.

#### 3.11.1 Energia (08/nov)

**O que é**
A usina dá capacidade; a eletricidade é produto do mercado, com preço e importação
(como no Victoria 3; decidido em 14/nov). Faltar energia encarece e trava a
indústria.

**O jogador**
- Encomenda uma usina num estado e numa fonte (Operação, paga com os Investimentos
  por fonte); escolhe quem fica sem luz quando falta, num papel; segura a conta de
  luz (lei pegadinha); estatiza ou vende a companhia. As linhas são automáticas.
- Sente a falta chegando num gráfico do futuro (gasto contra geração, contando obras
  em andamento) e o apagão como evento.

**Peças**
- Energia nunca vem do nada: gerada = gasto das companhias + gasto da população +
  perdas na rede; índices Energia gerada, Energia gasta, Preço da energia, Matriz
  limpa e Acesso à energia.
- A usina dá a capacidade; a eletricidade é um produto que quase todo prédio usa,
  com preço no mercado e importação quando falta.
- Por estado: usinas e linhas ligadas aos vizinhos; apagão por estado.
- Produtividade é conta por companhia.
- Quem constrói: as companhias com a própria reserva; o Estado pelos Investimentos
  por fonte.
- Mapa elétrico.
- Cada fonte é uma aposta (hidrelétrica, solar, eólica, térmica, nuclear).
- Comércio de energia como Posição por país, em degraus.
- Urânio: escada de enriquecimento; vender urânio em segredo é Ato.
- No motor (02/nov): demanda civil 35 e das empresas 65 (pontos); a falta freia até 8
  pontos de crescimento ao ano e sobe o preço.

**Regras**
- 08/nov: as linhas são automáticas: o presidente só define o dinheiro, porque o jogo
  não é de construção.
- 08/nov: ao estatizar, a companhia federal é criada sozinha.
- 08/nov: quem fica sem luz quando a energia falta é escolha do jogador, num papel.
- 14/nov: a usina dá capacidade e a eletricidade é produto do mercado, com preço e
  importação.

**Ligações**
- Sociedade: Acesso à energia; conta de luz; energia de casa tem regra própria
  (eletricidade, gás, lenha).
- Leis: Investimentos por fonte; Enriquecimento de urânio; comércio de energia.
- Mundo: urânio e comércio de energia com vizinhos mudam a desconfiança e a
  dependência.

**Referências** **ESTUDAR** (Victoria 3 como ponto de partida para a eletricidade
como produto).

**No motor hoje**
- ✅ Energia como capacidade contra demanda (R16.3), com 5 fontes e leis de verba.
- ☐ Resto do pacote: tarifa social, subsídio à energia limpa, imposto sobre
  combustível fóssil, licenciamento, fiscalização nuclear; risco da nuclear; rede por
  região.
- ☐ Eletricidade como produto do mercado, com preço e importação; energia por estado
  e apagão como evento; escolha de quem fica sem luz num papel; encomendar usina
  (Operação); comércio de energia; urânio.

**Em aberto**
- Energia por estado e apagão como evento: "a pensar".

#### 3.11.2 Moradia e terra (campo × cidade)

**O que é**
Moradia é estoque local (formal e precária), não produto do mundo; a terra rural é de
donos grandes, pequenos ou de ninguém; as duas pontas se ligam pela gente que se
muda.

**O jogador**
- Escolhe leis de terra no campo e de moradia na cidade.
- Leis da cidade em 4 alavancas (Construir, Terra urbana, Aluguel, Ocupação), cada
  uma com leis nos 6 lados.
- Reforma agrária é processo (terra parada, desapropriada ou comprada, assentamento,
  título); cada lei empurra uma etapa; o partido não escolhe fazenda.
- Sente déficit, preço, favela e casas vazias.

**Peças**
- **Estoque em 3 faixas (07/nov):** pobres, classe média, ricos, mais a favela, com
  casas ocupadas e vazias; o aluguel de cada faixa reage às vazias.
- **Quem constrói:** empresa pelo lucro, governo pela lei e pop (pobre autoconstrói
  precário, classe média financia, rico investe para alugar).
- **Casas descem de faixa** cerca de 2% ao ano.
- **Êxodo:** a gente do campo vai para a cidade quando a renda esperada lá passa a do
  campo.
- **Fazendas em 3 tamanhos;** imposto sobre terra e imóvel parado (curva de Laffer);
  desapropriar pela fila do órgão de terras.
- **Terra (09/nov):** fila visível (vistoria, prazo de defesa, terra obtida,
  assentamento, título); duas contas por estado (Preço da terra e Segurança da
  terra); comprar ou desapropriar; movimentos sem-terra nascem sozinhos; papéis na
  mesa.
- **No motor (04/nov, moradia):** família = pessoas ÷ tamanho; déficit, favela e
  casas vazias saem da contagem; desgaste de 4% ao ano; governo constrói pela lei de
  verba; empresas constroem conforme setor, preço, juro, imposto e corrupção; sem
  casa, a precária cresce; bolso: o preço pede uma renda; casa vazia (14/nov); êxodo
  pela concentração.

**Regras**
- 07/nov: estoque em 3 faixas; casa sem morador não some.
- 04/nov: o país começa parado: as obras do turno 0 só repõem o desgaste.
- 14/nov: casa de quem é despejado fica vazia; as vazias desgastam como as formais;
  o índice de casas vazias anda pela contagem.
- 04/nov: nenhuma lei sabe de pobreza; o resultado sai da renda contra a conta.
- 09/nov: o preço da terra sobe com compra em massa; a segurança da terra cai com
  desapropriação e ocupação.

**Ligações**
- Sociedade: renda do pop diz quem paga a casa; movimento sem-terra; êxodo.
- Leis: 4 alavancas da cidade, leis do campo nos 6 lados; "lei nenhuma fala das duas:
  a ligação é a gente".
- Mundo: não se importa casa.

**Referências**
- Rosenthal (casas descem de faixa ~1,9% ao ano); Hansen e Rambaldi; Mast e outros;
  Turner e Wessel; programa Mehr; estudos de autoconstrução; Greenaway-McGrevy e So;
  Diamond e outros; VATT; IFS.

**No motor hoje**
- ✅ Déficit, preço e favela; casas vazias (R16.19, 14/nov).
- ☐ Estoque local em faixas (R16.17); quem constrói (R16.18); 4 alavancas (R16.20);
  terra rural e êxodo (R16.21 a R16.24); bem tomado pelo Estado ganha destino por lei
  (R16.25); fila de terras.
- Hoje o motor tem estoque agregado e êxodo pela concentração, não as 3 faixas.

**Em aberto**
- Velocidade do êxodo, custo da casa e ritmo da autoconstrução; se o êxodo é índice
  ou só gente mudando de pop.
- Destino do bem tomado pelo Estado (comunidade, Estado ou famílias com título): uma
  lei por destino, a decidir.
- A fila genérica (serve Terra, Patrimônio e Judiciário) deve nascer uma vez só.

#### 3.11.3 Água e saneamento

**O que é**
Rede de água e esgoto do país; o índice é a parte das famílias atendidas.

**O jogador**
- Paga obras com a lei de verba, escolhe concessão, teto da tarifa e tratamento;
  sente a conta pedir uma renda e quem não paga ser cortado.

**Peças**
- Desgaste; governo faz obras; operadoras locais fazem o resto; bolso (renda mínima);
  concessão só onde dá lucro; teto da tarifa; tratamento melhora o meio ambiente;
  setor cheio (casas e rede disputam as mesmas vagas).

**Regras**
- 04/nov: aprovado como regra do motor; o país começa parado.
- 04/nov: nenhuma lei sabe de renda: o mesmo aumento quase não pesa onde sobra renda
  e corta muita gente onde falta.

**Ligações**
- Sociedade: tarifa tira padrão de vida; religa famílias quando a renda sobe.
- Leis: verba, concessão, teto da tarifa, tratamento.

**Referências**
- Urbanização de favelas, revisão Cochrane (efeito na saúde, fraco na renda).

**No motor hoje**
- ✅ Índice, desgaste, obras, bolso, concessão, teto, tratamento e setas para saúde e
  meio ambiente (aprovado em 04/nov); "não equilibrado, só dá direção".

**Em aberto**
- Água e saneamento é um dos 15 setores, mas a ligação dele aos prédios (estação de
  água, de esgoto, coleta de lixo) ainda é só planilha.

#### 3.11.4 Agricultura e pesca (09/nov)

**O que é**
A produção do campo por estado, em fazendas pequenas, médias e grandes, mais o peixe
de mar compartilhado.

**O jogador**
- Vive a briga central: o produtor quer preço alto e a cidade quer comida barata;
  quando a comida dispara, chega o papel "comida cara" (soltar o estoque, travar a
  exportação por Ato, importar ou não fazer nada).

**Peças**
- Nenhuma lei dá lucro a produto; a cadeia espalha.
- O dinheiro depende de quem recebe: subsídio sem teto valoriza a terra do grande e
  expulsa o pequeno.
- O campo fala com o resto: máquina empurra gente para a cidade, irrigação disputa
  água com a hidrelétrica, grão disputa com a ração.
- Compra pública da sobra de grãos; estoque é conta e estraga.
- Pesca por mar compartilhado; Acordo de pesca é Posição por país.
- Eventos: seca, colapso da pesca, carne contaminada.

**Regras**
- 09/nov: o Estado compra só uma parte da sobra, nunca do que falta.
- 09/nov: o mar fica com a Fiscalização ambiental.

**Ligações**
- Sociedade: o preço da comida e o êxodo; protesto e queda de aprovação.
- Leis: Controle de exportação, crédito, subsídio, Sementes transgênicas.
- Mundo: importar gasta dólares; Acordo de pesca.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta; só a cesta de comida existe.

#### 3.11.5 Ciência e pesquisa (09/nov)

**O que é**
Um nível de tecnologia por produto, sem árvore: fábrica acima do nível produz caro e
pouco, e o mundo avança.

**O jogador**
- Dá a verba de ciência e tecnologia e a divide em 7 fatias (Ciência básica, Saúde e
  remédios, Indústria e chips, Energia e baterias, Agro, Defesa, Espaço).
- Investir é apostar que o partido segue no poder; cortar dói na hora.
- Escolhe o alvo do programa espacial; a Lua é uma corrida entre países.

**Peças**
- Nível próprio (lento, ninguém tira) e emprestado (rápido, cai se cortam o acesso).
- Companhias com gasto de pesquisa que sobe a Produtividade.
- Polos de pesquisa, papéis do governador e do deputado.
- Três limites: Edição de genes, Testes em animais, Pesquisa com vírus perigosos.

**Regras**
- 09/nov: Marte está fora (autor).
- Decidido: tecnologia como árvore fica fora do jogo pronto.

**Ligações**
- Sociedade: bancada racha com Edição de genes (Bússola).
- Leis: as 7 fatias, os 3 limites, Cooperação científica.
- Mundo: a Lua é corrida; nível emprestado vem de cooperação e fábrica estrangeira.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.6 Meio ambiente (09/nov)

**O que é**
O órgão ambiental recebe a verba da Fiscalização ambiental, escolhe onde agir, multa
e licencia; não existe botão de pressionar.

**O jogador**
- Assina as leis e responde aos papéis; lei dura racha os deputados; governador pede
  alívio; companhia poluidora oferece dinheiro por voto.
- Com o presidente mandando, a licença nunca é negada e o órgão fica mais corrupto;
  meio independente, chega o papel; independente, não assina.

**Peças**
- Desmatamento nasce do lucro do agro contra o risco de punição; a Reserva da fazenda
  define o ilegal.
- Licença sem exame sobe na hora Desmatamento ou Emissões.
- Emissões são conta por companhia; índices Emissões de carbono, Desmatamento,
  Qualidade do ar.
- Produtos novos: Terras raras, Baterias, Veículos elétricos.

**Regras**
- 09/nov: pressão só como resposta a um papel e fica no registro.
- 09/nov: obra do Estado sempre passa pelo órgão; certificadora privada vale só para
  obras privadas.

**Ligações**
- Sociedade: Saúde ambiental lê o índice Meio ambiente.
- Leis: Fiscalização ambiental, Reserva da fazenda.
- Mundo: os países compram menos do agro quando a licença passa sem exame.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta; o meio ambiente hoje vem só dos efeitos das leis de
energia.

#### 3.11.7 Construção civil (09/nov)

**O que é**
Duas filas, um setor: a pública e a privada usam a mesma capacidade de construir.

**O jogador**
- Só vê a fila e mexe só pelas leis (Prioridade das obras, Divisão de 100% da verba
  de construção).
- Sente o preço: muita obra sobe cimento e salário.
- Papéis: obra cara, cartel, companhia que quebrou, emenda de deputado.
- Inaugurar dá voto; obra inacabada vira ataque.

**Peças**
- Público: constrói o que o país precisa e o governo pagou, sem olhar lucro.
- Privado: constrói onde dá lucro.
- Construtora nacional é companhia do Estado; cartel só nasce entre as privadas.
- Cartão da obra: motivo do atraso e quem resolve.

**Regras**
- 09/nov: o jogador não mexe na obra; só dá dinheiro ao setor.
- 07/nov: a verba de construção é separada da de manutenção.

**Ligações**
- Sociedade: voto por inauguração.
- Leis: Prioridade das obras; incentivos ao setor.
- Mundo: importar cimento, trazer operários de fora (papel).

**Referências** **ESTUDAR** (o Mehr, Irã, trata só de obra de casa pelo Estado).

**No motor hoje** ◐ Fila da construção civil, capacidade e corrupção que atrasa (por
setor).

**Em aberto**
- Duas filas na mesma capacidade, lei Prioridade das obras.

#### 3.11.8 Transporte (09/nov)

**O que é**
O presidente só assina o que é federal; ônibus, passagem, rodízio e estacionamento
são municipais.

**O jogador**
- Dá a Verba de conservação e a fatia Transportes da Verba de construção; o órgão
  reparte, linhas e rotas são automáticas.
- Megaobra e Encomendar usina são escolha direta, com papéis.

**Peças**
- Cada lei diz quem é atendido e quem paga.
- Táxi e aplicativo; carro elétrico; Peso da multa.

**Regras**
- 09/nov: o federal age por regra geral ou programa, como o passe livre onde a
  cidade aderir.

**Ligações**
- Sociedade: direito de quem trabalha vai para Trabalho; família removida por obra vai
  para Moradia.
- Leis: as acima.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.9 Cultura e patrimônio (09/nov)

**O que é**
Uma fila no órgão de Patrimônio, com a forma da fila de Terra: Pedido, Estudo,
Decisão, Conservação.

**O jogador**
- Empurra uma etapa por lei; o partido não escolhe o casarão.
- Cada sim é conta para sempre; cada não é definitivo.
- Efeito: quem pediu aprova, quem perdeu reclama, e o que é protegido leva turista a
  Hotel e restaurante.

**Peças**
- Dois tipos de pedido: proteger e retirar.
- Símbolo de fé segue a Religião do Estado.
- Estátua vira disputa entre grupos.
- Fora da fila: Verba de cultura e esporte, Conteúdo nacional, Meia-entrada, Sediar
  grande evento.
- Fora do jogo: clube, torcida, estádio e categoria feminina.

**Regras**
- 09/nov: o órgão resolve os casos calmos; o disputado vira papel.
- 09/nov: a fila deve nascer genérica (serve a Terra e ao Patrimônio).

**Ligações**
- Sociedade: os grupos pedem sozinhos, conforme tamanho e insatisfação.
- Leis: Quem pode pedir, O que pode ser protegido, Direito do dono, Preço de museu e
  parque federal.
- Mundo: turismo.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

**Em aberto**
- A fila genérica nasce uma vez só.

#### 3.11.10 Defesa civil (09/nov)

**O que é**
O desastre chega sozinho; o estrago é a gravidade menos o índice Preparo contra
desastres, que sobe devagar com verba e cai sozinho a cada turno.

**O jogador**
- Dá verba e escolhe a resposta nos papéis (enchente, encosta, barragem, prefeito
  pede ajuda, incêndio, reconstrução).
- Cortar a verba sobra dinheiro agora e a conta vem no desastre seguinte.
- Sente gente com nome e voz no papel.

**Peças**
- O partido não opera: bombeiros são dos estados; o federal dá dinheiro e regra.
- Governador aliado faz a verba render mais.
- Leis: Verba da defesa civil (Prevenção, Resposta, Reconstrução), Alerta de
  desastre, Reserva de emergência, Ajuda a quem perdeu a casa, Verba só com regra de
  área de risco.

**Regras**
- 09/nov: o jogador não escolhe a região socorrida; a ajuda segue a gravidade.

**Ligações**
- Sociedade: o papel tem povo; a mesma notícia sai na mídia.
- Leis: as acima.
- Mundo: o clima define a gravidade.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.11 Minério e petróleo (09/nov)

**O que é**
Instituição própria de petróleo, gás, combustíveis e minério.

**O jogador**
- Não escolhe mina: a lei decide quem fica com o dinheiro e quem paga a conta; a
  companhia abre onde dá lucro.
- Sente quem aparece (garimpeiro, cidade da mina, aldeia, vila abaixo da barragem) e
  o Preço do combustível.

**Peças**
- Leis: Imposto sobre o minério, Garimpo, Áreas abertas à mineração, Parte do dono da
  terra, Prazo para acabar com barragem velha, O que a mina deixa quando fecha, De
  onde veio o ouro.
- Reaproveita Destino dos royalties, Garantia contra acidentes, Imposto e Controle
  de exportação (com minério e terras raras como setores).
- Papéis: barragem, garimpeiros, mina que fecha, mineradora que ameaça demitir.

**Regras**
- 09/nov: sem índice próprio para o minério.
- 11/nov: o índice Preço do combustível existe para o Subsídio e o Imposto sobre
  combustíveis; dele saem o frete, o preço da comida e o papel do caminhoneiro.

**Ligações**
- Sociedade: mina fechando aparece no Desemprego.
- Leis: as acima.
- Mundo: Controle de exportação.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.12 Serviços do Estado

**O que é**
Prédios do Estado fora do mercado (hospital, escola, delegacia, tribunal, presídio,
quartel, repartição), pagos pelo orçamento, que dão emprego e salário sem lucro.

**O jogador**
- Cortar verba fecha prédio, demite pop e reduz o serviço.
- Pode terceirizar por lei o que aceita terceirização.

**Peças**
- Serviço do Estado como "dono": verba por lei, sem lucro.

**Ligações**
- Sociedade: salário público vira renda.
- Leis: terceirização; verba por instituição.

**Referências**
- Preso barato tira vaga do livre (Poyker); presídio terceirizado prende mais tempo
  (Mukherjee).

**No motor hoje**
- ☐ Hospital, escola, delegacia como prédios fora do mercado (R16.31); terceirizar
  por lei (R16.32).

**Em aberto**
- Quais serviços do Estado aceitam terceirização além dos já listados na planilha.

---

### 3.12 Finanças públicas

**O que é**
O Tesouro em cinco contas separadas: receita, gasto, juros, cofre e dívida. Juros não
descontam da receita: são uma linha própria. As contas do Estado moram na Economia,
porque são dinheiro; quem executa a lei (instituições, ministros, caixas) está na
parte das Leis.

**O jogador**
- Escolhe impostos, verbas, regra fiscal e a política de déficit e superávit; vê o
  dinheiro na moeda do país, por ano, além de % do PIB.
- Cada regra fiscal abre a sua figura (envelopes com cadeado, cofrinho, velocímetro,
  caixa d'água, luzes de painel, pente fino, escada de vencimentos, barra de
  reserva).
- Sente o cadeado: a verba trava na marca e diz "travado por lei"; em crise, "só X%
  livre para cortar".
- Em crise pode suspender a regra fiscal por ato; se a crise é real a Credibilidade
  fiscal cai pouco, se não, cai muito.

**Peças**
- **Receita:** leis com cálculo mais `receita_fora_das_leis` (o imposto que ainda não
  virou lei). **Gasto:** leis de gasto mais `gasto_fora_das_leis`. **Juros:** taxa ×
  dívida. **Cofre** e **Dívida** são estoques.
- **Primário e nominal:** primário = receita − gasto; nominal = primário − juros.
- **Falta (lei Déficit):** fração paga pelo cofre; o resto vira dívida; sem cofre,
  tudo vira dívida. **Sobra (lei Superávit):** fração que vai ao cofre; o resto abate
  a dívida. Sem as leis, a falta sai do cofre e a sobra vai ao cofre.
- **Juros** sobem com dívida acima da tolerância e com inflação.
- **Impostos por base:** curva de Laffer com evasão
  (`t × R × (1 − t)^e × (1 − evasão)`), pico declarado pelo país; consumo, lucro e
  emissões usam a mesma curva; a onda 1 traz patrimônio, aplicações, imóvel, capital,
  movimentação, folha e bancos, com `incide` por estrato.
- **Regra fiscal (08/nov):** Meta de resultado, Teto de gasto, Limite da dívida e
  Punição se descumprir. No motor, as quatro regras checadas pelo papel são teto de
  gasto, meta de resultado, limite da dívida e teto da carga; as duas listas existem
  desde a onda 1. A punição vale enquanto houver regra estourada (corte, trava,
  crime); o piso da verba não desce abaixo de `piso × arrecadação`.
- **Gasto mínimo obrigatório,** **Revisão de gastos** (recupera parte do que cada
  área perde no caminho, cerca de 1/4 na média, 1/2 na base zero, valores de
  partida), **Prazo da dívida** (escada de vencimentos), **Fundo soberano.**
- **Dívida em moeda de fora:** juros menores, mas sobe junto quando a moeda cai
  (dívida de 80% do PIB, 30% em moeda de fora, moeda cai 20%: vai a 84,8%).
- **Transferência** com cobertura: o excesso vai ao estrato de cima.
- **Conta da previdência:** déficit = benefícios − contribuição da folha.
- **Emissão de moeda** cobre falta sem dívida e paga em inflação; **Calote** apaga
  dívida e derruba reputação, juros e investimento por anos.
- **Bens do Estado:** estatais e ações rendem lucro e dividendo ao cofre e podem ser
  vendidos.
- **Estatal** paga obra do cofre; sem cofre, da dívida.

**Regras**
- 14/nov: nenhum dinheiro some. Para o Estado, isso vale assim: o dinheiro entra por
  lei ou bem do Estado e sai por lei ou obrigação; gastar exige imposto, dívida ou
  emissão. A conta sempre fecha, e fecha também para o resto da economia (princípio 5
  reescrito).
- 08/nov: regra fiscal em 4 leis; cada lei abre a sua figura; gasto mínimo mostrado
  com cadeado; revisão de gastos; dívida em moeda de fora.
- Invariante: a variação de cofre − dívida é igual ao resultado nominal do turno.
- 02/nov: Déficit e Superávit entram em `contas`.
- 14/nov: a divisão do gasto de cada instituição entre pessoal, compras e obras não é
  fixa.

**Ligações**
- Sociedade: imposto de renda e transferência são hoje o único bolso que se mexe; a lei
  de cobertura muda quem recebe.
- Leis: imposto (curva), verba, regra fiscal, Déficit, Superávit.
- Mundo: dívida em moeda de fora depende do câmbio; juros somam o risco do país.

**Referências**
- Estudo de 22/out (antes do recomeço de 31/out, só ideia): Democracy 4 e Victoria 3
  para PIB, receita e gasto, dívida, juros e crise, tempo e suavização. As partes
  "SisGov hoje" desse estudo estão velhas (cita Selic e turno trimestral).
  ([estudo](estudos/victoria3-e-democracy4.md))
- Victoria 3: imposto por 5 níveis (por pessoa, terra, consumo, renda, dividendos);
  gastos são salários e insumos dos prédios do governo; déficit vira dívida.
  ([pesquisa](estudos/pesquisa-jogadores-14nov.md))
- Saez, Slemrod e Giertz (Laffer); Reinhart, Rogoff e Savastano; Laubach; Clarida,
  Galí e Gertler.
- Estudos de impostos: fortunas arrecadam pouco e afastam ricos; fiscalizar os mais
  ricos devolve mais de 6 dólares por dólar; anistias repetidas aumentam a sonegação.
- Pesquisa de jogadores: orçamento como número único sem sentir o custo (Suzerain);
  "é a economia e me sinto burro" (Democracy 4).

**No motor hoje**
- ✅ Receita, gasto, juros, cofre e dívida separados (R10.1); juros sobem com dívida
  e inflação (R10.2); regra fiscal por lei (R10.3).
- ◐ Dinheiro na moeda do país (R10.4).
- ☐ Caminho do dinheiro (R10.7); emissão de moeda (R10.5); calote (R10.6).
- ☐ Dívida com prazo e em moeda de fora: hoje a dívida não vence (o governo paga os
  juros e rola o principal), uma taxa só, prêmio linear; o desenho do GDD é a meta.
- ☐ Estoque de dívidas de quem sonega e Anistia fiscal.

**Em aberto**
- **Pregão** como consequência de ignorar a dívida (autor, 14/nov; ver 3.8). **ESTUDAR**.
- Calibrar: os juros comem 16% do PIB e a dívida vai de 78% a 107% em 24 turnos
  (R4.3).
- Custo fixo por ministério e por cargo; quanto a corrupção desvia; o dinheiro "fora
  das leis" de hoje.
- Estatais e ações rendendo ao cofre (ligado à 3.9).
- Quanto o Estado paga em salários, compras e obras de cada instituição: a divisão
  não é fixa (14/nov); falta definir como calculá-la (ver 3.6).

---

## Parte 4. Máquina pública (as leis e quem as executa)

Esta parte tem duas metades. Primeiro, as regras das leis: o que é uma lei, tipos, jeitos, canais, escassezes, programas, processos, força e atraso, lei boa e lei ruim, índices. Depois, "Quem executa": a lei mora numa instituição, e a instituição fica com um ministro. Por isso instituições, ministros, caixas e fronteira do governo entram aqui (14/nov). As contas do Estado (Tesouro, receita, gasto, dívida) ficam na Parte de Economia. Presidente, vice, sucessão, pessoas e governadores ficam na Parte Política.

Números de partida (14/nov): 511 leis na planilha `gdd.xlsx`; 34 instituições com lei; 73 programas no motor; 4 abas de apoio (degraus com 1032 linhas, efeitos com 1359 linhas). A planilha tem 256 leis de forma régua e 255 de degraus.

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R é o requisito em `requisitos.md`.

---

### 4.1 O que é uma lei

**O que é.** Uma lei é uma pergunta que o presidente responde e que fica valendo.

**O jogador.**
- Propõe, muda e revoga leis.
- Toda lei aparece como uma bolha no mapa. Mecânica nova não vira painel de gestão.
- O laço vivido: vê um problema, procura as leis que mexem nele, escolhe quanto mover sabendo quem perde, paga no Congresso e nos grupos, espera o atraso, vê o efeito (inclusive o que não queria), e o efeito cria o próximo problema.
- Cada lei só precisa servir a esse laço. Se não ajuda em nenhum passo, não é do jogo.
- O jogo deve ter centenas de caminhos. O autor recusou um núcleo de 40 leis (08/nov).

**Peças.** Uma lei tem sete peças:
- a pergunta, uma só; se responde duas, são duas leis;
- as respostas possíveis (o jeito);
- o dono, que é a instituição que executa;
- a entrada no motor (o canal), que é o primeiro número que a lei mexe;
- quem ganha e quem paga;
- o lado, para onde puxa na bússola;
- o tempo até o efeito aparecer.

Sem canal ou sem quem ganha e paga, a lei não está pronta.
- O molde da lei na planilha: nome e texto, instituição, tipo, forma, quórum (comum, absoluta, constitucional ou mandato), bússola, canal, efeitos, ganho e custo. Uma lei sem canal não entra no jogo.
- Duas camadas: essenciais (estrutura do Estado, mudam pouco) e jogabilidade (as políticas).
- Toda lei mora numa das 36 instituições, ou nas regras dos poderes. Instituição não é ministério.

**Regras**
- **O que não é lei** (14/nov): processo (vai para Processo), consequência (vira índice), caso a caso (papel na mesa ou evento), opção de menu (Posição por país ou Operação), o que acontece uma vez (Ato), informação (marca na régua de outra lei).
- **Princípio 1:** leis são o núcleo do governo; mudar uma lei muda o jogo.
- **Princípio 3:** nenhuma lei é um controle só que faz coisa grande; o tema se divide em leis menores, cada uma com escolha de verdade. A regra vem do autor, que cobrou duas vezes (01/nov): "as leis têm que ser jogáveis".
- As 4 perguntas de 03 e 04/nov (quanto; em partes ou no todo; processo ou lei; "um presidente real assinaria e pronto?") eram do tempo de construção e não deram certo; valem as regras desta parte (4.1 a 4.7). (autor, 14/nov)
- **Princípio 13:** toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que só mexe na opinião não basta.
- **Princípio 4:** nada é bom ou ruim; toda lei tem ganhadores, perdedores e consequências.
- **Princípio 5** (reescrito em 14/nov): nada aparece do nada, e nenhum dinheiro some, nem o ilegal. Todo dinheiro do Estado entra por uma lei ou por um bem do Estado e sai por uma lei ou obrigação. O dinheiro desviado vai para o bolso de alguém e deixa rastro.
- **Princípio 9:** jogabilidade primeiro, realidade como base; lei inventada vale se for plausível.
- **Princípio 10:** o motor não conhece nome de lei; a lei declara, o motor calcula.
- **Nada = não legislada** (14/nov): nenhum degrau "nada, nenhum, sem regra" e nenhuma régua que no mínimo não faz nada. A lei existe quando age; revogar é voltar ao nada. O país declara só a lei que tem de verdade; o resto é o cardápio do jogador. Só a lei essencial pode ter o degrau "nenhum", e ela não se revoga.
- O país declara as leis que tem. Lei que não faz sentido no país não aparece; lei que não cabe ao presidente fica **inativa** e alguém pode propô-la.
- O texto da tela sai dos números da lei: texto e motor nunca discordam.
- **Juntar** quando duas leis mexem no mesmo número ou uma é degrau da outra. **Separar** quando os degraus são coisas diferentes, quando a lei tem dois números, ou quando cada estrato ou setor pede o seu valor.
- Régua por estrato ou por setor vira uma lei por estrato ou setor, ligadas pelo "Parte de". A planilha tem 55 leis com "Parte de" preenchido.
- **Leis e decisões** (08/nov): lei é regra permanente e tem bolha. A decisão do presidente é o que aparece ao clicar num país ou companhia (Ato ou Operação), com custo, tempo e reação, e é limitada pelas leis.
- **Mercado indireto** (08/nov): não existe lei que dê lucro a um produto. Leis mexem em demanda e custo, e a cadeia espalha.
- **Resultado emerge** (04/nov): a lei muda só um número. Se é boa ou ruim sai do estado do país, nunca de condição escrita na lei.
- **Os dois lados legislam:** esquerda e direita têm leis próprias; zerar uma lei de um lado não é política do outro. Ao listar as leis de uma instituição, conferir o equilíbrio dos lados.
- **Sem limite de leis por instituição** (07/nov); não se corta um núcleo (08/nov).
- **Sem pontos de ação:** o limite vem do mundo (Congresso cheio) e só atrasa, nunca proíbe (11/nov).
- **Jogável não é demorado:** a decisão acontece no turno; nenhuma opção com efeito neutro (02/nov).
- **Aprovação sem sorteio:** vem do Congresso e dos grupos, nunca de um dado.
- **Mudar de ideia custa:** propor e desistir de uma lei não pode ser de graça.
- **O Congresso é a trava, não o jogo:** o jogador pode propor qualquer coisa; o exorbitante o Congresso barra.
- **Dinheiro:** a lei diz onde mexe no dinheiro e na vida (quem paga, quem recebe, que preço sobe, que emprego abre). O gosto nasce daí. A bússola continua, com peso menor que o bolso.
- A lei é medida pelo país da partida ("2 salários médios do país"), nunca por país real.

**Ligações**
- Sociedade: toda lei chega ao pop; o motor calcula o efeito em cada pop e o gosto nasce daí. Hoje a satisfação do grupo lê renda, índices cobrados e bússola; só imposto de renda e transferência mexem no bolso; as outras cerca de 480 leis agradam ou irritam só pelo ponto na bússola.
- Economia: a lei entra por imposto, verba, transferência, preço, regra ou direito (4.4).
- Instituições (4.18): a lei mora numa instituição e age pelo rendimento dela (4.11).
- Política: a bússola da lei define quem gosta; quórum e voto no Congresso decidem se passa.

**Referências.** Victoria 3: ligação entre economia, pop e política, a mais elogiada pelos jogadores. Victoria 3: sorteio para passar lei irritou; propor e cancelar virou truque. Frostpunk: "dá para desbloquear tudo, nada renuncia nada".

**No motor hoje**
- ✅ Duas camadas, régua e degraus (R7.1). ✅ A lei declara efeito, força, atraso, bússola e base (R7.2). ✅ Validador com arquivo, campo e motivo (R7.3). ✅ País declara as leis que tem (R7.4). ✅ Texto sai dos números (R7.5). ✅ 511 leis saíram da planilha (R7.14).
- ◐ Toda lei chega ao pop (R7.12): 120 leis chegam por um caminho do motor e as outras esperam a triagem. ◐ Temas em pacotes (R7.6). ◐ Leis padronizadas por instituição (R7.22): base pronta, faltam as 4 ondas. ◐ Toda lei numa instituição (R7.13).
- Pela planilha de hoje: 338 de 511 leis ainda têm canal "espera" (320 delas "triagem"); canais já preenchidos: regra 74, verba 70, imposto 16, direito 9, transferência 4.
- Dados de partida do plano: 100 leis não mexem em nada; 47 leis estão no centro da bússola e nenhum grupo reage a elas; só cerca de 80 têm dinheiro de verdade.

**Em aberto**
- Como medir a força de um grupo e quanto ela muda a popularidade de uma lei.
- O que fazer com as 100 leis que não mexem em nada.
- Se cada instituição e cada lei responde a um dos poderes.
- Instituições sem jogo (Estados e municípios, Religião, Turismo, Indústria; Funcionalismo tem uma lei) entram quando as leis forem refeitas.
- O motor ainda não faz a lei mudar a opinião pelo bolso, só por imposto de renda e transferência.
- Números que não batem: o requisito R7.12 diz 120 leis por um caminho do motor; a contagem da planilha dá 173 de 511 fora de "espera". Conferir qual é a mais nova.

---

### 4.2 Tipos de lei

**O que é.** O tipo diz quanto tempo a lei vale e como ela aparece: Lei, Lei com prazo, Ato, Posição por país ou Operação.

**O jogador**
- **Lei:** fica valendo, tem bolha.
- **Lei com prazo:** acaba sozinha e volta a "não legislada"; a bolha tem relógio. Exemplo: Anistia fiscal, uma janela de 1 a 3 turnos. O jogo lembra quantas vezes foi usada.
- **Ato:** acontece uma vez, como botão ou papel. Exemplos: Graça, suspender a regra fiscal, visita de Estado. Fica como botão na instituição, com custo na hora.
- **Posição por país:** nível decidido no menu do país, que fica valendo (Sanções, Aliança).
- **Operação:** em etapas, sobre uma companhia, com papéis na mesa; vive na lista de companhias e não vira bolha.

**Peças**
- Lei com escolha: além do valor, o jogador marca a que ela se aplica na própria bolha (exemplo: Incentivo a setores marca os setores). Os nomes vêm dos dados.
- Posição por país e Operação só ficam marcadas na planilha; entram com o Mundo e as Companhias.
- Planilha: 1 Lei com prazo e 1 Ato marcados; as demais têm o tipo em branco (Lei).

**Regras**
- Tipo, jeito e canal são os três eixos de classificação; a folha mostra os três ao jogador (14/nov).
- Lei com prazo e Ato nascem com a primeira lei que os usa: Anistia fiscal na onda 1, Graça na onda 2 (aprovado 14/nov).
- As opções do menu de país ou companhia não são leis; as leis decidem o que o presidente pode fazer (Alcance das sanções, Aprovação de tratados, Autorização para estatizar e vender, Indenização).
- Se tudo vira lei, o mapa enche de bolhas e a decisão do dia a dia se perde.
- Só se mexe em companhias, nunca em fábrica solta.

**Ligações**
- Economia: Operação age sobre companhias, com papéis na mesa.
- Mundo: Posição por país entra com o Mundo.
- Finanças públicas (3.12): o Ato tem custo na hora; a Anistia fiscal arrecada enquanto vale, menos a cada uso repetido.

**Referências.** **ESTUDAR** (nenhuma fonte de jogo ou estudo ligada a tipos de lei).

**No motor hoje**
- ◐ Tipos (R7.16): Lei com prazo e Ato feitos. `tipo` é `lei` (ausente), `prazo` (acaba depois de `prazo_turnos`; o estado guarda o fim em `prazos` e os usos em `usos`) ou `ato` (aprovado, os efeitos entram e a lei não fica; `valores.perdao_da_divida` tira parte da dívida).
- ☐ Posição por país e Operação (dependem do Mundo e da Economia).

**Em aberto**
- Como cada tipo aparece: bolha com relógio, botão, menu do país, lista de companhias.
- Se a "lei com escolha" (marcar setores na bolha) é a mesma coisa que o jeito Escolha, que saiu em 14/nov (ver 4.3), ou se vira Régua por setor.

---

### 4.3 Jeitos: Régua, Verba e Níveis

**O que é.** O jeito é como o jogador mexe na lei; são três, e só três: Régua, Verba ou Níveis. O jeito Escolha saiu (14/nov): as 7 leis que tinham Escolha viram Níveis na revisão.

**O jogador**
- Toda lei é um slider.
- **Régua:** qualquer valor entre o mínimo e o máximo faz sentido; não gasta direto.
- **Verba:** também é número, mas vira gasto do orçamento. Cobre dois canais: a verba que vai a uma **instituição** (canal verba) e a que vira renda de um estrato de **pops** (canal transferência). Disputa o caixa e entra no déficit.
- **Níveis:** poucos degraus fixos (3 a 5), cada um uma coisa diferente, sem meio entre eles ("meia cannabis" não existe).
- A régua não limita o jogador: vai ao extremo que algum país real já usou (IR dos EUA chegou a 91% nos anos 1950). Quem para o exagero são as consequências.

**Peças**
- Árvore de decisão: número com unidade real e meio que faz sentido? Se sai do orçamento como gasto, é Verba; se não, Régua. Se não, Níveis.
- Para pôr em ordem respostas de "jeitos diferentes": ordenar pelo quanto o Estado entra ou sai, ou por quantas pessoas a lei alcança. Sem ordem possível, são leis diferentes ou nem é lei. Opções sem ordem viram degraus de Níveis.
- Sinais de jeito errado:
  - Níveis que são números disfarçados ("pouco, médio, muito") viram Régua.
  - Régua cujo meio não existe (metade de um monopólio) vira Níveis.
  - Duas respostas só é slider faltando resposta: achar degraus do meio, ligar com outra lei ou apagar.
  - Dois números na mesma lei: separar em duas leis (a antiga forma "Dois controles" saiu, 14/nov).
  - Cada estrato ou setor pede o seu número: uma lei por estrato ou setor, ligadas pelo "Parte de".
- Formas especiais (08/nov): **Régua por setor** (uma aba por setor, como a Tarifa de importação) e **Divisão de 100%** (fatias que somam a verba toda; subir uma derruba as outras, como a Divisão da verba de ciência). A forma "Meta e prazo" saiu: vira duas leis ou uma Lei com prazo.
- Marcas na régua: a régua mostra marcas calculadas pelo motor, sem virar lei nova (na Verba das aposentadorias: quanto cada aposentado recebe, "compra o mesmo que no ano passado"). Vale para toda verba e imposto. "Perfeito", disse o autor da régua em % do PIB com marcas.
- Juntar antes de criar: leis que respondem à mesma pergunta viram degraus de uma só, e vizinhas viram uma régua. O alvo é o menor número de leis que cobre todas as decisões do presidente.

**Regras**
- Decidido em 14/nov: a Escolha saiu; toda lei é Régua, Verba ou Níveis.
- Duas respostas é slider faltando resposta (completar, ligar ou apagar).
- Régua sem limite: vai ao extremo real; quem para são as consequências.
- **Um lado por lei e régua sem limite convivem.** A régua vai ao extremo real, mas num lado só da bússola: cada lei vai de "não legislada" a "mais" num lado, nunca de um extremo ao outro (03/nov). Exceção escrita (08/nov) para as leis de valor ou escala (Imposto de renda, Imposto sobre empresas, Liberação das drogas e dos jogos), que usam o valor inicial do país como zero e podem cruzar o meio. Verbas e tetos têm um lado só, com pouca força. O motor guarda `bussola.ate`: acima dele a lei fica na ponta (100% de imposto é tão extremo quanto 90%), e a faixa do controle não mexe no equilíbrio.
- Nenhuma lei vira botão (régua em que só uma ponta serve, que funciona como interruptor).
- Um número com unidade real: %, anos, salários mínimos; unidade livre (km/h, mandatos, % acima de 100).
- Verba (14/nov): régua em % do PIB que vira gasto, pelo canal verba (instituição) ou transferência (pop).
- Níveis: escada ordenada de 3 a 5 degraus reais, num lado só da bússola. Cada degrau é uma coisa real (Liberação das drogas, Autonomia das Forças Armadas em 5 níveis).
- Nenhum degrau "nada": o nada é a lei não legislada. Só a lei essencial pode ter o degrau "nenhum" (14/nov). O motor recusa degrau que não faz nada.
- Duas opções e poucas opções para tema de números são ruins (câmbio "solto ou travado"; Reajuste com 3 opções: "isso é realista?").

**Ligações**
- Economia e Estado: Verba entra direto nas contas como gasto em fração do PIB (`conta: "gasto"`), sem cálculo.
- Sociedade: a posição na bússola (`bussola`) diz onde a lei fica, no mínimo e no máximo da faixa ou em cada opção. Quem gosta sai da distância até cada grupo.
- Política: Divisão de 100% e Parte de ligam leis entre si.

**Referências**
- Democracy 4 passou a cobrar pelo tamanho do passo, porque política barata e só com ganho vai ao máximo e o slider vira botão.
- Sid Meier (GDC 2012): troca e decisão que depende da situação fazem a decisão interessante.

**No motor hoje**
- ✅ `forma: "continua"` (valor em fração dentro de `faixa`, com `passo`; `unidade` fração, meses ou anos) e `forma: "opcoes"` (ao menos duas opções com efeitos).
- ✅ `jeito` (`regua`, `verba`, `niveis` de 3 a 5 degraus), obrigatório na lei já triada. O motor ainda aceita `escolha` e a planilha ainda tem 7 leis com esse jeito; a revisão os converte em Níveis.
- Planilha: 191 leis com jeito preenchido (Verba 74, Níveis 56, Régua 54, Escolha 7); 320 ainda sem jeito (triagem).
- ☐ R7.17: a fatia da divisão valer o peso dela sobre a soma, quando a mecânica ler.
- R7.15 feito: as formas especiais foram divididas (dois controles em duas leis, divisão de 100% em pesos, régua por setor geral).

**Em aberto**
- Se a verba também precisa passar no teste do botão (lado só de "mais"). Em 14/nov a Verba vai de "não legislada" a mais num lado só, e a regra do botão pede que as duas pontas sirvam a alguém.

---

### 4.4 Instrumentos (canais: como a lei chega ao pop)

**O que é.** O canal é o mecanismo genérico do motor pelo qual a lei chega à vida do pop; a lei aponta o canal e o motor calcula, sem conhecer a lei.

**O jogador.** Vê, na bolha, a linha "como chega a você", o canal em texto de leigo.

**Peças.** Seis canais:
- **Imposto:** cobra de uma base (renda, consumo, lucro, emissões, terra) pela curva de Laffer; tira renda ou sobe preço.
- **Verba:** gasto do governo vai à instituição; o rendimento dela vira serviço.
- **Transferência:** gasto vira renda de um estrato de pops.
- **Preço e custo:** mexe no preço ou no custo de um setor do mercado.
- **Regra de módulo:** muda um número de um módulo (moradia, atendimento, saneamento, Judiciário, Congresso, eleição).
- **Direito:** muda uma liberdade; índices de liberdade e quem gosta pela bússola.
- Mais o canal provisório `espera`, com a razão ("triagem" até a onda da lei, ou a mecânica que falta).
- "Emprego" (62 leis no acervo) não tem canal hoje: depende de prédios que contratam (R16.27). "Governo" (81 leis no acervo) são regras do Estado; o canal é regra de módulo.

**Regras**
- Canal é obrigatório; uma lei sem canal não entra no jogo (aprovado 14/nov).
- Direito conta como chegar ao pop (decisão 4, aprovada).
- Lei cujo canal ainda não existe fica no jogo só com o efeito em índice, marcada "espera mecânica" (decisão 3, aprovada).
- O validador confere que o canal bate com o que a lei faz.
- Base de imposto nova é entrada nova em `BASES`: a lei diz `"calculo": { "base": "renda" }` e o motor faz a conta.
- Cada lei de imposto declara quem paga do bolso (`incide`): renda e movimentação, todos; patrimônio, aplicações, imóvel e capital, o rico; folha, o pobre e o médio. Consumo, lucro, emissões, terra e bancos não tiram renda dos pops direto.
- Receita, PIB e juros vêm do cálculo, nunca de `efeitos`.

**Ligações**
- Economia: preço e custo de setor (`valores` nas fichas de setor).
- Sociedade: transferência (`para`) e imposto de renda mexem no bolso.
- Finanças públicas (3.12): a receita de cada base é calibrada pelo país; a `receita_fora_das_leis` caiu o que as leis novas passaram a arrecadar.

**Referências.** **Instrumentos de governo** (Hood, NATO): Autoridade (regra de módulo, direito), Tesouro (imposto, transferência, preço e custo) e Organização (verba à instituição). O quarto, **Informação** (campanha, propaganda do governo), não é canal próprio: é programa ou verba de publicidade, e chega ao pop pela mídia (autor, 14/nov). Estudo de 14/nov. Victoria 3: impostos em 5 níveis por tipo (por pessoa, terra, consumo, renda, dividendos); gastos são salários e insumos dos prédios do governo. Saez, Slemrod e Giertz (2012) para a curva da renda.

**No motor hoje**
- Imposto: ✅ (`calculos`). Verba: ◐ (verba e rendimento sim; serviço só em atendimento e saneamento). Transferência: ✅. Preço e custo: ✅. Regra de módulo: ✅, módulo a módulo. Direito: ✅.
- Planilha: regra 74, verba 70, imposto 16, direito 9, transferência 4, espera 338.
- ☐ Canal de Emprego (R16.27). ☐ Verba que chega a quem recebe, exceto a transferência.

**Em aberto.** Se alguma lei de Governo precisa de canal próprio além de "regra de módulo". **ESTUDAR** (nenhuma fonte levanta o caso).

---

### 4.5 Ponto doce e regulador

**O que é.** A lei não tem um valor certo fixo; tem um **ponto doce**, o valor em que o ganho ainda compensa o custo, e um **regulador**, o número do mundo que move esse ponto e obriga o jogador a voltar à lei.

**O jogador.** Perto do extremo da régua o ganho cai e o custo sobe. O jogador tem de voltar à lei quando o mundo muda; sem isso, descobre o valor certo uma vez e nunca mais pensa.

**Peças**
- O ponto doce vem do mundo, não do fim da régua.
- O regulador é algo que muda sozinho: idade da população, inflação, preço do petróleo, ciclo da economia, eleição. Se o ponto doce muda só com a estratégia do jogador, vira receita pronta (aconteceu com o imposto do Victoria 2).
- Exemplos: transferência de renda, regulada por quantos pobres existem; verba da saúde, pela idade da população; IR do rico, pela dívida e economia.
- Por canal:
  - Imposto: Laffer (subir demais encolhe a base; o país declara onde começa).
  - Verba: verba acima do que a instituição precisa vira corrupção.
  - Transferência: vaza para quem não precisa quando cobre mais que os pobres.
  - Regra e direito: nada ainda.
- **Fuga da regra** (proposta, ainda não decidida): quanto mais forte a regra, mais gente foge (salário mínimo alto empurra para o informal; proibir demais cria mercado ilegal; licença difícil vira obra sem licença); quanto foge depende da verba de quem fiscaliza. É a "Laffer" das regras. Está também na lista de ideias do GDD, junto com a sonegação que cresce com o imposto.

**Regras (14/nov)**
- Toda lei tem regulador; o ponto doce vem do mundo.
- Teste 6 de resposta de verdade: a lei diz qual número do mundo muda o valor certo dela; lei sem regulador é cenário.
- Teste 3 sem motor rodando: escrever o caso em que cada resposta ganha; sem caso, a lei falha.
- Evasão: fração da base que escapa do fisco, declarada pelo país.
- O país declara o pico de Laffer; o motor deriva `e = (1 − pico)/pico`. Sem declaração, usa pico 0,6 e evasão 0,1.
- Lei de regra custa: fiscalizar pede trabalho à instituição (sobe a necessidade dela); sem verba para isso, a regra alcança menos gente. Esse custo vai a bolsos (salário de fiscal, compra de equipamento); a multa de quem foi pego vai ao Tesouro.

**Ligações**
- Economia: Laffer, evasão e juros em `motor/calculos`.
- Sociedade: a transferência que passa dos pobres vaza para o estrato de cima.
- Instituições (4.18): verba de sobra vira corrupção `12 × (rendimento − 1)` por turno.
- Política: o regulador pode ser a eleição (perto da eleição, baixar agrada).

**Referências.** SimCity 2000 (imposto bom entre 7 e 9%); Civ IV ("ciência sempre no máximo"); Victoria 2 (receita pronta do imposto). Sid Meier: boa uma vez pode ser chata na décima. Democracy 4: fim de jogo "resolvido"; remédios são demanda que cresce, complacência e eleitor que julga a tendência.

**No motor hoje**
- ✅ Imposto pela curva de Laffer com pico declarado pelo país; verba de sobra vira corrupção; transferência que cobre mais que os pobres vaza para o estrato de cima (para a transferência principal).
- ✅ Pouca verba enfraquece a lei (R7.11, 14/nov): ver 4.11.
- ☐ Sonegação que cresce com o imposto e cai com a fiscalização (hoje fixa).
- ☐ Fuga da regra para leis de regra e direito.

**Em aberto**
- Fuga da regra: decidir se entra e como.
- O regulador de cada lei sai da revisão instituição por instituição.
- Marcas na régua (4.3): saber de onde o motor tira cada marca.

---

### 4.6 Escassezes e o que torna a lei jogável

**O que é.** As escassezes são o custo de mudar uma lei: dinheiro, Congresso e gente. Toda lei usa ao menos uma.

**O jogador.** Vê o custo ao mudar a lei: a verba disputa o orçamento, a lei gasta apoio e tempo na fila do Congresso, um grupo perde e cobra na eleição.

**Peças**
- **Dinheiro:** a verba disputa o orçamento.
- **Congresso:** a lei gasta apoio e tempo na fila.
- **Gente:** um grupo perde e cobra na eleição.
- Podem se misturar, e é o normal (IR do rico custa gente e Congresso). Lei que não usa nenhuma é a lei que todo mundo liga.
- As cinco exigências para a lei ser jogável (além do custo de mudar): ganho e custo em lugares diferentes; depende do estado do país; mexe em algo que existe; custa mudar; espalha pela cadeia.
- Seis testes de cada resposta: alguém defende; muda um número; ninguém ganha sempre; o jogador vê; não vira botão; tem regulador.
- Sete exigências do **conjunto** de leis de uma instituição:
  - os lados legislam;
  - cada índice da instituição tem alavanca para os dois sentidos;
  - barato e caro, rápido e lento;
  - uma tensão dentro (duas leis puxam em sentidos contrários);
  - sem repetição;
  - sem buraco (toda decisão real tem uma lei);
  - obriga a abrir mão (se dá para ligar tudo de bom, nada é escolha);
  - do problema até a lei, em um ou dois cliques; índice sem lei para algum lado é **buraco**; lei que não mexe em nenhum índice está **solta**.

**Regras**
- Teste 3 ("ninguém ganha sempre") é o mais importante: é ele que faz o resultado emergir.
- O conjunto obriga a abrir mão e liga cada problema às leis (14/nov).
- O limite não vem de pontos de ação: vem do mundo (Congresso cheio) e só atrasa (11/nov).
- Eleitor se acostuma: o ganho de um benefício antigo some com o tempo, mas a raiva de cortar continua (ideia, 14/nov).
- Eleitor julga a melhora: compara com antes, não com o ideal (ideia, 14/nov).

**Ligações**
- Sociedade: a escassez "gente" é o grupo que perde e cobra.
- Economia e Estado: a escassez "dinheiro" entra no déficit e disputa o caixa.
- Política: a escassez "Congresso" é o apoio gasto e a fila.

**Referências.** Frostpunk (nada renuncia nada); Democracy 4 (slider vira botão sem custo; passou a cobrar pelo passo); Victoria 3 (sorteio para passar lei; propor e cancelar virou truque).

**No motor hoje.** ✅ Corrupção da verba de sobra. ☐ Custo na gente e no Congresso por lei declarado de forma própria. **ESTUDAR** (nenhuma fonte diz o que o motor faz hoje com a escassez "gente" por lei).

**Em aberto**
- A "cota" de foco numa área e a promessa de campanha ainda precisam de desenho.
- Mudar de ideia custa: ainda sem desenho.

---

### 4.7 Nome e texto da lei

**O que é.** O nome diz o que a lei controla, em palavras de todo dia, no mesmo molde para todas: **o que + de quem/sobre o quê**.

**O jogador.** Ao passar o mouse, lê uma frase de leigo que diz o que muda na vida de alguém, com exemplo.

**Peças**
- Exemplos: "Imposto sobre consumo", "Imposto de renda do rico", "Piso da saúde".
- O nome real do país (IBS, CBS, Selic) pode aparecer embaixo, menor, como rótulo do país.
- SisGovpedia: enciclopédia aberta pelas dicas ao passar o mouse, em camadas (frase curta, porquê, conta).
- Mostrar o atraso: a lei diz "efeito em N turnos".

**Regras**
- Sigla e nome técnico nunca no nome.
- Texto de leigo, com exemplo do dia a dia, sem jargão ("indexação", "faixa", "acompanha a inflação" foram rejeitados).
- Frase enigmática ou metafórica é ruim ("Cidade que não fica isolada: confuso"); dizer o que muda.
- Não detalhar além do necessário; número fino fica para a calibração do fim.
- Nenhum nome de país na lei; nome local ("Selic") é rótulo do país.
- A lei não cita grupo: quem gosta sai da distância na bússola.
- Países reais podem entrar (08/nov); a lei continua genérica ("2 salários médios do país").
- Lei, opção e programa podem ter origem em programa real, só como desbloqueio e campanha, nunca no texto da lei.

**Ligações.** Sociedade: o texto lido pelo jogador sai dos números da lei.

**Referências.** Nada do Democracy 4 (nome, número, ligação); Victoria 3 só como ideia.

**No motor hoje.** ✅ Texto sai dos números (R7.5). ☐ SisGovpedia (ideia guardada).

---

### 4.8 Programas

**O que é.** Programa é um pacote de leis que resolve um problema (exemplo: Tarifa social, que junta luz, água e gás). A palavra é do autor e não se usa para outra coisa.

**O jogador**
- Junta leis do mesmo pacote; quando a maior parte anda na direção do programa, ele se forma e o jornal anuncia ("Governo lança o Mais Escola").
- O programa não mexe no país além das leis; o ganho é de memória.
- Tema com partes vira programa; o autor aprovou Tarifa social em 3 leis, "formando um programa".

**Peças**
- 73 programas no motor, da Saúde à Cultura, com lados equilibrados. O desenho da planilha tem 74 pacotes (o de Economia verde ficou de fora por falta de leis): 22 de esquerda, 22 de direita (contando os que são também tradicionais ou autoritários), 14 do meio, 4 verdes e o resto de outros lados. A aba Programas diz o lado, as instituições e as palavras do nome. A aba Programas - leis diz a **direção** (sobe, desce, liga, mais fechado) e o **mínimo** que conta (1 degrau, 10% da régua, 1 fatia da divisão).
- Colunas do TSV de programas: Programa, Lado, Esferas, Leis, Forma-se com, Tema, Bem, Mal, Público, Programas reais parecidos.
- Colunas do TSV de leis por programa: Programa, Lei, Esfera, Subesfera, Forma, Direção, Mínimo; 314 linhas.
- Programas reais: a aba lista os de governos reais parecidos (110 citados); os que são lei caem num programa, ficam fora as posições por país e as leis soltas. Uso futuro: desbloqueio ("você imitou o programa tal do presidente tal") e campanhas.
- **Gerador de nomes:** moldes com lacunas ("Minha ___, Minha ___", "___ para Todos", "Mais ___", "País sem ___", "Bolsa ___", "Pacto pela ___", "Programa Nacional de ___", "Ordem e ___", "___ Livre") preenchidos com as 4 palavras do programa (tema, bem, mal, público). O lado do partido escolhe o molde: esquerda puxa "para Todos" e "sem ___", direita "Livre" e "Responsável", autoritário "Ordem e ___".

**Regras (12/nov)**
- **Forma-se** quando a maior parte das leis da lista (3 de 4, 2 de 3) anda pelo menos o mínimo na direção do programa dentro de um mandato. Só lei de verdade entra: Operação, Ato e Posição por país ficam de fora.
- **Vários ministérios:** programa com leis em mais de uma caixa anda no passo do ministro mais fraco: usa o atraso e a força desse ministro.
- **Miúdos:** conta quando a lei é aprovada, não quando o efeito chega; a janela é o mandato atual; lei em dois programas conta para os dois; lei com prazo conta enquanto vale. Antes de uma lei desfazer um programa, a tela avisa.
- **Nome:** o JSON do país pode dar o nome próprio; sem nome do país, o gerador cria e o jornal anuncia. Moldes são do mundo; o motor não conhece nomes.
- **Lembrança:** formado, os grupos que gostam guardam a lembrança (força pelo tempo que durou e pelo que ganharam), que pesa no voto e cai devagar.
- **Nostalgia:** desfeito (as leis voltam abaixo da maioria), a lembrança vira nostalgia: quem gostava sente falta e cobra de quem desfez.
- **Recriado:** o jogo pergunta se o governo quer usar o mesmo nome. Mesmo nome: a nostalgia volta de uma vez como apoio, mas a raiva de quem odiava volta junto e parte do crédito fica com o partido que criou. Nome novo: começa do zero, sem bagagem.
- **Rebatizar:** quem está no poder pode trocar o nome de um programa herdado; a lembrança do nome antigo fica com o partido que o criou.
- O país declara os programas que já existiam (nome, partido que criou, força da lembrança). A memória é guardada pelo código do programa.
- **Simulador de governo** (31/out): programas não servem de termômetro; medir por decisão, lei por lei, nunca por programa de personalidade.
- Programa inventado (o jogador junta leis livres e o jogo cria um programa novo) está guardado para depois.

**Ligações**
- Sociedade: lembrança e nostalgia pesam no voto e nos grupos (o motor ainda não lê).
- Política: o programa usa o ministro mais fraco da caixa (4.19 e 4.20).
- Mídia: o jornal anuncia o programa formado, com o nome.

**Referências.** Programas reais de governos reais (110 citados na planilha). Nenhuma referência de jogo ou estudo. **ESTUDAR** (outros jogos que tenham pacote de leis).

**No motor hoje**
- ✅ 73 programas formam-se pelas leis (R7.18); ✅ passo do ministro mais fraco (R7.21).
- Conta: a lei "andou" quando, desde o começo do mandato, o valor se moveu na direção pedida pelo menos o mínimo; o programa espera o maior atraso entre as leis dele.
- No motor: `estado.programas = { mandato, referencia, formando, vidas }`; fatos `programa-formado` e `programa-desfeito`.
- ◐ Lembrança e nostalgia pesando no voto (R7.19). ◐ Nome pelo gerador e rebatizar (R7.20).
- O Brasil 2026 já começa com Farmácia Popular, Saúde da Família e Bolsa Família.
- Dívidas do código: lembrança pesar no voto; perguntar o nome ao refazer; conferir direções ambíguas da planilha ("aberto", "mais livre", "mais curto") lidas como `sobe`; 21 ligações a leis que o jogo ainda não tem.

**Em aberto**
- Programas de Drogas e Apostas só se formam quando as leis de Vícios ("A criar") forem escritas.
- Leis que faltam aos programas: ajuda para a empresa reduzir a jornada sem demitir; controle de natalidade.
- Programas esperam a Opinião (mecânica 3) para a lembrança.

---

### 4.9 Processos

**O que é.** Processo é um estoque que anda sozinho pelos turnos (casas, favelas, terra dividida), empurrado pelas leis em vigor.

**O jogador.** Não vê painel com meta, ritmo ou "quanto por turno" (isso é slider). Cada lei anda um pouco pelo caminho; o extremo da bússola é um caminho, não o destino.

**Peças**
- O processo tem estoque, ritmo e fases; as leis são as peças que um presidente assina.
- Exemplo (04/nov): "Reforma agrária 0 a X%" não é lei, é processo; as leis são o que é terra parada, como indeniza, verba de assentamento, prazo do título.
- Exemplo de molde (03/nov): "urbanizar favelas" com obra pública, incentivo, título, remoção, solo, mutirão; tabela de moradia com 3 processos × 6 lados.
- Exemplos de má lei por ser processo: Órgão anticorrupção, Reforma agrária.

**Regras**
- Um processo tem um órgão com verba (lei contínua % do PIB) e leis de regra; o efeito da regra é a regra vezes quanto da verba necessária existe.
- Modelo de builds (03/nov): o jogador combina leis de lados diferentes como quiser; só as que **colidem** não valem juntas (4.10).
- Processo é "andar" por esse caminho, "um pouco com cada lei, nunca de uma vez".
- O tema precisa de leis em todos os lados da bússola, não só três.

**Ligações**
- Economia: moradia e terra são estoques.
- Sociedade: favela empurra saúde, segurança e saneamento (índice).
- Instituições (4.18): o órgão responsável recebe a verba e age sozinho.

**Referências.** Reforma agrária e favelas foram os casos de teste do autor (03/nov e 04/nov).

**No motor hoje.** ✅ Índice que anda sozinho (deriva), R7.10. ✅ Índices déficit, preço e favela já derivam (R16.19).

**Em aberto.** Quais temas são processo (reforma agrária, moradia, terras) e quais leis empurram cada etapa.

---

### 4.10 Colisão e revogar

**O que é.** Colisão: leis que se anulam e não valem juntas. Revogar: propor a volta de uma lei a "não legislada".

**O jogador**
- Na bolha da lei aparece o botão "Revogar", que passa pelo Congresso como qualquer mudança.
- Combina leis de lados diferentes; só as que colidem não valem juntas (teto de aluguel × aluguel livre).

**Peças**
- Quando o dono pode ser Estado ou privado (usinas, rede, venda de energia), são duas leis de lados opostos que colidem (feito em Energia).
- Revogar leva a lei ao valor desligado (`valorDesligado`: mínimo da régua ou primeiro degrau); aprovado, a lei sai de `estado.leis` e os efeitos voltam a zero.

**Regras**
- Revogar também passa pelo Congresso.
- Lei essencial não se revoga.
- A colisão do jogo vale para a lei inteira: é um "ou" (decisão de 05/nov sobre vícios).
- Colisões dos vícios: Venda pelo Estado × Lojas licenciadas, e Monopólio × Licenças de apostas.

**Ligações.** Política: a revogação vai ao Congresso; a lei com prazo volta sozinha, sem voto.

**Referências.** **ESTUDAR**.

**No motor hoje.** ✅ Colisão (R7.9). ✅ Revogar com voto (R7.8, 14/nov): botão na folha da lei, lei essencial não se revoga; o pedido `mudar_lei` com `revogar: true`.

**Em aberto.** O desenho da tela que avisa quando uma revogação desfaz um programa (o aviso antes é decidido) fica para a Tela.

---

### 4.11 Lei pela instituição

**O que é.** O efeito de toda lei passa pelo rendimento da instituição onde ela mora: pouca verba, a lei rende menos; verba demais, a sobra vira corrupção.

**O jogador.** Nunca escolhe a fazenda, a fábrica ou a obra. Leis de regra dizem o quê; leis de verba dão força ao órgão responsável; o órgão age sozinho.

**Peças**
- Cada instituição tem verba (das leis de gasto dela), necessidade, rendimento = verba ÷ necessidade e corrupção interna; quem manda é o ministro.
- O ministro (que muda o rendimento) também importa.
- **Filtro da verba:** a corrupção desvia parte de toda verba, conforme o índice, e o desvio vai a um bolso e deixa rastro. O que chega ao prédio vira salário e insumos, e parte dos insumos pode ser importada. Vaga é por pop: sem gente formada, fica vazia e o salário sobe.
- **Verba tem lado, mas pequeno (07/nov):** nenhuma lei é neutra; a verba vai de zero a um empurrão pequeno num lado só (serviços puxam um pouco à esquerda; polícia e defesa, um pouco ao tradicional). O empurrão forte fica nas leis de "como".
- Obra nova é lei separada (seção 16, Prédios e obras).

**Regras**
- A regra funciona na medida da verba; verba muito acima do necessário vira corrupção (04/nov). O autor rejeitou a régua da lei andar aos poucos até o alvo.
- Decisão 5 do plano (aprovada): o efeito de toda lei vezes o rendimento da instituição, com teto em 100% (teto 1).
- Lei sem órgão (regras dos poderes) rende inteira.
- Dar ao partido o trabalho do órgão é ruim: "O PARTIDO não escolhe as OPERAÇÕES"; o órgão recebe a verba e age sozinho.
- Virar jogo de construção é ruim ("ligar dois estados com uma linha: o presidente não toma a decisão disso").

**Ligações**
- Instituições (4.18): corrupção soma `12 × (rendimento − 1)` por turno quando sobra verba.
- Economia: efeito da lei em índice = valor × rendimento do órgão (`rendimentoDasLeis`, `motor/governo`).
- Política: a ficha do ministro muda a força e o atraso das leis da caixa.

**Referências.** **ESTUDAR** (outros jogos com órgão e verba).

**No motor hoje**
- ✅ R7.11 (14/nov): efeito da lei vezes o rendimento da instituição, teto 1 (`turno/etapas/jogabilidade.ts`). Pouca verba já enfraquece a lei.
- ✅ Corrupção por verba parada (R6.17).
- ☐ Serviços do Estado como prédios fora do mercado (R16.31) e terceirizar por lei (R16.32).
- ☐ Caminho do dinheiro (impostos, Tesouro, verba, máquina do ministério, filtro da corrupção, instituição).

**Em aberto**
- Custo de máquina: sem custo de máquina, o governo Inchado não tem desvantagem.
- Ordem do autor: terminar os ministros, depois o mapa, depois padronizar as leis e só então o caminho do dinheiro.

---

### 4.12 Roteiro da lei (8 passos)

**O que é.** Toda lei passa pelos mesmos 8 passos: entrada (dinheiro, regra, preço ou direito), filtro, prédio, pop, economia, índices, política e conta.

**O jogador.** Vê na bolha como a lei chega à vida das pessoas (a linha "como chega a você").

**Peças**
- A lei declara a entrada e onde age; os outros passos são regras gerais do jogo.
- No acervo, o roteiro tem as colunas: Entrada (o que a lei muda), Filtro (o que atrapalha), Prédio (quem muda de comportamento), Pop (quem sente), Economia (para onde vai o dinheiro), Índices (o que muda na tela), Política (quem reage), Conta (quem paga depois), Quando aparece e Revisão (518 linhas).

**Regras.** O roteiro de cada lei fica na aba "Leis - roteiro" do acervo. A coluna "Chega ao pop" do acervo tem seis valores: Direito 130, Serviço 86, Renda 85, Governo 81, Preço 76, Emprego 62.

**Ligações.** Sociedade: o passo "pop" mede quem sente. Economia: o passo "economia" diz para onde vai o dinheiro. Política: o passo "política" diz quem reage.

**Referências.** Victoria 3: pops no centro, métodos de produção, preço por oferta e procura.

**No motor hoje.** ◐ O roteiro está como "A pensar"; toda lei chega ao pop (R7.12 ◐): hoje quase todas só mexem em índice.

**Em aberto.** Por que 443 das 529 leis do acervo estão como "Ideia" e o JSON foi exportado sem padrão.

---

### 4.13 Implementação (força e atraso)

**O que é.** Cada lei tem uma Força (fraca, média, forte) e um Atraso em turnos; o turno tem 2 meses. Atraso zero é o turno seguinte (14/nov).

**O jogador.** O que dá resultado demora: cada efeito declara quanto tempo leva para chegar inteiro, e o jogador sente a conta chegar. A lei diz "efeito em N turnos", para ele planejar.

**Peças**
- Colunas Força e Atraso na aba Leis, como palpite de partida: o atraso vem do "Quando aparece" do roteiro; a força vem do passo 6.
- Tamanho do efeito inteiro: fraca 2, média 5, forte 10 pontos (calibrado no 6d). O efeito é o tamanho total, não por turno.
- Lei contínua: o efeito cresce com a posição do valor na faixa (no mínimo, nada; no máximo, inteiro). Lei de opções: os efeitos da opção, inteiros.
- Ao mudar a lei, a contribuição anda em linha reta do valor de hoje ao novo em `atraso_turnos` turnos; depois fica parada. `atraso_turnos` 0 = no turno seguinte.
- No começo da partida, as leis vigentes já estão inteiras.
- Efeito: índice de jogabilidade, `sentido` ±1, `forca` por nível, `atraso_turnos`.
- Planilha: aba "Leis - efeitos" (Lei, Degrau, Índice, Sentido, Força, Atraso) com 1359 linhas.

**Regras**
- Todo número da planilha é valor de partida, de um de três tipos: **estudo** (tem fonte), **ordem de grandeza** ou **chute de jogo**. A calibração fica para o motor. Valores convertidos de uma palavra (esquerda, direita) usam 0,4 e estão marcados na coluna "Bússola: origem".
- Força por nível, nunca número solto; todo efeito declara o atraso em turnos.
- Efeito só nos índices de jogabilidade; efeito em receita, PIB, juros, dívida não se escreve na lei.
- A lei contínua pode ter `calculo.estrato`, `encolhe`, `escala_gasto`, `para.pesos`, `arrecada`.
- Lei declara: efeitos, força, atraso, posição na bússola e qual cálculo usa; não traz fórmula própria.

**Ligações.** Ministros (4.19): o ministro muda força e atraso (competência) das leis da caixa. Sociedade: o efeito vai ao índice; o grupo cobra o índice.

**Referências.** Atraso desconhecido tira do jogador a noção de quando agir (design de atraso).

**No motor hoje.** ✅ Efeito, força, atraso e bússola declarados e calculados (R7.2). ☐ Mostrar "efeito em N turnos" na tela (ideia).

**Em aberto.** A calibração fina fica para o fim ("Não abrir revisão lei por lei").

---

### 4.14 Processo de revisão por instituição

**O que é.** Cada lei atual é conferida contra as regras desta parte, uma instituição de cada vez, começando por Impostos.

**O jogador.** Nada diretamente; é o trabalho do autor na planilha.

**Peças.** Cinco passos:
1. O que a instituição liga: índices, mercados, grupos, contas, e que outras instituições dividem tema.
2. As perguntas do presidente: que decisões reais ele toma nessa área, sem olhar as leis atuais.
3. Cruzar: para cada lei, qual pergunta responde, os testes, o regulador, as escassezes, o extremo da régua e o veredito (fica, muda o jeito, junta com, divide em, sai, vira outra coisa, troca o nome). Para cada pergunta sem lei: buraco. Depois, a seção do conjunto.
4. Revisão da saída do modelo simples.
5. Decisão do autor; só depois se mexe nos JSON.

**A lei se reconstrói pelas regras das mecânicas** (autor, 14/nov). No passo 3, cada lei é refeita pelas regras de **todas** as mecânicas que ela toca, e não só pelas desta parte. A ficha de cada lei responde:
- **Sociedade (Parte 2):** em qual bolso a lei mexe, que é a parte mais forte (interesse, 2.1 e 2.4). Onde ela fica na bússola, com peso menor (2.5). O que fica na memória: tirar dói mais, o benefício vira costume e o eleitor julga a melhora (2.4). A lei não declara quem gosta; o gosto sai do motor.
- **Economia (Parte 3):** de onde vem e para onde vai cada real, porque nenhum dinheiro some, nem o ilegal (3.6). Em qual mercado ela mexe, sempre por demanda ou custo e nunca dando lucro (3.1). O que ela muda nas finanças públicas (3.12).
- **Máquina pública (Parte 4):** a pergunta (4.1), o jeito (4.3), o instrumento (4.4), o ponto doce e o regulador (4.5), as escassezes (4.6), a instituição que executa e o rendimento dela (4.11, 4.18) e o nome simples (4.7).
- **Em volta:** quem a defende e quem a barra no Congresso (5.5), e como a mídia conta o fato (6). Lei que não passa nesses pontos fica marcada como "espera mecânica" ou sai.

Quatro **ondas** (aprovadas em 14/nov):
- Onda 1: Impostos, Previdência, Assistência social, Orçamento e dívida, Moeda e bancos (dinheiro no bolso, canais prontos).
- Onda 2: Saúde, Educação, Segurança pública, Justiça e prisões, Moradia, Água e saneamento (serviço).
- Onda 3: Trabalho, Energia, Agricultura e pesca, Indústria, Mineração e petróleo, Comércio exterior, Concorrência e consumidor, Infraestrutura e transporte, Ciência e pesquisa, Comunicação e tecnologia (preço e custo).
- Onda 4: o resto (Meio ambiente, Terra, Imigração, Cultura, Esporte, Turismo, Religião, Defesa, Defesa civil, Relações exteriores, Estatais, Funcionalismo, Estados e municípios, Controle e transparência, Eleições, Regras dos poderes).

Vereditos do plano: fica, junta, divide, vira índice/evento/Ato/Operação/Posição, espera mecânica, sai.

**Regras**
- A saída de cada instituição é uma tabela na planilha `gdd.xlsx`, não um documento novo.
- Revisão por onda, 4 revisões no total (decisão 2).
- Fonte da verdade: a planilha `gdd.xlsx`, com exportador para o JSON e validador (decisão 1). O autor mexe na planilha; o código lê o JSON.
- Cada onda, sem parar no meio: preencher a triagem e o molde, autor revisa a onda inteira, exporta e faz o que faltar no motor, commit.
- Antes da onda 1 (a base): aba Leis com o molde, exportador e validador, lei pela instituição, revogar, lei com prazo e Ato, e a linha "como chega a você".
- Equilíbrio de lados conferido antes de fechar cada instituição.
- Instituição inflada se reduz juntando leis.
- Pronto quando: nenhuma lei sem canal, nenhuma sem nada, nenhuma no centro da bússola sem motivo escrito; planilha para JSON pelo exportador; revogar, prazo, ato e lei pela instituição com teste; a bolha diz como a lei chega à vida das pessoas.
- Na planilha, os passos 1 a 3 vão a um modelo simples com as regras desta parte na mão.
- `npm run leis` gera os JSONs; `npm run leis:planilha` faz o caminho de volta.

**Ligações**
- Instituições e caixas (4.18, 4.20): instituição inflada se reduz; ministério é caixa de instituições inteiras.
- Planilha "Leis por instituição": colunas Instituição, Lei, O que faz, Dinheiro, Índices que mexe, Devia estar em (autor); 56 linhas com "Devia estar em" preenchida.
- Planilha "Instituições novas": colunas Instituição, De onde vem, Tem ministro?, Situação, Leis (lembrete), Anotações do autor; 37 linhas "decidida".

**Referências.** Autor: "Não abrir revisão lei por lei" (calibração). Estudos de jogadores.

**No motor hoje.** ✅ Base da onda 1 (planilha, exportador, validador, lei pela instituição, revogar). ◐ As 4 ondas (R7.22).

**Em aberto**
- Se a ordem das ondas muda (decisão 6, aprovada como recomendado).
- Leis a reestruturar: padronizar o formato; o dinheiro que ainda entra e sai "fora das leis" se resolve aí.
- Pendência: a lei Organização dos ministérios (escada de 4 degraus, ver 4.20) ainda não existe.

---

### 4.15 Lei boa e lei ruim

**O que é.** A lista de casos que o autor classificou, com as palavras dele; cada lei passa por esta página antes de ser mostrada.

**O jogador.** O autor julga a lei pelo que o jogador consegue fazer com ela.

**Peças.** Seis conferências antes de mostrar uma lei: já existe na planilha; tipo (Lei, Lei com prazo, Ato, Posição, Operação); em que setor, preço, custo ou índice mexe; ganho e custo; número ou degraus reais; um leigo entende a frase.

**Regras. O que faz uma lei boa (casos do autor).**

| Boa porque | Caso e palavra do autor |
|---|---|
| Mexe num mercado por preço, custo ou demanda | Subsídio a combustíveis: "perfeita, impacto direto no mercado de combustível"; Imposto sobre combustíveis: "perfeita, influencia diretamente o setor" |
| Liga em algo que já existe | Padrões de eficiência "afeta a produtividade da indústria"; Trabalho de presos tira vaga de quem está solto |
| Espalha pela cadeia | Subsídio para comprar máquinas aquece máquinas e aço; Bolsa Família aquece a carne |
| Tem número para testar o extremo | Verba das aposentadorias em % do PIB, com marcas na régua: "PERFEITO"; mandato de 1 a 10 anos e depois indefinido |
| Escada com degrau real | Liberação das drogas; Autonomia das Forças Armadas em 5 níveis |
| Régua por setor | Tarifa de importação em abas |
| Tema com partes vira programa | Tarifa social em 3 leis (luz, água, gás), "formando um programa" |
| Lei pegadinha | Segurar a conta de luz: "lei pegadinha" |
| Escolha com vítima | Escolher quem fica sem luz: "boa" |
| Papel que obriga a escolher | Assinar por cima, com escândalo, ou atrasar a licença e arriscar o apagão: "isso é perfeito" |
| Régua que reparte a verba | Divisão em 100%: "se eu subir em um setor, vai cair em outro" |

**O que faz uma lei ruim (defeito, caso real, o que fazer).**

| Defeito | Caso real | O que fazer |
|---|---|---|
| Duas opções | Comando da Defesa; câmbio "solto ou travado" | Régua ou escada com degraus reais |
| Poucas opções para tema de números | Reajuste com 3 opções: "isso é realista?" | Régua com número |
| É informação, não lei | Reajuste das aposentadorias | Marca na régua da verba |
| Repete outra lei | Inteligência financeira e Verba de inteligência; Tarifa social em Energia | Procurar na planilha antes, juntar |
| É processo | Órgão anticorrupção; Reforma agrária | Leis empurram as etapas |
| É consequência | Caça aos chefes; Policiamento de manchas | Vira índice |
| Depende de cada caso | Resgate de bancos: "cada banco que quebre" | Vira decisão de evento |
| É opção do menu | Sanções, Estatização | Posição por país ou Operação; a lei controla os limites |
| Dá lucro a um produto | Lei que favorece a carne | Mexer em demanda ou custo |
| Ignora a mecânica criada | "Parte do Estado no setor" | Agir sobre companhias, nunca em fábrica solta |
| Mecânica sem jogo | Triângulo do câmbio: "não tem gameplay" | Dar uma decisão e algo que o jogador veja mudar |
| Só castiga | Trégua: "só debuff" | Toda lei tem ganho e custo |
| Extremo sem sentido | Derrubar a internet; perdoar toda a dívida; alvo Marte: "marte ta fora" | Reduzir ao que um governo faria |
| Literal demais | "Lei contra discriminação" | Dividir no que ela regula |
| Ignora como o setor funciona | "Escolha de quem vende a luz": "energia é monopólio natural" | Conferir a realidade do setor |
| Grande demais | Licenças de petróleo e gás: "dá pra ser mais leis" | Dividir no que o jogador decide |
| Específico demais | Xisto (fracking): "muito específico" | Tirar, ou degrau de lei maior |
| Fora da esfera | Petróleo discutido em Energia: "por que discutir aqui?" | Conferir setor e instituição |
| Virou jogo de construção | "o presidente não toma a decisão disso, não é um jogo de construção" | Fica automático; a lei só dá o dinheiro |
| Dá ao partido o trabalho do órgão | "O PARTIDO não escolhe as OPERAÇÕES" | O órgão age sozinho |
| Fala de empresa e não de gente | Concessão por tipo: "me falta um pouco de povo"; "não é um jogo sobre empresários e empresas, é sobre ser o presidente" | Dizer quem é atendido e quem paga; privatizar é Operação |
| É opção de cada caso | Como o Estado contrata obra: "mais opções para cada obra que uma lei" | Tirar, ou escolha no papel da obra |
| Não é do presidente | Passagem: "ônibus não é federal" | Ver a competência; federal age por programa (passe livre) |
| Direito de outra esfera | Proteção do operário em Infraestrutura | Levar à instituição dona do tema |
| Frase enigmática | Cidade que não fica isolada: "confuso" | Dizer o que muda, sem metáfora |
| Fundo demais para o governo | Quem manda no clube: "Não é um jogo de futebol" | Ver se um governo nacional controla isso |
| Repete a fila ou outra lei | Estátuas e nomes: "complexo, bate com o pedido lá em cima" | Vira pedido na fila; o que outra lei decide fica nela |
| Corte demais | Minério com 2 leis: "somente duas leis?" | Procurar o que o presidente ainda decide |
| Índice sem jogo | Cidades da mina: "não sei se faz sentido para o jogo" | Se Desemprego e o papel já mostram, não criar índice |
| Lado trocado | Verba de segurança "de direita" | O lado segue quem defende no mundo real; verba tem lado pequeno |

- Índice, conta ou evento: nem todo número é índice. **Conta** da companhia ou do pop, vista na ficha (gasto de energia, produtividade: "por companhia, não é um índice"); **evento** é o que acontece num momento ("apagões são eventos!"); **índice** é o que resume o país.
- Mais regras do formato da lei: a lei está na lista aprovada pelo autor (fora dela é proposta no chat); escrever o comportamento esperado em 2 a 4 frases; pesquisar a direção em estudo ou consenso, não em outro jogo; efeito sem base clara fica fraco ou fora. Lei inventada vale se for plausível.

**Ligações.** Sociedade: "lei que fala de empresa e não de gente" quebra o princípio 13.

**Referências.** O próprio autor; pesquisa de jogadores.

**No motor hoje.** Regra de trabalho, não de motor. O validador cobra jeito e canal das leis já triadas.

**Em aberto.** Quando o autor elogiar ou rejeitar uma lei, acrescentar o caso à skill `sisgov-lei-boa` com as palavras dele.

---

### 4.16 Índices

**O que é.** Índice é o que resume o país numa escala de 0 a 100; é a base do país mais a soma das contribuições das leis em vigor.

**O jogador**
- Vê 6 índices principais: PIB real, Desemprego, Inflação, Saúde, Educação (Instrução) e Segurança pública (resume Homicídios, Crimes contra o patrimônio e Sensação de insegurança). Os outros são subíndices, embaixo do principal.
- Alerta do índice: cor do anel pelo nível, seta pela tendência (compara com 8 meses atrás, corte de 2 pontos).
- **Visível e invisível (07/nov):** o visível aparece na tela; o invisível o motor calcula, e o jogador só o sente pelo que acontece (greve, surto, notícia).
- Painel Atrapalham / Ajudam de ministro, instituição e índice.

**Peças**
- **Essenciais** (do motor, com as contas entre eles): população, ocupados, desemprego, PIB real e nominal, crescimento, preços, inflação, receita, gasto, resultado, dívida, juros.
- **Jogabilidade** (dados do mundo): padrão de vida, instrução, industrialização, saúde, segurança pública, pobreza, desigualdade, corrupção, liberdades, polarização, meio ambiente, reputação internacional, segurança externa, aprovação, índice da bolsa e confiança do mercado. É a lista curta do GDD; o motor tem 147 índices de jogabilidade.
- Planilha "Índices": 147 índices (43 "Existe", 104 "A criar"; 6 com Principal = Sim). Colunas: Esfera, Índice, Situação, O que mede, Bom é, De onde vem, Leis que mexem direto, Recebe de, Efeito hoje, Efeito proposto, Cobrado por, Mecânica, Liga com, Arquivo, Ligação, Na tela, Revisão, Principal.
- **Índice tem dono (13/nov, feito 14/nov):** uma instituição, um poder ou o país; fica preso, no mapa, ao ministro que leva a maior parte das leis ligadas a ele.
- **Índice é gatilho:** as narrativas disparam quando um índice sobe ou passa de um limite; a V1 jogável já tem gatilhos (autor, 14/nov).
- Estatística (ideia 13/nov): o presidente pode parar de medir, esconder os números da mídia ou mentir neles; o jogador vê o índice real, a mídia vê com atraso e desconfiança.

**Regras**
- **Índice novo só com decisão do autor.**
- **Todo índice tem efeito:** ele muda algo no país, além de ser cobrado pelos grupos.
- **Avaliar um índice (04/nov):** ligar tudo o que ele exige e criar o que falta; registrar em `indices-avaliacao.md`. O avaliado vai para "Avaliados"; o que foi ligado ou criado e ainda não passou por avaliação vai para "Não avaliados".
- Um índice está **avaliado** quando o autor decidiu o que o move, o que ele piora ou melhora, e quais grupos o cobram; o número fino fica para o balanço final.
- O índice sai da contagem; lei nenhuma mexe nele direto (requisito de rede, 05/nov).
- **Índice, conta ou evento:** não criar índice quando o papel e outro índice já mostram (caso Cidades da mina).
- Cada índice da instituição tem alavanca para os dois sentidos; índice sem lei para algum lado é buraco.
- Valor de partida: 50 se o país não disser.
- Aprovação = satisfação média dos pops pesada pelo tamanho (R9.9, 12/nov).

**Avaliados** (registro de `indices-avaliacao.md`):

| Índice | Movido por | Empurra | Cobrado por | Data |
|---|---|---|---|---|
| Favela | contagem de casas, preço contra a renda dos pops, leis de moradia | piora saúde, segurança e saneamento | sem trabalho formal | 04/nov |
| Saúde | rede de atendimento, saneamento, favela, vacinação, saúde ambiental | melhora padrão de vida e reduz pobreza | operários, educação e saúde, aposentados | 05/nov |
| Saneamento | contagem da rede (verba, concessão, teto da tarifa, tratamento), conta contra a renda, favela | melhora saúde e meio ambiente | sem trabalho formal, gente do campo | 04/nov |

- **Não avaliados** (ligados ou criados): Atendimento, Profissionais de saúde, Vacinação, Segurança, Meio ambiente, Padrão de vida, Desigualdade, Emprego informal.
- Mudados no passo A do nível 3 (14/nov): Comida na mesa (juntou a Fome); Casas vazias; e novos sem fio ainda: Envelhecimento, Expectativa de vida, Turismo, Prática de esporte, Tensão com estados e municípios.
- Ainda não existem: organizações criminosas (desenho pendente, GDD §18); Dependência de drogas, Dependência de jogos e Mercado ilegal (aprovados em 05/nov; desenho em `fase-1-redes.md`).
- Desde 14/nov a lista por dono sai de `npx vite-node scripts/grafo-nivel3.ts`.

**Ligações**
- Sociedade: o índice é o que os grupos cobram.
- Economia: índices de preço, favela e déficit derivam da economia (R16.19).
- Instituições (4.18): índice com dono preso à instituição, ao poder ou ao país.
- Política: aprovação lida pelo Congresso e pela eleição.

**Referências.** Suzerain: orçamento como número único ("aumentar não muda nada visível"). Victoria 3: padrão de vida de 1 a 99 pela riqueza.

**No motor hoje**
- ✅ Essenciais (R9.1), 147 de jogabilidade (R9.2), 6 principais marcados (R9.8), aprovação (R9.9).
- ◐ Inflação que se move (R9.3). ◐ Todo índice tem efeito (R9.4): 127 índices não levam a nada.
- ☐ Desemprego e ocupados se movem com a economia (R9.5, depende de R16.27). ☐ Índice da bolsa (R9.6).
- ◐ Causa e efeito, "o que empurra" no índice, "a conta que vem" na lei (R17.15).
- ✅ Dono (passo A, 14/nov).

**Em aberto**
- Efeito de cada índice (passo B): para cada um, o que ele muda no país além da cobrança dos grupos.
- Visível e invisível: quais o jogador vê e quais só sente.
- Principais: os subíndices embaixo de cada um e como somam.
- Gatilhos: limites que disparam narrativas; entram já na V1 jogável (autor, 14/nov).
- O que vários índices batendo metas juntos significam.
- Índice da bolsa (R9.6).

---

### 4.17 Serviços do Estado e Vícios

Esta seção guarda o que o autor decidiu em 05/nov em `fase-1-redes.md`. A **arquitetura** das redes ficou suspensa (05/nov) e os mecanismos "se decidem depois da planilha". O que ainda vale como desenho vem abaixo.

**O que é.** Rede é um serviço que o Estado presta (saúde, saneamento, educação, segurança); todas têm as mesmas peças: capacidade, desgaste, quem opera, privado, bolso, procura, índice, empurra, desvio.

**O jogador.** Vê o efeito na ficha e no mapa, com o dinheiro junto.

**Peças**
- Quatro redes: Saúde, Saneamento, Educação, Segurança. Moradia não é rede (é estoque de casas); proteção social é transferência de renda.
- Requisitos de uma rede: o índice sai da contagem; a mesma lei muda de sentido pelo estado do país, sem condição escrita; toda alavanca tem ganho e custo; o país começa parado (turno 0 nada anda sozinho); o motor não conhece nome de lei, índice nem instituição.
- **Vícios** (fechado em 05/nov): não é área própria nem rede; é consumo regulado em dois temas, drogas e jogos. 12 leis e 3 índices (Dependência de drogas, Dependência de jogos, Mercado ilegal).
- As 12 leis: Liberação das drogas, Imposto das drogas, Venda pelo Estado, Lojas licenciadas, Cuidado com o usuário, Liberação dos jogos, Imposto dos jogos, Monopólio do Estado, Licenças de apostas, Proteção do apostador, Propaganda e embalagem, Fiscalização e repressão.
- As escadas de liberação de Drogas e de Jogos têm 6 níveis (0 a 5), desenho de 05/nov.
- A conta do turno por tema, em 5 passos: procura, consumo legal, mercado ilegal, dependência, dinheiro. **Liberar sem ninguém vendendo não abre mercado.**
- Pesquisa de vícios (05/nov): proibir fortalece o crime; legalizar não acaba com o mercado ilegal na hora; contrabando vem do Estado fraco; dureza rende rápido e cobra depois.
- Na planilha de hoje, 11 linhas citam drogas ou jogos; Liberação das drogas ainda sem jeito.

**Regras**
- Fase em 3 momentos: desenhar a fase inteira, decidir tudo de uma vez, produzir até o fim sem parar.
- Vícios, colisões: Venda pelo Estado × Lojas licenciadas; Monopólio × Licenças de apostas.
- A Liberação cruza a bússola, exceção pedida pelo autor.

**Ligações**
- Saúde: dependência de drogas aumenta a procura da rede; a fila cresce e o `atendimento` cai.
- Segurança: repressão sobre mercado grande sobe `lotacao_presidios`.
- Atendimento no motor: planos primeiro, rede pública depois, profissionais e vagas.
- Custo das leis de saúde: fica em `custo`, fração do PIB que entra no gasto do governo, sem lei de verba.

**Referências.** `docs/jogo/estudos/vicios.md`: Portugal, Canadá, Uruguai, Suíça, Escócia, Noruega, Suécia, Singapura, Macau, Reino Unido, Brasil.

**No motor hoje.** ◐ Atendimento e saneamento têm código próprio (`motor/atendimento`, `motor/saneamento`). ☐ Serviços do Estado como prédios (R16.31) e terceirizar por lei (R16.32). O `motor/rede` está suspenso.

**Em aberto**
- Decisões 1 a 4 do desenho de redes (quais instituições, migrar antes, Educação com índice de vagas, Segurança com presídio na mesma rede) nunca foram aprovadas em fonte nova. **ESTUDAR** com o autor.
- Segurança e Educação não têm rede; as leis de Educação e Segurança só vêm quando essas redes forem desenhadas.
- Tribunal de drogas e Controle de lavagem esperam a Segurança.
- As escadas de Vícios (nível 0 "tudo proibido") precisam passar pela regra "nada = não legislada" na revisão da onda de Vícios.

---

**Quem executa a lei** (as seções 4.18 a 4.21: instituições, ministros, caixas e a fronteira do governo)

Lei é a regra do país; instituição executa; ministro chefia. A lei mora numa instituição, nunca num ministério; cada instituição tem um dono só por vez.

### 4.18 Instituições

**O que é.** O órgão que executa a lei. É a menor peça do governo; substituiu a esfera em 13/nov.

**O jogador.** Não escolhe fazenda, fábrica ou obra: passa leis que dão verba e regras ao órgão, e o órgão age sozinho pelo turno. No mapa vê um escudo com frase curta ("12 na fila · 2 na sua mesa") e a cor do rendimento: verde rende, amarelo falta verba, vermelho sobra e vira corrupção. Clicar abre ficha só de leitura.

**Peças**
- As 36 instituições (conferidas com a lista de funções de governo da ONU): Agricultura e pesca, Água e saneamento, Assistência social, Ciência e pesquisa, Comércio exterior e capital, Comunicação e tecnologia, Concorrência e consumidor, Controle e transparência, Cultura, Defesa, Defesa civil, Educação, Eleições, Energia, Esporte, Estados e municípios, Estatais, Funcionalismo, Imigração, Impostos, Indústria (com construção civil), Infraestrutura e transporte, Justiça e prisões, Meio ambiente, Mineração e petróleo, Moeda e bancos, Moradia (com urbanismo), Orçamento e dívida (com estatística), Previdência, Relações exteriores, Religião, Saúde, Segurança pública, Terra, Trabalho, Turismo.
- Miolo (3 poderes): regras dos poderes (medida provisória, indicação de juízes, quórum, foro privilegiado, iniciativa popular), que não são de instituição.
- Quatro números por instituição: verba, necessidade, rendimento e corrupção interna.

**Regras**
- Instituição é órgão, não tema: a pergunta é "quem executa?". Tema com naturezas diferentes se divide pela função; a licença segue o produto (apostas na Fazenda, drogas na Saúde).
- Todo país tem todas as instituições, mesmo pequenas; a pequena é um caminho que o jogador pode crescer (Brasil religioso faz Religião crescer).
- Eleições não tem ministro (13/nov): fica sempre com o Judiciário, ligada só à corte eleitoral quando os tribunais existirem.
- Instituição não tem chefe próprio (13/nov): quem manda é o ministro.
- Verba vem da lei. Necessidade é a verba do começo mais 5% a cada lei ativa a mais (nunca abaixo de 20%). Rendimento = verba ÷ necessidade (1 sem verba em lei): pouca verba, a fila anda devagar; verba demais, a sobra vira corrupção.
- Corrupção (0 a 100): a cada turno desfaz 8% e soma 12 × (rendimento − 1) quando sobra verba, 1,2 × cargos de livre nomeação e 1,6 × (100 − honestidade) ÷ 100 do ministro. Começa no equilíbrio do governo de hoje. Ao cruzar 60 vira o fato "escândalo". Pesos de partida.
- Saíram: Vícios, Direitos e liberdades, Estado e eleições, Empresas e estatais (divididas), Saneamento e Cultura e esporte (juntadas ou separadas). As leis delas serão refeitas instituição por instituição.
- Corrupção em cadeia (12/nov): o rastro não some; baixar a independência dos investigadores faz a corrupção de cada órgão subir sozinha, o rendimento cair e o serviço piorar.
- Regra do dinheiro (14/nov): nenhum dinheiro some; a corrupção não apaga o dinheiro, ele vai para o bolso de alguém e deixa rastro.
- Lei de regra custa (14/nov): fiscalizar uma regra pede trabalho à instituição e sobe a necessidade dela. Esse custo vai a bolsos (salário de fiscal, equipamento) e a multa de quem foi pego vai ao Tesouro.
- Como a lei age pelo rendimento: ver 4.11.

**Ligações**
- Recebe: leis de gasto (verba) e leis ativas (necessidade) (Máquina pública); ministro (competência e honestidade); lei de cargos de livre nomeação.
- Entrega: rendimento que age na lei; corrupção e fato "escândalo" (Congresso lê; CPI); verba de salário e compras que viram renda (Economia, ainda por fazer).
- Tesouro (Parte de Economia): impostos e receita entram no Tesouro (cofre ou dívida), que paga as leis de verba.

**Referências.** Lista de funções de governo da ONU (aba Conferência ONU, 10 áreas). Argentina maquiou a inflação de 2007 a 2015 (para Estatística). Instituições na planilha antiga (por esfera, com índices que mexem).

**No motor hoje**
- ✅ 36 instituições, verba, necessidade, rendimento, corrupção (R6.10, R6.16, R6.17).
- ◐ Ficha da instituição no mapa, só de leitura: escudo sob o ministro e painel Atrapalham/Ajudam; falta rendimento, corrupção e fila (R6.18).
- ✅ Lei age pelo órgão (R7.11): efeito × rendimento, teto 1 (14/nov).
- ☐ Instituições sem lei: Estados e municípios, Religião, Turismo, Indústria; Funcionalismo com uma.
- ☐ Caminho do dinheiro (R10.7).

**Em aberto**
- Caminho do dinheiro: a proposta a pensar é impostos, Tesouro, verba por lei, máquina do ministério, filtro da corrupção (o desvio vai a um bolso e deixa rastro), instituição, população. A mecânica pede definir quanto é desviado.
- Estatística: o presidente pode parar de medir, esconder os números da mídia ou mentir neles; o jogador vê o real, a mídia vê com atraso.
- Se cada instituição e cada lei responde a um dos poderes.

---

### 4.19 Ministros

**O que é.** A ficha de quem chefia as instituições que o jogador der a ele; a competência dele mexe no efeito das leis dessas instituições.

**O jogador.** Escolhe quem ocupa cada ministério e quando trocar. O melhor técnico pode ser de outro partido, o aliado exige ministérios para votar com o jogador e o ministro popular vira rival dentro do partido.

**Peças**
- Cinco notas: competência (leis da área chegam mais rápido e com mais força; fraco atrasa e desperdiça verba), habilidade política (aprovar as leis da área), carisma (como mídia e eleitor o veem), honestidade (baixa sobe corrupção e risco de escândalo) e lealdade (baixa e ele vaza, sabota ou sai atirando). Mais bússola e origem.
- Opinião: grupos e mídias gostam ou não pela distância na bússola e pela origem.
- Fatos: escândalo, crise na área, demissão barulhenta, ministro que vira candidato.
- Troca: a qualquer momento, com revolta e polêmica.

**Regras**
- Troca a qualquer momento, sem esperar turno nem lei; o demitido reage pela lealdade, o partido dele se irrita no Congresso e a mídia cobra; manter alguém sob escândalo custa mais com o tempo (13/nov).
- Competência: até 3 instituições o ministro rende inteiro; com mais, rende √(3 ÷ instituições).
- Efeito na lei: acima de 70 de competência a lei chega 1 turno antes, abaixo de 30 chega 1 turno depois; força = 0,6 + 0,008 × competência.
- O ministro não mexe na verba, que é lei; a ficha dele muda a instituição (competência alta, rende mais; honestidade baixa, mais corrupção).
- Troca pelo jogador: sempre vira o fato "ministro demitido", inclusive técnico; a 1ª troca dos últimos 24 turnos é notícia pequena, a 2ª média, da 3ª em diante grande; mágoa de 6 pontos mais 3 por troca anterior, sumindo em 3 turnos nos grupos parecidos com quem saiu; partido do demitido perde 8 de termômetro (13/nov).
- No começo, ministros sorteados pela chapa e trocados por três cartas (técnico, aliado, do seu partido) ou pela lista (13/nov).
- Ministro na caixa de uma instituição sem ministro (Eleições, Regras dos poderes) não existe: a lei anda como com competência 50 e o órgão como com honestidade 70.

**Ligações**
- Recebe: caixa que ele leva (4.20), Congresso (moeda Ministério), partido de origem.
- Entrega: força e atraso das leis (4.13), corrupção e rendimento da instituição (4.18), termômetro do partido no Congresso, mágoa nos grupos (Sociedade), notícia (mídia).

**Referências.** O Brasil juntou a economia num superministério em 2019 e separou de novo em 2023. Outros: **ESTUDAR**.

**No motor hoje.** O básico está feito; faltam R6.9 e R6.15 (14/nov, a memória de 30/out está velha).
- ✅ Ficha (R6.7): agem competência e honestidade; habilidade, carisma e lealdade esperam Congresso, mídia e fatos do ministro.
- ✅ Ministros no começo (R6.26).
- ◐ A ficha muda força, atraso e rendimento (R6.8).
- ◐ Trocar a qualquer momento (R6.24): feito partido ressentido, notícia maior a cada troca e mágoa de 3 turnos; falta a reação do demitido pela lealdade e a mídia ter efeito.
- ✅ Trocar ministro pelo mapa (R17.24).
- ☐ Fatos do ministro: escândalo, crise, demissão barulhenta, vira candidato (R6.9).
- ◐ Toda caixa tem ministro (R6.15): ver 4.20.

**Em aberto**
- Opinião central: ministros têm lealdade que nada lê. Uma régua de opinião única para todo ator (grupo, partido, ministro, juiz, mídia) está por desenhar.
- Ministério sem pasta só dá cadeira ao Congresso; agradar grupos parecidos com o ministro ainda não existe.

---

### 4.20 Ministérios (caixas)

**O que é.** Uma caixa com nome onde cabem instituições inteiras, de zero até quantas o jogador quiser.

**O jogador.** Muitas caixas dão mais cargos e foco, com mais custo. Poucas (superministério) economizam, mas a competência do ministro se divide. Programa espalhado por várias caixas depende de vários ministros e anda no passo do mais fraco.

**Peças**
- Caixa com instituições: o ministro rende e a ficha dele muda leis e órgãos dela.
- Ministério sem pasta (ex.: Mulheres, Pesca): só cargo para aliado, é a moeda "Ministério" do Congresso.
- Gabinete do chefe de governo: recebe as instituições que nenhuma caixa levar; pesa 3 a mais.
- Moldes de caixas sugeridas (35 linhas: básico, comum, superministério, de causa).
- Régua de tamanho: Enxuto (9), Clássico (19), Do país, Inchado (do país mais 5 sem pasta).
- Lei Organização dos ministérios: escada de quem pode mexer nas caixas.

**Regras**
- Cada instituição fica numa caixa só; a que sobra vai para o gabinete (13/nov).
- Toda caixa tem um ministro, custa estrutura e agrada quem é parecido com ele.
- No começo o país vem com os ministérios reais dele e o jogador muda no menu.
- Depois, pela lei Organização dos ministérios, escada em 4 degraus (13/nov): 1) livre, por decreto; 2) medida provisória e o Congresso confirma; 3) só por lei; 4) algumas caixas fixas na Constituição. O país declara o degrau inicial.
- A divisão muda com quem governa (como na realidade).
- O motor confere ao iniciar: recusa instituição em duas caixas, instituição sem ministro numa caixa, falta de gabinete ou a mesma pessoa em dois cargos.
- A lei vai para a caixa que leva a instituição dela; senão, para a sobra (gabinete).

**Ligações**
- Recebe: instituições, ministro, escolha do jogador.
- Entrega: moeda Ministério ao Congresso; custo de estrutura (caminho do dinheiro, ainda não feito); agrado aos grupos parecidos.

**Referências.** Caixas de 11 países reais (Brasil, EUA, China, Alemanha, Japão, Índia, Reino Unido, França, Itália, Canadá, Rússia). Planilha de caixas genéricas.

**No motor hoje**
- ✅ Instituições, caixas e gabinete (R6.10).
- ✅ Régua de tamanho e "Ajustar caixas" (R6.25).
- ◐ O país começa com os ministérios dele; Brasil com 34 caixas, faltam os outros países e a lei Organização dos ministérios (R6.14).
- ◐ Toda caixa tem ministro e divide a competência; faltam o custo de estrutura e agradar quem é parecido (R6.15).

**Em aberto**
- Custo fixo por ministério e por cargo: sem ele o governo Inchado não tem desvantagem.
- Tipos de parlamento: reformular com as caixas livres (quem controla o quê na coabitação).
- Ministério é gente para dar atenção extra a uma instituição; grupo descontente fala com o ministro da instituição, ou vai direto ao presidente ou ao Congresso.

---

### 4.21 A fronteira do governo

**O que é.** A linha entre o que o jogador controla direto e o que só influencia.

**O jogador.** É o governo; as fichas não decidem por ele.

**Peças**
- Controla (12/nov): leis (propor, assinar, vetar, decretar se a lei deixar); pessoas (nomear e demitir ministros, indicar juiz na vaga); verbas, sempre por lei; estatais (Operações); exterior (posições por país e atos); polícia federal e Forças Armadas, dentro da lei de autonomia delas; emissora estatal e inteligência; a mesa inteira.
- Só influencia (12/nov): Congresso (moedas, termômetro, paciência), Justiça (indicação e pressão, com rastro), governadores (verba e termômetro), mídia privada, empresas, grupos e pops, banco central (se a lei de independência deixar).

**Regras.** Os dois pontos acima, ambos de 12/nov. Opções de menu de país e de companhia são Ato ou Operação, não lei; as leis só controlam essas decisões.

**Ligações.** Toda a Parte Política, Mundo, Mídia, Economia.

**Referências.** Nenhuma citada. **ESTUDAR**.

**No motor hoje.** Não é uma peça de código; é regra de desenho.

---

---

## Parte 5. Política

Política fica em volta das três grandes mecânicas (Sociedade, Economia e Máquina pública). É o caminho pelo qual a população controla o governo: partido, Congresso, eleição e Judiciário (decisão de 14/nov). Presidente, vice, sucessão, pessoas e governadores também moram aqui. Ministros, caixas, instituições e a fronteira do governo estão na Parte Máquina pública, e as contas do Estado estão em Economia.

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R é o requisito em `requisitos.md`.

---

### 5.1 Partido e chapa

**O que é.** O jogador é o partido: decide quem fala por ele, com quem ele se alia e o quanto ele se afasta da própria história. A chapa do começo reúne pessoas de todos os partidos, e daí nasce a coligação.

**O jogador.**
- Dá nome e sigla ao partido e escolhe a chapa do começo. Nunca escolhe o lado: a bússola e a base saem das pessoas da chapa.
- Governar longe da posição do partido irrita a base: lealistas viram descontentes, a coesão cai e deputados do próprio partido votam contra.
- Vê que presidentes, ministros e candidatos passam e o partido fica.

**Peças.**
- Ficha: posição na bússola (vem da chapa), grupos da base, cadeiras, caixa, desgaste, coesão.
- Presidente do partido: escolhido entre as fichas; comanda negociação e campanha; troca com custo de coesão.
- Caixa: entra por financiamento (público ou privado, pela lei de financiamento de campanha) e sai na campanha; dinheiro privado vem com interesse de quem doou.
- Coesão: mede se o partido vota unido; cai com governo longe da base, escândalo, troca de líder e derrota; sobe com vitória e base satisfeita.
- Mesa do partido: doador, filiação, expulsar ou perdoar, coligação.

**Regras.**
- O jogador dá só nome e sigla; a bússola e a base saem das pessoas da chapa (12/nov).
- A chapa do começo reúne pessoas de todos os partidos e disso nasce a coligação (12/nov).
- O jogo nunca pede lado ao jogador; o lado do partido sai da média da bússola da chapa (12/nov).
- O partido muda de lugar na bússola, mas devagar e pagando.
- Cadeiras do partido novo: 6% do Congresso, tiradas dos partidos de origem da chapa; a sigla vira o id e não pode repetir.
- O partido defende os 5 grupos mais perto da média da bússola da chapa, peso total 1,2.
- O partido que governava vira oposição, ou entra na coligação se o jogador pedir.

**Ligações.**
- Recebe: chapa, financiamento (lei), resultado e escândalo.
- Entrega: coesão ao voto do Congresso (fiéis e livres); caixa à campanha; bússola ao eleitor.

**Referências.** Nenhuma citada. ESTUDAR.

**No motor hoje.**
- ✅ Criar o partido, montar a chapa, o lado sair da chapa (R4.5, R4.6, R4.8).
- ◐ Começo com história: partido novo com 6% e o antigo governo na oposição; falta a Aprovação começar alta (R4.9).
- ☐ Ficha do partido, coesão, presidente do partido, caixa (R5.1 a R5.5). O que falta é a ficha e o resto; partido, chapa e lado estão feitos.
- ☐ Mesa do partido (R17.10) e momentos do partido como telas curtas (R17.11).
- A coesão já entra no voto do Congresso (padrão 0,7 por partido).

**Em aberto.**
- Quanto longe é longe; quanto o partido pode andar na bússola por mandato.

---

### 5.2 Presidente e vice

**O que é.** A ficha da pessoa que lidera o governo e a ficha do vice.

**O jogador.**
- O jogador não é o presidente: é o partido. As fichas não decidem por ele; mudam o quanto ele consegue e podem cair.
- O presidente dá o tom: carisma pesa na aprovação, honestidade no risco de escândalo, habilidade política na relação com o Congresso.
- O vice costuma vir de um partido aliado. É o preço da coligação e um risco: se ele assumir, o poder sai do partido do jogador e a partida acaba.

**Peças.** Ficha do presidente e ficha do vice, com as cinco notas (competência, habilidade, carisma, honestidade e lealdade; ver 5.4).

**Regras.**
- Vice de outro partido assumindo acaba a partida (12/nov).
- A chapa do começo reúne pessoas de todos os partidos e disso nasce a coligação (12/nov).

**Ligações.**
- Recebe: aprovação e honestidade vindas da população (aprovação é a satisfação média, ver 5.6).
- Entrega: Congresso (habilidade), mídia e eleitor (carisma), escândalo (honestidade).

**Referências.** ESTUDAR (nenhuma fonte cita jogo ou estudo sobre a ficha do presidente).

**No motor hoje.**
- ☐ A ficha do presidente pesar em aprovação, escândalo e Congresso (R6.2).
- ✅ Escolher a chapa no começo (R4.6).

---

### 5.3 Sucessão

**O que é.** O que acontece quando o presidente deixa o cargo antes do fim do mandato.

**O jogador.** Sofre o fato. Se assume alguém do próprio partido, o governo continua com choque de aprovação (simpatia ou caos) e a ficha nova no lugar. Se assume alguém de outro partido, mesmo aliado, a partida acaba.

**Peças.** Morte, assassinato, renúncia e afastamento (impeachment); vice; linha de sucessão do país.

**Regras.**
- A chance de cada saída depende do país: polarização, radicais, segurança pública e escândalos.
- Quem assume é o vice, depois a linha de sucessão do país.
- Sucessor de outro partido acaba a partida (12/nov).
- Impeachment: a oposição abre o pedido, o Congresso aceita e, quando o país tem Senado, o Senado julga. Pesam a maioria contra, radicais altos, poucos lealistas e escândalos.

**Ligações.**
- Recebe: radicais, polarização, segurança pública, escândalos.
- Entrega: aprovação (choque), fim da partida, fatos "presidente morreu" e "impeachment aberto".

**Referências.** Nenhuma citada. ESTUDAR.

**No motor hoje.** ☐ Falta tudo: morte, assassinato, renúncia, vice assumindo (R6.3); impeachment (R6.5).

**Em aberto.** A chance de cada saída pelo país (idade, radicais, segurança).

---

### 5.4 Pessoas (fichas)

**O que é.** Os personagens do jogo: presidente, vice, ministros, juízes, candidatos, gente do partido e dos aliados. Cada um tem ficha.

**O jogador.** Precisa formar nomes novos, porque as pessoas envelhecem, se aposentam e morrem.

**Peças.**
- Gerador de personagens: cria as fichas no começo e ao longo da partida (novos nomes no partido, nos aliados, técnicos).
- Notas: competência, habilidade, carisma, honestidade e lealdade, de 5 a 95, normais em torno de 55.
- Origem: partido (pelo peso das cadeiras) ou técnico sem partido.
- Bússola: em torno da do partido de origem (desvio 0,25); técnico em torno do centro (desvio 0,45).
- Idade de 35 a 74 e nome (próprio mais sobrenome, sem repetir).
- Perfil de rede social gerado da ficha, sem rótulo de lado.
- Retrato: o motor não guarda desenho; a tela desenha com DiceBear a partir do id.

**Regras.**
- O motor não conhece nomes: o país declara listas de nomes e a mesma semente gera as mesmas pessoas.
- O jogo nunca pede lado ao jogador; o lado do partido sai da média da bússola da chapa (12/nov).
- Juízes do Brasil têm nomes parecidos com os reais, nunca os reais (regra de conteúdo do GDD).

**Ligações.**
- Recebe: partidos do país (cadeiras e bússola).
- Entrega: ministros, chapa, juízes, candidatos.

**Referências.** Retrato: DiceBear (CC0, código MIT). Outras: ESTUDAR.

**No motor hoje.**
- ✅ Gerador e lista de pessoas por vaga (R6.12).
- ◐ Perfil de rede social: posts, lugares e quem segue; falta "informações pessoais descobertas" e o Espiar (R6.11).
- ◐ Retratos genéricos, provisórios (R6.1).
- ☐ Envelhecer, aposentar e morrer para todos; hoje só os juízes envelhecem.

**Em aberto.**
- Fichas declaradas pelo país com nomes parecidos com os reais, como os juízes, também para políticos?
- O autor não gostou dos retratos genéricos.

---

### 5.5 Congresso e coligação (o coração do voto)

**O que é.** Os partidos do país votam toda mudança de lei; o jogador junta votos.

**O jogador.**
- Vê, antes da votação, quantos votos tem a favor, contra e indecisos; o placar previsto é o real, sem sorteio.
- Negocia com indecisos oferecendo moedas, e cada moeda cobra depois.
- Convida partidos para a base; cada um cobra e sai ou entra pelo termômetro. A oposição vota contra, aprova leis dela quando tem votos, vai à mídia e mobiliza grupos.

**Peças.**
- Partidos do país: nome, cadeiras, bússola, grupos que defendem, presidente com ficha. Cadeiras mudam a cada eleição.
- Casas e sistema: só Câmara ou Câmara e Senado; presidencialismo, parlamentarismo, semipresidencialismo ou partido único; sistema eleitoral (proporcional, misto, distrital) é lei do jogo; monarquia sem eleição só nos países leves.
- Voto por partido: nota de −1 a +1 (bússola, ganho dos grupos, base ou oposição, apoio da população, aprovação, conta da lei).
- Fiéis e livres pela coesão.
- Indecisos: nota entre −0,12 e +0,12.
- Quórum por classe: comum, absoluta, constitucional, mandato.
- As 6 moedas: ceder na régua, ministério, cargos, emenda, promessa de lei, decreto.
- Decreto: fato consumado e alcance em 4 degraus.
- Preço que sobe a cada compra.
- Paciência do Congresso (0 a 100, por casa).
- Termômetro por partido (0 a 100).
- Congresso agindo sozinho: rejeitar, emendar, derrubar veto, propor lei, travar a pauta, CPI, impeachment, moção de desconfiança.
- Bancadas temáticas.
- Lobby das companhias.
- Congresso sobrecarregado (carga da casa).
- Partido único por dentro: congresso do partido, alas, expurgo.
- Tela: anel de cadeiras no miolo, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha de quórum.

**Regras.**
- Aprovar não pode ser tão difícil que o jogador não jogue; aprovar lei e medida provisória é importante. Passar lei é uma mecânica conjunta com a mídia e os grupos; o Congresso é a "voz" dos grupos, não do povo, porque no meio há dinheiro e influência. (autor, 14/nov)
- Placar previsto = placar real; só muda por fato do turno, e o fato aparece (11/nov).
- Conta da lei (12/nov): quanto a lei sobe o gasto em % do PIB, pesando mais nos partidos que ligam para contas e com déficit alto. Exorbitante é a lei que perde a maioria por causa da conta.
- Tempo da lei (12/nov): turno 1 Câmara, turno 2 Senado; se o Senado muda o texto, volta à Câmara no turno 3 e vai à mesa; o veto pode ser derrubado no mesmo turno; país de uma casa vota uma vez; regra do poder e mandato votam duas vezes. Sem urgência.
- Sistemas (11/nov): o motor do voto, o placar e as moedas são iguais; muda quem vota e como o jogador cai. Presidencialismo cai por impeachment; parlamentarismo por moção; semipresidencialismo sem maioria vira coabitação (primeiro-ministro manda na economia e nos serviços; presidente fica com Defesa, Exterior e veto); partido único cai pela ala rival.
- Quórum (11/nov): cada lei declara a classe; a lei Quórum das votações muda os valores. Mexer no próprio mandato pede quórum de mandato e custa paciência e grupos; "vale só no próximo mandato" tira o custo extra.
- Moedas (11/nov), cada uma cobra depois: ceder (a lei faz menos); ministério (aliado fiel enquanto o ministro ficar; tira cargo do próprio partido); cargos (órgão menos eficiente, mais corrupção; reserva pela lei Cargos de livre nomeação); emenda (sai do orçamento; reserva pela lei Emendas dos parlamentares); promessa (lei do aliado em até 4 turnos; descumprir enfurece); decreto (vale já, sem voto, se a lei Poder de decreto deixar; o Congresso tem 2 turnos para confirmar).
- Fato consumado (12/nov): derrubar decreto custa a quem derruba, porque os grupos que ganhavam ficam com raiva dos partidos que votaram contra.
- Alcance do decreto (12/nov), 4 degraus: nenhum; só verba e preço; tudo menos impostos, regras do poder e mandato; tudo, sem confirmar. Decretar dentro da lei não é passo autoritário; subir ao degrau 4 ou decretar por fora é.
- Decreto que só cumpre uma lei fica fora do jogo; o motor faz sozinho (12/nov).
- Preço que sobe (12/nov): cada compra ensina que o governo paga; quem entrou por compra sai quando o caixa ou os cargos acabam.
- Paciência (11/nov): cai com decreto, veto, ir à mídia contra o Congresso e lei demais; sobe sozinha e mais no turno sem lei nova; abaixo de 30 toda lei do governo perde votos e o Congresso aprova leis caras e populares por conta própria.
- Termômetro (11/nov): sobe com ministério, cargos, emenda, leis perto do lado dele e grupos dele satisfeitos; cai com leis longe, grupos insatisfeitos, promessa descumprida e pedido ignorado. Na base: abaixo de 30 vira "ameaça sair", abaixo de 20 sai. Na oposição: acima de 70 aceita convite.
- Congresso sobrecarregado (11/nov): sem pontos de ação; o freio é a casa. Passou do limite, a lei entra na fila e não é votada naquele turno; nada é proibido.
- Lei derrotada fica 2 turnos barrada.
- Ano de eleição: no último ano do mandato o deputado vota mais com o povo que com o partido.
- Sem sorteio para a lei passar: a aprovação vem do Congresso e dos grupos, nunca de um dado (14/nov).
- Veto: o GDD é a meta e vale para toda lei aprovada (o presidente assina ou veta); a observação fica guardada e o Congresso derruba com o quórum absoluto. O código hoje só põe na mesa a lei emendada pelo Senado (estado conferido em 14/nov).

**Ligações.**
- Recebe (Sociedade): grupos (insatisfeito baixa o termômetro e acorda a bancada), aprovação, mídia (manchete contra), corrupção (o que a CPI acha), companhias (lobby), eleição (as cadeiras).
- Entrega: coesão do partido do presidente, corrupção (emenda secreta, cargos), orçamento (emendas), aprovação (CPI, veto derrubado, promessa quebrada), eleição seguinte.
- Leis: toda lei passa pelo Congresso (placar e quórum).
- Fatos que escreve: lei aprovada ou rejeitada, emenda, veto, decreto, promessa, partido entra ou sai.

**Referências.**
- Decreto = "medida provisória" do Brasil; o nome é rótulo do país.
- Países por sistema (corte suprema única, corte constitucional separada, tribunais por tema) estão em 5.7.
- Referência de jogo ou estudo para o modelo de voto: ESTUDAR.

**No motor hoje.**
- ✅ Toda mudança de lei é votada (R12.1); partidos do país (R12.2); placar previsto = real (R12.11); nota do partido (R12.12); fiéis e livres (R12.13); quórum por classe (R12.14); duas casas (R12.7).
- ✅ Coligação: convidar, sair, voltar (R12.3); termômetro (R12.16); paciência (R12.17); carga (R12.18); veto e derrubada (R12.6, só da lei emendada).
- ◐ Seis moedas (R12.4): faltam botões de promessa e decreto na tela.
- ◐ Decreto (R12.19): falta a raiva dos grupos que ganhavam e o botão.
- ☐ Veto de toda lei, como o GDD quer.
- ☐ Rejeitar sozinho, emendar sozinho, propor lei popular, travar a pauta, CPI (R12.5, R12.10).
- ☐ Bancadas e lobby (R12.15).
- ☐ Sistemas parlamentarismo, semipresidencialismo, partido único (R12.8).
- ☐ Cadeiras mudam a cada eleição (R12.9).
- Obs.: sem Congresso nas regras do país, todo pedido passa.

**Em aberto.**
- Quais das 6 moedas cobram depois de verdade e o preço que sobe.
- Fato consumado e alcance do decreto em 4 degraus (como entram no código).
- Tipos de parlamento com as caixas livres (quem controla o quê na coabitação).
- Se o voto do Senado na vaga de juiz deve pesar mais a distância (a base tem 60 de 81 senadores).
- Mídia pesar no voto: a mídia não pesa em nada hoje; polêmica (troca de ministro, escândalo, decreto derrubado) precisa de efeito pela mídia. A mídia é lente sobre os fatos que já existem; ESTUDAR como ela mexe nesta mecânica.
- Opinião central (régua comum de opinião: grupo, partido, ministro, juiz, mídia).
- Eleitor se acostuma e julga a melhora; o voto ainda não usa.

---

### 5.6 Eleição, campanha e mandatos

**O que é.** O voto no fim do mandato que decide se o partido continua no poder, mais a campanha, a chapa e a duração do mandato.

**O jogador.**
- Monta a chapa antes da eleição: candidato e vice, entre fichas do partido e dos aliados.
- Gasta o caixa do partido em ações de campanha com alvo, sem limite por turno; o freio é o caixa e o cansaço (repetir no mesmo grupo rende cada vez menos).
- Faz uma promessa de campanha, que fica na tela até a eleição.
- Sente a promessa cumprida subir o voto e a quebrada derrubar.

**Peças.**
- Mandatos: duração e reeleição (Duração de 1 a 10 anos ou indefinida; Mandatos seguidos; Intervalo para voltar; Limite total).
- Chapa.
- Coligação eleitoral: partidos somam tempo de TV, caixa e eleitores, e cobram lugar na chapa e no futuro governo; pode ser diferente da coligação de governo.
- Campanha: comício (um grupo), TV (todo o público, pela mídia), redes (jovens e engajados), debate (carisma contra o adversário), promessa.
- A eleição: cada grupo vota pela satisfação, pela distância na bússola até os candidatos, pela campanha e pela mídia; peso é o tamanho do grupo.
- Desgaste.
- Promessa.
- Adversários e dois turnos.
- Aprovação.

**Regras.**
- Duração e reeleição são leis essenciais do país (07/nov); mudar a duração no meio do mandato é possível e caro.
- Limite de reeleição: o presidente sai, o partido continua com outro candidato.
- Campanha abre nos últimos turnos do mandato (ex.: 3 turnos).
- A campanha é nacional e mira grupos, com ação por estado, sempre dentro da eleição nacional.
- A lei de financiamento de campanha decide de onde vem o dinheiro.
- Desgaste sobe a cada mandato e com escândalos; o jogador reduz, nunca zera. No código: 2,25 pontos por mandato de 4 anos, sempre.
- O eleitor percebe o déficit e a inflação, não a contabilidade.
- Promessa (12/nov): mira um índice principal com meta, um subíndice ou um programa; principal pesa em todos os grupos, subíndice e programa mais nos grupos que se importam; cumprida sobe o voto, quebrada derruba e sobe o desgaste. Tamanho: o prêmio depende da dificuldade. Em parte: chegar perto vale em parte. Quando: avaliada no primeiro turno da eleição; trocar a promessa no meio do mandato conta como quebrar.
- Fórmula no código: efeito no voto = tamanho × (2 × cumprimento − 1) × 0,06; cumprimento abaixo de 0,5 soma desgaste de tamanho × 1.
- Adversários (12/nov): os partidos de oposição; cada um lança chapa e podem se coligar entre si. No código: se defendem os mesmos grupos (semelhança 0,6 ou mais) se coligam, do maior para o menor.
- Dois turnos (12/nov): se ninguém passa da metade, os dois mais votados vão ao segundo. O segundo cai no último turno jogável do mandato e o primeiro no anterior.
- Aprovação (12/nov): satisfação média de todos os pops, pesada pelo tamanho; a mesma conta do voto, sem campanha nem adversário. É o termômetro do mandato (puxa o deputado indeciso, abre CPI e impeachment).
- Perdeu, a partida acaba; ganhou, o mandato novo começa.
- Resultado: Presidência e cadeiras do Congresso.
- Cota e eleição pela promessa: quem foca numa área (ex.: segurança) pode ganhar a eleição nessa promessa.
- Eleições (a instituição que cuida da votação) não tem ministro e fica com o Judiciário (13/nov; ver 5.7).

**Ligações.**
- Recebe (Sociedade): satisfação de cada grupo, aprovação, mídia que o grupo assiste.
- Recebe (Máquina pública): leis de mandato e de financiamento, programa formado (promessa de programa).
- Entrega: Presidência, cadeiras do Congresso, fim da partida, fatos "meta cumprida", "meta quebrada", "segundo turno".

**Referências.**
- Governos que já existiram: a cada eleição o novo governo cai perto de um ponto da história (R15.10, Mundo); dados em "leis - Países - governos.tsv" (bússola de cada governo por período, V-Party e CHES).
- Referência de jogo para a campanha: ESTUDAR.

**No motor hoje.**
- ✅ Mandato e eleição pela lei do país (R13.1); desgaste sobe sempre (R13.2).
- ✅ Adversários (R13.9) e dois turnos (R13.10).
- ◐ Voto por grupo, falta bússola dos candidatos, campanha e mídia (R13.3).
- ◐ Promessa (R13.11): falta descontar o que o país faria sozinho.
- ✅ Aprovação (R9.9).
- ☐ Limite de reeleição troca o candidato (R13.4); chapa entre fichas do partido e aliados (R13.5); coligação eleitoral (R13.6); campanha (R13.7); reduzir o desgaste (R13.8).
- ☐ Placar final e resumo de 4 em 4 anos (R4.7).

**Em aberto.**
- Como se reduz o desgaste (o GDD diz que o jogador reduz, nunca zera, sem dizer como).
- Eleitor se acostuma (o ganho antigo some, a raiva de cortar fica) e julga a melhora (a seta de tendência existe; o voto ainda não usa).
- Mudar de ideia custa: propor e desistir de uma lei não pode ser de graça.
- Cota de foco por área: o desenho da "cota" e da promessa estava pendente.
- Placar final: quais números, comparados com o começo?

---

### 5.7 Judiciário e Justiça e prisões

**O que é.** Duas coisas diferentes. Judiciário é um dos Três Poderes, no miolo do mapa: juízes e tribunais, sem ministro. Justiça e prisões é uma instituição do Executivo, sob um ministro: prisões, penas e a política de justiça.

**O jogador.**
- Quando abre vaga no tribunal, chega um papel importante na mesa com três cartas (aliado do partido, técnico respeitado, nome do lado do Senado); a mesa abre sozinha e a vaga não vence.
- O presidente só influencia a Justiça: indica juiz na vaga, pressiona com rastro, aumenta a corte (ação); não julga ninguém.
- Vê os juízes no miolo, coloridos pelo lado; passar o mouse mostra a fila ("320 processos · 2 seus").

**Peças.**
- Tribunais do país (função genérica: constitucional, última instância, eleitoral, trabalho, militar); o rótulo (STF, TSE) é do país.
- Juízes: nome, sexo, idade, anos na corte, origem, bússola.
- Vaga e indicação, pela lei "Quem escolhe os juízes" (arquivo `indicacao-de-juizes`), escada de 3 degraus: carreira, presidente indica e Senado aprova, presidente indica livre.
- Presidente da corte: mandato de 2 anos (12 turnos), o mais antigo que ainda não presidiu; o TSE vem do STF.
- Independência da Justiça: é índice, não lei. Sobe com juízes técnicos e cai com juízes do partido do presidente; o código calcula pela composição da corte.
- Lei "Independência dos investigadores": lei separada, que define a chance de a corrupção ser descoberta.
- Fila de processos.
- Caso em etapas: rastro, investigação, processo, sentença.
- Suspender lei.
- Corrupção em cadeia.
- Eleições: instituição sem ministro, pendurada no tribunal eleitoral.

**Regras.**
- A independência da corte não é lei: é um índice, um sentimento, que vem de vários lugares. Quem senta (técnicos ou juízes do partido, pela lei "Quem escolhe os juízes") é um deles; os outros: **ESTUDAR**. (autor, 14/nov)
- Judiciário não tem ministro e não entra em caixa.
- Eleições fica sempre com o Judiciário (13/nov), e não com a instituição Justiça e prisões; no mapa o escudo fica abaixo do anel do Congresso. Nenhuma caixa a leva e fica ligada só à corte eleitoral quando os tribunais existirem.
- Juízes são de verdade, com ficha própria (14/nov).
- Fila de processos: pouca verba, fila lenta e o caso prescreve.
- Um caso anda: rastro, investigação, processo, sentença. Condena se a prova existe de verdade, conforme a independência; Foro especial manda o político ao tribunal de cima, mais lento; Delação premiada acelera. Vale para papel duvidoso, líder de organização e escândalo de ministro.
- Quem escolhe os juízes (lei, 14/nov): escada de três degraus decide quem escolhe. Na carreira o próprio tribunal preenche com um técnico e nada chega à mesa.
- O Senado vota: a base do governo aprova; fora dela, só quem está perto na bússola; barrado, a vaga continua, as cartas mudam e chega papel novo.
- Enquanto a vaga está aberta, o tribunal decide com menos gente.
- Aposentadoria abre vaga; cada turno soma 2 meses de idade.
- Aumentar a corte é ação, não lei (14/nov, "sai da lei"); entra numa fatia futura.
- Suspender lei: quando a lei bate em direito (degrau extremo de censura, pena de morte, mandato sem fim); chance pela distância entre o tribunal e a lei; chega o papel "tribunal suspendeu a lei".
- O presidente aceita, aumenta a corte (caro no Congresso e na mídia), pressiona o juiz (papel duvidoso, rastro) ou ignora a decisão (crise institucional; liberdade e reputação caem; Risco de golpe sobe).
- Corrupção em cadeia (12/nov): o rastro não some; a chance de ser descoberto usa a independência dos investigadores de hoje, não a da época; se ela sobe, os rastros antigos aparecem de uma vez (escândalo, processo, até prisão do ex-presidente). Baixar a independência dos investigadores faz a corrupção de cada órgão subir sozinha, o rendimento cair e o serviço piorar.
- Tribunais genéricos (13/nov): três jeitos no mundo (corte suprema única, corte constitucional separada, tribunais por tema).
- Impeachment segue com o Congresso.
- Justiça e prisões: o ministro faz as leis dela andarem; não julga ninguém.

**Ligações.**
- Recebe: leis (Quem escolhe os juízes, Independência dos investigadores), presidente (indicação), Senado (aprova), verba (fila).
- Entrega: independência da Justiça (índice), fatos "juiz aposentado", "juiz nomeado", "indicado barrado", "corte novo presidente"; suspender lei (Máquina pública); condenação e escândalo (Sociedade, Congresso).

**Referências.**
- Corte suprema faz tudo: EUA, Índia, Japão, Reino Unido. Corte constitucional separada: Alemanha, Itália, França. Tribunais por tema: Brasil, Alemanha.
- Brasil: STF de 11 cadeiras e TSE só com presidente, nomes parecidos com os reais.
- Argentina e outros: ESTUDAR (não citados).

**No motor hoje.**
- ✅ Tribunais e juízes (14/nov).
- ✅ Vaga e indicação (14/nov).
- ✅ Presidente da corte (14/nov).
- ✅ Eleições sem ministro, com o Judiciário (R6.27).
- ◐ Judiciário (R6.20): independência sai de quem senta; falta fila e caso.
- ◐ Tribunal superior (R6.22): falta suspender lei.
- ☐ Fila de processos, caso em etapas, suspender lei, corrupção em cadeia (R6.21).
- ☐ Aumentar a corte como ação.
- ☐ Papéis duvidosos deixam rastro (R17.14).

**Em aberto.**
- Fila genérica: de onde vêm os processos, quem os julga, o que o jogador vê.
- O presidente da corte faz alguma coisa no jogo (pauta da fila)?
- Quais leis "batem em direito" (marca na lei?).
- O voto do Senado na vaga deve pesar mais a distância?
- Se cada instituição e cada lei responde a um dos poderes.
- STF: falta toda a mecânica do tribunal superior (fila, caso, suspender lei), mas não é mecânica essencial. (autor, 14/nov)

---

### 5.8 Governadores

**O que é.** O governador de cada estado, com partido, lugar na bússola e termômetro com o presidente.

**O jogador.** Não governa estado nem escolhe obra. Negocia pela instituição Estados e municípios; o ministro dela faz a verba render e esquenta o termômetro.

**Peças.**
- Verba: aliado faz a verba federal render mais; oposição demora a gastar e culpa o presidente na mídia local.
- Congresso: os deputados do estado puxam um pouco para o governador.
- Mesa: pede obra, socorro e polo (família Pedidos).
- Eleição: aliado faz campanha pelo presidente no estado; oposição, contra.
- Estados e municípios (13/nov): leis de repasse e de dívida dos estados moram nela.

**Regras.**
- Quem cuida de luz, gás e água muda por país: o arquivo do país declara; a lei que não cabe ao presidente fica inativa (11/nov).
- Pops por estado pesam pouco no motor (medido em 12/nov: possível, com cálculo uma vez por tipo de pop).
- Guerra civil racha o país por estados e governadores da oposição se rebelam.
- Governadores só são influenciados pelo jogador (verba e termômetro), nunca controlados (12/nov).

**Ligações.**
- Recebe: verba federal, termômetro, bússola.
- Entrega: Congresso (bancada do estado), mesa (pedidos), eleição (campanha no estado), mídia local.

**Referências.** Nenhuma citada. ESTUDAR.

**No motor hoje.** ☐ Falta tudo (R6.23): partido, bússola, termômetro; verba rende mais com aliado; pedidos na mesa; campanha no estado.

**Em aberto.** Estados e municípios ainda não tem lei.

---

### 5.9 Como se perde o poder

**O que é.** Os caminhos pelos quais o partido deixa o poder federal. Perder o poder federal acaba a partida.

**O jogador.** Sofre, e entende por quê; perder não parece azar.

**Peças.** Caminhos (12/nov):
- Eleição: voto no fim do mandato; acaba se outro partido vence.
- Morte, assassinato, renúncia: idade, atentado, escândalo grande; acaba se o vice é de outro partido.
- Impeachment (presidencialismo): fato grave, aprovação abaixo de 30%, 2/3 dos votos; acaba se o vice é de outro partido.
- Moção de desconfiança (parlamentarismo): a base sai e a maioria vota contra; acaba se a nova maioria não é sua.
- Golpe: Risco de golpe alto, Forças Armadas pouco leais; sempre.
- Guerra civil: grupos grandes com raiva e armas divididas; acaba se o governo perde a capital.
- Ala rival (partido único): perder o congresso do partido; sempre.

**Regras.**
- No semipresidencialismo, perder a maioria não tira a Presidência: vira coabitação e o jogo segue (12/nov).
- Jogar como oposição depois de perder: para depois.
- Impeachment precisa de fato (crime ou escândalo), aprovação abaixo de 30% e 2/3 dos votos.
- Moção de desconfiança derruba o governo por maioria simples.
- Se a ala rival ganha o comando do partido único, a partida acaba (12/nov).

**Ligações.** Recebe: aprovação, escândalo, Risco de golpe, lealdade das Forças Armadas, raiva dos grupos (Sociedade). Entrega: fim da partida e placar final.

**Referências.** Nenhuma citada. ESTUDAR.

**No motor hoje.** ◐ Só a eleição acaba a partida (R4.4). ☐ Demais caminhos (R6.13). ☐ Sucessão (R6.3), impeachment (R6.5), golpe, guerra civil, ala rival.

**Em aberto.**
- Golpe: como o Risco de golpe sobe e como mede o apoio das Forças Armadas.
- Moção de desconfiança e ala rival dependem dos sistemas de governo (R12.8).
- Placar final.

---

### 5.10 Caminho autoritário

**O que é.** O preço de governar contra os freios: o custo vem de quem tem as armas e de quem tem raiva.

**O jogador.** Pode censurar, ignorar o tribunal, governar por decreto ou adiar a eleição. Cada passo sobe a raiva dos grupos contrários.

**Peças.**
- Passos autoritários (censurar, ignorar o tribunal, governar por decreto, adiar a eleição).
- Raiva alta com satisfação baixa: protesto, atentado e, no topo, tentativa de assassinato.
- Risco de golpe.
- Guerra civil: o país racha por estados e governadores da oposição se rebelam.
- Ditadura que funciona, mas cara: sanções, investimento de fora caindo, gente estudada indo embora, generais que podem trocar o presidente.

**Regras (12/nov).**
- A chance de assassinato cai com a segurança do presidente; se der certo, vale a sucessão (vice de outro partido acaba a partida).
- Sem apoio armado (Forças Armadas pouco leais, polícia dividida, facções fortes), o Risco de golpe sobe a cada turno.
- Com as armas leais e o povo calmo, a ditadura funciona, mas cara.
- Decretar dentro da lei Poder de decreto não é passo autoritário; subir ao degrau 4 ou decretar por fora dela é.
- Ignorar a decisão do tribunal: crise institucional, liberdade e reputação caem, Risco de golpe sobe.

**Ligações.**
- Recebe: grupos (raiva e satisfação), Forças Armadas (lealdade), polícia, facções, governadores.
- Entrega: sucessão, golpe, guerra civil, sanções e investimento (Economia, Mundo).

**Referências.** Nenhuma citada. ESTUDAR.

**No motor hoje.** ☐ Falta (R6.19): cada passo autoritário sobe a raiva; sem armas leais sobe o Risco de golpe; guerra civil racha por estados.

**Em aberto.** Golpe: como se mede o Risco de golpe.

---

## Parte 6. Mídia

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`.

**Lugar no jogo.** O jogo tem três mecânicas: Sociedade (a população e como ela funciona), Economia e Máquina pública (as leis e quem as executa). Mídia, Mundo e Narrativas ficam em volta delas. O ciclo é: a economia mexe no pop, o pop mexe na política, a política (as leis) mexe na economia. Princípio 8: dados primeiro, narrativa depois. Os números vêm antes; frases, manchetes e eventos leem esses números. Princípio 2.4: o país vive sozinho. Empresas abrem e fecham, a mídia escolhe lado, os outros países mudam de ideia.

Decidido em 13/nov: hoje a mídia não pesa em nada. O jornal só mostra manchetes; nenhuma notícia mexe em grupo, voto ou aprovação.

### 6.1 A mídia como lente das três mecânicas

**O que é:** a mídia é uma lente. Ela age em cima dos fatos que já existem e não é uma fonte nova do gosto da população (14/nov). Sem fato, não há notícia. O que a mídia muda é como o fato chega: quem o vê, com que força, de que lado.

**O jogador:** governa sabendo que cada lei passa por um filtro, e pode mexer nesse filtro, pagando por isso. Sente a mídia como o jeito pelo qual o país recebe o que ele fez.

**Peças:** as emissoras e redes (6.2), o jornal e a pauta (6.3), fato e versão (6.4), a deriva e a raiva (6.5), os atos e as leis de mídia (6.6).

**Regras:**
- A mídia não cria satisfação. A satisfação vem do que a lei faz na vida do pop; a mídia muda o lado na bússola e a raiva (11/nov, ver 6.5). (14/nov)
- Como a mídia mexe em cada mecânica, com o que as fontes já dizem:
  - **Sociedade:** o grupo sente a lei pelo que assiste. A mídia empurra o pop na bússola devagar (deriva), faz a raiva do grupo subir rápido, e o pop acredita no que lê conforme a credibilidade da emissora. Entra pela audiência por grupo.
  - **Economia:** a mídia é empresa, com lucro, dono e compra na bolsa. A publicidade do governo é verba. A versão falsa e o escândalo mexem em honestidade e reputação, que pesam depois no resto.
  - **Leis:** as leis de mídia (publicidade, emissora estatal, regulação, concessão, censura, banimento) controlam o filtro. A manchete contra tira votos no Congresso. A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete. A mídia expõe o rastro do papel duvidoso.

**Ligações:** Sociedade (audiência, bússola do pop, raiva), Economia (dono, bolsa, verba), Máquina pública (leis de mídia, voto no Congresso), Política (escândalo, honestidade).

**Referências:** nenhum jogo de referência citado nas fontes. **ESTUDAR** como a mídia mexe em cada uma das 3 mecânicas (Sociedade, Economia e Máquina pública).

**No motor hoje:** ☐ nenhuma das três lê a mídia ainda. Só o jornal do turno existe (6.3).

**Em aberto:** o que o estudo trouxer sobre como a mídia mexe em cada mecânica. Faltam números para as ligações com Economia (publicidade, lucro da emissora).

### 6.2 Emissoras e redes

**O que é:** as 8 maiores mídias do país (mais as redes), cada uma com dono, lado na bússola, audiência por grupo e credibilidade.

**O jogador:** governa sabendo que cada lei passa por um filtro, e pode mexer nesse filtro, pagando por isso. O grupo sente a lei pelo que assiste.

**Peças:**
- Emissora: dono (privado, estatal, estrangeiro ou rede), bússola, audiência (fração de cada grupo, de 0 a 1), credibilidade (0 a 100).
- Gerador de audiência: perto na bússola, mais; longe, quase nada; vezes o alcance da mídia.
- Redes: sem dono único, rápidas, polarizam, espalham boato quando a instrução é baixa.
- Perfil da emissora e dos jornalistas, na rede social.
- Mídia é empresa: tem lucro, dono e pode ser comprada na bolsa.

**Regras:**
- O país declara as 8 maiores com nome e especificações. Se não declarar, o gerador de empresas cria a partir do histórico do país. (07/nov)
- Nomes seguem a regra de conteúdo: nenhuma empresa real; o que tem marca ou dono ganha nome alternativo parecido.
- Dono que muda de lado: a posição anda para a do novo dono em alguns turnos; redação forte e credibilidade alta freiam. Estatal muda com o governo; da bolsa, com quem comprou; de família quase não é vendida; estrangeira segue o interesse de fora.
- Emissora estatal: audiência própria, credibilidade baixa no início.
- O partido tem mídias aliadas e porta-voz. Aliada pega em engano perde credibilidade junto.
- Índices da mídia: Liberdade de imprensa, Credibilidade da imprensa, Concentração da mídia, Desinformação, Polarização, Violência contra a imprensa.

**Ligações:**
- Recebe: grupos (audiência por grupo); dono e bolsa (Economia); lei de mídia (Máquina pública).
- Entrega: filtro da opinião do grupo (Sociedade); fatos do turno (Política).

**Referências:** os índices vêm do acervo de leis e índices. Sem jogo de referência citado. **ESTUDAR** (como outros jogos tratam mídia como filtro).

**No motor hoje:** ◐ R14.1, Brasil com 8 mídias inventadas e as redes no estado; ninguém lê audiência nem credibilidade. ☐ R14.5 leis de mídia agindo. ☐ R14.6 redes. Só o Brasil tem `midias.json`. Perfil da mídia e das redes na tela também falta.

**Em aberto:**
- Nomes parecidos com os reais, como os juízes?
- A mídia vira empresa na bolsa: como liga a Companhias (5.6) e Bolsa (5.8)?
- Emissora estatal: audiência e credibilidade em números.

### 6.3 Noticiário: jornal e pauta

**O que é:** o jornal do turno, que traz as notícias de maior impacto, e a pauta, que é o que cada mídia escolhe noticiar.

**O jogador:** lê as manchetes do turno no mapa (princípio 8). Na rede social abre o perfil da emissora e vê o que ela anda postando sobre o país.

**Peças:**
- Impacto: peso do tamanho (1, 2, 3) × força do fato × apelo do tipo. O jornal guarda as 3 maiores.
- Manchetes: molde por tipo de fato, com `{lei}`, `{quem}`, `{caixa}`, `{area}`, `{programa}`.
- Pauta: cada mídia escolhe uns 3 fatos por turno.
- Enquadramento: o efeito de uma lei na opinião passa pela mídia.

**Regras:**
- Uma notícia não é só uma notícia: não existe um jornal só, nem uma opinião só sobre o mesmo fato. Cada mídia conta o fato do seu jeito. (autor, 14/nov)
- O jornal roda na etapa 9b, depois de todos os módulos que escrevem fatos; só entram fatos deste turno.
- O texto das manchetes é do mundo (`mundo/jornal/manchetes.json`); o motor não conhece texto.
- Tipo de fato novo precisa de molde, e um teste confere.
- Pauta: escolhida pelo tamanho do fato, o lado da mídia, o interesse do dono e o medo (censura, corte de verba). O que ela repete vira o assunto mais importante para quem assiste.
- Enquadramento: mídia longe de você amplia quem perde; mídia perto amplia quem ganha.
- Pauta e escândalos: a mídia expõe fichas fracas (honestidade, lealdade) e crises; a amiga demora a noticiar, a inimiga corre.
- A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete.

**Ligações:**
- Recebe: todos os fatos do turno (Política, Máquina pública, Economia); audiência e credibilidade.
- Entrega: fatos "manchete contra/a favor" lidos por Congresso e grupos; voto no Congresso (manchete contra tira votos).

**Referências:** o Democracy 4 não entra (regra de conteúdo). Outras referências de noticiário: **ESTUDAR**.

**No motor hoje:** ✅ R14.4 jornal do turno, 3 maiores no topo do Resultado do turno. ☐ R14.3 pauta. ☐ R14.2 enquadramento. ☐ R17.9 a mídia lê a mesa. O jornal é um só e neutro; o mesmo fato não sai a favor numa mídia e contra noutra ainda. O jornal não é janela própria.

**Em aberto:**
- Como o jornal mostra a mesma notícia por mídias diferentes.
- De onde saem os posts da rede da emissora (dos fatos e da pauta) e se é a mesma rede do perfil das pessoas.
- Teste esperado: o mesmo fato sai a favor na mídia perto do governo e contra na longe.

### 6.4 Fato e versão, mentira, escândalo e vazamento

**O que é:** todo fato do turno tem uma verdade, e pode sair numa versão fiel, enviesada ou falsa, em qualquer mídia, inclusive a sua.

**O jogador:** pode plantar notícia falsa, vazar dado à mídia amiga ou abafar escândalo, sabendo que descoberta vira escândalo.

**Peças:**
- Versão: fiel, enviesada, falsa.
- Mentira descoberta (regra de descoberta).
- Escândalo em ciclo: semente, investigação, publicação, repercussão, desgaste, esquecimento.
- Vazamento: fonte, jornalista, publicação; seu, de rival ou da agência.
- Jornalistas: perfis na rede, redação forte ou fraca; o investigativo descobre segredos; pode ser ameaçado, preso ou agredido.

**Regras:**
- O pop acredita conforme a credibilidade; a verdade só aparece com investigação. Engano descoberto derruba a credibilidade de quem publicou.
- A cada turno que uma versão falsa circula, a chance de ser descoberta sobe com: redação forte das mídias longe de você, Liberdade de imprensa, Independência dos investigadores, checagem e instrução alta, tamanho da mentira, pessoas que sabem e tempo. Cai com censura, medo, corrupção e mídia amiga dominante.
- Descoberta vira escândalo; se o rastro chega ao presidente, cai a honestidade. Só enviesada é difícil de provar.
- A mesma regra da mentira descoberta vale para o rastro do papel duvidoso na mesa (corrupção). A corrupção vai ao bolso de alguém e deixa rastro (14/nov).
- Espiar alguém fica num registro que pode vazar e virar escândalo; a chance sobe com a importância de quem foi espiado.
- Estatística: o presidente pode esconder os números da mídia ou mentir neles; o jogador vê o índice real, a mídia vê com atraso e desconfiança (13/nov).

**Ligações:**
- Recebe: índices (Liberdade de imprensa, Independência dos investigadores); rastro da corrupção (Máquina pública, Política).
- Entrega: escândalo a Política e ao Congresso (honestidade, impeachment, CPI); credibilidade da mídia.

**Referências:** nenhuma citada. **ESTUDAR** (ciclo de escândalo em jogos políticos).

**No motor hoje:** ☐ R14.10 fato e versão, mentira descoberta. Os tipos `escandalo` e `manchete-contra` existem na mesa de fatos, mas só o Congresso os lê, por ora. Falta a mídia emitir "manchete contra/a favor".

**Em aberto:**
- A regra da descoberta serve também ao rastro de corrupção e ao Espiar: uma regra só?
- Escândalo em ciclo e vazamento: regras e números.
- Jornalistas: perfis, redação, ameaça.

### 6.5 A mídia muda o lado do pop e mobiliza a raiva

**O que é:** duas coisas diferentes. A mídia empurra o pop na bússola, devagar. E a mídia faz a raiva do grupo subir, rápido.

**O jogador:** vê no mapa uma seta para onde o grupo vai na bússola e qual mídia empurra; vê o grupo pulsar vermelho e sair manchete.

**Peças:**
- Deriva do pop pela mídia que assiste.
- Bolha e polarização.
- Redes empurram mais rápido.
- Raiva do grupo, 0 a 100.

**Regras (11/nov):**
- A cada turno o pop anda um pouco na bússola para as mídias que assiste, pesadas pela audiência nele e pela credibilidade.
- Bolha: o pop assiste mais a mídia perto dele e larga a longe; a polarização nasce sozinha.
- Redes: só jovens e engajados, para o lado mais perto do pop, nunca para o centro; instrução baixa deixa o boato pegar.
- A vida pesa mais que a TV: a mídia muda o lado, a satisfação vem do que a lei faz na vida do pop. Mídia que diz o contrário do que ele vive perde credibilidade com ele.
- Freio: instrução alta e redação forte.
- Raiva sobe em 1 ou 2 turnos quando uma mídia repete um fato contra o grupo (qualquer mídia, inclusive a do governo, da oposição e das organizações); cai sozinha em poucos turnos quando a pauta muda.
- Com satisfação alta, pouco efeito. Com satisfação baixa, os radicais crescem e o grupo protesta. Com satisfação baixa e organização com líder: greve, sabotagem e, poucos, atentado. Vale o limite de cada grupo.
- Os radicais nascem da piora do padrão de vida, não do nível (14/nov).
- O presidente também mobiliza: a base contra o Congresso derruba a paciência; mobilizar demais cria radicais do próprio lado.
- O jogador compra ou cria mídia, dá publicidade, censura: efeito em mandatos, custo na hora (liberdade, escândalo, reputação).

**Ligações:**
- Recebe: audiência e credibilidade (Mídia); instrução e redação (índices).
- Entrega: bússola do pop (Sociedade); raiva do grupo (Sociedade); protesto, greve, atentado (Política).

**Referências:** Victoria 3 como ideia geral do ciclo, não da mídia. Para a mídia: **ESTUDAR**.

**No motor hoje:** ◐ R8.5, pops deslizam com a vida (feito) e com a mídia (falta, R14.8). ☐ R14.8. ☐ R14.9. ◐ R11.19, raiva do grupo existe, falta a mídia mobilizar. Fato `grupo-com-raiva`: ninguém escreve nem lê ainda.

**Em aberto:** como medir a força de um grupo e quanto ela muda a popularidade de uma lei (pergunta citada na Base do jogo).

### 6.6 Atos do presidente e leis de mídia

**O que é:** o que o presidente faz com a mídia (atos) e as regras permanentes sobre ela (leis).

**O jogador:** dá entrevista, faz pronunciamento, vaza dado, pressiona o dono, corta ou dá publicidade, e escolhe entre segurança e risco.

**Peças:**
- Atos: entrevista, coletiva, pronunciamento em rede nacional, vazar dado a mídia amiga, pressionar o dono, cortar ou dar publicidade, nomear na emissora estatal, processar jornalista, negar credencial, plantar notícia falsa.
- Leis: verba de publicidade do governo, emissora estatal, regulação, limite de dono estrangeiro, concessão, censura e banimento.
- Campanha: leis Horário eleitoral gratuito e Propaganda paga.

**Regras:**
- Entrevista amiga é segura; hostil rende mais e pode editar e armar pergunta; preparar ou improvisar.
- A hostilidade vem da distância da mídia até você, do tema (escândalo aberto endurece) e do formato (ao vivo não tem edição, mas arrisca gafe; gravada pode ser editada se a mídia é hostil).
- Respostas: direto (seguro, rende pouco), desviar para tema parecido (funciona se preparado), atacar a mídia (sobe a base, cai a confiança dos neutros), improvisar (pode render muito ou virar gafe, conforme carisma e honestidade).
- Publicidade agrada quem recebe. Censura e banimento calam a mídia e cobram liberdades, reputação internacional e radicais.
- Plantar notícia falsa é arriscado: descoberta vira escândalo.
- Campanha: as duas leis decidem quem aparece na mídia na eleição.
- Regra geral: opções do menu de país ou companhia são decisões (Ato ou Operação), não leis; as leis só controlam. (08/nov) Ato é "acontece uma vez".

**Ligações:**
- Recebe: carisma e honestidade do presidente (Política); verba (Economia).
- Entrega: base e confiança dos neutros (Sociedade); liberdades e reputação (índices); quem aparece na eleição (Política).

**Referências:** nenhuma citada. **ESTUDAR** (entrevista como minigame).

**No motor hoje:** ☐ R14.5. ☐ R14.11.

**Em aberto:** custo e duração de cada ato com a mídia (entrevista, pressão, processo, notícia falsa). Ficam para as narrativas (ver 9.4).

---

## Parte 7. Mundo

### 7.1 Os países e as fichas

**O que é:** os outros países do mundo, como o jogador os vê e como o motor os roda.

**O jogador:** abre a tela do Mundo, vê o ranking por PIB com a relação de cada país com ele, clica num país e abre a ficha.

**Peças:**
- País jogável (11) e país do mundo (30 maiores, vizinhos, resto do mundo).
- País leve: ficha leve, simulada sem leis nem pops.
- Ficha leve: campos listados abaixo e na planilha de países.
- Governos que já existiram, por período, como pontos na bússola.
- Regime separado da bússola.

**Regras:**
- Países reais (08/nov): as 10 maiores economias e a Rússia (12/nov) são jogáveis. O mundo tem os 30 maiores, mais os vizinhos do país jogado e o resto do mundo num bloco só. A planilha lista 30 países, 11 jogáveis. Isso vale sobre as potências inventadas do motor, que saem no passo 13.
- Nomes e números reais ficam em arquivo de dados, com data e fonte; o motor continua sem conhecer nomes.
- Jogar no passado é só outro arquivo de país (Brasil-2026, Brasil-2003); para o motor são países diferentes.
- Um motor, dois jeitos de rodar (12/nov): só o país jogado roda inteiro; os outros são leves; ao escolher um, a ficha leve sai do mundo e a completa entra. Não se roda o mundo todo.
- País leve: economia resumida (PIB, crescimento, inflação, o que produz, compra e vende), governo (lado na bússola, força do governo, poder militar) e relação com cada país.
- A ficha leve: sistema de governo, regime (V-Dem), jeito, vizinhos; PIB, população, crescimento, inflação, dívida e reservas, o que vende e compra (3 a 5 produtos), ciência por produto, pobreza e violência (geram migração e refugiados); lado na bússola, força do governo (0 a 100), próxima eleição, poder militar (0 a 100), arma nuclear; opinião sobre cada país e blocos. Os 30 usam a mesma ficha; os 11 jogáveis têm também o estado inicial completo.
- Fontes públicas com data: FMI, Banco Mundial, SIPRI, Comtrade, V-Dem. Dados baixados ficam em `~/Documentos/SisGov-dados/`, fora do jogo.
- Países mudam por dentro sem leis. Essa é a meta: eleição a cada 4 anos (economia mal tende a virar o lado) e crise (força do governo baixa traz golpe ou guerra civil).
- Governos que já existiram (12/nov): a cada eleição (no partido único, troca de ala) o novo governo cai perto de um ponto da história, com pouca sorte. Crise econômica puxa para pontos do lado oposto; muito imigrante chegando puxa para os mais tradicionais.
- Pontos dos estudos (12/nov): econômico do V-Party (V-Dem); costumes de 6 medidas do V-Party ajustadas à escala GAL-TAN do Global Party Survey; Europa depois de 2019 pelo CHES 2024. A planilha traz 191 linhas de governo por país e período.
- Regime separado da bússola (12/nov): a bússola diz o que o governo quer; o regime (4 do V-Dem) diz como segura o poder. Não se somam; os dois pesam na opinião entre países. O sistema de governo é uma terceira coluna.
- A virada muda o país: opinião recalculada pela nova distância; o lado econômico muda tarifa e vontade de acordo; costumes à direita fecham a fronteira; governo mais autoritário gasta mais com militares e age mais; entra ou sai de blocos e alianças.
- Histórico do país: cada país declara golpes, crises, guerras, governos, empresas e mídias tradicionais. (07/nov)

**Ligações:**
- Recebe: leis do país jogado (Máquina pública), que movem a bússola dele; economia do jogador (Economia).
- Entrega: preço e oferta do mundo (Economia); papéis na mesa (Máquina pública, Política); reputação e segurança externa (índices).

**Referências:** FMI, Banco Mundial, SIPRI, ONU Comtrade, V-Dem, V-Party, Global Party Survey, CHES. Jogo de referência para país com IA: **ESTUDAR**.

**No motor hoje:** ✅ R15.1 potências com bússola, peso e relações (inventadas, falta trocar pelos 30 reais). ☐ R15.7 países reais. ☐ R15.8 país leve. ☐ R15.10 governos que já existiram. Passo 13 da ordem de construir. O `mundo.md` ainda descreve as potências inventadas até o passo 13 trocá-las. A potência que muda de posição sozinha ficou fora da primeira versão do motor (02/nov); o GDD (12/nov) é a meta e o motor está atrás.

**Em aberto:** o jeito de cada país (pragmático, ideológico, agressivo) hoje é palpite na aba Países; conferir por busca rápida na hora de calibrar.

### 7.2 A IA dos países e o cardápio

**O que é:** o jeito como os países leves decidem o que fazer entre si e com o jogador.

**O jogador:** recebe como papel na mesa o que toca nele (proposta, ou aviso com 1 turno para reagir).

**Peças:**
- IA em 3 passos por turno: lê, decide, age.
- Cardápio: comércio, dinheiro, segurança, palavra.
- Linhas vermelhas.
- Jeito do país.

**Regras (12/nov):**
- Lê (distância na bússola, comércio, o que cada país fez com ele), decide no mesmo cardápio do jogador e age.
- Comércio: acordo, tarifa, sanção num produto. Dinheiro: investe, empresta barato, ajuda; ou tira o capital e corta o crédito. Segurança: aliança, pede base; rival e, no fim, ataque, só país forte contra inimigo de defesa fraca. Palavra: visita, apoio ou crítica em público, chamar o embaixador.
- Linhas vermelhas mexem forte e rápido: virar ditadura (para os democráticos), atacar ou sancionar aliado dele, calote, pegar empresa dele sem pagar, fugir das inspeções nucleares.
- Jeito: pragmático (pesa comércio), ideológico (pesa bússola) ou agressivo (pesa força); o mesmo ato irrita um e quase não mexe no outro.
- Um degrau por vez, com aviso: nada vai de amigo a sanção num turno.
- Guerra ou sanção entre dois países leves mexe nos preços do mercado do jogador.
- Financiamento: outros países podem pagar organizações por interesse; todo pagamento deixa rastro.

**Ligações:**
- Recebe: bússola e governo do país jogado (Máquina pública); comércio (Economia).
- Entrega: papéis na mesa; preços (Economia).

**Referências:** nenhuma citada. **ESTUDAR** (IA diplomática em jogos de estratégia).

**No motor hoje:** ◐ R15.3 a opinião das potências anda; falta o cardápio. ☐ R15.9 IA em 3 passos. Teste esperado: virar ditadura derruba a opinião dos democráticos em um turno; nada vai de amigo a sanção num turno só.

**Em aberto:** nenhum além do que está em 7.1 (países que mudam por dentro).

### 7.3 Opinião, relação e reputação

**O que é:** o quanto cada país gosta de cada outro. Vira a relação que a tela mostra e a reputação internacional do jogador.

**O jogador:** vê cada país como inimigo, rival, neutro, amigo ou aliado; aproximar-se de A faz os rivais de A desconfiarem dele.

**Peças:**
- Opinião de cada país sobre cada outro.
- Relação (faixas da opinião).
- Reputação internacional.
- Opinião da potência sobre o país jogado, pela bússola.

**Regras:**
- A meta é a do GDD (12/nov): opinião de −100 a +100 entre todos os países; anda com a distância na bússola, o comércio e o que um fez com o outro. Vira a relação.
- Reputação internacional = média das opiniões sobre você, pesada pelo tamanho de cada país. O `peso` declarado de cada potência no motor é tratado como o mesmo que o tamanho.
- As leis deixam de mexer direto na reputação; a bússola faz o trabalho.

**Ligações:**
- Recebe: leis (Máquina pública) pela bússola; comércio (Economia).
- Entrega: reputação internacional e segurança externa (índices); opinião de potência sobre ditadura (Política).

**Referências:** a curva da opinião é decisão do autor de 01/nov, sem estudo citado. **ESTUDAR**.

**No motor hoje (o motor está atrás do GDD):**
- ✅ R15.2 reputação e segurança externa. ◐ R15.3. ☐ R15.12 tela do Mundo com ranking e ficha. O mapa mostra as potências e a opinião de cada uma (02/nov).
- Posição do país na bússola = média das leis vigentes, eixo por eixo; todas as leis valem igual (01/nov e 02/nov).
- Opinião desejada = 100 × (1 − f²), com f = distância ÷ 2√2. Curva, não reta (01/nov).
- Opinião de 0 a 100 por potência, só pela bússola do país jogado; a cada turno anda 10% da distância até a desejada; separada da opinião dos pops. Relação entre potências de −1 a +1, igual nos dois lados.
- Reputação = média das opiniões das potências, pesada pelo `peso` (soma 1). O índice que a recebe é declarado em `potencias.json`.
- O validador recusa potência sem posição, peso fora de 0 a 1, relação faltando ou diferente nos dois lados.

**Em aberto:**
- A escala da opinião do motor fica como está até virar −100 a +100; hoje as potências não chegam a odiar o país porque faltam leis nas pontas; testar de novo com mais leis.
- A curva 100 × (1 − f²) continua na escala nova?
- Se o `peso` declarado não for igual ao tamanho do país, qual dos dois pesa na reputação?

### 7.4 Comércio e preços de fora

**O que é:** o mercado do mundo, que fornece o que falta ao país e compra o que sobra, com preço próprio que o país não controla.

**O jogador:** vê no mercado do mundo o que está em alta ou em baixa e quem vende mais barato; sente a sanção ou a guerra de fora no preço do mercado dele.

**Peças:**
- Dois mercados: o do país e o do mundo, com ciclos e choques de preço.
- Cobertura por produto, do país e de cada potência.
- Preço do mundo por produto.
- Ciclo e choque.
- Leis de comércio exterior: Tarifa de importação, Facilitação aduaneira, Zonas francas, Imposto e Subsídio à exportação, Defesa comercial, Controle de exportação, Venda de armas ao exterior, Triagem de compra estrangeira, Remessa de lucro e Fábrica estrangeira.
- Câmbio: valor da moeda contra o mundo.

**Regras:**
- Importa o que falta e exporta o que sobra, pelas tarifas, subsídios e acordos (leis).
- Produto que falta vem do mercado do mundo ou fica faltando; nunca aparece do nada. A sobra é vendida a alguém ou fica parada. (14/nov)
- Preço do mundo: alvo = 100 × (demanda ÷ oferta)^1,5, entre 40 e 250; anda 25% do caminho por turno, mais ruído de ±2% que depende só do turno e do produto. (02/nov)
- Ciclo: a demanda do mundo ondula igual para todos, fator = 1 + 8% × sen(2π × turno ÷ 24), ou seja, 4 anos. (02/nov)
- Choque: a cada turno, cada produto sem choque tem 2% de chance; fator de 1,3 a 1,8 (ou o inverso); some 40% por turno; termina abaixo de 2%. Sorteio por turno e produto, não gasta o acaso da partida. (02/nov)
- Ciclo e crise de verdade (14/nov): vêm quando o mundo tiver países funcionando. Complementam o ciclo de 4 anos e os choques de preço que já existem; não os trocam. O Victoria 3 não tem ciclo e crise, e o SisGov vai ter.
- Sanção passa pelo mercado: se o país que sanciona é o maior produtor de um produto, ele fica caro no mercado do jogador; quanto mais depende, mais dói.
- A tarifa recai quase toda sobre quem compra; abrir o comércio sobe a produtividade com ganhadores e perdedores.
- Nenhuma lei dá lucro a um produto; leis mexem em demanda e custo. (08/nov)
- O mercado do mundo ainda lê as potências como fornecedoras; a dependência de uma potência é a média do que o país compra dela.

**Ligações:**
- Recebe: leis de comércio (Máquina pública); sanções e guerra entre países leves (Mundo).
- Entrega: preço e falta de produto (Economia); fome (Sociedade); câmbio e dívida externa (Economia).

**Referências:** Victoria 3, só como ideia, e o documento `mercado-vic3-referencia.md`.

**No motor hoje:** ✅ preço do mundo, ciclo e choque por produto (fatia 5a, 02/nov). ◐ R16.4 tarifa, subsídio e acordo pela metade. ☐ R15.4 sanção pelo mercado. Ciclo e crise de verdade: ☐.

**Em aberto:** régua por setor no comércio exterior; sanção que passa pelo mercado.

### 7.5 Posições por país, atos, sanções e aliança

**O que é:** o menu que abre ao clicar num país. O jogador decide o nível de cada relação só para aquele país. Não são leis.

**O jogador:** aproxima-se ou afasta-se de um país; cada ação muda a opinião dele e a dos aliados e rivais dele.

**Peças:**
- Posições por país: relações diplomáticas, acordo comercial, aliança militar, base estrangeira, sanções, operações no exterior, extradição e polícia, ajuda dada, ajuda condicionada aceita e proteção ao investidor.
- Leis do país todo: Verba da diplomacia, Tribunal internacional, Inspeções nucleares, Aprovação de tratados (presidente, Congresso ou referendo) e Alcance das sanções.
- Atos do presidente com países: visita de Estado, receber o líder, apoiar ou criticar em público, mediar conflito entre dois países.

**Regras:**
- Posição por país: nível decidido no menu do país que fica valendo, como Sanções e Aliança. (08/nov)
- Ato acontece uma vez (visita de Estado é exemplo). (08/nov)
- As opções do menu de país ou companhia são decisões (Ato ou Operação), e as leis as controlam (Alcance das sanções, Aprovação de tratados, Indenização, Autorização para estatizar e vender). (08/nov)
- Sanção ou alinhamento: aproximar-se de A faz os rivais de A desconfiarem.
- Acordo de pesca é Posição por país.
- Ditadura que funciona custa caro: sanções, investimento de fora caindo, gente estudada indo embora. (12/nov)
- Investigação de financiamento estrangeiro de organização pode gerar sanção e escândalo.

**Ligações:**
- Recebe: leis de diplomacia (Máquina pública); dinheiro e verba (Economia).
- Entrega: opinião dos países, reputação e segurança externa (índices); preços (Economia).

**Referências:** nenhuma citada para o menu. **ESTUDAR** (diplomacia em jogos de estratégia).

**No motor hoje:** ◐ R7.16 tipos de lei: Lei com prazo e Ato feitos; Posição por país falta (☐ R15.11, posições por país no menu do país). ☐ R15.4 sanção pelo mercado.

**Em aberto:** custo e duração dos atos com países ficam para as narrativas (ver 9.4).

### 7.6 Segurança externa, ataque e guerra fora do jogo

**O que é:** o quanto o país está seguro de fora. Cai quando país forte não gosta dele. O país pode ser atacado, mas não revida nem começa guerra.

**O jogador:** vê a segurança cair se o mundo o desgosta; sofre ataque com custo em economia, vidas e aprovação; defende-se pelas leis militares.

**Peças:**
- Segurança externa e poder defensivo.
- Ataque externo.
- Guerra entre países leves, só como efeito nos preços.

**Regras:**
- Segurança externa = poder defensivo − (100 − reputação), travada em 0 a 100. Sem limiar: quanto pior a opinião, maior a perda. (02/nov)
- Os dois índices são declarados em `potencias.json` (opcionais); o motor não sabe os nomes. Calculada na etapa do mundo, no turno 0 também.
- Um ataque cobra economia, vidas e aprovação; a defesa vem das leis militares.
- Guerra iniciada pelo país está fora do jogo pronto (decidido).
- Ataque entre países: só país forte contra inimigo de defesa fraca, no fim da escada de segurança.
- Guerra civil (dentro do país) vem de grupos grandes com raiva e armas divididas. (12/nov)
- Crise com força do governo baixa traz golpe ou guerra civil nos países leves.
- Vírus para fins militares: decidir na Defesa se vira lei ou degrau. (09/nov)

**Ligações:**
- Recebe: reputação (Mundo); leis militares (Máquina pública); demanda por tamanho das forças (Economia).
- Entrega: economia, vidas e aprovação (Economia, Sociedade, Política).

**Referências:** SIPRI para poder militar. Mais: **ESTUDAR**.

**No motor hoje:** ◐ segurança externa feita; o ataque em si "fica para depois". ☐ R15.5 ataque externo sem revide.

**Em aberto:** como um ataque acontece e como termina.

---

---

## Parte 8. Tela

A tela é "em volta" das três grandes mecânicas (Sociedade, Economia e Máquina pública). Ela só lê o jogo e chama a partida; não calcula. Legenda do motor e da tela: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`.

---

### 8.1 Mapa

**O que é.** O mapa é a tela onde o jogador propõe leis e vê o país como está: bolhas soltas, puxadas por uma hierarquia por baixo. É um mapa orgânico, organizado só pela hierarquia (13/nov). As 8 áreas antigas saem (13/nov), e com elas saem o desenho em três anéis por área (30/out), as artes por área e as bolhas por área.

**O jogador**
- Lê o país no mapa: bolhas de leis e índices crescendo e encolhendo, grupos satisfeitos ou não, mídias, países, manchetes.
- Decisão de governo é uma bolha de lei no mapa, nunca um painel de gestão. Telas de leitura são aceitas; a decisão fica na lei.
- Lei assinada aparece e muda no mapa como bolha.
- Pronto quando (30/out): passando o mouse numa lei dá para seguir lei, índice e grupo sem procurar, e nenhuma bolha nem rótulo se sobrepõe.

**Peças.** Do centro para fora:
- **Miolo, os Três Poderes em camadas.** O Executivo é a trindade do partido (presidente do partido, presidente eleito e vice, na cor do partido, sigla no meio). Os juízes ficam em volta dela, e são juízes de verdade por tribunal (14/nov). O Congresso é um anel de cadeiras por fora, Câmara em cima e Senado embaixo, voltadas para dentro.
- **Anel de ministros**, com rosto, cada um com uma fatia pelo que cuida. Sob cada um, as **instituições** (escudo). Das instituições saem as **leis**, em pétalas para fora.
- **Índices** presos ao ministro responsável; **grupos** num anel de fora; **potências** mais longe.
- **Escudo da instituição:** frase curta ("12 na fila · 2 na sua mesa") e cor do rendimento (verde rende, amarelo falta verba, vermelho sobra e vira corrupção).
- **Leis não promulgadas** ficam fora do mapa, num botão no canto, com a folha para promulgar.
- **Prioridade visual:** Ministro > Instituição > Índice > Lei. Ministros e instituições sempre com nome e destaque; a lei aparece pequena e recuada.
- **Visões** (filtros "Ligações", "Nível", "Dinheiro", "Popularidade"): pesam as bolhas dentro do degrau de cada uma, sem passar para o de cima.
- **Fios:** hierarquia em ouro; efeito verde (melhora) e vermelho (piora), que só correm com a bolha em foco. Bolha sem ligação nenhuma tem anel tracejado.
- **Alerta do índice:** a cor do anel diz o nível (crítico a bom); a seta diz se subiu ou desceu.
- **Barra do topo:** caixa, dívida, PIB, apoio, eleição e passar o turno.
- **Navegação:** busca, enquadrar, miniatura, pinça, roda, setas e teclado.
- **Painel Atrapalham / Ajudam** de ministro, instituição e índice.
- **Trocar ministro pelo mapa:** o painel do ministério clicado traz a troca e o preço dela.
- **O que a bolha escreve em cada setor** (a bolha mostra, o painel não manda): Construção civil abre as duas filas de obras; o cartão da obra diz o motivo do atraso e acende as bolhas das leis que resolvem; Cultura mostra "12 na fila · 2 na sua mesa · 9 bens em risco"; Defesa civil mostra selo verde, amarelo ou vermelho, o Preparo e os últimos 3 desastres; lei de verba mostra o cadeado do gasto travado; compra de cotas mostra ritmo, custo e se a meta será batida; a bolha da lei mostra o placar previsto do Congresso.
- **Mapa elétrico (não é mapa político):** a tela mostra a rede de energia, com os estados ligados por linhas, verde quando sobra e vermelho quando falta.
- **Tela do Congresso:** sem painel, tudo no mapa: anel de cadeiras, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha do quórum, "até aqui passa" na régua.
- **Grupo que pulsa vermelho** no mapa quando a raiva sobe, e sai manchete.

**Regras**
- Mapa orgânico, hierarquia por baixo (13/nov).
- As 8 áreas antigas saem; o mapa se organiza só pela hierarquia (13/nov). A "bolinha da esfera" vira a instituição (13/nov).
- Prioridade visual e filtros (13/nov).
- Só as leis promulgadas ficam no mapa (13/nov).
- Seta de tendência (13/nov): compara com 8 meses atrás (4 turnos) e aparece a partir de 2 pontos de saúde, porque o índice anda devagar e um turno só não mostrava nada.
- Índice preso ao ministro (13/nov): ao que leva a maior parte das leis ligadas a ele.
- Visível e invisível (07/nov): o visível aparece na tela; o invisível só se sente pelo que acontece (greve, surto, notícia).
- Congresso como anel de cadeiras, uma por deputado na cor do partido (11/nov).
- Linhas só no foco (30/out): sem foco, nenhuma ligação aparece. Com o mouse numa lei acende lei, índices, grupos; num índice, as leis que o mexem e os grupos; num grupo, os índices dele. Bate com a regra de 13/nov dos fios que só correm com a bolha em foco.
- Nível de detalhe pelo zoom (30/out; só consta nesta fonte, nenhuma fonte nova diz o contrário): de longe, ponto colorido; de perto, ficha com nome.
- Mapa em tela, direção (30/out): funções de posição puras e testadas; o motor não lê posição.
- Desempenho: fios no canvas, câmera no `viewBox`, cerca de 1 ms de JS por quadro parado; a tecla F mede os quadros.

**Ligações**
- **Sociedade:** grupos no anel de fora; grupo pulsa vermelho quando a raiva sobe; a ficha do grupo mostra uma seta para onde ele vai na bússola e qual mídia o empurra.
- **Economia:** índices presos aos ministros; cadeado nas bolhas de lei de verba; mapa elétrico; filas de obras.
- **Leis:** só as promulgadas ficam no mapa, em pétalas das instituições.
- **Política:** trindade e Congresso no miolo; placar previsto na bolha da lei.
- **Judiciário:** juízes no miolo coloridos pelo lado; passar o mouse mostra a fila ("320 processos · 2 seus"); Justiça e prisões é um escudo sob o ministro.

**Referências.** O estilo da tela cita Victoria 3, Suzerain, Papers Please e Frostpunk só como referência estética. Para o mapa em si (bolhas sobre hierarquia): **ESTUDAR**.

**No motor hoje**
- ✅ R17.1 mapa orgânico.
- ✅ R17.12 mapa por ministério e instituição, sem as 8 áreas.
- ◐ R17.16 Três Poderes no miolo; juízes de verdade por tribunal desde 14/nov; em aberto se cada instituição e lei responde a um poder.
- ✅ R17.17 prioridade visual e visões; Popularidade sem dado, porque o motor não calcula popularidade por lei.
- ✅ R17.18 alerta do índice.
- ✅ R17.19 leis promulgadas.
- ✅ R17.20 Atrapalham / Ajudam.
- ✅ R17.21 barra do topo.
- ✅ R17.22 navegação.
- ✅ R17.24 trocar ministro pelo mapa.
- ✅ Mapa 18.1: miolo com trindade, STF e TSE, Congresso; índices do país num anel por fora (14/nov).
- Código: `src/tela/mapa/` (organico.ts com `d3-force`, BolhaDoMapa, MapaOrganico, fundo em canvas).
- ☐ Tirar do código o campo `area` dos índices, que ainda serve para achar o ministro quando nenhuma lei liga neles.

**Em aberto**
- Se cada instituição e cada lei responde a um dos poderes.
- Como cabem no mapa, sem virar painel: lista de companhias, tela do Mundo e mapa elétrico.
- A lei de Tipos (Lei com prazo, Ato, Posição por país, Operação) precisa de um jeito de aparecer: bolha com relógio, botão, menu do país, lista de companhias (R7.16 ◐: Lei com prazo e Ato feitos; Posição por país e Operação faltam).

---

### 8.2 Mesa (assinar e carimbar)

**O que é.** A mesa é onde chegam os papéis que pedem o presidente: o que os outros põem na frente do jogador.

**O jogador**
- Despacha a pilha de papéis do turno, um a um, com carimbo. Há a mesa do presidente (governo) e a mesa do partido.
- Despachar a mesa é o passo 3 do turno: assina, veta, recusa, encaminha ou deixa na pilha.
- **O Congresso usa a mesa como arma:** a oposição com votos aprova leis em lote, longe da bússola do jogador. Ele veta uma a uma (cada veto irrita quem aprovou e vira manchete) ou deixa passar o que não dá tempo de ler.
- Papel novo importante abre a mesa sozinho e o botão pulsa (vaga de juiz).
- Papel duvidoso chega disfarçado mas visível: o texto parece normal e traz pistas (preço acima do comum, intermediário, pressa, "apoio à campanha"). Só a música e o som mudam.
- O papel de calamidade "tem povo": o que houve; quem sofre, com nome e voz; o que fazer, com as opções na primeira tela. O mesmo texto sai como notícia.

**Peças**
- **Carimbos:** Assinar, Vetar (só lei), Recusar, Encaminhar ao ministro, ou deixar na pilha.
- **Papéis do presidente:** lei aprovada pelo Congresso; situações (enchente, greve, empresa quebrando, acordo de país); pedidos (aliado, ministro, governador).
- **Papéis do partido:** doador, político que quer se filiar, deputado que votou contra (expulsar ou perdoar), aliado propõe coligação.
- **Famílias de papel** (sem lista papel por papel; o conteúdo sai dos números do momento): Leis, Crises, Pedidos, Ofertas, Instituições, Partido, Duvidosos.
- **Papéis novos do Congresso:** emenda, partido ameaça sair, promessa com prazo, veto derrubado, CPI aberta, aviso do presidente da casa.
- **Aviso:** só informa e some no turno seguinte (lei aprovada, decreto, veto derrubado, veto mantido).
- **Veto com observação:** o presidente veta e diz o valor que assinaria. O Congresso escolhe: derrubar o veto (quórum da aba Derrubar veto), aceitar a observação (maioria simples, sem voltar à mesa) ou nada (a lei cai). Em lei com abas, a observação pode ser só numa parte.
- **Encaminhar ao ministro** é conforto, não obrigação: o ministro decide pela ficha. Competente acerta mais, desleal decide a favor dele, desonesto assina o que rende propina.
- **Papéis duvidosos** (porta da corrupção): ganho é dinheiro de campanha, voto do aliado e termômetro; custo é a corrupção do órgão e o rastro, que pode ser descoberto a cada turno (regra da mentira descoberta). Recusar irrita quem pediu; denunciar sobe a aprovação e faz inimigo. O dinheiro vai ao bolso de alguém e deixa rastro (14/nov).
- **Arte da mesa:** pilha física de papéis com carimbos *Sancionar*, *Vetar com Observação*, *Encaminhar*.

**Regras**
- Silêncio: lei ignorada até o prazo vira lei sozinha ou cai, conforme a regra do país (sanção tácita ou veto tácito).
- Sem limite de papéis (11/nov): o freio é do mundo; cada papel tem prazo e ignorar tem consequência.
- Prazos (11/nov, de partida, calibrar no fim): lei aprovada e emenda 1 turno; situação urgente 1 turno (piora, vira crise e manchete); situação calma 3 turnos; pedido de aliado 2 turnos; partido ameaça sair 1 turno; promessa até 4 turnos; papel do partido 2 turnos.
- Famílias sem roteiro (11/nov): todo papel nasce do estado do país e das fichas (princípios 8 e 12).
- Veto com observação (11/nov).
- Papéis duvidosos (11/nov).
- Ignorar tem consequência, conforme o papel: lei passa, situação piora, aliado ignorado se afasta, doador vai para outro partido.
- A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete.
- Papel não tem texto guardado: a tela escreve o conteúdo a partir da lei e do valor (R17.7). A mesa é refeita no fim de cada turno.
- Pedido do jogador: `{ tipo: "carimbar", papel, carimbo: "assinar" | "vetar", observacao? }`; papel que não está na mesa ou que é só aviso dá erro.
- Fatos: o carimbo vira `papel-assinado` ou `papel-vetado`; ignorar vira `papel-ignorado`.
- O veto vale para toda lei (regra do GDD; o código hoje só vê a lei emendada).

**Ligações**
- **Sociedade:** quem pediu fica chateado ao recusar; denunciar sobe a aprovação; aliado ignorado se afasta; manchete por veto popular.
- **Economia:** situação vira gasto, lei proposta ou efeito direto ao assinar; crise de enchente ou apagão sai dos dados do país.
- **Leis:** assinar vira lei; vetar devolve ao Congresso.
- **Política:** instituição manda caso disputado e vistoria; partido manda doador e filiação; governadores pedem obra.
- **Corrupção:** papel duvidoso deixa rastro, que pode virar escândalo, CPI e fato do impeachment.

**Referências.** *Papers, Please* é referência estética do jogo; não há fonte dizendo o que se copia dele na mesa: **ESTUDAR**. Sobre pilha de papéis e carimbo como jogo (ritmo, quantos por turno, como o jogador sente): **ESTUDAR**.

**No motor hoje**
- ◐ R17.6 carimbos: feitos assinar e vetar com observação na janela Mesa; faltam recusar, encaminhar e pilha.
- ◐ R17.7 famílias de papel: só a família Leis (e a vaga de juiz). Faltam crises, pedidos, ofertas, instituições, partido.
- ◐ R17.13 prazos: papel de lei vale 1 turno; falta crise que piora e aliado que se afasta.
- ☐ R17.14 papéis duvidosos com rastro.
- ☐ R17.8 encaminhar ao ministro.
- ☐ R17.9 a mídia lê a mesa.
- ☐ R17.10 mesa do partido.
- ✅ Papel importante abre a mesa sozinho e o botão pulsa (14/nov).
- Tela: `MesaDePapeis.tsx`; o botão Mesa fica ao lado de Passar o turno.

**Em aberto**
- Situações (crises): saem dos dados; duas ou três respostas com ganho e custo. A pensar: como cada setor desenha os seus papéis.
- Como os pedidos de governadores entram na mesa (R6.23 ☐).
- Os prazos são "de partida, calibrar no fim".

---

### 8.3 Janelas (Mercado, Governo, Programas, Eleição, Mesa e outras)

**O que é.** Telas por cima do mapa que o jogador abre para ler ou decidir algo que não cabe numa bolha.

**O jogador**
- Abre pela peça do mapa onde aquilo mora: o clique na trindade abre o Governo, os medidores de apoio e eleição abrem a Eleição, o do PIB abre o Mercado.
- A folha da lei abre no mapa; antes de assinar mostra "a conta que vem".
- A janela da lei mostra o placar previsto da votação.

**Peças** (onde cada janela mora, R17.23, 13/nov)
- **Menu no brasão:** Salvar, Carregar, Recomeçar.
- **Governo:** pelo clique na trindade.
- **Eleição:** pelos medidores de apoio e eleição; mostra a Aprovação (satisfação média dos pops, pesada pelo tamanho).
- **Mercado:** pelo medidor do PIB.
- **Mesa:** botão ao lado de Passar o turno.
- **Programas:** botão ao lado de Leis não promulgadas. Antes de uma lei desfazer um programa, a tela avisa.
- **Pregão** (minigame da bolsa; protótipo sem motor) fica escondido.
- **Tela do Mundo:** ranking por PIB com a relação de cada país com você (inimigo, rival, neutro, amigo, aliado); clicar num país abre a ficha (dados, relação, o que está em vigor: tratados, sanções, bases, ajuda) e as formas de se aproximar ou se afastar.
- **Lista de companhias** (operações das estatais como papéis na mesa).
- **Menu do país e da companhia:** o que aparece ao clicar num país ou numa companhia é decisão do presidente (Ato ou Operação), não lei.
- **Telas dos Programas:** bolha do programa no mapa, com as leis que faltam.

**Regras**
- Onde moram as janelas (13/nov): a lista acima (R17.23). A frase antiga "nada as abre" está superada.
- Decisão do presidente aparece ao clicar num país ou companhia (08/nov).
- Lei x decisão (08/nov): isso evita o mapa encher de bolhas e a decisão do dia a dia se perder.
- Sem painel de gestão: o jogo tem janelas de leitura e escolha, mas decisão de governo continua sendo bolha de lei.

**Ligações**
- **Sociedade:** a Eleição mostra a Aprovação.
- **Economia:** Mercado e bolsa (preço, lucro, bolsa).
- **Leis:** Programas, folha da lei, não promulgadas.
- **Política:** Governo (régua e caixas de ministérios), Eleição, Mesa.

**Referências.** Para o desenho de cada janela (Mercado, Mundo, lista de companhias): **ESTUDAR**. O Victoria 3 serve de referência do mercado, não da tela.

**No motor hoje**
- ✅ R17.23 as janelas já têm casa (conferir na tela).
- Código: `Governo.tsx`, `Eleicao.tsx`, `Mercado.tsx`, `MesaDePapeis.tsx`, `Pregao.tsx`, `NaoPromulgadas.tsx`, `DocumentoLei.tsx`.
- ◐ R16.15 Pregão: protótipo na tela.
- ☐ R15.12 Tela do Mundo: ranking com a relação e a ficha do país.

**Em aberto**
- Como lista de companhias, tela do Mundo e mapa elétrico cabem sem virar painel.

---

### 8.4 O comum às duas telas

**O que é.** O que mapa e mesa dividem: fichas das pessoas, momentos curtos do partido, manchetes, votação, passar o turno, causa e efeito.

**O jogador**
- Abre a ficha de uma pessoa por cima do mapa.
- Vê as escolhas do partido (ministério, chapa, coligação, campanha) como telas curtas, não painéis.
- Lê as manchetes do turno e passa o turno.
- Entende o porquê: "o corte na saúde de dois anos atrás virou fila agora"; nunca parece azar.
- Vê o país mudar sem placar: PIB, empresas, empregos, riqueza das pessoas.
- Ao propor uma lei vê antes quem ganha e quem perde.
- A lei diz "efeito em N turnos", para o jogador planejar e não achar que ela falhou. O atraso zero significa que o efeito vem no turno seguinte.

**Peças**
- **Fichas** de pessoas (presidente, vice, ministros, líderes): retrato genérico, atributos, posição na bússola.
- **Atributos do ministro:** competência, habilidade política, carisma, honestidade, lealdade, bússola e origem.
- **Ficha só de leitura da instituição:** ministro, verba × necessidade numa barra, corrupção interna, fila e leis que mexem nela.
- **Rede da pessoa:** perfil de rede social gerado da ficha (o que posta, onde vai, o que diz sobre os temas do país), sem rótulo de esquerda ou direita; "Informações pessoais descobertas" cresce com a inteligência; botão Espiar fica num registro que pode vazar.
- **Momentos do partido:** montar ministério, chapa, coligação, campanha.
- **Causa e efeito (12/nov):** a bolha do índice mostra "o que empurra" (leis e índices que mexem nele, com seta, força e turnos até chegar); a bolha da lei, antes de assinar, mostra "a conta que vem" (o que cada índice deve fazer em 1 e em 4 anos); o gráfico do índice marca o turno em que cada lei foi assinada.
- **Promessa de campanha** fica na tela até a eleição.
- **Dinheiro na moeda do país.**
- **Manchetes do turno** e Resultado do turno (fatos como manchete).
- **Votação, passar o turno, resultado do turno.**

**Regras**
- Texto da tela sai dos números da lei: texto e motor nunca discordam.
- Texto para leigo: lei e opção com exemplo do dia a dia, sem jargão.
- Sem cortar a escolha: texto simples, mas sem tirar a régua numérica; o jogador é criativo, testa extremos e gosta de números, mesmo os que não aparecem.
- Nome da lei: palavras de todo dia, "o que + de quem/sobre o quê"; sigla e nome técnico nunca no nome; o nome real do país pode aparecer embaixo, menor.
- Nada diz "esta pessoa é de tal lado": o jogador deduz.
- Retratos genéricos para pessoas e empresas (autor, 08/nov); nenhuma pessoa, empresa ou direito autoral real.
- A tela não calcula: só lê a visão da partida e manda pedidos.
- A narrativa vem depois dos dados; a tela escreve a partir dos números.
- Nada neutro (princípio 7): toda escolha mexe em algo visível.

**Ligações**
- **Sociedade:** a ficha do grupo mostra a seta de bússola e a mídia que empurra. Os números de gosto aparecem divididos por parte ao passar o mouse (ver 8.8).
- **Economia:** "conta que vem" da lei, "o que empurra" do índice.
- **Leis:** prévia de quem ganha e perde antes de propor; programa avisa antes de desfazer.
- **Política:** fichas de pessoas, placar previsto, termômetro dos partidos; ao passar o dedo, o partido mostra os dois motivos que mais pesam no voto dele.

**Referências.** CK3 mostra cada parte do gosto com o seu número ao passar o mouse. Para fichas de pessoas por cima de mapa e perfil de rede social: **ESTUDAR**.

**No motor hoje**
- ✅ R17.2 votação, passar o turno, resultado do turno.
- ◐ R17.4 fichas por cima do mapa: retrato feito; atributos faltam.
- ◐ R6.1 retratos genéricos (feitos, provisórios: o autor não gostou); ficha com atributos falta.
- ◐ R17.5 prévia de quem ganha e perde antes de propor.
- ◐ R17.15 causa e efeito: feitos os fios de efeito e o painel Atrapalham / Ajudam; faltam a conta que vem e o gráfico.
- ☐ R17.11 momentos do partido como telas curtas (chapa, coligação, campanha). O começo da partida já tem telas de chapa, governo e ministros (ver 8.5).
- A seta de tendência já existe na tela; o voto ainda não a usa.

**Em aberto**
- Retratos: o autor não gostou dos genéricos.
- Opinião: como o jogador vê a opinião de cada ator sem virar painel.
- Como mostrar o bolso de um pop virando gosto do grupo sem virar painel.
- A mídia age em cima dos fatos que já existem (é lente, não fonte nova). Ela lê e escreve na mesa (R17.9 ☐); o jornal só mostra manchetes, nenhuma notícia mexe em grupo, voto ou aprovação (13/nov, corrigir quando fizermos mídia). ESTUDAR como a mídia mexe em cada uma das 3 mecânicas.

---

### 8.5 Tela inicial e começo da partida em passos

**O que é.** A sequência de telas curtas antes do mandato: país, partido, chapa, governo, ministros, iniciar. O menu de início é em telas curtas; o turno mostra os fatos como manchetes.

**O jogador**
- Escolhe o país (reais ou declarados, cada um com economia, Congresso, partidos, mídias e grupos próprios).
- Cria o partido: nome e sigla. Não escolhe lado, posição nem bússola.
- Monta a chapa: três vagas (presidente do partido, candidato, vice). Clicar numa vaga abre a lista de pessoas de todos os partidos (assim nascem as coligações); clicar numa pessoa abre o perfil dela. A chapa já venceu.
- Monta o governo: primeiro o tamanho, numa régua (Enxuto, Clássico, Do país, Inchado); se quiser, arrasta instituições entre os ministérios.
- Escolhe ministros: o jogo sorteia pela chapa e cada cadeira pode ser trocada por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista.
- Inicia o jogo e governa.
- Entra com uma história: "no meio de uma polarização, você surge como a salvação do país". Partido novo, poucas cadeiras, presidente popular, Aprovação alta.
- Descobre o lado do próprio governo pelas consequências, não por um rótulo.

**Peças**
- **País:** `EtapaPais`. **Partido:** `EtapaPartido`. **Chapa:** `EtapaChapa` e `ListaDePessoas`. **Governo:** `EtapaGoverno`. **Ministros:** `EtapaMinisterios`. **Iniciar:** `EtapaIniciar`.
- **Governo:** régua de tamanhos; "Ajustar caixas" abre a mesa onde o jogador arrasta as instituições (escudos) entre os ministérios, cria e tira ministério; a bandeja é a caixa da sobra. Mostra só efeitos que o motor tem: ministro mais carregado, o que fica sem ministério próprio, cadeiras sem pasta.
- **Ministros:** uma cadeira por caixa, com retrato e quanto o ministro rende ali.
- **Histórico do país:** cada país declara dados históricos; o resto os geradores criam.

**Regras**
- Partido nasce sem lado (12/nov); o lado sai da chapa: média da bússola da chapa, 5 grupos que ele defende (R4.8).
- A sigla vira o id e não pode repetir a de outro partido (12/nov).
- O país começa como está; o partido que governava vira oposição (12/nov). No começo, o jogador pode pôr o antigo governo na coligação.
- Governo em régua e caixas (13/nov).
- Estilo da tela de início: o da Art Bible (13/nov).
- Tela de abertura (Art Bible): a mesa do governante vista de cima; navegação física (fichas, dossiês com fotos presas, carimbo SISGOV); botão principal em placa de ferro fundido rebitada com tipografia em latão.
- Tela de carregamento (Art Bible): vista monumental da capital; indicador de progresso mecânico (bússola de Estado ou fita de telex); doutrinas de governo datilografadas.

**Ligações**
- **Sociedade:** a chapa define a base de grupos e a bússola do partido.
- **Economia:** o país traz economia própria; a Aprovação começa alta.
- **Leis:** o país declara as leis em vigor.
- **Política:** a chapa dá coligação; o antigo governo vai à oposição ou à coligação; ministros dão cadeiras do Congresso.

**Referências.** Para telas de começo de partida em jogo de estratégia política: **ESTUDAR**. A Art Bible cita Suzerain e Papers Please como estética.

**No motor hoje**
- ✅ R4.5 criar partido.
- ✅ R4.6 chapa entre pessoas de todos os partidos.
- ✅ R4.8 lado sai da chapa.
- ◐ R4.9 partido novo com 6% das cadeiras e antigo governo na oposição ou coligação; falta a Aprovação começar alta.
- ✅ R4.10 tela de início em sequência (13/nov, no estilo da Art Bible).
- Governo: régua e caixas; Ministros: cadeiras e cartas.

**Em aberto**
- A Aprovação começa alta: de quanto e quanto tempo dura a lua de mel.
- A história de entrada aparece como texto, tela ou só nos números.
- Outros países: só o Brasil 2026 existe; o que um país precisa declarar para ser jogável (arquivos obrigatórios).
- Placar final e fim de partida: o que a tela mostra (R4.7 ☐).

---

### 8.6 Salvar e carregar

**O que é.** Guardar a partida e voltar a ela. É caso de uso da partida, não da tela (módulo `salvar.ts`).

**O jogador.** Salva e carrega pelo menu no brasão; a partida salva sozinha a cada turno.

**Peças**
- Menu no brasão: Salvar, Carregar, Recomeçar.
- Salvar sozinho a cada turno.

**Regras**
- O menu no brasão e o salvar sozinho a cada turno valem desde 13/nov (R17.23).

**Ligações.** Guarda o estado de todas as mecânicas. A fonte não detalha o formato: **ESTUDAR** o que entra no arquivo.

**Referências.** **ESTUDAR** (nenhuma fonte cita jogo para salvar e carregar).

**No motor hoje**
- ◐ R17.3 funciona; ficou sem botão, e o menu no brasão (R17.23) deu a casa.
- ✅ Salva sozinho e tem o menu no brasão.

**Em aberto**
- Partida salva antiga quando o formato muda: hoje se perde ou se remenda no código.

---

### 8.7 Ícones e direção de arte (só o que define a tela)

**O que é.** A identidade visual do jogo: o jogador está sentado no gabinete máximo do Estado, não navegando numa página da web. Vale o `docs/arte/direcao-de-arte.md` (a Art Bible). Ela rege qualquer nova maquete, arte de personagem, textura ou componente. As artes de `public/arte/` (fundos, faixas, cenas, retratos) foram apagadas de propósito, e o `artes-de-tela.md` (22/out, "Dossiê Tropical", faixas por área) não vale mais.

**O jogador**
- Sente objetos físicos reais: pastas de arquivo pardo, documentos de papel pesado, fotos 3x4 presas, placas de ferro e latão.
- Sente som de coisas materiais: baque de carimbo, estalo metálico, papel deslizando, clique de telex.

**Peças**
- **Quatro pilares (Art Bible):** fisicalidade e peso (a mesa do poder); brutalismo institucional universal; analógico imperfeito (datilografia, carimbo de borracha com falha, caneta-tinteiro); som como textura.
- **Paleta:** papel oficial `#efe4cc` a `#dfd2b5`; tinta datilográfica `#252320`; ferro e aço `#1c1e21` a `#2c2f33`; latão e âmbar `#d4af37` a `#f0a030`; carimbo confidencial `#9e2a2b` (urgência, vetos, crises); carimbo chancelaria `#1d3557` (homologações, promulgações, quórum); concreto cívico `#303331` a `#1c1e1d`.
- **Proibido:** aspecto plastificado de IA; botão retangular simples com borda de 1px; cantos arredondados de app; gradiente neon; simetria digital perfeita (documentos têm micro-rotação de -1º a +3º); Arial, Roboto, Helvetica crus.
- **Obrigatório:** tratamento manual das artes geradas por IA (grão, bordas); texturas tangíveis; viewport fixo 16:9.
- **Telas citadas:** abertura (mesa de fundação), carregamento, Congresso e mesa de despacho (semicírculo com termômetros gravados em placas de votação analógico).
- **Ícones das esferas (30):** desenhados à mão em `scripts/icones-leis/esferas.ts`, traço de tinta com mancha clara (briefing de 12/nov).
- **Ícones das leis (512):** um ícone do game-icons.net no selo. A bolinha no pé do selo, que era da esfera, passa a ser da instituição (13/nov).
- **Ícones dos índices (147):** um ícone do game-icons.net, sem bolinha.
- **Crédito obrigatório (CC BY 3.0):** o jogo precisa citar o game-icons.net e seus autores numa tela de créditos.
- **Gerar ícones:** `npm run icones` gera os SVGs e a folha `docs/arte/folha-de-icones.html`; `npm run icones:buscar -- <palavra>` procura.
- **Imagens de tela (22/out, só as regras gerais):** sem texto, sem bandeira, marca ou pessoa real reconhecível; espaço calmo para a interface escrever em cima; JPG 2560 × 1440 (fundos e cenas); arquivo que falta não quebra, a tela usa um substituto.
- **Levantamento de 7 estilos (12/nov, agente Sonnet; a decisão é do autor):** vetor chapado, pixel, gravura, xilogravura, aquarela, cartografia antiga, colagem. Premissa: o mapa tem centenas de bolhas e muito texto pequeno; o estilo precisa de contorno claro, poucas cores por elemento e textura contida.
- **Recomendação do estudo de encaixe (12/nov):** vetor chapado como sistema, xilogravura como assinatura, cartografia só no fundo do mapa e no carregamento, colagem só na abertura; a Art Bible passa a valer como tom. Fixo, segundo o estudo: paleta da Art Bible; contorno grosso e uniforme; carimbo xilográfico em toda ação; serifa de máquina em papel e título, sans na interface. Descartados no estudo: pixel e aquarela.

**Regras**
- O estilo antigo dos ícones (néon e disco de vidro) saiu em 12/nov; está no git.
- A Art Bible rege qualquer nova maquete, arte de personagem, textura ou componente (decisão do autor, 14/nov: vale o `direcao-de-arte.md`).
- Tela de início no estilo da Art Bible (13/nov).
- Carimbo é a cara da ação: o carimbo real tem falha de pressão em um canto, tinta irregular e rotação imperfeita.
- Nada de Democracy 4 (nome, número, ligação); Victoria 3 só como ideia.
- Retratos genéricos para pessoas e empresas; nome de moeda, cargo e instituição comum pode usar; o que tem marca ganha nome alternativo parecido.
- Partidos reais: entram com nome e cor; logotipo, símbolo e marca não entram (12/nov).
- Texto de tela: sem Arial/Roboto/Helvetica crus.
- A cor de cada ministério dá a cor da lei, que clareia o tom pela instituição (13/nov). Por isso a cor por tipo de lei da proposta de 21-22/out (dourado, verde, azul, roxo) saiu, e também a medalha holográfica com aro de metal.

**Ligações.** A cor do anel do índice diz o nível. A cor do escudo da instituição diz o rendimento. Fios de efeito: verde melhora, vermelho piora. "Nada é bom ou ruim": cores e textos descrevem, não elogiam nem condenam.

**Referências.** Suzerain, Papers Please, Frostpunk, Victoria 3, brutalismo cívico. game-icons.net para os ícones.

**No motor hoje**
- Ícones: 30 esferas, 512 de leis e 147 de índices (números do briefing de 12/nov).
- ◐ R6.1 retratos genéricos provisórios.
- As artes de `public/arte/` não existem mais (apagadas de propósito); a tela usa o substituto. As novas seguem a Art Bible.

**Em aberto**
- Decisões do estudo de encaixe (12/nov) ainda sem resposta, agora sob a Art Bible: (1) refazer cerca de 270 ícones em vetor chapado; (2) Art Bible como tom ou como regra de textura; (3) abertura em colagem ou xilogravura com vetor; (4) retratos em xilogravura ou gravura; (5) uma ou duas tintas; (6) fundo cartográfico com teto de contraste de cerca de 10%.
- Selos e arco de bússola na bolha da lei (proposta de 21-22/out): nenhuma fonte nova diz se voltam; a bolha atual é a do mapa orgânico.
- Os 30 ícones das esferas foram feitos antes de a esfera virar instituição: o que a bolinha e esses ícones representam agora.

---

### 8.8 SisGovpedia (dicas em camadas)

**O que é.** A enciclopédia do jogo, aberta pelas dicas ao passar o mouse, em camadas: a frase curta, depois o porquê, depois a conta. Ideia registrada em 14/nov na seção Leis jogáveis do GDD.

**O jogador**
- Passa o mouse sobre um número que ele sente (gosto, preço, salário) e vê de onde veio.
- Passa o mouse no nome da lei e lê uma frase de leigo que diz o que muda na vida de alguém, com exemplo.
- Passa o mouse no grupo e vê cada parte do gosto com o seu número ("Operários: −6 imposto, +4 salário mínimo, −3 ideologia").
- Passa o mouse em partido indeciso e vê os dois motivos que mais pesam no voto dele.
- Passa o mouse nos juízes e vê a fila ("320 processos · 2 seus").

**Peças**
- **Camada 1:** a frase curta. **Camada 2:** o porquê. **Camada 3:** a conta.
- **Dica do número sentido:** a origem de gosto, preço, salário.
- **Dica da lei:** frase de leigo com exemplo.
- **Marcas na régua da lei (07/nov):** a régua mostra marcas calculadas pelo motor, sem virar lei nova (ex.: quanto cada aposentado recebe, "compra o mesmo que no ano passado").

**Regras**
- O porquê à vista (14/nov): todo número que o jogador sente mostra de onde veio ao passar o mouse.
- Texto para leigo, com exemplo do dia a dia, sem jargão.
- Texto e motor nunca discordam: a dica sai dos números.
- Sem lista escrita à mão de quem gosta de cada lei (veterano adivinha tudo, vira tarefa, "falta contexto").

**Ligações**
- **Sociedade:** parte do bolso, ideologia e memória, cada uma com o seu número (14/nov: Opinião = bolso + bússola + memória).
- **Economia:** preço e salário com origem.
- **Leis:** frase do nome, marcas na régua.
- **Política:** motivos do voto do partido.

**Referências.** CK3 mostra cada parte do gosto com o seu número ao passar o mouse. Democracy 4, Tropico e Stellaris aparecem só como exemplo do que evitar (lista à mão), e nada do Democracy 4 entra no projeto. Para a enciclopédia em camadas em si (como abre, como se navega entre camadas): **ESTUDAR**.

**No motor hoje.** ☐ Falta. Nenhum requisito R cobre a SisGovpedia. Já existem a fila ao passar o mouse nos juízes (desenho) e o motivo do voto do partido no desenho do Congresso (R12).

**Em aberto**
- Onde as três camadas moram (balão, painel lateral, janela) e como se navega: nenhuma fonte diz.
- Quais números têm dica e em que ordem entram.
- Como mostrar o gosto do bolso sem virar painel.
- Se a SisGovpedia ganha requisito R próprio em `requisitos.md`.

---

## Parte 9. Narrativas e eventos

### 9.1 A mesa de fatos

**O que é:** a memória curta da partida, como uma RAM. Cada módulo escreve o que aconteceu e lê o que precisa.

**O jogador:** vê os fatos como manchetes no Resultado do turno. Vê o fato que muda um placar do Congresso.

**Peças:** ficha do fato (tipo, turno, tamanho, sobre, quem, lado) e a lista de tipos.

**Regras (12/nov, R4.12):**
- Cada etapa do turno põe na mesa o que fez.
- O módulo pergunta só o que interessa (por tipo, assunto, envolvido, tamanho mínimo ou turno); ninguém percorre a lista.
- Fato gera fato: quem vem depois na ordem das etapas já lê o novo.
- Some aos poucos: pequeno 1 turno, médio 2, grande 3; a força cai a cada turno.
- A mesa é curto prazo; o que deve durar mais (rancor, promessa quebrada) o módulo guarda no próprio estado.
- Nenhum módulo chama outro; eles se encontram só na mesa.
- Tipo novo: acrescentar em `TIPOS_DE_FATO` e na tabela.
- Hoje há 31 tipos, de lei aprovada a eleição vencida, juiz nomeado, regra fiscal estourou, escândalo e grupo com raiva.

**Ligações:**
- Recebe: Congresso, Política, Mesa, Programas, Eleição, Judiciário, Contas.
- Entrega: jornal (Mídia), grupos (Sociedade) e Congresso (Política).

**Referências:** nenhuma de jogo; é arquitetura do projeto.

**No motor hoje:** ✅ R4.12. Não escrevem fato ainda: ministro, instituição, economia, mundo.

**Em aberto:**
- Quais mecânicas ainda não escrevem fato e quais fatos cada uma precisa.
- Regras de encadeamento (escândalo → CPI → queda).
- A ordem das etapas do turno com mídia, organizações e mundo entrando.

### 9.2 Gatilhos

**O que é:** um índice que sobe ou passa de um limite dispara uma narrativa (por exemplo, "os sindicatos estão crescendo no país").

**O jogador:** sente o país vivo: o texto lê os números. Hoje o jogador, o que quer que faça, não sente modificação, e isso é o que o autor chama de não jogável.

**Peças:** índices visíveis e invisíveis; limites. O invisível o motor calcula e o jogador só sente pelo que acontece (greve, surto, notícia).

**Regras:**
- Índice é gatilho (07/nov).
- Cada instituição ganha quantos índices fizerem sentido (aba Índices, coluna Na tela).
- A V1 jogável já tem narrativas e gatilhos; podem ser montados antes. Depois de pronta, ganha uma base de gatilhos para parecer o mais real possível. (autor, 14/nov; substitui a regra de 07/nov "só depois do motor e dos índices")
- Dados primeiro, narrativa depois.

**Ligações:**
- Recebe: índices (Economia, Sociedade, Máquina pública).
- Entrega: eventos e manchetes.

**Referências:** nenhuma citada. **ESTUDAR** (gatilho por limite de índice).

**No motor hoje:** ☐ nada. Existe o motor de deriva, que move um índice empurrado por outro (ver 9.5). Não há passo próprio para as narrativas na ordem de construir.

**Em aberto:** o que vários índices batendo metas juntos significam.

### 9.3 Eventos e crises

**O que é:** coisas que acontecem sozinhas no país, saídas dos dados, e que chegam ao jogador como papel na mesa.

**O jogador:** recebe a situação com 2 ou 3 respostas, cada uma com ganho e custo; esperar é uma opção, a pior.

**Peças:**
- Família "Crises" da mesa (índices e eventos): enchente, greve, banco quebrando, apagão.
- Eventos de cada setor, já desenhados no GDD: apagão; queimadas e vazamentos; seca, colapso da pesca, carne contaminada; desastre de Defesa civil; resgate de bancos; massacre no campo.
- Choque de preço do mundo.
- Fatos aleatórios do turno: escândalo, choque de preço, atentado.

**Regras:**
- O papel nasce do estado do país e das fichas, sem roteiro. (11/nov)
- Prazos (11/nov, calibrar no fim): situação urgente 1 turno (piora, vira crise e manchete); situação calma 3 turnos (quem pede fica chateado e a oferta some).
- Ignorar tem consequência: situação piora; enchente sem verba vira crise e manchete.
- O desastre chega sozinho: a gravidade sai do clima e do país; o estrago é a gravidade menos o índice Preparo contra desastres.
- O papel tem povo: o que houve, quem sofre (com nome e voz), o que fazer. O mesmo texto sai como notícia.
- O apagão é evento: acontece num estado que precisa de mais energia do que recebe, mesmo com energia sobrando no país.
- Resgate de bancos é evento, não lei: cada banco que quebra tem ficha e o jogador escolhe (deixar quebrar, estatizar, emprestar com condições, salvar sem condições).
- Crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à moeda) são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.
- Massacre no campo chega como papel; dono na fila desmata para provar que produz; Liberação de armas sobe o Conflito no campo.
- Emissões são conta por companhia; queimadas e vazamentos são eventos.
- Ciclo e crise de verdade quando o mundo tiver países funcionando (14/nov). Complementam o ciclo de 4 anos e os choques que já existem (ver 7.4).
- Sem sorteio para a lei passar; a aprovação vem do Congresso e dos grupos, nunca de um dado. O placar previsto é o real.

**Ligações:**
- Recebe: índices e fichas (Economia, Sociedade, Máquina pública); clima e preparo.
- Entrega: papel na mesa (Máquina pública, Política); manchete (Mídia); raiva e escândalo (Sociedade, Política).

**Referências:** Victoria 3 não tem ciclo e crise. Referência de eventos de decisão: **ESTUDAR**.

**No motor hoje:** ◐ R17.13 prazos: ignorar tem consequência; falta crise e aliado se afastar. ◐ R17.7 só família Leis e vaga de juiz. Falta crises, pedidos, ofertas, instituições, partido como papel. Só o choque de preço do mundo roda hoje.

**Em aberto:**
- Como as situações (crises) saem dos dados.
- Crise que piora no prazo e aliado que se afasta.
- Como o evento "Papéis duvidosos" entra na mesa.
- Cada setor já tem seus papéis desenhados no GDD (5.12).

### 9.4 Atos com custo e duração

**O que é:** os atos do presidente com a mídia e com países, que precisam de custo e duração.

**O jogador:** escolhe um ato (entrevista, pressão, processo, notícia falsa; visita de Estado, receber o líder, apoiar ou criticar em público, mediar).

**Peças:** os atos já listados em 6.6 e 7.5.

**Regras:** nenhuma ainda de custo e duração. Ato é "acontece uma vez". (08/nov)

**Ligações:** Mídia e Mundo.

**Referências:** **ESTUDAR**.

**No motor hoje:** ☐ R14.11. ☐ R15.11.

**Em aberto:** custo e duração dos atos com a mídia e dos atos com países (para as narrativas, depois da V1 jogável).

### 9.5 O acaso e a deriva

**O que é:** o sorteio com semente (acaso) e o índice que anda sozinho pelos turnos (deriva).

**O jogador:** mesma semente e mesmos pedidos, mesma partida. Sente o país parado até algo mudar, e depois andar.

**Peças:**
- Acaso: sorteio com semente (mulberry32); o estado do gerador fica no estado da partida; função pura `sortear`.
- Deriva: índice que anda empurrado por outro (o "processo").

**Regras:**
- Acaso: mesma semente e mesmos pedidos, mesma partida.
- Deriva (aprovado em 04/nov/2026): o índice é base + leis; a deriva move a base, um pouco a cada turno.
- Quem empurra mede contra o turno 0: o país começa parado e só anda quando algo muda.
- Passo por turno = sentido × taxa × (quem empurra hoje − no turno 0) × escala. Taxa: fraca 2%, média 5%, forte 10% da distância.
- A base fica dentro do domínio, contando as leis: não acumula além do teto.
- As ligações ficam no mundo (`mundo/indicadores/derivas.json`); o motor não sabe os nomes.
- Não equilibrado: a taxa só dá a direção.
- Humor da bolsa nasce de alta recente, crédito, confiança e notícias, sem sorteio.
- A aprovação de lei nunca usa sorteio.

**Ligações:** Economia (índices) e Sociedade (índices) por deriva; Mundo, preço de fora por choque sorteado.

**Referências:** nenhuma citada.

**No motor hoje:** ✅ `acaso` e `deriva` existem no motor (aprovado em 04/nov/2026).

**Em aberto:** quanto o acaso entra nos eventos (9.3). Não há fonte. Pergunta ao autor.

---

## Anexo A. Regras de conteúdo

- Nada do Democracy 4 (nome, número, ligação). Victoria 3 só como ideia.
- Países reais podem entrar (autor, 08/nov); pessoa, empresa e o que tem direito autoral não. Retratos genéricos para pessoas e empresas.
- O que é público e sem marca pode ser usado (nomes de moedas, cargos, instituições comuns); o que tem marca ou dono ganha nome alternativo parecido.
- Partidos reais (12/nov) entram com nome e cor; logotipo, símbolo e marca não.
- Presidentes reais entram só em campanha (imitar um presidente) e no desbloqueio "você imitou o programa tal", via coluna "Programa real (de quem)"; nunca no texto da lei. (11/nov)
- Lei e texto se medem pelo próprio país da partida ("2 salários médios do país"), nunca por país real.
- Nomes de empresas e mídias: nenhuma empresa real.
- Nomes de organizações (crime, terrorismo): sempre inventados e extremistas em todos os lados.
- Antes de publicar: conferir com advogado.

## Anexo B. Glossário

| Termo | O que é |
| --- | --- |
| Sociedade | A população e como ela funciona: bolso (o mais forte), bússola (peso menor) e memória (14/nov). |
| Esfera | Antigo: tema de leis. Desde 13/nov a lei mora numa instituição. |
| Subesfera | Antigo: saiu em 13/nov; a caixa leva instituições inteiras. |
| Lei | Regra permanente. Tem bolha no mapa. |
| Lei com prazo | Lei que acaba sozinha. |
| Ato | Decisão do presidente que acontece uma vez (Graça, visita de Estado, suspender a regra fiscal). |
| Posição por país | Nível que o presidente decide no menu de um país e que vale até mudar (Sanções, Aliança). |
| Operação | Decisão em etapas sobre uma companhia, com papéis na mesa (Estatização, Privatização). |
| Programa | Pacote de leis que resolve um problema. Forma-se quando a maior parte das leis anda na direção dele num mandato; o país ou o gerador dá o nome. A palavra é só para isso. |
| Companhia | A dona. Tem ações, reserva de investimento e várias empresas. |
| Empresa | A parte de uma companhia em um setor. Conjunto de prédios. |
| Prédio | A unidade que produz ou presta serviço (fábrica, fazenda, usina, hospital). Antes aparecia como "construção". |
| Obra | O ato de construir um prédio novo. Entra na fila da construção civil. |
| Construção civil | O setor que faz as obras. |
| Órgão | O mesmo que instituição (13/nov): a repartição do Estado que executa as leis dela. Recebe verba por lei e sofre corrupção. |
| Ação (cota) | Fatia de uma empresa. Dá dividendo, não dá mando. |
| Estatal | Empresa cujo dono é o Estado. |
| Serviço do Estado | Prédio do Estado fora do mercado (hospital, escola, delegacia). |
| Pop, grupo, organização | Pop é quem a pessoa é na economia; grupo é interesse organizado que atravessa os pops; organização nasce na partida, com nome, líder e ação. |
| Bússola | Eixos esquerda/direita (economia) e libertário/tradicional (costumes). Todo mundo e toda lei têm posição nela; a distância pesa no gosto, menos que o bolso (14/nov). |
| Bolha | Como a lei aparece ao jogador no mapa. |
| Mesa | Onde o jogador despacha os papéis do turno (mesa do presidente e mesa do partido). |
| Fato do turno | Aviso que um módulo deixa no turno; quem se importa lê. |
| Módulo | Pasta do motor com uma tarefa só e uma porta de entrada (`index.ts`). |
| Ação x empresa x prédio (exemplo da padaria) | Ação é uma fatia do dono, só lucro; empresa é a padaria inteira, quem é dono manda; construção é uma loja. |
| SisGovpedia | Enciclopédia do jogo, aberta pelas dicas ao passar o mouse, em camadas. |
| Planilhas | `leis.xlsx` é o acervo; `gdd.xlsx` é o que se constrói. |

## Anexo C. Documentos

| Documento | Para que serve |
|---|---|
| `docs/jogo/gdd.md` | Este documento: o jogo pronto, por mecânica |
| [requisitos.md](requisitos.md) | O que o jogo precisa ter e como se constrói (R1…R19) |
| [plano-de-desenvolvimento.md](plano-de-desenvolvimento.md) | Ordem de construir |
| [arquitetura.md](arquitetura.md) | Como o código está montado |
| `src/motor/*/*.md` | Como cada módulo do motor funciona hoje |
| [indices-avaliacao.md](indices-avaliacao.md) | Registro dos índices avaliados |
| [codigo-a-conferir.md](codigo-a-conferir.md) | Lista de conferência do código |
| [estudos/](estudos/) | Pesquisas e referências (Victoria 3, Democracy 4, jogadores, vícios, mercado) |
| `gdd.xlsx` | O que se constrói: instituições, leis por instituição, degraus, efeitos |
| `leis.xlsx` | Acervo: leis, índices, pops, grupos, organizações, economia, países, programas |
| `leis-do-brasil.md`, `leis-inventario.md`, `leis-sentir.md` | Relatórios gerados por script |
| `docs/arte/direcao-de-arte.md` | Direção de arte que vale |
| `docs/historico/` | Tudo o que foi substituído (GDD antigo, mapa de mecânicas, regras das leis de 14/nov, projeto antigo) |

**Onde foi parar cada seção do GDD antigo:** 1 a 4 → Parte 1 · 5 Partido →
5.1 · 6 Governo → presidente, vice, sucessão, pessoas e governadores em 5;
instituições, ministros e caixas em 4.18 a 4.21 · 7 Leis → 4 · 8 Bússola →
2.5 · 9 Índices → 4.16 · 10 Contas do Estado → 3.12 · 11 População → 2 ·
12 Congresso → 5.5 · 13 Eleição → 5.6 · 14 Mídia → 6 · 15 Mundo → 7 ·
16 Economia → 3 · 17 Tela → 8 · 18 Perguntas em aberto → o "Em aberto" de
cada mecânica · 19 Regras de conteúdo → Anexo A · 20 Mapa dos documentos →
Anexo C.
