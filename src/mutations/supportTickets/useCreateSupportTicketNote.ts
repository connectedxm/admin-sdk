import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import { SET_SUPPORT_TICKET_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group SupportTickets
 */
export interface CreateSupportTicketNoteParams extends MutationParams {
  supportTicketId: string;
  text: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const CreateSupportTicketNote = async ({
  supportTicketId,
  text,
  adminApiParams,
  queryClient,
}: CreateSupportTicketNoteParams): Promise<
  ConnectedXMResponse<SupportTicket>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}/notes`,
    { text }
  );
  if (queryClient && data.status === "ok") {
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useCreateSupportTicketNote = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSupportTicketNote>>,
      Omit<CreateSupportTicketNoteParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSupportTicketNoteParams,
    Awaited<ReturnType<typeof CreateSupportTicketNote>>
  >(CreateSupportTicketNote, options);
};
