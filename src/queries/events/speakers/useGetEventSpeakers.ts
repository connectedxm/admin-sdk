import { ConnectedXMResponse } from "@src/interfaces";

import { Speaker } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_SPEAKERS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPEAKERS",
];

export const SET_EVENT_SPEAKERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakers>>
) => {
  client.setQueryData(EVENT_SPEAKERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSpeakersProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSpeakers = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSpeakersProps): Promise<ConnectedXMResponse<Speaker[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/speakers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSpeakers = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakers>>
  >(
    EVENT_SPEAKERS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSpeakers(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventSpeakers;
