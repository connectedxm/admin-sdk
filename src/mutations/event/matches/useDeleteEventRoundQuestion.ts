import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export interface DeleteEventRoundQuestionParams extends MutationParams {
  eventId: string;
  roundId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventRoundQuestion = async ({
  eventId,
  roundId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventRoundQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/rounds/${roundId}/questions/${questionId}`
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
export const useDeleteEventRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRoundQuestion>>,
      Omit<DeleteEventRoundQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRoundQuestionParams,
    Awaited<ReturnType<typeof DeleteEventRoundQuestion>>
  >(DeleteEventRoundQuestion, options, {
    domain: "events",
    type: "update",
  });
};
