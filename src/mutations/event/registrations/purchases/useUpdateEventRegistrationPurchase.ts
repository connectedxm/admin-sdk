import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPurchaseUpdateParams } from "@src/params";
import {
  EVENT_REGISTRATION_PURCHASES_QUERY_KEY,
  SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface UpdateEventRegistrationPurchaseParams extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  purchase: EventPurchaseUpdateParams;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const UpdateEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  purchase,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Purchase>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`,
    purchase
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
    });

    SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA(
      queryClient,
      [eventId, registrationId, purchaseId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations-Purchases
 */
export const useUpdateEventRegistrationPurchase = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationPurchase>>,
      Omit<
        UpdateEventRegistrationPurchaseParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationPurchase>>
  >(UpdateEventRegistrationPurchase, options);
};
