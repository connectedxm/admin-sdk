import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface DeleteEventFAQSectionQuestionTranslationParams
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
export const DeleteEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFAQSectionQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
export const useDeleteEventFAQSectionQuestionTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventFAQSectionQuestionTranslation>>,
      Omit<
        DeleteEventFAQSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFAQSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFAQSectionQuestionTranslation>>
  >(DeleteEventFAQSectionQuestionTranslation, options);
};
