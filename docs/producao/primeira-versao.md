# Primeira versão do SisGov

**Chamado:** SG001  
**Área:** Produção e produto  
**Estado:** Concluído

Escopo revisado em 1º de outubro de 2026 para incorporar o jogador como partido, a representação no Senado e a opinião pública. A revisão preserva a conclusão de SG001 e o histórico da Fase 00.

## Público e plataforma

O SisGov é destinado a entusiastas de jogos de estratégia, simuladores políticos e gerenciamento econômico. A primeira versão será disponibilizada na web para navegador em computador. Essa escolha aproveita o protótipo existente e permite testar o jogo sem instalação.

## Experiência pretendida

O jogador representa um partido e, enquanto ocupa a Presidência, conduz o governo: propõe políticas, busca apoio no Senado, deixa o tempo avançar e observa consequências econômicas, sociais e eleitorais. Partido, governo em exercício e composição do Senado são estados distintos. A referência de experiência combina as decisões políticas e suas consequências sistêmicas de *Democracy 4* com a percepção de interesses sociais e econômicos conflitantes de *Victoria 3*.

O objetivo da primeira versão é promover o aprendizado sobre o funcionamento de um sistema político. O jogo deve tornar compreensível que uma política produz efeitos relacionados entre si, com ganhos, custos e reações diferentes para grupos sociais distintos.

## Regras do ciclo político

A população é representada por poucos perfis agregados, com interesses combinados: uma parcela pode reunir trabalhadores, idosos e motoristas. Os grupos ajudam a explicar preferências e reações, mas cada parcela tem seu peso eleitoral contado uma única vez. Essa população elege a Presidência e a composição do Senado, com resultados separados; satisfação de um grupo não equivale diretamente a cadeiras.

As políticas, incluindo leis, impostos e programas, são definidas em JSON. A afinidade de uma proposta com correntes políticas é parte desse conteúdo, mas não garante votos. A opinião pública influencia os parlamentares e tem consequências eleitorais; não funciona como veto automático. Uma proposta popular pode ser rejeitada por falta de votos, e uma impopular pode ser aprovada. Antes da confirmação, o jogador consulta estimativas de reação popular e apoio parlamentar, identificadas como estimativas.

As regras detalhadas de eleição do Senado e votação das propostas serão definidas em etapa própria. Esta revisão não fixa quantidade de partidos, distribuição de cadeiras ou regra de maioria.

## País e políticas ao longo do tempo

O cenário brasileiro começa com um país herdado: políticas vigentes, níveis de implantação, finanças, população, composição política e consequências já presentes. O orçamento público, a opinião popular e o apoio parlamentar são informações separadas.

A aprovação autoriza a medida, mas sua implantação pode levar tempo. O nível desejado pelo jogador e o nível já implantado devem ser visíveis separadamente; os efeitos podem ser imediatos, atrasados ou graduais. Uma proposta rejeitada não inicia a implantação. Revogar uma política ou encerrar um efeito segue regras próprias e não apaga automaticamente consequências já acumuladas.

Um déficit é resultado válido da simulação e segue a regra de financiamento do cenário, permitindo continuar a partida. Dados inexistentes e cálculos inválidos são erros técnicos distintos de consequências econômicas desfavoráveis.

Vencer a eleição presidencial inicia outro mandato preservando dívida, políticas, crises e implantação em andamento. Perder encerra a partida na primeira versão. O salvamento deve permitir retomar também o partido, a composição parlamentar, os estados das propostas e os efeitos em andamento.

## Critérios de sucesso

1. **Decisões produzem consequências.** Quando uma alteração de política é aprovada, indicadores econômicos ou sociais reagem conforme as regras documentadas do modelo. Um exemplo jogável distingue aprovação, implantação gradual e atraso dos resultados. A interface permite observar a mudança e sua explicação; uma rejeição não inicia a implantação.

2. **A sociedade influencia a política.** Ao menos uma decisão produz consequências distintas e rastreáveis para grupos ou interesses sociais. Cenários de verificação demonstram tanto uma proposta popular rejeitada por falta de votos quanto uma proposta impopular aprovada, com reação pública e consequências políticas. Os perfis combinam interesses sem duplicar o peso eleitoral das mesmas pessoas.

3. **Há um ciclo político completo e contínuo.** O partido assume um país já em funcionamento, propõe medidas, observa consequências e chega às eleições para Presidência e Senado, com resultados separados. Uma vitória presidencial inicia novo mandato preservando o estado do país; uma derrota encerra a partida. O percurso inclui continuar após um déficit e salvar e restaurar a composição política e os efeitos em andamento. Se funciona de ponta a ponta, a primeira versão é considerada jogável, mesmo com apresentação visual provisória.

## Fora do escopo

- Guerra militar ou controle de exércitos.
- Mapa mundial jogável.
- Construção individual de fábricas, como em *Victoria 3*.
- Diplomacia internacional complexa.
- Personagens 3D.
- Multiplayer.
- Simulação integral da economia real.
- Editor completo.
- Contas de usuário e armazenamento em nuvem, por enquanto.
- Gabinete individual, campanhas detalhadas e negociação de coalizões.
- Disputas internas do partido e candidatos individuais.
- Continuação da partida na oposição.

A primeira versão usa poucas políticas e poucos perfis para validar o ciclo completo. Representar um partido não inclui automaticamente todas as mecânicas partidárias possíveis.

Inteligência artificial pode ser considerada quando melhorar o produto, desde que não seja necessária em tempo real e tenha escopo, custo e privacidade avaliados antes da adoção.

## Limite de referência

*Democracy 4* e *Victoria 3* são referências de inspiração, não especificações a reproduzir. O SisGov terá um modelo próprio, pequeno e explicável, adequado ao objetivo de aprendizagem da primeira versão.
