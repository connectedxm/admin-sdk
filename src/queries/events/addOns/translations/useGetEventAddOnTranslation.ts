import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOnTranslation } from "@src/interfaces";
import { EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY } from "./useGetEventAddOnTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_TRANSLATION_QUERY_KEY = (
  eventId: string,
  addOnId: string,
  locale: string
) => [...EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId), locale];

/**
 * @category Setters
 * @group Events
 */
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

interface GetEventAddOnTranslationProps extends SingleQueryParams {
  eventId: string;
  addOnId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnTranslation = async ({
  eventId,
  addOnId,
  locale,
  adminApiParams,
}: GetEventAddOnTranslationProps): Promise<
  ConnectedXMResponse<EventAddOnTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAddOnTranslation = (
  eventId: string = "",
  addOnId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAddOnTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAddOnTranslation>>(
    EVENT_ADD_ON_TRANSLATION_QUERY_KEY(eventId, addOnId, locale),
    (params: SingleQueryParams) =>
      GetEventAddOnTranslation({
        eventId,
        addOnId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!addOnId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
