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
export interface ImportRoomsParams extends MutationParams {
  eventId: string;
  roomNames: string[];
  roomTypeId?: string;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const ImportRooms = async ({
  eventId,
  roomNames,
  roomTypeId,
  adminApiParams,
  queryClient,
}: ImportRoomsParams): Promise<ConnectedXMResponse<Room[]>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Room[]>>(
    `/events/${eventId}/rooms/import`,
    { roomNames, ...(roomTypeId && { roomTypeId }) }
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
export const useImportRooms = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ImportRooms>>,
      Omit<ImportRoomsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ImportRoomsParams,
    Awaited<ReturnType<typeof ImportRooms>>
  >(ImportRooms, options);
};
