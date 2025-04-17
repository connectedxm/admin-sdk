import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAccess } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACCESSES_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACCESSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACCESSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAccesses>>
) => {
  client.setQueryData(EVENT_ACCESSES_QUERY_KEY(...keyParams), response);
};

interface GetEventAccessesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAccesses = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAccessesProps): Promise<ConnectedXMResponse<EventAccess[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/accesses`,
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
export const useGetEventAccesses = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAccesses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAccesses>>
  >(
    EVENT_ACCESSES_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventAccesses({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};
