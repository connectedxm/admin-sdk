import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeTranslationUpdateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Translations
 */
export interface UpdateEventRoomTypeTranslationParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  locale: ISupportedLocale;
  roomTypeTranslation: EventRoomTypeTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations-Translations
 */
export const UpdateEventRoomTypeTranslation = async ({
  eventId,
  roomTypeId,
  roomTypeTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventRoomTypeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/roomTypes/${roomTypeId}/translations/${locale}`,
    roomTypeTranslation
  );
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
export const useUpdateEventRoomTypeTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRoomTypeTranslation>>,
      Omit<
        UpdateEventRoomTypeTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRoomTypeTranslationParams,
    Awaited<ReturnType<typeof UpdateEventRoomTypeTranslation>>
  >(UpdateEventRoomTypeTranslation, options, {
    domain: "events",
    type: "update",
  });
};
