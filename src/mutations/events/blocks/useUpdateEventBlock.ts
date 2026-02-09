import { GetAdminAPI } from "@src/AdminAPI";
import { EventBlockUpdateInputs } from "@src/params";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventBlock } from "@src/interfaces";
import {
  EVENT_BLOCKS_QUERY_KEY,
  SET_EVENT_BLOCK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Blocks
 */
export interface UpdateEventBlockParams extends MutationParams {
  eventId: string;
  blockId: string;
  block: EventBlockUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Blocks
 */
export const UpdateEventBlock = async ({
  eventId,
  blockId,
  block,
  adminApiParams,
  queryClient,
}: UpdateEventBlockParams): Promise<ConnectedXMResponse<EventBlock>> => {
  if (!blockId) throw new Error("Block ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventBlock>>(
    `/events/${eventId}/blocks/${blockId}`,
    block
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_BLOCKS_QUERY_KEY(eventId),
    });
    SET_EVENT_BLOCK_QUERY_DATA(
      queryClient,
      [eventId, blockId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Blocks
 */
export const useUpdateEventBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventBlock>>,
      Omit<UpdateEventBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventBlockParams,
    Awaited<ReturnType<typeof UpdateEventBlock>>
  >(UpdateEventBlock, options);
};
