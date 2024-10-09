import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TRACKS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface AddEventSessionTrackParams extends MutationParams {
  eventId: string;
  sessionId: string;
  trackId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const AddEventSessionTrack = async ({
  eventId,
  sessionId,
  trackId,
  adminApiParams,
  queryClient,
}: AddEventSessionTrackParams): Promise<ConnectedXMResponse<EventSession>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/tracks/${trackId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRACKS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useAddEventSessionTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionTrack>>,
      Omit<AddEventSessionTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionTrackParams,
    Awaited<ReturnType<typeof AddEventSessionTrack>>
  >(AddEventSessionTrack, options, {
    domain: "events",
    type: "update",
  });
};
