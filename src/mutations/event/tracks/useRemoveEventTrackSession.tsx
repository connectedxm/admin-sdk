import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTrack } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRACK_SESSIONS_QUERY_KEY,
  SET_EVENT_TRACK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tracks
 */
export interface RemoveEventTrackSessionParams extends MutationParams {
  eventId: string;
  trackId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
export const RemoveEventTrackSession = async ({
  eventId,
  trackId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveEventTrackSessionParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventTrack>>(
    `/events/${eventId}/tracks/${trackId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId),
    });
    SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tracks
 */
export const useRemoveEventTrackSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventTrackSession>>,
      Omit<RemoveEventTrackSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventTrackSessionParams,
    Awaited<ReturnType<typeof RemoveEventTrackSession>>
  >(RemoveEventTrackSession, options);
};
