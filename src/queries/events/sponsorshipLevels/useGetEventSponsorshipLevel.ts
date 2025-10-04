import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipLevel } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIP_LEVELS_QUERY_KEY } from "./useGetEventSponsorshipLevels";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_LEVEL_QUERY_KEY = (
  eventId: string,
  levelId: string
) => [...EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId), levelId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_LEVEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_LEVEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipLevel>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_LEVEL_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipLevelProps extends SingleQueryParams {
  eventId: string;
  levelId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipLevel = async ({
  eventId,
  levelId,
  adminApiParams,
}: GetEventSponsorshipLevelProps): Promise<
  ConnectedXMResponse<EventSponsorshipLevel>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSponsorshipLevel = (
  eventId: string = "",
  levelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSponsorshipLevel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSponsorshipLevel>>(
    EVENT_SPONSORSHIP_LEVEL_QUERY_KEY(eventId, levelId),
    (params: SingleQueryParams) =>
      GetEventSponsorshipLevel({ eventId, levelId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!levelId && (options?.enabled ?? true),
    }
  );
};
