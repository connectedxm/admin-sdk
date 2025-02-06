import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionQuestionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific FAQ section question for an event.
 * This function allows for the modification of the translation details of a question within a FAQ section of an event,
 * identified by event ID, section ID, question ID, and locale. It is used to ensure that the FAQ section questions
 * are accurately translated and updated in the system.
 * @name UpdateEventFaqSectionQuestionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the FAQ section
 * @param {string} questionId (path) The ID of the question within the FAQ section
 * @param {ISupportedLocale} locale (path) The locale for the translation
 * @param {EventFaqSectionQuestionTranslationUpdateInputs} faqSectionQuestionTranslation (body) The translation inputs for the FAQ section question
 * @version 1.3
 */
export interface UpdateEventFaqSectionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: ISupportedLocale;
  faqSectionQuestionTranslation: EventFaqSectionQuestionTranslationUpdateInputs;
}

export const UpdateEventFaqSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  faqSectionQuestionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventFaqSectionQuestionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`,
    faqSectionQuestionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
        eventId,
        sectionId,
        questionId
      ),
    });
    SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, questionId, data.data?.locale],
      data
    );
  }
  return data;
};

export const useUpdateEventFaqSectionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFaqSectionQuestionTranslation>>,
      Omit<
        UpdateEventFaqSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFaqSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventFaqSectionQuestionTranslation>>
  >(UpdateEventFaqSectionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
