# Briefing: biblioteca de ícones das leis

> **Status: VIGENTE (22/out/2026).**
> A lista completa de leis, uma por linha, com o desenho de cada uma, está
> em [icones-das-leis.md](icones-das-leis.md) (seção 6). **Este briefing
> substitui o estilo pintado**: os ícones são futuristas.

## 1. O que é o jogo

SisGov é um jogo de estratégia política em português. O jogador é um
partido que governa um país (começa pelo Brasil): muda leis, cuida do
orçamento e enfrenta eleições a cada quatro anos. A tela principal é um
**mapa político** com 11 áreas de governo (economia, saúde, segurança…).
Ao abrir uma área, as **leis** aparecem como **bolhas** redondas que o
jogador clica para mudar.

## 2. Para que servem os ícones

Cada lei tem **um ícone exclusivo** que aparece **dentro da bolha** dela no
mapa, com 40 a 90 px na tela. Hoje as bolhas são todas iguais e o jogador
não sabe para onde olhar. O ícone tem de fazer o jogador **reconhecer a lei
sem ler o nome** e **ver o tipo dela de longe** (imposto, verba, regra,
setor, programa, Constituição).

São cerca de **270 ícones: um por lei**, mais as peças de interface e os
setores. **Faça todos**, área por área, na ordem da seção 7.

## 3. Estilo: futurista

Um **painel de comando holográfico** de um governo do futuro próximo.

- **Linhas luminosas** (traço de néon fino, com brilho suave em volta)
  desenhando **um objeto** em perspectiva leve de 3/4, como um holograma.
- **Fundo do ícone:** um disco de **vidro escuro** (`#0d1620` a `#16222e`),
  com reflexo fino no alto e uma grade técnica bem fraca. Borda do disco
  com um anel fino na cor da família.
- **Uma cor principal por família** (seção 4), no traço e no brilho;
  branco-azulado `#e6f6ff` nos detalhes. Nada de outras cores.
- **Legível em 40 px:** um objeto grande, centrado, silhueta clara; no
  máximo um detalhe pequeno (o selo da família). Sem cena atrás.
- **Sem texto, letras ou números**, salvo o `%` no selo dos impostos.
- **Temas sensíveis** (aborto, suicídio assistido, pena de morte, drogas,
  prostituição): objeto simbólico e neutro, sem corpo, sem sangue, sem
  tomar partido.
- **Nada de marca, bandeira, logotipo real ou pessoa real.**
- **Toda a biblioteca igual:** mesma espessura de traço, mesmo brilho,
  mesmo disco, mesma perspectiva. Quem olha 20 ícones juntos vê uma família.

## 4. Famílias (a cor diz o tipo da lei)

| Família | Cor principal | Selo pequeno no canto inferior direito | Exemplo |
| --- | --- | --- | --- |
| Imposto | âmbar `#ffb238` | hexágono com `%` | carro + selo % = imposto sobre veículos |
| Verba | verde `#3fe0a0` | pequena pilha de moedas | trilho + moedas = verba para ferrovias |
| Dono de setor | violeta `#b48cff` | chave | barril + chave = dono do petróleo |
| Regra | ciano `#38c8ff` | sem selo | balança, porta, relógio |
| Programa | coral `#ff7a5c` | pequena seta circular (ação ligada) | prato + seta = comida garantida |
| Constitucional | branco-azulado `#e6f6ff` com anel duplo | pequeno livro aberto | banco + livro = quem manda no banco central |

Peças de interface e setores (seções 4 e 5 da lista) usam ciano, sem selo.

## 5. Arquivo

- **PNG com fundo transparente, 512 × 512 px.** O disco ocupa um círculo de
  480 px, centrado; nada fora dele (a bolha recorta).
- **Pastas** dentro do projeto:
  - `src/assets/svg/ui/` peças de interface;
  - `src/assets/svg/setor/` setores;
  - `src/assets/svg/leis/<área>/` uma pasta por área: `economia`,
    `empresas`, `trabalho`, `previdencia`, `saude`, `educacao`,
    `infraestrutura`, `ambiente`, `seguranca`, `direitos`, `governo`.
- **Nome:** o nome da lei em minúsculas, sem acento, com hífen
  ("Imposto sobre veículos" → `imposto-sobre-veiculos.png`).
- **Não precisa mexer em código nem no manifesto.** O Claude liga cada
  arquivo à sua lei.

## 6. Prompt para cada ícone (em inglês)

Troque só as linhas `FAMILY` e `SUBJECT`:

```
Futuristic game icon for a political strategy game. Holographic command-panel style: a single object drawn with thin glowing neon lines and a soft glow, slight 3/4 perspective, like a hologram. Background: a round dark glass disc (#0d1620 to #16222e) with a thin top reflection and a very faint technical grid, rimmed by a thin ring in the family color. Transparent PNG, 512x512 px; the disc is a perfect circle 480 px wide, centered, nothing outside it. One large centered object with a clear silhouette readable at 40 px, plus at most one small badge in the lower-right. Only the family color and pale ice white #e6f6ff. No text, no letters, no numbers (except % on the tax badge), no faces, no flags, no logos, no scene.

FAMILY: TAX — main color amber #ffb238; small hexagon badge with a % sign.
SUBJECT: a compact family car.
```

Linhas `FAMILY` prontas:

```
FAMILY: TAX — main color amber #ffb238; small hexagon badge with a % sign.
FAMILY: BUDGET — main color green #3fe0a0; small stack of coins badge.
FAMILY: OWNERSHIP — main color violet #b48cff; small key badge.
FAMILY: RULE — main color cyan #38c8ff; no badge.
FAMILY: PROGRAM — main color coral #ff7a5c; small circular arrow badge.
FAMILY: CONSTITUTION — main color ice white #e6f6ff with a double rim ring; small open book badge.
FAMILY: INTERFACE — main color cyan #38c8ff; no badge.
```

A linha `SUBJECT` vem da coluna "Desenho" da lista (traduza para inglês,
sem o "moeda%", "saco de dinheiro" ou "livro +", que agora são o selo da
família).

## 7. Ordem e entrega

1. **Folha de prova primeiro:** 6 ícones, um de cada família (imposto
   sobre veículos, verba para ferrovias, dono do petróleo, direito de
   greve, comida garantida, quem manda no banco central), lado a lado em
   40 px e 128 px. O autor aprova o estilo antes de seguir.
2. Peças de interface (17) e setores (11).
3. Economia (32) e empresas (19).
4. As outras áreas, na ordem da lista.

Ícone que faltar não quebra o jogo: a bolha usa o desenho antigo.
