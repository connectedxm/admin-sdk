import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_SECTION_QUERY_KEY } from "../useGetEventSection";
import {
  RegistrationSection,
  RegistrationSectionTranslation,
} from "@src/interfaces";
import { EVENT_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSectionTranslations";

export const EVENT_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  locale: string
) => [...EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId), locale];

export const SET_EVENT_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
}

export const GetEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
}: GetEventSectionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationSectionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`
  );
  return data;
};

const useGetEventSectionTranslation = (
  eventId: string,
  sectionId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSectionTranslation>>((
    EVENT_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    () =>
      GetEventSectionTranslation({
        eventId,
        sectionId,
        locale,
      }),
    {
      enabled: !!eventId && !!sectionId && !!locale,
    }
  );
};

export default useGetEventSectionTranslation;
