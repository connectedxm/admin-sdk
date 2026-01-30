import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFollowupTranslationUpdateInputs } from "@src/params";
import {
  EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups-Translations
 */
export interface UpdateEventFollowupTranslationParams extends MutationParams {
  eventId: string;
  followupId: string;
  locale: ISupportedLocale;
  followupTranslation: EventFollowupTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Followups-Translations
 */
export const UpdateEventFollowupTranslation = async ({
  eventId,
  followupId,
  followupTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventFollowupTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/followups/${followupId}/translations/${locale}`,
    followupTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY(eventId, followupId),
    });

    SET_EVENT_FOLLOWUP_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, followupId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups-Translations
 */
export const useUpdateEventFollowupTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFollowupTranslation>>,
      Omit<
        UpdateEventFollowupTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFollowupTranslationParams,
    Awaited<ReturnType<typeof UpdateEventFollowupTranslation>>
  >(UpdateEventFollowupTranslation, options);
};
