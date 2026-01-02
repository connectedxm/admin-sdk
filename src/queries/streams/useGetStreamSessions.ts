import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { STREAM_QUERY_KEY } from "./useGetStreamInput";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_SESSIONS_QUERY_KEY = (
  streamId: string,
  status?: string
) => {
  const key = [...STREAM_QUERY_KEY(streamId), "SESSIONS"];
  if (status) {
    key.push(status);
  }
  return key;
};

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamSessions>>
) => {
  client.setQueryData(STREAM_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetStreamSessionsParams extends InfiniteQueryParams {
  streamId: string;
  status?: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamSessions = async ({
  streamId,
  status,
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetStreamSessionsParams): Promise<ConnectedXMResponse<StreamSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/sessions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      status: status || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamSessions = (
  streamId: string = "",
  status?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetStreamSessions>>
  >(
    STREAM_SESSIONS_QUERY_KEY(streamId, status),
    (params: InfiniteQueryParams) =>
      GetStreamSessions({
        ...params,
        streamId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!streamId && (options.enabled ?? true),
    }
  );
};
