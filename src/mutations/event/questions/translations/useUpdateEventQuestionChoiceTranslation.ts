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
 * Updates the translation for a specific event question choice.
 * This function allows updating the translation of a choice within a question for a given event, identified by event ID, question ID, and choice ID.
 * It is designed to be used in applications where multilingual support for event questions is required.
 * @name PutEventQuestionChoiceTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} questionId - The ID of the question
 * @param {string} choiceId - The ID of the choice
 * @param {ISupportedLocale} locale - The locale for the translation
 * @param {EventQuestionChoiceTranslationUpdateInputs} choiceTranslation - The translation inputs for the choice
 * @version 1.2
 **/

export interface UpdateEventQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: ISupportedLocale;
  choiceTranslation: EventQuestionChoiceTranslationUpdateInputs;
}

export const UpdateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
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
  >(UpdateEventQuestionChoiceTranslation, options, {
    domain: "events",
    type: "update",
  });
};