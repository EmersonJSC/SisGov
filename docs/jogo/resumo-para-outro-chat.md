# SisGov: resumo para levar a outro chat

Escrito em 08/nov/2026. Texto simples, para quem nunca viu o projeto.

## 1. O que é o jogo

SisGov é um simulador de governo, em português. Quem joga assume a Presidência de um
país, assina leis e vê o efeito no dinheiro, nos indicadores e na opinião da população.

- **Raiz do jogo: a Bússola.** Todo mundo e toda lei tem um lado: esquerda ou direita
  (economia) e libertário ou tradicional (costumes). Nenhuma lei é neutra. Cada lei
  vai de "nada" até "mais", de um lado só. Gostar ou não de uma lei sai da distância
  entre a lei e a pessoa na Bússola.
- **Ciclo:** População, Economia e Governo se alimentam. A Política é o caminho da
  população até o governo.
- **Toda lei é uma bolha no mapa.** O jogador decide abrindo a bolha. Não existe painel
  de gestão. Painéis só mostram.
- **Público-alvo:** gente criativa, que gosta de testar extremos e de números. Por isso
  as leis têm régua com número, não duas ou três opções.
- **Países reais podem entrar** (decidido em 08/nov): as 10 maiores economias são
  jogáveis. Empresas, pessoas e o que tem direito autoral não entram.
- **Narrativas e eventos de crise ficam para o final**, depois das leis e dos índices.

## 2. Como estamos trabalhando

O autor desenha tudo na planilha `docs/jogo/leis.xlsx` antes de programar. Depois vem o
código, passo a passo. Para cada esfera (área de governo) o processo é:

1. Pesquisar o que a realidade mostra.
2. Propor as leis: o que fazem, como funcionam, evidência e lado na Bússola.
3. O autor aprova.
4. Escrever na planilha (aba Leis, aba Leis - roteiro com 8 passos, aba Índices) e
   no GDD (`docs/jogo/gdd.md`).
5. Atualizar o `RETOMAR.md`.

Regras do autor: linguagem simples, com exemplo do dia a dia; os dois lados da Bússola
precisam ter leis próprias; uma decisão por vez, com recomendação.

O roteiro de 8 passos de cada lei: entrada, filtro (o que atrapalha), prédio, pop,
economia, índices, política e conta (quem paga depois).

## 3. O que já está feito

As contagens vêm só da planilha (veja o RETOMAR). Nada foi commitado ainda.

**Esferas com leis e roteiros prontos (20):** Saúde, Vícios, Saneamento, Educação,
Assistência social, Previdência, Trabalho, Moradia, Segurança pública, Justiça e
prisões, Impostos, Defesa, Direitos e liberdades, Estado e eleições, Comunicação e
tecnologia, Relações exteriores, Imigração, Orçamento e dívida, Moeda e bancos, Empresas e estatais.

**Faltam (9):** Ciência e pesquisa, Cultura
e esporte, Defesa civil, Comércio exterior e capital, Agricultura e pesca, Terra, Meio
ambiente, Energia, Infraestrutura e transporte.

**Decisões desta rodada (08/nov):**
- **Mídia:** as 8 maiores mídias do país; cada fato tem uma verdade e uma versão
  (fiel, enviesada ou falsa); notícia falsa existe e pode ser descoberta; entrevista,
  atos do presidente com a mídia, escândalo em ciclo, vazamento, jornalistas.
- **Mundo:** países reais; as 10 maiores economias jogáveis; ranking de 30; vizinhos
  e resto do mundo em bloco. As leis de Relações exteriores agem por país.
