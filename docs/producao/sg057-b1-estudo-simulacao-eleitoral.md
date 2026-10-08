# SG057-B1 — Estudo de simulação eleitoral

**Estado:** concluído no recorte de pesquisa em 8 de outubro de 2026; contrato eleitoral pendente em SG057-B2.
**Data de consulta:** 4 de outubro de 2026.  
**Objetivo:** comparar mecanismos de simulação antes de escolher as regras do SisGov.

Este estudo examina como uma decisão de governo pode chegar ao eleitorado e como
preferências podem ser agregadas em uma eleição. As referências oferecem métodos
e exemplos, não coeficientes prontos para o Brasil atual. O SisGov ainda não
calcula opinião, comparecimento ou votos.

## Referências e o que cada uma demonstra

Complemento de 8 de outubro: [pesquisa de efeitos e apoio político no Democracy 4](pesquisa-democracy4-efeitos-apoio.md),
com documentação oficial, distinção entre contribuição, inércia, memória temporária
e voto, e aplicações propostas ao motor configurável por JSONs do SisGov.

| Referência                                                                                                                                                                                                                                                                      | Entradas e mecanismo descritos                                                                                                                                                                                                     | Apuração e calibração                                                                                                                                                                                                     | Validação publicada e limite                                                                                                                                                                                                                                                                                 | Possível uso no SisGov                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Documentação oficial das políticas](https://www.positech.co.uk/democracy4/mod_policies.html) e [da simulação](https://www.positech.co.uk/democracy4/mod_simulation.html) de _Democracy 4_, conferidas com a cópia local de `policies.csv`, `simulation.csv` e `votertypes.csv` | Uma política declara saídas para grupos de eleitores, indicadores e situações; indicadores também podem produzir saídas para grupos. Na cópia local, `BusSubsidies` afeta diretamente `Commuter` e `Motorist` e altera `BusUsage`. | Os CSVs permitem editar relações e parâmetros de conteúdo. A documentação consultada não publica a fórmula completa que converte essas influências em voto, comparecimento e resultado.                                   | Os arquivos demonstram a estrutura de influências, não uma validação eleitoral do jogo. Seus coeficientes não são estimativas para o Brasil.                                                                                                                                                                 | Estudar os dois caminhos, medida → reação do grupo e medida → indicador → reação posterior, preservando a origem de cada efeito.                                                                                    |
| [TriplePC, _The Public Policy Preference Calculator_ (2025)](https://www.microsimulation.pub/articles/00323)                                                                                                                                                                    | Simula mudanças de impostos e benefícios sobre a renda dos domicílios, estima consequências sociais e de saúde e usa escolhas de participantes entre propostas com características variadas para estimar preferência pública.      | Combina microssimulação com pesquisa de escolha entre alternativas; compara custos, beneficiados, prejudicados e aceitação da política. O próprio estudo usa dados e pesquisas do Reino Unido.                            | Os autores o descrevem como protótipo e apontam hipóteses fortes e incertezas. Os coeficientes e preferências britânicos não validam uma reação brasileira; bem-estar, aceitação da medida e voto continuam grandezas distintas.                                                                             | Inspirar a sequência medida → impacto distribuído por grupo → avaliação da proposta e de seus resultados. Na primeira versão, usar os perfis agregados já previstos no SisGov, sem exigir microdados de domicílios. |
| [BRASMOD, LabPub/USP](https://labpub.fea.usp.br/brasmod/)                                                                                                                                                                                                                       | Microssimulação brasileira de tributos e benefícios com dados domiciliares da PNAD/PNAD Contínua e da POF; calcula incidência e distribuição dos efeitos de reformas.                                                              | Tem [código, dados e relatório metodológico públicos](https://brasmod.github.io/brasmod_main/) para examinar regras, bases e resultados. Não estima sozinho a aprovação política da reforma.                              | É uma referência brasileira para impacto material em impostos e benefícios; sua cobertura e período de dados precisam ser conferidos para cada medida.                                                                                                                                                       | Usar sua lógica e resultados como referência para a incidência sobre grupos, sem exigir que o jogo execute o modelo completo.                                                                                       |
| [_Isentar os pobres, moderar com os ricos_ (2026)](https://www.scielo.br/j/rsocp/a/47YbrsfLMZTBY9jJXtKYfmr/?format=html&lang=pt)                                                                                                                                                | Pesquisa com 2.542 entrevistados no Brasil em 2024; um experimento de escolha entre planos de Imposto de Renda estima a reação a alíquotas por faixa de renda.                                                                     | A variação aleatória dos planos permite medir como atributos tributários mudam a chance de escolha, inclusive testar diferenças entre grupos.                                                                             | Trata de IRPF e não pergunta como a arrecadação seria gasta; não fornece uma função geral de aprovação para saúde, segurança ou pacotes completos de políticas. No desenho estudado, renda e identificação partidária não produziram perfis significativamente distintos de preferência por progressividade. | Referência brasileira para calibrar preferências tributárias e testar se distinções entre grupos são sustentadas por dados.                                                                                         |
| [Charcon e Monteiro, _A multi-agent system to predict the outcome of a two-round election_ (2020)](https://doi.org/10.1016/j.amc.2020.125481)                                                                                                                                   | O resumo do artigo descreve eleitores artificiais cuja escolha considera desempenho econômico percebido, qualidade dos serviços, conduta ética do governo, orientação política e influência de vizinhos.                           | Simula disputa entre três opções em até dois turnos. O resumo acessível não fornece equações e parâmetros suficientes para reproduzir o cálculo nem descreve por completo sua calibração.                                 | O artigo relata uma simulação da eleição presidencial brasileira de 2010 e da uruguaia de 2019. Reproduzir casos passados não demonstra previsão confiável de eleições futuras ou validade para todos os partidos brasileiros.                                                                               | Investigar como combinar avaliação de governo, preferências e influência social, mantendo o segundo turno como etapa distinta. A leitura do método completo ainda é necessária antes de adaptar equações.           |
| [Mitra, _Agent-based Simulation of District-based Elections with Heterogeneous Populations_ (AAMAS 2023)](https://www.southampton.ac.uk/~eg/AAMAS2023/pdfs/p2730.pdf)                                                                                                           | Representa eleitores, comunidades, partidos e distritos por distribuições de probabilidade. Examina popularidade geral, concentração territorial, identidade social e influência local.                                            | Executa várias simulações. Ajusta parâmetros com _Approximate Bayesian Computation_: aceita conjuntos que aproximam resultados observados. No sistema estudado, cada distrito concede uma cadeira ao partido mais votado. | O resumo expandido compara resultados simulados com eleições na Índia e nos Estados Unidos; mostra que distribuição territorial pode alterar cadeiras mesmo com apoio nacional semelhante. A regra de uma cadeira por distrito não define eleições brasileiras.                                              | Aproveitar a ideia de distribuição territorial e testar faixas de resultados. A apuração da Presidência e do Senado no Brasil terá contrato próprio.                                                                |

**Lacuna principal:** a documentação consultada de _Democracy 4_ expõe as
relações de conteúdo, mas não a fórmula eleitoral completa. O resumo acessível
de Charcon e Monteiro tampouco permite reproduzir seu método. Antes de escolher
uma fórmula, SG057-B2 precisará examinar o artigo completo ou registrar que
essa referência sustenta apenas a estrutura conceitual.

### Contas pequenas para ler cada referência

- **Democracy 4:** a cópia local de `BusSubsidies` declara, entre outros efeitos,
  `0,10 + 0,34 × x` para `Commuter` e `0,32 × x` para `BusUsage`. Com intensidade
  hipotética `x = 0,5`, as contribuições calculadas são `0,27` e `0,16`. Elas
  ainda não são aprovação final do grupo nem votos; a documentação não fornece
  essa conversão.
- **TriplePC:** imagine uma medida que eleva o benefício de um perfil e aumenta
  o imposto pago por outro. Primeiro se calculam os ganhos e perdas de cada
  perfil; depois se estima, por pesquisa de preferência, como as pessoas avaliam
  a proposta completa. Um perfil beneficiado pode discordar de seu financiamento.
  Este é um exemplo de fluxo, sem coeficientes brasileiros ou cálculo de voto.
- **Charcon e Monteiro:** o resumo informa as entradas e a eleição em dois
  turnos, mas não permite reproduzir a função de escolha de cada agente. Como
  exemplo **inventado apenas da apuração**, se 100 agentes produzissem
  `40/35/25` votos para três opções, as duas primeiras iriam ao segundo turno.
  A distribuição `40/35/25` não foi calculada pelo artigo nem pode ser inferida
  de suas entradas sem o método completo.
- **Mitra:** em dois distritos hipotéticos de 100 pessoas, os votos `60/25/15`
  e `20/45/35` para partidos A/B/C somam `40%/35%/25%` no total. Pela regra de
  uma cadeira ao vencedor de cada distrito usada no estudo, A e B recebem uma
  cadeira cada. Os números são inventados; a conta ilustra por que a
  distribuição territorial importa, sem propor essa regra para o Brasil.

## Exemplo manual para testar o contrato futuro

Os números abaixo são **hipóteses didáticas**, não resultados eleitorais, dados
demográficos ou efeitos medidos no Brasil. Usam 100 eleitores sintéticos em cada
estado e comparecimento fixo apenas para facilitar a conta. Uma parcela pode ter
vários interesses, mas cada uma das 100 pessoas entra uma única vez no total.

Uma política federal de acesso a serviços públicos é aprovada. O grupo exposto
reage à medida com `+10` pontos percentuais de apoio ao governo. Após a
implantação, um indicador **nacional** de acesso melhora; todos os grupos reagem
ao resultado com mais `+5` pontos. O apoio inicial hipotético é de `50%` para
todos. Em um estado A, 60 dos 100 eleitores estão no grupo exposto; no estado B,
30 dos 100. Os demais eleitores não recebem o efeito direto. Interesses
adicionais, como morar em área rural, podem se sobrepor a essas parcelas sem
criar eleitores extras.

| Momento                              | Estado A | Estado B | Causa                                                       |
| ------------------------------------ | -------: | -------: | ----------------------------------------------------------- |
| Antes da política                    |      50% |      50% | Base hipotética comum.                                      |
| Após a reação direta                 |      56% |      53% | `60 × 0,60 + 40 × 0,50 = 56`; `30 × 0,60 + 70 × 0,50 = 53`. |
| Após a melhora do indicador nacional |      61% |      58% | Somar `5` pontos à avaliação de cada pessoa, uma vez.       |

O indicador continua nacional nos dois estados. A diferença resulta somente da
exposição hipotética de suas populações à mesma política. Os `+10` pontos
representam a reação à medida; os `+5` representam a reação a um resultado
posterior. SG057-B2 deverá decidir quais efeitos são realmente distintos, quando
ocorrem e como impedir que o mesmo benefício percebido seja registrado nas duas
etapas. Percentual de apoio neste exemplo não é voto apurado, chance de vitória
ou distribuição de cadeiras.

## Como aproveitar o TriplePC no SisGov

O cenário já possui políticas, consequências e perfis agregados. SG057-B2 deve
estudar um contrato pequeno em que cada política declare quem recebe o benefício,
quem arca com o custo e quais condições de acesso importam para cada perfil. O
grafo fornece os resultados nacionais observáveis ao longo do tempo. A camada de
população combina a exposição do perfil à medida com os resultados que ele
percebe e registra, separadamente, **bem-estar do grupo** e **aprovação da
política**. O motor eleitoral posterior pode consultar essa aprovação, sem
tratá-la como voto automático.

O exemplo brasileiro inicial pode usar os dois perfis de SG051; não requer uma
simulação individual de famílias nem indicadores econômicos por estado. A
distribuição dos perfis por estado pode diferenciar a reação local a uma política
federal. O BRASMOD oferece uma base brasileira para estudar a incidência material
de impostos e benefícios. O estudo brasileiro de preferências tributárias ajuda
a calibrar a aceitação de atributos do IRPF. Para outras políticas ou combinações
de benefício e financiamento ainda sem pesquisa compatível, pesos do jogo
permanecem hipóteses. A pesquisa e a simulação precisam medir
os mesmos atributos da política, pois o próprio estudo relata limitações quando
suas opções não se alinham.

Coeficientes britânicos podem servir apenas como parâmetros provisórios para
explorar cenários e testar sensibilidade. Não devem ser apresentados como reação
medida no Brasil: cada parâmetro precisa de fonte, população e política
compatíveis ou ficar explicitamente marcado como hipótese do jogo.

## Dados necessários antes de um modelo brasileiro

- Catálogo das políticas e suas consequências com identidade, tempo e procedência.
- Definição de grupos e seus pesos por estado, sem somar interesses sobrepostos
  como se fossem pessoas diferentes.
- Histórico eleitoral por partido, eleição e estado com fonte, período e regra
  de apuração compatíveis; sua disponibilidade não define causalidade.
- Contrato separado para opinião sobre política, bem-estar do grupo, avaliação
  do governo, comparecimento, voto presidencial, voto para o Senado e autorização
  legislativa.
- Pesquisas brasileiras por tema: já há evidência experimental sobre atributos
  do IRPF, mas a aceitação de outras medidas e pacotes com benefícios, custos e
  resultados combinados requer fontes próprias; onde faltarem, os parâmetros
  permanecem hipóteses explícitas de cenário.

SG057-B2 escolherá entradas, saídas, pesos e regras brasileiras com base nessa
pesquisa e em fontes identificadas. SG075 comparará cenários reproduzíveis e
identificará a calibração histórica como trabalho posterior. Nenhum resultado
deste exemplo deve ser apresentado como previsão eleitoral real.
