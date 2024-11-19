import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSIONS_QUERY_KEY,
  EVENT_SESSION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface DeleteEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const DeleteEventSession = async ({
  eventId,
  sessionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useDeleteEventSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSession>>,
      Omit<DeleteEventSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionParams,
    Awaited<ReturnType<typeof DeleteEventSession>>
  >(DeleteEventSession, options, {
    domain: "events",
    type: "update",
  });
};
