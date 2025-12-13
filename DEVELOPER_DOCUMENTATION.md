# Internal Developer Documentation

## Table of Contents

1. [Repository Overview](#1-repository-overview)
2. [Core Files and Their Roles](#2-core-files-and-their-roles)
3. [Query Patterns](#3-query-patterns)
4. [Mutation Patterns](#4-mutation-patterns)
5. [Directory Organization](#5-directory-organization)
6. [Code Patterns and Conventions](#6-code-patterns-and-conventions)
7. [Common Utilities](#7-common-utilities)
8. [Examples and Best Practices](#8-examples-and-best-practices)
9. [Testing Patterns](#9-testing-patterns)
10. [Build and Distribution](#10-build-and-distribution)

---

## 1. Repository Overview

### Purpose and Scope

The `@connectedxm/admin` SDK is a TypeScript/JavaScript library that provides a type-safe interface for interacting with the ConnectedXM Admin API. It is designed to be used in React applications and provides both direct function calls and React Query hooks for data fetching and mutations.

### Technology Stack

- **TypeScript**: Full type safety throughout the codebase
- **React Query (TanStack Query)**: Data fetching, caching, and synchronization
- **Axios**: HTTP client for API requests
- **React**: Framework for React hooks and context providers
- **Immer**: Immutable state updates (used internally)

### High-Level Architecture

The SDK follows a layered architecture:

```
┌─────────────────────────────────────┐
│   React Components (Consumer)        │
│   Uses hooks: useGet*, useCreate*   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   React Query Hooks Layer           │
│   useConnectedSingleQuery           │
│   useConnectedInfiniteQuery         │
│   useConnectedMutation              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Functions Layer               │
│   GetAccount, CreateAccount, etc.   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   AdminAPI (Axios Instance)         │
│   GetAdminAPI()                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   ConnectedXM Admin API            │
└─────────────────────────────────────┘
```

### Project Structure Overview

```
src/
├── AdminAPI.ts              # Core API client factory
├── ConnectedXMProvider.tsx  # React context provider
├── interfaces.ts            # All TypeScript interfaces and enums
├── params.ts                # Input parameter interfaces for mutations
├── index.ts                 # Main entry point (exports everything)
├── queries/                 # Query hooks organized by domain
│   ├── useConnectedSingleQuery.ts
│   ├── useConnectedInfiniteQuery.ts
│   ├── useConnectedCursorQuery.ts
│   └── [domain]/           # accounts/, events/, etc.
├── mutations/               # Mutation hooks organized by domain
│   ├── useConnectedMutation.ts
│   └── [domain]/           # account/, event/, etc.
├── hooks/                   # Core React hooks
│   └── useConnectedXM.ts   # Context hook
└── utilities/              # Helper functions
    ├── CacheIndividualQueries.ts
    ├── MergeInfinitePages.ts
    └── ...
```

---

## 2. Core Files and Their Roles

### 2.1 `src/interfaces.ts`

**Purpose**: Centralized TypeScript interfaces and enums that define all API response types, domain models, and constants used throughout the SDK.

**Key Contents**:
- `ConnectedXMResponse<T>` - Wrapper interface for all API responses
- Domain models: `Account`, `Event`, `Group`, `Channel`, etc.
- Enums: `EventType`, `AccountAccess`, `PassTypeVisibility`, etc.
- Type definitions for nested resources

**Pattern**: All API response types extend `ConnectedXMResponse<TData>`:

```typescript
export interface ConnectedXMResponse<TData> {
  status: string;
  message: string;
  count?: number;
  data: TData;
  cursor?: string | number | null;
}
```

**Example Usage**:

```typescript
// Response type for a single account
ConnectedXMResponse<Account>

// Response type for a list of accounts
ConnectedXMResponse<Account[]>

// Response type with cursor for pagination
ConnectedXMResponse<Account[]> // cursor field included
```

**Conventions**:
- All domain models are PascalCase (e.g., `Account`, `EventSession`)
- Enums use PascalCase for the enum name and SCREAMING_SNAKE_CASE for values
- Nested interfaces follow the pattern `ParentChild` (e.g., `EventSession`, `AccountAddress`)

### 2.2 `src/params.ts`

**Purpose**: Input parameter interfaces for all mutations. These define the shape of data sent to the API when creating or updating resources.

**Pattern**: All mutation inputs follow naming conventions:
- `*CreateInputs` - For creating new resources (e.g., `AccountCreateInputs`)
- `*UpdateInputs` - For updating existing resources (e.g., `AccountUpdateInputs`)
- `*TranslationUpdateInputs` - For updating translated fields (e.g., `EventTranslationUpdateInputs`)

**Example**:

```typescript
export interface AccountCreateInputs {
  email: string;
  username?: string | null;
  featured?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  // ... more fields
}

export interface AccountUpdateInputs {
  accountAccess?: keyof typeof AccountAccess | null;
  featured?: boolean;
  firstName?: string | null;
  // ... more fields (all optional for updates)
}
```

**Key Patterns**:
- Create inputs typically have required fields (e.g., `email: string`)
- Update inputs make most fields optional (e.g., `firstName?: string | null`)
- Fields can be `null` to explicitly clear values
- Enum values use `keyof typeof EnumName` for type safety
- Some fields accept both `string` and `number` (e.g., `price: number | string`)

**Relationship to API**: These interfaces mirror the backend validation schemas. When the API schema changes, these interfaces must be updated accordingly.

### 2.3 `src/AdminAPI.ts`

**Purpose**: Core API client factory that creates configured Axios instances for making API requests.

**Key Components**:

#### `AdminApiParams` Interface

```typescript
export interface AdminApiParams {
  apiUrl: "https://admin-api.connected.dev" 
      | "https://staging-admin-api.connected.dev" 
      | "http://localhost:4001";
  organizationId: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  apiKey?: string;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
}
```

**Parameters**:
- `apiUrl`: The base URL for the API (production, staging, or local)
- `organizationId`: Required organization identifier
- `getToken`: Optional function to retrieve authentication token
- `apiKey`: Optional API key for server-side usage
- `getExecuteAs`: Optional function for impersonation (admin feature)

#### `GetAdminAPI()` Function

Creates a configured Axios instance with proper headers:

```typescript
export const GetAdminAPI = async (
  params: AdminApiParams
): Promise<AxiosInstance> => {
  const token = !!params.getToken && (await params.getToken());
  const executeAs = params.getExecuteAs
    ? await params.getExecuteAs()
    : undefined;

  return axios.create({
    baseURL: params.apiUrl,
    headers: {
      organization: params.organizationId,
      authorization: token,
      "api-key": params.apiKey,
      executeAs: executeAs,
    },
  });
};
```

**Usage**: All query and mutation functions call `GetAdminAPI()` to get a configured client before making requests.

### 2.4 `src/ConnectedXMProvider.tsx`

**Purpose**: React context provider that supplies SDK configuration and error handling callbacks to all hooks.

**Required Props**:

```typescript
interface ConnectedXMProviderProps {
  queryClient: QueryClient;           // React Query client instance
  organizationId: string;              // Organization ID
  apiUrl: "https://admin-api.connected.dev" | ...;
  getToken: () => Promise<string | undefined>;
  children: React.ReactNode;
}
```

**Optional Callbacks**:

```typescript
onNotAuthorized?: (
  error: AxiosError<ConnectedXMResponse<any>>,
  key: QueryKey,
  shouldRedirect: boolean
) => void;

onModuleForbidden?: (
  error: AxiosError<ConnectedXMResponse<any>>,
  key: QueryKey,
  shouldRedirect: boolean
) => void;

onNotFound?: (
  error: AxiosError<ConnectedXMResponse<any>>,
  key: QueryKey,
  shouldRedirect: boolean
) => void;

onMutationError?: (
  error: AxiosError<ConnectedXMResponse<null>>,
  variables: Omit<MutationParams, "queryClient" | "adminApiParams">,
  context: unknown
) => void;
```

**SSR Considerations**: The provider handles server-side rendering by initially rendering with SSR flag, then updating after mount to prevent hydration mismatches.

**Usage Example**:

```tsx
<QueryClientProvider client={queryClient}>
  <ConnectedXMProvider
    queryClient={queryClient}
    organizationId={ORGANIZATION_ID}
    apiUrl="https://admin-api.connected.dev"
    getToken={getToken}
    onNotAuthorized={(error) => {
      // Handle 401 errors
      router.push('/login');
    }}
    onModuleForbidden={(error) => {
      // Handle 403/460/461 errors
      showError('You do not have permission');
    }}
  >
    {children}
  </ConnectedXMProvider>
</QueryClientProvider>
```

---

## 3. Query Patterns

### 3.1 Query Types

The SDK provides three types of queries, each optimized for different use cases:

#### Single Queries (`useConnectedSingleQuery`)

**Pattern**: Fetch a single resource by ID or identifier.

**File**: `src/queries/useConnectedSingleQuery.ts`

**Use Case**: When you need one specific resource (e.g., a single account, event, or group).

**Example**:

```typescript
const { data: account, isLoading } = useGetAccount(accountId);
```

**Characteristics**:
- Returns a single resource
- Automatically handles 404 errors
- 60-second stale time
- Retries up to 3 times on network errors

#### Infinite Queries (`useConnectedInfiniteQuery`)

**Pattern**: Paginated lists using page numbers (1, 2, 3, ...).

**File**: `src/queries/useConnectedInfiniteQuery.ts`

**Use Case**: When fetching paginated lists where pages are numbered sequentially.

**Example**:

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useGetAccounts(verified, online, {
  pageSize: 25,
  search: "john"
});
```

**Characteristics**:
- Uses `pageParam` (number) for pagination
- Default page size: 25
- Automatically determines next page based on response length
- Supports search and ordering
- Includes search term in query key

**Pagination Logic**:

```typescript
const getNextPageParam = (lastPage, allPages) => {
  if (lastPage.data.length === params.pageSize) {
    return allPages.length + 1;
  }
  return undefined; // No more pages
};
```

#### Cursor Queries (`useConnectedCursorQuery`)

**Pattern**: Paginated lists using cursor-based pagination.

**File**: `src/queries/useConnectedCursorQuery.ts`

**Use Case**: When the API uses cursor-based pagination (more efficient for large datasets).

**Example**:

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage
} = useGetSomeCursorBasedList({
  pageSize: 50
});
```

**Characteristics**:
- Uses `cursor` (string | number | null) for pagination
- Initial cursor is `null`
- Next cursor comes from `response.cursor`
- Better for large datasets and real-time data

**Pagination Logic**:

```typescript
const getNextPageParam = (lastPage) => {
  if (lastPage.cursor) {
    return lastPage.cursor;
  }
  return null; // No more pages
};
```

### 3.2 Query File Structure

Each query file follows a consistent structure with four main components:

#### 1. Query Key Function

Generates the React Query cache key for this query.

```typescript
/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_QUERY_KEY = (accountId: string) => [
  ...ACCOUNTS_QUERY_KEY(),
  accountId,
];
```

**Conventions**:
- Named: `*_QUERY_KEY`
- Returns an array (React Query key format)
- Can accept parameters for filtering/variants
- Nested keys spread parent keys

#### 2. Query Setter Function

Helper function to manually update the cache.

```typescript
/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccount>>
) => {
  client.setQueryData(ACCOUNT_QUERY_KEY(...keyParams), response);
};
```

**Conventions**:
- Named: `SET_*_QUERY_DATA`
- Takes QueryClient, key parameters, and response data
- Used in mutations to optimistically update cache

#### 3. Query Function

The actual API call function (can be used standalone).

```typescript
/**
 * @category Queries
 * @group Accounts
 */
export const GetAccount = async ({
  accountId = "",
  adminApiParams,
}: GetAccountProps): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}`);
  return data;
};
```

**Conventions**:
- Named: `Get*` (PascalCase)
- Accepts `adminApiParams` (and other params)
- Returns `Promise<ConnectedXMResponse<T>>`
- Can be used outside React (direct function calls)

#### 4. React Hook

React Query hook wrapper for use in components.

```typescript
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccount = (
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccount>>(
    ACCOUNT_QUERY_KEY(accountId),
    (params: SingleQueryParams) =>
      GetAccount({ accountId: accountId || "unknown", ...params }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
```

**Conventions**:
- Named: `useGet*` (camelCase with "use" prefix)
- Wraps the query function with `useConnectedSingleQuery` or similar
- Accepts options that extend base query options
- Handles conditional enabling (e.g., only run if ID exists)

### 3.3 Query Key Conventions

Query keys follow a hierarchical structure that enables efficient cache management.

#### Structure Pattern

```typescript
["RESOURCE_TYPE", ...filters, ...identifiers]
```

#### Examples

**Base List Query**:
```typescript
ACCOUNTS_QUERY_KEY() 
// Returns: ["ACCOUNTS"]
```

**Filtered List Query**:
```typescript
ACCOUNTS_QUERY_KEY(true, false) // verified=true, online=false
// Returns: ["ACCOUNTS", "VERIFIED", "OFFLINE"]
```

**Single Resource Query**:
```typescript
ACCOUNT_QUERY_KEY("account-123")
// Returns: ["ACCOUNTS", "account-123"]
// Note: Spreads parent key for hierarchy
```

**Nested Resource Query**:
```typescript
EVENT_SESSION_QUERY_KEY("event-123", "session-456")
// Returns: ["EVENTS", "event-123", "SESSIONS", "session-456"]
```

#### Key Design Principles

1. **Hierarchical Inheritance**: Child keys include parent keys
   ```typescript
   export const ACCOUNT_QUERY_KEY = (accountId: string) => [
     ...ACCOUNTS_QUERY_KEY(),  // Includes parent
     accountId,
   ];
   ```

2. **Filter Representation**: Filters are included as string constants
   ```typescript
   if (typeof verified !== "undefined")
     keys.push(verified ? "VERIFIED" : "UNVERIFIED");
   ```

3. **Identifier Last**: Resource IDs come after filters
   ```typescript
   ["EVENTS", "PAST", "FEATURED", "event-123"]
   ```

4. **Consistent Naming**: Use SCREAMING_SNAKE_CASE for constants

#### Benefits of This Structure

- **Automatic Invalidation**: Invalidating `["ACCOUNTS"]` invalidates all account queries
- **Granular Updates**: Can update specific queries without affecting others
- **Type Safety**: Query keys are typed and autocompleted
- **Debugging**: Clear hierarchy makes cache inspection easier

---

## 4. Mutation Patterns

### 4.1 Mutation Structure

Each mutation file follows a consistent three-part structure:

#### 1. Params Interface

Defines the parameters for the mutation function.

```typescript
/**
 * @category Params
 * @group Account
 */
export interface CreateAccountParams extends MutationParams {
  account: AccountCreateInputs;
}
```

**Conventions**:
- Extends `MutationParams` (includes `adminApiParams` and `queryClient`)
- Named: `*Params` (e.g., `CreateAccountParams`, `UpdateAccountParams`)
- Includes domain-specific parameters

#### 2. Mutation Function

The actual API call function (can be used standalone).

```typescript
/**
 * @category Methods
 * @group Account
 */
export const CreateAccount = async ({
  account,
  adminApiParams,
  queryClient,
}: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Account>>(
    `/accounts`,
    account
  );
  
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  
  return data;
};
```

**Conventions**:
- Named: `Create*`, `Update*`, `Delete*` (PascalCase)
- Accepts params including `adminApiParams` and `queryClient`
- Returns `Promise<ConnectedXMResponse<T>>`
- Handles cache updates on success

#### 3. React Hook

React Query mutation hook wrapper.

```typescript
/**
 * @category Mutations
 * @group Account
 */
export const useCreateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccount>>,
      Omit<CreateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountParams,
    Awaited<ReturnType<typeof CreateAccount>>
  >(CreateAccount, options);
};
```

**Conventions**:
- Named: `useCreate*`, `useUpdate*`, `useDelete*`
- Wraps mutation function with `useConnectedMutation`
- Options exclude `queryClient` and `adminApiParams` (injected automatically)
- Can accept React Query mutation options (onSuccess, onError, etc.)

### 4.2 Cache Invalidation Patterns

Mutations must update the React Query cache to keep the UI in sync. There are two main strategies:

#### Strategy 1: Invalidate and Refetch

Invalidate query keys to trigger automatic refetching.

```typescript
if (queryClient && data.status === "ok") {
  queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
}
```

**When to Use**:
- After creating new resources (adds to list)
- After deleting resources (removes from list)
- When you want fresh data from the server

**Benefits**:
- Ensures data consistency
- Handles edge cases automatically
- Simple to implement

**Drawbacks**:
- Causes network request
- May cause loading states

#### Strategy 2: Optimistic Updates

Directly update the cache with known data.

```typescript
if (queryClient && data.status === "ok") {
  // Invalidate list to show new item
  queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
  
  // Optimistically update single item cache
  SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
}
```

**When to Use**:
- After updating existing resources
- When you have the complete updated data
- To provide instant UI feedback

**Benefits**:
- Instant UI updates
- Better user experience
- Reduces unnecessary requests

**Drawbacks**:
- Must ensure data consistency
- More complex implementation

#### Common Patterns

**Create Pattern**:
```typescript
// 1. Invalidate list (to show new item)
queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });

// 2. Set individual item cache (for immediate access)
SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
```

**Update Pattern**:
```typescript
// 1. Invalidate list (in case item appears in filtered views)
queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });

// 2. Update individual item cache
SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
```

**Delete Pattern**:
```typescript
// 1. Invalidate list (to remove item)
queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });

// 2. Remove individual item cache
queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEY(accountId) });
```

**Complex Invalidation**:
```typescript
// Invalidate multiple related queries
queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
queryClient.invalidateQueries({ queryKey: EVENT_ATTENDEES_QUERY_KEY(eventId) });
queryClient.invalidateQueries({ queryKey: ["REPORTS"] });
```

### 4.3 Mutation File Organization

Mutations are organized by domain, similar to queries:

```
mutations/
├── useConnectedMutation.ts    # Base mutation hook
├── account/
│   ├── index.ts               # Exports all account mutations
│   ├── useCreateAccount.ts
│   ├── useUpdateAccount.ts
│   ├── useDeleteAccount.ts
│   └── ...
├── event/
│   ├── index.ts
│   ├── useCreateEvent.ts
│   └── ...
└── ...
```

**Translation Mutations**: Some resources have translatable fields. These follow a special pattern:

```typescript
// In params.ts
export interface EventTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

// In mutations/event/translations/
export const useUpdateEventTranslation = ...
```

**Naming Convention**: `*TranslationUpdateInputs` and `useUpdate*Translation`

---

## 5. Directory Organization

### 5.1 `src/queries/`

Queries are organized by domain (resource type), with base utilities in the root.

#### Structure

```
queries/
├── useConnectedSingleQuery.ts      # Base single query hook
├── useConnectedInfiniteQuery.ts    # Base infinite query hook
├── useConnectedCursorQuery.ts      # Base cursor query hook
├── index.ts                        # Exports all queries
├── accounts/
│   ├── index.ts                   # Exports account queries
│   ├── useGetAccount.ts
│   ├── useGetAccounts.ts
│   ├── useGetAccountEvents.ts
│   └── ...
├── events/
│   ├── index.ts
│   ├── useGetEvent.ts
│   ├── useGetEvents.ts
│   └── ...
└── ...
```

#### Domain Organization

Each domain folder contains:
- **Multiple query files**: One per endpoint/resource
- **index.ts**: Barrel export file that re-exports all queries from the domain

**Example `index.ts`**:

```typescript
// queries/accounts/index.ts
export * from "./useGetAccount";
export * from "./useGetAccounts";
export * from "./useGetAccountEvents";
// ... etc
```

#### Base Utilities

The root `queries/` directory contains reusable query hooks:
- `useConnectedSingleQuery.ts` - Wrapper for single resource queries
- `useConnectedInfiniteQuery.ts` - Wrapper for paginated list queries
- `useConnectedCursorQuery.ts` - Wrapper for cursor-based queries

These provide:
- Consistent error handling
- Automatic retry logic
- Standardized query options
- Integration with `ConnectedXMProvider`

### 5.2 `src/mutations/`

Mutations follow the same domain-based organization as queries.

#### Structure

```
mutations/
├── useConnectedMutation.ts         # Base mutation hook
├── index.ts                        # Exports all mutations
├── account/
│   ├── index.ts                   # Exports account mutations
│   ├── useCreateAccount.ts
│   ├── useUpdateAccount.ts
│   ├── useDeleteAccount.ts
│   └── ...
├── event/
│   ├── index.ts
│   ├── useCreateEvent.ts
│   ├── translations/              # Translation mutations
│   │   ├── useUpdateEventTranslation.ts
│   │   └── ...
│   └── ...
└── ...
```

#### Domain Organization

Similar to queries:
- **Multiple mutation files**: One per operation (Create, Update, Delete, etc.)
- **index.ts**: Barrel export file
- **translations/**: Subfolder for translation-specific mutations (when applicable)

#### Base Utility

`useConnectedMutation.ts` provides:
- Automatic `adminApiParams` injection
- Error handling integration
- QueryClient access
- Standardized mutation options

### 5.3 `src/utilities/`

Utility functions used across queries and mutations.

#### Available Utilities

**Cache Management**:
- `CacheIndividualQueries.ts` - Caches individual items from list responses
- Used in queries to populate single-item caches from list responses

**Data Transformation**:
- `TransformPrice.ts` - Formats price values
- `GetImageVariant.ts` - Generates image URLs with variants
- `CalculateDuration.ts` - Calculates time durations

**Query Helpers**:
- `MergeInfinitePages.ts` - Flattens infinite query pages into single array
- `AppendInfiniteQuery.ts` - Appends new page to infinite query cache

**Type Utilities**:
- `IsUUID.ts` - Validates UUID format
- `GetErrorMessage.ts` - Extracts error messages from responses

#### Usage Pattern

Utilities are imported from the main index:

```typescript
import { MergeInfinitePages, CacheIndividualQueries } from "@connectedxm/admin";
```

---

## 6. Code Patterns and Conventions

### 6.1 Error Handling

The SDK implements standardized error handling across all queries and mutations.

#### HTTP Status Code Handling

All query hooks handle these status codes consistently:

**401 - Unauthorized**:
```typescript
if (error.response?.status === 401) {
  if (onNotAuthorized) onNotAuthorized(error, queryKeys, shouldRedirect);
  return false; // Don't retry
}
```
- Triggers `onNotAuthorized` callback
- Typically indicates expired token
- No automatic retry

**403/460/461 - Forbidden**:
```typescript
if (error.response?.status === 403 ||
    error.response?.status === 460 ||
    error.response?.status === 461) {
  if (onModuleForbidden) onModuleForbidden(error, queryKeys, shouldRedirect);
  return false; // Don't retry
}
```
- Triggers `onModuleForbidden` callback
- Indicates user lacks permission
- No automatic retry

**404 - Not Found**:
```typescript
if (error.response?.status === 404) {
  if (onNotFound) onNotFound(error, queryKeys, shouldRedirect);
  return false; // Don't retry
}
```
- Triggers `onNotFound` callback
- Resource doesn't exist
- No automatic retry

**Other Errors**:
```typescript
// Default retry logic
if (failureCount < 3) return true;
return false;
```
- Retries up to 3 times
- For network errors, timeouts, etc.

#### Retry Configuration

- **Stale Time**: 60 seconds (data considered fresh for 1 minute)
- **Max Retries**: 3 attempts for network errors
- **No Retry**: For 4xx status codes (client errors)

#### Error Callbacks

All error callbacks receive:
1. **Error object**: Axios error with response data
2. **Query key**: The React Query key that failed
3. **Should redirect flag**: Whether redirect should occur

### 6.2 Type Safety

The SDK is fully typed with TypeScript for maximum type safety.

#### Generic Types

Functions use generics for reusability:

```typescript
export const useConnectedSingleQuery = <TQueryData = unknown>(
  queryKeys: QueryKey,
  queryFn: (params: SingleQueryParams) => TQueryData,
  options: SingleQueryOptions<TQueryData> = {}
)
```

#### Response Wrapper

All API responses use `ConnectedXMResponse<T>`:

```typescript
export interface ConnectedXMResponse<TData> {
  status: string;
  message: string;
  count?: number;
  data: TData;
  cursor?: string | number | null;
}
```

#### Type Inference

React Query hooks infer types from query functions:

```typescript
const { data } = useGetAccount(accountId);
// data is automatically typed as ConnectedXMResponse<Account> | undefined
```

#### Enum Types

Enums are used with `keyof typeof` for type safety:

```typescript
export interface AccountUpdateInputs {
  accountAccess?: keyof typeof AccountAccess | null;
  // TypeScript ensures only valid enum values
}
```

### 6.3 JSDoc Categories

All exported functions use JSDoc with category tags for documentation generation.

#### Categories

- `@category Keys` - Query key functions (`*_QUERY_KEY`)
- `@category Setters` - Cache setter functions (`SET_*_QUERY_DATA`)
- `@category Queries` - Query functions (`Get*`)
- `@category Hooks` - React hooks (`useGet*`, `useCreate*`)
- `@category Mutations` - Mutation hooks (`useCreate*`, etc.)
- `@category Methods` - Mutation functions (`Create*`, `Update*`, `Delete*`)
- `@category Params` - Parameter interfaces (`*Params`)

#### Groups

- `@group Accounts` - Account-related functions
- `@group Events` - Event-related functions
- `@group Organization` - Organization-related functions
- etc.

#### Example

```typescript
/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_QUERY_KEY = (accountId: string) => [...];

/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccount = (accountId: string) => {...};
```

### 6.4 Naming Conventions

Consistent naming makes the codebase predictable and maintainable.

#### Query Functions

- **Hook**: `useGet*` (e.g., `useGetAccount`, `useGetAccounts`)
- **Function**: `Get*` (e.g., `GetAccount`, `GetAccounts`)
- **Key**: `*_QUERY_KEY` (e.g., `ACCOUNT_QUERY_KEY`, `ACCOUNTS_QUERY_KEY`)
- **Setter**: `SET_*_QUERY_DATA` (e.g., `SET_ACCOUNT_QUERY_DATA`)

#### Mutation Functions

- **Hook**: `useCreate*`, `useUpdate*`, `useDelete*`
- **Function**: `Create*`, `Update*`, `Delete*`
- **Params**: `*Params` (e.g., `CreateAccountParams`)

#### File Names

- **Queries**: `useGet*.ts` (e.g., `useGetAccount.ts`)
- **Mutations**: `useCreate*.ts`, `useUpdate*.ts`, `useDelete*.ts`
- **Match the hook name**

#### Variables

- **camelCase** for variables and functions
- **PascalCase** for types, interfaces, and classes
- **SCREAMING_SNAKE_CASE** for constants

---

## 7. Common Utilities

### 7.1 Cache Management

#### `CacheIndividualQueries`

Caches individual items from a list response into their respective single-item query caches.

**Purpose**: When fetching a list, also populate individual item caches for instant access.

**Signature**:
```typescript
export const CacheIndividualQueries = <TData extends ItemWithId>(
  page: ConnectedXMResponse<TData[]>,
  queryClient: QueryClient,
  queryKeyFn: (id: string) => QueryKey,
  itemMap?: (item: TData) => TData
) => void
```

**Usage Example**:
```typescript
const { data } = await adminApi.get('/accounts');
CacheIndividualQueries(
  data,
  queryClient,
  (id) => ACCOUNT_QUERY_KEY(id)
);
```

**Features**:
- Caches by `id`
- Also caches by `slug`, `username`, `name`, `code`, `alternateId` if available
- Sets cache timestamp to 1 minute ago (allows refetch if needed)
- Optional `itemMap` for data transformation

**When to Use**:
- In list queries to populate individual caches
- After fetching paginated lists
- To enable instant navigation to detail pages

#### `SET_*_QUERY_DATA`

Direct cache update helpers for each resource type.

**Purpose**: Update cache with known data (optimistic updates).

**Pattern**:
```typescript
SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
```

**Usage**:
- After mutations to update cache immediately
- For optimistic UI updates
- When you have complete data

### 7.2 Data Transformation

#### `MergeInfinitePages`

Flattens infinite query pages into a single array.

**Signature**:
```typescript
export function MergeInfinitePages<TData>(
  data: InfiniteData<ConnectedXMResponse<TData[]>>
): TData[]
```

**Usage Example**:
```typescript
const { data } = useGetAccounts();
const allAccounts = MergeInfinitePages(data);
// Returns: Account[] (flattened from all pages)
```

**When to Use**:
- Displaying all items from infinite query
- Filtering/searching across all pages
- Calculating totals across pages

#### `TransformPrice`

Formats price values for display.

**Usage**: Price formatting and currency conversion.

#### `GetImageVariant`

Generates image URLs with size variants.

**Usage**: Responsive image loading.

#### `CalculateDuration`

Calculates time durations between dates.

**Usage**: Event duration, session length, etc.

### 7.3 Type Utilities

#### `IsUUID`

Validates if a string is a valid UUID.

**Usage**: Type checking before API calls.

#### `GetErrorMessage`

Extracts user-friendly error messages from API responses.

**Usage**: Error display in UI.

---

## 8. Examples and Best Practices

### 8.1 Creating a New Query

Follow these steps to create a new query:

#### Step 1: Create the Query File

Create `src/queries/[domain]/useGet[Resource].ts`

#### Step 2: Define Query Key

```typescript
/**
 * @category Keys
 * @group [Domain]
 */
export const [RESOURCE]_QUERY_KEY = (id: string) => [
  ...[PARENT]_QUERY_KEY(), // If nested
  id,
];
```

#### Step 3: Define Setter Function

```typescript
/**
 * @category Setters
 * @group [Domain]
 */
export const SET_[RESOURCE]_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof [RESOURCE]_QUERY_KEY>,
  response: Awaited<ReturnType<typeof Get[Resource]>>
) => {
  client.setQueryData([RESOURCE]_QUERY_KEY(...keyParams), response);
};
```

#### Step 4: Define Query Function

```typescript
/**
 * @category Queries
 * @group [Domain]
 */
export const Get[Resource] = async ({
  id,
  adminApiParams,
}: Get[Resource]Props): Promise<ConnectedXMResponse<[Resource]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/[endpoint]/${id}`);
  return data;
};
```

#### Step 5: Define React Hook

```typescript
/**
 * @category Hooks
 * @group [Domain]
 */
export const useGet[Resource] = (
  id: string = "",
  options: SingleQueryOptions<ReturnType<typeof Get[Resource]>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof Get[Resource]>>(
    [RESOURCE]_QUERY_KEY(id),
    (params: SingleQueryParams) =>
      Get[Resource]({ id: id || "unknown", ...params }),
    {
      ...options,
      enabled: !!id && (options?.enabled ?? true),
    }
  );
};
```

#### Step 6: Export from Index

Add to `src/queries/[domain]/index.ts`:
```typescript
export * from "./useGet[Resource]";
```

#### Complete Example: `useGetGroup`

```typescript
import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Group } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GROUPS_QUERY_KEY } from "./useGetGroups";

/**
 * @category Keys
 * @group Groups
 */
export const GROUP_QUERY_KEY = (groupId: string) => [
  ...GROUPS_QUERY_KEY(),
  groupId,
];

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroup>>
) => {
  client.setQueryData(GROUP_QUERY_KEY(...keyParams), response);
};

interface GetGroupProps extends SingleQueryParams {
  groupId: string;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroup = async ({
  groupId = "",
  adminApiParams,
}: GetGroupProps): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}`);
  return data;
};

