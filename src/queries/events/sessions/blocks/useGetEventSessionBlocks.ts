import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionBlock } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_BLOCKS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "BLOCKS",
];

/**
 * @category Queries
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
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionBlocks = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionBlocksProps): Promise<
  ConnectedXMResponse<EventSessionBlock[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sessions/blocks`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionBlocks = (
  eventId: string = "",
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
    EVENT_SESSION_BLOCKS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSessionBlocks({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
