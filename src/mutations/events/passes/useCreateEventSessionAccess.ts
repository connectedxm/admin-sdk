import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_ACCESSES_QUERY_KEY,
  SET_EVENT_SESSION_ACCESS_QUERY_DATA,
} from "@src/queries";
import { EVENT_PASS_ACCESSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassAccesses";

/**
 * @category Params
 * @group Event-Attendees-Passs
 */
export interface CreateEventSessionAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Attendees-Passs
 */
export const CreateEventSessionAccess = async ({
  eventId,
  passId,
  sessionId,
  adminApiParams,
  queryClient,
}: CreateEventSessionAccessParams): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionAccess>
  >(`/events/${eventId}/sessions/${sessionId}/passes/${passId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESSES_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ACCESSES_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_ACCESS_QUERY_DATA(
      queryClient,
      [eventId, sessionId, passId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees-Passs
 */
export const useCreateEventSessionAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionAccess>>,
      Omit<CreateEventSessionAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionAccessParams,
    Awaited<ReturnType<typeof CreateEventSessionAccess>>
  >(CreateEventSessionAccess, options);
};
