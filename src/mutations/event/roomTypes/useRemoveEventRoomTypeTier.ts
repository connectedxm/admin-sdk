import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPE_TIERS_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface RemoveEventRoomTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  roomTypeId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const RemoveEventRoomTypeTier = async ({
  allowed,
  eventId,
  roomTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventRoomTypeTierParams): Promise<
  ConnectedXMResponse<EventRoomType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/roomTypes/${roomTypeId}/tiers/${tierId}`,
    {
      params: {
        allowed,
      },
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_TIERS_QUERY_KEY(allowed, eventId, roomTypeId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(queryClient, [eventId, roomTypeId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useRemoveEventRoomTypeTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventRoomTypeTier>>,
      Omit<RemoveEventRoomTypeTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventRoomTypeTierParams,
    Awaited<ReturnType<typeof RemoveEventRoomTypeTier>>
  >(RemoveEventRoomTypeTier, options, {
    domain: "events",
    type: "update",
  });
};
