import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventBlock } from "@src/interfaces";
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
export interface RemoveEventBlockSessionParams extends MutationParams {
  eventId: string;
  blockId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Blocks
 */
export const RemoveEventBlockSession = async ({
  eventId,
  blockId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveEventBlockSessionParams): Promise<ConnectedXMResponse<EventBlock>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventBlock>>(
    `/events/${eventId}/blocks/${blockId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_BLOCK_SESSIONS_QUERY_KEY(eventId, blockId),
    });
    SET_EVENT_BLOCK_QUERY_DATA(queryClient, [eventId, blockId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Blocks
 */
export const useRemoveEventBlockSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventBlockSession>>,
      Omit<RemoveEventBlockSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventBlockSessionParams,
    Awaited<ReturnType<typeof RemoveEventBlockSession>>
  >(RemoveEventBlockSession, options);
};
