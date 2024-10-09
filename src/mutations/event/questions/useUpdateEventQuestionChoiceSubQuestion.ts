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
 * @category Params
 * @group Event-Questions
 */
export interface UpdateEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Event-Questions
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
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

/**
 * @category Mutations
 * @group Event-Questions
 */
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
