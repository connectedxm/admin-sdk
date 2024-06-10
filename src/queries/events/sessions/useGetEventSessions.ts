import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Session } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_SESSIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS",
];

export const SET_EVENT_SESSIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessions>>
) => {
  client.setQueryData(EVENT_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sessions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSessions = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessions>>
  >(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: any) => GetEventSessions(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSessions;
