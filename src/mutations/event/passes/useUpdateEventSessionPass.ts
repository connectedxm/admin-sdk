import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionPassUpdateInputs } from "@src/params";
import { SET_EVENT_SESSION_PASS_QUERY_DATA } from "@src/queries/events/passes/useGetEventSessionPass";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPasses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventSessionPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionPassId: string;
  sessionPass: EventSessionPassUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventSessionPass = async ({
  eventId,
  passId,
  sessionPassId,
  sessionPass,
  adminApiParams,
  queryClient,
}: UpdateEventSessionPassParams): Promise<
  ConnectedXMResponse<EventSessionPass>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSessionPass>>(
    `/events/${eventId}/sessionPasses/${sessionPassId}`,
    sessionPass
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId),
    });

    SET_EVENT_SESSION_PASS_QUERY_DATA(
      queryClient,
      [eventId, sessionPassId],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useUpdateEventSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionPass>>,
      Omit<UpdateEventSessionPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionPassParams,
    Awaited<ReturnType<typeof UpdateEventSessionPass>>
  >(UpdateEventSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
