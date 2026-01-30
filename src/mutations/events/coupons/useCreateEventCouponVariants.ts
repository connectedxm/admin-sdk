import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventVariantCouponCreateInputs } from "@src/params";
import { EVENT_COUPONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Coupons
 */
export interface CreateEventCouponVariantsParams extends MutationParams {
  eventId: string;
  couponId: string;
  quantity: EventVariantCouponCreateInputs;
}

/**
 * @category Methods
 * @group Event-Coupons
 */
export const CreateEventCouponVariants = async ({
  eventId,
  couponId,
  quantity,
  adminApiParams,
  queryClient,
}: CreateEventCouponVariantsParams): Promise<ConnectedXMResponse<number>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<number>>(
    `/events/${eventId}/coupons/${couponId}/variants`,
    quantity
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_COUPONS_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Coupons
 */
export const useCreateEventCouponVariants = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventCouponVariants>>,
      Omit<CreateEventCouponVariantsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventCouponVariantsParams,
    Awaited<ReturnType<typeof CreateEventCouponVariants>>
  >(CreateEventCouponVariants, options);
};
