import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_COUPONS_QUERY_KEY, EVENT_COUPON_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Coupons
 */
export interface DeleteEventCouponParams extends MutationParams {
  eventId: string;
  couponId: string;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
export const DeleteEventCoupon = async ({
  eventId,
  couponId,
  adminApiParams,
  queryClient,
}: DeleteEventCouponParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group Event-Coupons
 */
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
