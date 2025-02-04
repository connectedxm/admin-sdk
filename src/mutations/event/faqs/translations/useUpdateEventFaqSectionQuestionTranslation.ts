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
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface UpdateEventFaqSectionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: ISupportedLocale;
  faqSectionQuestionTranslation: EventFaqSectionQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
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

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
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
