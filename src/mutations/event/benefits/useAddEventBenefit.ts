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
export interface AddEventBenefitParams extends MutationParams {
  benefitId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Event-Benefits
 */
export const AddEventBenefit = async ({
  benefitId,
  eventId,
  adminApiParams,
  queryClient,
}: AddEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Benefit>>(
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
export const useAddEventBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventBenefit>>,
      Omit<AddEventBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventBenefitParams,
    Awaited<ReturnType<typeof AddEventBenefit>>
  >(AddEventBenefit, options, {
    domain: "events",
    type: "update",
  });
};
