import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationFollowupTranslation } from "@src/interfaces";
import { EVENT_FOLLOWUP_QUERY_KEY } from "../useGetEventFollowup";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY = (
  eventId: string,
  followupId: string,
  locale: string
) => [...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupTranslation>>
) => {
  client.setQueryData(
    EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFollowupTranslationProps extends SingleQueryParams {
  eventId: string;
  followupId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupTranslation = async ({
  eventId,
  followupId,
  locale,
  adminApiParams,
}: GetEventFollowupTranslationProps): Promise<
  ConnectedXMResponse<RegistrationFollowupTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFollowupTranslation = (
  eventId: string = "",
  followupId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFollowupTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventFollowupTranslation>
  >(
    EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY(eventId, followupId, locale),
    (params: SingleQueryParams) =>
      GetEventFollowupTranslation({
        ...params,
        eventId,
        followupId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!followupId && !!locale && locale !== "en",
    },
    "events"
  );
};
