import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventBlock } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_BLOCKS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "BLOCKS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_BLOCKS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_BLOCKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionBlocks>>
) => {
  client.setQueryData(EVENT_SESSION_BLOCKS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionBlocksProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionBlocks = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionBlocksProps): Promise<ConnectedXMResponse<EventBlock[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/blocks`,
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
 * @group Events
 */
export const useGetEventSessionBlocks = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionBlocks>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionBlocks>>
  >(
    EVENT_SESSION_BLOCKS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionBlocks({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    }
  );
};
