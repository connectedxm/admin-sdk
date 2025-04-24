import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionChoiceSubQuestion,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY,
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface ReorderEventSessionQuestionChoiceSubQuestionsParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Events
 */
export const ReorderEventSessionQuestionChoiceSubQuestions = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventSessionQuestionChoiceSubQuestionsParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoiceSubQuestion[]>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestionChoiceSubQuestion[]>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/subQuestions/reorder`,
    {
      questionIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY(
        eventId,
        sessionId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    SET_EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, choiceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useReorderEventSessionQuestionChoiceSubQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSessionQuestionChoiceSubQuestions>>,
      Omit<
        ReorderEventSessionQuestionChoiceSubQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSessionQuestionChoiceSubQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventSessionQuestionChoiceSubQuestions>>
  >(ReorderEventSessionQuestionChoiceSubQuestions, options, {
    domain: "events",
    type: "update",
  });
};
