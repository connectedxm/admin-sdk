import { ISupportedLocale } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BenefitTranslationUpdateInputs } from "@src/params";
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
  locale: ISupportedLocale;
  benefitTranslation: BenefitTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Benefit-Translation
 */
export const UpdateBenefitTranslation = async ({
  benefitId,
  benefitTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateBenefitTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/benefits/${benefitId}/translations/${locale}`,
    benefitTranslation
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
    ConnectedXMMutationOptions<
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
