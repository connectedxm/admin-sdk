import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivationTranslation } from "@src/interfaces";
import { EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventActivationTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

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

interface GetEventActivationTranslationProps extends SingleQueryParams {
  eventId: string;
  activationId: string;
  locale: string;
}

export const GetEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
  adminApiParams,
}: GetEventActivationTranslationProps): Promise<
  ConnectedXMResponse<EventActivationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`
  );
  return data;
};
export const useGetEventActivationTranslation = (
  eventId: string = "",
  activationId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventActivationTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventActivationTranslation>
  >(
    EVENT_ACTIVATION_TRANSLATION_QUERY_KEY(eventId, activationId, locale),
    (params: SingleQueryParams) =>
      GetEventActivationTranslation({
        eventId,
        activationId,
        locale: locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!activationId && !!locale && (options?.enabled ?? true),
    }
  );
};
