# Desenho das leis (reforma de 21/out/2026)

> **Status: VIGENTE (em desenho).** Catálogo novo de leis, área por área.
> Regras gerais em [mecânicas/leis.md](../mecanicas/leis.md). Este é o
> desenho de jogo; a implementação (índice, JSON, calibragem, testes) vem
> depois, uma área por vez.

## 1. Pilares

1. **O jogador vê acontecer.** Toda lei termina em algo visível: uma
   empresa que muda de dono, uma obra que começa, uma fila que anda, um
   grupo que vai às ruas. Nada de "modelo de Estado" com efeito abstrato.
2. **Escolha com dono.** Toda opção tem quem ganha e quem perde (grupos de
   interesse) e uma conta (dinheiro, tempo, risco). Não existe opção
   "certa"; existe a que serve ao plano do jogador.
3. **Os quatro cantos.** Em cada área dá para governar como Estado
   forte ou mercado livre, com mais liberdade ou mais autoridade. Um
   jogador que quer seguir Reagan, Geisel, Olof Palme ou Che Guevara
   encontra as ferramentas de cada um.
4. **Industrializar é o objetivo.** Cada área diz como contribui (ou
   atrapalha) a indústria: energia barata, mão de obra formada, crédito,
   estradas, estabilidade. As leis que mais mexem nisso ficam marcadas.
5. **Tempo é parte do custo.** Corte de imposto anima logo; escola leva
   anos. Toda lei diz quando o efeito chega: **já** (1 a 3 meses),
   **logo** (até 1 ano), **devagar** (1 a 4 anos), **geração** (mais de 4).

## 2. Tipos de lei

| Tipo | Controle | Exemplo |
| --- | --- | --- |
| **Alíquota** | Faixa em % (0 a 100) | Imposto sobre o lucro das empresas |
| **Verba** | Faixa em % do PIB ou R$/ano | Verba para ferrovias |
| **Regra** | 2 a 4 opções, cada uma uma frase | Greve de servidores: livre · com serviço mínimo · proibida |
| **Setor** | Mesma pergunta, uma lei por setor | Quem é dono do petróleo · da energia · dos bancos… |
| **Programa** | Liga/desliga com tamanho (faixa) | Programa de casas populares |
| **Constitucional / pétrea** | Regra que abre ou fecha outras | Ensino superior: quem paga |

**Lei por setor** é a resposta ao "meios de produção: privada · mista ·
estatal". Em vez de uma chave para a economia inteira, o jogador decide
setor a setor, e o jogo mostra as empresas desse setor mudando de mãos.
Setores do mundo: petróleo e gás · mineração · energia elétrica ·
siderurgia e química · bancos · telecomunicações · correios e logística ·
ferrovias e portos · aviação · saneamento · indústria de defesa.

## 3. Cantos da bússola

A bússola tem dois eixos: **economia** (− Estado, + mercado) e
**costumes** (− liberdade, + autoridade). Cada opção recebe um vetor de
−2 a +2 em cada eixo. Os quatro cantos, com nomes de jogo:

| Canto | Economia | Costumes | Exemplos reais |
| --- | --- | --- | --- |
| **Estado e liberdade** | − | − | social-democracia nórdica, Mujica |
| **Estado e autoridade** | − | + | Vargas no Estado Novo, Geisel, Cuba |
| **Mercado e liberdade** | + | − | Reagan na economia, Milei, liberais clássicos |
| **Mercado e autoridade** | + | + | Pinochet, Lee Kuan Yew, Bukele |

**Regra de cobertura:** cada área tem leis ou opções que levam aos quatro
cantos. Um assunto que só tem um eixo (imposto sobre o consumo, por
exemplo) pode ficar neutro no outro.

## 4. Exclusões

Duas leis se excluem quando não fazem sentido em vigor juntas. A exclusão
é sempre recíproca e escrita nas duas. Aprovar uma pede revogar a outra.
Exemplos: "Petróleo: monopólio estatal" exclui "Leilões de áreas de
petróleo"; "Escola em casa proibida" exclui "Vale para escola em casa".

Dentro de uma mesma lei as opções já se excluem; a exclusão é só entre
leis diferentes.

## 5. Ficha de cada lei

Cada área tem um arquivo com as leis no formato:

```text
### Nome da lei                         [tipo · nível · ritmo]
O que faz, em uma frase de quem não estuda leis.
- Opções ou faixa, cada uma com o canto: (E·L) (E·A) (M·L) (M·A) ou (neutra)
- Ganha: grupos · Perde: grupos
- Efeitos: índice ↑/↓ (quando)
- Indústria: ↑ / ↓ / — (como)
- Exclui: outra-lei
- Programas: ids de programas.md
- Antes: ids das leis antigas que esta substitui
```

`Antes` liga o desenho ao conteúdo de hoje: a implementação reaproveita
os efeitos já calibrados das leis antigas.

## 6. Áreas

| Área | Arquivo | Leis antigas |
| --- | --- | --- |
| Economia e contas públicas | [economia.md](economia.md) | 26 |
| Empresas, indústria e comércio | [empresas.md](empresas.md) | 22 |
| Trabalho | [trabalho.md](trabalho.md) | 18 |
| Previdência e assistência | [previdencia.md](previdencia.md) | 16 |
| Saúde | [saude.md](saude.md) | 20 |
| Educação, ciência e cultura | [educacao.md](educacao.md) | 23 |
| Infraestrutura, energia e cidades | [infraestrutura.md](infraestrutura.md) | 17 |
| Meio ambiente e campo | [ambiente.md](ambiente.md) | 9 |
| Segurança, justiça e defesa | [seguranca.md](seguranca.md) | 48 |
| Direitos e costumes | [direitos.md](direitos.md) | 22 |
| Governo e instituições | [governo.md](governo.md) | 25 |

Programas reais de referência: [programas.md](programas.md).
