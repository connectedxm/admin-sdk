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
export interface RemoveEventReservationSectionTierParams
  extends MutationParams {
  allowed: boolean;
  eventId: string;
  reservationSectionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const RemoveEventReservationSectionTier = async ({
  allowed,
  eventId,
  reservationSectionId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventReservationSectionTierParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tiers/${tierId}`,
    {
      params: {
        allowed,
      },
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
export const useRemoveEventReservationSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventReservationSectionTier>>,
      Omit<
        RemoveEventReservationSectionTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventReservationSectionTierParams,
    Awaited<ReturnType<typeof RemoveEventReservationSectionTier>>
  >(RemoveEventReservationSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
