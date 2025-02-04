import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY,
  EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Translations
 */
export interface DeleteEventRoomTypeTranslationParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const DeleteEventRoomTypeTranslation = async ({
  eventId,
  roomTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventRoomTypeTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/roomTypes/${roomTypeId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY(eventId, roomTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY(
        eventId,
        roomTypeId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Translations
 */
export const useDeleteEventRoomTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRoomTypeTranslation>>,
      Omit<
        DeleteEventRoomTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRoomTypeTranslationParams,
    Awaited<ReturnType<typeof DeleteEventRoomTypeTranslation>>
  >(DeleteEventRoomTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};

export default useDeleteEventRoomTypeTranslation;
