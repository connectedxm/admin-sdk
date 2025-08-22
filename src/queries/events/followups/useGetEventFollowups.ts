import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUPS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "FOLLOWUPS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUPS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowups>>
) => {
  client.setQueryData(EVENT_FOLLOWUPS_QUERY_KEY(...keyParams), response);
};

interface GetEventFollowupsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowups = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventFollowupsProps): Promise<
  ConnectedXMResponse<RegistrationFollowup[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/followups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFollowups = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowups>>
  >(
    EVENT_FOLLOWUPS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventFollowups({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
