import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Coupon } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventVariantCouponSyncInputs } from "@src/params";
import {
  EVENT_COUPONS_QUERY_KEY,
  SET_EVENT_COUPON_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Coupons
 */
export interface SyncEventCouponToVariantsParams extends MutationParams {
  eventId: string;
  couponId: string;
  fields: EventVariantCouponSyncInputs;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
export const SyncEventCouponToVariants = async ({
  eventId,
  couponId,
  fields,
  adminApiParams,
  queryClient,
}: SyncEventCouponToVariantsParams): Promise<ConnectedXMResponse<Coupon>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Coupon>>(
    `/events/${eventId}/coupons/${couponId}/sync-variants`,
    { fields }
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
export const useSyncEventCouponToVariants = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SyncEventCouponToVariants>>,
      Omit<SyncEventCouponToVariantsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SyncEventCouponToVariantsParams,
    Awaited<ReturnType<typeof SyncEventCouponToVariants>>
  >(SyncEventCouponToVariants, options);
};
