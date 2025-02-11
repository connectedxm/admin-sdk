import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionChoiceSubQuestion,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICE_QUERY_KEY,
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to reorder sub-questions of a specific choice in an event question.
 * This function allows the reordering of sub-questions associated with a particular choice within an event question.
 * It is designed to be used in scenarios where the order of sub-questions needs to be updated for a specific choice.
 * @name ReorderEventQuestionChoiceSubQuestions
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {string} choiceId (path) The id of the choice
 * @param {number[]} questionIds (bodyValue) The array of question ids to reorder
 * @version 1.3
 **/
export interface ReorderEventQuestionChoiceSubQuestionsParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  questionIds: number[];
}

export const ReorderEventQuestionChoiceSubQuestions = async ({
  eventId,
  questionId,
  choiceId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventQuestionChoiceSubQuestionsParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceSubQuestion[]>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  if (!choiceId) throw new Error("Choice ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationQuestionChoiceSubQuestion[]>
  >(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/reorder`,
    {
      questionIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, questionId, choiceId],
      data
    );
  }
  return data;
};

export const useReorderEventQuestionChoiceSubQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventQuestionChoiceSubQuestions>>,
      Omit<
        ReorderEventQuestionChoiceSubQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventQuestionChoiceSubQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventQuestionChoiceSubQuestions>>
  >(ReorderEventQuestionChoiceSubQuestions, options, {
    domain: "events",
    type: "update",
  });
};
