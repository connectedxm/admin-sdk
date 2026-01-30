import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SUPPORT_TICKET_QUERY_KEY,
  SUPPORT_TICKET_NOTES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group SupportTickets
 */
export interface DeleteSupportTicketNoteParams extends MutationParams {
  supportTicketId: string;
  noteId: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const DeleteSupportTicketNote = async ({
  supportTicketId,
  noteId,
  adminApiParams,
  queryClient,
}: DeleteSupportTicketNoteParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/supportTickets/${supportTicketId}/notes/${noteId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUPPORT_TICKET_QUERY_KEY(supportTicketId),
    });
    queryClient.invalidateQueries({
      queryKey: SUPPORT_TICKET_NOTES_QUERY_KEY(supportTicketId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
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
  >(DeleteSupportTicketNote, options);
};
