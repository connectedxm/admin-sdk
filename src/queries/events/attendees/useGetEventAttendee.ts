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
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_QUERY_KEY = (
  eventId: string,
  attendeeId: string
) => [...EVENT_ATTENDEES_QUERY_KEY(eventId), attendeeId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ATTENDEE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendee>>
) => {
  client.setQueryData(EVENT_ATTENDEE_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeeProps extends SingleQueryParams {
  eventId: string;
  attendeeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendee = async ({
  eventId,
  attendeeId,
  adminApiParams,
}: GetEventAttendeeProps): Promise<ConnectedXMResponse<EventAttendee>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${attendeeId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAttendee = (
  eventId: string,
  attendeeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAttendee>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendee>>(
    EVENT_ATTENDEE_QUERY_KEY(eventId, attendeeId),
    (params: SingleQueryParams) =>
      GetEventAttendee({ eventId, attendeeId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!attendeeId && (options?.enabled ?? true),
    },
    "events"
  );
};
