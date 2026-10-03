# Catálogo inicial de políticas do SisGov

**Estado:** referência de design; ainda não é conteúdo executado pelo motor.  
**Origem analisada:** `docs/Exemplos/simulation/`, cópia local fornecida pelo usuário dos CSVs do *Democracy 4*.  
**Data:** 3 de outubro de 2026.

## O que foi encontrado

| Arquivo de referência | Itens carregáveis | Uso no SisGov |
| --- | ---: | --- |
| `policies.csv` | 270 | Ideias de decisões públicas. |
| `simulation.csv` | 76 | Ideias de indicadores. |
| `situations.csv` | 79 | Ideias de situações que começam e terminam por condições. |

O jogo de referência organiza políticas em sete grupos: política externa, bem-estar, economia, tributos, serviços públicos, lei e ordem e transportes. O SisGov não herdará esses grupos como estrutura final. Ele os reorganiza por **ministérios** e mantém indicadores e situações fora das esferas ministeriais.

Os CSVs mostram uma boa variedade de ações: financiamento, tributos, serviços, regras, fiscalização e campanhas. Eles não são uma base brasileira, nem suas fórmulas, custos, poderes institucionais ou classificações serão copiados. Cada item abaixo é uma adaptação de ideia para ser definida no cenário brasileiro.

## Regra de adaptação

Uma política do catálogo só entra em um cenário quando receber:

1. órgão ou esfera responsável;
2. tipo de decisão: verba, regra discreta, tributo, serviço ou programa;
3. indicador de entrada e consequências diretas;
4. prazo de implantação, atraso e eventual degradação;
5. custo ou receita na unidade do cenário;
6. requisitos, autorização e reação das classes quando a Fase 7 definir essas regras.

Isso impede que “uma lei” seja tratada como um botão mágico. O jogador altera a execução financeira, o alcance de uma regra ou a prioridade de um programa; os resultados aparecem depois no mapa.

## Políticas candidatas traduzidas

