import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group SupportTickets
 */
export interface UpdateSupportTicketViewerParams extends MutationParams {
  supportTicketId: string;
  clientTimestamp?: string;
}

/**
 * @category Methods
 * @group SupportTickets
 */
export const UpdateSupportTicketViewer = async ({
  supportTicketId,
  clientTimestamp,
  adminApiParams,
  queryClient,
}: UpdateSupportTicketViewerParams): Promise<ConnectedXMResponse<{}>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<{}>>(
    `/supportTickets/${supportTicketId}/viewer`,
    {
      clientTimestamp: clientTimestamp || new Date().toISOString(),
    }
  );

  if (queryClient && data.status === "ok") {
    // Invalidate support tickets list to update unread indicators
    queryClient.invalidateQueries({
      queryKey: ["SUPPORT_TICKETS"],
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group SupportTickets
 */
export const useUpdateSupportTicketViewer = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSupportTicketViewer>>,
      Omit<UpdateSupportTicketViewerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSupportTicketViewerParams,
    Awaited<ReturnType<typeof UpdateSupportTicketViewer>>
  >(UpdateSupportTicketViewer, options);
};
