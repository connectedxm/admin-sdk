import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeCreateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPES_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface CreateEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomType: EventRoomTypeCreateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const CreateEventRoomType = async ({
  eventId,
  roomType,
  adminApiParams,
  queryClient,
}: CreateEventRoomTypeParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/roomTypes`,
    roomType
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useCreateEventRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRoomType>>,
      Omit<CreateEventRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRoomTypeParams,
    Awaited<ReturnType<typeof CreateEventRoomType>>
  >(CreateEventRoomType, options, {
    domain: "events",
    type: "update",
  });
};
