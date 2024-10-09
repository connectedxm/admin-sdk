import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionChoiceUpdateInputs } from "@src/params";
import {
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface UpdateEventQuestionChoiceParams extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  choice: EventQuestionChoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const UpdateEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceParams) => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`,
    {
      ...choice,
      id: undefined,
      questionId: undefined,
      question: undefined,
      subQuestions: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
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
export const useUpdateEventQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestionChoice>>,
      Omit<UpdateEventQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionChoiceParams,
    Awaited<ReturnType<typeof UpdateEventQuestionChoice>>
  >(UpdateEventQuestionChoice, options, {
    domain: "events",
    type: "update",
  });
};
