import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivationTranslation } from "@src/interfaces";
import { EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventActivationTranslations";

export const EVENT_ACTIVATION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  activationId: string,
  locale: string
) => [
  ...EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
  locale,
];

export const SET_EVENT_ACTIVATION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACTIVATION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationTranslation>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationTranslationProps {
  eventId: string;
  activationId: string;
  locale: string;
}

export const GetEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
}: GetEventActivationTranslationProps): Promise<
  ConnectedXMResponse<EventActivationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`
  );
  return data;
};

const useGetEventActivationTranslation = (
  eventId: string,
  activationId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivationTranslation>>((
    EVENT_ACTIVATION_TRANSLATION_QUERY_KEY(eventId, activationId, locale),
    () =>
      GetEventActivationTranslation({
        eventId,
        activationId,
        locale: locale,
      }),
    {
      enabled: !!eventId && !!activationId && !!locale,
    }
  );
};

export default useGetEventActivationTranslation;
