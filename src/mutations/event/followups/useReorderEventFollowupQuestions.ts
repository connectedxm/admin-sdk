import { GetAdminAPI } from "@src/AdminAPI";
import {
  RegistrationFollowupQuestion,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_FOLLOWUP_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface ReorderEventFollowupQuestionsParams extends MutationParams {
  eventId: string;
  followupId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const ReorderEventFollowupQuestions = async ({
  eventId,
  followupId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventFollowupQuestionsParams): Promise<
  ConnectedXMResponse<RegistrationFollowupQuestion[]>
> => {
  if (!followupId) throw new Error("Followup ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationFollowupQuestion[]>
  >(`/events/${eventId}/followups/${followupId}/questions/reorder`, {
    questionIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_FOLLOWUP_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, followupId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useReorderEventFollowupQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventFollowupQuestions>>,
      Omit<
        ReorderEventFollowupQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventFollowupQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventFollowupQuestions>>
  >(ReorderEventFollowupQuestions, options);
};
