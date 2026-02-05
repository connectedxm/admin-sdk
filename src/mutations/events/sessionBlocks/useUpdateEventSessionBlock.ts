import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionBlockUpdateInputs } from "@src/params";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventSessionBlock } from "@src/interfaces";
import {
  EVENT_SESSION_BLOCKS_QUERY_KEY,
  SET_EVENT_SESSION_BLOCK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface UpdateEventSessionBlockParams extends MutationParams {
  eventId: string;
  blockId: string;
  block: EventSessionBlockUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const UpdateEventSessionBlock = async ({
  eventId,
  blockId,
  block,
  adminApiParams,
  queryClient,
}: UpdateEventSessionBlockParams): Promise<
  ConnectedXMResponse<EventSessionBlock>
> => {
  if (!blockId) throw new Error("Block ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionBlock>
  >(`/events/${eventId}/blocks/${blockId}`, block);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_BLOCKS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_BLOCK_QUERY_DATA(
      queryClient,
      [eventId, blockId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useUpdateEventSessionBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionBlock>>,
      Omit<UpdateEventSessionBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionBlockParams,
    Awaited<ReturnType<typeof UpdateEventSessionBlock>>
  >(UpdateEventSessionBlock, options);
};
