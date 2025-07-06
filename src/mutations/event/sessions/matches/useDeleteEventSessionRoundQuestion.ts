import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY } from "@src/queries/events/sessions/matches/useGetEventSessionRoundQuestions";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionRoundQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSessionRoundQuestion = async ({
  eventId,
  sessionId,
  roundId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionRoundQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY(
        eventId,
        sessionId,
        roundId
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSessionRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionRoundQuestion>>,
      Omit<
        DeleteEventSessionRoundQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionRoundQuestionParams,
    Awaited<ReturnType<typeof DeleteEventSessionRoundQuestion>>
  >(DeleteEventSessionRoundQuestion, options, {
    domain: "events",
    type: "update",
  });
};
