import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event room type.
 * This function allows the creation of a translation for a room type within an event, supporting multiple locales and optional auto-translation.
 * It is designed to be used in applications that manage event reservations and require multilingual support for room types.
 * @name PostEventRoomTypeTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} roomTypeId - The ID of the room type
 * @param {string} locale - The locale for the translation
 * @param {boolean} [autoTranslate] - Whether to automatically translate the content
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Reservations-Translations
 */
export interface CreateEventRoomTypeTranslationParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const CreateEventRoomTypeTranslation = async ({
  eventId,
  roomTypeId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventRoomTypeTranslationParams): Promise<
  ConnectedXMResponse<EventRoomTypeTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventRoomTypeTranslation>
  >(`/events/${eventId}/roomTypes/${roomTypeId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY(eventId, roomTypeId),
    });
    SET_EVENT_ROOM_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, roomTypeId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Translations
 */
export const useCreateEventRoomTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRoomTypeTranslation>>,
      Omit<
        CreateEventRoomTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRoomTypeTranslationParams,
    Awaited<ReturnType<typeof CreateEventRoomTypeTranslation>>
  >(CreateEventRoomTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};