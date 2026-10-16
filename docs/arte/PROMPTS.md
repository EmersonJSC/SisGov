# Artes do SisGov: prompts

Artes feitas por IA por enquanto. Cada arte tem um nome de arquivo fixo: salve com esse nome na pasta indicada dentro de `public/arte/` e o jogo usa sozinho. Fundos, cenas e retratos são JPG; logo e selo são PNG com fundo transparente. Pode jogar as imagens soltas na raiz de `public/arte/`: o Claude identifica, otimiza e coloca cada uma no lugar, e guarda o original em `arte-originais/` (fora do Git). Se um arquivo faltar, a tela mostra um substituto e continua funcionando.

Cada prompt começa com a descrição do projeto e o guia de estilo, para todas as artes saírem iguais. Os prompts estão em inglês porque os geradores respondem melhor assim.

## O estilo: Dossiê Tropical

Uma mistura das três referências, com pesos diferentes:

| Referência | Peso | O que traz |
|---|---|---|
| Suzerain (documental) | base, ~50% | A tela é a mesa do presidente: papel envelhecido, dossiês, fotos analógicas, carimbos, mapas com alfinetes, máquina de escrever. Retratos pintados à mão. Sépia, bege, verde-oliva e cinza militar. |
| Frostpunk (brutalismo) | peso, ~30% | A máquina do Estado: moldura pesada de concreto e ferro, luz âmbar contra sombra fria, botões que parecem placas de metal, arte das consequências das leis. Brasília já é brutalista, então encaixa. |
| Tropico 6 (sátira) | cor e humor, ~20% | Luz tropical, sombra de folha de palmeira, e acentos vivos (amarelo-sol, verde-mata, coral, turquesa) só em carimbos, abas, alfinetes e bandeiras. Rostos um pouco exagerados e expressivos, humor seco nas legendas. Nunca desenho animado. |

**Paleta.** Papel `#efe4cc`, sépia `#8a6a43`, oliva `#5d6b3a`, cinza militar `#4a4f48`, ferro `#1d1f22`, âmbar `#f0a030`. Acentos: sol `#f2c230`, mata `#2e8b57`, coral `#e8644a`, turquesa `#2bb3a8`.

**Na interface.** Papel e fotos para o conteúdo; concreto e ferro para a moldura e os botões grandes; âmbar para o que está ativo; acentos tropicais só em detalhes (carimbo, alfinete, aba).

## Como a primeira tela usa as artes

```
┌─ moldura de concreto ─────────────────────────────────────────┐
│ fundos/fundacao.jpg: a mesa do presidente vista de cima       │
│  [logo/sisgov.png, carimbo]   "Você não é o presidente..."     │
│                                                               │
│  ┌ FICHA DE REGISTRO DE PARTIDO (papel, máquina de escrever) ┐ │
│  │ [logo/emblema.png com a sigla]  Nome ____  Sigla ___      │ │
│  └───────────────────────────────────────────────────────────┘ │
│  DOSSIÊ: CANDIDATOS À PRESIDÊNCIA                             │
│   [polaroid][polaroid][polaroid][polaroid][polaroid] ← retratos│
│   ┌ folha do dossiê, carimbo CONFIDENCIAL: bio e falas ─────┐ │
│   └─────────────────────────────────────────────────────────┘ │
│                           [ placa de ferro: TOMAR POSSE ]     │
└───────────────────────────────────────────────────────────────┘
```

A moldura da polaroid, o alfinete, o papel e os carimbos são feitos pelo jogo. A IA faz só o que está dentro.

## Lista de arquivos

