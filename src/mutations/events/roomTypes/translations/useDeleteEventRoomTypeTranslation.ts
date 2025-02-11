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
 * Deletes a specific translation for an event room type.
 * This function is used to remove a translation associated with a particular room type within an event, identified by event ID, room type ID, and locale.
 * It is designed for applications managing multilingual event room type data, ensuring that outdated or incorrect translations can be efficiently removed.
 * @name DeleteEventRoomTypeTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} roomTypeId (path) The ID of the room type
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

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
