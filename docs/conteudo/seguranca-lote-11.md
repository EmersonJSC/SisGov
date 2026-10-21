# Lote 11: investigação, drogas e facções

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Fontes do catálogo balizam a
> existência dos instrumentos. Efeitos e números são hipóteses de jogo, não
> estimativas empíricas.

## Decisões e hierarquia

```text
lei-de-drogas (revista no lote 7: usuário não preso ou critério de uso)
  └─ cannabis-legal (clubes → farmácias → lojas licenciadas)

regime-contra-faccoes (alvo e rito da repressão)
poderes-de-investigacao (infiltração e acesso a dados)
interceptacao-de-comunicacoes (escutas e prazo)
agencia-de-inteligencia (verba para pessoal e investigação)
```

As cinco fichas foram **mantidas**. `poderes-de-investigacao` trata de
infiltração e acesso a dados; `interceptacao-de-comunicacoes`, de escutas;
`agencia-de-inteligencia`, de capacidade por orçamento. Essas ações podem ser
combinadas. A venda legal de cannabis continua dependente da opção compatível
da lei de drogas. A agência é ficha v3 e já tinha quatro efeitos diretos; a
suspeita de que estava sem efeito veio de ler apenas o campo `consequencias`
das fichas v2.

| Lei | Escolhas do jogador | Ganho e perda |
| --- | --- | --- |
| `regime-contra-faccoes` | Processo comum; confiscar bens e isolar líderes com ordem; ou prisões em massa e suspensão de garantias. | A repressão reduz crime com atraso, mas aumenta lotação, tensão prisional e custo; o extremo derruba liberdades. Recebeu quatro efeitos diretos que faltavam. |
| `cannabis-legal` | Clubes; farmácias com receita; lojas licenciadas. | O mercado legal reduz parte da receita das facções e eleva arrecadação, mas pode aumentar uso e dividir grupos conservadores e religiosos. As opções ganharam custo, apoios e rejeições. |
| `poderes-de-investigacao` | Mandado para tudo; infiltração supervisionada; ou acesso a dados sem mandado. | Mais inteligência e menos impunidade versus liberdade civil. |
| `interceptacao-de-comunicacoes` | Proibir; escuta judicial limitada; escuta judicial sem prazo; ou escuta sem ordem em segurança nacional. | Melhor alcance das investigações versus privacidade e confiança. |
| `agencia-de-inteligencia` | Ajustar verba de 0 a 0,05% do PIB. | Analistas e inteligência com atraso versus gasto e risco de vigilância. |

## Ensaio de 16 turnos

`scripts/teste/setorSegurancaLote11.ts` compara referência e duas rotas na
mesma semente, sem ocorrências ou eleição. A rota **repressiva** combina
prisões em massa, poderes e escutas máximos e agência no teto. A **regulada**
combina confisco judicial, investigação e escuta com juiz, metade da verba da
agência e lojas de cannabis. A aplicação direta testa a rede, não o Congresso.

| Indicador no turno 16 | Referência | Repressiva | Regulada |
| --- | ---: | ---: | ---: |
| Crime organizado | 70,909 | 61,584 | 64,698 |
| Inteligência | 18,538 | 60,635 | 28,040 |
| Violência letal | 20,799 | 11,476 | 15,915 |
| Liberdade civil | 70,030 | 48,644 | 63,305 |
| Lotação prisional | 42,504 | 49,519 | 40,655 |
| Rebeliões | 11,998 | 15,995 | 12,997 |
| Uso de drogas | 15,007 | 15,019 | 17,819 |
| Arrecadação (% do PIB) | 31,119 | 31,622 | 31,331 |
| Gasto público (% do PIB) | 30,800 | 31,065 | 30,909 |
| Segurança percebida | 35,404 | 44,696 | 37,403 |
| Dívida (% do PIB) | 114,397 | 114,188 | 114,254 |
| Satisfação média | 48,931 | 49,551 | 47,557 |

Os controles chegaram ao nível escolhido. Inteligência e liberdades diferiram
até o turno 4; crime organizado e uso de drogas reagiram mais claramente a
partir do turno 8. As três partidas acabaram sem travamento ou valor inválido.
O dilema é mensurável: a rota repressiva derruba violência, mas perde 21,386
pontos de liberdade civil e aumenta lotação. A regulada preserva mais direitos
e alivia vagas, mas aumenta uso de drogas e perde satisfação no curto prazo.
Esta é uma hipótese de equilíbrio e precisa de avaliação humana de diversão.

**Verificação focal:** 3 testes em `src/tests/segurancaLote11.test.ts`
passaram. `npm run check` continua adiado até a revisão geral.
