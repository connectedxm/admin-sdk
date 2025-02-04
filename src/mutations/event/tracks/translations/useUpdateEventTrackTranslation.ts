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
 * @category Params
 * @group Event-Tracks-Translations
 */
export interface UpdateEventTrackTranslationParams extends MutationParams {
  eventId: string;
  trackId: string;
  locale: ISupportedLocale;
  trackTranslation: EventTrackTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Tracks-Translations
 */
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

/**
 * @category Mutations
 * @group Event-Tracks-Translations
 */
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
