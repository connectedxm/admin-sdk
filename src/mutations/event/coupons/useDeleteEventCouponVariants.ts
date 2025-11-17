import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_COUPONS_QUERY_KEY,
  EVENT_COUPON_VARIANTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Coupons
 */
export interface DeleteEventCouponVariantsParams extends MutationParams {
  eventId: string;
  couponId: string;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
export const DeleteEventCouponVariants = async ({
  eventId,
  couponId,
  adminApiParams,
  queryClient,
}: DeleteEventCouponVariantsParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/coupons/${couponId}/variants`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_COUPONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_COUPON_VARIANTS_QUERY_KEY(eventId, couponId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Coupons
 */
export const useDeleteEventCouponVariants = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventCouponVariants>>,
      Omit<DeleteEventCouponVariantsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventCouponVariantsParams,
    Awaited<ReturnType<typeof DeleteEventCouponVariants>>
  >(DeleteEventCouponVariants, options);
};
