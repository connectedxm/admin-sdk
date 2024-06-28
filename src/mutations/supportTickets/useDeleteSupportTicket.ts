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
 * @category Params
 * @group SupportTickets
 */
export interface DeleteSupportTicketParams extends MutationParams {
  supportTicketId: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const DeleteSupportTicket = async ({
  supportTicketId,
  adminApiParams,
  queryClient,
}: DeleteSupportTicketParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group SupportTickets
 */
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
  >(DeleteSupportTicket, options);
};
