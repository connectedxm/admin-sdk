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
 * @category Params
 * @group Event-Sessions
 */
export interface AddEventSessionLocationSessionParams extends MutationParams {
  eventId: string;
  locationId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
