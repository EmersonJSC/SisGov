# Renderização espacial com PixiJS

A tela principal em `mapa-leis.html`, também disponível pela rota `/`, usa PixiJS
apenas para desenhar o mapa espacial.
O HTML e os componentes React continuam responsáveis pelos
controles, filtros, diário e diálogos; os botões HTML do mapa preservam nomes,
foco, seleção por teclado e a representação disponível a leitores de tela. O
canvas é decorativo e fica fora da árvore acessível.

`src/world/worldViewModel.ts` converte o layout visual existente e os dados da
simulação em áreas, representantes, grupos, nós e relações para apresentação.
`src/world/worldCamera.ts` implementa pan, zoom, foco, enquadramento e inércia
como operações puras, independentes de DOM e PixiJS. `src/ui/PixiWorldRenderer.ts`
é o adaptador de renderização: reconcilia os objetos Pixi, aplica níveis de
detalhe e acompanha o tamanho do host com `ResizeObserver`.

Políticas, indicadores e situações permanecem como nós individuais em todos os
níveis de zoom; o nível de detalhe altera rótulos e informações auxiliares, não
substitui as políticas por agrupamentos. As políticas usam um ícone padrão
quando o cenário não fornece um ícone próprio. Quando nós pequenos se
sobrepõem, o ponteiro destaca e seleciona o centro mais próximo, enquanto cada
botão continua acessível por teclado.
As políticas ficam em órbitas visíveis ao redor de seus representantes; suas
posições permanecem estáveis entre atualizações e a física só é reativada
quando uma métrica de influência/finanças ou um tamanho-alvo muda.

As relações destacadas preservam a direção causal e usam verde para efeitos
positivos e vermelho para negativos. Partículas percorrem as setas; sua
velocidade e tamanho acompanham a força normalizada da relação. Com movimento
reduzido, as setas permanecem estáticas.

O layout continua sendo calculado por `MapPhysics`; a câmera altera somente a
apresentação. O renderer não importa nem executa o motor de simulação, não
modifica cenários e não decide turnos. As mudanças em políticas, métricas e
situações continuam passando pelo fluxo existente em `lawMapDemo.ts`.

O renderer deve ser inicializado e destruído junto com a página que o hospeda.
Seu observer de redimensionamento é desconectado na destruição. Falhas de
inicialização são registradas no diário e não devem ser tratadas como uma
renderização bem-sucedida.

Os testes unitários de `worldCamera` e `worldViewModel` não dependem de GPU ou
navegador. A página raiz, o hover e a seleção em zoom de visão geral foram
verificados no navegador de desenvolvimento. Ainda é necessária validação
manual nos navegadores suportados, em dispositivos touch e com leitores de
tela.
