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
 * Endpoint to update a specific choice for a question in an event.
 * This function allows updating the details of a choice associated with a question in a specific event.
 * It is designed to be used in applications where event management and question customization are required.
 * @name UpdateEventQuestionChoice
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {string} choiceId - The id of the choice
 * @param {EventQuestionChoiceUpdateInputs} choice - The choice data to update
 * @version 1.2
 **/
export interface UpdateEventQuestionChoiceParams extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  choice: EventQuestionChoiceUpdateInputs;
}

export const UpdateEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionChoiceParams) => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
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