import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  BOOKING_PLACES_QUERY_KEY,
  BOOKING_PLACE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingPlaceParams extends MutationParams {
  placeId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingPlace = async ({
  placeId,
  adminApiParams,
  queryClient,
}: DeleteBookingPlaceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BOOKING_PLACES_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: BOOKING_PLACE_QUERY_KEY(placeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingPlace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingPlace>>,
      Omit<DeleteBookingPlaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingPlaceParams,
    Awaited<ReturnType<typeof DeleteBookingPlace>>
  >(DeleteBookingPlace, options);
};
