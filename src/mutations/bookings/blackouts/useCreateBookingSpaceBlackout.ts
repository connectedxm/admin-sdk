import { BookingSpaceBlackout, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceBlackoutCreateInputs } from "@src/params";
import {
  BOOKING_SPACE_BLACKOUTS_QUERY_KEY,
  SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceBlackoutParams extends MutationParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
  blackout: BookingSpaceBlackoutCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceBlackout = async ({
  bookingPlaceId,
  bookingSpaceId,
  blackout,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceBlackoutParams): Promise<
  ConnectedXMResponse<BookingSpaceBlackout>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceBlackout>
  >(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/blackouts`,
    blackout
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA(
      queryClient,
      [bookingPlaceId, bookingSpaceId, data?.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_BLACKOUTS_QUERY_KEY(
        bookingPlaceId,
        bookingSpaceId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCreateBookingSpaceBlackout = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpaceBlackout>>,
      Omit<CreateBookingSpaceBlackoutParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceBlackoutParams,
    Awaited<ReturnType<typeof CreateBookingSpaceBlackout>>
  >(CreateBookingSpaceBlackout, options, {
    domain: "events",
    type: "update",
  });
};
