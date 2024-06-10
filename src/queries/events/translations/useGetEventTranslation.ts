import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation } from "@src/interfaces";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "./useGetEventTranslations";

export const EVENT_TRANSLATION_QUERY_KEY = (
  eventId: string,
  locale: string
) => [...EVENT_TRANSLATIONS_QUERY_KEY(eventId), locale];

export const SET_EVENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTranslation>>
) => {
  client.setQueryData(EVENT_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetEventTranslationProps {
  eventId: string;
  locale: string;
}

export const GetEventTranslation = async ({
  eventId,
  locale,
}: GetEventTranslationProps): Promise<
  ConnectedXMResponse<EventTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/translations/${locale}`
  );
  return data;
};

const useGetEventTranslation = (eventId: string, locale: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTranslation>>((
    EVENT_TRANSLATION_QUERY_KEY(eventId, locale),
    () =>
      GetEventTranslation({
        eventId,
        locale,
      }),
    {
      enabled: !!eventId && !!locale,
    }
  );
};

export default useGetEventTranslation;
