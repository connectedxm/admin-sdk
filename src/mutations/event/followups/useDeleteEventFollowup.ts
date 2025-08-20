import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUPS_QUERY_KEY,
  EVENT_FOLLOWUP_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface DeleteEventFollowupParams extends MutationParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const DeleteEventFollowup = async ({
  eventId,
  followupId,
  adminApiParams,
  queryClient,
}: DeleteEventFollowupParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/followups/${followupId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUPS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useDeleteEventFollowup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFollowup>>,
      Omit<DeleteEventFollowupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFollowupParams,
    Awaited<ReturnType<typeof DeleteEventFollowup>>
  >(DeleteEventFollowup, options, {
    domain: "events",
    type: "update",
  });
};
