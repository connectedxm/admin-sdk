import { Booking, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  SET_BOOKING_QUERY_DATA,
  BOOKING_SPACE_BOOKINGS_QUERY_KEY,
  BOOKING_PLACE_BOOKINGS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CancelBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  bookingId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CancelBooking = async ({
  placeId,
  spaceId,
  bookingId,
  adminApiParams,
  queryClient,
}: CancelBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Booking>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/bookings/${bookingId}/cancel`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_PLACE_BOOKINGS_QUERY_KEY(placeId),
    });
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_BOOKINGS_QUERY_KEY(placeId, spaceId),
    });
    SET_BOOKING_QUERY_DATA(queryClient, [bookingId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCancelBooking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelBooking>>,
      Omit<CancelBookingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelBookingParams,
    Awaited<ReturnType<typeof CancelBooking>>
  >(CancelBooking, options);
};
