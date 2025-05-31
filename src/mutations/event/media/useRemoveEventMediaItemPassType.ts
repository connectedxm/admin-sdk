import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventMediaItem } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY,
  SET_EVENT_MEDIA_ITEM_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-MediaItems
 */
export interface RemoveEventMediaItemPassTypeParams extends MutationParams {
  eventId: string;
  mediaItemId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-MediaItems
 */
export const RemoveEventMediaItemPassType = async ({
  eventId,
  mediaItemId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventMediaItemPassTypeParams): Promise<
  ConnectedXMResponse<EventMediaItem>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<EventMediaItem>
  >(`/events/${eventId}/media/${mediaItemId}/passTypes/${passTypeId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEM_PASS_TYPES_QUERY_KEY(eventId, mediaItemId),
    });
    SET_EVENT_MEDIA_ITEM_QUERY_DATA(queryClient, [eventId, mediaItemId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-MediaItems
 */
export const useRemoveEventMediaItemPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventMediaItemPassType>>,
      Omit<RemoveEventMediaItemPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventMediaItemPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventMediaItemPassType>>
  >(RemoveEventMediaItemPassType, options, {
    domain: "events",
    type: "update",
  });
};
