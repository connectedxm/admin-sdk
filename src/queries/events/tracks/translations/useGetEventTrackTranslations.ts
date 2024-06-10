import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { TrackTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_TRACK_QUERY_KEY } from "../useGetEventTrack";

export const EVENT_TRACK_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  trackId: string
) => [...EVENT_TRACK_QUERY_KEY(eventId, trackId), "TRANSLATIONS"];

export const SET_EVENT_TRACK_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRACK_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrackTranslations>>
) => {
  client.setQueryData(
    EVENT_TRACK_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTrackTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  trackId: string;
}

export const GetEventTrackTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  trackId,
}: GetEventTrackTranslationsProps): Promise<
  ConnectedXMResponse<TrackTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tracks/${trackId}/translations`,
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

const useGetEventTrackTranslations = (eventId: string, trackId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTrackTranslations>>
  >(
    EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId),
    (params: any) => GetEventTrackTranslations(params),
    {
      eventId,
      trackId,
    },
    {
      enabled: !!eventId && !!trackId,
    }
  );
};

export default useGetEventTrackTranslations;
