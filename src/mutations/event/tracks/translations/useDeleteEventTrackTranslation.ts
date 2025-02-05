import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRACK_TRANSLATIONS_QUERY_KEY,
  EVENT_TRACK_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for an event track by its event ID, track ID, and locale.
 * This function is used to remove a translation associated with a particular event track, 
 * and it ensures that the relevant cache is invalidated to maintain data consistency.
 * @name DeleteEventTrackTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} trackId - The ID of the track
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Tracks-Translations
 */
export interface DeleteEventTrackTranslationParams extends MutationParams {
  eventId: string;
  trackId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Tracks-Translations
 */
export const DeleteEventTrackTranslation = async ({
  eventId,
  trackId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventTrackTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/tracks/${trackId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_TRANSLATION_QUERY_KEY(eventId, trackId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tracks-Translations
 */
export const useDeleteEventTrackTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTrackTranslation>>,
      Omit<DeleteEventTrackTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTrackTranslationParams,
    Awaited<ReturnType<typeof DeleteEventTrackTranslation>>
  >(DeleteEventTrackTranslation, options, {
    domain: "events",
    type: "update",
  });
};