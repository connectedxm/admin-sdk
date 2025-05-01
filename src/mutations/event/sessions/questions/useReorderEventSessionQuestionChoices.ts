import { GetAdminAPI } from "@src/AdminAPI";
import {
  EventSessionQuestionChoice,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_QUESTION_CHOICES_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface ReorderEventSessionQuestionChoicesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choicesIds: string[];
}

/**
 * @category Methods
 * @group Events
 */
export const ReorderEventSessionQuestionChoices = async ({
  eventId,
  sessionId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderEventSessionQuestionChoicesParams): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestionChoice[]>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/reorder`,
    {
      choicesIds,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_SESSION_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [eventId, sessionId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useReorderEventSessionQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSessionQuestionChoices>>,
      Omit<
        ReorderEventSessionQuestionChoicesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSessionQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderEventSessionQuestionChoices>>
  >(ReorderEventSessionQuestionChoices, options, {
    domain: "events",
    type: "update",
  });
};
