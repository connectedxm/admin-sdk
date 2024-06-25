import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  EventReservationSectionLocation,
} from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_LOCATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations
 */
export interface CreateReservationSectionLocationParams extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  location: EventReservationSectionLocation;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations
 */
export const CreateReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  location,
  adminApiParams,
  queryClient,
}: CreateReservationSectionLocationParams): Promise<
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
export const useCreateReservationSectionLocation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateReservationSectionLocation>>,
      Omit<
        CreateReservationSectionLocationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateReservationSectionLocationParams,
    Awaited<ReturnType<typeof CreateReservationSectionLocation>>
  >(CreateReservationSectionLocation, options);
};
