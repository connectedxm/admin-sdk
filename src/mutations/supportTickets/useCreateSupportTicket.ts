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
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketParams extends MutationParams {
  supportTicket: SupportTicketCreateInputs;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicket = async ({
  supportTicket,
  adminApiParams,
  queryClient,
}: CreateSupportTicketParams): Promise<ConnectedXMResponse<SupportTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets`,
    supportTicket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY() });
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
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
