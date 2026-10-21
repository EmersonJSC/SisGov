# Conteúdo da versão 1

> **Status: VIGENTE.** Regras para escrever leis, índices, população, ocorrências e
> países. Substitui `docs/fichas/METODO.md`, `docs/fichas/v2/README.md` e o
> catálogo do documento de revisão de 11/out. Decisões D-69 e D-70.

## 1. Leis

### 1.1 Níveis

| Nível               | O que é                                    | Controle                | Como muda no jogo (versão 1)                                                 |
| ------------------- | ------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------- |
| Constituição        | Regra do Estado                            | 2 a 5 opções com nome   | Emenda: 3/5 das duas casas, em dois turnos (V1-12)                           |
| Lei                 | O modelo de um assunto                     | 2 a 5 opções com nome   | Votação no Congresso: maioria simples (ordinária) ou absoluta (complementar) |
| Decreto e orçamento | Uma alavanca: valor, programa ou proibição | Faixa ou liga e desliga | Sem votação; vale no turno seguinte                                          |

Uma lei pode depender de outra (o cheque-escola só existe se a escola não for só
estatal). Quando a lei mãe muda, as filhas que deixam de caber caem, com aviso
antes.

### 1.2 Ficha (formato v3)

| Campo                      | Regra                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `id`, `nome`, `descricao`  | Nome neutro, sem nome de programa ou órgão de um país                                                         |
| `area`, `ministerio`       | Uma das 10 áreas; o ministério vem da configuração do país                                                    |
| `nivel`, `controle`        | Conforme 1.1                                                                                                  |
| `custoPolitico`            | Fora de uso: o capital político saiu no replanejamento de 13/out; o caminho no Congresso vem do nível (V1-12) |
| `dinheiro`                 | Gasto ou receita no mínimo e no máximo, em % do PIB                                                           |
| `implantacao`              | Turnos até fazer efeito e curva de entrada                                                                    |
| `dependeDe`, `excludentes` | Só quando faz sentido                                                                                         |
| `requer`                   | Características do país exigidas ou proibidas                                                                 |
| `efeitos`                  | De 3 a 8, em índices, com mecanismo do motor, atraso e duração                                                |
| `populacao`                | Segmentos que gostam e que não gostam, com intensidade                                                        |
| `historia`                 | Países que usam cada opção e o caso brasileiro                                                                |
| `fontes`                   | Pelo menos uma, com link, para os números                                                                     |

O JSON do jogo é gerado da ficha (detalhes do formato em
`docs/fichas/v3/README.md`). Para o catálogo atual, a fonte completa de edição
é [`docs/conteudo/indice-leis.jsonl`](../conteudo/indice-leis.jsonl): cada linha
reúne a lei, seus efeitos e referências iniciais. A geração publica os JSONs
individuais; o [procedimento](../conteudo/indice-leis.md) evita editar as
saídas diretamente. O verificador recusa ficha sem fonte, com
efeito em índice inexistente, com nome de programa de um país no texto ou com
travessão.

### 1.3 Catálogo

- **Meta: de 350 a 400 leis** nas 10 áreas, a maioria fora de vigor no começo.
- **Toda lei existe ou existiu em algum país**, e a ficha diz onde. Leis de
  ficção não entram.
- **De onde vêm as leis:** constituições e legislação comparada (Constitute
  Project, OCDE, Banco Mundial), a legislação brasileira e o catálogo antigo do
  SisGov (que já foi escrito a partir de leis reais). Nunca de listas de outros
  jogos.
- **Áreas:** Poder e instituições; Segurança e justiça penal; Defesa e mundo;
  Direitos e liberdades; Contas e tributos; Trabalho e mercado; Proteção social;
  Educação, ciência e cultura; Meio ambiente, energia e campo; Cidades e
  transporte.
- **Brasil em vigor:** começa valendo o que o Brasil tem hoje, com o valor de hoje.

## 2. Configuração do país

Cada país é uma pasta com os arquivos descritos em `arquitetura.md`. As
**características** são marcas de sim ou não que ligam leis, eventos e dilemas:
litoral, fronteira terrestre, moeda própria, federação, petróleo, mineração,
floresta tropical, seca, terremotos, furacões, povos originários, tecnologia
nuclear, crime organizado forte, membro de bloco econômico.

