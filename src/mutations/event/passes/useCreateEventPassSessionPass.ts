import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionPassCreateInputs } from "@src/params";
import { SET_EVENT_PASS_SESSION_PASS_QUERY_DATA } from "@src/queries/events/passes/useGetEventPassSessionPass";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPasses";

/**
 * @category Params
 * @group Event-Attendees-Passs
 */
export interface CreateEventPassSessionPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionPass: EventSessionPassCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees-Passs
 */
export const CreateEventPassSessionPass = async ({
  eventId,
  passId,
  sessionPass,
  adminApiParams,
  queryClient,
}: CreateEventPassSessionPassParams): Promise<
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
    SET_EVENT_PASS_SESSION_PASS_QUERY_DATA(
      queryClient,
      [eventId, passId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees-Passs
 */
export const useCreateEventPassSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassSessionPass>>,
      Omit<CreateEventPassSessionPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassSessionPassParams,
    Awaited<ReturnType<typeof CreateEventPassSessionPass>>
  >(CreateEventPassSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
