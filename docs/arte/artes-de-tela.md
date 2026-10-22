# Artes de tela e de fundo

> **Status: VIGENTE (pedido de arte, 22/out/2026).** Imagens maiores que
> ícones. Ícones em [icones-das-leis.md](icones-das-leis.md); tela em
> [área aberta](../jogo/interface/area-aberta.md).

## Onde salvar

Tudo dentro de **`public/arte/`** (a pasta das artes do jogo; regras em
`public/arte/LEIA.md`). Arquivo que falta não quebra nada: a tela usa um
substituto.

| Pasta | O que vai nela |
| --- | --- |
| `public/arte/fundos/` | fundos de tela inteira (já tem `fundacao.jpg` e `carregando.jpg`) |
| `public/arte/faixas/` | **pasta nova:** a faixa do topo de cada área aberta |
| `public/arte/cenas/` | cenas de momento do jogo (já tem `campanha.jpg`, `vitoria.jpg`, `derrota.jpg`) |

## Estilo comum

- Seguir o estilo já definido do jogo, **"Dossiê Tropical"**
  (`docs/arte/PROMPTS.md`), o mesmo das artes que já existem.
- Sem texto, sem bandeira, marca ou pessoa real reconhecível.
- Espaço calmo à esquerda ou no centro, porque a interface escreve em cima.
- Formato **JPG**. Tamanhos: 1920 × 1080 (fundos e cenas) e 1600 × 400
  (faixas).

## Pedidos

| Arquivo | Uso | O que mostrar |
| --- | --- | --- |
| `public/arte/fundos/mapa.jpg` | fundo do mapa político | vista de cima de um país fictício, rios e estradas em linhas finas, quase sem contraste |
| `public/arte/faixas/economia.jpg` | topo da área aberta | moedas empilhadas, gráfico subindo, prédio de banco ao fundo |
| `public/arte/faixas/empresas.jpg` | idem | fábricas com chaminés, guindastes e contêineres num porto |
| `public/arte/faixas/trabalho.jpg` | idem | trabalhadores de capacete e de escritório indo ao trabalho, de costas |
| `public/arte/faixas/previdencia.jpg` | idem | casas populares, idosos num banco de praça, de costas |
| `public/arte/faixas/saude.jpg` | idem | hospital e posto de bairro com ambulância |
| `public/arte/faixas/educacao.jpg` | idem | escola com pátio, crianças de mochila, de costas |
| `public/arte/faixas/infraestrutura.jpg` | idem | ponte, trilhos, torres de energia e estrada ao entardecer |
| `public/arte/faixas/ambiente.jpg` | idem | floresta encontrando plantação, rio no meio |
| `public/arte/faixas/seguranca.jpg` | idem | rua iluminada à noite com viatura ao longe |
| `public/arte/faixas/direitos.jpg` | idem | praça cheia de pessoas diversas, de costas |
| `public/arte/faixas/governo.jpg` | idem | prédio do Congresso fictício com cúpula |
| `public/arte/cenas/crise.jpg` | jornal quando há crise | rua com fumaça leve e placas de protesto sem texto |

Eleição e fim de jogo já têm arte (`cenas/campanha.jpg` e `cenas/derrota.jpg`).

Ordem: `faixas/economia.jpg` e `faixas/empresas.jpg` primeiro (são as áreas
em implementação), depois `fundos/mapa.jpg`, depois o resto.
