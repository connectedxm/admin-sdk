import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Registration } from "@interfaces";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrations";
import { EVENT_REGISTRATION_COUNTS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrationCounts";
import { SET_EVENT_REGISTRATION_QUERY_DATA } from "@context/queries/events/registrations/useGetEventRegistration";

interface ApplyEventRegistrationCouponParams {
  eventId: string;
  registrationId: string;
  couponCode: string;
}

export const ApplyEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  couponCode,
}: ApplyEventRegistrationCouponParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/draft/coupon`,
    {
      couponCode,
    }
  );
  return data;
};

export const useApplyEventRegistrationCoupon = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<ApplyEventRegistrationCouponParams, "eventId" | "registrationId">
  >(
    (params) =>
      ApplyEventRegistrationCoupon({ eventId, registrationId, ...params }),
    {
      onSuccess: (response: ConnectedXMResponse<Registration>) => {
        queryClient.invalidateQueries(EVENT_REGISTRATIONS_QUERY_KEY(eventId));
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId)
        );
        SET_EVENT_REGISTRATION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useApplyEventRegistrationCoupon;
