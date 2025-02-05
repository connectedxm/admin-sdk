import { GetAdminAPI } from "@src/AdminAPI";
import { EventSession, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionCreateInputs } from "@src/params";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event session.
 * This function allows the creation of a new session for a specified event by providing the event ID and session details.
 * It is designed to be used in applications where event management and session scheduling are required.
 * @name CreateEventSession
 * @param {string} eventId - The id of the event
 * @param {EventSessionCreateInputs} session - The session details to be created
 * @version 1.2
 **/

export interface CreateEventSessionParams extends MutationParams {
  eventId: string;
  session: EventSessionCreateInputs;
}

export const CreateEventSession = async ({
  eventId,
  session,
  adminApiParams,
  queryClient,
}: CreateEventSessionParams): Promise<ConnectedXMResponse<EventSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions`,
    session
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

export const useCreateEventSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSession>>,
      Omit<CreateEventSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionParams,
    Awaited<ReturnType<typeof CreateEventSession>>
  >(CreateEventSession, options, {
    domain: "events",
    type: "update",
  });
};