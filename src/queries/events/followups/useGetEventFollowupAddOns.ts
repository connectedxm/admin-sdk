import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
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
export const EVENT_FOLLOWUP_ADDONS_QUERY_KEY = (
  eventId: string,
  followupId: string
) => [...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId), "ADDONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_ADDONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_ADDONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupAddOns>>
) => {
  client.setQueryData(EVENT_FOLLOWUP_ADDONS_QUERY_KEY(...keyParams), response);
};

interface GetEventFollowupAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupAddOns = async ({
  eventId,
  followupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFollowupAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/addOns`,
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
export const useGetEventFollowupAddOns = (
  eventId: string = "",
  followupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowupAddOns>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowupAddOns>>
  >(
    EVENT_FOLLOWUP_ADDONS_QUERY_KEY(eventId, followupId),
    (params: InfiniteQueryParams) =>
      GetEventFollowupAddOns({
        ...params,
        eventId,
        followupId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!followupId && (options.enabled ?? true),
    },
    "events"
  );
};
