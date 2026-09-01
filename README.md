# FIAP Finance Mobile

Aplicativo de gerenciamento financeiro desenvolvido em React Native como parte do Tech Challenge da Pós-Tech FIAP.

O sistema permite autenticar usuários, gerenciar receitas e despesas, consultar análises financeiras e armazenar transações e comprovantes na nuvem por meio do Firebase.

## Funcionalidades

### Autenticação e usuário

- Cadastro com nome, telefone, e-mail e senha
- Login com e-mail e senha
- Autenticação pelo Firebase Authentication
- Persistência da sessão
- Logout
- Proteção das rotas privadas
- Perfil do usuário armazenado no Cloud Firestore
- Separação dos dados por UID

### Dashboard

- Saudação personalizada
- Saldo calculado automaticamente
- Total de receitas
- Total de despesas
- Opção de ocultar e exibir valores
- Três transações mais recentes
- Estado vazio
- Acesso ao extrato completo
- Animações de entrada
- Compatibilidade com a configuração de redução de movimento do dispositivo

### Transações

- Cadastro de receitas e despesas
- Descrição
- Valor em reais
- Categoria
- Data
- Validação com Zod
- Edição
- Exclusão com confirmação
- Persistência no Cloud Firestore
- Atualização em tempo real
- Isolamento das transações por usuário autenticado

### Comprovantes

- Anexo opcional
- Suporte a JPEG, PNG e PDF
- Limite de 5 MB por arquivo
- Upload para o Firebase Storage
- Visualização do comprovante
- Troca do arquivo
- Remoção do arquivo
- Exclusão automática ao excluir a transação
- Regras de segurança por UID

### Extrato

- Listagem das transações
- Busca por descrição
- Filtro por receitas e despesas
- Filtro por categoria
- Filtro por data inicial e final
- Combinação de filtros
- Limpeza dos filtros avançados
- Scroll infinito em blocos de 10 transações
- Acesso à edição de cada transação
- Estados de carregamento e lista vazia

### Análise financeira

- Saldo total
- Total de receitas
- Total de despesas
- Gráfico de receitas e despesas
- Agrupamento das transações por mês
- Atualização automática após cadastrar, editar ou excluir

### Navegação

O menu lateral oferece acesso a:

- Início
- Extrato
- Análise financeira
- Nova transação
- Logout

## Tecnologias

- Expo SDK 57
- React 19
- React Native
- Expo Router
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- AsyncStorage para persistência da autenticação no ambiente nativo
- React Hook Form
- Zod
- Expo Document Picker
- React Native SVG
- React Native Animated
- Ionicons
- Jest
- Jest Expo
- React Native Testing Library

## Arquitetura

O projeto está organizado por responsabilidades:

- `app`: rotas e telas do Expo Router
- `components`: componentes reutilizáveis
- `contexts`: estado global e comunicação com o Firebase
- `schemas`: validações dos formulários
- `services`: configuração e serviços do Firebase
- `types`: tipos e interfaces
- `utils`: cálculos e funções auxiliares
- `theme`: cores e tipografia

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
│   │   │   ├── boas-vindas.tsx
│   │   │   ├── cadastro.tsx
│   │   │   └── login.tsx
│   │   ├── (private)
│   │   │   ├── transacao
│   │   │   │   ├── [id].tsx
│   │   │   │   └── nova.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── analise.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── extrato.tsx
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
│   ├── services
│   │   ├── firebase.ts
│   │   └── receiptStorage.ts
│   ├── types
│   │   └── transaction.ts
│   ├── utils
│   │   └── calculateFinancialSummary.ts
│   └── theme
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/login` | Login do usuário | Público |
| `/cadastro` | Cadastro do usuário | Público |
| `/boas-vindas` | Boas-vindas após o cadastro | Autenticado |
| `/dashboard` | Resumo financeiro | Privado |
| `/extrato` | Listagem, busca e filtros | Privado |
| `/analise` | Indicadores e gráfico | Privado |
| `/transacao/nova` | Cadastro de transação | Privado |
| `/transacao/[id]` | Edição e exclusão | Privado |

## Como executar

### Pré-requisitos

- Node.js 20 LTS ou superior
- npm
- Expo Go, emulador Android/iOS ou navegador
- Projeto configurado no Firebase

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
npm install --legacy-peer-deps
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Os valores estão disponíveis em:

```text
Firebase Console
→ Configurações do projeto
→ Geral
→ Seus aplicativos
→ Configuração do SDK
```

O arquivo `.env` contém a configuração do ambiente e não deve ser enviado ao GitHub.

### 5. Iniciar o projeto

```bash
npm start
```

Também é possível utilizar:

```bash
npx expo start
```

No Windows:

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

## Configuração do Firebase

### Authentication

No Firebase Console:

1. Abra `Authentication`.
2. Entre em `Método de login`.
3. Ative o provedor `E-mail/senha`.

### Cloud Firestore

Estrutura utilizada:

```text
users
└── UID
    ├── name
    ├── phone
    ├── email
    ├── createdAt
    ├── updatedAt
    └── transactions
        └── transactionId
            ├── description
            ├── value
            ├── operation
            ├── category
            ├── date
            ├── type
            ├── receiptUrl
            ├── createdAt
            └── updatedAt
