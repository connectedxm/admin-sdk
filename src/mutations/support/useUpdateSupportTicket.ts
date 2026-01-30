import { GetAdminAPI } from "@src/AdminAPI";
import { SupportTicket, ConnectedXMResponse } from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SET_SUPPORT_TICKET_QUERY_DATA,
  SUPPORT_TICKET_ACTIVITY_QUERY_KEY,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SupportTicketUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group SupportTickets
 */
export interface UpdateSupportTicketParams extends MutationParams {
  supportTicketId: string;
  supportTicket: SupportTicketUpdateInputs;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const UpdateSupportTicket = async ({
  supportTicketId,
  supportTicket,
  adminApiParams,
  queryClient,
}: UpdateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}`,
    supportTicket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: [SUPPORT_TICKETS_QUERY_KEY()[0]],
    });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
    queryClient.invalidateQueries({
      queryKey: SUPPORT_TICKET_ACTIVITY_QUERY_KEY(supportTicketId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useUpdateSupportTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSupportTicket>>,
      Omit<UpdateSupportTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSupportTicketParams,
    Awaited<ReturnType<typeof UpdateSupportTicket>>
  >(UpdateSupportTicket, options);
};
