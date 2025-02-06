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
 * Updates the translation of a specific benefit for a given locale.
 * This function allows for updating the translation details of a benefit, identified by its ID, for a specified locale.
 * It is designed to be used in applications where benefit translations need to be managed and updated.
 * @name UpdateBenefitTranslation
 * @param {string} benefitId (path) - The ID of the benefit
 * @param {ISupportedLocale} locale (path) - The locale for which the translation is being updated
 * @param {BenefitTranslationUpdateInputs} benefitTranslation (body) - The translation details to be updated
 * @version 1.3
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
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
  >(UpdateBenefitTranslation, options, {
    domain: "benefits",
    type: "update",
  });
};