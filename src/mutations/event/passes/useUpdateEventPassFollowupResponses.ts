import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Question } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY,
  EVENT_PASS_RESPONSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventPassFollowupResponsesParams extends MutationParams {
  eventId: string;
  passId: string;
  accountId: string;
  //TODO: missing interface and validation
  questions: Question[];
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const UpdateEventPassFollowupResponses = async ({
  eventId,
  accountId,
  passId,
  questions,
  adminApiParams,
  queryClient,
}: UpdateEventPassFollowupResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/attendees/${accountId}/passes/${passId}/followups`,
    { questions }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_RESPONSES_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
export const useUpdateEventPassFollowupResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassFollowupResponses>>,
      Omit<
        UpdateEventPassFollowupResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassFollowupResponsesParams,
    Awaited<ReturnType<typeof UpdateEventPassFollowupResponses>>
  >(UpdateEventPassFollowupResponses, options);
};
