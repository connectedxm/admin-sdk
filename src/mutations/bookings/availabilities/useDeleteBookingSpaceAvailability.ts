import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  BOOKING_SPACE_AVAILABILITIES_QUERY_KEY,
  BOOKING_SPACE_AVAILABILITY_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceAvailabilityParams extends MutationParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  availabilityId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceAvailability = async ({
  bookingPlaceId,
  bookingSpaceId,
  availabilityId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceAvailabilityParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/availabilities/${availabilityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(
        bookingPlaceId,
        bookingSpaceId
      ),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_AVAILABILITY_QUERY_KEY(
        bookingPlaceId,
        bookingSpaceId,
        availabilityId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceAvailability = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceAvailability>>,
      Omit<
        DeleteBookingSpaceAvailabilityParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceAvailabilityParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceAvailability>>
  >(DeleteBookingSpaceAvailability, options, {
    domain: "events",
    type: "update",
  });
};
