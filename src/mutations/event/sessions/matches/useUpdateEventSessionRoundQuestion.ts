import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RoundSessionQuestion } from "@src/interfaces";
import { RoundSessionQuestionUpdateInputs } from "@src/params";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionRoundQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  questionId: string;
  roundSessionQuestion: RoundSessionQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionRoundQuestion = async ({
  eventId,
  sessionId,
  roundId,
  questionId,
  roundSessionQuestion,
  adminApiParams,
}: UpdateEventSessionRoundQuestionParams): Promise<
  ConnectedXMResponse<RoundSessionQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions/${questionId}`,
    roundSessionQuestion
  );

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionRoundQuestion>>,
      Omit<
        UpdateEventSessionRoundQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionRoundQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSessionRoundQuestion>>
  >(UpdateEventSessionRoundQuestion, options, {
    domain: "events",
    type: "update",
  });
};
