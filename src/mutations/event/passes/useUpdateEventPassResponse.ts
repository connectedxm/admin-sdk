import { GetAdminAPI } from "@src/AdminAPI";
import {
  RegistrationQuestionResponse,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { UpdateEventPassResponseInputs } from "@src/params";
import {
  EVENT_PASS_RESPONSES_QUERY_KEY,
  SET_EVENT_PASS_RESPONSE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventPassResponseParams extends MutationParams {
  eventId: string;
  passId: string;
  questionId: string;
  response: UpdateEventPassResponseInputs;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const UpdateEventPassResponse = async ({
  eventId,
  passId,
  questionId,
  response,
  adminApiParams,
  queryClient,
}: UpdateEventPassResponseParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/passes/${passId}/responses/${questionId}`,
    response
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_RESPONSES_QUERY_KEY(eventId, passId),
    });
    SET_EVENT_PASS_RESPONSE_QUERY_DATA(
      queryClient,
      [eventId, passId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
export const useUpdateEventPassResponse = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassResponse>>,
      Omit<UpdateEventPassResponseParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassResponseParams,
    Awaited<ReturnType<typeof UpdateEventPassResponse>>
  >(UpdateEventPassResponse, options, {
    domain: "events",
    type: "update",
  });
};
