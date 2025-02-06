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
 * Endpoint to delete a specific question from an event.
 * This function allows the removal of a question from an event, with an optional section parameter.
 * It is designed to be used in applications where event management and question handling are required.
 * @name DeleteEventQuestion
 * @param {string} eventId (path) - The id of the event
 * @param {string} questionId (path) - The id of the question
 * @version 1.3
 **/
export interface DeleteEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  sectionId?: string;
}

export const DeleteEventQuestion = async ({
  eventId,
  questionId,
  sectionId,
  adminApiParams,
  queryClient,
}: DeleteEventQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
