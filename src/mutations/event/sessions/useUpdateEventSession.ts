import { GetAdminAPI } from "@src/AdminAPI";
import { EventSession, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionUpdateInputs } from "@src/params";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an event session with new data.
 * This function allows updating the details of a specific session within an event by providing the event ID, session ID, and the updated session data.
 * It is used in scenarios where modifications to session details are required, such as changing the session's schedule or speakers.
 * @name UpdateEventSession
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {EventSessionUpdateInputs} session (body) - The session data to update
 * @version 1.3
**/
export interface UpdateEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  session: EventSessionUpdateInputs;
}

export const UpdateEventSession = async ({
  eventId,
  sessionId,
  session,
  adminApiParams,
  queryClient,
}: UpdateEventSessionParams): Promise<ConnectedXMResponse<EventSession>> => {
  if (!sessionId) throw new Error("Session ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}`,
    {
      ...session,
      id: undefined,
      eventId: undefined,
      event: undefined,
      image: undefined,
      tracks: undefined,
      speakers: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_QUERY_DATA(
      queryClient,
      [eventId, sessionId || data.data?.id],
      data
    );
  }
  return data;
}

export const useUpdateEventSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSession>>,
      Omit<UpdateEventSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionParams,
    Awaited<ReturnType<typeof UpdateEventSession>>
  >(UpdateEventSession, options, {
    domain: "events",
    type: "update",
  });
};