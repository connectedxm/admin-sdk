import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTIONS_QUERY_KEY,
  EVENT_SESSION_QUESTION_QUERY_KEY,
  EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  sectionId?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionQuestion = async ({
  eventId,
  sessionId,
  questionId,
  sectionId,
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
    if (sectionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY(
          eventId,
          sessionId,
          sectionId
        ),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
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
  return useConnectedMutation(DeleteEventSessionQuestion, options);
};
