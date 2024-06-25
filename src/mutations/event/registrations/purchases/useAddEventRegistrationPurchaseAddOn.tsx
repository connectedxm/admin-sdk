import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY,
  SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface AddEventRegistrationPurchaseAddOnParams
  extends MutationParams {
  addOnId: string;
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const AddEventRegistrationPurchaseAddOn = async ({
  addOnId,
  eventId,
  registrationId,
  purchaseId,
  adminApiParams,
  queryClient,
}: AddEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Purchase>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/addOns/${addOnId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
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
export const useAddEventRegistrationPurchaseAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventRegistrationPurchaseAddOn>>,
      Omit<
        AddEventRegistrationPurchaseAddOnParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventRegistrationPurchaseAddOnParams,
    Awaited<ReturnType<typeof AddEventRegistrationPurchaseAddOn>>
  >(AddEventRegistrationPurchaseAddOn, options);
};
