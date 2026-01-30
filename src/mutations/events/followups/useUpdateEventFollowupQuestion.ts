import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUPS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface UpdateEventFollowupQuestionParams extends MutationParams {
  eventId: string;
  followupId: string;
  questionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const UpdateEventFollowupQuestion = async ({
  eventId,
  followupId,
  questionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventFollowupQuestionParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}/questions/${questionId}`, {
    sortOrder,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUPS_QUERY_KEY(eventId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(queryClient, [eventId, followupId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useUpdateEventFollowupQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFollowupQuestion>>,
      Omit<UpdateEventFollowupQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFollowupQuestionParams,
    Awaited<ReturnType<typeof UpdateEventFollowupQuestion>>
  >(UpdateEventFollowupQuestion, options);
};
