import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Coupon } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventCouponUpdateInputs } from "@src/params";
import {
  EVENT_COUPONS_QUERY_KEY,
  SET_EVENT_COUPON_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update a coupon for a specific event.
 * This function allows updating the details of a coupon associated with a particular event.
 * It is designed to be used in applications where event management and coupon updates are required.
 * @name UpdateEventCoupon
 * @param {string} eventId - The id of the event
 * @param {string} couponId - The id of the coupon
 * @param {EventCouponUpdateInputs} coupon - The coupon update inputs
 * @version 1.2
 **/
export interface UpdateEventCouponParams extends MutationParams {
  eventId: string;
  couponId: string;
  coupon: EventCouponUpdateInputs;
}

export const UpdateEventCoupon = async ({
  eventId,
  couponId,
  coupon,
  adminApiParams,
  queryClient,
}: UpdateEventCouponParams): Promise<ConnectedXMResponse<Coupon>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Coupon>>(
    `/events/${eventId}/coupons/${couponId}`,
    coupon
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_COUPONS_QUERY_KEY(eventId),
    });
    SET_EVENT_COUPON_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

export const useUpdateEventCoupon = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventCoupon>>,
      Omit<UpdateEventCouponParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventCouponParams,
    Awaited<ReturnType<typeof UpdateEventCoupon>>
  >(UpdateEventCoupon, options, {
    domain: "events",
    type: "update",
  });
};