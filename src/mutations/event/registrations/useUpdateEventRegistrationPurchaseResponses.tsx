import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Question } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface UpdateEventRegistrationPurchaseResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questions: Question[];
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const UpdateEventRegistrationPurchaseResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  questions,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationPurchaseResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses`,
    { questions }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useUpdateEventRegistrationPurchaseResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationPurchaseResponses>>,
      Omit<
        UpdateEventRegistrationPurchaseResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationPurchaseResponsesParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationPurchaseResponses>>
  >(UpdateEventRegistrationPurchaseResponses, options);
};
