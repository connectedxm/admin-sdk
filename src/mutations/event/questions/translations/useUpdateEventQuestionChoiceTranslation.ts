import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationQuestionChoiceTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface UpdateEventQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  choiceTranslation: RegistrationQuestionChoiceTranslation;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const UpdateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = choiceTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    body
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        eventId,
        questionId,
        choiceId
      ),
    });
    SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, questionId, choiceId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useUpdateEventQuestionChoiceTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionChoiceTranslation>>,
      Omit<
        UpdateEventQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof UpdateEventQuestionChoiceTranslation>>
  >(UpdateEventQuestionChoiceTranslation, options);
};
