import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Question } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY,
  EVENT_PASS_RESPONSES_QUERY_KEY,
} from "@src/queries";

/**
 * Updates the responses for a specific event pass and invalidates relevant queries.
 * This function is used to modify the responses associated with a particular event pass,
 * ensuring that any cached queries related to the event pass responses and question sections
 * are invalidated to reflect the updated data.
 * @name UpdateEventPassResponses
 * @param {string} eventId (path) The id of the event
 * @param {string} passId (path) The id of the pass
 * @param {string} accountId (path) The id of the account
 * @param {Question[]} questions (bodyValue) The list of questions to update
 * @version 1.3
 **/
export interface UpdateEventPassResponsesParams extends MutationParams {
  eventId: string;
  passId: string;
  accountId: string;
  questions: Question[];
}

export const UpdateEventPassResponses = async ({
  eventId,
  accountId,
  passId,
  questions,
  adminApiParams,
  queryClient,
}: UpdateEventPassResponsesParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/attendees/${accountId}/passes/${passId}/responses`,
    { questions }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_RESPONSES_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUESTION_SECTIONS_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

export const useUpdateEventPassResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassResponses>>,
      Omit<UpdateEventPassResponsesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassResponsesParams,
    Awaited<ReturnType<typeof UpdateEventPassResponses>>
  >(UpdateEventPassResponses, options, {
    domain: "events",
    type: "update",
  });
};
