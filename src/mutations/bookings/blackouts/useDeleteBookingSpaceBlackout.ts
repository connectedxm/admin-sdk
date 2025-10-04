import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  BOOKING_SPACE_BLACKOUTS_QUERY_KEY,
  BOOKING_SPACE_BLACKOUT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceBlackoutParams extends MutationParams {
  placeId: string;
  spaceId: string;
  blackoutId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceBlackout = async ({
  placeId,
  spaceId,
  blackoutId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceBlackoutParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/blackouts/${blackoutId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_BLACKOUTS_QUERY_KEY(placeId, spaceId),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_BLACKOUT_QUERY_KEY(placeId, spaceId, blackoutId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceBlackout = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceBlackout>>,
      Omit<DeleteBookingSpaceBlackoutParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceBlackoutParams,
    Awaited<ReturnType<typeof DeleteBookingSpaceBlackout>>
  >(DeleteBookingSpaceBlackout, options);
};