| Arquivo | Onde aparece | Tamanho |
|---|---|---|
| `fundos/fundacao.jpg` | Fundo da primeira tela (a mesa) | 2560×1440 (16:9) |
| `fundos/carregando.jpg` | Tela de carregamento | 2560×1440 (16:9) |
| `logo/sisgov.png` | Logo do jogo | 1600×600, fundo transparente |
| `logo/emblema.png` | Selo do partido (a sigla vai por cima) | 1024×1024, fundo transparente |
| `cenas/campanha.jpg` | Faixa do topo do app Eleição | 2400×600 (4:1) |
| `cenas/vitoria.jpg` | Resultado: vitória | 2400×600 (4:1) |
| `cenas/derrota.jpg` | Resultado: derrota e fim da partida | 2400×600 (4:1) |
| `retratos/{carreira}-m.jpg` e `-f.jpg` | Rosto de cada personagem gerado (34) | 1024×1365 (3:4) |
| `retratos/pessoa-real.jpg` | Pessoas reais (Lula, FHC etc.) | 1024×1365 (3:4) |

**Já no jogo (16/out):** `fundos/fundacao.jpg`, `fundos/carregando.jpg`, `cenas/campanha.jpg`, `cenas/vitoria.jpg`, `cenas/derrota.jpg`. Em `reserva/` ficaram três do primeiro estilo (comício com palco, capital à noite, mesa à noite), para usar depois. Faltam o logo, o selo e os 35 retratos.

**Pessoas reais não ganham rosto de IA.** Rosto de político real feito por IA é deepfake, e os geradores costumam recusar. Elas usam o retrato neutro `pessoa-real.jpg`.

## Fundos e logo

### Fundo da primeira tela: a mesa

Arquivo: `public/arte/fundos/fundacao.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: top-down view of the president's heavy dark-wood desk at the end of the afternoon. Scattered manila dossier folders, a large paper map of a fictional tropical country with colored pins and red string, a brass desk lamp casting an amber pool of light, a fountain pen, a coffee cup ring, an old rotary phone, a few loose analog photos. Tropical sunlight enters from the top-left through a window, throwing long palm-leaf shadows across the desk. The edges of the image show a thick brutalist concrete window frame. Keep the CENTER of the desk mostly clear and darker, because the game lays paper forms there. FORMAT: 16:9, 2560x1440 px.
```

### Tela de carregamento: a capital

Arquivo: `public/arte/fundos/carregando.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: a fictional Brasilia-like capital at golden hour: monumental brutalist concrete ministries in a long row, a parliament with twin towers and a dome and an inverted dome, reflected in a still pool. Hot tropical sky with towering clouds, a few palm trees, tiny people and buses. Windows glowing amber as the day ends. Heavy, monumental, a bit melancholic. Center calm for a loading indicator. FORMAT: 16:9, 2560x1440 px.
```

### Logo do jogo

Arquivo: `public/arte/logo/sisgov.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: game logo: the word "SisGov" as a worn rubber stamp impression in dark ink on nothing, with an official-looking oval border and two small stars, slightly uneven ink like a real stamp; behind it a narrow brass plaque. Transparent background. If the letters come out wrong, generate the stamp border and plaque without text and the game writes the name. FORMAT: 1600x600 px, transparent PNG.
```

### Selo do partido

Arquivo: `public/arte/logo/emblema.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: an empty official party seal, like a wax seal pressed into paper combined with an ink stamp ring: circular, with a laurel ring, small stars and a tiny tropical palm-leaf motif, in olive and sepia ink with a single sun-yellow accent. The CENTER is EMPTY and flat, because the game writes the party initials there. Centered, symmetric, no text. FORMAT: 1024x1024 px, transparent background.
```

## Cenas da eleição

### Campanha (topo do app Eleição)

Arquivo: `public/arte/cenas/campanha.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: a street rally in a tropical city in the late afternoon, painted: a crowd seen from behind, blank banners and flags in coral, turquoise and sun-yellow (no symbols), a sound truck with loudspeakers, brutalist concrete buildings and palm trees in the background, heat haze. Panoramic strip; the left third calmer and darker for a title. FORMAT: 4:1, 2400x600 px.
```

### Vitória

