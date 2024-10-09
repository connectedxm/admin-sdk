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
export interface TransferEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const TransferEventPass = async ({
  eventId,
  passId,
  accountId,
  adminApiParams,
  queryClient,
}: TransferEventPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/passes/${passId}/transfers`,
    { accountId }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useTransferEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof TransferEventPass>>,
      Omit<TransferEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferEventPassParams,
    Awaited<ReturnType<typeof TransferEventPass>>
  >(TransferEventPass, options, {
    domain: "events",
    type: "update",
  });
};
