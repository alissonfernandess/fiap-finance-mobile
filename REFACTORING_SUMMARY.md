# Refatoração Clean Architecture - Completa

## Resumo das Mudanças

### 1. Camada Domain (Regras de Negócio da Empresa)
**Localização:** `src/domain/`

- **Entidades** (`src/domain/entities/`):
  - `Transaction.ts` - Entidade central de transação com tipagem adequada, DTOs e filtros
  - `User.ts` - Entidade de usuário com tipos relacionados a autenticação
  - `Receipt.ts` - Entidade de comprovante com constantes de validação de arquivo

- **Interfaces de Repositórios** (`src/domain/repositories/`):
  - `ITransactionRepository` - CRUD de transações + subscriptions em tempo real
  - `IUserRepository` - Gerenciamento de perfil do usuário
  - `IAuthRepository` - Operações de autenticação
  - `IReceiptRepository` - Upload/exclusão de comprovantes

- **Use Cases** (`src/domain/use-cases/`):
  - `transactions/` - Obter, Criar, Atualizar, Excluir transações
  - `auth/` - Login, Cadastro, Logout, GetCurrentUser, SubscribeToAuthChanges
  - `receipts/` - Upload, Exclusão de comprovantes

- **Serviços de Domínio** (`src/domain/services/`):
  - `FinancialCalculator` - Cálculos de resumo, breakdown por categoria, tendências mensais
  - `TransactionValidator` - Schemas Zod para validação na borda do domínio

### 2. Camada Data (Adaptadores de Interface)
**Localização:** `src/data/`

- **Implementações de Repositórios** (`src/data/repositories/`):
  - `TransactionRepositoryImpl` - Implementa ITransactionRepository com cache
  - `UserRepositoryImpl` - Implementa IUserRepository
  - `AuthRepositoryImpl` - Implementa IAuthRepository com gerenciamento de tokens
  - `ReceiptRepositoryImpl` - Implementa IReceiptRepository

- **Data Sources** (`src/data/datasources/`):
  - `firebase/` - Implementações Firebase (Auth, Firestore, Storage)
  - `local/` - SecureStorage com criptografia, CacheStorage com TTL

- **Mappers** (`src/data/mappers/`):
  - `TransactionMapper`, `UserMapper`, `ReceiptMapper` - Conversão Firestore ↔ Domain

- **Cache** (`src/data/cache/`):
  - `queryClient.ts` - Configuração do TanStack Query
  - `queryKeys.ts` - Query keys tipadas para invalidação de cache

### 3. Camada Presentation (UI)
**Localização:** `src/presentation/`

- **Gerenciamento de Estado** (`src/presentation/store/`):
  - `authStore` - Store Zustand para estado de auth (persistido)
  - `transactionStore` - Store Zustand para estado de UI de transações
  - `uiStore` - Store Zustand para estado de UI (modais, menus, tema)

- **Hooks** (`src/presentation/hooks/`):
  - `useTransactions` - Hooks TanStack Query para transações
  - `useAuth` - Hooks de auth com gerenciamento automático de sessão
  - `useReceipts` - Hooks de upload/exclusão de comprovantes
  - `useFinancialSummary` - Cálculos financeiros derivados

### 4. Camada Infrastructure (Frameworks)
**Localização:** `src/infrastructure/`

- **Firebase** (`src/infrastructure/firebase/`):
  - `config.ts` - Inicialização centralizada do Firebase

- **Navegação** (`src/infrastructure/navigation/`):
  - `routes.ts` - Definições tipadas de rotas
  - `guards.ts` - Guards de rota Auth/Guest

- **Segurança** (`src/infrastructure/security/`):
  - `encryption.ts` - Criptografia AES-GCM para dados sensíveis
  - `biometric.ts` - Autenticação FaceID/TouchID
  - `tokenManager.ts` - Armazenamento seguro de tokens com auto-refresh

### 5. Telas Atualizadas
Todas as telas agora usam a nova arquitetura:
- `app/_layout.tsx` - QueryClientProvider + inicialização do Firebase
- `app/(private)/dashboard.tsx` - hook useFinancialSummary
- `app/(private)/extrato.tsx` - hook useTransactions com filtros
- `app/(private)/analise.tsx` - useFinancialSummary com gráficos
- `app/(private)/transacao/nova.tsx` - useCreateTransaction + useUploadReceipt
- `app/(private)/transacao/[id].tsx` - useTransaction + useUpdateTransaction
- `app/(auth)/login.tsx` - hook useAuth
- `app/(auth)/cadastro.tsx` - hook useAuth

### 6. Principais Melhorias

#### Clean Architecture
- ✅ Separação de responsabilidades: Domain, Data, Presentation, Infrastructure
- ✅ Inversão de dependência: Repositórios dependem de interfaces
- ✅ Testabilidade: Use cases são TypeScript puro, facilmente testáveis unitariamente

#### Gerenciamento de Estado
- ✅ Zustand para estado global de UI (auth, UI, transações)
- ✅ TanStack Query para estado do servidor (cache, background refetch, optimistic updates)
- ✅ Estado de auth persistido com armazenamento seguro

#### Performance
- ✅ Cache inteligente (2min local, 5min React Query)
- ✅ Padrão stale-while-revalidate
- ✅ Invalidação automática de cache em mutations
- ✅ Lazy loading pronto para code splitting

#### Segurança
- ✅ Criptografia AES-GCM para tokens/credenciais
- ✅ Suporte a autenticação biométrica
- ✅ Armazenamento seguro de tokens com gerenciamento de expiração
- ✅ Validação de entrada na borda do domínio (Zod)

#### Experiência do Desenvolvedor
- ✅ Query keys tipadas
- ✅ Tipos TypeScript adequados em todo o código
- ✅ Context providers compatíveis com versões anteriores
- ✅ Configuração centralizada do Firebase

### 7. Novas Dependências Adicionadas
- `@tanstack/react-query` - Gerenciamento de estado do servidor
- `zustand` - Gerenciamento de estado global
- `expo-local-authentication` - Auth biométrico
- `expo-crypto` - Utilitários criptográficos

### Notas de Migração
- Contexts antigos (`TransactionContext`, `UserContext`) mantidos para compatibilidade com versões anteriores
- Componentes podem migrar gradualmente para os novos hooks
- Serviços Firebase substituídos por implementações de repositórios
- Nenhuma breaking change nos componentes de UI existentes