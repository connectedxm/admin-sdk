import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_BLOCKS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface AddEventSessionBlockParams extends MutationParams {
  eventId: string;
  sessionId: string;
  blockId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const AddEventSessionBlock = async ({
  eventId,
  sessionId,
  blockId,
  adminApiParams,
  queryClient,
}: AddEventSessionBlockParams): Promise<ConnectedXMResponse<EventSession>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/blocks/${blockId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_BLOCKS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useAddEventSessionBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionBlock>>,
      Omit<AddEventSessionBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionBlockParams,
    Awaited<ReturnType<typeof AddEventSessionBlock>>
  >(AddEventSessionBlock, options);
};
