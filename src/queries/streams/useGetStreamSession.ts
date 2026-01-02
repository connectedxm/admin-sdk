import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamSession } from "@src/interfaces";
import { STREAM_SESSIONS_QUERY_KEY } from "./useGetStreamSessions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_SESSION_QUERY_KEY = (
  streamId: string,
  sessionId: string
) => [...STREAM_SESSIONS_QUERY_KEY(streamId), sessionId];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamSession>>
) => {
  client.setQueryData(STREAM_SESSION_QUERY_KEY(...keyParams), response);
};

interface GetStreamSessionParams extends SingleQueryParams {
  streamId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamSession = async ({
  streamId,
  sessionId,
  adminApiParams,
}: GetStreamSessionParams): Promise<ConnectedXMResponse<StreamSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/${streamId}/sessions/${sessionId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamSession = (
  streamId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStreamSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamSession>>(
    STREAM_SESSION_QUERY_KEY(streamId, sessionId),
    (params) => GetStreamSession({ streamId, sessionId, ...params }),
    {
      ...options,
      enabled: !!streamId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
