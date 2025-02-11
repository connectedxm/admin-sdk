import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionLocation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionLocationCreateInputs } from "@src/params";
import { SET_EVENT_SESSION_LOCATION_QUERY_DATA } from "@src/queries/events/sessions/locations/useGetEventSessionLocation";
import { EVENT_SESSION_LOCATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/useGetEventSessionLocations";

/**
 * Endpoint to create a new event session location.
 * This function allows the creation of a new location for a specific event session.
 * It is designed to be used in applications where event management and location tracking are required.
 * @name CreateEventSessionLocation
 * @param {string} eventId (path) The id of the event
 * @param {EventSessionLocationCreateInputs} location (body) The location details for the event session
 * @version 1.3
 **/
export interface CreateEventSessionLocationParams extends MutationParams {
  eventId: string;
  location: EventSessionLocationCreateInputs;
}

export const CreateEventSessionLocation = async ({
  eventId,
  location,
  adminApiParams,
  queryClient,
}: CreateEventSessionLocationParams): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<EventSessionLocation>
  >(`/events/${eventId}/sessionLocations`, location);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_LOCATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

export const useCreateEventSessionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionLocation>>,
      Omit<CreateEventSessionLocationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionLocationParams,
    Awaited<ReturnType<typeof CreateEventSessionLocation>>
  >(CreateEventSessionLocation, options, {
    domain: "events",
    type: "update",
  });
};
