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
export interface UpdateEventPassSingleFollowupResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  accountId: string;
  followupId: string;
  questions: Question[];
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const UpdateEventPassSingleFollowupResponses = async ({
  eventId,
  accountId,
  passId,
  followupId,
  questions,
  adminApiParams,
  queryClient,
}: UpdateEventPassSingleFollowupResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/attendees/${accountId}/passes/${passId}/followups/${followupId}`,
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
export const useUpdateEventPassSingleFollowupResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassSingleFollowupResponses>>,
      Omit<
        UpdateEventPassSingleFollowupResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassSingleFollowupResponsesParams,
    Awaited<ReturnType<typeof UpdateEventPassSingleFollowupResponses>>
  >(UpdateEventPassSingleFollowupResponses, options, {
    domain: "events",
    type: "update",
  });
};
