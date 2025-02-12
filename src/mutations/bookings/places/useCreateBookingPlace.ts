import { BookingPlace, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingPlaceCreateInputs } from "@src/params";
import {
  BOOKING_PLACES_QUERY_KEY,
  SET_BOOKING_PLACE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingPlaceParams extends MutationParams {
  bookingPlace: BookingPlaceCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingPlace = async ({
  bookingPlace,
  adminApiParams,
  queryClient,
}: CreateBookingPlaceParams): Promise<ConnectedXMResponse<BookingPlace>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<BookingPlace>>(
    `/bookingPlace`,
    bookingPlace
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_PLACE_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: BOOKING_PLACES_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCreateBookingPlace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingPlace>>,
      Omit<CreateBookingPlaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingPlaceParams,
    Awaited<ReturnType<typeof CreateBookingPlace>>
  >(CreateBookingPlace, options, {
    domain: "bookings",
    type: "create",
  });
};
