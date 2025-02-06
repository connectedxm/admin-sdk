import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { AuthSession } from "@src/interfaces";
import { AUTH_SESSIONS_QUERY_KEY } from "./useGetAuthSessions";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to fetch data for a specific authentication session.
 * This function retrieves detailed information about an authentication session using its unique identifier.
 * It is intended for use in applications that require access to authentication session details.
 * @name GetAuthSession
 * @param {string} authSessionId (path) The ID of the authentication session
 * @version 1.3
 **/

export const AUTH_SESSION_QUERY_KEY = (authSessionId: string) => [
  ...AUTH_SESSIONS_QUERY_KEY(),
  authSessionId,
];

export const SET_AUTH_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof AUTH_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAuthSession>>
) => {
  client.setQueryData(AUTH_SESSION_QUERY_KEY(...keyParams), response);
};

interface GetAuthSessionParams extends SingleQueryParams {
  authSessionId: string;
}

export const GetAuthSession = async ({
  authSessionId,
  adminApiParams,
}: GetAuthSessionParams): Promise<ConnectedXMResponse<AuthSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/auth-sessions/${authSessionId}`);

  return data;
};

export const useGetAuthSession = (
  authSessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAuthSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAuthSession>>(
    AUTH_SESSION_QUERY_KEY(authSessionId),
    (params: SingleQueryParams) => GetAuthSession({ authSessionId, ...params }),
    {
      ...options,
      enabled: !!authSessionId,
    },
    "org"
  );
};
