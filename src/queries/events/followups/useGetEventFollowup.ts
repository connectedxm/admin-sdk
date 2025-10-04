import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_FOLLOWUPS_QUERY_KEY } from "./useGetEventFollowups";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_QUERY_KEY = (
  eventId: string,
  followupId: string
) => [...EVENT_FOLLOWUPS_QUERY_KEY(eventId), followupId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowup>>
) => {
  client.setQueryData(EVENT_FOLLOWUP_QUERY_KEY(...keyParams), response);
};

interface GetEventFollowupProps extends SingleQueryParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowup = async ({
  eventId,
  followupId,
  adminApiParams,
}: GetEventFollowupProps): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFollowup = (
  eventId: string = "",
  followupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventFollowup>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFollowup>>(
    EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId),
    (params) => GetEventFollowup({ eventId, followupId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!followupId && (options?.enabled ?? true),
    }
  );
};
