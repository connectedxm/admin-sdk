import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RoundEventQuestion } from "@src/interfaces";
import { RoundEventQuestionUpsertInputs } from "@src/params";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { EVENT_ROUND_QUESTIONS_QUERY_KEY } from "@src/queries/events/matches/useGetEventRoundQuestions";

/**
 * @category Params
 * @group Events
 */
export interface UpsertEventRoundQuestionParams extends MutationParams {
  eventId: string;
  roundId: string;
  questionId: string;
  roundEventQuestion: RoundEventQuestionUpsertInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpsertEventRoundQuestion = async ({
  eventId,
  roundId,
  questionId,
  roundEventQuestion,
  adminApiParams,
  queryClient,
}: UpsertEventRoundQuestionParams): Promise<
  ConnectedXMResponse<RoundEventQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/rounds/${roundId}/questions/${questionId}`,
    roundEventQuestion
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_QUESTIONS_QUERY_KEY(eventId, roundId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpsertEventRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpsertEventRoundQuestion>>,
      Omit<UpsertEventRoundQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpsertEventRoundQuestionParams,
    Awaited<ReturnType<typeof UpsertEventRoundQuestion>>
  >(UpsertEventRoundQuestion, options, {
    domain: "events",
    type: "update",
  });
};
