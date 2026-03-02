import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventMediaItemTranslation } from "@src/interfaces";
import { EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY } from "./useGetEventMediaItemTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY = (
  eventId: string,
  mediaId: string,
  locale: string
) => [
  ...EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY(eventId, mediaId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MEDIA_ITEM_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItemTranslation>>
) => {
  client.setQueryData(
    EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventMediaItemTranslationProps extends SingleQueryParams {
  eventId: string;
  mediaId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMediaItemTranslation = async ({
  eventId,
  mediaId,
  locale,
  adminApiParams,
}: GetEventMediaItemTranslationProps): Promise<
  ConnectedXMResponse<EventMediaItemTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/media/${mediaId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventMediaItemTranslation = (
  eventId: string = "",
  mediaId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventMediaItemTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventMediaItemTranslation>
  >(
    EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY(eventId, mediaId, locale),
    (params: SingleQueryParams) =>
      GetEventMediaItemTranslation({
        eventId,
        mediaId,
        locale: locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!mediaId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
