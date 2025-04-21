import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_SESSIONS_QUERY_KEY,
  EVENT_SESSION_ACCESS_QUERY_KEY,
  EVENT_SESSION_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface DeleteEventSessionAccessParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const DeleteEventSessionAccess = async ({
  eventId,
  sessionId,
  passId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionAccessParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSIONS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_PASSES_QUERY_KEY(eventId, sessionId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_ACCESS_QUERY_KEY(eventId, sessionId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useDeleteEventSessionAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionAccess>>,
      Omit<DeleteEventSessionAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionAccessParams,
    Awaited<ReturnType<typeof DeleteEventSessionAccess>>
  >(DeleteEventSessionAccess, options, {
    domain: "events",
    type: "update",
  });
};
