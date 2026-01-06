import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  StreamSessionSubscription,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { STREAM_SESSION_QUERY_KEY } from "./useGetStreamSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY = (
  streamId: string,
  sessionId: string,
  active?: boolean
) => {
  const key = [
    ...STREAM_SESSION_QUERY_KEY(streamId, sessionId),
    "SUBSCRIPTIONS",
  ];
  if (active !== undefined) {
    key.push(active.toString());
  }
  return key;
};

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_SESSION_SUBSCRIPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamSessionSubscriptions>>
) => {
  client.setQueryData(
    STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetStreamSessionSubscriptionsParams extends InfiniteQueryParams {
  streamId: string;
  sessionId: string;
  active?: boolean;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamSessionSubscriptions = async ({
  streamId,
  sessionId,
  active,
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetStreamSessionSubscriptionsParams): Promise<
  ConnectedXMResponse<StreamSessionSubscription[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/${streamId}/sessions/${sessionId}/subscriptions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        active: active !== undefined ? active.toString() : undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamSessionSubscriptions = (
  streamId: string = "",
  sessionId: string = "",
  active?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamSessionSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetStreamSessionSubscriptions>>
  >(
    STREAM_SESSION_SUBSCRIPTIONS_QUERY_KEY(streamId, sessionId, active),
    (params: InfiniteQueryParams) =>
      GetStreamSessionSubscriptions({
        ...params,
        streamId,
        sessionId,
        active,
      }),
    params,
    {
      ...options,
      enabled: !!streamId && !!sessionId && (options.enabled ?? true),
    }
  );
};
