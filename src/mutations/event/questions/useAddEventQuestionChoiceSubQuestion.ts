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
 * @category Params
 * @group Event-Questions
 */
export interface AddEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

/**
 * @category Methods
 * @group Event-Questions
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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

/**
 * @category Mutations
 * @group Event-Questions
 */
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
  >(AddEventQuestionChoiceSubQuestion, options);
};
