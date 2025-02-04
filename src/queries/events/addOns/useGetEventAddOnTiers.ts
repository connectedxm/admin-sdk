import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "./useGetEventAddOn";

/**
 * Endpoint to retrieve a list of tiers for a specific event add-on.
 * This function fetches tiers associated with an event add-on, allowing filtering based on whether only allowed tiers should be included.
 * It is useful for applications that need to display or manage tiers related to event add-ons.
 * @name GetEventAddOnTiers
 * @param {boolean} allowed - Indicates if only allowed tiers should be fetched
 * @param {string} eventId - The id of the event
 * @param {string} addOnId - The id of the add-on
 * @version 1.2
 **/

export const EVENT_ADD_ON_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  addOnId: string
) => [
  ...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

export const SET_EVENT_ADD_ON_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnTiers>>
) => {
  client.setQueryData(EVENT_ADD_ON_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  addOnId: string;
}

export const GetEventAddOnTiers = async ({
  allowed,
  eventId,
  addOnId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/tiers`,
    {
      params: {
        allowed,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventAddOnTiers = (
  allowed: boolean,
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnTiers>>
  >(
    EVENT_ADD_ON_TIERS_QUERY_KEY(allowed, eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnTiers({
        ...params,
        allowed,
        eventId,
        addOnId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!addOnId &&
        (options.enabled ?? true),
    },
    "events"
  );
};