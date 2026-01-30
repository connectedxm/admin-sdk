import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_MEDIA_ITEMS_QUERY_KEY } from "@src/queries/events/media/useGetEventMediaItems";
import { EVENT_MEDIA_ITEM_QUERY_KEY } from "@src/queries/events/media/useGetEventMediaItem";

/**
 * @category Params
 * @group Event-MediaItems
 */
export interface DeleteEventMediaItemParams extends MutationParams {
  eventId: string;
  mediaItemId: string;
}

/**
 * @category Methods
 * @group Event-MediaItems
 */
export const DeleteEventMediaItem = async ({
  eventId,
  mediaItemId,
  adminApiParams,
  queryClient,
}: DeleteEventMediaItemParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/media/${mediaItemId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEMS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_MEDIA_ITEM_QUERY_KEY(eventId, mediaItemId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-MediaItems
 */
export const useDeleteEventMediaItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventMediaItem>>,
      Omit<DeleteEventMediaItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventMediaItemParams,
    Awaited<ReturnType<typeof DeleteEventMediaItem>>
  >(DeleteEventMediaItem, options);
};
