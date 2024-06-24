import { BenefitTranslation } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BENEFIT_TRANSLATIONS_QUERY_KEY,
  SET_BENEFIT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Benefit-Translation
 */
export interface UpdateBenefitTranslationParams extends MutationParams {
  benefitId: string;
  benefitTranslation: BenefitTranslation;
}

/**
 * @category Methods
 * @group Benefit-Translation
 */
export const UpdateBenefitTranslation = async ({
  benefitId,
  benefitTranslation,
  adminApiParams,
  queryClient,
}: UpdateBenefitTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = benefitTranslation;

  const { data } = await connectedXM.put(
    `/benefits/${benefitId}/translations/${locale}`,
    body
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId),
    });
    SET_BENEFIT_TRANSLATION_QUERY_DATA(
      queryClient,
      [benefitId, data?.id],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Benefit-Translation
 */
export const useUpdateBenefitTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateBenefitTranslation>>,
      Omit<UpdateBenefitTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBenefitTranslationParams,
    Awaited<ReturnType<typeof UpdateBenefitTranslation>>
  >(UpdateBenefitTranslation, options);
};
