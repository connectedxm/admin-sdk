import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationBypass } from "@src/interfaces";
import { EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY } from "./useGetEventRegistrationBypassList";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches details of a specific event registration bypass using the event and bypass IDs.
 * This function is designed to retrieve detailed information about a particular bypass associated with an event.
 * It is useful in scenarios where understanding the specifics of an event's registration bypass is necessary.
 * @name GetEventRegistrationBypass
 * @param {string} eventId - The ID of the event
 * @param {string} bypassId - The ID of the bypass
 * @version 1.2
 **/

export const EVENT_REGISTRATION_BYPASS_QUERY_KEY = (
  eventId: string,
  bypassId: string
) => [
  ...EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
  bypassId.toString(),
];

export const SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_BYPASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationBypass>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_BYPASS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationBypassProps extends SingleQueryParams {
  eventId: string;
  bypassId: string;
}

export const GetEventRegistrationBypass = async ({
  eventId,
  bypassId,
  adminApiParams,
}: GetEventRegistrationBypassProps): Promise<
  ConnectedXMResponse<RegistrationBypass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/bypass/${bypassId}`);
  return data;
};

export const useGetEventRegistrationBypass = (
  eventId: string = "",
  bypassId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationBypass>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationBypass>>(
    EVENT_REGISTRATION_BYPASS_QUERY_KEY(eventId, bypassId),
    (params) => GetEventRegistrationBypass({ eventId, bypassId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!bypassId && (options?.enabled ?? true),
    },
    "events"
  );
};