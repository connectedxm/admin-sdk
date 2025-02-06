import { ConnectedXMResponse } from "@src/interfaces";
import { EventAttendee } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_ATTENDEES_QUERY_KEY } from "./useGetEventAttendees";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches details for a specific event attendee by their account ID within a given event.
 * This function is designed to manage and retrieve data about attendees of a particular event.
 * It is useful in applications where detailed information about event attendees is required.
 * @name GetEventAttendee
 * @param {string} eventId (path) - The ID of the event
 * @param {string} accountId (path) - The ID of the account
 * @version 1.3
 **/

export const EVENT_ATTENDEE_QUERY_KEY = (
  eventId: string,
  accountId: string
) => [...EVENT_ATTENDEES_QUERY_KEY(eventId), accountId];

export const SET_EVENT_ATTENDEE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ATTENDEE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendee>>
) => {
  client.setQueryData(EVENT_ATTENDEE_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeeProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
}

export const GetEventAttendee = async ({
  eventId,
  accountId,
  adminApiParams,
}: GetEventAttendeeProps): Promise<ConnectedXMResponse<EventAttendee>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}`
  );
  return data;
};

export const useGetEventAttendee = (
  eventId: string,
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAttendee>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendee>>(
    EVENT_ATTENDEE_QUERY_KEY(eventId, accountId),
    (params: SingleQueryParams) =>
      GetEventAttendee({ eventId, accountId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!accountId && (options?.enabled ?? true),
    },
    "events"
  );
};