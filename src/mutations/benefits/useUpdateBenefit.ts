import { Benefit, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { BENEFITS_QUERY_KEY, SET_BENEFIT_QUERY_DATA } from "@src/queries";
import { BenefitTranslationUpdateInputs } from "@src/params";

/**
 * Endpoint to update the details of a specific benefit.
 * This function allows for updating the information of a benefit by providing the benefit ID and the new details.
 * It is used in scenarios where benefit information needs to be modified.
 * @name UpdateBenefit
 * @param {string} benefitId (path) The id of the benefit
 * @param {BenefitTranslationUpdateInputs} benefit (body) The details of the benefit to update
 * @version 1.3
 **/
export interface UpdateBenefitParams extends MutationParams {
  benefitId: string;
  benefit: BenefitTranslationUpdateInputs;
}

export const UpdateBenefit = async ({
  benefitId,
  benefit,
  adminApiParams,
  queryClient,
}: UpdateBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  if (!benefitId) throw new Error("Benefit ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Benefit>>(
    `/benefits/${benefitId}`,
    {
      ...benefit,
      id: undefined,
      image: undefined,
      manager: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_BENEFIT_QUERY_DATA(queryClient, [benefitId || data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: BENEFITS_QUERY_KEY() });
  }
  return data;
};

export const useUpdateBenefit = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBenefit>>,
      Omit<UpdateBenefitParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBenefitParams,
    Awaited<ReturnType<typeof UpdateBenefit>>
  >(UpdateBenefit, options, {
    domain: "benefits",
    type: "update",
  });
};
