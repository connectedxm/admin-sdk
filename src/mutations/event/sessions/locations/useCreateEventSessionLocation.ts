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
 * @category Params
 * @group Event-Sessions
 */
export interface CreateEventSessionLocationParams extends MutationParams {
  eventId: string;
  location: EventSessionLocationCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const CreateEventSessionLocation = async ({
  eventId,
  location,
  adminApiParams,
  queryClient,
}: CreateEventSessionLocationParams): Promise<
  ConnectedXMResponse<EventSessionLocation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
