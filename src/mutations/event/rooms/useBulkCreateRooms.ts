import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Room } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOMS_QUERY_KEY,
  EVENT_ROOM_TYPE_ROOMS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Rooms
 */
export interface BulkCreateRoomsParams extends MutationParams {
  eventId: string;
  roomIds: string[];
  roomTypeId?: string;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const BulkCreateRooms = async ({
  eventId,
  roomIds,
  roomTypeId,
  adminApiParams,
  queryClient,
}: BulkCreateRoomsParams): Promise<ConnectedXMResponse<Room[]>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Room[]>>(
    `/events/${eventId}/rooms/bulk`,
    { roomIds, ...(roomTypeId && { roomTypeId }) }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOMS_QUERY_KEY(eventId),
    });
    if (roomTypeId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ROOM_TYPE_ROOMS_QUERY_KEY(eventId, roomTypeId),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Rooms
 */
export const useBulkCreateRooms = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof BulkCreateRooms>>,
      Omit<BulkCreateRoomsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BulkCreateRoomsParams,
    Awaited<ReturnType<typeof BulkCreateRooms>>
  >(BulkCreateRooms, options);
};
