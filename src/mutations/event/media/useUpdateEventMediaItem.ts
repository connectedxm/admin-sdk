import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventMediaItem } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventMediaItemUpdateInputs } from "@src/params";
import { EVENT_MEDIA_ITEMS_QUERY_KEY } from "@src/queries/events/media/useGetEventMediaItems";
import { SET_EVENT_MEDIA_ITEM_QUERY_DATA } from "@src/queries/events/media/useGetEventMediaItem";

/**
 * @category Params
 * @group Event-MediaItems
 */
export interface UpdateEventMediaItemParams extends MutationParams {
  eventId: string;
  mediaItemId: string;
  mediaItem: EventMediaItemUpdateInputs;
}

/**
 * @category Methods
 * @group Event-MediaItems
 */
export const UpdateEventMediaItem = async ({
  eventId,
  mediaItemId,
  mediaItem,
  adminApiParams,
  queryClient,
}: UpdateEventMediaItemParams): Promise<
  ConnectedXMResponse<EventMediaItem>
> => {
  if (!mediaItemId) throw new Error("Media Item ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventMediaItem>>(
    `/events/${eventId}/media/${mediaItemId}`,
    mediaItem
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEMS_QUERY_KEY(eventId),
    });
    SET_EVENT_MEDIA_ITEM_QUERY_DATA(
      queryClient,
      [eventId, mediaItemId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-MediaItems
 */
export const useUpdateEventMediaItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventMediaItem>>,
      Omit<UpdateEventMediaItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventMediaItemParams,
    Awaited<ReturnType<typeof UpdateEventMediaItem>>
  >(UpdateEventMediaItem, options, {
    domain: "events",
    type: "update",
  });
};
