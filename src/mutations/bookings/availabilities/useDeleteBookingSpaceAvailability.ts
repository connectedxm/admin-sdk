import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  BOOKING_SPACE_AVAILABILITIES_QUERY_KEY,
  BOOKING_SPACE_AVAILABILITY_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceAvailabilityParams extends MutationParams {
  placeId: string;
  spaceId: string;
  availabilityId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceAvailability = async ({
  placeId,
  spaceId,
  availabilityId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceAvailabilityParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/availabilities/${availabilityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_AVAILABILITIES_QUERY_KEY(placeId, spaceId),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_AVAILABILITY_QUERY_KEY(
        placeId,
        spaceId,
        availabilityId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceAvailability = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceAvailability>>,
      Omit<
        DeleteBookingSpaceAvailabilityParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceAvailabilityParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceAvailability>>
  >(DeleteBookingSpaceAvailability, options, {
    domain: "bookings",
    type: "update",
  });
};
