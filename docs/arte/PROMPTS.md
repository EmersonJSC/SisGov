# Artes do SisGov: prompts

Artes feitas por IA por enquanto. Cada arte tem um nome de arquivo fixo: salve com esse nome na pasta indicada dentro de `public/arte/` e o jogo usa sozinho. Se um arquivo faltar, a tela mostra um substituto (silhueta, degradê ou texto) e continua funcionando.

Cada prompt já começa com a descrição do projeto e o estilo, para todas as artes saírem do mesmo jeito. Os prompts estão em inglês porque os geradores de imagem respondem melhor assim. Formato: PNG. Se o gerador não deixar escolher o tamanho, use a proporção indicada; o jogo ajusta.

## Como a primeira tela usa as artes

```
┌──────────────────────────────────────────────────────────────┐
│ fundos/fundacao.png  (a tela inteira, escurecida embaixo)    │
│  logo/sisgov.png                                             │
│  "Você não é o presidente. Você é o partido."               │
│                                                              │
│  I  Funde o seu partido                                      │
│   [logo/emblema.png com a sigla por cima]  Nome  Sigla       │
│                                                              │
│  II Escolha quem vai governar                                │
│   [retrato][retrato][retrato][retrato][retrato]  ← retratos/ │
│   ┌ ficha de quem está em foco: biografia e falas ────────┐  │
│   └───────────────────────────────────────────────────────┘  │
│                               [ COMEÇAR O MANDATO ]          │
└──────────────────────────────────────────────────────────────┘
```

Os mesmos retratos aparecem no tablet (app Eleição: presidente, nomes para lançar e adversários).

## Lista de arquivos

| Arquivo | Onde aparece | Tamanho |
|---|---|---|
| `fundos/fundacao.png` | Fundo da primeira tela | 2560×1440 (16:9) |
| `fundos/carregando.png` | Tela de carregamento | 2560×1440 (16:9) |
| `logo/sisgov.png` | Logo do jogo na primeira tela | 1600×500, fundo transparente |
| `logo/emblema.png` | Moldura do emblema do partido (a sigla vai por cima) | 1024×1024, fundo transparente |
| `cenas/campanha.png` | Faixa do topo do app Eleição | 2400×600 (4:1) |
| `cenas/vitoria.png` | Resultado: vitória | 2400×600 (4:1) |
| `cenas/derrota.png` | Resultado: derrota e fim da partida | 2400×600 (4:1) |
| `retratos/{carreira}-m.png` e `-f.png` | Rosto de cada personagem gerado (34) | 1024×1365 (3:4) |
| `retratos/pessoa-real.png` | Pessoas reais (Lula, FHC etc.) | 1024×1365 (3:4) |

**Pessoas reais não ganham rosto de IA.** Gerar a cara de um político real é arriscado (deepfake, uso de imagem) e os geradores costumam recusar. Elas usam um retrato neutro, o `pessoa-real.png`.

## Fundos e logo

### Fundo da primeira tela

Arquivo: `public/arte/fundos/fundacao.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: wide view of a fictional modernist capital city at blue hour, inspired by mid-century Latin American modernism: a long ministerial esplanade, a parliament with twin towers and a bowl-shaped dome and an inverted dome, a reflecting pool. Thousands of tiny people in the distance holding blank banners. Warm golden light on the buildings, deep night-blue sky with the first stars. Composition: the main buildings in the right half; the left half and the bottom third calm and darker, because menus and text sit there. FORMAT: 16:9, 2560x1440 px.
```

### Tela de carregamento

Arquivo: `public/arte/fundos/carregando.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: a presidential desk at night seen from above at an angle: stacks of law drafts, a closed tablet, a fountain pen, a cup of coffee, a desk lamp casting a warm gold pool of light, the rest in deep night blue. Center of the image calm, because a loading spinner sits there. FORMAT: 16:9, 2560x1440 px.
```

### Logo do jogo

Arquivo: `public/arte/logo/sisgov.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

SUBJECT: game logo wordmark reading exactly "SisGov" in an elegant classic serif with engraved gold letters and a thin night-blue outline, a small laurel or seal ornament. Clean edges, transparent background. If the generator gets the letters wrong, generate only the ornament and the game draws the name. FORMAT: 1600x500 px, transparent PNG.
```

### Moldura do emblema do partido

Arquivo: `public/arte/logo/emblema.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: an empty circular party seal frame: a gold ring with laurel branches and small stars, the CENTER EMPTY and flat dark navy, because the party initials are drawn there by the game. Symmetric, centered, no text, no symbols of real parties. FORMAT: 1024x1024 px, transparent background outside the ring.
```

