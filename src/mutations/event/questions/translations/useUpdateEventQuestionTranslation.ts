import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific event question for a given locale.
 * This function allows for the modification of question translations within an event, supporting multilingual capabilities.
 * It is designed to be used in applications where event content needs to be localized.
 * @name UpdateEventQuestionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} questionId (path) - The ID of the question
 * @param {ISupportedLocale} locale (path) - The locale for the translation
 * @param {EventQuestionTranslationUpdateInputs} questionTranslation (body) - The translation inputs for the question
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface UpdateEventQuestionTranslationParams extends MutationParams {
  eventId: string;
  questionId: string;
  locale: ISupportedLocale;
  questionTranslation: EventQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const UpdateEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`,
    questionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, questionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useUpdateEventQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionTranslation>>,
      Omit<
        UpdateEventQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventQuestionTranslation>>
  >(UpdateEventQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};