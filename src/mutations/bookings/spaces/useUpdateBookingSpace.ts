import { BookingSpace, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceUpdateInputs } from "@src/params";
import {
  BOOKING_SPACES_QUERY_KEY,
  SET_BOOKING_SPACE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceParams extends MutationParams {
  placeId: string;
  spaceId: string;
  bookingSpace: BookingSpaceUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpace = async ({
  placeId,
  spaceId,
  bookingSpace,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceParams): Promise<ConnectedXMResponse<BookingSpace>> => {
  if (!placeId) throw new Error("BookingPlace ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<BookingSpace>>(
    `/bookings/places/${placeId}/spaces/${spaceId}`,
    {
      ...bookingSpace,
      id: undefined,
      image: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_BOOKING_SPACE_QUERY_DATA(
      queryClient,
      [placeId, spaceId || data?.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACES_QUERY_KEY(placeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpace>>,
      Omit<UpdateBookingSpaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceParams,
    Awaited<ReturnType<typeof UpdateBookingSpace>>
  >(UpdateBookingSpace, options, {
    domain: "bookings",
    type: "update",
  });
};
