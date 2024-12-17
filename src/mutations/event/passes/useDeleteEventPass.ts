import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_PASS_QUERY_KEY,
  EVENT_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface DeleteEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const DeleteEventPass = async ({
  eventId,
  passId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/passes/${passId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
    if (accountId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useDeleteEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPass>>,
      Omit<DeleteEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassParams,
    Awaited<ReturnType<typeof DeleteEventPass>>
  >(DeleteEventPass, options, {
    domain: "events",
    type: "update",
  });
};
