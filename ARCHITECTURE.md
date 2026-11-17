# Clean Architecture - Detalhamento Técnico

Este documento complementa o README.md com detalhes técnicos da implementação da Clean Architecture.

## Estrutura de Pastas Atual

```
src/
├── domain/                    # Enterprise Business Rules (Pure TypeScript)
│   ├── entities/              # Transaction, User, Receipt
│   ├── repositories/          # Ports: ITransactionRepository, IUserRepository, IAuthRepository, IReceiptRepository
│   ├── use-cases/             # Application Business Rules
│   │   ├── transactions/      # Get, Create, Update, Delete
│   │   ├── auth/              # Login, Register, Logout, GetCurrentUser, SubscribeToAuthChanges
│   │   └── receipts/          # Upload, Delete
│   └── services/              # FinancialCalculator, TransactionValidator
│
├── data/                      # Interface Adapters
│   ├── repositories/          # Implementations with caching
│   ├── datasources/
│   │   ├── firebase/          # FirebaseAuthDataSource, FirebaseTransactionDataSource, etc.
│   │   └── local/             # SecureStorage (AES-GCM), CacheStorage (TTL)
│   ├── mappers/               # Firestore ↔ Domain conversion
│   └── cache/                 # TanStack Query client & typed queryKeys
│
├── presentation/              # UI Layer
│   ├── components/            # Reusable UI components by category
│   ├── hooks/                 # TanStack Query hooks + business logic hooks
│   ├── store/                 # Zustand stores: authStore, transactionStore, uiStore
│   └── styles/                # Theme tokens (colors, typography)
│
├── infrastructure/            # Framework Configurations
│   ├── firebase/              # Centralized Firebase initialization
│   ├── navigation/            # Typed routes & Auth/Guest guards
│   └── security/              # Encryption, Biometric, TokenManager
│
└── app/                       # Expo Router entry points
```

## Fluxo de Dados

```
UI (Components/Screens)
    ↓
Presentation Hooks (useTransactions, useAuth, etc.)
    ↓
Use Cases (Domain)
    ↓
Repository Interfaces (Ports)
    ↓
Repository Implementations (Data)
    ↓
Data Sources (Firebase / Local)
    ↓
Mappers (Data ↔ Domain)
```

## Inversão de Dependência

- **Domain** define interfaces (`ITransactionRepository`, etc.)
- **Data** implementa as interfaces
- **Presentation** usa Use Cases que dependem das interfaces
- **Infrastructure** configura frameworks externos

Isso permite:
- Testar Use Cases com mocks das interfaces
- Trocar Firebase por outro backend sem alterar Domain/Presentation
- Isolar lógica de negócio de detalhes de implementação

## Gerenciamento de Estado

### Zustand (Global UI State)
- `authStore` - user, tokens, isAuthenticated, biometricEnabled (persistido)
- `transactionStore` - UI state para formulários/listas
- `uiStore` - modais, side menu, tema

### TanStack Query (Server State)
- Cache inteligente (staleTime: 5min, gcTime: 30min)
- Invalidação automática em mutations
- Optimistic updates para UX responsiva
- Background refetch on reconnect/window focus

### Cache Local (CacheStorage)
- TTL de 2 minutos para dados offline-first
- Complementa React Query para recuperação rápida

## Segurança

| Camada | Implementação |
|--------|---------------|
| Domain | Zod validation schemas |
| Data | Repository access control by UID |
| Infrastructure | AES-GCM encryption, SecureStorage, TokenManager (auto-refresh), Biometric auth |
| Firebase | Firestore/Storage rules by UID |

## Convenções

### Nomenclatura
- Interfaces: `I` prefix (ex: `ITransactionRepository`)
- Implementações: `Impl` suffix (ex: `TransactionRepositoryImpl`)
- Use Cases: `UseCase` suffix (ex: `CreateTransactionUseCase`)
- Data Sources: `DataSource` suffix (ex: `FirebaseTransactionDataSource`)
- Mappers: `Mapper` suffix (ex: `TransactionMapper`)
- Hooks: `use` prefix (ex: `useTransactions`)

### Imports
- Use path aliases: `@/domain/...`, `@/data/...`, `@/presentation/...`, `@/infrastructure/...`
- Barrel exports via `index.ts` em cada pasta

### Tipagem
- Types estritos (no `any`)
- DTOs separados de Entities
- Zod schemas como source of truth para validação

## Padrões Utilizados

1. **Repository Pattern** - Abstração de persistência
2. **Use Case Pattern** - Encapsula regras de negócio
3. **Mapper Pattern** - Conversão Data ↔ Domain
4. **Provider Pattern** - Context para injeção de dependências (QueryClientProvider, UserProvider)
5. **Guard Pattern** - Proteção de rotas (AuthGuard, GuestGuard)
6. **Optimistic Updates** - UX responsiva com rollback automático