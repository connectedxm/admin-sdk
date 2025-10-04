import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipLevelTranslation } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY } from "./useGetEventSponsorshipLevelTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY = (
  eventId: string,
  levelId: string,
  locale: string
) => [
  ...EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY(eventId, levelId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipLevelTranslation>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipLevelTranslationProps extends SingleQueryParams {
  eventId: string;
  levelId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipLevelTranslation = async ({
  eventId,
  levelId,
  locale,
  adminApiParams,
}: GetEventSponsorshipLevelTranslationProps): Promise<
  ConnectedXMResponse<EventSponsorshipLevelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSponsorshipLevelTranslation = (
  eventId: string = "",
  levelId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSponsorshipLevelTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSponsorshipLevelTranslation>
  >(
    EVENT_SPONSORSHIP_LEVEL_TRANSLATION_QUERY_KEY(eventId, levelId, locale),
    (params: SingleQueryParams) =>
      GetEventSponsorshipLevelTranslation({
        eventId,
        levelId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!levelId && !!locale && (options?.enabled ?? true),
    }
  );
};
