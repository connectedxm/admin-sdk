import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { TrackTranslation } from "@src/interfaces";
import { EVENT_TRACK_TRANSLATIONS_QUERY_KEY } from "./useGetEventTrackTranslations";

export const EVENT_TRACK_TRANSLATION_QUERY_KEY = (
  eventId: string,
  trackId: string,
  locale: string
) => [...EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId), locale];

export const SET_EVENT_TRACK_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRACK_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrackTranslation>>
) => {
  client.setQueryData(
    EVENT_TRACK_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTrackTranslationProps {
  eventId: string;
  trackId: string;
  locale: string;
}

export const GetEventTrackTranslation = async ({
  eventId,
  trackId,
  locale,
}: GetEventTrackTranslationProps): Promise<
  ConnectedXMResponse<TrackTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tracks/${trackId}/translations/${locale}`
  );
  return data;
};

const useGetEventTrackTranslation = (
  eventId: string,
  trackId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTrackTranslation>>((
    EVENT_TRACK_TRANSLATION_QUERY_KEY(eventId, trackId, locale),
    () =>
      GetEventTrackTranslation({
        eventId,
        trackId,
        locale,
      }),
    {
      enabled: !!eventId && !!trackId && !!locale,
    }
  );
};

export default useGetEventTrackTranslation;
