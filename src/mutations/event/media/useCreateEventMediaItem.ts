import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventMediaItem } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventMediaItemCreateInputs } from "@src/params";
import { EVENT_MEDIA_ITEMS_QUERY_KEY } from "@src/queries/events/media/useGetEventMediaItems";
import { SET_EVENT_MEDIA_ITEM_QUERY_DATA } from "@src/queries/events/media/useGetEventMediaItem";

/**
 * @category Params
 * @group Event-MediaItems
 */
export interface CreateEventMediaItemParams extends MutationParams {
  eventId: string;
  mediaItem: EventMediaItemCreateInputs;
}

/**
 * @category Methods
 * @group Event-MediaItems
 */
export const CreateEventMediaItem = async ({
  eventId,
  mediaItem,
  adminApiParams,
  queryClient,
}: CreateEventMediaItemParams): Promise<
  ConnectedXMResponse<EventMediaItem>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventMediaItem>>(
    `/events/${eventId}/media`,
    mediaItem
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEMS_QUERY_KEY(eventId),
    });
    SET_EVENT_MEDIA_ITEM_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-MediaItems
 */
export const useCreateEventMediaItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventMediaItem>>,
      Omit<CreateEventMediaItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventMediaItemParams,
    Awaited<ReturnType<typeof CreateEventMediaItem>>
  >(CreateEventMediaItem, options);
};
