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
export interface RemoveEventSessionLocationSessionParams
  extends MutationParams {
  eventId: string;
  locationId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
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

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
