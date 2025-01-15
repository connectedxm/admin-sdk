import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASSES_QUERY_KEY } from "../passes";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY = (
  eventId: string,
  passId: string
) => {
  const key = [...EVENT_PASSES_QUERY_KEY(eventId), passId, "ATTENDEE_PASSES"];

  return key;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_ATTENDEE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAttendeePasses>>
) => {
  client.setQueryData(
    EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassAttendeePassesProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassAttendeePasses = async ({
  eventId,
  passId,
  adminApiParams,
}: GetEventPassAttendeePassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/attendee/passes`,
    {}
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassAttendeePasses = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassAttendeePasses>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassAttendeePasses>>(
    EVENT_PASS_ATTENDEE_PASSES_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPassAttendeePasses({
        ...params,
        eventId,
        passId,
      }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};
