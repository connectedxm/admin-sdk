import { GetAdminAPI } from "@src/AdminAPI";
import { EventReservationSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface UpdateReservationSectionParams extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  reservationSection: EventReservationSection;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const UpdateReservationSection = async ({
  eventId,
  reservationSectionId,
  reservationSection,
  adminApiParams,
  queryClient,
}: UpdateReservationSectionParams): Promise<
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
export const useUpdateReservationSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateReservationSection>>,
      Omit<UpdateReservationSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateReservationSectionParams,
    Awaited<ReturnType<typeof UpdateReservationSection>>
  >(UpdateReservationSection, options);
};
