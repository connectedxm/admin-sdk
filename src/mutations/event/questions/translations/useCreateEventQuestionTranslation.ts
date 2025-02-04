import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event question.
 * This function allows for the addition of a translation to a question within an event, supporting multiple locales and optional auto-translation.
 * It is designed to be used in applications where multilingual support for event questions is required.
 * @name PostEventQuestionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} questionId - The ID of the question
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the question
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Question-Translations
 */
export interface CreateEventQuestionTranslationParams extends MutationParams {
  eventId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const CreateEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventQuestionTranslationParams): Promise<
  ConnectedXMResponse<RegistrationQuestionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post(
    `/events/${eventId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, questionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Question-Translations
 */
export const useCreateEventQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestionTranslation>>,
      Omit<
        CreateEventQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionTranslationParams,
    Awaited<ReturnType<typeof CreateEventQuestionTranslation>>
  >(CreateEventQuestionTranslation, options, {
    domain: "events",
    type: "update",
  });
};