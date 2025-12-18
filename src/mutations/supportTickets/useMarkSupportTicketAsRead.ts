import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SET_SUPPORT_TICKET_QUERY_DATA,
  SUPPORT_TICKET_VIEWER_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group SupportTickets
 */
export interface MarkSupportTicketAsReadParams extends MutationParams {
  supportTicketId: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const MarkSupportTicketAsRead = async ({
  supportTicketId,
  adminApiParams,
  queryClient,
}: MarkSupportTicketAsReadParams): Promise<
  ConnectedXMResponse<SupportTicket>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}/read`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
    queryClient.invalidateQueries({
      queryKey: SUPPORT_TICKET_VIEWER_QUERY_KEY(supportTicketId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useMarkSupportTicketAsRead = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof MarkSupportTicketAsRead>>,
      Omit<MarkSupportTicketAsReadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    MarkSupportTicketAsReadParams,
    Awaited<ReturnType<typeof MarkSupportTicketAsRead>>
  >(MarkSupportTicketAsRead, options);
};
