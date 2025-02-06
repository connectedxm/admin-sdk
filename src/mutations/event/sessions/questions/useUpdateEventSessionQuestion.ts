import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionUpdateInputs } from "@src/params";
import { SET_EVENT_SESSION_QUESTION_QUERY_DATA } from "@src/queries/events/sessions/questions/useGetEventSessionQuestion";
import { EVENT_SESSION_QUESTIONS_QUERY_KEY } from "@src/queries/events/sessions/questions/useGetEventSessionQuestions";

/**
 * Endpoint to update a specific question in an event session.
 * This function allows updating the details of a question within a specific event session.
 * It is designed to be used in applications where event session questions need to be modified.
 * @name UpdateEventSessionQuestion
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {string} questionId (path) - The id of the question
 * @param {EventSessionQuestionUpdateInputs} question (body) - The question update inputs
 * @version 1.3
 **/
export interface UpdateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  question: EventSessionQuestionUpdateInputs;
}

export const UpdateEventSessionQuestion = async ({
  eventId,
  sessionId,
  questionId,
  question,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  if (!sessionId) throw new Error("Session ID Undefined");
  if (!questionId) throw new Error("Question ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<EventSessionQuestion>
  >(`/events/${eventId}/sessions/${sessionId}/questions/${questionId}`, {
    ...question,
    id: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId || data.data?.id],
      data
    );
  }
  return data;
}

export const useUpdateEventSessionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestion>>,
      Omit<UpdateEventSessionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestion>>
  >(UpdateEventSessionQuestion, options, {
    domain: "events",
    type: "update",
  });
};