/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroup = (
  groupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroup>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroup>>(
    GROUP_QUERY_KEY(groupId),
    (params: SingleQueryParams) =>
      GetGroup({ groupId: groupId || "unknown", ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
```

### 8.2 Creating a New Mutation

Follow these steps to create a new mutation:

#### Step 1: Create the Mutation File

Create `src/mutations/[domain]/useCreate[Resource].ts`

#### Step 2: Define Params Interface

```typescript
/**
 * @category Params
 * @group [Domain]
 */
export interface Create[Resource]Params extends MutationParams {
  [resource]: [Resource]CreateInputs;
}
```

#### Step 3: Define Mutation Function

```typescript
/**
 * @category Methods
 * @group [Domain]
 */
export const Create[Resource] = async ({
  [resource],
  adminApiParams,
  queryClient,
}: Create[Resource]Params): Promise<ConnectedXMResponse<[Resource]>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<[Resource]>>(
    `/[endpoint]`,
    [resource]
  );
  
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: [RESOURCES]_QUERY_KEY() });
    SET_[RESOURCE]_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  
  return data;
};
```

#### Step 4: Define React Hook

```typescript
/**
 * @category Mutations
 * @group [Domain]
 */
export const useCreate[Resource] = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof Create[Resource]>>,
      Omit<Create[Resource]Params, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    Create[Resource]Params,
    Awaited<ReturnType<typeof Create[Resource]>>
  >(Create[Resource], options);
};
```

#### Step 5: Export from Index

Add to `src/mutations/[domain]/index.ts`:
```typescript
export * from "./useCreate[Resource]";
```

#### Complete Example: `useCreateGroup`

```typescript
import { Group, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GROUPS_QUERY_KEY, SET_GROUP_QUERY_DATA } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";
import { GroupCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Group
 */
export interface CreateGroupParams extends MutationParams {
  group: GroupCreateInputs;
}

/**
 * @category Methods
 * @group Group
 */
export const CreateGroup = async ({
  group,
  adminApiParams,
  queryClient,
}: CreateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Group>>(
    `/groups`,
    group
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    SET_GROUP_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Group
 */
export const useCreateGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateGroup>>,
      Omit<CreateGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupParams,
    Awaited<ReturnType<typeof CreateGroup>>
  >(CreateGroup, options);
};
```

### 8.3 Query Key Design

#### Guidelines

1. **Start with Resource Type**: `["ACCOUNTS"]`, `["EVENTS"]`
2. **Add Filters**: `["ACCOUNTS", "VERIFIED"]`
3. **Add Identifiers Last**: `["ACCOUNTS", "account-123"]`
4. **Inherit Parent Keys**: Child keys should spread parent keys

#### Good Examples

```typescript
// Simple list
ACCOUNTS_QUERY_KEY() 
// ["ACCOUNTS"]

// Filtered list
ACCOUNTS_QUERY_KEY(true, false)
// ["ACCOUNTS", "VERIFIED", "OFFLINE"]

// Single item (inherits parent)
ACCOUNT_QUERY_KEY("123")
// ["ACCOUNTS", "123"]

// Nested resource
EVENT_SESSION_QUERY_KEY("event-123", "session-456")
// ["EVENTS", "event-123", "SESSIONS", "session-456"]
```

#### Bad Examples

```typescript
// ❌ Don't use IDs in base list keys
ACCOUNTS_QUERY_KEY("account-123") // Wrong!

// ❌ Don't forget to inherit parent
ACCOUNT_QUERY_KEY("123") 
// Should be: [...ACCOUNTS_QUERY_KEY(), "123"]

// ❌ Don't use inconsistent naming
accounts_query_key() // Should be ACCOUNTS_QUERY_KEY
```

### 8.4 Cache Management

#### When to Invalidate

**Always Invalidate**:
- After creating new resources
- After deleting resources
- When data might be stale

**Example**:
```typescript
// After create
queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
```

#### When to Update Directly

**Update Directly**:
- After updating existing resources (you have the new data)
- For optimistic updates
- When you want instant UI feedback

**Example**:
```typescript
// After update
SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], updatedData);
```

#### Best Practices

1. **Combine Both**: Invalidate lists, update individual items
   ```typescript
   queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
   SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
   ```

2. **Invalidate Related Queries**: If an account update affects events, invalidate both
   ```typescript
   queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
   queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
   ```

3. **Use Hierarchical Keys**: Invalidating parent invalidates children
   ```typescript
   // This invalidates all account queries
   queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
   ```

4. **Check Success**: Only update cache on successful mutations
   ```typescript
   if (queryClient && data.status === "ok") {
     // Update cache
   }
   ```

---

## 9. Testing Patterns

### 9.1 Query Testing

#### Mocking AdminAPI

```typescript
import { vi } from 'vitest';
import { GetAdminAPI } from '@src/AdminAPI';

