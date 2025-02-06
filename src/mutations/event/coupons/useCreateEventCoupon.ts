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
 * Endpoint to create a new event coupon.
 * This function allows the creation of a coupon for a specific event by providing the event ID and coupon details.
 * It is designed to be used in applications where event management and coupon distribution are required.
 * @name CreateEventCoupon
 * @param {string} eventId (path) The id of the event
 * @param {EventCouponCreateInputs} coupon (body) The coupon details to be created
 * @version 1.2
 **/
export interface CreateEventCouponParams extends MutationParams {
  eventId: string;
  coupon: EventCouponCreateInputs;
}

export const CreateEventCoupon = async ({
  eventId,
  coupon,
  adminApiParams,
  queryClient,
}: CreateEventCouponParams): Promise<ConnectedXMResponse<Coupon>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Coupon>>(
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
