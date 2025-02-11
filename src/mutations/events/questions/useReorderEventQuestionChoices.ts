import { GetAdminAPI } from "@src/AdminAPI";
import {
  RegistrationQuestionChoice,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_CHOICES_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to reorder the choices of a specific question in an event.
 * This function allows the reordering of choices associated with a particular question within an event.
 * It is designed to be used in scenarios where the order of question choices needs to be updated.
 * @name ReorderEventQuestionChoices
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {number[]} choicesIds (bodyValue) The ids of the choices to reorder
 * @version 1.3
 **/

export interface ReorderEventQuestionChoicesParams extends MutationParams {
  eventId: string;
  questionId: string;
  choicesIds: number[];
}

export const ReorderEventQuestionChoices = async ({
  eventId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderEventQuestionChoicesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationQuestionChoice[]>
  >(`/events/${eventId}/questions/${questionId}/choices/reorder`, {
    choicesIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [eventId, questionId],
      data
    );
  }
  return data;
};

export const useReorderEventQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventQuestionChoices>>,
      Omit<ReorderEventQuestionChoicesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderEventQuestionChoices>>
  >(ReorderEventQuestionChoices, options, {
    domain: "events",
    type: "update",
  });
};
