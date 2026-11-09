# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**09/nov/2026**

## Onde está

Fase de **desenho das leis na planilha** ([docs/jogo/leis.xlsx](docs/jogo/leis.xlsx)); código parado.
Contagens vêm só da planilha (script), não deste texto (hoje: 477 leis, 142 índices, 471 roteiros).
**As 30 esferas estão desenhadas** (09/nov). Rodada de **arrumação** feita em 08/nov: Bússola em números
(coluna "Bússola: origem"), glossário no GDD §16, tipos de lei (Lei, Lei com prazo, Ato,
Posição por país, Operação), "construção" virou "prédio", "programa" reservado.

## Próximo

Feito (08/nov): as 25 leis que cruzavam o meio da Bússola foram arrumadas (20 viraram lado único,
4 têm a exceção escrita, 3 de Energia serão refeitas na esfera Energia). Colunas Força e
Atraso nos efeitos: colunas criadas; Atraso preenchido, Força fica "média" por padrão e só se calibra no fim, com todas as leis (autor, 08/nov). Efeito e cobrador dos índices também ficam para a calibração. Comércio exterior e capital desenhada em 08/nov (nova forma "Régua por setor"). Energia fechada (mapa elétrico, urânio, comércio de energia) e esfera nova Mineração e petróleo criada. Meio ambiente fechada em 09/nov (órgão com independência em escada, licença sem exame com custo na hora). Ciência e pesquisa fechada em 09/nov (nível próprio e emprestado por produto, verba dividida em 100%, Lua como corrida, sem Marte). Agricultura e pesca fechada em 09/nov (produtor contra cidade, papel comida cara, peixe por mar compartilhado). Toda esfera nova passa pela sala de 4 especialistas em game design (sistemas, interface, experiência, escopo), que propõem e votam antes de chegar ao autor. Terra fechada em 09/nov (fila visível, Preço e Segurança da terra por estado). Infraestrutura e transporte fechada em 09/nov (duas filas num setor só; o jogador só vê e mexe pelas leis; construtora nacional como companhia; táxi, aplicativo e elétricos). Cultura e esporte fechada em 09/nov (fila de pedidos no órgão de Patrimônio; bem protegido custa para sempre; estátua e símbolo de fé são pedidos, não leis). Defesa civil fechada em 09/nov (índice Preparo contra desastres; desastre chega sozinho; partido não escolhe a região). Minério fechado em 09/nov (7 leis, garimpeiro no centro, sem índice próprio). Próximo: o estudo final de tudo, pedido pelo autor.
Sem núcleo reduzido (autor): o jogo tem centenas de caminhos; a "cota" de foco e a promessa de
campanha ficam em GDD §18.

## Faltam

Nenhuma esfera. Leis antigas sem roteiro: Déficit, Superávit e 1 de Defesa.

## Pendências do autor

- Vídeo de apresentação (5 min) em `arquivo/sisgov-apresentacao.mp4`, 09/nov: voz neural é rascunho; falta decidir a voz final e a chamada do fim.
- Decidir o roteiro: manter a aba "Leis - roteiro" ou fundir o essencial na aba Leis.
- Conteúdo de cada papel das Operações; Congresso; sistema judiciário; construção civil.
- Estudo final de tudo depois das últimas esferas (autor, 09/nov); nele, rever se Cultura e esporte precisa de índice próprio (saiu sem nenhum, e o autor estranhou).
- Aba dos 30 países e planejamento final (planilha completa + documento passo a passo).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; `arquivo/` e `docs/jogo/interface/mapa-em-tres-aneis.md` ficam fora.
- O scratchpad (venv do openpyxl) some entre sessões; recriar com `python3 -m venv v && v/bin/pip install openpyxl`.
- Países reais entram; empresa, pessoa e direito autoral não.
