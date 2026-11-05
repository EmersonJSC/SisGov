# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**05/nov/2026**

## Onde está

Frente atual: **avaliar os índices, um por vez** (lista em
[docs/jogo/indices-avaliacao.md](docs/jogo/indices-avaliacao.md)). Favela e
saneamento fechados. **Saúde em andamento**, tratada como área: 16 das 19 leis
feitas e commitadas. `npx tsc -b`
limpo, 365 testes passando. Número sem balanço.

| Grupo | Feitas | Faltam |
|---|---|---|
| Quem paga | Verba, Abertura de planos, Limite aos planos, Seguro na folha, Cobertura gratuita, Coparticipação, Dedução do plano, Conta de saúde, Filantrópicos | |
| Quem atende | Telemedicina livre, Serviço obrigatório, Carreira exclusiva, Gestão privada, Missões médicas | |
| Como prevenir | Atenção preventiva, Saúde ambiental | Direito de recusar, Vacinação, Imposto sobre vícios |

Colisões feitas: todas, menos Vacinação × Recusar. Valem juntas: Seguro +
Cobertura, Conta + Coparticipação.

Como funciona a rede: `src/motor/atendimento/atendimento.md`. O que as leis custam
ou trazem fora da verba fica em `atendimento.custo` e entra no gasto do governo.

## Próximo

Decisão do autor sobre as 3 leis que faltam: Vacinação e Direito de recusar pedem peça ou índice novo, e o
Imposto sobre vícios precisa dizer sobre o que incide. Fechada a saúde: Saúde vai
para "Avaliados", e a próxima área é a Educação (com vagas públicas, faculdades
privadas e diploma estrangeiro, GDD §18). As rodadas até 05/nov estão em
[docs/historico/retomar.md](docs/historico/retomar.md).

## Pontos em aberto da saúde

- A ficha não mostra dinheiro das leis de opções: o custo das 8 leis novas só
  aparece no gasto do governo.
- A Coparticipação mede o bolso contra a renda do próprio país: pesa pela
  desigualdade de renda, não pelo PIB. No `teste` a saúde cai mais que no
  `teste-pobre`, porque ele tem mais gente na rede.
- A fila de 45% no país `teste` é estado de teste, não balanço.
- A ficha mostra só um turno da deriva; o acumulado fica maior.
- `emprego_informal` ainda não tem grupo que cobre nem empurrão próprio.
- `acesso_remedios` fica para depois das 19 leis.

## Depois da saúde (ideias guardadas)

Caminhos até a casa, organizações criminosas (GDD §18), campo e a fila da terra.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- 92 commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.
- `docs/jogo/gdd.md` não passa no prettier: `--write` mexe em linhas de fora; não formatar.
- No zsh, `--include=*.ts` sem aspas quebra: pôr o padrão entre aspas.
- `jogar` nos testes falha depois do turno ~24: usar 20 turnos.
- `icones.ts` diz que é gerado, mas `scripts/icones/` não existe: lei nova entra à mão em `ICONE_LEI`, com desenho que já esteja em `DESENHOS`.
- `reputacao_internacional` vem das potências, não da base: mexer na `base` não faz nada; somar em `comReputacao`.
