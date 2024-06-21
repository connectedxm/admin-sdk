import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Coupon } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_COUPONS_QUERY_KEY } from "@context/queries/events/coupons/useGetEventCoupons";
import { SET_EVENT_COUPON_QUERY_DATA } from "@context/queries/events/coupons/useGetEventCoupon";

interface UpdateEventCouponParams {
  eventId: string;
  couponId: string;
  coupon: Coupon;
}

export const UpdateEventCoupon = async ({
  eventId,
  couponId,
  coupon,
}: UpdateEventCouponParams): Promise<ConnectedXMResponse<Coupon>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/coupons/${couponId}`,
    coupon
  );
  return data;
};

export const useUpdateEventCoupon = (eventId: string, couponId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Coupon>(
    (coupon: Coupon) => UpdateEventCoupon({ eventId, couponId, coupon }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventCoupon>>) => {
        queryClient.invalidateQueries(EVENT_COUPONS_QUERY_KEY(eventId));
        SET_EVENT_COUPON_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventCoupon;
