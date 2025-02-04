import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BENEFITS_QUERY_KEY, BENEFIT_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific benefit by its ID.
 * This function allows the removal of a benefit from the system, ensuring that all related queries are invalidated and removed.
 * It is designed for use in administrative applications where benefit management is required.
 * @name DeleteBenefit
 * @param {string} benefitId - The ID of the benefit to be deleted
 * @version 1.2
 **/
export interface DeleteBenefitParams extends MutationParams {
  benefitId: string;
}

export const DeleteBenefit = async ({
  benefitId,
  adminApiParams,
  queryClient,
}: DeleteBenefitParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/benefits/${benefitId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: BENEFIT_QUERY_KEY(benefitId) });
  }
  return data;
};

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
  >(DeleteBenefit, options, {
    domain: "benefits",
    type: "del",
  });
};