O `requer` vai na ficha de lei e no arquivo da ocorrência:
`"requer": { "exige": ["litoral"], "proibe": ["..."] }`. O país que não atende
fica sem aquela lei ou ocorrência; uma lei em vigor que o país não atende é erro de
carga. A lista de ids está em `src/game/pais/configuracao/tipos.ts`.

Criar um país novo é copiar a pasta, trocar características e valores e escolher
as leis em vigor. Nenhuma lei precisa ser escrita de novo. A versão 1 é jogável
só com o Brasil; um país de teste prova que a configuração funciona.

## 3. População

### 3.1 Segmentos do eleitorado (20)

Taxonomia própria, baseada nos cortes que as pesquisas eleitorais brasileiras
usam (renda, ocupação, religião, idade, território e valores). Uma pessoa está em
vários segmentos ao mesmo tempo.

| Eixo            | Segmentos                                                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Renda           | Pobres; Classe média; Ricos                                                                                                                                      |
| Ocupação        | Trabalhadores com carteira; Informais e de aplicativo; Servidores públicos; Empresários; Pequenos empreendedores; Agronegócio; Agricultura familiar; Aposentados |
| Idade e família | Jovens; Famílias com filhos                                                                                                                                      |
| Religião        | Evangélicos; Católicos                                                                                                                                           |
| Valores         | Progressistas; Conservadores; Ambientalistas                                                                                                                     |
| Território      | Periferias das metrópoles; Interior                                                                                                                              |

**Perfis sintéticos.** O eleitorado é um conjunto de algumas centenas de perfis
com peso (por exemplo: "mulher, 35 anos, informal, evangélica, periferia,
pobre"), montados a partir das distribuições de pesquisas oficiais. A satisfação
de cada perfil é a combinação dos seus segmentos; a aprovação e o voto saem dos
perfis. Isso é mais fiel ao país e diferente de sortear eleitores.

### 3.2 Grupos de pressão (20)

Atores reais da vida política, com nomes genéricos para servir a qualquer país.
Cada um tem uma base (segmentos que representa), recursos e um **repertório**
próprio de ações.

| Tipo               | Grupos                                                                                                                                                               | Repertório                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Trabalho           | Centrais sindicais; Sindicatos de servidores; Associações de aposentados                                                                                             | Greve, ato, campanha                                       |
| Empresas           | Confederação da indústria; Entidades do comércio e serviços; Entidades do agronegócio; Mercado financeiro                                                            | Campanha na mídia, fuga de investimento, lobby (versão 2)  |
| Movimentos sociais | Movimentos por terra; Movimentos por moradia; Movimento estudantil; Movimento negro; Movimento feminista; Movimento LGBT; Movimento ambientalista; Povos originários | Ocupação, ato, bloqueio, campanha                          |
| Religião           | Frentes evangélicas; Hierarquia católica                                                                                                                             | Campanha, mobilização de fiéis                             |
| Estado e força     | Associações de policiais e militares                                                                                                                                 | Operação padrão, greve branca                              |
| Mídia              | Grandes grupos de mídia                                                                                                                                              | Pauta negativa, que aumenta o efeito das crises            |
| Crime              | Facções e milícias                                                                                                                                                   | Ameaça e ataque, quando a repressão sobe ou o Estado recua |

A versão 1 calcula a **mobilização** de cada grupo (cresce com a insatisfação da
base e cai com o atendimento) e dispara ações do repertório. Lobby no
parlamento entra com o Congresso (V1-11 e V1-12).

## 4. Índices e situações

- **Índices (cerca de 100):** partem dos 108 já declarados no contexto Brasil 2026
  (SG157), revisados para ter unidade real e fonte oficial (IBGE, Banco Central,
  Tesouro, DataSUS, INEP, Fórum de Segurança, INPE).
- **Situações (cerca de 60):** crises e tendências com limite de entrada e limite
  de saída menor, para não piscar a cada turno. Escritas a partir de crises reais
  (crise da dívida, apagão, guerra de facções, seca, greve geral, bolha
  imobiliária).

## 5. Eventos, dilemas e conquistas

- **Eventos e dilemas:** os 78 eventos e 91 dilemas atuais são revisados um a um:
  texto próprio, ligados aos índices e segmentos novos, sem nenhum que venha de
  outro jogo. Meta de cerca de 120 eventos e 100 dilemas.
- **Conquistas e metas do mandato:** cerca de 30, ligadas a resultados reais
  ("zerar o déficit", "homicídios abaixo de 15 por 100 mil", "reeleito com mais de
  55%").
