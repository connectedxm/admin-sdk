import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqTranslation } from "@src/interfaces";
import {
  MutationOptions,
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
export interface CreateEventFAQSectionQuestionTranslationParams
  extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const CreateEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventFAQSectionQuestionTranslationParams): Promise<
  ConnectedXMResponse<FaqTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<FaqTranslation>>(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
export const useCreateEventFAQSectionQuestionTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventFAQSectionQuestionTranslation>>,
      Omit<
        CreateEventFAQSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFAQSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof CreateEventFAQSectionQuestionTranslation>>
  >(CreateEventFAQSectionQuestionTranslation, options);
};
