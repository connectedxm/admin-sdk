import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPurchaseCreateInputs } from "@src/params";
import {
  EVENT_REGISTRATION_PURCHASES_QUERY_KEY,
  SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface CreateEventRegistrationPurchaseParams extends MutationParams {
  eventId: string;
  registrationId: string;
  purchase: EventPurchaseCreateInputs;
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const CreateEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchase,
  adminApiParams,
  queryClient,
}: CreateEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Purchase>>(
    `/events/${eventId}/registrations/${registrationId}/purchases`,
    purchase
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
    });
    SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA(
      queryClient,
      [eventId, registrationId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations-Purchases
 */
export const useCreateEventRegistrationPurchase = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRegistrationPurchase>>,
      Omit<
        CreateEventRegistrationPurchaseParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof CreateEventRegistrationPurchase>>
  >(CreateEventRegistrationPurchase, options);
};
