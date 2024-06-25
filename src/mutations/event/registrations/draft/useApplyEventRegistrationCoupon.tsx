import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATIONS_QUERY_KEY,
  EVENT_REGISTRATION_COUNTS_QUERY_KEY,
  SET_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations-Draft
 */
export interface ApplyEventRegistrationCouponParams extends MutationParams {
  eventId: string;
  registrationId: string;
  couponCode: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Draft
 */
export const ApplyEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  couponCode,
  adminApiParams,
  queryClient,
}: ApplyEventRegistrationCouponParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/registrations/${registrationId}/draft/coupon`,
    {
      couponCode,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_COUNTS_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations-Draft
 */
export const useApplyEventRegistrationCoupon = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ApplyEventRegistrationCoupon>>,
      Omit<ApplyEventRegistrationCouponParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApplyEventRegistrationCouponParams,
    Awaited<ReturnType<typeof ApplyEventRegistrationCoupon>>
  >(ApplyEventRegistrationCoupon, options);
};
