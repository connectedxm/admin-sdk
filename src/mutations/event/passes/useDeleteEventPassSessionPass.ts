import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_SESSION_PASS_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPass";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPasses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface DeleteEventPassSessionPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionPassId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const DeleteEventPassSessionPass = async ({
  eventId,
  passId,
  sessionPassId,
  adminApiParams,
  queryClient,
}: DeleteEventPassSessionPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/passes/${passId}/sessionPasses/${sessionPassId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PASS_SESSION_PASS_QUERY_KEY(
        eventId,
        passId,
        sessionPassId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useDeleteEventPassSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassSessionPass>>,
      Omit<DeleteEventPassSessionPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassSessionPassParams,
    Awaited<ReturnType<typeof DeleteEventPassSessionPass>>
  >(DeleteEventPassSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
