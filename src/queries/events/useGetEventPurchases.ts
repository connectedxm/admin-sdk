import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PURCHASES_QUERY_KEY = (eventId: string) => {
  return [...EVENT_QUERY_KEY(eventId), "PURCHASES"];
};

interface GetEventPurchasesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPurchases = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPurchasesProps): Promise<ConnectedXMResponse<Purchase[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/purchases`, {
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
export const useGetEventPurchases = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPurchases>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPurchases>>
  >(
    EVENT_PURCHASES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventPurchases({
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