Arquivo: `public/arte/cenas/vitoria.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: election night victory, painted like a historic press photo come to life: a packed campaign headquarters with concrete walls, people hugging and shouting, confetti in sun-yellow and turquoise, a big analog tally board with an abstract rising bar (no numbers), amber lamps, a tired campaign manager smiling with a cigar. Dry humor allowed. Panoramic strip. FORMAT: 4:1, 2400x600 px.
```

### Derrota

Arquivo: `public/arte/cenas/derrota.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: the morning after an election loss: an empty brutalist campaign office, chairs out of place, a deflated coral balloon, blank posters on the floor, a single desk lamp still glowing amber, a cleaner sweeping confetti, cold blue tropical rain on the big concrete window. Melancholic with a touch of dry irony. Panoramic strip. FORMAT: 4:1, 2400x600 px.
```

## Retratos

Um rosto por carreira e gênero. A idade varia no jogo (35 a 75 anos), então o rosto fica numa idade média. Gere todos na mesma conversa ou com a mesma semente, para o elenco sair com o mesmo traço.

### Pessoa real (retrato neutro)

Arquivo: `public/arte/retratos/pessoa-real.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: an anonymous figure in a suit, head and shoulders, the face completely hidden in shadow, painted like a faded archive press photo with subtle halftone grain and sepia tone. No identifiable face. Do NOT add a frame. FORMAT: 3:4 vertical, 1024x1365 px.
```

### sindicalista (homem)

Arquivo: `public/arte/retratos/sindicalista-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a union leader, in his late 50s, in a plain short-sleeved work shirt with a lanyard and union badge. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### sindicalista (mulher)

Arquivo: `public/arte/retratos/sindicalista-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a union leader, in her early 50s, in a plain short-sleeved work shirt with a lanyard and union badge. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### professor (homem)

Arquivo: `public/arte/retratos/professor-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a schoolteacher and university lecturer, in his 40s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### professor (mulher)

Arquivo: `public/arte/retratos/professor-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a schoolteacher and university lecturer, in her 50s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### artista (homem)

Arquivo: `public/arte/retratos/artista-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a artist and musician, in his 40s, in a loose linen shirt, expressive hair, a small earring. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### artista (mulher)

Arquivo: `public/arte/retratos/artista-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a artist and musician, in her late 30s, in a loose linen shirt, expressive hair, a small earring. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### economista (homem)

Arquivo: `public/arte/retratos/economista-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a economist, in his 50s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### economista (mulher)

Arquivo: `public/arte/retratos/economista-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a economist, in her 40s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### empresario (homem)

Arquivo: `public/arte/retratos/empresario-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a businessman, in his 60s, in an expensive navy suit, confident posture, gold watch. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### empresario (mulher)

Arquivo: `public/arte/retratos/empresario-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a businesswoman, in her 50s, in an expensive navy suit, confident posture, gold watch. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### medico (homem)

Arquivo: `public/arte/retratos/medico-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian man, a physician, in his 50s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### medico (mulher)

Arquivo: `public/arte/retratos/medico-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Lebanese descent woman, a physician, in her 40s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### juiz (homem)

Arquivo: `public/arte/retratos/juiz-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a judge, in his 60s, in a black judicial robe over a white collar, stern and calm. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### juiz (mulher)

Arquivo: `public/arte/retratos/juiz-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a judge, in her late 50s, in a black judicial robe over a white collar, stern and calm. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### advogado (homem)

Arquivo: `public/arte/retratos/advogado-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a lawyer, in his 40s, in a dark grey suit, holding a leather folder against the chest. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### advogado (mulher)

Arquivo: `public/arte/retratos/advogado-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a lawyer, in her 40s, in a dark grey suit, holding a leather folder against the chest. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### militar (homem)

Arquivo: `public/arte/retratos/militar-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a retired army general, in his 60s, in an olive military dress uniform without real insignia, short grey hair, upright posture. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### militar (mulher)

Arquivo: `public/arte/retratos/militar-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a retired army general, in her late 50s, in an olive military dress uniform without real insignia, short grey hair, upright posture. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### policial (homem)

