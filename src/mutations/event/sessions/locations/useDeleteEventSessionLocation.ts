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
 * @category Params
 * @group Event-Session-Locations
 */
export interface DeleteEventSessionLocationParams extends MutationParams {
  eventId: string;
  locationId: string;
}

/**
 * @category Methods
 * @group Event-Session-Locations
 */
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

/**
 * @category Mutations
 * @group Event-Session-Locations
 */
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
