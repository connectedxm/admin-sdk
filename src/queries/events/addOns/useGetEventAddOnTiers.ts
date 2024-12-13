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
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  addOnId: string
) => [
  ...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
