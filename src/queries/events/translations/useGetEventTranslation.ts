import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation } from "@src/interfaces";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "./useGetEventTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TRANSLATION_QUERY_KEY = (
  eventId: string,
  locale: string
) => [...EVENT_TRANSLATIONS_QUERY_KEY(eventId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTranslation>>
) => {
  client.setQueryData(EVENT_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetEventTranslationProps extends SingleQueryParams {
  eventId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTranslation = async ({
  eventId,
  locale,
  adminApiParams,
}: GetEventTranslationProps): Promise<
  ConnectedXMResponse<EventTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTranslation = (
  eventId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTranslation>>(
    EVENT_TRANSLATION_QUERY_KEY(eventId, locale),
    (params: SingleQueryParams) =>
      GetEventTranslation({
        eventId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!locale && locale !== "en" && (options?.enabled ?? true),
    },
    "events"
  );
};
