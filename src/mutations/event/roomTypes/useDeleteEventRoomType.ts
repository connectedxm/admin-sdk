import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPES_QUERY_KEY,
  EVENT_ROOM_TYPE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface DeleteEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const DeleteEventRoomType = async ({
  eventId,
  roomTypeId,
  adminApiParams,
  queryClient,
}: DeleteEventRoomTypeParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/roomTypes/${roomTypeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useDeleteEventRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRoomType>>,
      Omit<DeleteEventRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRoomTypeParams,
    Awaited<ReturnType<typeof DeleteEventRoomType>>
  >(DeleteEventRoomType, options, {
    domain: "events",
    type: "update",
  });
};
