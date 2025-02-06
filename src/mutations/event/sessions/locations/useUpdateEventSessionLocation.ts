import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionLocation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionLocationUpdateInputs } from "@src/params";
import { SET_EVENT_SESSION_LOCATION_QUERY_DATA } from "@src/queries/events/sessions/locations/useGetEventSessionLocation";
import { EVENT_SESSION_LOCATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/useGetEventSessionLocations";

/**
 * Endpoint to update the location of a specific event session.
 * This function allows updating the details of a session location within an event by providing the event ID, location ID, and the update inputs.
 * It is designed to be used in applications where event session locations need to be modified.
 * @name UpdateEventSessionLocation
 * @param {string} eventId (path) - The id of the event
 * @param {string} locationId (path) - The id of the location
 * @param {EventSessionLocationUpdateInputs} sessionLocation (body) - The session location update inputs
 * @version 1.3
 **/

export interface UpdateEventSessionLocationParams extends MutationParams {
  eventId: string;
  locationId: string;
  sessionLocation: EventSessionLocationUpdateInputs;
}

export const UpdateEventSessionLocation = async ({
  eventId,
  locationId,
  sessionLocation,
  adminApiParams,
  queryClient,
}: UpdateEventSessionLocationParams): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  if (!locationId) throw new Error("Session ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<EventSessionLocation>
  >(`/events/${eventId}/sessionLocations/${locationId}`, {
    ...sessionLocation,
    id: undefined,
  });

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

export const useUpdateEventSessionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionLocation>>,
      Omit<UpdateEventSessionLocationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionLocationParams,
    Awaited<ReturnType<typeof UpdateEventSessionLocation>>
  >(UpdateEventSessionLocation, options, {
    domain: "events",
    type: "update",
  });
};