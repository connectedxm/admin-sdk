import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_REGISTRATION_QUERY_DATA } from "@context/queries/events/registrations/useGetEventRegistration";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrations";
import { EVENT_REGISTRATION_COUNTS_QUERY_KEY } from "@context/queries/events/registrations/useGetEventRegistrationCounts";
import { Registration } from "@interfaces";

interface RemoveEventRegistrationCouponParams {
  eventId: string;
  registrationId: string;
}

export const RemoveEventRegistrationCoupon = async ({
  eventId,
  registrationId,
}: RemoveEventRegistrationCouponParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}/draft/coupon`
  );
  return data;
};

export const useRemoveEventRegistrationCoupon = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<RemoveEventRegistrationCouponParams, "eventId" | "registrationId">
  >(
    (params) =>
      RemoveEventRegistrationCoupon({ eventId, registrationId, ...params }),
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

export default useRemoveEventRegistrationCoupon;