## Cenas da eleição

### Campanha (topo do app Eleição)

Arquivo: `public/arte/cenas/campanha.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: a campaign rally at night seen from behind the crowd: a lit stage far away, a sea of raised hands and blank banners, confetti in gold light. Neutral colors in the crowd, no party colors. Panoramic strip; the left third darker for a title. FORMAT: 4:1, 2400x600 px.
```

### Vitória

Arquivo: `public/arte/cenas/vitoria.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: election night victory: a campaign headquarters erupting in celebration, people hugging, a big screen showing an abstract rising bar chart (no numbers), gold confetti, warm light. Panoramic strip. FORMAT: 4:1, 2400x600 px.
```

### Derrota

Arquivo: `public/arte/cenas/derrota.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: the morning after an election loss: an empty campaign headquarters, chairs out of place, deflated balloons, blank posters on the floor, a single desk lamp still on, cold blue dawn light through the window. Melancholic, quiet. Panoramic strip. FORMAT: 4:1, 2400x600 px.
```

## Retratos

Um rosto por carreira e gênero. A idade do personagem varia no jogo (35 a 75 anos), então o rosto fica numa idade média. Gere todos na mesma conversa ou com a mesma semente para o elenco sair com o mesmo estilo.

### Pessoa real (retrato neutro)

Arquivo: `public/arte/retratos/pessoa-real.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: an anonymous silhouette portrait: a dark navy figure of a person in a suit, head and shoulders, face completely in shadow, lit only by a gold rim light from behind, like an old newspaper archive photo with subtle halftone grain. No identifiable face. FORMAT: 3:4 vertical, 1024x1365 px.
```

### sindicalista (homem)

Arquivo: `public/arte/retratos/sindicalista-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a union leader, in his late 50s, in a plain short-sleeved work shirt with a lanyard and union badge (no text). Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### sindicalista (mulher)

Arquivo: `public/arte/retratos/sindicalista-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Portuguese descent woman, a union leader, in her early 50s, in a plain short-sleeved work shirt with a lanyard and union badge (no text). Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### professor (homem)

Arquivo: `public/arte/retratos/professor-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a schoolteacher and university lecturer, in his 40s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### professor (mulher)

Arquivo: `public/arte/retratos/professor-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Italian descent woman, a schoolteacher and university lecturer, in her 50s, in a simple cardigan over a shirt, reading glasses hanging on the collar. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### artista (homem)

Arquivo: `public/arte/retratos/artista-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a artist and musician, in his 40s, in a loose linen shirt, expressive hair, a small earring. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### artista (mulher)

Arquivo: `public/arte/retratos/artista-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian of Indigenous ancestry woman, a artist and musician, in her late 30s, in a loose linen shirt, expressive hair, a small earring. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### economista (homem)

Arquivo: `public/arte/retratos/economista-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Brazilian of Japanese descent man, a economist, in his 50s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### economista (mulher)

Arquivo: `public/arte/retratos/economista-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of German descent woman, a economist, in her 40s, in a well-cut dark suit, thin-rimmed glasses, crisp shirt. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### empresario (homem)

Arquivo: `public/arte/retratos/empresario-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a businessman, in his 60s, in an expensive navy suit, confident posture, subtle watch. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### empresario (mulher)

Arquivo: `public/arte/retratos/empresario-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian woman, a businesswoman, in her 50s, in an expensive navy suit, confident posture, subtle watch. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### medico (homem)

Arquivo: `public/arte/retratos/medico-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian man, a physician, in his 50s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### medico (mulher)

Arquivo: `public/arte/retratos/medico-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian of Lebanese descent woman, a physician, in her 40s, in a white doctor's coat over a light blue shirt, stethoscope around the neck. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### juiz (homem)

Arquivo: `public/arte/retratos/juiz-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a judge, in his 60s, in a black judicial robe over a white collar, stern and calm. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### juiz (mulher)

Arquivo: `public/arte/retratos/juiz-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Portuguese descent woman, a judge, in her late 50s, in a black judicial robe over a white collar, stern and calm. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### advogado (homem)

Arquivo: `public/arte/retratos/advogado-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a lawyer, in his 40s, in a dark grey suit and tie, holding a leather folder against the chest. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### advogado (mulher)

Arquivo: `public/arte/retratos/advogado-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Italian descent woman, a lawyer, in her 40s, in a dark grey suit with a silk blouse, holding a leather folder against the chest. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### militar (homem)

