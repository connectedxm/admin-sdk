import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestionChoiceUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionQuestionChoiceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  choice: EventSessionQuestionChoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionQuestionChoice = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateEventSessionQuestionChoiceParams) => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}`,
    {
      ...choice,
      id: undefined,
      questionId: undefined,
      question: undefined,
      subQuestions: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
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
export const useUpdateEventSessionQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionQuestionChoice>>,
      Omit<
        UpdateEventSessionQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionQuestionChoiceParams,
    Awaited<ReturnType<typeof UpdateEventSessionQuestionChoice>>
  >(UpdateEventSessionQuestionChoice, options, {
    domain: "events",
    type: "update",
  });
};
