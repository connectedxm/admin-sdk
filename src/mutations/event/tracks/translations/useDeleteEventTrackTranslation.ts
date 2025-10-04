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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
  >(DeleteEventTrackTranslation, options);
};
