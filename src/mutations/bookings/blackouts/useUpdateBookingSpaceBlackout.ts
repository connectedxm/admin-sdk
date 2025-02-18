import { BookingSpaceBlackout, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceBlackoutUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_BLACKOUTS_QUERY_KEY,
  SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceBlackoutParams extends MutationParams {
  placeId: string;
  spaceId: string;
  blackoutId: string;
  blackout: BookingSpaceBlackoutUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceBlackout = async ({
  placeId,
  spaceId,
  blackoutId,
  blackout,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceBlackoutParams): Promise<
  ConnectedXMResponse<BookingSpaceBlackout>
> => {
  if (!placeId) throw new Error("Booking Place ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceBlackout>
  >(`/bookings/places/${placeId}/spaces/${spaceId}/blackouts/${blackoutId}`, {
    ...blackout,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA(
      queryClient,
      [placeId, spaceId, blackoutId || data?.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_BLACKOUTS_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceBlackout = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceBlackout>>,
      Omit<UpdateBookingSpaceBlackoutParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceBlackoutParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceBlackout>>
  >(UpdateBookingSpaceBlackout, options, {
    domain: "bookings",
    type: "update",
  });
};
