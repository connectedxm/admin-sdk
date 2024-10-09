import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Coupon } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventCouponCreateInputs } from "@src/params";
import {
  EVENT_COUPONS_QUERY_KEY,
  SET_EVENT_COUPON_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Coupons
 */
export interface CreateEventCouponParams extends MutationParams {
  eventId: string;
  coupon: EventCouponCreateInputs;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
export const CreateEventCoupon = async ({
  eventId,
  coupon,
  adminApiParams,
  queryClient,
}: CreateEventCouponParams): Promise<ConnectedXMResponse<Coupon>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Coupon>>(
    `/events/${eventId}/coupons`,
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
export const useCreateEventCoupon = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventCoupon>>,
      Omit<CreateEventCouponParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventCouponParams,
    Awaited<ReturnType<typeof CreateEventCoupon>>
  >(CreateEventCoupon, options, {
    domain: "events",
    type: "update",
  });
};
