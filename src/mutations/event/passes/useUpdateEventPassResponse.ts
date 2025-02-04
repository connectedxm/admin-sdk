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
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventPassResponseParams extends MutationParams {
  eventId: string;
  passId: string;
  questionId: string;
  //TODO: missing interface and validation
  response: RegistrationQuestionResponse;
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
