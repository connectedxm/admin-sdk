import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation } from "@src/interfaces";
import { EVENT_TRANSLATIONS_QUERY_KEY } from "./useGetEventTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_TRANSLATION_QUERY_KEY = (
  eventId: string,
  locale: string
) => [...EVENT_TRANSLATIONS_QUERY_KEY(eventId), locale];

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

export const GetEventTranslation = async ({
  eventId,
  locale,
  adminApiParams,
}: GetEventTranslationProps): Promise<
  ConnectedXMResponse<EventTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/translations/${locale}`
  );
  return data;
};

const useGetEventTranslation = (
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
      enabled: !!eventId && !!locale && (options?.enabled ?? true),
    }
  );
};

export default useGetEventTranslation;
