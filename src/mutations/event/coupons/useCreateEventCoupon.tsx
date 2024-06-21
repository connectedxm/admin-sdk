import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Coupon } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_COUPON_QUERY_DATA } from "@context/queries/events/coupons/useGetEventCoupon";
import { EVENT_COUPONS_QUERY_KEY } from "@context/queries/events/coupons/useGetEventCoupons";

interface CreateEventCouponParams {
  eventId: string;
  coupon: Coupon;
}

export const CreateEventCoupon = async ({
  eventId,
  coupon,
}: CreateEventCouponParams): Promise<ConnectedXMResponse<Coupon>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/coupons`, coupon);
  return data;
};

export const useCreateEventCoupon = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Coupon>(
    (coupon: Coupon) => CreateEventCoupon({ eventId, coupon }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventCoupon>>) => {
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

export default useCreateEventCoupon;
