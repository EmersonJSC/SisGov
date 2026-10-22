# Artes de tela e de fundo

> **Status: VIGENTE (pedido de arte, 22/out/2026).** Imagens maiores que
> ícones. Ícones em [icones-das-leis.md](icones-das-leis.md); tela em
> [área aberta](../jogo/interface/area-aberta.md).

## Estilo comum

- Ilustração plana, com poucas cores e luz suave; cara de "documento de
  governo moderno", não de foto. Mesmo estilo em todas.
- Sem texto, sem bandeira, marca ou pessoa real reconhecível.
- Espaço calmo à esquerda ou no centro, porque a interface escreve em cima.
- Entrega: PNG ou WebP, 1920 × 1080 (fundos) e 1600 × 400 (faixas), com
  uma versão escurecida a 60% para o modo escuro.

## Pedidos

| Arquivo | Uso | O que mostrar |
| --- | --- | --- |
| `fundo/mapa` | fundo do mapa político | vista de cima de um país fictício estilizado, rios e estradas em linhas finas, quase sem contraste |
| `faixa/economia` | cabeçalho da área aberta | moedas empilhadas, gráfico subindo, prédio de banco ao fundo |
| `faixa/empresas` | idem | fábricas com chaminés, guindastes e contêineres num porto |
| `faixa/trabalho` | idem | trabalhadores de capacete e de escritório indo ao trabalho, de costas |
| `faixa/previdencia` | idem | casas populares, idosos num banco de praça, de costas |
| `faixa/saude` | idem | hospital e posto de bairro com ambulância |
| `faixa/educacao` | idem | escola com pátio, crianças de mochila, de costas |
| `faixa/infraestrutura` | idem | ponte, trilhos, torres de energia e estrada ao entardecer |
| `faixa/ambiente` | idem | floresta encontrando plantação, rio no meio |
| `faixa/seguranca` | idem | rua iluminada à noite com viatura ao longe |
| `faixa/direitos` | idem | praça cheia de pessoas diversas, de costas |
| `faixa/governo` | idem | prédio do Congresso fictício com cúpula |
| `cena/crise` | jornal quando há crise | rua com fumaça leve e placas de protesto sem texto |
| `cena/eleicao` | tela da eleição | urnas e fila de eleitores, de costas |
| `cena/fim-de-jogo` | derrota | gabinete vazio com a cadeira virada para a janela |

Ordem: `faixa/economia` e `faixa/empresas` primeiro (são as áreas em
implementação), depois o `fundo/mapa`, depois o resto.
