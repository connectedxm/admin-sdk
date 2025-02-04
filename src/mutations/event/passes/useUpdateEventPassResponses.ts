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
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventPassResponsesParams extends MutationParams {
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

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
