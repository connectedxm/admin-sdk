import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RoundEventQuestion } from "@src/interfaces";
import { RoundEventQuestionUpdataInputs } from "@src/params";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventRoundQuestionParams extends MutationParams {
  eventId: string;
  roundId: string;
  questionId: string;
  roundEventQuestion: RoundEventQuestionUpdataInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventRoundQuestion = async ({
  eventId,
  roundId,
  questionId,
  roundEventQuestion,
  adminApiParams,
}: UpdateEventRoundQuestionParams): Promise<
  ConnectedXMResponse<RoundEventQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/rounds/${roundId}/questions/${questionId}`,
    roundEventQuestion
  );

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventRoundQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRoundQuestion>>,
      Omit<UpdateEventRoundQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRoundQuestionParams,
    Awaited<ReturnType<typeof UpdateEventRoundQuestion>>
  >(UpdateEventRoundQuestion, options);
};
