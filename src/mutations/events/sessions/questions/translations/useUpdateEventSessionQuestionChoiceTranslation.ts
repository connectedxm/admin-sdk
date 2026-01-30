import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionChoiceTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface UpdateEventSessionQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  locale: ISupportedLocale;
  choiceTranslation: EventSessionQuestionChoiceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
export const UpdateEventSessionQuestionChoiceTranslation = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  locale,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    choiceTranslation
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
    SET_EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, choiceId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group EventSession-Question-Translations
 */
export const useUpdateEventSessionQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestionChoiceTranslation>>,
      Omit<
        UpdateEventSessionQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestionChoiceTranslation>>
  >(UpdateEventSessionQuestionChoiceTranslation, options);
};
