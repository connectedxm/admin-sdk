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
 * @category Params
 * @group Event-Sessions
 */
export interface UpdateEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  session: EventSessionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const UpdateEventSession = async ({
  eventId,
  sessionId,
  session,
  adminApiParams,
  queryClient,
}: UpdateEventSessionParams): Promise<ConnectedXMResponse<EventSession>> => {
  if (!sessionId) throw new Error("Session ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSession>>(
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
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
  >(UpdateEventSession, options);
};
