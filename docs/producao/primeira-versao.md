# Primeira versão do SisGov

**Chamado:** SG001  
**Área:** Produção e produto  
**Estado:** Concluído

Escopo consolidado em 7 de outubro de 2026 com as decisões do usuário sobre
eleições, tramitação, acaso e economia jogável. Preserva a conclusão documental
de SG001 e o histórico da Fase 00; não declara a primeira versão implementada.

## Público e plataforma

O SisGov é destinado a entusiastas de jogos de estratégia, simuladores políticos e gerenciamento econômico. A primeira versão será disponibilizada na web para navegador em computador. Essa escolha aproveita o protótipo existente e permite testar o jogo sem instalação.

## Experiência pretendida

O jogador representa um partido e, enquanto ocupa a Presidência, conduz o governo: propõe políticas, busca apoio no Senado, deixa o tempo avançar e observa consequências econômicas, sociais e eleitorais. Partido, governo em exercício e composição do Senado são estados distintos. A referência de experiência combina as decisões políticas e suas consequências sistêmicas de _Democracy 4_ com a percepção de interesses sociais e econômicos conflitantes de _Victoria 3_.

O objetivo é oferecer decisões políticas interessantes e consequências
compreensíveis. O aprendizado surge ao jogar: uma política traz ganhos, custos,
atrasos e reações diferentes para grupos sociais distintos. A economia deve
sustentar essa experiência; não exigir administração contábil detalhada.

## Regras do ciclo político

A população é representada por poucos perfis agregados, com interesses combinados: uma parcela pode reunir trabalhadores, idosos e motoristas. Os grupos ajudam a explicar preferências e reações, mas cada parcela tem seu peso eleitoral contado uma única vez. Essa população elege a Presidência e a composição do Senado, com resultados separados; satisfação de um grupo não equivale diretamente a cadeiras.

As políticas, incluindo leis, impostos e programas, são definidas em JSON. A afinidade de uma proposta com correntes políticas é parte desse conteúdo, mas não garante votos. A opinião pública influencia os parlamentares e tem consequências eleitorais; não funciona como veto automático. Uma proposta popular pode ser rejeitada por falta de votos, e uma impopular pode ser aprovada. Antes da confirmação, o jogador consulta estimativas de reação popular e apoio parlamentar, identificadas como estimativas.

Na Presidência, vence o maior total nacional em turno único; segundo turno fica
para depois. O Senado tem três cadeiras por estado e Distrito Federal, com
mandatos de oito anos e renovação alternada de duas e uma cadeira por UF a cada
quatro anos. O cenário informa quais mandatos vencem na próxima eleição;
preservar as cadeiras fora da disputa. Apuração é separada por cargo e, no Senado,
por UF, sem exigir personagens ou gestão individual de candidatos.

