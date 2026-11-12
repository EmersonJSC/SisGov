# Política: Congresso

Passo 3 da ordem de construir (12/nov/2026), sobre o módulo do passo 8 de
01/nov. Os **partidos são do país** (`paises/<id>/congresso.json`): nome, cor,
cadeiras, `defende`, e opcionalmente `coesao` e `contas`. O motor só conhece
"partido", "cadeiras", "governo" e "coligação". Sem Congresso nas regras, todo
pedido passa e o decreto vale na hora.

Código: `tipos.ts` (formas), `voto.ts` (a nota e a contagem),
`tramitacao.ts` (o turno do Congresso), `index.ts` (validação e porta).

## O voto (sem sorteio)

A **nota** de cada partido para a lei vai de −1 a +1 e soma:

- **grupos** que ele defende (distância na bússola × peso, motor/grupos);
- **povo**: o quanto os grupos, pesados pelas pessoas, querem a mudança;
- **lado**: base (+) ou oposição (−), e o **termômetro** do partido;
- **aprovação** do governo (satisfação média dos grupos);
- **conta da lei**: lei de gasto, pontos do PIB × interesse do partido nas
  contas (`contas`, padrão 0,5) × déficit atual (dobra com 5 pontos);
- **fatos** da mesa: escândalo e manchete contra pesam;
- **paciência** da casa abaixo de 30: a casa pune o governo;
- **moedas** oferecidas àquele partido, menos o preço que ele já aprendeu.

O governo vota sim, salvo se a lei for exorbitante. **Exorbitante** é a lei
que passaria sem o peso da conta e cai por causa dele.

**Fiéis e livres:** a coesão (`coesao`, padrão 0,7) divide a bancada. Os fiéis
seguem a nota do partido; os livres olham mais os grupos e o povo (e, a menos
de 3 turnos da eleição, só o povo pesa mais). A conta de cadeiras é inteira.

**Indecisos:** partido com nota entre −0,12 e +0,12.

**Quórum por classe da lei** (`classe` na lei; a planilha tem a coluna
Classe): comum = a maioria do país; absoluta = o valor da lei Quórum das
votações (no mínimo a maioria); constitucional = +0,10; mandato = +0,15.

**Placar previsto = placar real:** `placarPrevisto` usa a mesma conta que a
votação. O que muda o placar entre o turno e a votação é um fato, e ele
aparece.

## Duas casas e o tempo da lei

- Pedido novo entra na pauta e a **Câmara** vota no mesmo turno.
- Aprovada e há Senado (`senado` no país, cadeiras por partido): o **Senado**
  vota no turno seguinte; aprovada, a lei muda.
- Senado que reprova uma lei de régua tenta **emendar** (valor a meio caminho);
  se a emenda passa, a lei volta à **Câmara** no turno seguinte e depois vai à
  **mesa** (sanção).
- Na mesa (motor/mesa) a lei emendada espera um turno: assinada, ou ignorada com sanção tácita, sai como lei; com **veto** (`vetar`, com observação) ou ignorada com veto tácito, a Câmara vota a derrubada com o quórum absoluto. O país declara `ignorar`.
- País de uma casa só vota uma vez e a lei muda no turno 1.
- Lei derrotada fica **2 turnos barrada**.
- **Carga:** cada casa vota até `carga` leis por turno (padrão 3); as outras
  esperam na fila. Só atrasa, nunca proíbe.

## As moedas (pedido `oferecer`)

Cada compra sobe o preço do próximo voto daquele partido (+0,15; esquece 0,05
por turno).

- **Ceder na régua:** o valor pedido anda 1/3 do caminho até o atual.
- **Cargos:** reserva = valor da lei Cargos de livre nomeação × 400.
- **Emenda:** reserva = 5 por degrau da lei Emendas dos parlamentares.
- **Promessa:** vira papel com prazo de 4 turnos; cumprida, anima; quebrada,
  o termômetro cai 25 e vira fato.
- **Ministério:** dá uma caixa ao partido (`caixa`); o governo (motor/governo) nomeia o candidato mais competente dele. O partido vota mais com o governo enquanto tiver ministro (+0,3) e perde 8 de termômetro se o ministro dele for demitido.

## Decreto (pedido `decretar`)

Vale já, sem voto, se a lei Poder de decreto deixar. Alcance pelo degrau da
lei: nenhum; só verba e preço (lei de gasto); tudo de classe comum; tudo sem
confirmar. O Congresso confirma ou derruba em 2 turnos; derrubado, a lei volta
ao valor de antes e vira fato. Cada decreto cansa as casas (8, mais 4 por
decreto vigente).

## Relação (termômetro e paciência)

- **Termômetro** (0–100) por partido: a cada turno anda 1/4 do caminho até a
  satisfação dos grupos dele; sobe com moedas, cai com lei contra ele
  aprovada e promessa quebrada. Na base: abaixo de 30 vira fato "ameaça sair",
  abaixo de 20 sai. Na oposição: acima de 70 aceita o convite (`convidar`).
- **Paciência** (0–100) por casa: +3 por turno, +3 no turno sem lei nova do
  governo; cai com decreto, veto e lei demais (mais de 2 no turno).

## Fatos

Escreve: lei aprovada/rejeitada, emenda, veto, veto derrubado, decreto,
decreto derrubado, promessa cumprida/descumprida, partido entra/sai/ameaça sair.
Lê: escândalo e manchete contra (ninguém escreve ainda).

## Fora deste passo

Rejeitar por conta própria, propor lei popular, travar a pauta, CPI,
impeachment, sistemas de governo e mudança de cadeiras na eleição (R12.5,
R12.8–R12.10); bancadas e lobby (R12.15). O botão de promessa e de
decreto na tela fica para depois.
