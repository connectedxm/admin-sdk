import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BENEFITS_QUERY_KEY, BENEFIT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Benefit
 */
export interface DeleteBenefitParams extends MutationParams {
  benefitId: string;
}

/**
 * @category Methods
 * @group Benefit
 */
export const DeleteBenefit = async ({
  benefitId,
  adminApiParams,
  queryClient,
}: DeleteBenefitParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/benefits/${benefitId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: BENEFIT_QUERY_KEY(benefitId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Benefit
 */
export const useDeleteBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBenefit>>,
      Omit<DeleteBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBenefitParams,
    Awaited<ReturnType<typeof DeleteBenefit>>
  >(DeleteBenefit, options);
};
