import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "./useGetEventAddOn";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "PASS_TYPES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ADD_ON_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnPassTypes>>
) => {
  client.setQueryData(
    EVENT_ADD_ON_PASS_TYPES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAddOnPassTypesProps extends InfiniteQueryParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnPassTypes = async ({
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnPassTypesProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/passTypes`,
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
export const useGetEventAddOnPassTypes = (
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnPassTypes>>
  >(
    EVENT_ADD_ON_PASS_TYPES_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnPassTypes({
        ...params,
        eventId,
        addOnId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!addOnId && (options.enabled ?? true),
    }
  );
};
