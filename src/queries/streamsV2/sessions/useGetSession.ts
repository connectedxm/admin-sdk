import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Session } from "@src/interfaces";
import { SESSIONS_QUERY_KEY } from "./useGetSessions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_QUERY_KEY = (sessionId: string) => [
  ...SESSIONS_QUERY_KEY(),
  sessionId,
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSession>>
) => {
  client.setQueryData(SESSION_QUERY_KEY(...keyParams), response);
};

interface GetSessionParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSession = async ({
  sessionId,
  adminApiParams,
}: GetSessionParams): Promise<ConnectedXMResponse<Session>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/sessions/${sessionId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSession = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSession>>(
    SESSION_QUERY_KEY(sessionId),
    (params) => GetSession({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
