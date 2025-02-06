import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTION_CHOICES_QUERY_KEY,
  EVENT_QUESTION_CHOICE_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific choice from a question in an event.
 * This function allows the removal of a choice associated with a question within a specified event.
 * It is useful in scenarios where event configurations need to be updated by removing certain choices.
 * @name DeleteEventQuestionChoice
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {string} choiceId (path) The id of the choice
 * @version 1.3
 **/

export interface DeleteEventQuestionChoiceParams extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const DeleteEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionChoiceParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
    });
  }
  return data;
};

export const useDeleteEventQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestionChoice>>,
      Omit<DeleteEventQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionChoiceParams,
    Awaited<ReturnType<typeof DeleteEventQuestionChoice>>
  >(DeleteEventQuestionChoice, options, {
    domain: "events",
    type: "update",
  });
};
