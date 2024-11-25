import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_QUESTION_QUERY_KEY } from "@src/queries/events/sessions/questions/useGetEventSessionQuestion";
import { EVENT_SESSION_QUESTIONS_QUERY_KEY } from "@src/queries/events/sessions/questions/useGetEventSessionQuestions";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface DeleteEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const DeleteEventSessionQuestion = async ({
  eventId,
  sessionId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_QUESTION_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useDeleteEventSessionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestion>>,
      Omit<DeleteEventSessionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestion>>
  >(DeleteEventSessionQuestion, options, {
    domain: "events",
    type: "update",
  });
};
