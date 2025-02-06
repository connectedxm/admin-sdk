import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_COUPONS_QUERY_KEY, EVENT_COUPON_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a coupon from a specific event and invalidate related queries.
 * This function allows the removal of a coupon associated with a particular event, ensuring that any cached queries related to the event's coupons are invalidated.
 * It is useful in scenarios where coupon data needs to be updated or removed from the event's context.
 * @name DeleteEventCoupon
 * @param {string} eventId (path) The id of the event
 * @param {string} couponId (path) The id of the coupon
 * @version 1.3
 **/

export interface DeleteEventCouponParams extends MutationParams {
  eventId: string;
  couponId: string;
}

export const DeleteEventCoupon = async ({
  eventId,
  couponId,
  adminApiParams,
  queryClient,
}: DeleteEventCouponParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/coupons/${couponId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_COUPONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_COUPON_QUERY_KEY(eventId, couponId),
    });
  }
  return data;
};

export const useDeleteEventCoupon = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventCoupon>>,
      Omit<DeleteEventCouponParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventCouponParams,
    Awaited<ReturnType<typeof DeleteEventCoupon>>
  >(DeleteEventCoupon, options, {
    domain: "events",
    type: "update",
  });
};
