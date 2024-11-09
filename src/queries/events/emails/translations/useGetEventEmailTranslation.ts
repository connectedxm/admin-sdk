import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventEmailType } from "@src/interfaces";
import { EventEmailTranslation } from "@src/interfaces";
import { EVENT_EMAIL_TRANSLATIONS_QUERY_KEY } from "./useGetEventEmailTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_EMAIL_TRANSLATION_QUERY_KEY = (
  eventId: string,
  type: EventEmailType,
  locale: string
) => [...EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(eventId, type), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_EMAIL_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_EMAIL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventEmailTranslation>>
) => {
  client.setQueryData(
    EVENT_EMAIL_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventEmailTranslationProps extends SingleQueryParams {
  eventId: string;
  type: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventEmailTranslation = async ({
  eventId,
  type,
  locale,
  adminApiParams,
}: GetEventEmailTranslationProps): Promise<
  ConnectedXMResponse<EventEmailTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/emails/${type}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventEmailTranslation = (
  eventId: string = "",
  type: EventEmailType,
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventEmailTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventEmailTranslation>>(
    EVENT_EMAIL_TRANSLATION_QUERY_KEY(eventId, type, locale),
    (params) =>
      GetEventEmailTranslation({
        ...params,
        eventId,
        type,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!type && !!locale && locale !== "en",
    },
    "events"
  );
};
