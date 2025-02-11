import { BookingSpace, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceCreateInputs } from "@src/params";
import {
  BOOKING_SPACES_QUERY_KEY,
  SET_BOOKING_SPACE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceParams extends MutationParams {
  bookingPlaceId: string;
  bookingSpace: BookingSpaceCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpace = async ({
  bookingPlaceId,
  bookingSpace,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceParams): Promise<ConnectedXMResponse<BookingSpace>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<BookingSpace>>(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces`,
    bookingSpace
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_QUERY_DATA(
      queryClient,
      [bookingPlaceId, data?.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACES_QUERY_KEY(bookingPlaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCreateBookingSpace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpace>>,
      Omit<CreateBookingSpaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceParams,
    Awaited<ReturnType<typeof CreateBookingSpace>>
  >(CreateBookingSpace, options, {
    domain: "events",
    type: "create",
  });
};
