import { GetAdminAPI } from "@src/AdminAPI";
import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Benefits
 */
export interface RemoveEventBenefitParams extends MutationParams {
  benefitId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Event-Benefits
 */
export const RemoveEventBenefit = async ({
  benefitId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Benefit>>(
    `/events/${eventId}/benefits/${benefitId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
    SET_BENEFIT_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Benefits
 */
export const useRemoveEventBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventBenefit>>,
      Omit<RemoveEventBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventBenefitParams,
    Awaited<ReturnType<typeof RemoveEventBenefit>>
  >(RemoveEventBenefit, options, {
    domain: "events",
    type: "update",
  });
};
