import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY,
  EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups-Translations
 */
export interface DeleteEventFollowupTranslationParams extends MutationParams {
  eventId: string;
  followupId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Followups-Translations
 */
export const DeleteEventFollowupTranslation = async ({
  eventId,
  followupId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFollowupTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/followups/${followupId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY(eventId, followupId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_TRANSLATION_QUERY_KEY(eventId, followupId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups-Translations
 */
export const useDeleteEventFollowupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFollowupTranslation>>,
      Omit<
        DeleteEventFollowupTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFollowupTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFollowupTranslation>>
  >(DeleteEventFollowupTranslation, options, {
    domain: "events",
    type: "update",
  });
};
