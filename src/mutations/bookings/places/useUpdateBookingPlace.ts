import { BookingPlace, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingPlaceUpdateInputs } from "@src/params";
import {
  BOOKING_PLACES_QUERY_KEY,
  SET_BOOKING_PLACE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingPlaceParams extends MutationParams {
  placeId: string;
  bookingPlace: BookingPlaceUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingPlace = async ({
  placeId,
  bookingPlace,
  adminApiParams,
  queryClient,
}: UpdateBookingPlaceParams): Promise<ConnectedXMResponse<BookingPlace>> => {
  if (!placeId) throw new Error("BookingPlace ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<BookingPlace>>(
    `/bookings/places/${placeId}`,
    {
      ...bookingPlace,
      id: undefined,
      image: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_PLACE_QUERY_DATA(queryClient, [placeId || data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: BOOKING_PLACES_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingPlace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingPlace>>,
      Omit<UpdateBookingPlaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingPlaceParams,
    Awaited<ReturnType<typeof UpdateBookingPlace>>
  >(UpdateBookingPlace, options, {
    domain: "bookings",
    type: "update",
  });
};
