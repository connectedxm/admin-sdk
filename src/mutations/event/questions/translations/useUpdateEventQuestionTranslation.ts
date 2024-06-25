import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationQuestionTranslation } from "@src/interfaces";
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
 * @category Params
 * @group Event-Question-Translations
 */
export interface UpdateEventQuestionTranslationParams extends MutationParams {
  eventId: string;
  questionId: string;
  questionTranslation: RegistrationQuestionTranslation;
}

/**
 * @category Methods
 * @group Event-Question-Translations
 */
export const UpdateEventQuestionTranslation = async ({
  eventId,
  questionId,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = questionTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`,
    body
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
export const useUpdateEventQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionTranslation>>,
      Omit<
        UpdateEventQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventQuestionTranslation>>
  >(UpdateEventQuestionTranslation, options);
};
