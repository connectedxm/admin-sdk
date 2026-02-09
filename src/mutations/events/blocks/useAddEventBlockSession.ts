import { GetAdminAPI } from "@src/AdminAPI";
import { EventBlock, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_BLOCK_SESSIONS_QUERY_KEY,
  SET_EVENT_BLOCK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Blocks
 */
export interface AddEventBlockSessionParams extends MutationParams {
  eventId: string;
  blockId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Blocks
 */
export const AddEventBlockSession = async ({
  eventId,
  blockId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventBlockSessionParams): Promise<ConnectedXMResponse<EventBlock>> => {
  if (!blockId) throw new Error("Block ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventBlock>>(
    `/events/${eventId}/blocks/${blockId}/sessions/${sessionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_BLOCK_SESSIONS_QUERY_KEY(eventId, blockId),
    });
    SET_EVENT_BLOCK_QUERY_DATA(
      queryClient,
      [eventId, blockId || data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Blocks
 */
export const useAddEventBlockSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventBlockSession>>,
      Omit<AddEventBlockSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventBlockSessionParams,
    Awaited<ReturnType<typeof AddEventBlockSession>>
  >(AddEventBlockSession, options);
};
