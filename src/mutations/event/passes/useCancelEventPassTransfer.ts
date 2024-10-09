import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface CancelEventPassTransferParams extends MutationParams {
  eventId: string;
  passId: string;
  transferId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const CancelEventPassTransfer = async ({
  eventId,
  passId,
  transferId,
  adminApiParams,
  queryClient,
}: CancelEventPassTransferParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/passes/${passId}/transfers/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useCancelEventPassTransfer = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelEventPassTransfer>>,
      Omit<CancelEventPassTransferParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventPassTransferParams,
    Awaited<ReturnType<typeof CancelEventPassTransfer>>
  >(CancelEventPassTransfer, options, {
    domain: "events",
    type: "update",
  });
};
