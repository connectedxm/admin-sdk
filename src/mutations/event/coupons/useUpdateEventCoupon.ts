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
 * @category Params
 * @group Event-Coupons
 */
export interface UpdateEventCouponParams extends MutationParams {
  eventId: string;
  couponId: string;
  coupon: EventCouponUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
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

/**
 * @category Mutations
 * @group Event-Coupons
 */
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