Arquivo: `public/arte/retratos/policial-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a police chief, in his late 40s, in a dark police shirt without real insignia, firm look. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### policial (mulher)

Arquivo: `public/arte/retratos/policial-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a police chief, in her 40s, in a dark police shirt without real insignia, firm look. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### pastor (homem)

Arquivo: `public/arte/retratos/pastor-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a evangelical pastor, in his 50s, in a light suit, a Bible held at the chest, warm smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### pastor (mulher)

Arquivo: `public/arte/retratos/pastor-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a evangelical pastor, in her 50s, in a light suit, a Bible held at the chest, warm smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### comunicador (homem)

Arquivo: `public/arte/retratos/comunicador-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian man, a TV and radio host, in his 50s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### comunicador (mulher)

Arquivo: `public/arte/retratos/comunicador-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Lebanese descent woman, a TV and radio host, in her 40s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### ruralista (homem)

Arquivo: `public/arte/retratos/ruralista-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a farmer and agribusiness owner, in his 60s, in a plaid button shirt, a wide-brim hat held in hand, sun-weathered skin. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### ruralista (mulher)

Arquivo: `public/arte/retratos/ruralista-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a farmer and agribusiness owner, in her 50s, in a plaid button shirt, a wide-brim hat held in hand, sun-weathered skin. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### prefeito (homem)

Arquivo: `public/arte/retratos/prefeito-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a city mayor, in his late 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### prefeito (mulher)

Arquivo: `public/arte/retratos/prefeito-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a city mayor, in her 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### governador (homem)

Arquivo: `public/arte/retratos/governador-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a state governor, in his 60s, in a formal dark suit, silver hair, statesman bearing. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### governador (mulher)

Arquivo: `public/arte/retratos/governador-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a state governor, in her late 50s, in a formal dark suit, silver hair, statesman bearing. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### deputado (homem)

Arquivo: `public/arte/retratos/deputado-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a congressman, in his 50s, in a formal suit with a small plain lapel pin, practiced smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### deputado (mulher)

Arquivo: `public/arte/retratos/deputado-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a congresswoman, in her 40s, in a formal suit with a small plain lapel pin, practiced smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### cientista (homem)

