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
  accountId: string
) => [...EVENT_ATTENDEES_QUERY_KEY(eventId), accountId];

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
  accountId: string;
}

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
