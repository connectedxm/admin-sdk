import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_PURCHASES_QUERY_KEY,
  EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface TransferEventRegistrationPurchaseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const TransferEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  accountId,
  adminApiParams,
  queryClient,
}: TransferEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/transfers`,
    { accountId }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
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
export const useTransferEventRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof TransferEventRegistrationPurchase>>,
      Omit<
        TransferEventRegistrationPurchaseParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof TransferEventRegistrationPurchase>>
  >(TransferEventRegistrationPurchase, options);
};
