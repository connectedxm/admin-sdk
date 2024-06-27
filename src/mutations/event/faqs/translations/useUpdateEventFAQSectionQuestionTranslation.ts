import { GetAdminAPI } from "@src/AdminAPI";
import { FaqTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface UpdateEventFAQSectionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  faqSectionQuestionTranslation: FaqTranslation;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const UpdateEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  faqSectionQuestionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventFAQSectionQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = faqSectionQuestionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`,
    body
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

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useUpdateEventFAQSectionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFAQSectionQuestionTranslation>>,
      Omit<
        UpdateEventFAQSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFAQSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventFAQSectionQuestionTranslation>>
  >(UpdateEventFAQSectionQuestionTranslation, options);
};
