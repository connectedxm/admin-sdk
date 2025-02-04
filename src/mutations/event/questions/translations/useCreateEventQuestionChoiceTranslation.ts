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
