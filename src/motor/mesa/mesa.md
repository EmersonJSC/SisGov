# Mesa

Passo 4 da ordem de construir (12/nov/2026). A mesa é onde chegam os papéis
que pedem o presidente. Por ora só a família **Leis** (R17.7).

## Papéis

- **Sanção** (pede carimbo): a lei que o Senado emendou e a Câmara aceitou
  chega à mesa. O presidente **assina**, **veta** (com observação opcional) ou
  ignora (R17.6).
- **Aviso** (só informa, some no turno seguinte): lei aprovada, decreto, veto
  derrubado, veto mantido.

A mesa é refeita no fim de cada turno (`montarMesa`): papéis de sanção que
ainda esperam e avisos do turno. Papel não tem texto guardado; a tela escreve
o conteúdo a partir da lei e do valor (R17.7).

## Prazo

O papel de sanção vale um turno. Ignorar tem consequência, e é regra do país
(`ignorar` em `congresso.json`): **sanção tácita** (a lei vira lei, como no
Brasil) ou **veto tácito** (R17.13). Ignorar vira o fato `papel-ignorado`; o
carimbo, `papel-assinado` ou `papel-vetado`.

## Pedido

`{ tipo: "carimbar", papel, carimbo: "assinar" | "vetar", observacao? }`.
O turno traduz para assinar ou vetar da lei do papel (`traduzirCarimbos`).
Papel que não está na mesa, ou que é só aviso, dá erro.

## Fora deste passo

Recusar, encaminhar ao ministro, pilha e as outras famílias (crises, pedidos,
ofertas, órgãos, partido, duvidosos): R17.6 em parte, R17.7 em parte, R17.8
e as demais famílias vêm com o módulo de cada uma.
