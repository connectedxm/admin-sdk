import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation of a FAQ section question for an event.
 * This function is used to remove a translation of a question within a FAQ section of an event, identified by event ID, section ID, question ID, and locale.
 * It is designed for applications that manage multilingual FAQ content for events.
 * @name DeleteEventFaqSectionQuestionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the FAQ section
 * @param {string} questionId (path) The ID of the question
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 */
export interface DeleteEventFaqSectionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const DeleteEventFaqSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sectionId,
        questionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(
        eventId,
        sectionId,
        questionId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useDeleteEventFaqSectionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSectionQuestionTranslation>>,
      Omit<
        DeleteEventFaqSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFaqSectionQuestionTranslation>>
  >(DeleteEventFaqSectionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
