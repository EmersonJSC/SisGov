# Área aberta: o jogador sabe para onde ir

> **Status: PROPOSTA (21–22/out/2026).** Desenho da tela quando o jogador
> abre uma área do mapa. Implementação na fase da tela (fim do projeto); os
> dados que ela precisa entram antes, junto com cada mecânica.

## 1. O problema hoje

Ao abrir uma área, todas as leis aparecem como bolinhas iguais numa grade,
separadas só por ministério. O jogador vê 20 bolinhas da mesma cor e:

- não sabe **o que está ruim** na área;
- não sabe **quais leis importam mais** (uma alíquota de imposto e uma lei
  de pesca têm o mesmo peso visual);
- não sabe **o que cada lei é** sem abrir (verba? regra? imposto?);
- não sabe **por onde começar** nem o que o partido dele defenderia ali.

## 2. A ideia: a área responde três perguntas antes do clique

1. **Como estamos?** (o estado da área)
2. **O que eu posso mexer?** (as leis, com hierarquia e tipo visíveis)
3. **Por onde começo?** (o ministro sugere)

## 3. Cabeçalho da área: "Como estamos?"

Ao abrir, a área mostra uma faixa no topo, antes das leis:

- **3 números da área**, com seta do último trimestre e cor (bom/ruim).
  Economia: dívida, inflação, crescimento. Saúde: fila, saúde da
  população, gasto do bolso. Segurança: violência, lotação das prisões,
  sensação de segurança.
- **O que está pegando fogo:** situações ativas da área (greve, epidemia,
  crise cambial), em vermelho, clicáveis.
- **Quem está pedindo:** grupos de pressão e aliados com pedido na área
  ("Os sindicatos querem salário mínimo maior").
- **Quanto a área custa:** gasto da área em % do PIB e a direção.

## 4. As leis: "O que eu posso mexer?"

### 4.1 Prateleiras por assunto

As leis deixam de ser uma grade única por ministério e viram **prateleiras
por assunto**, as seções do desenho (ex.: Economia → Impostos · Contas
públicas · Moeda e banco central). Cada prateleira tem título e no máximo
8 leis. O ministério continua aparecendo como etiqueta pequena.

### 4.2 Cor e forma dizem o tipo

| Tipo | Cor | Forma | Leitura rápida |
| --- | --- | --- | --- |
| Alíquota (imposto) | dourado | círculo com borda de moeda | "aqui entra dinheiro" |
| Verba | verde | círculo | "aqui sai dinheiro" |
| Regra | azul | círculo | "aqui muda como funciona" |
| Setor (dono) | roxo | hexágono | "aqui muda quem é dono" |
| Programa | laranja | círculo com faixa | "aqui liga uma ação" |
| Constitucional | contorno grosso | quadrado | "difícil de mudar" |
| Pétrea | cinza-chumbo | escudo | "quase não muda" |

### 4.3 Selos nas leis

Pequenos selos no canto da bolinha, no máximo dois por lei:

- **⚡ Pede atenção:** a lei mexe num índice que está ruim agora.
- **🏭 Alavanca da indústria:** marcada no desenho como "Indústria: ↑ forte".
- **🔒 Bloqueada:** depende de outra lei; o motivo aparece ao passar o mouse.
- **⇄ Exclusiva:** não convive com outra lei; ao passar o mouse, mostra qual.
- **⏳ Em andamento:** mudança aprovada que ainda está entrando em vigor.

### 4.4 A cor da bússola na lei

A borda da bolinha leva a cor do **canto da bússola** da opção em vigor
(Estado e liberdade, Estado e autoridade, mercado e liberdade, mercado e
autoridade, neutra). Batendo o olho, o jogador vê para onde aquela área
está puxando o país.

### 4.5 Primeiro o essencial

Ao abrir, aparecem as **leis principais** da área (as de maior peso no
dinheiro, na indústria ou nos índices da área, até 8). Um botão "todas as
leis (24)" mostra o resto. Quem joga pela primeira vez não se afoga; quem
conhece o jogo abre tudo de uma vez.

## 4.6 A bolha da lei, desenhada

Hoje a bolha é um disco liso com um ícone fino de traço. A bolha nova é uma
**medalha holográfica** (estilo futurista) com camadas, de dentro para fora:

