import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTrackTranslationUpdateInputs } from "@src/params";
import {
  EVENT_TRACK_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TRACK_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation for a specific event track in a given locale.
 * This function allows for updating the translation details of an event track, identified by eventId and trackId, for a specified locale.
 * It is designed to be used in applications that manage multilingual event content.
 * @name UpdateEventTrackTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} trackId (path) The ID of the track
 * @param {ISupportedLocale} locale (path) The locale for the translation
 * @param {EventTrackTranslationUpdateInputs} trackTranslation (body) The translation details to update
 * @version 1.3
 **/

export interface UpdateEventTrackTranslationParams extends MutationParams {
  eventId: string;
  trackId: string;
  locale: ISupportedLocale;
  trackTranslation: EventTrackTranslationUpdateInputs;
}

export const UpdateEventTrackTranslation = async ({
  eventId,
  trackId,
  trackTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventTrackTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/tracks/${trackId}/translations/${locale}`,
    trackTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId),
    });
    SET_EVENT_TRACK_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, trackId, data.data?.locale],
      data
    );
  }
  return data;
};

export const useUpdateEventTrackTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTrackTranslation>>,
      Omit<UpdateEventTrackTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTrackTranslationParams,
    Awaited<ReturnType<typeof UpdateEventTrackTranslation>>
  >(UpdateEventTrackTranslation, options, {
    domain: "events",
    type: "update",
  });
};
