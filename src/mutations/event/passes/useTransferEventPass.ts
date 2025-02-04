import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
  EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY,
  EVENT_PASS_QUERY_KEY,
  EVENT_PASS_TRANSFER_LOGS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface TransferEventPassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
  receiverId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const TransferEventPass = async ({
  eventId,
  accountId,
  passId,
  receiverId,
  adminApiParams,
  queryClient,
}: TransferEventPassParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/passes/${passId}/transfers`,
    { accountId: receiverId }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId),
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY(eventId, accountId),
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