| ID proposto | Política no SisGov | Tipo jogável | Esfera inicial | Referência no CSV | Indicadores e situações candidatos |
| --- | --- | --- | --- | --- | --- |
| `aps-financiamento` | Financiamento da atenção primária | verba anual | Saúde | `StateHealthService` | cobertura da APS, pressão hospitalar, saúde da população, sobrecarga do atendimento |
| `vacinacao-campanha` | Campanha nacional de vacinação | verba anual | Saúde | `HealthFoodSubsidies` / campanhas de saúde | cobertura vacinal, risco de surtos, demanda hospitalar |
| `saude-mental-rede` | Rede de cuidado em saúde mental | verba anual | Saúde | `DrugTreatment` | saúde mental, demanda hospitalar, situação de crise de atendimento |
| `medicamentos-essenciais` | Assistência farmacêutica essencial | verba anual | Saúde | `HealthcareVouchers` | acesso a tratamento, pressão hospitalar, saúde da população |
| `alimentacao-escolar` | Alimentação escolar | verba anual | Educação | `FreeSchoolMeals` | frequência escolar, insegurança alimentar, saúde infantil |
| `tempo-integral` | Expansão da escola em tempo integral | verba anual | Educação | `StateSchools` | frequência escolar, aprendizagem, evasão escolar |
| `formacao-docente` | Formação continuada de professores | verba anual | Educação | `AdultEducationSubsidies` | qualidade educacional, aprendizagem, falta de professores |
| `bibliotecas-publicas` | Rede de bibliotecas públicas | verba anual | Cultura e Educação | `PublicLibraries` | acesso cultural, aprendizagem, inclusão digital |
| `creches-publicas` | Expansão de creches públicas | verba anual | Educação e Cuidados | `ChildcareProvision` | participação no trabalho, desenvolvimento infantil, demanda por vagas |
| `rede-protecao-mulheres` | Rede de acolhimento e proteção às mulheres | verba anual | Mulheres | `WitnessProtectionProgram` | proteção efetiva, violência contra mulheres, capacidade de acolhimento |
| `autonomia-economica-mulheres` | Programa de autonomia econômica das mulheres | programa com verba | Mulheres e Trabalho | `YoungEntrepreneurScheme` | renda das mulheres, autonomia, desigualdade de gênero |
| `policiamento-comunitario` | Policiamento comunitário e prevenção local | verba anual | Justiça e Segurança Pública | `CommunityPolicing` | violência letal, confiança institucional, situação de crime organizado |
| `cameras-corporais` | Uso de câmeras corporais | regra de alcance | Justiça e Segurança Pública | `BodyCameras` | controle de uso da força, confiança institucional, denúncias apuradas |
| `investigacao-homicidios` | Reforço à investigação de homicídios | verba anual | Justiça e Segurança Pública | `PoliceForce` | esclarecimento de homicídios, violência letal, impunidade percebida |
| `prevencao-violencia-juventude` | Prevenção da violência para juventudes | programa com verba | Justiça e Segurança Pública | `YouthClubSubsidies` | violência letal, oportunidades juvenis, situação de recrutamento criminal |
| `defensoria-acesso` | Ampliação do acesso à Defensoria Pública | verba anual | Justiça | `LegalAid` | acesso à justiça, população carcerária, sobrecarga judicial |
| `integridade-publica` | Fortalecimento da integridade pública | verba anual | Controladoria e Justiça | `AntiCorruptionAgency` | risco de corrupção, confiança institucional, capacidade estatal |
| `fiscalizacao-ambiental` | Fiscalização ambiental federal | verba anual | Meio Ambiente | `PollutionControls` | desmatamento, emissões, situação de poluição crítica |
| `restauracao-florestal` | Programa de restauração florestal | programa com verba | Meio Ambiente | `Reforestation` | cobertura vegetal, emissões, risco climático |
| `transicao-energetica` | Incentivo à transição energética | programa com verba | Minas e Energia | `CleanEnergySubsidies` | emissões, custo de energia, segurança energética |
| `transporte-coletivo` | Apoio federal ao transporte coletivo urbano | verba anual | Cidades e Transportes | `BusSubsidies` | tempo de deslocamento, uso de ônibus, congestionamento |
| `mobilidade-ativa` | Infraestrutura de mobilidade ativa | verba anual | Cidades e Transportes | `BicycleSubsidies` | uso de bicicleta, acidentes, emissões urbanas |
| `seguranca-viaria` | Programa de segurança viária | programa com verba | Transportes | `SpeedCameras` | mortes no trânsito, acidentes, confiança na fiscalização |
| `moradia-social` | Produção e melhoria de moradia social | programa com verba | Cidades | `StateHousing` | déficit habitacional, população em situação de rua, custo de moradia |
| `regularizacao-fundiaria` | Regularização fundiária urbana | programa com verba | Cidades | `RentControls` | segurança de posse, vulnerabilidade habitacional, acesso a serviços |
| `transferencia-renda` | Transferência de renda focalizada | benefício com verba | Desenvolvimento Social | `FoodStamps` / `UnemployedBenefit` | pobreza, insegurança alimentar, consumo das famílias |
| `assistencia-social` | Fortalecimento da assistência social | verba anual | Desenvolvimento Social | `SocialCare` | proteção social, pobreza, situação de desassistência |
| `qualificacao-profissional` | Qualificação profissional e intermediação de emprego | programa com verba | Trabalho | `TechnologyColleges` | desemprego, renda do trabalho, falta de qualificação |
| `microcredito-produtivo` | Microcrédito produtivo orientado | programa com verba | Trabalho e Desenvolvimento | `SmallBusinessGrants` | formalização, renda, sobrevivência de pequenos negócios |
| `imposto-renda-progressivo` | Ajuste da progressividade do imposto de renda | tributo com faixas | Fazenda | `IncomeTax` / `FlatTax` | receita, desigualdade, renda disponível |
| `tributacao-patrimonio` | Tributação sobre patrimônio de alta renda | tributo com faixas | Fazenda | `InheritanceTax` / `MansionTax` | receita, desigualdade, planejamento tributário |
| `combate-evasao-fiscal` | Combate à evasão fiscal | verba anual e regra | Fazenda | `WelfareFraudDept` / `TaxEvasion` | arrecadação efetiva, confiança tributária, situação de evasão persistente |
| `empreendedorismo-inovacao` | Crédito e apoio à inovação produtiva | programa com verba | Desenvolvimento | `TechnologyGrants` | produtividade, emprego qualificado, atividade econômica |
| `defesa-civil-clima` | Prevenção e resposta a desastres climáticos | verba anual | Integração e Meio Ambiente | `ClimateChangeAdaptionFund` | exposição a desastre, capacidade de resposta, situação de emergência climática |

