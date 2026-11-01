# Salvar e carregar

Passo 10 (01/nov/2026). A partida salva é um texto JSON com a versão, o país,
a semente, as opções com que nasceu e o estado. As regras não vão no arquivo:
voltam do mundo e do país, então uma partida salva vale enquanto o conteúdo
for o mesmo.

## Comportamento esperado (escrito antes)

- salvar no meio da partida (com leis mudadas e votações feitas) e carregar
  devolve **o mesmo estado**, e jogar mais turnos dá o mesmo resultado que
  jogar sem ter salvado (o acaso volta no ponto em que estava);
- partida encerrada (governo perdeu) também salva e carrega encerrada;
- texto que não é JSON, versão diferente ou país que não existe: erro com
  motivo, nunca partida pela metade.
