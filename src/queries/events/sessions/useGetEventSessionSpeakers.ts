import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Speaker } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSION_SPEAKERS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "SPEAKERS"];

export const SET_EVENT_SESSION_SPEAKERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSpeakers>>
) => {
  client.setQueryData(EVENT_SESSION_SPEAKERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSpeakersProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionSpeakers = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSessionSpeakersProps): Promise<ConnectedXMResponse<Speaker[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/speakers`,
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

const useGetEventSessionSpeakers = (eventId: string, sessionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSpeakers>>
  >(
    EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId),
    (params: any) => GetEventSessionSpeakers(params),
    {
      eventId,
      sessionId,
    },
    {
      enabled: !!eventId && !!sessionId,
    }
  );
};

export default useGetEventSessionSpeakers;
