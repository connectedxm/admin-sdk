import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Questions
 */
export interface RemoveEventQuestionChoiceSubQuestionParams
  extends MutationParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

/**
 * @category Methods
 * @group Event-Questions
 */
export const RemoveEventQuestionChoiceSubQuestion = async ({
  eventId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: RemoveEventQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Questions
 */
export const useRemoveEventQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventQuestionChoiceSubQuestion>>,
      Omit<
        RemoveEventQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof RemoveEventQuestionChoiceSubQuestion>>
  >(RemoveEventQuestionChoiceSubQuestion, options, {
    domain: "events",
    type: "update",
  });
};
