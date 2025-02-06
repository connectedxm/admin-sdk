import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionLocation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_LOCATION_QUERY_DATA } from "@src/queries/events/sessions/locations/useGetEventSessionLocation";
import { EVENT_SESSION_LOCATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/useGetEventSessionLocations";

/**
 * Adds a location to a specific event session and updates the query client with the new data.
 * This function is used to associate a location with a session within an event, ensuring that the session's location data is current and accurate.
 * It is particularly useful in scenarios where event sessions are dynamically managed and require real-time updates.
 * @name AddEventSessionLocationSession
 * @param {string} eventId (path) - The id of the event
 * @param {string} locationId (path) - The id of the location
 * @param {string} sessionId (path) - The id of the session
 * @version 1.3
 **/

export interface AddEventSessionLocationSessionParams extends MutationParams {
  eventId: string;
  locationId: string;
  sessionId: string;
}

export const AddEventSessionLocationSession = async ({
  eventId,
  locationId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventSessionLocationSessionParams): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  if (!locationId) throw new Error("Location ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<EventSessionLocation>
  >(`/events/${eventId}/sessionLocations/${locationId}/sessions/${sessionId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_LOCATION_QUERY_DATA(
      queryClient,
      [eventId, locationId || data.data?.id],
      data
    );
  }
  return data;
}

export const useAddEventSessionLocationSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionLocationSession>>,
      Omit<
        AddEventSessionLocationSessionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionLocationSessionParams,
    Awaited<ReturnType<typeof AddEventSessionLocationSession>>
  >(AddEventSessionLocationSession, options, {
    domain: "events",
    type: "update",
  });
};