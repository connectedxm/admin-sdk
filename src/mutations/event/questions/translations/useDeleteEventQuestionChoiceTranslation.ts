import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface DeleteEventQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const DeleteEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        eventId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
        eventId,
        questionId,
        choiceId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useDeleteEventQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionChoiceTranslation>>,
      Omit<
        DeleteEventQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof DeleteEventQuestionChoiceTranslation>>
  >(DeleteEventQuestionChoiceTranslation, options, {
    domain: "events",
    type: "update",
  });
};
