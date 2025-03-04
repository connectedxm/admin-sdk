import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorship } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "./useGetEventSponsorships";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_QUERY_KEY = (
  eventId: string,
  levelId: string,
  sponsorshipId: string
) => [...EVENT_SPONSORSHIPS_QUERY_KEY(eventId, levelId), sponsorshipId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorship>>
) => {
  client.setQueryData(EVENT_SPONSORSHIP_QUERY_KEY(...keyParams), response);
};

interface GetEventSponsorshipProps extends SingleQueryParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorship = async ({
  eventId,
  levelId,
  sponsorshipId,
  adminApiParams,
}: GetEventSponsorshipProps): Promise<
  ConnectedXMResponse<EventSponsorship>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSponsorship = (
  eventId: string = "",
  levelId: string = "",
  sponsorshipId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSponsorship>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSponsorship>>(
    EVENT_SPONSORSHIP_QUERY_KEY(eventId, levelId, sponsorshipId),
    (params: SingleQueryParams) =>
      GetEventSponsorship({ eventId, levelId, sponsorshipId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!levelId && !!sponsorshipId && (options?.enabled ?? true),
    },
    "events"
  );
};
