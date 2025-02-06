import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_TRANSLATIONS_QUERY_KEY,
  EVENT_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation of an event question for a given locale.
 * This function is used to remove a translation entry for a question within an event, identified by event ID, question ID, and locale.
 * It ensures that the relevant cache is invalidated to maintain data consistency.
 * @name DeleteEventQuestionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} questionId (path) The ID of the question
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface DeleteEventQuestionTranslationParams extends MutationParams {
  eventId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const DeleteEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATION_QUERY_KEY(
        eventId,
        questionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useDeleteEventQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionTranslation>>,
      Omit<
        DeleteEventQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventQuestionTranslation>>
  >(DeleteEventQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
