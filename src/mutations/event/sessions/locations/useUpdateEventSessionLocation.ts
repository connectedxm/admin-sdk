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
 * @category Params
 * @group Event-Sessions
 */
export interface UpdateEventSessionLocationParams extends MutationParams {
  eventId: string;
  locationId: string;
  sessionLocation: EventSessionLocationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
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

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
