import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionAccessUpdateInputs } from "@src/params";
import {
  EVENT_PASS_ACCESSES_QUERY_KEY,
  EVENT_SESSION_ACCESSES_QUERY_KEY,
  SET_EVENT_SESSION_ACCESS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventSessionAccessParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  access: EventSessionAccessUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventSessionAccess = async ({
  eventId,
  sessionId,
  passId,
  access,
  adminApiParams,
  queryClient,
}: UpdateEventSessionAccessParams): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionAccess>
  >(`/events/${eventId}/sessions/${sessionId}/passes/${passId}`, access);

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
 * @group Event-Attendee-Passes
 */
export const useUpdateEventSessionAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionAccess>>,
      Omit<UpdateEventSessionAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionAccessParams,
    Awaited<ReturnType<typeof UpdateEventSessionAccess>>
  >(UpdateEventSessionAccess, options, {
    domain: "events",
    type: "update",
  });
};
