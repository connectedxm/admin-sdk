import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  BOOKING_SPACES_QUERY_KEY,
  BOOKING_SPACE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceParams extends MutationParams {
  placeId: string;
  spaceId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpace = async ({
  placeId,
  spaceId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACES_QUERY_KEY(placeId),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpace = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpace>>,
      Omit<DeleteBookingSpaceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBookingSpaceParams,
    Awaited<ReturnType<typeof DeleteBookingSpace>>
  >(DeleteBookingSpace, options);
};
