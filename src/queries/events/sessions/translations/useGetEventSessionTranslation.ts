import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation, SessionTranslation } from "@src/interfaces";
import { EVENT_SESSION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionTranslations";

export const EVENT_SESSION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  locale: string
) => [...EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId), locale];

export const SET_EVENT_SESSION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTranslationProps {
  eventId: string;
  sessionId: string;
  locale: string;
}

export const GetEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
}: GetEventSessionTranslationProps): Promise<
  ConnectedXMResponse<SessionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`
  );
  return data;
};

const useGetEventSessionTranslation = (
  eventId: string,
  sessionId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionTranslation>>((
    EVENT_SESSION_TRANSLATION_QUERY_KEY(eventId, sessionId, locale),
    () =>
      GetEventSessionTranslation({
        eventId,
        sessionId,
        locale,
      }),
    {
      enabled: !!eventId && !!locale,
    }
  );
};

export default useGetEventSessionTranslation;
