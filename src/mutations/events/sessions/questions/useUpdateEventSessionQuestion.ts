import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_QUERY_DATA,
  SEARCHLIST_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  question: EventSessionQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Events
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
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestion>
  >(`/events/${eventId}/sessions/${sessionId}/questions/${questionId}`, {
    ...question,
    id: undefined,
    sessionId: undefined,
    choices: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    _count: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    });
    // Invalidate searchlist query if searchListId was updated
    if (typeof data.data.searchListId === "string") {
      queryClient.invalidateQueries({
        queryKey: SEARCHLIST_QUERY_KEY(data.data.searchListId),
      });
      // Also invalidate all searchlist values queries to ensure fresh data
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "SEARCHLIST_VALUES";
        },
      });
    }
    SET_EVENT_SESSION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId || data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
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
  >(UpdateEventSessionQuestion, options);
};
