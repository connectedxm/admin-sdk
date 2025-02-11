import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a list of sponsors for a specific event session.
 * This function retrieves sponsor information associated with a given event session,
 * allowing users to view all sponsors linked to a particular session within an event.
 * @name GetEventSessionSponsors
 * @param {string} eventId (path) The id of the event
 * @param {string} sessionId (path) The id of the session
 * @version 1.3
 **/

export const EVENT_SESSION_SPONSORS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "SPONSORS"];

export const SET_EVENT_SESSION_SPONSORS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSponsors>>
) => {
  client.setQueryData(EVENT_SESSION_SPONSORS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSponsorsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionSponsors = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sponsors`,
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

export const useGetEventSessionSponsors = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSponsors>>
  >(
    EVENT_SESSION_SPONSORS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionSponsors({
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