vi.mock('@src/AdminAPI', () => ({
  GetAdminAPI: vi.fn(),
}));
```

#### Testing Query Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAccount } from '@src/queries';

test('fetches account data', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useGetAccount('account-123'), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data.id).toBe('account-123');
});
```

### 9.2 Mutation Testing

#### Testing Mutation Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateAccount } from '@src/mutations';

test('creates account and updates cache', async () => {
  const { result } = renderHook(() => useCreateAccount());

  result.current.mutate({
    account: { email: 'test@example.com' }
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

### 9.3 Mock Patterns

#### Mock API Responses

```typescript
const mockAccountResponse = {
  status: 'ok',
  message: 'Success',
  data: {
    id: 'account-123',
    email: 'test@example.com',
    // ... other fields
  }
};

(GetAdminAPI as any).mockResolvedValue({
  get: vi.fn().mockResolvedValue({ data: mockAccountResponse })
});
```

---

## 10. Build and Distribution

### 10.1 Build Process

The SDK uses `tsup` for building:

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts"
  }
}
```

**Output**:
- CommonJS: `dist/index.cjs`
- ES Modules: `dist/index.js`
- Type Definitions: `dist/index.d.ts`

### 10.2 Export Generation

The `exports` script generates barrel exports:

```bash
npm run exports
```

This ensures all queries and mutations are properly exported from the main `index.ts`.

### 10.3 Package Structure

```
dist/
├── index.js          # ES Module build
├── index.cjs         # CommonJS build
├── index.d.ts        # TypeScript definitions
└── index.d.cts       # CommonJS TypeScript definitions
```

### 10.4 Versioning

- Follows semantic versioning (MAJOR.MINOR.PATCH)
- Current version in `package.json`
- Beta versions: `6.1.11-beta.1`

### 10.5 Publishing

1. Update version in `package.json`
2. Run `npm run release` (lint + build)
3. Test locally with `npm run local` (creates `.tgz` file)
4. Publish to npm registry

---

## Additional Resources

### Key Files Reference

- `src/interfaces.ts` - All TypeScript interfaces and enums
- `src/params.ts` - Input parameter types for mutations
- `src/queries/accounts/useGetAccount.ts` - Single query example
- `src/queries/accounts/useGetAccounts.ts` - Infinite query example
- `src/mutations/account/useCreateAccount.ts` - Mutation example
- `src/mutations/account/useUpdateAccount.ts` - Update mutation example
- `src/AdminAPI.ts` - API client setup
- `src/ConnectedXMProvider.tsx` - Provider setup
- `src/utilities/CacheIndividualQueries.ts` - Cache utility example

### Common Patterns Quick Reference

**Query Pattern**:
```typescript
QUERY_KEY → SETTER → QUERY_FUNCTION → REACT_HOOK
```

**Mutation Pattern**:
```typescript
PARAMS_INTERFACE → MUTATION_FUNCTION → REACT_HOOK
```

**Cache Update Pattern**:
```typescript
invalidateQueries() + SET_*_QUERY_DATA()
```

---

## Questions or Issues?

For questions about this SDK or to report issues, please contact the ConnectedXM development team or refer to the main repository documentation.


