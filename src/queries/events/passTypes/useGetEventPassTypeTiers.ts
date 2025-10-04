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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  passTypeId: string
) => [
  ...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
