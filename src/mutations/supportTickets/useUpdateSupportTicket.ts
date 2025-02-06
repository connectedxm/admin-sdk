import { GetAdminAPI } from "@src/AdminAPI";
import { SupportTicket, ConnectedXMResponse } from "@src/interfaces";
import {
  SUPPORT_TICKETS_QUERY_KEY,
  SET_SUPPORT_TICKET_QUERY_DATA,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SupportTicketUpdateInputs } from "@src/params";

/**
 * Endpoint to update a support ticket with new information.
 * This function allows for the modification of existing support tickets by providing updated inputs.
 * It is designed to be used in applications where support ticket management is required.
 * @name UpdateSupportTicket
 * @param {string} supportTicketId (path) - The id of the support ticket
 * @param {SupportTicketUpdateInputs} supportTicket (body) - The support ticket update inputs
 * @version 1.3
 **/

export interface UpdateSupportTicketParams extends MutationParams {
  supportTicketId: string;
  supportTicket: SupportTicketUpdateInputs;
}

export const UpdateSupportTicket = async ({
  supportTicketId,
  supportTicket,
  adminApiParams,
  queryClient,
}: UpdateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}`,
    supportTicket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
  }
  return data;
};

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
  >(UpdateSupportTicket, options, {
    domain: "support",
    type: "update",
  });
};