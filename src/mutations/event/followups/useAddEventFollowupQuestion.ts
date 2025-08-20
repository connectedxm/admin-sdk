import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface AddEventFollowupQuestionParams extends MutationParams {
  eventId: string;
  followupId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const AddEventFollowupQuestion = async ({
  eventId,
  followupId,
  questionId,
  adminApiParams,
  queryClient,
}: AddEventFollowupQuestionParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}/questions/${questionId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_QUESTIONS_QUERY_KEY(eventId, followupId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(queryClient, [eventId, followupId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useAddEventFollowupQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventFollowupQuestion>>,
      Omit<AddEventFollowupQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventFollowupQuestionParams,
    Awaited<ReturnType<typeof AddEventFollowupQuestion>>
  >(AddEventFollowupQuestion, options, {
    domain: "events",
    type: "update",
  });
};
