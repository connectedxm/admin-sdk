import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_PURCHASES_QUERY_KEY,
  EVENT_REGISTRATION_QUERY_KEY,
  EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface CancelEventRegistrationPurchaseTransferParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  transferId: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const CancelEventRegistrationPurchaseTransfer = async ({
  eventId,
  registrationId,
  purchaseId,
  transferId,
  adminApiParams,
  queryClient,
}: CancelEventRegistrationPurchaseTransferParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/transfers/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
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
 * @group Event-Registrations-Purchases
 */
export const useCancelEventRegistrationPurchaseTransfer = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelEventRegistrationPurchaseTransfer>>,
      Omit<
        CancelEventRegistrationPurchaseTransferParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventRegistrationPurchaseTransferParams,
    Awaited<ReturnType<typeof CancelEventRegistrationPurchaseTransfer>>
  >(CancelEventRegistrationPurchaseTransfer, options);
};
