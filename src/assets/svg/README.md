# SVGs do SisGov

Esta é a pasta de referências visuais do projeto. Aceita SVGs feitos pelo usuário, por IA, por artistas ou provenientes de bibliotecas. Os arquivos atuais do Lucide são provisórios; não é necessário usar Lucide para adicionar ou substituir um desenho.

## Adicionar um desenho

1. Salve o arquivo aqui, por exemplo `protecao-mulheres.svg`.
2. No JSON da política, use `"icone": "protecao-mulheres"`.
3. Abra o mapa. O ambiente de desenvolvimento descobre o arquivo automaticamente; para distribuir o jogo, gere uma nova compilação.

Subpastas também funcionam: `saude/atendimento.svg` corresponde a `"icone": "saude/atendimento"`. O nome distingue maiúsculas de minúsculas. Não inclua `.svg`, URL ou caminho absoluto no JSON.

Não há cadastro manual em TypeScript. Para substituir uma arte sem editar os JSONs, mantenha o caminho do arquivo. Ícone ausente ou desconhecido usa `landmark.svg` como reserva.

## Formato visual

- Inclua `viewBox`, por exemplo `viewBox="0 0 24 24"`.
- Use fundo transparente e desenho legível em tamanho pequeno.
- O desenho pode ter traços, preenchimentos ou cores próprias; não precisa reproduzir o estilo Lucide.
- A bolinha, suas cores, valores e estados são desenhados pela interface, não pelo SVG.
- O nome acessível e a identificação ao focar ou passar o mouse vêm da política.
- Prefira desenho vetorial autocontido, sem fontes, imagens remotas ou scripts. O carregador exibe o arquivo como imagem, sem injetar seu conteúdo como HTML.

Exemplo mínimo de SVG próprio:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 4v16M4 12h16" fill="none" stroke="#24384a"
        stroke-width="2" stroke-linecap="round"/>
</svg>
```

Uma IA pode produzir diretamente esse formato textual e salvar o arquivo na pasta. Imagem PNG ou JPEG não se torna vetorial ao trocar a extensão.

## Origem e licenças

O lote inicial (`camera`, `landmark`, `network`, `shield-user`, `stethoscope`, `syringe`) veio do repositório oficial https://github.com/lucide-icons/lucide. Os avisos estão em `LICENSE-Lucide.txt` e são distribuídos em `public/licenses/lucide.txt`. Preserve os avisos enquanto essas artes forem utilizadas. Registre separadamente a origem e licença de novos conjuntos; SVGs próprios não são automaticamente atribuídos ao Lucide.
