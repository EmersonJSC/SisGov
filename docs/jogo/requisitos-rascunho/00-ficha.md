# Ficha de contexto (vai junto com cada agente)

SisGov: simulador de governo em português. Quem joga é o presidente de um país e acompanha o efeito das leis no orçamento, nos índices e na opinião da população. Fonte: `docs/jogo/gdd.md` (14/nov/2026). O GDD manda; o código não prova nada.

## Princípios (GDD 1.3, L251–L269, copiados)

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

## O turno (GDD 1.5)

Um turno dura 2 meses (6 por ano). O jogador: 1. lê o país no mapa; 2. age (propõe leis, troca ministro, negocia, faz campanha); 3. despacha a mesa; 4. o Congresso vota; 5. passa o turno (efeitos chegam, a mídia reage, acontecem fatos).

Etapas do motor, na ordem que o GDD dá (L359): 1. Congresso · 2. Leis novas · 3. Efeitos · 4. Economia real · 5. Preços e juros · 6. Contas · 6b. Moradia · 7. Jogabilidade · 8. Pops e grupos · 8b. Governo · 8c. Programas · 9. Política · 9a. Eleição · 9b. Mídia · 10. Invariantes.

## Regras do projeto

- O motor não conhece nomes de leis, partidos ou países (princípio 10).
- Toda lei chega ao pop por um canal (GDD 4.4: regra/direito, imposto/transferência/preço, verba; informação vai pela mídia como programa ou verba).
- Nenhum dinheiro some (GDD 3.6): todo fluxo tem origem e destino.
- Lei não tem condição escrita; o efeito vem do estado do país (princípio 14).
- Não há pontos de ação: o limite vem do mundo e só atrasa, nunca proíbe (princípio 18).
- As 511 leis JSON e as planilhas serão reconstruídas: requisito descreve o molde da lei, nunca uma lei pelo nome nem quantas existem.

## As três mecânicas e o que fica em volta

No meio: **Sociedade** (Parte 2: pops, opinião = bolso + bússola + memória), **Economia** (Parte 3), **Máquina pública** (Parte 4: leis, instituições, ministros). Em volta: Política (5), Mídia (6), Mundo (7), Tela (8), Narrativas e eventos (9).

## Glossário (GDD Anexo B, copiado)

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


## Pastas de src/motor/ (só o que o nome sugere; o que fazem, a auditoria descobre)

| Pasta | O nome sugere |
| --- | --- |
| acaso | sorteio com semente |
| atendimento | serviço que o Estado presta ao pop |
| calculos | contas auxiliares comuns |
| contas | orçamento, receita, gasto e dívida |
| deriva | mudança lenta de valores com o tempo |
| efeitos | efeito das leis, com atraso |
| eleicao | eleição e voto |
| estado | o estado da partida e seus tipos |
| fatos | fatos do turno |
| fisco | impostos e arrecadação |
| governo | ministros, instituições, ministérios |
| grupos | grupos de interesse |
| judiciario | tribunais e juízes |
| leis | leitura e aplicação das leis |
| mercado | mercado, preços, empresas |
| mesa | papéis da mesa do presidente |
| midia | mídias e manchetes |
| moradia | moradia e terra |
| mundo | outros países |
| pessoas | fichas de pessoas (políticos, ministros) |
| politica | partidos, Congresso, aprovação |
| populacao | pops, demografia, opinião |
| programas | programas (pacotes de leis) |
| saneamento | água e esgoto |
| turno | a ordem das etapas do turno |
| index.ts | porta de entrada do motor |
