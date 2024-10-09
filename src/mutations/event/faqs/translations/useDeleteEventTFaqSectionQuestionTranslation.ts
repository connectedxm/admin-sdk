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
 * @category Params
 * @group Event-Faqs-Translations
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
