import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_SESSION_BLOCKS_QUERY_KEY,
  EVENT_SESSION_BLOCK_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventSessionBlockParams extends MutationParams {
  eventId: string;
  blockId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEventSessionBlock = async ({
  eventId,
  blockId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionBlockParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/blocks/${blockId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_BLOCKS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_BLOCK_QUERY_KEY(eventId, blockId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEventSessionBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionBlock>>,
      Omit<DeleteEventSessionBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionBlockParams,
    Awaited<ReturnType<typeof DeleteEventSessionBlock>>
  >(DeleteEventSessionBlock, options);
};
