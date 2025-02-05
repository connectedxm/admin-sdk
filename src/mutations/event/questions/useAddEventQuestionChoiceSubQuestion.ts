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
  EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY,
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a sub-question to a specific choice of a question in an event.
 * This function allows the addition of a sub-question to a particular choice within a question for a given event.
 * It is useful in scenarios where dynamic question structures are needed, such as surveys or registration forms.
 * @name AddEventQuestionChoiceSubQuestion
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {string} choiceId - The id of the choice
 * @param {string} subQuestionId - The id of the sub-question
 * @version 1.2
**/
export interface AddEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

export const AddEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: AddEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationQuestionChoice>
  >(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, questionId, choiceId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(
        eventId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
  }
  return data;
};

export const useAddEventQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventQuestionChoiceSubQuestion>>,
      Omit<
        AddEventQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof AddEventQuestionChoiceSubQuestion>>
  >(AddEventQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};