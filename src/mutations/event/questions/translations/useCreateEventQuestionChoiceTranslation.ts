import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionChoiceTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event question choice.
 * This function allows the creation of a translation for a given choice within an event question, supporting multiple locales.
 * It is designed to be used in applications where multilingual support for event questions is required.
 * @name CreateEventQuestionChoiceTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} questionId - The ID of the question
 * @param {string} choiceId - The ID of the choice
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the choice
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface CreateEventQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const CreateEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventQuestionChoiceTranslationParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
      [eventId, questionId, choiceId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useCreateEventQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestionChoiceTranslation>>,
      Omit<
        CreateEventQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof CreateEventQuestionChoiceTranslation>>
  >(CreateEventQuestionChoiceTranslation, options, {
    domain: "events",
    type: "update",
  });
};