import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionPassCreateInputs } from "@src/params";
import { SET_EVENT_SESSION_PASS_QUERY_DATA } from "@src/queries/events/passes/useGetEventSessionPass";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPasses";
import { EVENT_SESSION_PASSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees-Passs
 */
export interface CreateEventSessionPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionPass: EventSessionPassCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees-Passs
 */
export const CreateEventSessionPass = async ({
  eventId,
  passId,
  sessionPass,
  adminApiParams,
  queryClient,
}: CreateEventSessionPassParams): Promise<
  ConnectedXMResponse<EventSessionPass>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionPass>
  >(`/events/${eventId}/passes/${passId}/sessionPasses`, sessionPass);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_PASSES_QUERY_KEY(eventId, data.data.session.id),
    });
    SET_EVENT_SESSION_PASS_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees-Passs
 */
export const useCreateEventSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionPass>>,
      Omit<CreateEventSessionPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionPassParams,
    Awaited<ReturnType<typeof CreateEventSessionPass>>
  >(CreateEventSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