Arquivo: `public/arte/retratos/militar-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a retired army general, in his 60s, in a formal olive military dress uniform without real insignia, short grey hair, upright posture. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### militar (mulher)

Arquivo: `public/arte/retratos/militar-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian of Indigenous ancestry woman, a retired army general, in her late 50s, in a formal olive military dress uniform without real insignia, short grey hair, upright posture. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### policial (homem)

Arquivo: `public/arte/retratos/policial-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Brazilian of Japanese descent man, a police chief, in his late 40s, in a dark tactical-style police shirt without real insignia, firm look. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### policial (mulher)

Arquivo: `public/arte/retratos/policial-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of German descent woman, a police chief, in her 40s, in a dark tactical-style police shirt without real insignia, firm look. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### pastor (homem)

Arquivo: `public/arte/retratos/pastor-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a evangelical pastor, in his 50s, in a light suit, a Bible held at the chest, warm smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### pastor (mulher)

Arquivo: `public/arte/retratos/pastor-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian woman, a evangelical pastor, in her 50s, in a light suit, a Bible held at the chest, warm smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### comunicador (homem)

Arquivo: `public/arte/retratos/comunicador-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian man, a TV and radio host, in his 50s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### comunicador (mulher)

Arquivo: `public/arte/retratos/comunicador-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian of Lebanese descent woman, a TV and radio host, in her 40s, in a bright but neutral blazer, studio make-up, charismatic half-smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### ruralista (homem)

Arquivo: `public/arte/retratos/ruralista-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a farmer and agribusiness owner, in his 60s, in a plaid button shirt and a wide-brim hat held in hand, sun-weathered skin. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### ruralista (mulher)

Arquivo: `public/arte/retratos/ruralista-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Portuguese descent woman, a farmer and agribusiness owner, in her 50s, in a plaid button shirt and a wide-brim hat held in hand, sun-weathered skin. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### prefeito (homem)

Arquivo: `public/arte/retratos/prefeito-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a city mayor, in his late 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### prefeito (mulher)

Arquivo: `public/arte/retratos/prefeito-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of Italian descent woman, a city mayor, in her 40s, in an open-collar shirt and blazer, sleeves slightly rolled, approachable. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### governador (homem)

Arquivo: `public/arte/retratos/governador-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian man, a state governor, in his 60s, in a formal dark suit, silver hair, statesman bearing. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### governador (mulher)

Arquivo: `public/arte/retratos/governador-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian of Indigenous ancestry woman, a state governor, in her late 50s, in a formal dark suit, silver hair, statesman bearing. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### deputado (homem)

Arquivo: `public/arte/retratos/deputado-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Brazilian of Japanese descent man, a federal congressman, in his 50s, in a formal suit with a small lapel pin (no symbol), practiced smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### deputado (mulher)

Arquivo: `public/arte/retratos/deputado-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional white Brazilian of German descent woman, a congresswoman, in her 40s, in a formal suit with a small lapel pin (no symbol), practiced smile. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### cientista (homem)

Arquivo: `public/arte/retratos/cientista-m.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional mixed-race (pardo) Brazilian man, a scientist, in his 40s, in a lab coat over a turtleneck, curious eyes. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```

### cientista (mulher)

Arquivo: `public/arte/retratos/cientista-f.png`

```
PROJECT CONTEXT: SisGov is a political strategy game in Brazilian Portuguese. The player runs a political party in a Brazil-like presidential republic: picks the president, changes real laws, watches the budget and public opinion, and fights elections every four years. Tone: serious, cinematic, grounded, a little dramatic, like a premium strategy game, never cartoonish or satirical.

ART STYLE: painterly digital illustration with visible brush texture, semi-realistic, cinematic lighting, deep night-blue and warm gold palette, muted elsewhere. No text, no letters, no logos, no flags of real parties, no real people.

SUBJECT: head-and-shoulders portrait of a fictional Afro-Brazilian woman, a scientist, in her late 30s, in a lab coat over a turtleneck, curious eyes. Looking at the camera with a neutral, composed expression. Dark navy studio background with a soft gold rim light. Clothing in neutral colors (grey, navy, beige, white): NO red, NO green-and-yellow, nothing that hints at a political side. Same framing as a cast of 35 portraits: eyes at one third from the top, shoulders cut at the bottom edge. FORMAT: 3:4 vertical, 1024x1365 px.
```
