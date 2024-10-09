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
 * @category Key
 * @group Emails
 */
export const AUTH_SESSION_QUERY_KEY = (authSessionId: string | number) => [
  ...AUTH_SESSIONS_QUERY_KEY(),
  authSessionId,
];

/**
 * @category Setters
 * @group Emails
 */
export const SET_AUTH_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof AUTH_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAuthSession>>
) => {
  client.setQueryData(AUTH_SESSION_QUERY_KEY(...keyParams), response);
};

interface GetAuthSessionParams extends SingleQueryParams {
  authSessionId: string | number;
}

/**
 * @category Query
 * @group Emails
 */
export const GetAuthSession = async ({
  authSessionId,
  adminApiParams,
}: GetAuthSessionParams): Promise<ConnectedXMResponse<AuthSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/auth-sessions/${authSessionId}`);

  return data;
};

/**
 * @category Hooks
 * @group Emails
 */
export const useGetAuthSession = (
  authSessionId: string | number = "",
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
