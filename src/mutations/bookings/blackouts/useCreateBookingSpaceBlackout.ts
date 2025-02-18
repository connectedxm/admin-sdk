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
  placeId: string;
  spaceId: string;
  blackout: BookingSpaceBlackoutCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceBlackout = async ({
  placeId,
  spaceId,
  blackout,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceBlackoutParams): Promise<
  ConnectedXMResponse<BookingSpaceBlackout>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceBlackout>
  >(`/bookings/places/${placeId}/spaces/${spaceId}/blackouts`, blackout);

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_BLACKOUT_QUERY_DATA(
      queryClient,
      [placeId, spaceId, data?.data.id],
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
    domain: "bookings",
    type: "update",
  });
};
