import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RoundSessionQuestion } from "@src/interfaces";
import { RoundSessionQuestionUpsertInputs } from "@src/params";
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
export interface UpsertEventSessionRoundQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  questionId: string;
  roundSessionQuestion: RoundSessionQuestionUpsertInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpsertEventSessionRoundQuestion = async ({
  eventId,
  sessionId,
  roundId,
  questionId,
  roundSessionQuestion,
  adminApiParams,
  queryClient,
}: UpsertEventSessionRoundQuestionParams): Promise<
  ConnectedXMResponse<RoundSessionQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions/${questionId}`,
    roundSessionQuestion
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
export const useUpsertEventSessionRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpsertEventSessionRoundQuestion>>,
      Omit<
        UpsertEventSessionRoundQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpsertEventSessionRoundQuestionParams,
    Awaited<ReturnType<typeof UpsertEventSessionRoundQuestion>>
  >(UpsertEventSessionRoundQuestion, options, {
    domain: "events",
    type: "update",
  });
};
