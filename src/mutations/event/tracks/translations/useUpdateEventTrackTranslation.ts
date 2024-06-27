import { GetAdminAPI } from "@src/AdminAPI";
import { EventTrackTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
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
  trackTranslation: EventTrackTranslation;
}

/**
 * @category Methods
 * @group Event-Tracks-Translations
 */
export const UpdateEventTrackTranslation = async ({
  eventId,
  trackId,
  trackTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventTrackTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { locale, ...body } = trackTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/tracks/${trackId}/translations/${locale}`,
    body
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
  >(UpdateEventTrackTranslation, options);
};
