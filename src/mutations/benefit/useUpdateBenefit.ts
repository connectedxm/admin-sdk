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
 * @category Params
 * @group Benefit
 */
export interface UpdateBenefitParams extends MutationParams {
  benefitId: string;
  benefit: BenefitTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Benefit
 */
export const UpdateBenefit = async ({
  benefitId,
  benefit,
  adminApiParams,
  queryClient,
}: UpdateBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  if (!benefitId) throw new Error("Benefit ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Benefit>>(
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

/**
 * @category Mutations
 * @group Benefit
 */
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
