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
  EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY,
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface AddEventSessionQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventSessionQuestionChoiceSubQuestion = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: AddEventSessionQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionQuestionChoice>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId, choiceId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(
        eventId,
        sessionId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
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
 * @group Events
 */
export const useAddEventSessionQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionQuestionChoiceSubQuestion>>,
      Omit<
        AddEventSessionQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof AddEventSessionQuestionChoiceSubQuestion>>
  >(AddEventSessionQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};
