import { BookingSpaceAvailability, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceAvailabilityUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_AVAILABILITIES_QUERY_KEY,
  SET_BOOKING_SPACE_AVAILABILITY_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceAvailabilityParams extends MutationParams {
  placeId: string;
  spaceId: string;
  availabilityId: string;
  availability: BookingSpaceAvailabilityUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceAvailability = async ({
  placeId,
  spaceId,
  availabilityId,
  availability,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceAvailabilityParams): Promise<
  ConnectedXMResponse<BookingSpaceAvailability>
> => {
  if (!placeId) throw new Error("Booking Place ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceAvailability>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/availabilities/${availabilityId}`,
    {
      ...availability,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_AVAILABILITY_QUERY_DATA(
      queryClient,
      [placeId, spaceId, availabilityId || data?.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceAvailability = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceAvailability>>,
      Omit<
        UpdateBookingSpaceAvailabilityParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceAvailabilityParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceAvailability>>
  >(UpdateBookingSpaceAvailability, options);
};
