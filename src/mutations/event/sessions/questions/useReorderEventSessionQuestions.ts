import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface ReorderEventSessionQuestionsParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Event-Sessions
 */
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

/**
 * @category Mutations
 * @group Event-Sessions
 */
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