## Situações que valem adaptar

Situações não são leis. Elas devem surgir e cessar por condições do país e então produzir novas consequências enquanto ativas.

| Situação proposta | Referência no CSV | Entra quando | Pode influenciar |
| --- | --- | --- | --- |
| Sobrecarga do atendimento | `HospitalOvercrowding` | pressão hospitalar supera limite do cenário | saúde da população, aprovação de classes dependentes do SUS |
| Crise de evasão escolar | `TeacherShortage` | frequência e qualidade educacional se deterioram por período | aprendizagem, oportunidades juvenis |
| Recrutamento criminal juvenil | `StreetGangs` | violência e falta de oportunidades persistem | violência letal, confiança institucional |
| Superlotação prisional | `PrisonOvercrowding` | ocupação prisional supera capacidade | reincidência, direitos humanos, custo público |
| Desassistência habitacional | `Homelessness` | déficit e vulnerabilidade habitacional superam limite | saúde, segurança, aprovação de classes vulneráveis |
| Evasão fiscal persistente | `TaxEvasion` | fiscalização baixa e oportunidade de evasão alta | arrecadação, confiança tributária |
| Emergência climática local | `Cyclones` / `Watershortage` | exposição climática e capacidade de resposta cruzam limites | orçamento, saúde, infraestrutura |
| Crise de abastecimento energético | `PowerBlackouts` | segurança energética cai abaixo de limite | atividade econômica, aprovação geral |

## Indicadores que merecem entrar no mapa

Estes são candidatos a indicadores visuais, não uma lista que deva ser implementada de uma vez.

| Área | Indicadores propostos |
| --- | --- |
| Saúde | cobertura de atenção primária, pressão hospitalar, saúde mental, acesso a medicamentos, cobertura vacinal |
| Educação | frequência escolar, aprendizagem, evasão escolar, disponibilidade de vagas em creche |
| Segurança e Justiça | violência letal, esclarecimento de homicídios, confiança institucional, acesso à justiça, população prisional |
| Mulheres | proteção efetiva, autonomia econômica, violência contra mulheres |
| Economia e Fazenda | receita, despesa, saldo, dívida, desemprego, renda do trabalho, desigualdade |
| Cidades e Transportes | tempo de deslocamento, cobertura de transporte coletivo, acidentes de trânsito, déficit habitacional |
| Meio Ambiente | emissões, cobertura vegetal, exposição climática, segurança energética |

## Primeiro lote no mapa

Não é produtivo colocar as 34 políticas no protótipo de uma vez. O primeiro lote começou com as políticas já existentes de Saúde e Segurança e agora acrescenta duas políticas realmente carregadas pelo cenário: **Alimentação escolar** e **Expansão de creches públicas**. Ambas aparecem dentro da esfera do Ministério da Educação, aceitam alteração de verba e só produzem efeitos conforme sua implantação gradual.

O lote forma três cadeias fáceis de observar:

1. **Saúde:** atenção primária → pressão hospitalar → saúde da população → sobrecarga do atendimento.
2. **Segurança:** prevenção e cooperação → violência letal → confiança institucional → recrutamento criminal juvenil.
3. **Educação e cuidados:** alimentação escolar e creches → frequência escolar e participação no trabalho → oportunidades juvenis → violência letal.

Esse lote preserva as três esferas originais, acrescenta Educação como quarta esfera e cria efeitos entre ministérios. Os coeficientes e prazos são hipóteses explícitas de design para o protótipo, não estimativas empíricas. Depois validamos as relações no mapa antes de incorporar Fazenda, Meio Ambiente, Cidades e outras áreas.

## Próxima decisão de conteúdo

Escolher o primeiro lote não significa inventar os números agora. Para cada uma das seis políticas, o próximo trabalho é declarar a ação concreta do jogador, a unidade, a escala inicial, custo, indicador direto, atraso e classes mais afetadas. A Fase 7 então definirá como essas classes reagem politicamente e como propostas são aprovadas ou rejeitadas.
