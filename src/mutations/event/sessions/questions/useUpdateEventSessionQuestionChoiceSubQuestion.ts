import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventSessionQuestionChoice,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionQuestionChoiceSubQuestion = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  subQuestionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestionChoice>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`,
    { sortOrder }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, choiceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestionChoiceSubQuestion>>,
      Omit<
        UpdateEventSessionQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestionChoiceSubQuestion>>
  >(UpdateEventSessionQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};
