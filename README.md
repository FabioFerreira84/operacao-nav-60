# Operação NAV 60

Site público de reta final para o concurso NAV Brasil 2026, com plano de estudo,
300 questões autorais, cinco simulados progressivos e feedback por erro.

## Acesso

<https://fabioferreira84.github.io/operacao-nav-60/>

## Contrato do conteúdo

As questões são autorais, alinhadas ao edital e inspiradas em padrões recorrentes
da FGV. Não são questões oficiais e não possuem calibração psicométrica.

O progresso e os resultados ficam somente no `localStorage` do navegador de cada
usuário. O site não envia respostas ou dados pessoais para um servidor.

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação completa:

```bash
npm test
npm run export:pages
```

O workflow `.github/workflows/pages.yml` publica automaticamente a saída estática
em GitHub Pages quando a branch `main` recebe um novo commit.
