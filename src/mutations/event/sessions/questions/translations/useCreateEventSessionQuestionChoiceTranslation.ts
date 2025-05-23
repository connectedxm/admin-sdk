import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionChoiceTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group EventSession-Question-Translations
 */
export interface CreateEventSessionQuestionChoiceTranslationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group EventSession-Question-Translations
 */
export const CreateEventSessionQuestionChoiceTranslation = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionQuestionChoiceTranslationParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoiceTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
      [eventId, sessionId, questionId, choiceId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group EventSession-Question-Translations
 */
export const useCreateEventSessionQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionQuestionChoiceTranslation>>,
      Omit<
        CreateEventSessionQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionQuestionChoiceTranslation>>
  >(CreateEventSessionQuestionChoiceTranslation, options, {
    domain: "events",
    type: "update",
  });
};
