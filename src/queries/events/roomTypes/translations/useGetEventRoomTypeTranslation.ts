import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventRoomTypeTranslation } from "@src/interfaces";
import { EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY } from "./useGetEventRoomTypeTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation details for a specific event room type based on the provided event ID, room type ID, and locale.
 * This function is part of the event management system and is used to fetch localized translations for room types within events.
 * It is essential for applications that need to display event room type information in different languages.
 * @name GetEventRoomTypeTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} roomTypeId - The ID of the room type
 * @param {string} locale - The locale for the translation
 * @version 1.2
 **/

export const EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  roomTypeId: string,
  locale: string
) => [...EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY(eventId, roomTypeId), locale];

export const SET_EVENT_ROOM_TYPE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoomTypeTranslation>>
) => {
  client.setQueryData(
    EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRoomTypeTranslationProps extends SingleQueryParams {
  eventId: string;
  roomTypeId: string;
  locale: string;
}

export const GetEventRoomTypeTranslation = async ({
  eventId,
  roomTypeId,
  locale,
  adminApiParams,
}: GetEventRoomTypeTranslationProps): Promise<
  ConnectedXMResponse<EventRoomTypeTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/translations/${locale}`
  );
  return data;
};

export const useGetEventRoomTypeTranslation = (
  eventId: string = "",
  roomTypeId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRoomTypeTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRoomTypeTranslation>
  >(
    EVENT_ROOM_TYPE_TRANSLATION_QUERY_KEY(eventId, roomTypeId, locale),
    (params: SingleQueryParams) =>
      GetEventRoomTypeTranslation({
        eventId,
        roomTypeId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!roomTypeId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};