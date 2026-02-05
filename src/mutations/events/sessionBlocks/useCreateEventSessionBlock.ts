import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionBlock } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionBlockCreateInputs } from "@src/params";
import {
  EVENT_SESSION_BLOCKS_QUERY_KEY,
  SET_EVENT_SESSION_BLOCK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface CreateEventSessionBlockParams extends MutationParams {
  eventId: string;
  block: EventSessionBlockCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const CreateEventSessionBlock = async ({
  eventId,
  block,
  adminApiParams,
  queryClient,
}: CreateEventSessionBlockParams): Promise<
  ConnectedXMResponse<EventSessionBlock>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionBlock>
  >(`/events/${eventId}/session-blocks`, block);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_BLOCKS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_BLOCK_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useCreateEventSessionBlock = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionBlock>>,
      Omit<CreateEventSessionBlockParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionBlockParams,
    Awaited<ReturnType<typeof CreateEventSessionBlock>>
  >(CreateEventSessionBlock, options);
};
