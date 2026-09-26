# SisGov

Ambiente web inicial do SisGov.

## Ambiente de desenvolvimento

Versões verificadas em 26 de setembro de 2026:

- Node.js 22.23.2
- npm 12.0.2

Instale as dependências a partir do lockfile:

```bash
npm ci
```

## Comandos

Iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Executar os testes:

```bash
npm test
```

Gerar uma versão de produção e validar os tipos:

```bash
npm run build
```

Em 26 de setembro de 2026, `npm run build` e `npm test` concluíram com sucesso. Os testes executados foram 2, sem falhas.

## Próximo passo

O SG004 definirá a configuração mínima de formatação e lint. Até lá, utilize `npm test` e `npm run build` como verificações locais.
