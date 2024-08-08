import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Purchases
 */
export interface SelectEventRegistrationPurchaseReservationParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  locationId: string;
  reservation: {
    reservationStart?: string;
    reservationEnd?: string;
  };
}

/**
 * @category Methods
 * @group Event-Registrations-Purchases
 */
export const SelectEventRegistrationPurchaseReservation = async ({
  eventId,
  registrationId,
  purchaseId,
  locationId,
  reservation,
  adminApiParams,
  queryClient,
}: SelectEventRegistrationPurchaseReservationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Registration>>(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/reservations/${locationId}`,
    reservation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
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
export const useSelectEventRegistrationPurchaseReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SelectEventRegistrationPurchaseReservation>>,
      Omit<
        SelectEventRegistrationPurchaseReservationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectEventRegistrationPurchaseReservationParams,
    Awaited<ReturnType<typeof SelectEventRegistrationPurchaseReservation>>
  >(SelectEventRegistrationPurchaseReservation, options);
};
