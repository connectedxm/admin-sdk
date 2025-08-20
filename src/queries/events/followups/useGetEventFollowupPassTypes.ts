import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_FOLLOWUP_QUERY_KEY } from "./useGetEventFollowup";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY = (
  eventId: string,
  followupId: string
) => [...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId), "PASS_TYPES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupPassTypes>>
) => {
  client.setQueryData(
    EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFollowupPassTypesProps extends InfiniteQueryParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupPassTypes = async ({
  eventId,
  followupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFollowupPassTypesProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/passTypes`,
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
export const useGetEventFollowupPassTypes = (
  eventId: string = "",
  followupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowupPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowupPassTypes>>
  >(
    EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY(eventId, followupId),
    (params: InfiniteQueryParams) =>
      GetEventFollowupPassTypes({
        ...params,
        eventId,
        followupId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!followupId,
    },
    "events"
  );
};