```

Regras do Firestore:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update, delete:
        if request.auth != null
        && request.auth.uid == userId;

      match /transactions/{transactionId} {
        allow read, create, update, delete:
          if request.auth != null
          && request.auth.uid == userId;
      }
    }
  }
}
```

### Firebase Storage

O Firebase Storage exige que o projeto esteja no plano Blaze. O projeto acadêmico pode permanecer dentro das cotas gratuitas, dependendo da região e do uso.

Estrutura utilizada:

```text
users
└── UID
    └── receipts
        └── arquivo
```

Regras do Storage:

```text
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/receipts/{fileName} {
      allow read, delete:
        if request.auth != null
        && request.auth.uid == userId;

      allow create, update:
        if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024
        && (
          request.resource.contentType.matches('image/.*')
          || request.resource.contentType == 'application/pdf'
        );
    }
  }
}
```

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

## Segurança

- As rotas privadas exigem autenticação.
- Cada documento é associado ao UID do usuário.
- As regras do Firestore restringem o acesso aos dados do proprietário.
- As regras do Storage restringem os comprovantes ao proprietário.
- Somente imagens e PDFs de até 5 MB são aceitos.
- O `.env` está protegido pelo `.gitignore`.
- O `.env.example` não contém credenciais.

## Testes automatizados

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

Execução sem paralelismo:

```bash
npm test -- --runInBand
```

Modo contínuo:

```bash
npm run test:watch
```

Relatório de cobertura:

```bash
npm run test:coverage
```

## Verificação de qualidade

### TypeScript

```bash
npx tsc --noEmit
```

No Windows:

```powershell
npx.cmd tsc --noEmit
```

### ESLint

```bash
npm run lint
```

### Verificação completa

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
```

No Windows:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd test -- --runInBand
```

## Principais comandos utilizados

```powershell
npx.cmd expo install @react-native-async-storage/async-storage
npx.cmd expo install react-native-svg
npx.cmd expo install expo-document-picker -- --legacy-peer-deps
npm.cmd install --save-dev @react-native/jest-preset@0.86.3 --legacy-peer-deps
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd test -- --runInBand
```

## Decisões técnicas

### Context API

O projeto utiliza Context API e Providers para centralizar autenticação e transações.

### UserContext

Responsável por:

- Observar o estado do Firebase Authentication
- Cadastrar usuários
- Realizar login
- Atualizar o perfil
- Manter o usuário autenticado
- Realizar logout

### TransactionContext

Responsável por:

- Carregar as transações do usuário autenticado
- Escutar atualizações do Firestore em tempo real
- Adicionar transações
- Atualizar transações
- Excluir transações
- Impedir acesso sem autenticação

### Receipt Storage

Responsável por:

- Enviar comprovantes
- Validar formato e tamanho
- Gerar a URL de download
- Remover arquivos substituídos
- Remover arquivos de transações excluídas

## Acessibilidade

- Labels em botões e controles interativos
- Funções semânticas para botões e links
- Estados selecionados nos filtros
- Cores centralizadas no tema
- Suporte à configuração de redução de movimento
- Áreas de toque ampliadas em controles importantes

## Melhorias futuras

- Aplicar máscara automática ao telefone
- Aprimorar a máscara monetária
- Ampliar a cobertura dos testes de componentes e contextos
- Gerar builds nativas para Android e iOS
- Adicionar capturas de tela ao README

## Autor

**Felipe Yukio Saito**

Projeto desenvolvido para o Tech Challenge da Pós-Tech FIAP.