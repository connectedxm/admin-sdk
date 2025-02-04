import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SUPPORT_TICKET_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific note from a support ticket.
 * This function allows the removal of a note associated with a support ticket by specifying the ticket and note IDs.
 * It is intended for use in applications where managing support ticket notes is required.
 * @name DeleteSupportTicketNote
 * @param {string} supportTicketId - The ID of the support ticket
 * @param {string} noteId - The ID of the note to be deleted
 * @version 1.2
 **/

export interface DeleteSupportTicketNoteParams extends MutationParams {
  supportTicketId: string;
  noteId: string;
}

export const DeleteSupportTicketNote = async ({
  supportTicketId,
  noteId,
  adminApiParams,
  queryClient,
}: DeleteSupportTicketNoteParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/supportTickets/${supportTicketId}/notes/${noteId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUPPORT_TICKET_QUERY_KEY(supportTicketId),
    });
  }
  return data;
};

export const useDeleteSupportTicketNote = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSupportTicketNote>>,
      Omit<DeleteSupportTicketNoteParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSupportTicketNoteParams,
    Awaited<ReturnType<typeof DeleteSupportTicketNote>>
  >(DeleteSupportTicketNote, options, {
    domain: "support",
    type: "update",
  });
};