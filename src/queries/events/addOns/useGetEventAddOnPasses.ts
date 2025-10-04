import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
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
export const EVENT_ADD_ON_PASSES_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ADD_ON_PASSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnPasses>>
) => {
  client.setQueryData(EVENT_ADD_ON_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnPassesProps extends InfiniteQueryParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnPasses = async ({
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/passes`,
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
export const useGetEventAddOnPasses = (
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnPasses>>
  >(
    EVENT_ADD_ON_PASSES_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnPasses({ ...params, eventId, addOnId }),
    params,
    {
      ...options,
      enabled: !!addOnId && (options.enabled ?? true),
    }
  );
};
