import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, LivestreamSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { LIVESTREAM_QUERY_KEY } from "./useGetLivestream";

/**
 * @category Keys
 * @group StreamsV2
 */
export const LIVESTREAM_SESSIONS_QUERY_KEY = (livestreamId?: string) => {
  const keys = [...LIVESTREAM_QUERY_KEY(livestreamId || ""), "SESSIONS"];
  return keys;
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_LIVESTREAM_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LIVESTREAM_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLivestreamSessions>>
) => {
  client.setQueryData(LIVESTREAM_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetLivestreamSessionsParams extends InfiniteQueryParams {
  livestreamId?: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetLivestreamSessions = async ({
  livestreamId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLivestreamSessionsParams): Promise<
  ConnectedXMResponse<LivestreamSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/meetings/livestreams/${livestreamId}/sessions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetLivestreamSessions = (
  livestreamId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLivestreamSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLivestreamSessions>>
  >(
    LIVESTREAM_SESSIONS_QUERY_KEY(livestreamId),
    (params: InfiniteQueryParams) =>
      GetLivestreamSessions({ ...params, livestreamId }),
    params,
    options
  );
};
