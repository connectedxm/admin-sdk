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
  SEARCHLIST_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface UpdateEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  question: EventQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Questions
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
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
    // Invalidate searchlist query if searchListId was updated
    if (question.searchListId !== undefined) {
      queryClient.invalidateQueries({
        queryKey: SEARCHLIST_QUERY_KEY(question.searchListId),
      });
      // Also invalidate all searchlist values queries to ensure fresh data
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "SEARCHLIST_VALUES";
        },
      });
    }
    SET_EVENT_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, questionId || data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Questions
 */
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
