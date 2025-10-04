import { GetAdminAPI } from "@src/AdminAPI";
import {
  RegistrationQuestionChoice,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_QUESTION_CHOICES_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface ReorderEventQuestionChoicesParams extends MutationParams {
  eventId: string;
  questionId: string;
  choicesIds: string[];
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const ReorderEventQuestionChoices = async ({
  eventId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderEventQuestionChoicesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationQuestionChoice[]>
  >(`/events/${eventId}/questions/${questionId}/choices/reorder`, {
    choicesIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [eventId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useReorderEventQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventQuestionChoices>>,
      Omit<ReorderEventQuestionChoicesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderEventQuestionChoices>>
  >(ReorderEventQuestionChoices, options);
};
