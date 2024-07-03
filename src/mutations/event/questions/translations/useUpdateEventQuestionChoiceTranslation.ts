import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionChoiceTranslationUpdateInputs } from "@src/params";
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
  locale: ISupportedLocale;
  choiceTranslation: EventQuestionChoiceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const UpdateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    choiceTranslation
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
    ConnectedXMMutationOptions<
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
