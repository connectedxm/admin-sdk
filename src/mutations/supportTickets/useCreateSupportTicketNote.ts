import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, SupportTicket } from "@src/interfaces";
import { SET_SUPPORT_TICKET_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to create a new note for a support ticket.
 * This function allows users to add additional information or comments to an existing support ticket by creating a new note.
 * It is useful for tracking the progress or updates related to a support ticket.
 * @name CreateSupportTicketNote
 * @param {string} supportTicketId (path) - The id of the support ticket
 * @param {string} text (bodyValue) - The content of the note
 * @version 1.3
 **/

export interface CreateSupportTicketNoteParams extends MutationParams {
  supportTicketId: string;
  text: string;
}

export const CreateSupportTicketNote = async ({
  supportTicketId,
  text,
  adminApiParams,
  queryClient,
}: CreateSupportTicketNoteParams): Promise<
  ConnectedXMResponse<SupportTicket>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<SupportTicket>>(
    `/supportTickets/${supportTicketId}/notes`,
    { text }
  );
  if (queryClient && data.status === "ok") {
    SET_SUPPORT_TICKET_QUERY_DATA(queryClient, [supportTicketId], data);
  }
  return data;
};

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
  >(CreateSupportTicketNote, options, {
    domain: "support",
    type: "update",
  });
};