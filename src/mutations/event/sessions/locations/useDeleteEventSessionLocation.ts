import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_LOCATION_QUERY_KEY } from "@src/queries/events/sessions/locations/useGetEventSessionLocation";
import { EVENT_SESSION_LOCATIONS_QUERY_KEY } from "@src/queries/events/sessions/locations/useGetEventSessionLocations";

/**
 * Endpoint to delete a specific event session location.
 * This function allows the removal of a session location associated with a particular event.
 * It is designed to be used in applications where managing event session locations is required.
 * @name DeleteEventSessionLocation
 * @param {string} eventId - The id of the event
 * @param {string} locationId - The id of the location
 * @version 1.2
**/
export interface DeleteEventSessionLocationParams extends MutationParams {
  eventId: string;
  locationId: string;
}

export const DeleteEventSessionLocation = async ({
  eventId,
  locationId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionLocationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessionLocations/${locationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_LOCATIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_LOCATION_QUERY_KEY(eventId, locationId),
    });
  }
  return data;
};

export const useDeleteEventSessionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionLocation>>,
      Omit<DeleteEventSessionLocationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionLocationParams,
    Awaited<ReturnType<typeof DeleteEventSessionLocation>>
  >(DeleteEventSessionLocation, options, {
    domain: "events",
    type: "update",
  });
};