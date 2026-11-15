# Organizações políticas (passo I2, 15/nov)

Regras e moldes em `mundo/organizacoes/organizacoes.json`. O motor não conhece
nome de grupo nem de organização; GDD 2.7.

- **Quem entra:** cada molde atrai os radicais acima da base (5%) dos grupos
  perto dele na bússola (`parecenca`, a mesma dos grupos); sem `bussola`, atrai
  todos. `grupos` restringe a lista. Molde com `armas` só recebe grupo com
  `armas: true` (grupos.json). Só a `adesao` dos atraídos entra de fato (rua
  10%, armado 1%).
- **Nascer:** sem sorte. Quando os atraídos passam do `limiar` (0,5% da
  população) por `turnos_para_nascer` turnos seguidos (4), nasce uma do molde,
  se não houver. Um turno abaixo zera a conta (`acima`).
- **Onde:** no estado em que os radicais que o molde atrai são a maior parte
  da gente (proporção, não número). Hoje a piora é do país inteiro e o estado
  só muda a mistura de pops: urbanas vão ao estado mais urbano, as do campo ao
  mais rural. Passa a valer de verdade quando o estado tiver economia própria.
- **Nome:** tipo + ideia do molde, sorteados entre os livres (só o nome tem
  sorte); nenhum se repete na partida (`nomes`, pelo id).
- **Crescer:** a gente anda `ritmo` (10%) do caminho até atraídos × adesão
  (dividido entre as do mesmo molde pela gente).
- **Ameaça** = gente ÷ população × (1 armado, `sem_armas` 0,05 sem armas). Níveis:
  relevante 0,01%, grave 0,05%, crítica 0,2%. Pontos nos índices por 1% de
  ameaça (polarização +20, segurança −30, sensação de insegurança +30), até
  ±15, na base (como o saneamento).
- **Tomadas das leis:** `repressao` (0 a 1) corta o alvo da gente e soma
  `revolta` × repressão × atração pontos de radical por turno nos grupos que
  alimentam; `inteligencia` dá chance `inteligencia` × tomada por turno de pegar
  os chefes: a organização perde metade e, se ainda for grande, racha em duas
  com outro nome. `calma` (I1) baixa os radicais. Nenhuma lei liga ainda.
- **Acabar:** `fim_turnos` (6) seguidos com os atraídos abaixo do limiar.
- **Fatos:** nasceu, cresceu (subiu de nível), rachou, acabou; grandes quando a
  ameaça é grave ou crítica. Sobre = estado; quem = id da organização.
- Fora: crime organizado (espera Segurança e Vícios), igrejas e sindicatos
  como atores, financiamento e rastro, virar partido, presos com nome.
