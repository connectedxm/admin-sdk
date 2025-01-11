import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse, OrganizationMembership } from "./interfaces";
import {
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { MutationParams } from ".";
import PermissionsWrapper from "./PermissionsWrapper";

export interface ConnectedXMClientContextState {
  queryClient: QueryClient;
  organizationId: string;
  apiUrl:
    | "https://admin-api.connected.dev"
    | "https://staging-admin-api.connected.dev"
    | "http://localhost:4001";
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  getToken: () => Promise<string | undefined>;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
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
  permissions?: OrganizationMembership;
}

export const ConnectedXMClientContext =
  React.createContext<ConnectedXMClientContextState>(
    {} as ConnectedXMClientContextState
  );

export interface ConnectedXMProviderProps
  extends Omit<
    ConnectedXMClientContextState,
    | "token"
    | "setToken"
    | "executeAs"
    | "setExecuteAs"
    | "websocket"
    | "authenticated"
    | "setAuthenticated"
  > {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  queryClient,
  children,
  getToken,
  ...state
}: ConnectedXMProviderProps) => {
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [ssr, setSSR] = React.useState<boolean>(true);
  const [permissions, setPermissions] = React.useState<
    OrganizationMembership | undefined
  >();

  React.useEffect(() => {
    if (!authenticated) {
      getToken().then((token) => {
        if (token) {
          setAuthenticated(true);
        }
      });
    }
  }, [authenticated, getToken]);

  React.useEffect(() => {
    setSSR(false);
  }, []);

  if (ssr) {
    return (
      <QueryClientProvider client={queryClient}>
        <ConnectedXMClientContext.Provider
          value={{
            ...state,
            getToken,
            authenticated,
            setAuthenticated,
            queryClient,
            permissions,
          }}
        >
          <PermissionsWrapper
            authenticated={authenticated}
            setPermissions={setPermissions}
          >
            {children}
          </PermissionsWrapper>
        </ConnectedXMClientContext.Provider>
      </QueryClientProvider>
    );
  }

  return (
    <ConnectedXMClientContext.Provider
      value={{
        ...state,
        getToken,
        authenticated,
        setAuthenticated,
        queryClient,
        permissions,
      }}
    >
      <PermissionsWrapper
        authenticated={authenticated}
        setPermissions={setPermissions}
      >
        {children}
      </PermissionsWrapper>
    </ConnectedXMClientContext.Provider>
  );
};
