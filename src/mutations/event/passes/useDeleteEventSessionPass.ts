import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_PASS_QUERY_KEY } from "@src/queries";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassSessionPasses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface DeleteEventSessionPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionPassId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const DeleteEventSessionPass = async ({
  eventId,
  passId,
  sessionPassId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessionPasses/${sessionPassId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_PASS_QUERY_KEY(eventId, sessionPassId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useDeleteEventSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionPass>>,
      Omit<DeleteEventSessionPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionPassParams,
    Awaited<ReturnType<typeof DeleteEventSessionPass>>
  >(DeleteEventSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
