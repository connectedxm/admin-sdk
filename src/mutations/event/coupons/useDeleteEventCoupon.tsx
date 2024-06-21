import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Event } from "@interfaces";
import { EVENT_COUPONS_QUERY_KEY } from "@context/queries/events/coupons/useGetEventCoupons";
import { EVENT_COUPON_QUERY_KEY } from "@context/queries/events/coupons/useGetEventCoupon";

interface DeleteEventCouponParams {
  eventId: string;
  couponId: string;
}

export const DeleteEventCoupon = async ({
  eventId,
  couponId,
}: DeleteEventCouponParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/coupons/${couponId}`
  );
  return data;
};

export const useDeleteEventCoupon = (eventId: string, couponId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteEventCoupon({ eventId, couponId }), {
    onSuccess: async (
      _response: Awaited<ReturnType<typeof DeleteEventCoupon>>
    ) => {
      await router.push(`/events/${eventId}/coupons`);
      queryClient.invalidateQueries(EVENT_COUPONS_QUERY_KEY(eventId));
      queryClient.removeQueries(EVENT_COUPON_QUERY_KEY(eventId, couponId));
    },
  });
};

export default useDeleteEventCoupon;
