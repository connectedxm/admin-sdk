import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY,
  EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionQuestionChoiceParams extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionQuestionChoice = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionQuestionChoiceParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY(
        eventId,
        sessionId,
        questionId,
        choiceId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionQuestionChoice>>,
      Omit<
        DeleteEventSessionQuestionChoiceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionQuestionChoiceParams,
    Awaited<ReturnType<typeof DeleteEventSessionQuestionChoice>>
  >(DeleteEventSessionQuestionChoice, options);
};
