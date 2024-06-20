import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Benefit
 */
export interface CreateBenefitParams extends MutationParams {
  benefit: Benefit;
}

/**
 * @category Methods
 * @group Benefit
 */
export const CreateBenefit = async ({
  benefit,
  adminApiParams,
  queryClient,
}: CreateBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(`/benefits`, benefit);

  if (queryClient && data.status === "ok") {
    SET_BENEFIT_QUERY_DATA(queryClient, [data.id], data);
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Benefit
 */
export const useCreateBenefit = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateBenefit>>,
      Omit<CreateBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBenefitParams,
    Awaited<ReturnType<typeof CreateBenefit>>
  >(CreateBenefit, options);
};
