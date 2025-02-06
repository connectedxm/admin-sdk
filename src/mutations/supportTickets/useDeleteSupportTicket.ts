import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SUPPORT_TICKET_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a support ticket by its unique identifier.
 * This function allows administrators to remove a support ticket from the system.
 * It ensures that the support ticket is deleted and updates the query cache accordingly.
 * @name DeleteSupportTicket
 * @param {string} supportTicketId (path) The ID of the support ticket
 * @version 1.3
 **/

export interface DeleteSupportTicketParams extends MutationParams {
  supportTicketId: string;
}

export const DeleteSupportTicket = async ({
  supportTicketId,
  adminApiParams,
  queryClient,
}: DeleteSupportTicketParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/supportTickets/${supportTicketId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: SUPPORT_TICKET_QUERY_KEY(supportTicketId),
    });
  }
  return data;
};

export const useDeleteSupportTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSupportTicket>>,
      Omit<DeleteSupportTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSupportTicketParams,
    Awaited<ReturnType<typeof DeleteSupportTicket>>
  >(DeleteSupportTicket, options, {
    domain: "support",
    type: "update",
  });
};
