import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TRACK_QUERY_KEY } from "./useGetEventTrack";

export const EVENT_TRACK_SPONSORS_QUERY_KEY = (
  eventId: string,
  trackId: string
) => [...EVENT_TRACK_QUERY_KEY(eventId, trackId), "SPONSORS"];

export const SET_EVENT_TRACK_SPONSORS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRACK_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrackSponsors>>
) => {
  client.setQueryData(EVENT_TRACK_SPONSORS_QUERY_KEY(...keyParams), response);
};

interface GetEventTrackSponsorsProps extends InfiniteQueryParams {
  eventId: string;
  trackId: string;
}

export const GetEventTrackSponsors = async ({
  eventId,
  trackId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventTrackSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tracks/${trackId}/sponsors`,
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
export const useGetEventTrackSponsors = (
  eventId: string = "",
  trackId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTrackSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTrackSponsors>>
  >(
    EVENT_TRACK_SPONSORS_QUERY_KEY(eventId, trackId),
    (params: InfiniteQueryParams) =>
      GetEventTrackSponsors({
        ...params,
        eventId,
        trackId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!trackId && (options.enabled ?? true),
    }
  );
};
