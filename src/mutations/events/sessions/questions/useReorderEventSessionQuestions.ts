import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to reorder questions within a specific event session.
 * This function allows the reordering of questions in a given session of an event by specifying the new order of question IDs.
 * It is useful for managing the sequence of questions in event sessions, ensuring they are presented in the desired order.
 * @name ReorderEventSessionQuestions
 * @param {string} eventId (path) The id of the event
 * @param {string} sessionId (path) The id of the session
 * @param {string[]} questionIds (bodyValue) The ids of the questions to reorder
 * @version 1.3
 **/
export interface ReorderEventSessionQuestionsParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionIds: string[];
}

export const ReorderEventSessionQuestions = async ({
  eventId,
  sessionId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventSessionQuestionsParams): Promise<
  ConnectedXMResponse<EventSessionQuestion[]>
> => {
  if (!sessionId) throw new Error("Session ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<EventSessionQuestion[]>
  >(`/events/${eventId}/sessions/${sessionId}/questions/reorder`, {
    questionIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_SESSION_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, sessionId],
      data
    );
  }
  return data;
};

export const useReorderEventSessionQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSessionQuestions>>,
      Omit<ReorderEventSessionQuestionsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSessionQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventSessionQuestions>>
  >(ReorderEventSessionQuestions, options, {
    domain: "events",
    type: "update",
  });
};
