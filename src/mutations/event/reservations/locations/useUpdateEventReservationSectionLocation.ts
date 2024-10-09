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
import { EventReservationSectionLocationUpdateInputs } from "@src/params";
import {
  EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations-Translations
 */
export interface UpdateEventReservationSectionLocationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  location: EventReservationSectionLocationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const UpdateEventReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
  location,
  adminApiParams,
  queryClient,
}: UpdateEventReservationSectionLocationParams): Promise<
  ConnectedXMResponse<EventReservationSectionLocation>
> => {
  if (!reservationSectionId)
    throw new Error("Reservation Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventReservationSectionLocation>
  >(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`,
    {
      ...location,
      id: undefined,
      eventId: undefined,
      reservationSectionId: undefined,
      reservationSection: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
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
      [eventId, reservationSectionId, locationId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Locations-Translations
 */
export const useUpdateEventReservationSectionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventReservationSectionLocation>>,
      Omit<
        UpdateEventReservationSectionLocationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventReservationSectionLocationParams,
    Awaited<ReturnType<typeof UpdateEventReservationSectionLocation>>
  >(UpdateEventReservationSectionLocation, options, {
    domain: "events",
    type: "update",
  });
};
