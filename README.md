# @connectedxm/admin-sdk

A Javascript SDK for interacting with the ConnectedXM Admin API.

# Getting Started

## Installation

To install the SDK, use npm or yarn:

```sh
npm install @connectedxm/admin
```

## OPTION 1: Using the Functions directly

Here's a basic example of how to use the SDK to fetch user data:

```typescript
import { AddAccountTier, AdminApiParams, GetAccount } from "@connectedxm/admin";

const ORGANIZATION_ID = "ORGANIZATION_ID";
const API_KEY = "API_KEY";

const ACCOUNT_ID = "INPUT_AN_ACCOUNT_ID";
const NEW_TIER_ID = "INPUT_AN_ACCOUNT_TIER_ID";

const adminApiParams: AdminApiParams = {
  apiUrl: "https://admin-api.connected.dev",
  apiKey: API_KEY,
  organizationId: ORGANIZATION_ID,
};

// Example: Get account
let { data: account } = await GetAccount({
  accountId: ACCOUNT_ID,
  adminApiParams,
});

console.log(JSON.stringify(account, null, 2));

// Example: Add account tier
let { data } = await AddAccountTier({
  adminApiParams,
  accountId: ACCOUNT_ID,
  tierId: NEW_TIER_ID,
});

console.log(JSON.stringify(data, null, 2));
```

## OPTION: 2 Using with React Query Hooks

First wrap your application in both QueryClientProvider and a ConnectedXMProvider

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectedXMProvider } from "@connectedxm/admin";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(new QueryClient());

  const getToken = (): string => {
    // GETS YOUR ACCESS TOKEN FOR THE SIGNED IN USER
    return "ACCESS_TOKEN";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectedXMProvider
        queryClient={queryClient}
        organizationId={YOUR_ORGANIZATION_ID}
        apiUrl="https://admin-api.connected.dev"
        getToken={GetAccessToken}

        // OPTIONAL TRIGGERS
        // onNotAuthorized={}
        // onModuleForbidden={}
        // onNotFound={}
        // onMutationError={}
      >
        {" YOUR APP GOES HERE"}
      </ConnectedXMProvider>
    </QueryClientProvider>
  );
}
```

Inside of any react component you can use the exported react-query hook

```tsx
const Component = ({ accountId }: { accountId: string }) => {
  const { data: account, isLoading, isError, error } = useGetAccount(accountId);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorComponent error={error} />;

  return (
    <div>
      <p>{account.name}</p>
    </div>
  );
};
```
