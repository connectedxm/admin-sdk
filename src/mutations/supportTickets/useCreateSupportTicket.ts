import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SupportTicket, ConnectedXMResponse } from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SET_SUPPORT_TICKET_QUERY_DATA,
} from "@src/queries";
import { SupportTicketCreateInputs } from "@src/params";

/**
 * Endpoint to create a new support ticket.
 * This function allows users to submit a support ticket with the necessary information.
 * It is designed to be used in applications where users need to report issues or request assistance.
 * @name CreateSupportTicket
 * @param {SupportTicketCreateInputs} supportTicket (body) The information for the support ticket
 * @version 1.3
 **/

export interface CreateSupportTicketParams extends MutationParams {
  supportTicket: SupportTicketCreateInputs;
}

export const CreateSupportTicket = async ({
  supportTicket,
  adminApiParams,
  queryClient,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets`,
    supportTicket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

export const useCreateSupportTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSupportTicket>>,
      Omit<CreateSupportTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketParams,
    Awaited<ReturnType<typeof CreateSupportTicket>>
  >(CreateSupportTicket, options, {
    domain: "support",
    type: "update",
  });
};
