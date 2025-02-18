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
import { BookingCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  booking: BookingCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBooking = async ({
  placeId,
  spaceId,
  booking,
  adminApiParams,
  queryClient,
}: CreateBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Booking>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/bookings`,
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
export const useCreateBooking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBooking>>,
      Omit<CreateBookingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingParams,
    Awaited<ReturnType<typeof CreateBooking>>
  >(CreateBooking, options, {
    domain: "bookings",
    type: "create",
  });
};
