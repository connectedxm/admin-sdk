import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionTimeTranslation } from "@src/interfaces";
import { EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionTimeTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  timeId: string,
  locale: string
) => [
  ...EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(eventId, sessionId, timeId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_TIME_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTimeTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTimeTranslationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTimeTranslation = async ({
  eventId,
  sessionId,
  timeId,
  locale,
  adminApiParams,
}: GetEventSessionTimeTranslationProps): Promise<
  ConnectedXMResponse<EventSessionTimeTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionTimeTranslation = (
  eventId: string = "",
  sessionId: string = "",
  timeId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionTimeTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionTimeTranslation>
  >(
    EVENT_SESSION_TIME_TRANSLATION_QUERY_KEY(
      eventId,
      sessionId,
      timeId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventSessionTimeTranslation({
        ...params,
        eventId,
        sessionId,
        timeId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!timeId &&
        !!locale &&
        (options?.enabled ?? true),
    }
  );
};
