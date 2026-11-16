# Estilos de arte possíveis para o SisGov

Levantamento feito por um agente Sonnet em 12/nov/2026, a pedido do autor. É ponto de partida para escolher o estilo de arte; a decisão é do autor.

Premissa: o mapa tem centenas de bolhas e muito texto pequeno. O estilo precisa de contorno claro, poucas cores por elemento e textura contida.

## 1. Vetor chapado com contorno grosso

Formas de cor sólida, sem degradê, com contorno uniforme e geometria simplificada.

- No SisGov: fundo de cor lisa, regiões com linha grossa, bolhas de cor sólida por área com ícone simples, Presidência como prédio de poucos blocos, ministros como bustos geométricos.
- Tom: moderno, claro, acessível. Pouco peso institucional.
- Prós: melhor legibilidade; fácil variar cor por estado; escala bem; produção barata.
- Contras: é o estilo mais genérico; precisa de paleta e forma de assinatura.
- IA: alta, mas é preciso fixar paleta e espessura de linha em todo o conjunto. Ícones das leis: redesenhar em vetor.

## 2. Pixel art

Imagens em grade pequena, paleta limitada, sem suavização.

- No SisGov: mapa como tabuleiro de tiles, Presidência como construção em pixel, bolhas pixeladas com ícone de 16x16, ministros como retratos de pixel.
- Tom: leve, lúdico, "jogo de verdade". Reduz o peso político.
- Prós: ícones pequenos continuam reconhecíveis; coeso.
- Contras: texto em fonte pixel pequena cansa com acentos em tela grande; muito usado; retratos em pixel perdem a ironia institucional.
- IA: média a baixa. A IA erra a grade e mistura tamanhos de pixel. Exige limpeza manual.

## 3. Gravura (água-forte)

Traço fino e hachura para dar volume, como em cédula ou jornal antigo, impresso em uma ou duas tintas sobre papel claro.

- No SisGov: papel creme, regiões em hachura de densidade variável (densidade = intensidade), bolhas como medalhões com moldura, Presidência em perspectiva, ministros como bustos de nota de dinheiro.
- Tom: autoridade, tradição, "poder que se carimba".
- Prós: identidade forte; tom institucional de graça; sofisticado sem cores demais.
- Contras: hachura fina vira ruído em tamanho pequeno; centenas de bolhas ornamentadas pesam.
- IA: média. Bons retratos, mas ícones pequenos saem inconsistentes.

## 4. Xilogravura / cordel

Traço grosso e irregular, preto mais uma ou duas cores chapadas, alto contraste, como carimbo de madeira.

- No SisGov: folha de cor suave, bolhas de borda irregular com símbolo cortado, Presidência em bloco grosso, ministros como rostos de poucas linhas.
- Tom: brasileiro, popular, irônico. Poder sem ser sério demais.
- Prós: forte identidade nacional; traço grosso lê bem em tamanho pequeno; poucas cores.
- Contras: pode parecer sujo em interface densa; pouca sutileza para estados; risco de caricatura.
- IA: média. Gerar um kit curto (10 a 15 símbolos) e padronizar em alto contraste.

## 5. Aquarela / nanquim

Cor translúcida em manchas com bordas que escorrem, contorno à tinta.

- No SisGov: manchas de cor sobre as regiões, bolhas como gotas, Presidência em lavado.
- Tom: humano, artesanal, contemplativo. Mais narrativa que simulador.
- Prós: bonito em tela grande; calor humano; boas transições de cor.
- Contras: pior legibilidade da lista; centenas de bordas orgânicas viram bagunça; contraste fraco.
- IA: alta para fundos, cenas e retratos; baixa para ícones e interface.

## 6. Cartografia antiga

Mapa histórico: linhas de tinta, relevo hachurado, cartelas, tipografia de época.

