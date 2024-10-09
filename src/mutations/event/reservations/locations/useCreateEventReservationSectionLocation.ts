import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventReservationSectionLocation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventReservationSectionLocationCreateInputs } from "@src/params";
import {
  EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations
 */
export interface CreateEventReservationSectionLocationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  location: EventReservationSectionLocationCreateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations
 */
export const CreateEventReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  location,
  adminApiParams,
  queryClient,
}: CreateEventReservationSectionLocationParams): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations`,
    location
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Locations
 */
export const useCreateEventReservationSectionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventReservationSectionLocation>>,
      Omit<
        CreateEventReservationSectionLocationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventReservationSectionLocationParams,
    Awaited<ReturnType<typeof CreateEventReservationSectionLocation>>
  >(CreateEventReservationSectionLocation, options, {
    domain: "events",
    type: "update",
  });
};
