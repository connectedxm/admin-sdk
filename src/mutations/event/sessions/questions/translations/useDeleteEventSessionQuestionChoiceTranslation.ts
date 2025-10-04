import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface DeleteEventSessionQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
export const DeleteEventSessionQuestionChoiceTranslation = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        eventId,
        sessionId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
        eventId,
        sessionId,
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
 * @group EventSession-Question-Translations
 */
export const useDeleteEventSessionQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionChoiceTranslation>>,
      Omit<
        DeleteEventSessionQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionChoiceTranslation>>
  >(DeleteEventSessionQuestionChoiceTranslation, options);
};
