import { BookingSpaceAvailability, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceAvailabilityCreateInputs } from "@src/params";
import {
  BOOKING_SPACE_AVAILABILITIES_QUERY_KEY,
  SET_BOOKING_SPACE_AVAILABILITY_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceAvailabilityParams extends MutationParams {
  placeId: string;
  spaceId: string;
  availability: BookingSpaceAvailabilityCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceAvailability = async ({
  placeId,
  spaceId,
  availability,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceAvailabilityParams): Promise<
  ConnectedXMResponse<BookingSpaceAvailability>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceAvailability>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/availabilities`,
    availability
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_AVAILABILITY_QUERY_DATA(
      queryClient,
      [placeId, spaceId, data?.data.id],
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
export const useCreateBookingSpaceAvailability = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpaceAvailability>>,
      Omit<
        CreateBookingSpaceAvailabilityParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceAvailabilityParams,
    Awaited<ReturnType<typeof CreateBookingSpaceAvailability>>
  >(CreateBookingSpaceAvailability, options);
};
