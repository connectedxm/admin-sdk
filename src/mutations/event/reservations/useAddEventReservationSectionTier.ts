import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface AddEventReservationSectionTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  reservationSectionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const AddEventReservationSectionTier = async ({
  allowed,
  eventId,
  reservationSectionId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventReservationSectionTierParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tiers/${tierId}`,
    {
      allowed,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_TIERS_QUERY_KEY(
        allowed,
        eventId,
        reservationSectionId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useAddEventReservationSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventReservationSectionTier>>,
      Omit<
        AddEventReservationSectionTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventReservationSectionTierParams,
    Awaited<ReturnType<typeof AddEventReservationSectionTier>>
  >(AddEventReservationSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
