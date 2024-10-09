import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventReservationSectionCreateInputs } from "@src/params";
import {
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface CreateEventReservationSectionParams extends MutationParams {
  eventId: string;
  reservationSection: EventReservationSectionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const CreateEventReservationSection = async ({
  eventId,
  reservationSection,
  adminApiParams,
  queryClient,
}: CreateEventReservationSectionParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections`,
    reservationSection
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useCreateEventReservationSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventReservationSection>>,
      Omit<
        CreateEventReservationSectionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventReservationSectionParams,
    Awaited<ReturnType<typeof CreateEventReservationSection>>
  >(CreateEventReservationSection, options, {
    domain: "events",
    type: "update",
  });
};
