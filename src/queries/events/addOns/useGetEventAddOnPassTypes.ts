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
 * Retrieves a list of pass types associated with a specific event add-on.
 * This function is used to fetch various pass types that are available for a given event add-on, 
 * allowing applications to display or manage these pass types as needed.
 * @name GetEventAddOnPassTypes
 * @param {string} eventId - The id of the event
 * @param {string} addOnId - The id of the add-on
 * @version 1.2
 **/

export const EVENT_ADD_ON_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "PASS_TYPES"];

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
    },
    "events"
  );
};