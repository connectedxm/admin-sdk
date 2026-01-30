import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_TRACKS_QUERY_KEY, EVENT_TRACK_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Tracks
 */
export interface DeleteEventTrackParams extends MutationParams {
  eventId: string;
  trackId: string;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
export const DeleteEventTrack = async ({
  eventId,
  trackId,
  adminApiParams,
  queryClient,
}: DeleteEventTrackParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/tracks/${trackId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACKS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_TRACK_QUERY_KEY(eventId, trackId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tracks
 */
export const useDeleteEventTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTrack>>,
      Omit<DeleteEventTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTrackParams,
    Awaited<ReturnType<typeof DeleteEventTrack>>
  >(DeleteEventTrack, options);
};
