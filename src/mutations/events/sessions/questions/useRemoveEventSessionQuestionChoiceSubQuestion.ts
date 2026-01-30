import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventSessionQuestionChoiceSubQuestionParams
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
export const RemoveEventSessionQuestionChoiceSubQuestion = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
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
export const useRemoveEventSessionQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionQuestionChoiceSubQuestion>>,
      Omit<
        RemoveEventSessionQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof RemoveEventSessionQuestionChoiceSubQuestion>>
  >(RemoveEventSessionQuestionChoiceSubQuestion, options);
};
