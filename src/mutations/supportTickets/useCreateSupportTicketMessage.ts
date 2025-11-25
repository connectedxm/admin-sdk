import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, SupportTicketMessage } from "@src/interfaces";
import { SUPPORT_TICKET_MESSAGES_QUERY_KEY } from "@src/queries";
import { SupportTicketMessageCreateInputs } from "@src/params";
import { AppendInfiniteQuery } from "@src/utilities";

/**
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketMessageParams extends MutationParams {
  supportTicketId: string;
  message: SupportTicketMessageCreateInputs;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicketMessage = async ({
  supportTicketId,
  message,
  adminApiParams,
  queryClient,
}: CreateSupportTicketMessageParams): Promise<
  ConnectedXMResponse<SupportTicketMessage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SupportTicketMessage>
  >(`/supportTickets/${supportTicketId}/messages`, {
    message,
  });

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<SupportTicketMessage>(
      queryClient,
      SUPPORT_TICKET_MESSAGES_QUERY_KEY(supportTicketId),
      data.data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useCreateSupportTicketMessage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSupportTicketMessage>>,
      Omit<CreateSupportTicketMessageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketMessageParams,
    Awaited<ReturnType<typeof CreateSupportTicketMessage>>
  >(CreateSupportTicketMessage, options);
};
