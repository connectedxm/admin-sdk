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
import {
  EVENT_PASS_RESPONSES_QUERY_KEY,
  SET_EVENT_PASS_RESPONSE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the response for a specific event pass.
 * This function allows updating the response to a registration question for a given event pass.
 * It is used to modify the response data associated with a specific question in an event's pass.
 * @name UpdateEventPassResponse
 * @param {string} eventId - The id of the event
 * @param {string} passId - The id of the pass
 * @param {string} questionId - The id of the question
 * @param {RegistrationQuestionResponse} response - The response to the registration question
 * @version 1.2
 **/

export interface UpdateEventPassResponseParams extends MutationParams {
  eventId: string;
  passId: string;
  questionId: string;
  response: RegistrationQuestionResponse;
}

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
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/purchases/${passId}/responses/${questionId}`,
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
}

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