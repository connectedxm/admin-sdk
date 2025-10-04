import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "../useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_SECTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "SECTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_SECTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSections>>
) => {
  client.setQueryData(EVENT_SESSION_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSectionsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionSections = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sections`,
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
export const useGetEventSessionSections = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSections>>
  >(
    EVENT_SESSION_SECTIONS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionSections({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    }
  );
};
