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
 * Endpoint to delete a specific event pass and invalidate related queries.
 * This function allows the removal of an event pass by its ID and ensures that all related queries are invalidated to maintain data consistency.
 * It is designed for use in applications where event management and pass handling are required.
 * @name DeleteEventPass
 * @param {string} eventId (path) The id of the event
 * @param {string} passId (path) The id of the pass
 * @version 1.3
 **/
export interface DeleteEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  accountId?: string;
}

export const DeleteEventPass = async ({
  eventId,
  passId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventPassParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