Arquivo: `public/arte/retratos/cientista-m.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a scientist, in his 40s, in a lab coat over a turtleneck, curious eyes. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### cientista (mulher)

Arquivo: `public/arte/retratos/cientista-f.jpg`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

SUBJECT: hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a scientist, in her late 30s, in a lab coat over a turtleneck, curious eyes. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

## Lotes de 20 (tudo junto)

Os mesmos prompts acima, juntos em blocos de até 20 imagens, com a descrição do projeto e o estilo uma vez só por bloco. Cole o bloco inteiro no gerador. Se ele fizer uma imagem por vez, peça "próxima" até acabar e salve cada uma com o nome do item.

### Lote 1 (1 a 20)

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

TASK: generate the 20 images below, one image per item, all in the same style and with the same consistent hand. Keep each item's format. Tell me the file name of each image as you deliver it.

1. [fundacao.jpg] top-down view of the president's heavy dark-wood desk at the end of the afternoon. Scattered manila dossier folders, a large paper map of a fictional tropical country with colored pins and red string, a brass desk lamp casting an amber pool of light, a fountain pen, a coffee cup ring, an old rotary phone, a few loose analog photos. Tropical sunlight enters from the top-left through a window, throwing long palm-leaf shadows across the desk. The edges of the image show a thick brutalist concrete window frame. Keep the CENTER of the desk mostly clear and darker, because the game lays paper forms there. FORMAT: 16:9, 2560x1440 px.

2. [carregando.jpg] a fictional Brasilia-like capital at golden hour: monumental brutalist concrete ministries in a long row, a parliament with twin towers and a dome and an inverted dome, reflected in a still pool. Hot tropical sky with towering clouds, a few palm trees, tiny people and buses. Windows glowing amber as the day ends. Heavy, monumental, a bit melancholic. Center calm for a loading indicator. FORMAT: 16:9, 2560x1440 px.

3. [sisgov.png] game logo: the word "SisGov" as a worn rubber stamp impression in dark ink on nothing, with an official-looking oval border and two small stars, slightly uneven ink like a real stamp; behind it a narrow brass plaque. Transparent background. If the letters come out wrong, generate the stamp border and plaque without text and the game writes the name. FORMAT: 1600x600 px, transparent PNG.

4. [emblema.png] an empty official party seal, like a wax seal pressed into paper combined with an ink stamp ring: circular, with a laurel ring, small stars and a tiny tropical palm-leaf motif, in olive and sepia ink with a single sun-yellow accent. The CENTER is EMPTY and flat, because the game writes the party initials there. Centered, symmetric, no text. FORMAT: 1024x1024 px, transparent background.

5. [campanha.jpg] a street rally in a tropical city in the late afternoon, painted: a crowd seen from behind, blank banners and flags in coral, turquoise and sun-yellow (no symbols), a sound truck with loudspeakers, brutalist concrete buildings and palm trees in the background, heat haze. Panoramic strip; the left third calmer and darker for a title. FORMAT: 4:1, 2400x600 px.

6. [vitoria.jpg] election night victory, painted like a historic press photo come to life: a packed campaign headquarters with concrete walls, people hugging and shouting, confetti in sun-yellow and turquoise, a big analog tally board with an abstract rising bar (no numbers), amber lamps, a tired campaign manager smiling with a cigar. Dry humor allowed. Panoramic strip. FORMAT: 4:1, 2400x600 px.

7. [derrota.jpg] the morning after an election loss: an empty brutalist campaign office, chairs out of place, a deflated coral balloon, blank posters on the floor, a single desk lamp still glowing amber, a cleaner sweeping confetti, cold blue tropical rain on the big concrete window. Melancholic with a touch of dry irony. Panoramic strip. FORMAT: 4:1, 2400x600 px.

8. [pessoa-real.jpg] an anonymous figure in a suit, head and shoulders, the face completely hidden in shadow, painted like a faded archive press photo with subtle halftone grain and sepia tone. No identifiable face. Do NOT add a frame. FORMAT: 3:4 vertical, 1024x1365 px.

9. [sindicalista-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a union leader, in his late 50s, in a plain short-sleeved work shirt with a lanyard and union badge. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

10. [sindicalista-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a union leader, in her early 50s, in a plain short-sleeved work shirt with a lanyard and union badge. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

11. [professor-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a schoolteacher and university lecturer, in his 40s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

12. [professor-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a schoolteacher and university lecturer, in her 50s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

13. [artista-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a artist and musician, in his 40s, in a loose linen shirt, expressive hair, a small earring. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

14. [artista-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a artist and musician, in her late 30s, in a loose linen shirt, expressive hair, a small earring. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

15. [economista-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a economist, in his 50s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

16. [economista-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a economist, in her 40s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

17. [empresario-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a businessman, in his 60s, in an expensive navy suit, confident posture, gold watch. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

18. [empresario-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a businesswoman, in her 50s, in an expensive navy suit, confident posture, gold watch. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

19. [medico-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian man, a physician, in his 50s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

20. [medico-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Lebanese descent woman, a physician, in her 40s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### Lote 2 (21 a 40)

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

TASK: generate the 20 images below, one image per item, all in the same style and with the same consistent hand. Keep each item's format. Tell me the file name of each image as you deliver it.

1. [juiz-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a judge, in his 60s, in a black judicial robe over a white collar, stern and calm. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

2. [juiz-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a judge, in her late 50s, in a black judicial robe over a white collar, stern and calm. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

3. [advogado-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a lawyer, in his 40s, in a dark grey suit, holding a leather folder against the chest. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

4. [advogado-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a lawyer, in her 40s, in a dark grey suit, holding a leather folder against the chest. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

5. [militar-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a retired army general, in his 60s, in an olive military dress uniform without real insignia, short grey hair, upright posture. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

6. [militar-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a retired army general, in her late 50s, in an olive military dress uniform without real insignia, short grey hair, upright posture. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

7. [policial-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a police chief, in his late 40s, in a dark police shirt without real insignia, firm look. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

8. [policial-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a police chief, in her 40s, in a dark police shirt without real insignia, firm look. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

9. [pastor-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a evangelical pastor, in his 50s, in a light suit, a Bible held at the chest, warm smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

10. [pastor-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a evangelical pastor, in her 50s, in a light suit, a Bible held at the chest, warm smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

11. [comunicador-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian man, a TV and radio host, in his 50s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

12. [comunicador-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Lebanese descent woman, a TV and radio host, in her 40s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

13. [ruralista-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a farmer and agribusiness owner, in his 60s, in a plaid button shirt, a wide-brim hat held in hand, sun-weathered skin. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

14. [ruralista-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Portuguese descent woman, a farmer and agribusiness owner, in her 50s, in a plaid button shirt, a wide-brim hat held in hand, sun-weathered skin. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

15. [prefeito-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a city mayor, in his late 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

16. [prefeito-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of Italian descent woman, a city mayor, in her 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

17. [governador-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian man, a state governor, in his 60s, in a formal dark suit, silver hair, statesman bearing. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

18. [governador-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race Brazilian of Indigenous ancestry woman, a state governor, in her late 50s, in a formal dark suit, silver hair, statesman bearing. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

19. [deputado-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Brazilian of Japanese descent man, a congressman, in his 50s, in a formal suit with a small plain lapel pin, practiced smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

20. [deputado-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional white Brazilian of German descent woman, a congresswoman, in her 40s, in a formal suit with a small plain lapel pin, practiced smile. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### Lote 3 (41 a 42)

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a fictional Brazil-like tropical presidential republic: picks the president, signs real laws, manages the budget, faces crises and fights an election every four years. The screen is the president's desk.

ART STYLE "Dossie Tropical": a mix of three references. (1) Base, like Suzerain: hand-painted gouache and oil illustration, tactile paper, dossiers, analog photos, rubber stamps, maps with pins, sepia, aged beige paper, olive green, military grey, desaturated 20th-century tones. (2) Weight, like Frostpunk: heavy brutalist concrete and dark iron, Brasilia-style modernist architecture, warm amber lamp light against cold shadow, a sense of pressure and consequence. (3) Color and dry humor, like Tropico 6: tropical sunlight, palm-leaf shadows, and small vibrant accents (sun yellow, jungle green, coral, turquoise) used sparingly against the muted base; people slightly exaggerated and expressive, never a cartoon. No readable text, no logos, no real political party symbols, no real people.

TASK: generate the 2 images below, one image per item, all in the same style and with the same consistent hand. Keep each item's format. Tell me the file name of each image as you deliver it.

1. [cientista-m.jpg] hand-painted gouache portrait, head and shoulders, of a fictional mixed-race (pardo) Brazilian man, a scientist, in his 40s, in a lab coat over a turtleneck, curious eyes. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.

2. [cientista-f.jpg] hand-painted gouache portrait, head and shoulders, of a fictional Afro-Brazilian woman, a scientist, in her late 30s, in a lab coat over a turtleneck, curious eyes. Expressive face with slightly exaggerated features, like a painted editorial political illustration: a hint of personality (confident, tired, sly, warm, stern), but not a caricature. Plain warm grey-beige painted background, soft warm window light from the left with a faint palm-leaf shadow. Clothing in muted tones (grey, olive, beige, navy, white): NO red, NO green-and-yellow, nothing that reveals a political side. Do NOT add a photo frame or border (the game adds the polaroid frame). Same framing for the whole cast of 35: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```
