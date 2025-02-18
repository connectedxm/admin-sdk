import { Booking, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { SET_BOOKING_QUERY_DATA } from "@src/queries/bookings/useGetBooking";
import {
  BOOKING_PLACE_BOOKINGS_QUERY_KEY,
  BOOKING_SPACE_BOOKINGS_QUERY_KEY,
} from "@src/queries";
import { BookingUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  bookingId: string;
  booking: BookingUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBooking = async ({
  placeId,
  spaceId,
  bookingId,
  booking,
  adminApiParams,
  queryClient,
}: UpdateBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Booking>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/bookings/${bookingId}`,
    booking
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_BOOKINGS_QUERY_KEY(placeId),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_BOOKINGS_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBooking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBooking>>,
      Omit<UpdateBookingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingParams,
    Awaited<ReturnType<typeof UpdateBooking>>
  >(UpdateBooking, options, {
    domain: "bookings",
    type: "update",
  });
};
