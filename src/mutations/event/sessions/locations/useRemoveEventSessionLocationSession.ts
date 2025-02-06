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
 * Endpoint to remove a session location for a specific event.
 * This function allows the removal of a session location from an event by specifying the event ID, location ID, and session ID.
 * It is used in scenarios where a session location needs to be disassociated from an event.
 * @name RemoveEventSessionLocationSession
 * @param {string} eventId (path) - The id of the event
 * @param {string} locationId (path) - The id of the location
 * @param {string} sessionId (path) - The id of the session
 * @version 1.3
 **/
export interface RemoveEventSessionLocationSessionParams
  extends MutationParams {
  eventId: string;
  locationId: string;
  sessionId: string;
}

export const RemoveEventSessionLocationSession = async ({
  eventId,
  locationId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionLocationSessionParams): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  if (!locationId) throw new Error("Location ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
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
};

export const useRemoveEventSessionLocationSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionLocationSession>>,
      Omit<
        RemoveEventSessionLocationSessionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionLocationSessionParams,
    Awaited<ReturnType<typeof RemoveEventSessionLocationSession>>
  >(RemoveEventSessionLocationSession, options, {
    domain: "events",
    type: "update",
  });
};