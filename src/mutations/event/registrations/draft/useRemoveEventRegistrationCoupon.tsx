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
export interface RemoveEventRegistrationCouponParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

/**
 * @category Methods
 * @group Event-Registrations-Draft
 */
export const RemoveEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  adminApiParams,
  queryClient,
}: RemoveEventRegistrationCouponParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete(
    `/events/${eventId}/registrations/${registrationId}/draft/coupon`
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
export const useRemoveEventRegistrationCoupon = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventRegistrationCoupon>>,
      Omit<
        RemoveEventRegistrationCouponParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventRegistrationCouponParams,
    Awaited<ReturnType<typeof RemoveEventRegistrationCoupon>>
  >(RemoveEventRegistrationCoupon, options);
};
