import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BOOKING_QUERY_KEY } from "@src/queries/bookings/useGetBooking";
import {
  BOOKING_PLACE_BOOKINGS_QUERY_KEY,
  BOOKING_SPACE_BOOKINGS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  bookingId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBooking = async ({
  placeId,
  spaceId,
  bookingId,
  adminApiParams,
  queryClient,
}: DeleteBookingParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/bookings/${bookingId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({ queryKey: BOOKING_QUERY_KEY(bookingId) });
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
export const useDeleteBooking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBooking>>,
      Omit<DeleteBookingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingParams,
    Awaited<ReturnType<typeof DeleteBooking>>
  >(DeleteBooking, options, {
    domain: "bookings",
    type: "del",
  });
};
