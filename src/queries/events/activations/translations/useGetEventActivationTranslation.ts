import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ActivationTranslation } from "@src/interfaces";
import { EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventActivationTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation details for a specific event activation based on the provided event ID, activation ID, and locale.
 * This function is designed to fetch localized translation data for event activations, which can be used in applications
 * that require displaying event information in different languages. It utilizes a connected single query to ensure
 * efficient data retrieval and caching.
 * @name GetEventActivationTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} activationId (path) - The ID of the activation
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 */

export const EVENT_ACTIVATION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  activationId: string,
  locale: string
) => [
  ...EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
export const GetEventActivationTranslation = async ({
  eventId,
  activationId,
  locale,
  adminApiParams,
}: GetEventActivationTranslationProps): Promise<
  ConnectedXMResponse<ActivationTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
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
        !!eventId &&
        !!activationId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};