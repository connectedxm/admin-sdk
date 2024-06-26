import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Purchase } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "./useGetEventAddOn";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_PURCHASES_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "PURCHASES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ADD_ON_PURCHASES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_PURCHASES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnPurchases>>
) => {
  client.setQueryData(EVENT_ADD_ON_PURCHASES_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnPurchasesProps extends InfiniteQueryParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnPurchases = async ({
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnPurchasesProps): Promise<ConnectedXMResponse<Purchase[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/purchases`,
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
export const useGetEventAddOnPurchases = (
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnPurchases>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnPurchases>>
  >(
    EVENT_ADD_ON_PURCHASES_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnPurchases({ ...params, eventId, addOnId }),
    params,
    {
      ...options,
      enabled: !!addOnId && (options.enabled ?? true),
    }
  );
};
