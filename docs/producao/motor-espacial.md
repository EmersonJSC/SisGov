# Motor espacial: esferas, leis e resultados

A mesa é um espaço contínuo. Cada nó possui posição, velocidade, raio e massa
visual. A hierarquia espacial não altera os coeficientes nem o estado da simulação.

## Regra institucional

Cada esfera possui um representante central de massa maior:

- Esfera federal: presidente → Constituição e políticas nacionais/federais.
- Esfera ministerial: ministro → políticas relacionadas.

A esfera é uma região envolvente, não uma bolinha concorrendo com os indicadores.
O presidente é um nó visível no centro da esfera federal. A Constituição e as
políticas federais ficam dentro dela, orbitando o presidente. Cada ministro é
um nó visível no centro ministerial, e as políticas correspondentes ficam em
sua esfera. Indicadores e situações ficam fora de todas as esferas, no espaço
livre em volta delas, orbitando a composição e se aproximando das leis que os
influenciam. Órbita significa distância de equilíbrio, não rotação perpétua: o
mapa se move após mudanças e depois repousa para permitir leitura.

As esferas ministeriais mantêm ordem angular ao redor da federal e ajustam sua
distância pelo espaço necessário. Seus centros não fazem gravitação livre entre si.

## Dados e prioridade

`VisualMapDefinition.nodes` usa IDs dos controles, indicadores ou situações:

- `scope: federal`: política de responsabilidade presidencial.
- `scope: national`: resultado de âmbito nacional; isso não o coloca dentro da esfera federal.
- `scope: ministerial`: elemento pertencente a uma esfera ministerial.
- `affinities`: pesos positivos normalizados por ministério.
- `parents`: opcional; IDs de controles de políticas e seus pesos orbitais.

Uma política sem ministério usa a Presidência, sem criar um ministério fictício.
Metadados explícitos prevalecem sobre a área do elemento. Sem esses metadados,
políticas usam seu ministério e resultados usam sua área como alternativa para
identificar influências, nunca como pertencimento a uma esfera.
`presidentName` e `representativeName` permitem definir os nomes dos representantes.
O laboratório usa apenas títulos, sem inventar ocupantes reais dos cargos.

Os pais de um indicador são derivados das consequências que chegam a ele.
O peso relativo é o módulo do coeficiente multiplicado pela amplitude do controle,
normalizado entre as políticas daquele resultado. Isso é um peso visual, não
uma nova estimativa científica. Um coeficiente negativo também cria vínculo:
reduzir um indicador continua sendo influenciá-lo.

As situações herdam vínculos das políticas que afetam seus indicadores de entrada
ou saída. Um índice compartilhado permanece um só nó com vários pais. Os efeitos
continuam sendo relações direcionadas; não são duplicados como índices fictícios.

## Matemática

Para métrica normalizada u, massa das bolinhas m = 1 + 3u. Presidente tem massa
visual 32, ministro 24. Raios dos representantes: 4,5 e 4 unidades, respectivamente.
O raio das políticas/resultados usa a escala por área definida em `mapMetrics`.

Para uma órbita em torno de C, com raio de equilíbrio R:

F = k × (R − |p − C|) × (p − C) / |p − C|.

Uma direção determinística trata coincidência exata com o centro. Para leis
ministeriais, cada força é ponderada pela afinidade e por sqrt(massa_ministro/24).
Leis federais usam a órbita presidencial. Contatos impedem qualquer bolinha de
ocupar o núcleo físico de um representante.

O raio orbital das leis é o maior entre:

- raio do representante + maior raio de lei + margem de 2;
- soma dos diâmetros das leis com folgas, dividida por 2π, mais 1,5.

Resultados setoriais combinam uma órbita em torno do centro ponderado de suas
leis com uma faixa externa ao redor do ministro. Para um só pai, esse centro é
exatamente a lei; para vários, é o centro ponderado, sem duplicação do indicador.
Sem pais, usa-se somente a faixa setorial externa.

Resultados nacionais usam a faixa externa federal. Suas leis relacionadas
influenciam a direção angular, sem puxá-los para dentro de um ministério. A esfera
federal visível envolve também a extensão real dos nós durante a acomodação.

Passo fixo de 1/60 s:

1. Interpolar raios em direção ao filtro atual.
2. Dimensionar órbitas, faixas e regiões institucionais.
3. Somar forças de afinidade e parentesco orbital.
4. Integrar v = 0,82 × (v + T × F/m), limitando o deslocamento.
5. Resolver contatos, incluindo representantes: distância >= r_i + r_j + 0,8.
6. Dissipar oscilação: T começa em 1 e recebe fator 0,99 por passo.
7. Repousar após estabilidade sustentada. Mudanças restauram T sem apagar posições.

Influência e financeiro mudam massa, raio e espaço necessário. As posições se
reacomodam pela física. A câmera não participa dessa conta e não recentraliza.

## Implementação

- `src/mapPhysics.ts`: integração e hierarquia, independente de DOM/React.
- `src/influenceLayout.ts`: contrato visual, representantes e fotografia estática.
- `src/mapMetrics.ts`: métricas e escalas.
- `src/lawMapDemo.ts`: desenho e animação da interface existente.
- `src/scenarios/d4ReferenceSandbox.ts`: exemplos demonstrativos de afinidades e escopos.

A interface existente ainda combina React nos filtros e DOM no mapa; esta alteração
não é uma migração completa de renderização. As políticas federais acrescentadas
ao laboratório são exemplos visuais, com parâmetros demonstrativos.

## Verificação

Testes: determinismo, preservação da simulação, massa dos representantes, contatos,
órbita presidencial e faixa nacional, pais compartilhados, situações, afinidades,
redistribuição por métricas, equivalência 30/60 FPS e repouso/despertar.
