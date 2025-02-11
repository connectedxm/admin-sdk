import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventQuestionUpdateInputs } from "@src/params";
import {
  EVENT_QUESTIONS_QUERY_KEY,
  SET_EVENT_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an existing event question.
 * This function allows updating the details of a specific question associated with an event.
 * It is designed to be used in applications where event questions need to be modified.
 * @name UpdateEventQuestion
 * @param {string} eventId (path) The id of the event
 * @param {string} questionId (path) The id of the question
 * @param {EventQuestionUpdateInputs} question (body) The updated question inputs
 * @version 1.3
 **/
export interface UpdateEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  question: EventQuestionUpdateInputs;
}

export const UpdateEventQuestion = async ({
  eventId,
  questionId,
  question,
  adminApiParams,
  queryClient,
}: UpdateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/events/${eventId}/questions/${questionId}`, {
    ...question,
    id: undefined,
    eventId: undefined,
    choices: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    _count: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, questionId || data.data.id.toString()],
      data
    );
  }
  return data;
};

export const useUpdateEventQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestion>>,
      Omit<UpdateEventQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionParams,
    Awaited<ReturnType<typeof UpdateEventQuestion>>
  >(UpdateEventQuestion, options, {
    domain: "events",
    type: "update",
  });
};
