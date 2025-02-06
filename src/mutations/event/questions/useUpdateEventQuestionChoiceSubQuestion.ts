import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationQuestionChoice,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update a sub-question for a specific choice in an event question.
 * This function allows updating the sort order of a sub-question associated with a choice in an event question.
 * It is designed to be used in scenarios where the order of sub-questions needs to be modified for better organization or presentation.
 * @name UpdateEventQuestionChoiceSubQuestion
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {string} choiceId (path) The id of the choice
 * @param {string} subQuestionId (path) The id of the sub-question
 * @param {number} sortOrder (bodyValue) The sort order of the sub-question
 * @version 1.3
 **/
export interface UpdateEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
  sortOrder: number;
}

export const UpdateEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationQuestionChoice>
  >(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`,
    { sortOrder }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
    SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, questionId, choiceId],
      data
    );
  }
  return data;
};

export const useUpdateEventQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionChoiceSubQuestion>>,
      Omit<
        UpdateEventQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof UpdateEventQuestionChoiceSubQuestion>>
  >(UpdateEventQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};
