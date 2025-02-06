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
 * Endpoint to delete a specific event session.
 * This function allows the removal of a session from an event by specifying the event and session IDs.
 * It is designed to be used in applications where event management and session control are required.
 * @name DeleteEventSession
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @version 1.3
 **/

export interface DeleteEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const DeleteEventSession = async ({
  eventId,
  sessionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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