import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for a question within an event session.
 * This function is used to remove a translation for a question in a specified event session and locale.
 * It ensures that the translation data is invalidated in the query cache upon successful deletion.
 * @name DeleteEventSessionQuestionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sessionId - The ID of the session
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Sessions-Translations
 */
export interface DeleteEventSessionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const DeleteEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATION_QUERY_KEY(eventId, sessionId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions-Translations
 */
export const useDeleteEventSessionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionTranslation>>,
      Omit<
        DeleteEventSessionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionTranslation>>
  >(DeleteEventSessionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};