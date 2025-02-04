import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTrackTranslation } from "@src/interfaces";
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
export interface CreateEventTrackTranslationParams extends MutationParams {
  eventId: string;
  trackId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Tracks-Translations
 */
export const CreateEventTrackTranslation = async ({
  eventId,
  trackId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventTrackTranslationParams): Promise<
  ConnectedXMResponse<EventTrackTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventTrackTranslation>
  >(`/events/${eventId}/tracks/${trackId}/translations`, {
    locale,
    autoTranslate,
  });
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
export const useCreateEventTrackTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTrackTranslation>>,
      Omit<CreateEventTrackTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTrackTranslationParams,
    Awaited<ReturnType<typeof CreateEventTrackTranslation>>
  >(CreateEventTrackTranslation, options, {
    domain: "events",
    type: "update",
  });
};