- No SisGov: o mapa como mapa antigo, Presidência como fortaleza ao centro, bolhas de lei como brasões ligados por rotas, ministros em cartelas.
- Tom: exploração. Reforça a metáfora de órbita.
- Prós: combina com a tela (órbitas e ligações como rotas); atmosférico.
- Contras: pode cair em fantasia ou pirataria; ornamentos competem com o texto.
- IA: média a alta para o fundo; baixa para interface, porque as cartelas com texto saem ilegíveis.

## 7. Colagem / recorte

Papéis recortados, fotomontagem, trama de pontos (halftone), cores fortes e limitadas, como cartaz ou panfleto.

- No SisGov: mesa de papel colorido, bolhas como círculos recortados com símbolo, Presidência em fotocópia com trama, ministros como retratos recortados sobre fundo de cor.
- Tom: irreverente, ligeiramente satírico. Convida a testar extremos.
- Prós: tom de poder institucional sem ser sério demais; forte personalidade; cores chapadas.
- Contras: exagerada, polui a tela cheia de informação; difícil manter coerência entre centenas de peças.
- IA: média. Bons cartazes e retratos; bolhas e botões saem inconsistentes. Melhor montar por código.

## Recomendação do agente

Vetor chapado com contorno grosso como base da interface, com xilogravura só nos retratos, nas cenas e nos emblemas maiores (Presidência, ministros, telas de evento). A interface fica com código e vetor, onde a IA é fraca em consistência. A xilogravura dá a identidade brasileira e o tom irônico que faltam ao vetor sozinho.

## Observação

A tela pixel que o autor aprovou como "quase perfeito" não aparece como recomendação. Ela é uma alternativa válida, com o custo de limpeza manual que o levantamento descreve na seção 2.

## Estudo de encaixe (agente Sonnet, 12/nov/2026)

**Achado de base:** há três direções em conflito nos documentos. A bíblia pede materialidade analógica. O briefing dos ícones pede "futurista holográfico", com néon e vidro. As artes de tela citam o "Dossiê Tropical". A recomendação de vetor com xilogravura resolve a legibilidade, mas não resolve essa contradição.

**Encaixe por peça:**

- Fundo do mapa: cartografia antiga, com linha fina e baixo contraste (abaixo de cerca de 10%).
- Presidência: xilogravura, com silhueta em vetor.
- Ministérios, esferas, bolhas de lei, índices, grupos, potências, botões, barra do topo, ícones das leis, Congresso: vetor chapado. Potências ganham cartela de cartografia só ao abrir a ficha; Congresso ganha moldura em gravura.
- Retratos dos ministros: xilogravura (gravura na ficha grande).
- Papéis da Mesa: gravura na moldura, corpo do texto em serifa limpa, sem textura sobre as linhas.
- Carimbos: xilogravura, que é a técnica original de carimbo de madeira.
- Tela de abertura: colagem (cena da mesa), com título SISGOV em xilogravura. Botões em vetor.
- Carregamento: cartografia, com gravura e texto datilografado por cima.
- Emblemas de área: xilogravura.
- Textos: serifa de máquina de escrever em papel e título; sans limpa na interface.

**Recomendação do estudo:** vetor chapado como sistema, xilogravura como assinatura, cartografia só no fundo do mapa e no carregamento, colagem só na abertura. A bíblia passa a valer como direção de tom, e deixa de ser regra de textura em tudo.

**Fixo no jogo:** paleta da bíblia; contorno grosso e uniforme; carimbo xilográfico em toda ação; cor da esfera na bolha e cor da família no contorno; serifa de máquina em papel e título, sans na interface.

**Decisões do autor em aberto:**

1. Revogar o briefing futurista dos ícones e refazer cerca de 270 ícones em vetor chapado.
2. A bíblia vale como tom (recomendado) ou como regra de textura (inviável com 500 bolhas).
3. Abertura em colagem (mais trabalho, mais identidade) ou xilogravura com vetor (mais barato).
4. Retratos em xilogravura (mais brasileiro) ou gravura (mais institucional).
5. Uma ou duas tintas na xilogravura.
6. Aceitar o fundo cartográfico com teto de contraste de cerca de 10%.

**Descartados:** pixel (conflita com os pilares analógicos) e aquarela (perde legibilidade).
