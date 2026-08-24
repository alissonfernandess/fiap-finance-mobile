# FIAP Finance Mobile

Aplicativo mobile de gerenciamento financeiro desenvolvido como parte do Tech Challenge da Pós-Tech FIAP.

O projeto permite cadastrar, visualizar, pesquisar, editar e excluir transações financeiras. Também apresenta um resumo financeiro com saldo, receitas, despesas e análise gráfica por período.

## Funcionalidades

### Usuário e sessão

- Cadastro com nome completo e telefone
- Persistência do nome do usuário
- Entrada automática quando existe uma sessão local
- Logout com remoção do usuário salvo
- Proteção das rotas privadas

### Dashboard

- Saudação com o nome do usuário
- Saldo calculado automaticamente
- Total de receitas
- Total de despesas
- Opção para ocultar e exibir valores
- Exibição das três transações mais recentes
- Estado vazio quando não existem transações
- Acesso à edição das transações

### Transações

- Cadastro de receitas e despesas
- Descrição da transação
- Valor em reais
- Categoria
- Data
- Validação de formulário
- Edição de transações
- Exclusão com confirmação
- Persistência local dos dados

### Extrato

- Listagem completa das transações
- Pesquisa por descrição
- Filtro por receitas
- Filtro por despesas
- Acesso aos detalhes de cada transação

### Análise financeira

- Saldo total
- Total de receitas
- Total de despesas
- Gráfico de receitas e despesas
- Agrupamento das transações por mês
- Atualização automática após adicionar, editar ou excluir

### Navegação

O menu lateral possui acesso para:

- Início
- Extrato
- Análise financeira
- Nova transação
- Sair

## Tecnologias

- Expo SDK 57
- React 19
- React Native
- Expo Router
- TypeScript
- React Hook Form
- Zod
- AsyncStorage
- React Native SVG
- Ionicons
- Jest
- Jest Expo
- React Native Testing Library

## Estrutura do projeto

```text
fiap-finance-mobile
├── __tests__
│   ├── calculateFinancialSummary.test.ts
│   └── transactionSchema.test.ts
├── assets
│   └── images
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── cadastro.tsx
│   │   │   └── boas-vindas.tsx
│   │   ├── (private)
│   │   │   ├── transacao
│   │   │   │   ├── [id].tsx
│   │   │   │   └── nova.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── extrato.tsx
│   │   │   └── analise.tsx
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── components
│   │   ├── charts
│   │   ├── common
│   │   ├── dashboard
│   │   ├── forms
│   │   ├── navigation
│   │   └── transactions
│   ├── contexts
│   │   ├── TransactionContext.tsx
│   │   └── UserContext.tsx
│   ├── schemas
│   │   └── transactionSchema.ts
│   ├── types
│   │   └── transaction.ts
│   ├── utils
│   │   └── calculateFinancialSummary.ts
│   └── theme
├── package.json
├── tsconfig.json
└── README.md
```

## Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/cadastro` | Cadastro do usuário | Público |
| `/boas-vindas` | Boas-vindas após o cadastro | Público |
| `/dashboard` | Resumo financeiro | Privado |
| `/extrato` | Listagem e filtros | Privado |
| `/analise` | Indicadores e gráfico | Privado |
| `/transacao/nova` | Cadastro de transação | Privado |
| `/transacao/[id]` | Edição e exclusão | Privado |

## Como executar

### Pré-requisitos

Antes de iniciar, instale:

- Node.js 18 ou superior
- npm
- Expo Go ou um emulador Android/iOS

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entrar na pasta

```bash
cd fiap-finance-mobile
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o projeto

```bash
npm start
```

Também é possível executar:

```bash
npx expo start
```

No Windows, caso o PowerShell apresente bloqueio do `npx`, utilize:

```powershell
npx.cmd expo start
```

### Executar no Android

```bash
npm run android
```

### Executar no iOS

```bash
npm run ios
```

### Executar no navegador

```bash
npm run web
```

## Persistência local

O projeto utiliza AsyncStorage para armazenar:

- Nome do usuário
- Lista de transações

Dessa forma, os dados permanecem disponíveis após atualizar, fechar ou reabrir o aplicativo.

O logout remove o usuário salvo, mas as transações continuam armazenadas localmente.

## Validação das transações

O formulário utiliza Zod para validar:

- Descrição entre 3 e 80 caracteres
- Valor obrigatório e maior que zero
- Operação do tipo receita ou despesa
- Categoria válida
- Data válida

Categorias disponíveis:

- Alimentação
- Casa
- Educação
- Lazer
- Saúde
- Salário
- Transporte
- Transferência
- Outros

## Testes automatizados

O projeto utiliza Jest com o preset `jest-expo`.

Os testes atuais verificam:

### Resumo financeiro

- Soma das receitas
- Soma das despesas
- Cálculo do saldo
- Saldo negativo
- Lista de transações vazia

### Validação

- Transação válida
- Descrição curta
- Valor zerado
- Valor não numérico
- Operação inválida
- Categoria inválida
- Data inválida
- Valor no formato brasileiro

### Executar os testes

```bash
npm test
```

### Executar em modo contínuo

```bash
npm run test:watch
```

### Gerar relatório de cobertura

```bash
npm run test:coverage
```

## Verificação de qualidade

### Verificar o TypeScript

No Windows:

```powershell
npx.cmd tsc --noEmit
```

Em outros sistemas:

```bash
npx tsc --noEmit
```

### Executar o lint

```bash
npm run lint
```

### Verificação completa

```bash
npm run lint
npx tsc --noEmit
npm test
```

No Windows:

```powershell
npm run lint
npx.cmd tsc --noEmit
npm test
```

## Comandos utilizados no desenvolvimento

### Instalar o AsyncStorage

```powershell
npx.cmd expo install @react-native-async-storage/async-storage
```

### Instalar o React Native SVG

```powershell
npx.cmd expo install react-native-svg
```

### Instalar as ferramentas de teste

```powershell
npx.cmd expo install jest-expo jest @types/jest "@testing-library/react-native" "--" --dev
```

### Verificar as versões dos testes

```powershell
npm ls jest jest-expo @testing-library/react-native
```

### Verificar erros do TypeScript

```powershell
npx.cmd tsc --noEmit
```

## Arquitetura

O aplicativo utiliza uma arquitetura baseada em responsabilidades:

- `app`: telas e rotas do Expo Router
- `components`: componentes reutilizáveis
- `contexts`: estado global e persistência
- `schemas`: validações com Zod
- `types`: tipos e interfaces
- `utils`: funções auxiliares e regras reutilizáveis
- `theme`: cores e tipografia

### Contextos

#### TransactionContext

Responsável por:

- Carregar as transações
- Adicionar transações
- Atualizar transações
- Excluir transações
- Salvar alterações no AsyncStorage

#### UserContext

Responsável por:

- Carregar o usuário salvo
- Salvar o nome
- Controlar a sessão local
- Remover o usuário no logout

## Próximos passos

- Ampliar os testes dos contextos e componentes
- Adicionar máscara ao campo de telefone
- Melhorar a máscara monetária
- Adicionar estados de carregamento
- Revisar acessibilidade
- Adicionar capturas de tela ao README
- Gerar uma build de avaliação
- Revisar os requisitos finais da FIAP

## Autor

**Felipe Yukio Saito**

Projeto desenvolvido para a Pós-Tech FIAP.