Ampliação confirmada: a V1 permite escolher personagens para presidente, vice
e ministros. O motor gera personagens com parâmetros definidos em JSON e depois
atribui uma história de um catálogo JSON separado, por tags e restrições de
compatibilidade, sem alterar seus atributos a partir do texto.
Instâncias e opiniões atuais ficam no estado da partida. Leis e indicadores
influenciam opiniões, que não são lealdades fixas. O jogador escolhe presidente
e vice para o seu partido;
os demais partidos escolhem suas chapas e concorrem. Se vencer, o jogador
escolhe seus ministros entre os personagens disponíveis e elegíveis.
O conteúdo e as instâncias também registram partido, preferências,
apoios/rejeições e relações relevantes para coligações. Vice pode pertencer ao
partido do titular ou a um aliado. Não há punição obrigatória por trocar ministros.
A chapa é escolhida antes da eleição;
ministros podem ser substituídos durante o mandato, com consequências somente
quando declaradas nos JSONs. Esse recorte não inclui candidatos senatoriais individuais
nem gestão completa da vida interna dos partidos. Contrato e chamados estão no
[recorte de personagens do B2](sg057-b2-contrato-politico.md#personagens-e-escolha-de-governo--v1-confirmada).

Votações de propostas têm acaso controlado: afinidade partidária e opinião
pública orientam o apoio, mas admitem dissidências e resultados inesperados.
O sorteio não pode tornar essas condições irrelevantes. Estimativas não consomem
sorteios de votação, e o salvamento preserva o estado aleatório da partida.

A proposta normalmente é votada no próximo fechamento de turno. Pode ter um
adiamento excepcional com motivo visível; no segundo fechamento deve ser votada,
limitando a espera a até seis meses no jogo. A política anterior continua em vigor.
Esse prazo não garante aprovação. Ajustes dentro de uma autorização já existente
podem usar a rota executiva, sem nova votação parlamentar.

SG057-B2 detalha maioria, empates, preferência eleitoral, apuração das vagas e
precedência entre votação e eleição. Probabilidades e condições do adiamento
serão parâmetros testados; essas pendências não reabrem as escolhas de escopo.

## País e políticas ao longo do tempo

O cenário brasileiro começa com um país herdado: políticas vigentes, níveis de implantação, finanças, população, composição política e consequências já presentes. O orçamento público, a opinião popular e o apoio parlamentar são informações separadas.

A aprovação autoriza a medida, mas sua implantação pode levar tempo. O nível desejado pelo jogador e o nível já implantado devem ser visíveis separadamente; os efeitos podem ser imediatos, atrasados ou graduais. Uma proposta rejeitada não inicia a implantação. Revogar uma política ou encerrar um efeito segue regras próprias e não apaga automaticamente consequências já acumuladas.

Um déficit é resultado válido da simulação e segue a regra de financiamento do cenário, permitindo continuar a partida. Dados inexistentes e cálculos inválidos são erros técnicos distintos de consequências econômicas desfavoráveis.

A primeira economia acompanha receitas, despesas, caixa, dívida e juros. O jogo
financia automaticamente a insuficiência de caixa; o superávit permanece em caixa.
Preserva o fluxo de juros herdado e cobra juros simples da dívida nova, a uma
taxa fixa do cenário, a partir do mês seguinte a cada emissão. Não reprecifica
toda a dívida inicial nem exige que o jogador administre títulos.

Endividar-se pode viabilizar serviços e apoio agora, enquanto o peso crescente
dos juros gera compromissos e pode causar desgaste político gradual depois.
O cenário explica a reação dos grupos, sem dupla contagem, cortes automáticos
ou derrota fiscal automática. Antes da decisão, mostrar benefício esperado,
custo por turno, necessidade de dívida e juros adicionais. Taxas e intensidade
do desgaste serão calibradas jogando, com comparações entre estratégias.

Vencer a eleição presidencial inicia outro mandato preservando dívida, juros,
políticas, situações e implantação em andamento. Perder encerra a partida na
primeira versão. O salvamento retoma partido, cadeiras e vencimentos senatoriais,
propostas e seus prazos, efeitos em andamento e estado dos sorteios.

## Critérios de sucesso

1. **Decisões produzem consequências.** Quando uma alteração de política é aprovada, indicadores econômicos ou sociais reagem conforme as regras documentadas do modelo. Um exemplo jogável distingue aprovação, implantação gradual e atraso dos resultados. A interface permite observar a mudança e sua explicação; uma rejeição não inicia a implantação.

2. **A sociedade influencia a política.** Ao menos uma decisão produz consequências distintas e rastreáveis para grupos ou interesses sociais. Cenários de verificação demonstram tanto uma proposta popular rejeitada por falta de votos quanto uma proposta impopular aprovada, com reação pública e consequências políticas. Os perfis combinam interesses sem duplicar o peso eleitoral das mesmas pessoas.

3. **Há um ciclo político completo e contínuo.** O partido assume um país já em funcionamento, propõe medidas, observa consequências e chega às eleições para Presidência e Senado, com resultados separados. Uma vitória presidencial inicia novo mandato preservando o estado do país; uma derrota encerra a partida. O percurso inclui continuar após um déficit e salvar e restaurar a composição política e os efeitos em andamento. Se funciona de ponta a ponta, a primeira versão é considerada jogável, mesmo com apresentação visual provisória.

O aceite desses critérios inclui respeitar a espera máxima de dois turnos,
renovar somente as cadeiras devidas e reproduzir a continuidade dos sorteios após
restauração. Comparar caminhos de gasto, investimento, economia e tributação:
endividamento tem utilidade e contrapartida, e nenhuma estratégia deve dominar
as demais sem custo. Contas corretas, sozinhas, não demonstram um jogo interessante.

## Fora do escopo

- Guerra militar ou controle de exércitos.
- Mapa mundial jogável.
- Construção individual de fábricas, como em _Victoria 3_.
- Diplomacia internacional complexa.
- Personagens 3D.
- Multiplayer.
- Simulação integral da economia real.
- Inflação, rating, crise fiscal e projeções de crise em cinco turnos.
- Bancos, mercado financeiro, gestão de títulos, vencimentos, rolagem e amortização.
- Capacidade avançada e mecanismos detalhados de governança; os limites e a
  implantação já disponíveis continuam valendo.
- Segundo turno presidencial.
- Editor completo.
- Contas de usuário e armazenamento em nuvem, por enquanto.
- Gestão detalhada do gabinete, campanhas detalhadas e negociação complexa de coalizões.
- Disputas internas do partido e candidatos individuais ao Senado; a escolha de
  presidente, vice e ministros está incluída no recorte limitado da V1.
- Continuação da partida na oposição.

A primeira versão usa poucas políticas e poucos perfis para validar o ciclo completo. Representar um partido não inclui automaticamente todas as mecânicas partidárias possíveis.

Inteligência artificial pode ser considerada quando melhorar o produto, desde que não seja necessária em tempo real e tenha escopo, custo e privacidade avaliados antes da adoção.

## Limite de referência

_Democracy 4_ e _Victoria 3_ são referências de inspiração, não especificações a reproduzir. O SisGov terá um modelo próprio, pequeno e explicável, adequado ao objetivo de aprendizagem da primeira versão.