- **Imigração:** 16 leis; "nascido fora" é um dado dentro do pop.
- **Orçamento e dívida:** a Regra fiscal virou 4 leis; cada lei abre a sua figura
  (envelopes com cadeado, cofrinho, velocímetro, caixa d'água).
- **Moeda e bancos:** o câmbio é um corredor com preço-alvo e faixa; o resgate de
  bancos é evento (fica para as narrativas).

## 4. Onde paramos: Empresas e estatais

**Pesquisa feita:**
- Privatização em geral melhora eficiência e lucro, mas depende das instituições, da
  concorrência e de quem compra. O emprego da empresa costuma cair.
- Fusões costumam subir preços; o ganho de produtividade é inconsistente.
- Monopólio natural (água, energia): preço-teto faz cortar custo, mas pode faltar
  investimento.
- Cooperativas funcionam em alguns casos, com trabalhadores menos satisfeitos.

**Já existe no jogo (GDD, seção 16, "Empresas e dono"):**
- **Empresa** = conjunto de construções (fábrica, usina, fazenda) de um setor.
- **Dono** pode ser: Estado, privado nacional, estrangeiro, cooperativa ou entidade
  sem lucro. Quem paga a obra é o dono: o privado usa a reserva de investimento que
  vem do lucro; a estatal cresce quando o jogador põe verba.
- **Atos do Estado:** estatizar (comprar ou tomar), criar estatal em qualquer setor,
  transformar em cooperativa, vender a empresa inteira ou só uma construção.
- **Leis que já existem como regras (a revisar):** Indenização na estatização, Prazo
  de pagamento, Regra depois da venda, Política da empresa estatal, Concorrência
  (antitruste).
- **Descartado pelo autor:** a compra de ações em blocos de 2% era da mecânica antiga.
  Também descartada a régua "Parte do Estado no setor".

**Proposta em discussão (o autor ainda não aprovou):**
Quatro **Operações** sobre companhias (não são leis nem bolhas; ficam na lista de companhias, com papéis na mesa). Palavra "programa" fica reservada para um pacote de leis.
1. **Programa de privatização:** marca empresas do Estado e o método (bolsa, leilão,
   concessão). A venda anda em etapas, no ritmo do apetite do mercado.
2. **Programa de estatização:** marca empresas privadas e o alvo (sócio, controle ou
   dono total). O ritmo vem do cofre e da dívida.
3. **Criar estatal:** escolhe o setor e o que construir; cada estatal tem uma Verba
   da estatal.
4. **Transformar em cooperativa.**
Mais 8 regras novas: Ação de ouro, Indicação dos dirigentes das estatais, Tarifa dos
monopólios naturais, Participação dos trabalhadores, Apoio a cooperativas, Abertura de
empresa, Controle de fusões, Preferência a empresas nacionais. E 5 índices: Estado na
economia, Concentração de mercado, Eficiência das estatais, Tempo para abrir empresa,
Trabalhadores em cooperativas.

**Dúvida em aberto do autor:** a diferença entre ação, empresa e prédio. Explicação em
exemplo: pense numa padaria.
- A **ação** é uma fatia do dono da padaria. Quem tem ação recebe parte do lucro, mas
  não manda.
- A **empresa** é a padaria inteira, com todas as lojas dela. Quem é dono manda.
- A **construção** é uma loja. Dá para vender uma loja só, sem vender a empresa.
- Quando o dono da padaria muda, a loja continua no mesmo lugar, fazendo pão. Mudou
  quem recebe o lucro, não o prédio.

Perguntas para pensar na conversa:
- O Estado deve poder ser só "sócio" (receber parte do lucro sem mandar), ou isso
  complica demais?
- Comprar e vender empresas deve ser um programa com fila (etapas) ou outra forma?
- Existe uma camada "companhia dona" com cotas próprias, acima das empresas?
- Como o jogador sente a estatal crescer e o mercado reagir sem virar painel?

## 5. Regras que valem sempre

- Nada do Democracy 4 (nem nome, nem número). Victoria 3 só como ideia.
- O motor do jogo não conhece nomes de leis, partidos ou países; os nomes ficam em
  arquivos de dados.
- Nenhuma lei fala de grupo; quem gosta sai da Bússola.
- Antes de qualquer lei: "um presidente real assinaria e pronto, ou é um processo?".

## 6. Onde ver cada coisa

- A planilha: `docs/jogo/leis.xlsx` (abas Leis, Leis - roteiro, Índices, Esferas,
  Ligações, Pops, Grupos, Organizações, Economia - ...).
- O jogo escrito: `docs/jogo/gdd.md` (seções 14 Mídia, 15 Mundo, 16 Economia).
- Onde parei: `RETOMAR.md`.
