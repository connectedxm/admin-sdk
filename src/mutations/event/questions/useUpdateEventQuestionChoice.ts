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
 * @param {string} eventId (path) - The id of the event
 * @param {string} questionId (path) - The id of the question
 * @param {string} choiceId (path) - The id of the choice
 * @param {EventQuestionChoiceUpdateInputs} choice (body) - The choice data to update
 * @version 1.3
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
}: UpdateEventQuestionChoiceParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
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