import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a sub-question from a specific choice within an event question.
 * This function allows the removal of a sub-question associated with a choice in an event's question,
 * facilitating the management of event question structures by dynamically updating the choices.
 * @name RemoveEventQuestionChoiceSubQuestion
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {string} choiceId (path) The id of the choice
 * @param {string} subQuestionId (path) The id of the sub-question
 * @version 1.3
 **/
export interface RemoveEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

export const RemoveEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: RemoveEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
  }

  return data;
};

export const useRemoveEventQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventQuestionChoiceSubQuestion>>,
      Omit<
        RemoveEventQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof RemoveEventQuestionChoiceSubQuestion>>
  >(RemoveEventQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};
