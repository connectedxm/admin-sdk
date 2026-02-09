import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventBlock } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventBlockCreateInputs } from "@src/params";
import {
  EVENT_BLOCKS_QUERY_KEY,
  SET_EVENT_BLOCK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Blocks
 */
export interface CreateEventBlockParams extends MutationParams {
  eventId: string;
  block: EventBlockCreateInputs;
}

/**
 * @category Methods
 * @group Event-Blocks
 */
export const CreateEventBlock = async ({
  eventId,
  block,
  adminApiParams,
  queryClient,
}: CreateEventBlockParams): Promise<ConnectedXMResponse<EventBlock>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventBlock>>(
    `/events/${eventId}/blocks`,
    block
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_BLOCKS_QUERY_KEY(eventId),
    });
    SET_EVENT_BLOCK_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Blocks
 */
export const useCreateEventBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventBlock>>,
      Omit<CreateEventBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventBlockParams,
    Awaited<ReturnType<typeof CreateEventBlock>>
  >(CreateEventBlock, options);
};
