import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassTypeTranslation } from "@src/interfaces";
import { EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPassTypeTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  passTypeId: string,
  locale: string
) => [...EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeTranslation>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeTranslationProps extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  adminApiParams,
}: GetEventPassTypeTranslationProps): Promise<
  ConnectedXMResponse<EventPassTypeTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassTypeTranslation = (
  eventId: string = "",
  passTypeId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassTypeTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassTypeTranslation>
  >(
    EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(eventId, passTypeId, locale),
    (params) =>
      GetEventPassTypeTranslation({
        ...params,
        eventId,
        passTypeId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!passTypeId && !!locale && locale !== "en",
    }
  );
};
