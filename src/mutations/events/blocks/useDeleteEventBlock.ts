import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_BLOCKS_QUERY_KEY, EVENT_BLOCK_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Blocks
 */
export interface DeleteEventBlockParams extends MutationParams {
  eventId: string;
  blockId: string;
}

/**
 * @category Methods
 * @group Event-Blocks
 */
export const DeleteEventBlock = async ({
  eventId,
  blockId,
  adminApiParams,
  queryClient,
}: DeleteEventBlockParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/blocks/${blockId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_BLOCKS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_BLOCK_QUERY_KEY(eventId, blockId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Blocks
 */
export const useDeleteEventBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventBlock>>,
      Omit<DeleteEventBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventBlockParams,
    Awaited<ReturnType<typeof DeleteEventBlock>>
  >(DeleteEventBlock, options);
};
