import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUESTIONS_QUERY_KEY,
  EVENT_QUESTION_QUERY_KEY,
  EVENT_SECTION_QUESTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface DeleteEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  sectionId?: string;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const DeleteEventQuestion = async ({
  eventId,
  questionId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_QUESTION_QUERY_KEY(eventId, questionId),
    });
    if (sectionId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
      });
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Questions
 */
export const useDeleteEventQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestion>>,
      Omit<DeleteEventQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteEventQuestion, options, {
    domain: "events",
    type: "update",
  });
};
