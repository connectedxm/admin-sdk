import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY,
  EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations-Locations-Translations
 */
export interface DeleteEventReservationSectionLocationParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

/**
 * @category Methods
 * @group Event-Reservations-Locations-Translations
 */
export const DeleteEventReservationSectionLocation = async ({
  eventId,
  reservationSectionId,
  locationId,
  adminApiParams,
  queryClient,
}: DeleteEventReservationSectionLocationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    queryClient.removeQueries({
      queryKey: EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
        eventId,
        reservationSectionId,
        locationId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations-Locations-Translations
 */
export const useDeleteEventReservationSectionLocation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventReservationSectionLocation>>,
      Omit<
        DeleteEventReservationSectionLocationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventReservationSectionLocationParams,
    Awaited<ReturnType<typeof DeleteEventReservationSectionLocation>>
  >(DeleteEventReservationSectionLocation, options, {
    domain: "events",
    type: "update",
  });
};
