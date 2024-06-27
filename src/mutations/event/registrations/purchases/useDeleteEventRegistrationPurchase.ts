import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_PURCHASES_QUERY_KEY,
  EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface DeleteEventRegistrationPurchaseParams extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const DeleteEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  adminApiParams,
  queryClient,
}: DeleteEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Purchase>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );
  if (queryClient && data.status === "ok") {
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
export const useDeleteEventRegistrationPurchase = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRegistrationPurchase>>,
      Omit<
        DeleteEventRegistrationPurchaseParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof DeleteEventRegistrationPurchase>>
  >(DeleteEventRegistrationPurchase, options);
};
