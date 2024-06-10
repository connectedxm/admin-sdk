import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPageTranslation } from "@src/interfaces";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPageTranslations";

export const EVENT_PAGE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  pageId: string,
  locale: string
) => [...EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId), locale];

export const SET_EVENT_PAGE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageTranslation>>
) => {
  client.setQueryData(EVENT_PAGE_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetEventPageTranslationProps {
  eventId: string;
  pageId: string;
  locale: string;
}

export const GetEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
}: GetEventPageTranslationProps): Promise<
  ConnectedXMResponse<EventPageTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`
  );
  return data;
};

const useGetEventPageTranslation = (
  eventId: string,
  pageId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPageTranslation>>((
    EVENT_PAGE_TRANSLATION_QUERY_KEY(eventId, pageId, locale),
    () =>
      GetEventPageTranslation({
        eventId,
        pageId,
        locale,
      }),
    {
      enabled: !!eventId && !!pageId && !!locale,
    }
  );
};

export default useGetEventPageTranslation;
