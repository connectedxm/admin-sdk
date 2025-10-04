import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_FOLLOWUP_QUERY_KEY } from "./useGetEventFollowup";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  followupId: string
) => [
  ...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupTiers>>
) => {
  client.setQueryData(EVENT_FOLLOWUP_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventFollowupTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupTiers = async ({
  allowed,
  eventId,
  followupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFollowupTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/tiers`,
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
export const useGetEventFollowupTiers = (
  allowed: boolean,
  eventId: string = "",
  followupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowupTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowupTiers>>
  >(
    EVENT_FOLLOWUP_TIERS_QUERY_KEY(allowed, eventId, followupId),
    (params: InfiniteQueryParams) =>
      GetEventFollowupTiers({
        ...params,
        allowed,
        eventId,
        followupId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!followupId &&
        (options.enabled ?? true),
    }
  );
};
