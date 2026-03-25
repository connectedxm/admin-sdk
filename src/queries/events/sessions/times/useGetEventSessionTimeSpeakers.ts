import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSpeaker } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_TIME_QUERY_KEY } from "./useGetEventSessionTime";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  timeId: string
) => [...EVENT_SESSION_TIME_QUERY_KEY(eventId, sessionId, timeId), "SPEAKERS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_TIME_SPEAKERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTimeSpeakers>>
) => {
  client.setQueryData(
    EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTimeSpeakersProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  timeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTimeSpeakers = async ({
  eventId,
  sessionId,
  timeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionTimeSpeakersProps): Promise<
  ConnectedXMResponse<EventSpeaker[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/speakers`,
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
export const useGetEventSessionTimeSpeakers = (
  eventId: string = "",
  sessionId: string = "",
  timeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionTimeSpeakers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionTimeSpeakers>>
  >(
    EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY(eventId, sessionId, timeId),
    (params: InfiniteQueryParams) =>
      GetEventSessionTimeSpeakers({
        ...params,
        eventId,
        sessionId,
        timeId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!timeId && (options.enabled ?? true),
    }
  );
};
