import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SpeakerTranslation } from "@src/interfaces";
import { EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY } from "./useGetEventSpeakerTranslations";

export const EVENT_SPEAKER_TRANSLATION_QUERY_KEY = (
  eventId: string,
  speakerId: string,
  locale: string
) => [...EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId), locale];

export const SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKER_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerTranslation>>
) => {
  client.setQueryData(
    EVENT_SPEAKER_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSpeakerTranslationProps {
  eventId: string;
  speakerId: string;
  locale: string;
}

export const GetEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
}: GetEventSpeakerTranslationProps): Promise<
  ConnectedXMResponse<SpeakerTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}/translations/${locale}`
  );
  return data;
};

const useGetEventSpeakerTranslation = (
  eventId: string,
  speakerId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpeakerTranslation>>((
    EVENT_SPEAKER_TRANSLATION_QUERY_KEY(eventId, speakerId, locale),
    () =>
      GetEventSpeakerTranslation({
        eventId,
        speakerId,
        locale,
      }),
    {
      enabled: !!eventId && !!locale,
    }
  );
};

export default useGetEventSpeakerTranslation;
