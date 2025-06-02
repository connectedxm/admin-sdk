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
export interface AddEventMediaItemPassTypeParams extends MutationParams {
  eventId: string;
  mediaItemId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-MediaItems
 */
export const AddEventMediaItemPassType = async ({
  eventId,
  mediaItemId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventMediaItemPassTypeParams): Promise<
  ConnectedXMResponse<EventMediaItem>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventMediaItem>>(
    `/events/${eventId}/media/${mediaItemId}/passTypes/${passTypeId}`
  );

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
export const useAddEventMediaItemPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventMediaItemPassType>>,
      Omit<AddEventMediaItemPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventMediaItemPassTypeParams,
    Awaited<ReturnType<typeof AddEventMediaItemPassType>>
  >(AddEventMediaItemPassType, options, {
    domain: "events",
    type: "update",
  });
};
