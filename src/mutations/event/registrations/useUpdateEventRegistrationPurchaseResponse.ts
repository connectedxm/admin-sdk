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
  EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY,
  SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface UpdateEventRegistrationPurchaseResponseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questionId: string;
  response: RegistrationQuestionResponse;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const UpdateEventRegistrationPurchaseResponse = async ({
  eventId,
  registrationId,
  purchaseId,
  questionId,
  response,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationPurchaseResponseParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses/${questionId}`,
    response
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
    SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_DATA(
      queryClient,
      [eventId, registrationId, purchaseId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useUpdateEventRegistrationPurchaseResponse = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationPurchaseResponse>>,
      Omit<
        UpdateEventRegistrationPurchaseResponseParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationPurchaseResponseParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationPurchaseResponse>>
  >(UpdateEventRegistrationPurchaseResponse, options);
};
