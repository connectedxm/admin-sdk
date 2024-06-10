import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOnTranslation } from "@src/interfaces";
import { EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY } from "./useGetEventAddOnTranslations";

export const EVENT_ADD_ON_TRANSLATION_QUERY_KEY = (
  eventId: string,
  addOnId: string,
  locale: string
) => [...EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId), locale];

export const SET_EVENT_ADD_ON_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnTranslation>>
) => {
  client.setQueryData(
    EVENT_ADD_ON_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAddOnTranslationProps {
  eventId: string;
  addOnId: string;
  locale: string;
}

export const GetEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
}: GetEventAddOnTranslationProps): Promise<
  ConnectedXMResponse<EventAddOnTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`
  );
  return data;
};

const useGetEventAddOnTranslation = (
  eventId: string,
  addOnId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAddOnTranslation>>((
    EVENT_ADD_ON_TRANSLATION_QUERY_KEY(eventId, addOnId, locale),
    () =>
      GetEventAddOnTranslation({
        eventId,
        addOnId,
        locale,
      }),
    {
      enabled: !!eventId && !!addOnId && !!locale,
    }
  );
};

export default useGetEventAddOnTranslation;
