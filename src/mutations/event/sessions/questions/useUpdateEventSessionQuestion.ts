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
 * @category Params
 * @group Event-Sessions
 */
export interface UpdateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  question: EventSessionQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
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
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