1. **Medalha:** o ícone holográfico da lei (PNG,
   [briefing-icones.md](../../arte/briefing-icones.md)), recortado em
   círculo. É o que chama o olho.
2. **Aro do tipo:** anel grosso de metal na cor do tipo (dourado, oliva,
   lilás, azul, coral; constitucional com aro de papel e borda sépia;
   pétrea como escudo de concreto). Leve brilho de cima, sombra embaixo:
   parece uma peça física sobre a mesa.
3. **Arco da bússola:** um arco fino por fora, na cor do canto da opção em
   vigor. Lei neutra: sem arco.
4. **Anel de nível:** o que já existe (o quanto a lei está ligada), passa a
   correr por dentro do aro, em âmbar.
5. **Selos:** até dois, como **carimbos** pequenos presos na borda
   (⚡ atenção, 🏭 indústria, 🔒 bloqueada, ⇄ exclusiva, ⏳ andamento).
6. **Etiqueta:** o nome da lei numa tira de papel embaixo da medalha, e não
   texto solto.

**Tamanho com sentido.** A bolha cresce pela **importância** da lei na
área (peso no dinheiro, na indústria e nos índices), e não só pelo nível.
As leis principais são visivelmente maiores que as secundárias.

**Movimento, pouco e com motivo.**
- Ao passar o mouse, a medalha sobe 2 px, a sombra cresce e a etiqueta
  mostra uma linha ("Cobra 26,5% em tudo o que se compra").
- **⚡ Pede atenção:** o aro pulsa devagar em âmbar (uma vez a cada 3 s).
- **⏳ Em andamento:** o anel de nível enche aos poucos, como um relógio.
- **Assinada agora:** um carimbo "bate" sobre a medalha, com som seco.
- **Bloqueada:** medalha em tons de cinza, com o cadeado; sem animação.

**Bolhas dos índices** (o anel de fora) seguem a mesma linguagem: disco de
papel com o número grande pintado no centro, aro na cor de bom/ruim e a seta
do último trimestre como um alfinete colorido. Situação grave (crise) vira
um carimbo vermelho que pulsa.

## 5. O ministro: "Por onde começo?"

Cada área tem o retrato de quem a coordena (já existe). Ao abrir, ele diz
**uma frase** e aponta **até 3 leis**:

> "Presidente, a dívida subiu 3 pontos no ano. Dá para segurar pela Regra
> das contas, pelo Imposto sobre o lucro ou pela Idade mínima para se
> aposentar."

Como o ministro escolhe:

1. O índice da área que **mais piorou** ou está mais longe do bom.
2. As leis que **mais mexem** nesse índice (a rede já sabe: são as
   relações de maior peso).
3. Entre elas, as que combinam com o **canto da bússola** do partido do
   jogador vêm primeiro; uma do lado oposto aparece como "a alternativa".

O ministro **não decide**: só aponta. Clicar no nome abre a lei.

O ministro também tem personalidade (do desenho de personagens): um
ministro liberal sugere cortar; um desenvolvimentista sugere investir. Trocar
de ministro muda os conselhos. É um gancho para a mecânica de ministros.

## 6. Metas do mandato

Fora das áreas, um painel pequeno fixo mostra as **metas do partido** para
o mandato (escolhidas no início, ou sugeridas pelo canto da bússola):
"Dívida abaixo de 80%", "Industrialização acima de 40", "Desemprego abaixo
de 8%". Cada área aberta destaca a meta que depende dela. É o "para onde
eu vou" do jogo inteiro.

## 7. O que precisa existir nos dados

| Dado | Onde | Quando |
| --- | --- | --- |
| Seção (prateleira) de cada lei | desenho das leis → índice | na implementação de cada área |
| Tipo da lei (alíquota, verba…) | desenho das leis → índice | idem |
| Peso na indústria | desenho ("Indústria: ↑ forte") | idem |
| 3 índices de cada área | este documento → conteúdo da área | mecânica 6 (índices) |
| Frases do ministro por situação | conteúdo novo | mecânica de ministros |
| Metas do mandato | conteúdo novo | mecânica 11 (eleição) |
