import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipTranslation } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "./useGetEventSponsorshipTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY = (
  eventId: string,
  levelId: string,
  sponsorshipId: string,
  locale: string
) => [
  ...EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY(eventId, levelId, sponsorshipId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipTranslation>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipTranslationProps extends SingleQueryParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipTranslation = async ({
  eventId,
  levelId,
  sponsorshipId,
  locale,
  adminApiParams,
}: GetEventSponsorshipTranslationProps): Promise<
  ConnectedXMResponse<EventSponsorshipTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSponsorshipTranslation = (
  eventId: string = "",
  levelId: string = "",
  sponsorshipId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSponsorshipTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSponsorshipTranslation>
  >(
    EVENT_SPONSORSHIP_TRANSLATION_QUERY_KEY(
      eventId,
      levelId,
      sponsorshipId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventSponsorshipTranslation({
        eventId,
        levelId,
        sponsorshipId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!levelId &&
        !!sponsorshipId &&
        !!locale &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
