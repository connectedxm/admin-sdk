import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";

/**
 * Retrieves event pass type tiers with optional filtering for allowed tiers.
 * This function fetches tiers associated with a specific event and pass type, providing the ability to filter based on whether the tiers are allowed.
 * It is useful for applications that need to display or manage tiers for event pass types with specific filtering criteria.
 * @name GetEventPassTypeTiers
 * @param {boolean} allowed - Indicates if only allowed tiers should be fetched
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @version 1.2
 **/

export const EVENT_PASS_TYPE_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  passTypeId: string
) => [
  ...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

export const SET_EVENT_PASS_TYPE_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeTiers>>
) => {
  client.setQueryData(EVENT_PASS_TYPE_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassTypeTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  passTypeId: string;
}

export const GetEventPassTypeTiers = async ({
  allowed,
  eventId,
  passTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypeTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/tiers`,
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

export const useGetEventPassTypeTiers = (
  allowed: boolean,
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypeTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypeTiers>>
  >(
    EVENT_PASS_TYPE_TIERS_QUERY_KEY(allowed, eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypeTiers({
        ...params,
        allowed,
        eventId,
        passTypeId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!passTypeId &&
        (options.enabled ?? true),
    },
    "events"
  );
};