# SG052 — Consequências do primeiro cenário

**Estado:** Concluído — relações selecionadas e justificadas para parametrização.  
**Data de consulta:** 3 de outubro de 2026.  
**Dependências:** [SG050](sg050-decisoes-e-autorizacoes.md) e [SG051](sg051-variaveis-e-perfis.md).

Este documento reduz as relações candidatas de SG049 a um conjunto pequeno que o primeiro cenário pode explicar. Cada seta abaixo significa uma consequência direta no grafo. As demais consequências devem surgir por propagação; não devem ser repetidas como novas setas só porque também parecem plausíveis.

## Regra de leitura

- `↑` e `↓` descrevem somente o sentido numérico da variável-alvo.
- Atraso é a espera adicional **depois** de a política começar a ser implantada. SG053 definirá quantos turnos e a velocidade de implantação.
- “Base institucional” mostra que a ação existe ou busca determinado resultado. Ela não prova sozinha o tamanho do efeito causal.
- Onde não há estimativa nacional adequada, a relação é uma hipótese de design declarada. SG053 não poderá promovê-la a dado observado sem nova evidência.

## Relações do grafo

| ID | Origem → alvo | Sentido e atraso esperado | Base | Hipótese e incerteza |
| --- | --- | --- | --- | --- |
| R1 | P1 / recursos para atenção básica → V4 cobertura estimada da APS | `↑`; implantação antes do efeito e atraso curto | A [Portaria GM/MS 4.371/2024](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt4371_21_06_2024.html) financia o Piso da Atenção Primária; o [relatório de gestão de 2024](https://bvsms.saude.gov.br/bvs/publicacoes/relatorio_anual_gestao_2024.pdf) mede cobertura por equipes. | O cenário trata recurso adicional como aumento gradual de capacidade/cobertura. A relação é coerente com o mecanismo institucional, mas não estima quantos pontos percentuais cada real compra em todos os territórios. |
| R2 | V4 cobertura estimada da APS → V6 pressão hospitalar | `↓`; atraso médio | Material técnico do [Ministério da Saúde sobre condições crônicas na APS](https://bvsms.saude.gov.br/bvs/publicacoes/cuidado_condicoes_atencao_primaria_saude.pdf) reúne estudos brasileiros sobre internações sensíveis à atenção ambulatorial. | Maior cobertura pode prevenir ou tratar parte da demanda antes do hospital. Não reduz toda pressão: urgências, capacidade hospitalar e desigualdade territorial ficam agregadas no índice. |
| R3 | V4 cobertura estimada da APS → V5 saúde da população | `↑`; atraso longo | O [Relatório Anual de Gestão de 2024](https://bvsms.saude.gov.br/bvs/publicacoes/relatorio_anual_gestao_2024.pdf) associa a ampliação de equipes à reorganização territorial, vínculo e cuidado integral. | “Saúde da população” é índice de jogo, não a mesma métrica da fonte. O vínculo é uma hipótese de agregação e não deve receber coeficiente com aparência de resultado científico. |
| R4 | V6 pressão hospitalar → V5 saúde da população | `↓`; atraso curto a médio | Hipótese de design baseada na própria definição de V6 como pressão sobre capacidade de atendimento. | O recorte não mede fila, leito, mortalidade ou qualidade separadamente; este elo concentra efeitos possíveis de sobrecarga. Incerteza alta e limite de saturação são necessários. |
| R5 | P2 / recursos de atendimento e proteção às mulheres → V8 proteção efetiva às mulheres | `↑`; implantação e atraso médio | O [Decreto 11.431/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11431.htm) institui programa para integrar e ampliar serviços, com unidades, atendimento, qualificação e articulação entre entes. | A direção decorre do objetivo e dos instrumentos do programa. O índice V8 não é uma estatística oficial pronta; parceria local, capacidade e qualidade podem limitar o resultado. |
| R6 | P3 / recursos de prevenção e cooperação em segurança → V7 violência letal | `↓`; atraso longo | A [Lei 13.675/2018](https://www.presidencia.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13675.htm) e a página do [Susp](https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/susp) incluem prevenção, integração e redução da letalidade violenta entre seus objetivos. | Objetivo legal não demonstra redução automática ou uniforme de homicídios. O efeito será uma hipótese conservadora, com incerteza alta e sem controle federal imaginário sobre polícias estaduais. |
| R7 | V7 violência letal → V6 pressão hospitalar | `↑`; atraso curto | O [VIVA Inquérito](https://www.gov.br/saude/pt-br/composicao/svsa/inqueritos-de-saude/viva-inquerito) acompanha atendimentos por violências em urgência e emergência; o inquérito de 2024 coletou dados em 627 serviços. | Violência letal é somente uma parte da violência atendida em saúde. Esta relação usa V7 como sinal agregado de exposição, não como contagem de todos os atendimentos gerados por violência. |
| R8 | Evento: aumento temporário de demanda → V6 pressão hospitalar | `↑`; imediato enquanto o evento vigorar | Hipótese de cenário criada em SG049 para testar resiliência. | Não é epidemia, projeção ou série histórica. Duração, intensidade e dissipação serão parâmetros do jogo. |

As relações R1, R5 e R6 começam em políticas. R2–R4 e R7 são a cadeia de indicadores. R8 é uma ocorrência. Isso mantém a origem de cada efeito auditável no mapa e no motor.

## Consequências percebidas pelos perfis

As relações numéricas não calculam voto ou aprovação diretamente. Elas alteram condições do país; a camada de jogo futura avaliará como cada perfil percebe essas mudanças. A tabela já fixa a diferença que SG053 e a Fase 7 deverão preservar.

| Mudança causada por decisão | Perfil A — maior dependência da rede pública (55%) | Perfil B — trabalho e circulação sob pressão da violência (45%) |
| --- | --- | --- |
| Aumentar P1, elevando V4 e reduzindo V6 gradualmente | Efeito principal: acesso e menor sobrecarga são sentidos diretamente no cuidado cotidiano. | Efeito secundário: melhor atendimento reduz risco e custo de uma necessidade de saúde, mas não é sua maior preocupação no recorte. |
| Aumentar P2, elevando V8 gradualmente | Efeito principal para quem precisa de acolhimento e rede pública; a avaliação não equivale a queda instantânea de todos os crimes. | Efeito moderado: proteção e segurança cotidiana podem melhorar, mas este perfil não substitui a população atendida por uma única experiência. |
| Aumentar P3, reduzindo V7 gradualmente | Efeito relevante por diminuir exposição e eventual pressão sobre saúde, porém indireto. | Efeito principal: violência interfere em deslocamento, trabalho e atividade econômica; o benefício aparece depois do atraso de segurança. |

O peso de um perfil entra uma vez no cálculo agregado. Compartilhar interesse em saúde, proteção ou segurança não cria uma segunda parcela de população. Opinião sobre P1, P2 ou P3 continua separada de aprovação do governo, aprovação do ministro e dos valores V4–V10.

## Relações deliberadamente excluídas

| Relação não usada | Motivo |
| --- | --- |
| V8 proteção efetiva às mulheres → V7 violência letal | A taxa nacional de homicídios é ampla demais para representar diretamente o resultado da rede específica. O cenário não alegará esse efeito sem variável intermediária e evidência mais adequada. |
| P2 → V7 diretamente | Repetiria o problema anterior e ainda pularia o próprio indicador de proteção. |
| V9 despesa recorrente → V10 saldo orçamentário como consequência do grafo | É contabilidade derivada, não impacto social. Será calculada uma vez na camada de finanças para evitar cobrança ou efeito duplicado. |
| P1/P2/P3 → V5 ou V6 sem passar pelos indicadores intermediários | Duplicaria caminhos R1–R4 e esconderia por que o resultado mudou. |
| V7 → V5 saúde da população | Pode haver consequências reais, mas o primeiro recorte já representa a pressão de saúde em R7 e R4. Adicionar a seta direta contaria uma consequência agregada duas vezes. |

## Como a interface deverá explicar a cadeia

Quando a pessoa focar uma bolinha do mapa, as linhas diretas mostram apenas aumento ou redução do alvo. O detalhe textual informa a leitura do alvo e o estado temporal:

`P3 em implantação → V7 reduz após atraso → V6 pode cair depois → V5 pode melhorar.`

O mapa não deve colorir R6 como “boa” só porque reduz violência, nem R8 como “boa” só porque aumenta um número: cor e seta mostram sentido numérico; o indicador explica se maior ou menor é desejável. A força e o ritmo visual das linhas serão parâmetros de SG053 e podem refletir somente a influência atualmente ativa, não certeza científica.

## Pendências que SG053 deve resolver

1. Escolher limites, formato de resposta, saturação e atraso de cada relação, sem alterar as unidades de SG051.
2. Definir a velocidade separada de implantação e degradação de P1, P2 e P3.
3. Fixar intervalo de incerteza para R4, R6, R7 e R8, que são as hipóteses mais frágeis.
4. Decidir como sinalizar parceria local pendente em P2 e P3 antes de aplicar a influência.
5. Verificar trajetórias de referência antes de escrever o JSON final em SG054.

SG052 conclui a seleção e a justificativa das relações. Não entrega coeficientes, atrasos numéricos, cálculos de perfil, efeitos eleitorais ou conteúdo JSON final.
