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
 * @category Params
 * @group Event-Questions
 */
export interface ReorderEventQuestionChoiceSubQuestionsParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Event-Questions
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
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

/**
 * @category Mutations
 * @group Event-Questions
 */
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
  >(ReorderEventQuestionChoiceSubQuestions, options);
};
