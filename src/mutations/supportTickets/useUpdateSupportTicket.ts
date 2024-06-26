import { GetAdminAPI } from "@src/AdminAPI";
import {
  SupportTicket,
  ConnectedXMResponse,
  UpdateSupportTicketProps,
} from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SET_SUPPORT_TICKET_QUERY_DATA,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * @category Params
 * @group SupportTickets
 */
export interface UpdateSupportTicketParams extends MutationParams {
  supportTicketId: string;
  supportTicket: UpdateSupportTicketProps;
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

  if (supportTicket && supportTicket?.request) {
    delete supportTicket?.request;
  }

  const { data } = await connectedXM.put<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}`,
    supportTicket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
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
