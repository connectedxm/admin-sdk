import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Session } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SPEAKER_QUERY_KEY } from "./useGetEventSpeaker";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_SPEAKER_SESSIONS_QUERY_KEY = (
  eventId: string,
  speakerId: string
) => [...EVENT_SPEAKER_QUERY_KEY(eventId, speakerId), "SESSIONS"];

export const SET_EVENT_SPEAKER_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPEAKER_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerSessions>>
) => {
  client.setQueryData(EVENT_SPEAKER_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSpeakerSessionsProps extends InfiniteQueryParams {
  eventId: string;
  speakerId: string;
}

export const GetEventSpeakerSessions = async ({
  eventId,
  speakerId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSpeakerSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}/sessions`,
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

const useGetEventSpeakerSessions = (eventId: string, speakerId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakerSessions>>
  >(
    EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId),
    (params: InfiniteQueryParams) => GetEventSpeakerSessions(params),
    {
      eventId,
      speakerId,
    },
    {
      enabled: !!eventId && !!speakerId,
    }
  );
};

export default useGetEventSpeakerSessions;
