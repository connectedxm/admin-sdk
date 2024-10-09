import { GetAdminAPI } from "@src/AdminAPI";
import { EventReservationSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventReservationSectionUpdateInputs } from "@src/params";
import {
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface UpdateEventReservationSectionParams extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  reservationSection: EventReservationSectionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const UpdateEventReservationSection = async ({
  eventId,
  reservationSectionId,
  reservationSection,
  adminApiParams,
  queryClient,
}: UpdateEventReservationSectionParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  if (!reservationSectionId)
    throw new Error("Reservation Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventReservationSection>
  >(`/events/${eventId}/reservationSections/${reservationSectionId}`, {
    ...reservationSection,
    id: undefined,
    event: undefined,
    eventId: undefined,
    allowedTickets: undefined,
    allowedTiers: undefined,
    _count: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    image: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useUpdateEventReservationSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventReservationSection>>,
      Omit<
        UpdateEventReservationSectionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventReservationSectionParams,
    Awaited<ReturnType<typeof UpdateEventReservationSection>>
  >(UpdateEventReservationSection, options, {
    domain: "events",
    type: "update",
  });
};
