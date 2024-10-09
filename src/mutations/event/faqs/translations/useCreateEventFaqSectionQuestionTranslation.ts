import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqTranslation } from "@src/interfaces";
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
export interface CreateEventFaqSectionQuestionTranslationParams
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
export const CreateEventFaqSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionQuestionTranslationParams): Promise<
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
export const useCreateEventFaqSectionQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFaqSectionQuestionTranslation>>,
      Omit<
        CreateEventFaqSectionQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFaqSectionQuestionTranslationParams,
    Awaited<ReturnType<typeof CreateEventFaqSectionQuestionTranslation>>
  >(CreateEventFaqSectionQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
