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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
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
  >(CreateEventRoomTypeTranslation, options);
};
