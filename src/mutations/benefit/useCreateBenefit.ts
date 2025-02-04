import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";
import { BenefitCreateInputs } from "@src/params";

/**
 * Endpoint to create a new benefit within the system.
 * This function allows the creation of a benefit by providing the necessary input parameters.
 * It interacts with the admin API to post the benefit data and updates the query cache upon successful creation.
 * @name CreateBenefit
 * @param {BenefitCreateInputs} benefit - The inputs required to create a benefit
 * @version 1.2
 **/
export interface CreateBenefitParams extends MutationParams {
  benefit: BenefitCreateInputs;
}

export const CreateBenefit = async ({
  benefit,
  adminApiParams,
  queryClient,
}: CreateBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Benefit>>(
    `/benefits`,
    benefit
  );

  if (queryClient && data.status === "ok") {
    SET_BENEFIT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
  }
  return data;
};

export const useCreateBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBenefit>>,
      Omit<CreateBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBenefitParams,
    Awaited<ReturnType<typeof CreateBenefit>>
  >(CreateBenefit, options, {
    domain: "benefits",
    type: "create",
  });
};